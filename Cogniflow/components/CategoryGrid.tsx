import React from 'react';
import { CATEGORIES } from '../constants';
import { CategoryId } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory: (id: CategoryId) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-20 px-4 lg:px-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-bold text-text-primary mb-2">Browse by Category</h2>
          <p className="text-text-secondary">Targeted tools for specialized tasks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {CATEGORIES.map((cat) => (
          <div 
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="group relative bg-surface p-8 rounded-[2rem] border border-border hover:border-white transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-1 overflow-hidden"
          >
            {/* Visual Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${cat.color} opacity-[0.05] group-hover:opacity-15 rounded-bl-full transition-opacity duration-500`}></div>
            
            <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg`}>
              {cat.emoji}
            </div>

            <h3 className="text-2xl font-bold text-text-primary mb-3 transition-colors">
              {cat.label}
            </h3>
            
            <p className="text-text-secondary leading-relaxed mb-6">
              {cat.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-border">
              <span className="text-sm font-bold text-text-muted uppercase tracking-widest">
                20 Tools Available
              </span>
              <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-text-secondary group-hover:bg-white group-hover:text-primary-dark transition-all">
                <ArrowUpRight size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;