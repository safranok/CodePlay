import React, { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Save, 
  Code2,
  Terminal,
  BookOpen,
  Sun,
  Moon
} from 'lucide-react';
import { Language, ExecutionStat } from './types';
import { LANGUAGE_CONFIGS, RECOMMENDED_SNIPPETS } from './constants';
import { getInitialState } from './utils/urlManager';
import { executeCode } from './services/executionService';
import { detectLanguage } from './utils/languageDetector';
import { getInputPrompts } from './utils/codeAnalyzer';
import { analyzeError } from './utils/errorParser';

import LanguageSelector from './components/LanguageSelector';
import EditorWindow from './components/EditorWindow';
import OutputPanel from './components/OutputPanel';
import StatsModal from './components/StatsModal';
import SnippetsModal from './components/SnippetsModal';

function App() {
  // Theme State Initialization
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('cp_theme');
        if (saved) return saved as 'light' | 'dark';
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'dark'; // Default
  });

  // Lazy initialization ensures snippets load instantly on first render
  const [language, setLanguage] = useState<Language>(() => getInitialState().language);
  const [code, setCode] = useState<string>(() => getInitialState().code);
  
  // Input Form State
  const [requiredPrompts, setRequiredPrompts] = useState<string[]>([]);
  const [inputValues, setInputValues] = useState<Record<number, string>>({});
  
  const [output, setOutput] = useState<string>('');
  const [stderr, setStderr] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<ExecutionStat[]>([]);
  
  // Modals State
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSnippetsOpen, setIsSnippetsOpen] = useState(false);
  
  // Error Highlighting State
  const [errorLineNumber, setErrorLineNumber] = useState<number | undefined>(undefined);
  
  // HTML Preview specific state
  const [htmlPreview, setHtmlPreview] = useState<string | undefined>(undefined);

  // Theme Side Effect
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
    localStorage.setItem('cp_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Save / Download Functionality
  const handleSave = useCallback(() => {
    const extension = LANGUAGE_CONFIGS[language].extension;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `code.${extension}`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [language, code]);

  // Code Analysis for Inputs (Debounced/Effect based)
  useEffect(() => {
    if (language === Language.HTML) {
      setRequiredPrompts([]);
      return;
    }
    const prompts = getInputPrompts(language, code);
    setRequiredPrompts(prompts);
  }, [code, language]);

  const handleLanguageChange = (newLang: Language) => {
    // Intelligent Snippet Replacement Logic:
    // 1. Get the snippet associated with the OLD language
    const currentDefault = RECOMMENDED_SNIPPETS[language];
    
    // 2. Check if the current editor is "pristine" (empty, whitespace, or equals the old default)
    const isPristine = !code || !code.trim() || (currentDefault && code.trim() === currentDefault.trim());

    if (isPristine) {
        // If untouched or cleared, load the snippet for the NEW language
        setCode(RECOMMENDED_SNIPPETS[newLang]);
    }
    // Else: User has custom code, do not overwrite it.

    setLanguage(newLang);
    
    // Reset output but keep input values
    setOutput('');
    setStderr('');
    setErrorLineNumber(undefined);
    setHtmlPreview(undefined);
    setInputValues({});
  };

  const handleAutoDetect = () => {
    const detected = detectLanguage(code);
    if (detected && detected !== language) {
        if (window.confirm(`Detected language: ${LANGUAGE_CONFIGS[detected].name}. Switch?`)) {
            setLanguage(detected);
        }
    } else if (!detected) {
        alert("Could not automatically detect language.");
    }
  };

  const handleInputChange = (index: number, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleCodeChange = (newCode: string | undefined) => {
    setCode(newCode || '');
    // Clear error line highlight when user starts typing
    if (errorLineNumber) {
      setErrorLineNumber(undefined);
    }
  };

  const handleApplySnippet = (snippetCode: string) => {
    setCode(snippetCode);
  };

  const handleRun = async () => {
    if (isRunning) return;

    if (language === Language.HTML) {
        setHtmlPreview(code);
        return;
    }

    setIsRunning(true);
    setErrorLineNumber(undefined); // Reset previous error highlight
    const startTime = Date.now();
    
    // Construct stdin from input values in order
    const stdin = requiredPrompts.map((_, i) => inputValues[i] || '').join('\n');

    try {
        const result = await executeCode(language, code, stdin);
        
        setOutput(result.run.output || result.run.stdout);
        setStderr(result.run.stderr);
        
        // Analyze Error for Line Number
        if (result.run.stderr) {
          const analysis = analyzeError(language, result.run.stderr);
          if (analysis?.line) {
            setErrorLineNumber(analysis.line);
          }
        }
        
        setStats(prev => [...prev, {
            timestamp: new Date().toISOString(),
            duration: Date.now() - startTime,
            language: LANGUAGE_CONFIGS[language].name,
            status: result.run.code === 0 ? 'success' : 'error'
        }]);

    } catch (err) {
        setStderr("Critical execution error. Backend may be offline.");
        setStats(prev => [...prev, {
            timestamp: new Date().toISOString(),
            duration: Date.now() - startTime,
            language: LANGUAGE_CONFIGS[language].name,
            status: 'error'
        }]);
    } finally {
        setIsRunning(false);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            handleRun();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRun]); 

  return (
    <div className="flex h-screen w-full bg-white dark:bg-[#0D0D0D] text-gray-900 dark:text-white overflow-hidden font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
      
      {/* Animation Styles */}
      <style>{`
        @keyframes fadeInMove {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-title {
          animation: fadeInMove 0.15s ease-out forwards;
        }
      `}</style>

      {/* Sidebar - Minimal Language Selector */}
      <LanguageSelector 
        currentLanguage={language} 
        onSelect={handleLanguageChange}
        onAutoDetect={handleAutoDetect}
        disabled={isRunning}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-[#F3F3F3] dark:bg-[#1A1A1A] transition-colors duration-300">
        
        {/* Header */}
        <header className="relative h-16 flex items-center justify-between px-8 border-b border-gray-200 dark:border-[#222] bg-[#F3F3F3] dark:bg-[#1A1A1A] z-10 flex-shrink-0 transition-colors duration-300">
            {/* Left: Branding */}
            <div className="flex items-center space-x-3 z-10">
                <Code2 className="text-gray-900 dark:text-white transition-colors" size={24} />
                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">CodePlay</h1>
            </div>

            {/* Center: Language Title Heading - Shifted Left */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -ml-[60px] pointer-events-none select-none z-0">
                <h2 
                    key={language} 
                    className="text-gray-900 dark:text-white font-semibold text-[20px] animate-title"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    {LANGUAGE_CONFIGS[language].name}
                </h2>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4 z-10">
                
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-[#333] transition-all duration-200 active:scale-95"
                    title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    aria-label="Toggle Theme"
                >
                    <div key={theme} className="animate-in fade-in zoom-in duration-300">
                      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </div>
                </button>

                 <button 
                    onClick={() => setIsSnippetsOpen(true)}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-500 dark:text-[#888] hover:text-gray-900 dark:hover:text-white transition-colors"
                    title="Code Snippets"
                >
                    <BookOpen size={18} />
                    <span>Snippets</span>
                </button>
                <div className="h-4 w-px bg-gray-300 dark:bg-[#333]" />
                <button 
                    onClick={handleSave}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-500 dark:text-[#888] hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <Save size={18} />
                    <span>Save</span>
                </button>
                
                {/* Primary Run Action */}
                <button 
                    onClick={handleRun}
                    disabled={isRunning}
                    className={`
                        ml-4 flex items-center space-x-2 px-6 py-2 
                        bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#222] 
                        text-gray-900 dark:text-white font-semibold rounded-md
                        hover:bg-gray-50 dark:hover:bg-[#252525]
                        hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]
                        transition-all duration-300
                        ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    <Play size={16} fill={isRunning ? "none" : "currentColor"} className={isRunning ? "hidden" : "block"} />
                    <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                </button>
            </div>
        </header>

        {/* Workspace Split */}
        <main className="flex-1 flex overflow-hidden">
            
            {/* Editor Area */}
            <div className="flex-1 min-w-0 border-r border-gray-200 dark:border-[#222] bg-[#F3F3F3] dark:bg-[#1A1A1A] transition-colors duration-300">
                <EditorWindow 
                    language={language}
                    code={code}
                    theme={theme}
                    errorLineNumber={errorLineNumber}
                    onChange={handleCodeChange}
                />
            </div>
            
            {/* Right Panel: Inputs & Output */}
            <div className="w-[450px] flex-shrink-0 h-full bg-[#F3F3F3] dark:bg-[#1A1A1A] transition-colors duration-300">
                <OutputPanel 
                    output={output}
                    stderr={stderr}
                    isLoading={isRunning}
                    language={language}
                    htmlContent={htmlPreview}
                    requiredPrompts={requiredPrompts}
                    inputValues={inputValues}
                    onInputChange={handleInputChange}
                    onClear={() => { 
                        setOutput(''); 
                        setStderr(''); 
                        setErrorLineNumber(undefined);
                    }}
                />
            </div>
        </main>
      </div>

      <StatsModal 
        isOpen={isStatsOpen} 
        onClose={() => setIsStatsOpen(false)} 
        stats={stats} 
      />

      <SnippetsModal 
        isOpen={isSnippetsOpen}
        onClose={() => setIsSnippetsOpen(false)}
        language={language}
        onSelectSnippet={handleApplySnippet}
      />

    </div>
  );
}

export default App;