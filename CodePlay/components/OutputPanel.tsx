import React from 'react';
import { Language } from '../types';
import { Terminal, AlertCircle, Eraser, Loader2, Code2 } from 'lucide-react';
import { analyzeError } from '../utils/errorParser';

interface OutputPanelProps {
  output: string;
  stderr: string;
  isLoading: boolean;
  language: Language;
  htmlContent?: string;
  requiredPrompts: string[];
  inputValues: Record<number, string>;
  onInputChange: (index: number, value: string) => void;
  onClear: () => void;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ 
  output, 
  stderr, 
  isLoading, 
  language, 
  htmlContent, 
  requiredPrompts,
  inputValues,
  onInputChange,
  onClear
}) => {

  const errorAnalysis = stderr ? analyzeError(language, stderr) : null;

  // HTML Preview Rendering
  if (language === Language.HTML && htmlContent) {
    return (
      <div className="h-full w-full bg-white relative">
        <iframe
            title="preview"
            srcDoc={htmlContent}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-popups" 
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#F3F3F3] dark:bg-[#1A1A1A] text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* 1. Input Section */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-[#222] bg-[#F3F3F3] dark:bg-[#1A1A1A] transition-colors duration-300">
         <div className="px-6 py-4">
             <h3 className="text-xs font-bold text-gray-500 dark:text-[#666] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Terminal size={14} />
                Program Inputs
             </h3>
             
             {requiredPrompts.length > 0 ? (
                 <div className="space-y-4">
                    {requiredPrompts.map((prompt, index) => (
                        <div key={index} className="flex flex-col space-y-2">
                            <label className="text-sm text-gray-600 dark:text-gray-300 font-medium font-mono">
                                {prompt}
                            </label>
                            <input 
                                type="text"
                                value={inputValues[index] || ''}
                                onChange={(e) => onInputChange(index, e.target.value)}
                                placeholder="Type value..."
                                className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-[#222] text-gray-900 dark:text-white px-4 py-2.5 rounded-md text-sm font-mono focus:outline-none focus:border-blue-400 dark:focus:border-[#444] focus:shadow-sm transition-all duration-200 ease-out placeholder-gray-400 dark:placeholder-gray-600"
                            />
                        </div>
                    ))}
                 </div>
             ) : (
                 <p className="text-sm text-gray-400 dark:text-[#444] italic">
                    No inputs detected in code.
                 </p>
             )}
         </div>
      </div>

      {/* 2. Output Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#E5E7EB] dark:bg-[#20212E] border-t border-gray-200 dark:border-[#222] transition-colors duration-300">
          <h3 className="text-xs font-bold text-gray-500 dark:text-[#666] uppercase tracking-wider">Output</h3>
          <button 
            onClick={onClear}
            className="text-gray-500 dark:text-[#444] hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Clear Console"
          >
            <Eraser size={14} />
          </button>
      </div>

      {/* 3. Output Content Container */}
      <div className="flex-1 px-4 pb-4 overflow-hidden bg-[#E5E7EB] dark:bg-[#20212E] transition-colors duration-300">
          <div className="h-full w-full bg-white dark:bg-[#20212E] rounded-xl border border-gray-200 dark:border-[#222] shadow-sm dark:shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] relative overflow-hidden flex flex-col transition-colors duration-300">
            
            {/* Scrollable Log Area */}
            <div className="flex-1 overflow-auto p-4 custom-scrollbar font-mono text-sm">
                
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-[#20212E]/80 backdrop-blur-sm z-10 rounded-xl transition-colors">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="animate-spin text-gray-900 dark:text-white" size={32} />
                            <span className="text-gray-500 dark:text-gray-400 text-xs tracking-widest uppercase">Executing...</span>
                        </div>
                    </div>
                )}

                {/* Standard Output */}
                {output && (
                    <div className="mb-6 whitespace-pre-wrap break-words text-gray-900 dark:text-white leading-relaxed animate-in fade-in duration-300">
                        {output}
                    </div>
                )}

                {/* Errors */}
                {stderr && (
                    <div className="mt-4 border-t border-gray-200 dark:border-[#333] pt-4 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-500">
                            <AlertCircle size={16} />
                            <span className="font-bold text-xs uppercase tracking-wider">Runtime Error</span>
                        </div>
                        
                        {/* Friendly Hint */}
                        {errorAnalysis && errorAnalysis.friendly && (
                            <div className="mb-3 p-3 bg-blue-50 dark:bg-[#111] border border-blue-100 dark:border-[#333] rounded text-blue-600 dark:text-blue-400 text-xs">
                                <span className="font-bold block mb-1 text-blue-700 dark:text-blue-500">Hint:</span>
                                {errorAnalysis.friendly}
                            </div>
                        )}

                        <pre className="text-red-600 dark:text-red-400 whitespace-pre-wrap break-words text-xs font-mono bg-red-50 dark:bg-[#110000] p-3 rounded border border-red-100 dark:border-red-900/30">
                            {stderr}
                        </pre>
                    </div>
                )}

                {!output && !stderr && !isLoading && (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 dark:opacity-10 transition-opacity">
                        <Code2 size={48} className="mb-4 text-gray-900 dark:text-white" />
                        <p className="text-gray-900 dark:text-white font-medium">Ready to compile</p>
                    </div>
                )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default OutputPanel;