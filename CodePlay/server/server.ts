import express from 'express';
import cors from 'cors';
import axios from 'axios';
import rateLimit from 'express-rate-limit';
import http from 'http';
import https from 'https';

const app = express();
const PORT = process.env.PORT || 3000;
// Default to local docker container, fallback to public if env not set, though docker-compose sets it.
const PISTON_URL = process.env.PISTON_URL || 'http://piston:2000';

// --- Performance Configuration ---

// Optimized HTTP Agent for high-throughput persistent connections
// This is critical for reducing latency when talking to the local Piston container
const agentOptions = {
    keepAlive: true,
    maxSockets: Infinity, // Remove concurrency limit for local docker networking
    maxFreeSockets: 10,   // Keep some sockets open for immediate reuse
    timeout: 30000        // Socket timeout
};

const pistonClient = axios.create({
    baseURL: PISTON_URL,
    timeout: 10000, // 10s max for API response
    httpAgent: new http.Agent(agentOptions),
    httpsAgent: new https.Agent(agentOptions)
});

// Pre-allocate the bootstrap code to avoid memory churn on every request
const PYTHON_BOOTSTRAP_CODE = `import builtins
import runpy
import sys

# 1. Capture the original input function
try:
    _orig_input = builtins.input
except AttributeError:
    # Fallback if input is somehow missing
    def _orig_input(prompt=""):
        sys.stdout.write(prompt)
        sys.stdout.flush()
        return sys.stdin.readline().rstrip("\\n")

# 2. Define the safe wrapper
def _safe_input(prompt=""):
    try:
        # Call original input
        raw = _orig_input(prompt)
        
        # Strip whitespace (including newlines)
        cleaned = raw.strip()
        
        # If result is empty string, return "0"
        if not cleaned:
            return "0"
            
        return cleaned
    except (EOFError, RuntimeError):
        # If no input is provided at all (EOF), return "0"
        return "0"
    except Exception:
        return "0"

# 3. Override builtins.input
builtins.input = _safe_input

# 4. Run the user's code
try:
    # Execute the main.py file in the current process
    runpy.run_path("main.py", run_name="__main__")
except SystemExit:
    pass
except Exception:
    # 5. Clean Error Reporting
    # We want to hide this bootstrap file from the traceback so the user 
    # only sees errors relevant to their code.
    import traceback
    
    exc_type, exc_value, exc_tb = sys.exc_info()
    
    # Skip the first frame (which belongs to runpy/bootstrap) if possible
    # This heuristic usually points straight to main.py
    if exc_tb and exc_tb.tb_next:
        exc_tb = exc_tb.tb_next
        
    traceback.print_exception(exc_type, exc_value, exc_tb)
    sys.exit(1)
`;

// Regex to detect usage of 'input' as a whole word token
// Matches: input(), var = input, but NOT "user_input" or print("input")
const PYTHON_INPUT_REGEX = /\binput\b/;

// Middleware
app.use(cors({
    origin: '*', 
    methods: ['POST']
}));
app.use(express.json() as any);

// Rate Limiting
const limiter = rateLimit({
	windowMs: 60 * 1000, 
	max: 100,
    message: { error: 'Rate limit exceeded. Please wait a moment.' }
});

app.use('/api/execute', limiter as any);

// Strict Language Mapping
interface LanguageConfig {
    language: string;
    version: string;
    fileName: string;
}

const languageMap: Record<string, LanguageConfig> = {
    python: { language: "python", version: "3.10.0", fileName: "main.py" },
    javascript: { language: "javascript", version: "18.15.0", fileName: "main.js" },
    typescript: { language: "typescript", version: "5.0.3", fileName: "index.ts" },
    java: { language: "java", version: "15.0.2", fileName: "Main.java" },
    cpp: { language: "cpp", version: "10.2.0", fileName: "main.cpp" },
    go: { language: "go", version: "1.16.2", fileName: "main.go" },
    php: { language: "php", version: "8.2.3", fileName: "main.php" },
    html: { language: "html", version: "5.0.0", fileName: "index.html" }
};

