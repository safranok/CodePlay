import React from 'react';
import { Tool } from '../types';
import { ExternalLink, Info } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  index: number;
  onShowDetails: (id: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, index, onShowDetails }) => {
  return (
    <div 
      className="bg-surface rounded-2xl p-6 border border-border shadow-sm hover:shadow-xl hover:border-white transition-all duration-300 animate-fade-in group flex flex-col h-full cursor-pointer"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => onShowDetails(tool.id)}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 rounded-xl overflow-hidden border border-border bg-black p-0.5">
          <img src={tool.logo} alt={tool.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-lg" />
        </div>
        <div className="flex gap-2">
          {tool.isNew && (
            <span className="px-2 py-1 bg-white text-black text-[10px] font-bold rounded-md uppercase tracking-wider">
              New
            </span>
          )}
          {tool.isPremium && (
            <span className="px-2 py-1 bg-border text-text-primary text-[10px] font-bold rounded-md uppercase tracking-wider border border-white/10">
              Premium
            </span>
          )}
        </div>
      </div>

      <div className="flex-grow">
        <h3 className="text-xl font-bold text-text-primary mb-2 transition-colors">{tool.name}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-3">
          {tool.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {tool.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2.5 py-1 bg-border text-[#CCCCCC] text-xs rounded-full font-medium border border-white/5">
              {tag}
            </span>
          ))}
          {tool.tags.length > 3 && (
            <span className="px-2.5 py-1 bg-background text-text-muted text-xs rounded-full font-medium">
              +{tool.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-border mt-auto">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onShowDetails(tool.id);
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-text-primary bg-background border border-border hover:bg-surface transition-colors rounded-xl"
        >
          <Info size={16} />
          Details
        </button>
        <a 
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary-dark bg-white hover:opacity-90 rounded-xl transition-all"
        >
          Visit
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};

export default ToolCard;