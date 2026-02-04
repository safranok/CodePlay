import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Hero from './components/Hero';
import ToolCard from './components/ToolCard';
import MobileNav from './components/MobileNav';
import CategoryGrid from './components/CategoryGrid';
import FeaturesSection from './components/FeaturesSection';
import SearchResults from './components/SearchResults';
import CompareTools from './components/CompareTools';
import ToolDetailsModal from './components/ToolDetailsModal';
import Hyperspeed from './components/Hyperspeed';
import { hyperspeedPresets } from './data/hyperspeedPresets';
import { CategoryId, SortOption, View, Tool } from './types';
import { CATEGORIES, TOOLS } from './constants';
import { ChevronDown, Filter, Search, Sparkles, BookOpen, LayoutGrid, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [isDark, setIsDark] = useState(true); 
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeCategory = useMemo(() => 
    CATEGORIES.find(c => c.id === selectedCategory), 
    [selectedCategory]
  );

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    const scoredTools = TOOLS.map(tool => {
      let score = 0;
      if (tool.name.toLowerCase() === query) score += 100;
      else if (tool.name.toLowerCase().includes(query)) score += 50;
      const cat = CATEGORIES.find(c => c.id === tool.categoryId);
      if (cat?.label.toLowerCase().includes(query)) score += 30;
      if (tool.keywords.some(k => k.toLowerCase() === query)) score += 40;
      else if (tool.keywords.some(k => k.toLowerCase().includes(query))) score += 20;
      if (tool.tags.some(t => t.toLowerCase().includes(query))) score += 15;
      if (tool.description.toLowerCase().includes(query)) score += 5;
      return { tool, score };
    });
    return scoredTools
      .filter(st => st.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(st => st.tool);
  }, [searchQuery]);

  const categoryTools = useMemo(() => {
    let result = TOOLS.filter(tool => {
      const matchesCategory = selectedCategory === 'all' || tool.categoryId === selectedCategory;
      return matchesCategory;
    });
    if (sortOption === 'newest') {
      result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [selectedCategory, sortOption]);

  const handleSelectCategory = (id: CategoryId) => {
    setSelectedCategory(id);
    setView('category');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.trim()) setView('search');
    else if (view === 'search') setView('home');
  };

  const selectedTool = useMemo(() => 
    TOOLS.find(t => t.id === selectedToolId) || null, 
    [selectedToolId]
  );

  return (
    <div className="min-h-screen bg-background text-text-primary transition-colors duration-300 relative overflow-x-hidden">
      {/* Background Animation */}
      {view === 'home' && (
        <div 
          className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none transition-opacity duration-300 hidden sm:block"
          style={{ opacity: Math.max(0.2, 0.5 - scrollY / 1000) }}
        >
          <Hyperspeed effectOptions={hyperspeedPresets.one} />
        </div>
      )}

      <Sidebar 
        selectedCategory={selectedCategory} 
        onSelectCategory={handleSelectCategory} 
        currentView={view}
        onSetView={(v) => { setView(v); setSelectedCategory('all'); setSearchQuery(''); }}
      />

      <div className="lg:ml-[280px] flex flex-col min-h-screen relative z-10">
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={handleSearch} 
          isDark={isDark} 
          toggleTheme={() => {}} 
        />

        <MobileNav 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleSelectCategory} 
        />

        <main className="flex-grow w-full relative z-20">
          {view === 'home' && (
            <div className="animate-fade-in">
              <Hero 
                searchQuery={searchQuery} 
                setSearchQuery={handleSearch} 
                onExplore={() => setView('category')} 
              />
              <CategoryGrid onSelectCategory={handleSelectCategory} />
              <FeaturesSection />
            </div>
          )}

          {view === 'search' && (
            <div className="px-4 lg:px-10 max-w-7xl mx-auto w-full pt-12">
              <SearchResults 
                query={searchQuery} 
                tools={searchResults} 
                onShowDetails={setSelectedToolId} 
                onClear={() => { setView('home'); setSearchQuery(''); }}
                onSelectCategory={handleSelectCategory}
              />
            </div>
          )}

          {view === 'compare' && (
            <div className="px-4 lg:px-10 max-w-7xl mx-auto w-full pt-20 pb-20">
              <CompareTools />
            </div>
          )}

          {view === 'category' && (
            <div className="px-4 lg:px-10 max-w-7xl mx-auto w-full pb-20 animate-fade-in">
              <div className="pt-12 pb-10 border-b border-border mb-10">
                <button 
                  onClick={() => setView('home')}
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
                >
                  <ArrowLeft size={16} /> Back to Dashboard
                </button>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h1 className="text-4xl lg:text-6xl font-extrabold text-text-primary tracking-tight mb-4">
                      {selectedCategory === 'all' ? 'All AI Tools' : activeCategory?.label}
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl">
                      {selectedCategory === 'all' 
                        ? 'Exploring 140+ premium AI tools across the entire CogniFlow network.' 
                        : activeCategory?.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <button className="flex items-center gap-2 px-5 py-3 bg-surface border border-border rounded-2xl text-sm font-bold text-text-primary hover:bg-surface-hover transition-colors shadow-sm">
                        <Filter size={16} />
                        <span>{sortOption === 'newest' ? 'Newest first' : 'A-Z'}</span>
                        <ChevronDown size={14} className="text-text-muted" />
                      </button>
                      <div className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-2xl shadow-2xl border border-border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-40">
                        <button onClick={() => setSortOption('newest')} className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 text-text-primary">Newest first</button>
                        <button onClick={() => setSortOption('alphabetical')} className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 text-text-primary">Alphabetical</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {categoryTools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-10">
                  {categoryTools.map((tool, index) => (
                    <ToolCard key={tool.id} tool={tool} index={index} onShowDetails={setSelectedToolId} />
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center">
                  <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6 text-text-muted">
                    <Search size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary mb-2">No matching tools</h3>
                  <p className="text-text-secondary">Try adjusting your search terms or filters.</p>
                </div>
              )}
            </div>
          )}
        </main>

        <footer className="p-10 border-t border-border bg-black relative z-30">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-dark font-bold text-lg">C</div>
                <span className="font-bold text-text-primary">CogniFlow</span>
              </div>
              <p className="text-sm text-text-secondary">Discovering the best AI tools for creators and enterprises.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <button onClick={() => setView('home')} className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">Home</button>
              <button onClick={() => {setView('category'); setSelectedCategory('all');}} className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">Directory</button>
              <button onClick={() => setView('compare')} className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">Compare</button>
              <a href="#" className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">Contact</a>
            </div>
            <div className="flex flex-col md:items-end gap-2">
              <p className="text-xs text-text-muted">Last Updated: February 2025</p>
              <p className="text-xs text-text-muted">© 2024 CogniFlow. High fidelity AI tool discovery.</p>
            </div>
          </div>
        </footer>
      </div>

      {selectedTool && (
        <ToolDetailsModal tool={selectedTool} onClose={() => setSelectedToolId(null)} />
      )}
    </div>
  );
};

export default App;