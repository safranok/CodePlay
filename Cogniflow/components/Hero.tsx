import React from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onExplore, searchQuery, setSearchQuery }) => {
  return (
    <div className="relative pt-20 pb-24 px-4 overflow-hidden bg-background">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-white/5 blur-[150px] rounded-full -z-10 animate-pulse"></div>
      
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border text-text-primary text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in shadow-sm">
          <Sparkles size={14} className="text-white" />
          Updated for February 2025
        </div>
        
        <h1 className="text-6xl lg:text-8xl font-extrabold text-text-primary tracking-tight mb-8 leading-[1] animate-fade-in">
          Discover the Best <br />
          <span className="text-text-secondary">AI Tools for Every Need.</span>
        </h1>
        
        <p className="text-xl text-text-secondary mb-12 leading-relaxed max-w-2xl mx-auto animate-fade-in [animation-delay:200ms]">
          Your comprehensive directory of 140+ AI tools across 7 premium categories. Curated for creators, developers, and global businesses.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:400ms]">
          <button 
            onClick={onExplore}
            className="group px-8 py-4 bg-white text-primary-dark font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-white/5 flex items-center gap-2"
          >
            Explore Tools
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="relative w-full max-w-md group">
            <div className="absolute -inset-1 bg-white/10 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative flex items-center bg-surface shadow-lg rounded-2xl p-1 border border-border group-hover:border-border-hover transition-colors">
              <Search className="ml-4 text-text-muted" size={20} />
              <input 
                type="text" 
                placeholder="Find a specific tool..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none py-3 px-3 focus:ring-0 text-text-primary placeholder-text-muted outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;