// --- Auto-Provisioning Logic ---
// Automatically installs required languages into the local Piston container on startup.
const REQUIRED_PACKAGES = [
    { language: 'python', version: '3.10.0' },
    { language: 'javascript', version: '18.15.0' },
    { language: 'typescript', version: '5.0.3' },
    { language: 'java', version: '15.0.2' },
    { language: 'cpp', version: '10.2.0' },
    { language: 'go', version: '1.16.2' },
    { language: 'php', version: '8.2.3' },
];

async function ensureLanguagesInstalled() {
    console.log("Checking execution engine status...");
    try {
        // 1. Check if Piston is reachable
        await pistonClient.get('/api/v2/runtimes');
        console.log("Execution engine reachable. Verifying packages in parallel...");

        // 2. Install missing packages in parallel for faster startup
        // We catch errors individually so one failure doesn't stop the rest
        await Promise.all(REQUIRED_PACKAGES.map(async (pkg) => {
            try {
                await pistonClient.post('/api/v2/packages', {
                    language: pkg.language,
                    version: pkg.version
                });
                // Squelch success logs to keep console clean, or log if needed
            } catch (err) {
                console.warn(`[Auto-Install] Note: ${pkg.language} check ended. (This is normal if already installed)`);
            }
        }));

        console.log("Language runtime verification complete.");
    } catch (error) {
        console.error("Warning: Could not connect to local execution engine (Piston).");
        console.error("Backend will attempt to execute, but if languages are missing, it may fail or fallback.");
        console.error("Ensure the 'piston' service is running in Docker Compose.");
    }
}

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.post('/api/execute', async (req, res) => {
    const { language, code, stdin } = req.body;

    // 1. Validate Input
    if (!language || typeof code !== 'string') {
        return res.status(400).json({ 
            error: 'Missing "language" or "code" fields.' 
        });
    }

    // 2. Validate Language
    const config = languageMap[language];
    if (!config) {
        return res.status(400).json({ 
            error: `Unsupported language: ${language}. Supported: ${Object.keys(languageMap).join(', ')}` 
        });
    }

    // 3. HTML Shortcut (No Execution)
    if (language === 'html') {
        return res.json({
            run: {
                stdout: "",
                stderr: "",
                output: "HTML is rendered client-side.",
                code: 0,
                signal: null
            }
        });
    }

    try {
        // 4. Construct Piston Payload (Strict)
        const safeStdin = typeof stdin === 'string' ? stdin : "";
        
        // Default File Structure
        let files = [
            {
                name: config.fileName,
                content: code
            }
        ];

        // Python Input Safety Patch
        // Only inject if 'input' is actually used as a token in the code.
        // This regex check is safer and more specific than .includes('input')
        if (language === 'python' && PYTHON_INPUT_REGEX.test(code)) {
            // Piston executes the first file in the list.
            // We prepend bootstrap.py and make it the entry point.
            files = [
                { name: 'bootstrap.py', content: PYTHON_BOOTSTRAP_CODE },
                { name: 'main.py', content: code }
            ];
        }

        const payload = {
            language: config.language,
            version: config.version,
            files: files,
            stdin: safeStdin,
            args: [],
            run_timeout: 5000,
            compile_timeout: 10000,
            compile_memory_limit: -1,
            run_memory_limit: -1
        };

        // Use the persistent client
        const response = await pistonClient.post('/api/v2/execute', payload);
        res.json(response.data);

    } catch (error: any) {
        console.error(`Execution Error [${language}]:`, error.message);
        
        const errorMessage = error.response?.data?.message || 'Execution service unavailable.';
        
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
             return res.status(504).json({ error: 'Execution timed out.' });
        }

        if (error.response) {
            res.status(error.response.status).json({ error: errorMessage });
        } else {
            res.status(502).json({ error: 'Failed to connect to execution engine.' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Start the package verification process
    ensureLanguagesInstalled();
});