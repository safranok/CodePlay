import React, { useEffect } from 'react';
import { Tool, CategoryId } from '../types';
import { CATEGORIES } from '../constants';
import { X, ExternalLink, Globe, Shield, Zap, Info } from 'lucide-react';

interface ToolDetailsModalProps {
  tool: Tool;
  onClose: () => void;
}

const ToolDetailsModal: React.FC<ToolDetailsModalProps> = ({ tool, onClose }) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const category = CATEGORIES.find(c => c.id === tool.categoryId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-background rounded-3xl shadow-2xl overflow-hidden animate-fade-in flex flex-col md:flex-row max-h-[90vh] border border-border">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-surface text-text-secondary hover:text-text-primary rounded-full transition-colors z-10 border border-border"
        >
          <X size={20} />
        </button>

        {/* Sidebar Info (Left) */}
        <div className="w-full md:w-[320px] bg-surface p-8 border-r border-border flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-background shadow-lg mb-6">
            <img src={tool.logo} alt={tool.name} className="w-full h-full object-cover" />
          </div>
          
          <h2 className="text-2xl font-bold text-text-primary mb-2 leading-tight">
            {tool.name}
          </h2>
          
          <div className="flex items-center gap-2 px-3 py-1 bg-background border border-border rounded-full text-xs font-semibold text-text-secondary mb-6">
            <span>{category?.emoji}</span>
            <span>{category?.label}</span>
          </div>

          <div className="w-full space-y-4 text-left">
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-text-primary">
                <Globe size={16} />
              </div>
              <span className="truncate">{tool.url.replace('https://', '')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-text-primary">
                <Shield size={16} />
              </div>
              <span>Verified Secure</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-text-primary">
                <Zap size={16} />
              </div>
              <span>Highly Performant</span>
            </div>
          </div>

          <div className="mt-auto pt-8 w-full">
            <a 
              href={tool.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-primary-dark font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-white/5"
            >
              Visit Website
              <ExternalLink size={18} />
            </a>
          </div>
        </div>

        {/* Main Details (Right) */}
        <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
          <section className="mb-10">
            <div className="flex items-center gap-2 text-text-primary font-bold text-xs uppercase tracking-widest mb-4">
              <Info size={14} />
              Overview
            </div>
            <p className="text-lg text-text-secondary leading-relaxed">
              {tool.description}
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4">Features & Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tool.tags.map(tag => (
                <span key={tag} className="px-4 py-2 bg-surface text-text-secondary rounded-xl text-sm font-medium border border-border">
                  {tag}
                </span>
              ))}
              {tool.isNew && (
                <span className="px-4 py-2 bg-white text-black rounded-xl text-sm font-bold">
                  NEW RELEASE
                </span>
              )}
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl border border-border bg-surface/50">
              <h4 className="font-bold text-text-primary mb-2">Use Case</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                Perfect for teams looking to integrate advanced AI into their daily production pipeline.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-border bg-surface/50">
              <h4 className="font-bold text-text-primary mb-2">Pricing</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                Offers a free tier with premium options for power users and enterprise teams.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailsModal;