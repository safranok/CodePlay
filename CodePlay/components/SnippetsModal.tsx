import React, { useState, useMemo } from 'react';
import { X, Search, Code, Check } from 'lucide-react';
import { Language } from '../types';
import { SNIPPETS_LIBRARY } from '../data/snippets';
import { LANGUAGE_CONFIGS } from '../constants';

interface SnippetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectSnippet: (code: string) => void;
}

const SnippetsModal: React.FC<SnippetsModalProps> = ({ 
  isOpen, 
  onClose, 
  language, 
  onSelectSnippet 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Filter snippets based on current language and search query
  const snippets = useMemo(() => {
    const langSnippets = SNIPPETS_LIBRARY[language] || [];
    if (!searchQuery.trim()) return langSnippets;
    
    return langSnippets.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [language, searchQuery]);

  if (!isOpen) return null;

  const handleSelect = (code: string, index: number) => {
    onSelectSnippet(code);
    setCopiedIndex(index);
    setTimeout(() => {
        setCopiedIndex(null);
        onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-2xl rounded-xl border border-gray-200 dark:border-[#333] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-colors duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-[#333] flex items-center justify-between bg-gray-50 dark:bg-[#222]">
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Code className="text-blue-500 dark:text-blue-400" size={24} />
                    {LANGUAGE_CONFIGS[language].name} Snippets
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Select a snippet to insert into the editor.
                </p>
            </div>
            <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-200 dark:hover:bg-[#333] rounded-full transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
                <X size={20} />
            </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-[#333] bg-white dark:bg-[#1A1A1A]">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input 
                    type="text" 
                    placeholder={`Search ${LANGUAGE_CONFIGS[language].name} snippets...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#111] border border-gray-300 dark:border-[#333] rounded-lg pl-10 pr-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                    autoFocus
                />
            </div>
        </div>

        {/* Snippets List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white dark:bg-[#1A1A1A]">
            {snippets.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                    {snippets.map((snippet, index) => (
                        <button
                            key={index}
                            onClick={() => handleSelect(snippet.code, index)}
                            className="group flex flex-col items-start p-4 bg-gray-50 dark:bg-[#222] border border-gray-200 dark:border-[#333] rounded-lg hover:border-gray-300 dark:hover:border-[#555] hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-all duration-200 text-left relative"
                        >
                            <div className="flex items-center justify-between w-full mb-1">
                                <span className="font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors">
                                    {snippet.name}
                                </span>
                                {copiedIndex === index && (
                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium animate-in fade-in zoom-in">
                                        <Check size={14} /> Applied
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{snippet.description}</p>
                            
                            {/* Code Preview (Truncated) */}
                            <div className="w-full bg-white dark:bg-[#111] p-2 rounded border border-gray-200 dark:border-[#333] font-mono text-xs text-gray-400 dark:text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap opacity-70 group-hover:opacity-100 transition-opacity">
                                {snippet.code.split('\n')[0]}...
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400 dark:text-gray-500">
                    <Search size={32} className="mb-2 opacity-50" />
                    <p>No snippets found matching "{searchQuery}"</p>
                </div>
            )}
        </div>
        
        {/* Footer */}
        <div className="p-3 bg-gray-50 dark:bg-[#222] border-t border-gray-200 dark:border-[#333] text-center">
            <p className="text-xs text-gray-500">
                Tip: Applying a snippet will replace the current editor content.
            </p>
        </div>
      </div>
    </div>
  );
};

export default SnippetsModal;