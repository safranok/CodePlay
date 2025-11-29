import React from 'react';
import { Language } from '../types';
import { LANGUAGE_CONFIGS } from '../constants';
import { Wand2 } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onSelect: (lang: Language) => void;
  onAutoDetect: () => void;
  disabled?: boolean;
}

// Custom SVG Icons with premium brand colors
// Normalized to 24x24 viewbox
const BrandIcons: Record<Language, React.ReactNode> = {
  [Language.PYTHON]: (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <defs>
        <linearGradient id="python-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3776AB" />
          <stop offset="50%" stopColor="#3776AB" />
          <stop offset="50%" stopColor="#FFD43B" />
          <stop offset="100%" stopColor="#FFD43B" />
        </linearGradient>
      </defs>
      <path fill="url(#python-grad)" d="M14.25 2.25c-1.5 0.2-2.75 1.4-2.75 3.19v2h2.75v-0.75c0-0.6 0.4-1.1 0.9-1.1h1.5c0.6 0 1.1 0.5 1.1 1.1v2h-4.75c-1.8 0-3.25 1.45-3.25 3.25v2.25h-1.5c-1.7 0-3-1.3-3-3s1.3-3 3-3h1.25c0.3 0 0.6-0.3 0.6-0.6s-0.3-0.6-0.6-0.6H7.5C5.1 7 3.25 8.85 3.25 11.25c0 2.2 1.6 4 3.75 4.25v1.75c0 1.7 1.3 3 3 3h1.5v2.25c0 1.8 1.45 3.25 3.25 3.25h2.25c1.8 0 3.25-1.45 3.25-3.25v-2.25h1.5c1.7 0 3-1.3 3-3 0-1.7-1.3-3-3-3h-1.5V8.75c0-2.4-1.85-4.25-4.25-4.25h-1.75zm-1.75 11h1.5c.6 0 1.1-.5 1.1-1.1v-2h2.25c.6 0 1.1.5 1.1 1.1v2.25h-4.85v-2h-.1z"/>
    </svg>
  ),
  [Language.JAVASCRIPT]: (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#F7DF1E" />
      <path d="M12.5 15h-2v-3.5h-1v-1h3v4.5zm4.5 0h-3v-1h2.5v-.5h-2.5v-1.5h2.5v-1h-2.5v-1h3v5z" fill="#000" />
    </svg>
  ),
  [Language.TYPESCRIPT]: (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#3178C6" />
      <path d="M9 12h-2.5v-1h6v1h-2.5v5h-1v-5zm5.5 5h3c.5 0 1-.5 1-1v-.5c0-.5-.5-1-1-1h-2v-.5h2v-1h-2c-.5 0-1 .5-1 1v.5c0 .5.5 1 1 1h2v.5h-2v1z" fill="#FFF" />
    </svg>
  ),
  [Language.CPP]: (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path fill="#00599C" d="M11.5 8h-1v2h-2v1h2v2h1v-2h2v-1h-2V8zm-6 2.5c0-1.7 1.3-3 3-3 .8 0 1.6.3 2.1.8l.7-.7C10.7 7 9.9 6.5 9 6.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5c.9 0 1.7-.5 2.3-1.1l-.7-.7c-.5.5-1.3.8-2.1.8-1.7 0-3-1.3-3-3zm10-2.5h-1v2h-2v1h2v2h1v-2h2v-1h-2V8z"/>
    </svg>
  ),
  [Language.JAVA]: (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path fill="#5382A1" d="M4 19h16v2H4zm6-15h2v6h-2zm-3 3h2v3H7zm6 1h2v2h-2zm-9 9c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3H4v3zm15-2h3v-2h-3v2z"/>
    </svg>
  ),
  [Language.GO]: (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path fill="#00ADD8" d="M12.2 6.5c-3 0-5.5 2-5.5 5.5s2.5 5.5 5.5 5.5c1.8 0 3.3-.8 4.3-2.2v-3.3h-4v2h2v.3c-.5.8-1.3 1.2-2.3 1.2-1.7 0-3.5-1.3-3.5-3.5s1.8-3.5 3.5-3.5c1.1 0 2 .5 2.6 1.4l1.6-1.1c-1-1.4-2.4-2.3-4.2-2.3z"/>
    </svg>
  ),
  [Language.PHP]: (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path fill="#777BB4" d="M12 9h-1.5v6h1.5c1.5 0 2.5-1 2.5-3s-1-3-2.5-3zm0 4.5h-.3v-3h.3c.7 0 1.2.4 1.2 1.5s-.5 1.5-1.2 1.5zm-7-4.5H3v6h1.2v-2.2h1.8c1.2 0 2-1 2-2s-.8-1.8-2-1.8H5zm0 2.5v-1.3h1c.5 0 .8.2.8.6s-.3.7-.8.7H5zm12.5-2.5H16v6h1.2v-2.2h1.8c1.2 0 2-1 2-2s-.8-1.8-2-1.8h-1.5zm0 2.5v-1.3h1c.5 0 .8.2.8.6s-.3.7-.8.7h-.8z"/>
    </svg>
  ),
  [Language.HTML]: (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path fill="#E34F26" d="M3 3l1.8 15.6L12 21l7.2-2.4L21 3H3zm13.7 13.5l-4.7 1.6-4.7-1.6-.5-5.5h3.4l.2 2.3 1.6.5 1.6-.5.3-2.9H6.6L6.3 7h11.4l-.4 3.5h-8l.1 1.5h7.7l-.4 4.5z"/>
    </svg>
  )
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, onSelect, onAutoDetect, disabled }) => {
  return (
    <div className="flex flex-col h-full bg-[#F3F3F3] dark:bg-[#1A1A1A] border-r border-gray-200 dark:border-[#222] w-16 items-center py-4 flex-shrink-0 z-20 transition-colors duration-300">
      <button 
          onClick={onAutoDetect}
          title="Auto Detect Language"
          className="mb-6 p-2 text-gray-500 dark:text-[#666] hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#252525] rounded-lg transition-colors"
      >
          <Wand2 size={20} />
      </button>

      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full flex flex-col items-center space-y-4 px-2 no-scrollbar whitespace-normal">
        {Object.values(LANGUAGE_CONFIGS).map((config) => {
          const isActive = currentLanguage === config.id;
          
          return (
            <button
                key={config.id}
                disabled={disabled}
                onClick={() => onSelect(config.id)}
                className={`
                    group relative w-10 h-10 flex items-center justify-center rounded-xl 
                    transition-all duration-150 ease-out
                    ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                    
                    /* Active State */
                    ${isActive 
                        ? 'bg-white dark:bg-[#222] scale-[1.15] border-2 border-gray-300 dark:border-white shadow-md dark:shadow-[0_0_20px_rgba(255,255,255,0.15)] z-10' 
                        : 'hover:bg-gray-200 dark:hover:bg-[#252525] border-2 border-transparent hover:scale-110 hover:shadow-sm'
                    }

                    /* Click Animation: Quick Scale Down */
                    active:scale-90 active:duration-75
                `}
            >
                {/* Icon Container */}
                <div className="relative z-10">
                    {BrandIcons[config.id]}
                </div>
                
                {/* Active Pulse Effect (Subtle background ping) */}
                {isActive && (
                     <span className="absolute inset-0 rounded-xl bg-black/5 dark:bg-white/10 animate-pulse pointer-events-none"></span>
                )}

                {/* Tooltip */}
                <div className={`
                    absolute left-full top-1/2 -translate-y-1/2 ml-4
                    bg-white dark:bg-[#000000DD] text-gray-900 dark:text-white text-[13px] font-medium 
                    px-3 py-1.5 rounded-md 
                    opacity-0 translate-x-[-5px]
                    group-hover:opacity-100 group-hover:translate-x-0
                    transition-all duration-150 ease-out
                    pointer-events-none whitespace-nowrap z-50
                    shadow-xl border border-gray-200 dark:border-white/10
                `}>
                    {config.name}
                    {/* Tooltip Arrow */}
                    <div className="absolute top-1/2 -left-[5px] -translate-y-1/2 border-t-[5px] border-t-transparent border-r-[5px] border-r-white dark:border-r-[#000000DD] border-b-[5px] border-b-transparent"></div>
                </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSelector;