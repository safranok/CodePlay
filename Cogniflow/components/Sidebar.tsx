import React from 'react';
import { CategoryId, View } from '../types';
import { CATEGORIES } from '../constants';
import { ChevronRight, Home, Rocket, GitCompare, BookOpen } from 'lucide-react';

interface SidebarProps {
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  currentView: View;
  onSetView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, onSelectCategory, currentView, onSetView }) => {
  return (
    <aside className="w-[280px] fixed top-0 left-0 bottom-0 bg-surface border-r border-border p-8 hidden lg:block overflow-y-auto z-50">
      <div 
        className="flex items-center gap-2 mb-10 cursor-pointer" 
        onClick={() => onSetView('home')}
      >
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-dark font-bold text-xl shadow-lg">
          C
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">CogniFlow</h1>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4 px-4">
            Navigation
          </h2>
          <nav className="space-y-1">
            <button
              onClick={() => onSetView('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                currentView === 'home'
                  ? 'bg-primary text-primary-dark shadow-lg font-bold'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
              }`}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => onSelectCategory('new-launch')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                currentView === 'category' && selectedCategory === 'new-launch'
                  ? 'bg-primary text-primary-dark shadow-lg font-bold'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
              }`}
            >
              <Rocket size={20} />
              <span>New Launch</span>
            </button>
            <button
              onClick={() => onSetView('compare')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                currentView === 'compare'
                  ? 'bg-primary text-primary-dark shadow-lg font-bold'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
              }`}
            >
              <GitCompare size={20} />
              <span>Compare Tools</span>
            </button>
          </nav>
        </div>

        <div>
          <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4 px-4">
            Categories
          </h2>
          <nav className="space-y-1">
            {CATEGORIES.filter(c => c.id !== 'new-launch').map((category) => (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${
                  currentView === 'category' && selectedCategory === category.id
                    ? 'bg-primary-light text-text-primary font-bold border-l-4 border-primary'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary hover:translate-x-1'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{category.emoji}</span>
                  <span className="truncate text-sm">{category.label.replace('AI ', '')}</span>
                </div>
                <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${selectedCategory === category.id ? 'opacity-100' : ''}`} />
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      <div className="mt-auto pt-10 px-4">
        <div className="p-5 bg-background rounded-3xl border border-border">
          <p className="text-[11px] text-text-secondary leading-relaxed italic">
            "Your guide to the intelligence revolution."
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;