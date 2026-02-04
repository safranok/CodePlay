
import React from 'react';
import { CategoryId } from '../types';
import { CATEGORIES } from '../constants';
import { LayoutGrid } from 'lucide-react';

interface MobileNavProps {
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="lg:hidden sticky top-16 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar py-3 px-4 flex gap-2">
      <button
        onClick={() => onSelectCategory('all')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
          selectedCategory === 'all'
            ? 'bg-primary text-white shadow-lg shadow-primary/25'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
        }`}
      >
        <LayoutGrid size={16} />
        All
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
            selectedCategory === cat.id
              ? 'bg-primary text-white shadow-lg shadow-primary/25'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <span>{cat.emoji}</span>
          {cat.label.replace('AI ', '')}
        </button>
      ))}
    </div>
  );
};

export default MobileNav;
