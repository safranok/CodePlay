
import React, { useMemo, useState } from 'react';
import { Tool, CategoryId } from '../types';
import { CATEGORIES } from '../constants';
import ToolCard from './ToolCard';
import { ChevronDown, Search, ArrowRight, Sparkles } from 'lucide-react';

interface SearchResultsProps {
  query: string;
  tools: Tool[];
  onShowDetails: (id: string) => void;
  onClear: () => void;
  onSelectCategory: (id: CategoryId) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query, tools, onShowDetails, onClear, onSelectCategory }) => {
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const groupedResults = useMemo(() => {
    const groups: Record<string, Tool[]> = {};
    tools.forEach(tool => {
      if (!groups[tool.categoryId]) groups[tool.categoryId] = [];
      groups[tool.categoryId].push(tool);
    });
    return groups;
  }, [tools]);

  const categoriesWithResults = useMemo(() => {
    return CATEGORIES.filter(cat => groupedResults[cat.id]?.length > 0);
  }, [groupedResults]);

  const toggleCollapse = (id: string) => {
    const next = new Set(collapsedCategories);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCollapsedCategories(next);
  };

  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-8 text-slate-300">
          <Search size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          No results found for "{query}"
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mb-10 leading-relaxed">
          We couldn't find any tools matching your search. Try keywords like: 
          <span className="font-bold text-primary ml-1">video, writing, image, music, business, data, or code.</span>
        </p>
        <button 
          onClick={onClear}
          className="px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
        >
          Reset Search
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20">
      <div className="mb-12">
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
          <button onClick={onClear} className="hover:text-primary transition-colors">Home</button>
          <span>/</span>
          <span className="text-primary">Search Results</span>
          <span>/</span>
          <span className="text-slate-900 dark:text-white">"{query}"</span>
        </nav>
        
        <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Found {tools.length} {tools.length === 1 ? 'tool' : 'tools'}
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">
          Spread across {categoriesWithResults.length} {categoriesWithResults.length === 1 ? 'category' : 'categories'}.
        </p>
      </div>

      <div className="space-y-16">
        {categoriesWithResults.map((cat) => (
          <div key={cat.id} className="scroll-mt-32">
            <div 
              className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800 mb-8 sticky top-[72px] bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10 cursor-pointer group"
              onClick={() => toggleCollapse(cat.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-black/5`}>
                  {cat.emoji}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    {cat.label}
                  </h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {groupedResults[cat.id].length} Results
                  </p>
                </div>
              </div>
              <ChevronDown 
                className={`text-slate-300 group-hover:text-primary transition-all duration-300 ${collapsedCategories.has(cat.id) ? '-rotate-90' : ''}`} 
              />
            </div>

            {!collapsedCategories.has(cat.id) && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedResults[cat.id].map((tool, idx) => (
                  <ToolCard 
                    key={tool.id} 
                    tool={tool} 
                    index={idx} 
                    onShowDetails={onShowDetails} 
                  />
                ))}
                <div 
                  onClick={() => onSelectCategory(cat.id)}
                  className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-4 text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all">
                    <ArrowRight size={24} />
                  </div>
                  <h3 className="font-bold text-slate-700 dark:text-slate-300">View Category</h3>
                  <p className="text-sm text-slate-500">Explore 20+ more {cat.label.replace('AI ', '')}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
