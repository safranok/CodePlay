import axios from 'axios';
import { Language, ExecutionResult, BackendExecutionRequest } from '../types';
import { BACKEND_URL, PISTON_API_URL, LANGUAGE_CONFIGS } from '../constants';

// Helper for Fallback (Direct Piston Access)
const getFileName = (language: Language): string => {
  switch (language) {
    case Language.JAVA: return 'Main.java'; 
    case Language.PYTHON: return 'main.py';
    case Language.JAVASCRIPT: return 'main.js';
    case Language.TYPESCRIPT: return 'index.ts';
    case Language.CPP: return 'main.cpp';
    case Language.GO: return 'main.go';
    case Language.PHP: return 'main.php';
    case Language.HTML: return 'index.html';
    default: return 'code.txt';
  }
};

export const executeCode = async (
  language: Language,
  code: string,
  stdin: string = ""
): Promise<ExecutionResult> => {
  
  if (language === Language.HTML) {
    return {
      run: {
        stdout: "Rendering HTML Preview...",
        stderr: "",
        output: "HTML Preview Active",
        code: 0,
        signal: null
      }
    };
  }

  // 1. Attempt Primary Execution (Local Backend Proxy)
  const backendPayload: BackendExecutionRequest = {
    language,
    code,
    stdin
  };

  try {
    const response = await axios.post<ExecutionResult>(BACKEND_URL, backendPayload);
    return response.data;
  } catch (error: any) {
    console.warn("Primary execution service failed, attempting fallback...", error.message);
    
    const isNetworkError = error.code === "ERR_NETWORK" || !error.response || error.response.status >= 500;

    if (isNetworkError) {
      try {
        // 2. Fallback Execution (Direct Piston API)
        const config = LANGUAGE_CONFIGS[language];
        const fileName = getFileName(language);
        
        const fallbackPayload = {
          language: config.id,
          version: config.version,
          files: [{ name: fileName, content: code }],
          stdin: stdin, // Pass user input
          args: [],
          run_timeout: 5000,
          compile_timeout: 10000
        };
        
        const response = await axios.post<ExecutionResult>(PISTON_API_URL, fallbackPayload);
        return response.data;
      } catch (fallbackError: any) {
        console.error("Fallback execution failed:", fallbackError);
      }
    }

    const msg = error.response?.data?.error || error.message || "Execution service unavailable. Try again later.";
    return {
      run: {
        stdout: "",
        stderr: `System Error: ${msg}`,
        output: "",
        code: 1,
        signal: "ERROR"
      },
      message: msg
    };
  }
};