import React, { useState, useEffect, useMemo } from 'react';
import { ComparisonData } from '../types';
import { CATEGORIES } from '../constants';
import { 
  ArrowRight, 
  ChevronDown, 
  Star, 
  Check, 
  X, 
  RefreshCw, 
  Trash2, 
  Share2, 
  Download, 
  Heart, 
  ArrowLeftRight, 
  GitCompare, 
  Sparkles, 
  Trophy 
} from 'lucide-react';
import { toolsData } from '../toolsData';

const CompareTools: React.FC = () => {
  const [tool1Id, setTool1Id] = useState<string>('');
  const [tool2Id, setTool2Id] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [recentComparisons, setRecentComparisons] = useState<string[][]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('compare_history');
    if (savedHistory) setRecentComparisons(JSON.parse(savedHistory));
  }, []);

  const allTools = useMemo(() => Object.values(toolsData.tools) as ComparisonData[], []);
  
  const tool1 = useMemo(() => allTools.find(t => t.id === tool1Id), [tool1Id, allTools]);
  const tool2 = useMemo(() => allTools.find(t => t.id === tool2Id), [tool2Id, allTools]);

  const filteredTool2Options = useMemo(() => {
    if (!tool1) return allTools;
    return allTools.filter(t => t.id !== tool1Id);
  }, [tool1Id, allTools, tool1]);

  const handleCompare = () => {
    if (!tool1Id || !tool2Id) return;
    setIsLoading(true);
    setShowResults(false);
    
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
      
      const newHistory = [[tool1Id, tool2Id], ...recentComparisons.filter(h => !(h.includes(tool1Id) && h.includes(tool2Id)))].slice(0, 10);
      setRecentComparisons(newHistory);
      localStorage.setItem('compare_history', JSON.stringify(newHistory));
    }, 1500);
  };

  const handleSwap = () => {
    const temp = tool1Id;
    setTool1Id(tool2Id);
    setTool2Id(temp);
  };

  const handleClear = () => {
    setTool1Id('');
    setTool2Id('');
    setShowResults(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star} 
            size={12} 
            className={star <= Math.round(rating / 2) ? "fill-white text-white" : "text-border"} 
          />
        ))}
      </div>
    );
  };

  const getWinner = () => {
    if (!tool1 || !tool2) return null;
    const t1Score = (Object.values(tool1.ratings) as number[]).reduce((a, b) => a + b, 0);
    const t2Score = (Object.values(tool2.ratings) as number[]).reduce((a, b) => a + b, 0);
    return t1Score >= t2Score ? tool1 : tool2;
  };

  const getTierColor = (tier: string) => {
    return 'bg-surface border border-border text-text-primary';
  };

  const getCategoryGradient = (cat: string) => {
    switch (cat) {
      case 'Video': return 'from-rose-600 to-rose-900';
      case 'Text': return 'from-blue-600 to-blue-900';
      case 'Art': return 'from-purple-600 to-purple-900';
      case 'Audio': return 'from-emerald-600 to-emerald-900';
      case 'Business': return 'from-orange-600 to-orange-900';
      case 'Data': return 'from-cyan-600 to-cyan-900';
      case 'Code': return 'from-yellow-600 to-yellow-900';
      default: return 'from-slate-700 to-slate-900';
    }
  };

  const loadPreset = (t1: string, t2: string) => {
    setTool1Id(t1);
    setTool2Id(t2);
    handleCompare();
  };

  return (
    <div className="animate-fade-in space-y-12">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden rounded-[3rem] bg-black border border-border shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 text-text-primary">Compare AI Tools</h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-12">Make informed decisions with detailed, feature-by-feature comparisons of the leading AI platforms.</p>
        
        {/* Tool Selection Area */}
        <div className="max-w-4xl mx-auto bg-surface p-8 rounded-[2.5rem] border border-border shadow-2xl flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 w-full text-left">
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-text-muted">Select First Tool</label>
            <div className="relative group">
              <select 
                value={tool1Id}
                onChange={(e) => setTool1Id(e.target.value)}
                className="w-full bg-background border border-border rounded-2xl py-4 px-6 text-text-primary appearance-none cursor-pointer focus:border-white transition-all font-semibold shadow-xl"
              >
                <option value="">-- Choose Tool 1 --</option>
                {allTools.map(t => (
                  <option key={t.id} value={t.id}>{t.name} • {t.category}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center justify-center p-4 bg-background border border-border rounded-full">
            <span className="text-2xl font-black italic text-text-primary">VS</span>
          </div>

          <div className="flex-1 w-full text-left">
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-text-muted">Select Second Tool</label>
            <div className="relative group">
              <select 
                value={tool2Id}
                onChange={(e) => setTool2Id(e.target.value)}
                className="w-full bg-background border border-border rounded-2xl py-4 px-6 text-text-primary appearance-none cursor-pointer focus:border-white transition-all font-semibold shadow-xl"
              >
                <option value="">-- Choose Tool 2 --</option>
                {filteredTool2Options.map(t => (
                  <option key={t.id} value={t.id}>{t.name} • {t.category}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button 
            onClick={handleCompare}
            disabled={!tool1Id || !tool2Id || isLoading}
            className={`px-12 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all transform hover:scale-105 active:scale-95 ${
              tool1Id && tool2Id && !isLoading 
                ? 'bg-white text-primary-dark hover:opacity-90' 
                : 'bg-surface text-text-muted cursor-not-allowed border border-border'
            }`}
          >
            {isLoading ? <RefreshCw className="animate-spin inline-block mr-2" /> : null}
            {isLoading ? 'Analyzing...' : 'Compare Now'}
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={handleSwap}
              className="p-4 bg-surface border border-border rounded-2xl hover:border-white transition-colors text-text-primary"
              title="Swap Tools"
            >
              <ArrowLeftRight size={24} />
            </button>
            <button 
              onClick={handleClear}
              className="p-4 bg-surface border border-border rounded-2xl hover:border-white transition-colors text-text-primary"
              title="Clear Selection"
            >
              <Trash2 size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Comparison Display Area */}
      {showResults && tool1 && tool2 && (
        <div className="space-y-16 animate-fade-in">
          {/* Main Info Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Tool 1 Info */}
            <div className="bg-surface rounded-[2.5rem] p-10 border border-border shadow-xl flex flex-col h-full hover:border-white transition-colors">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-4xl font-extrabold text-text-primary mb-2">{tool1.name}</h2>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryGradient(tool1.category)} uppercase tracking-widest`}>
                    {tool1.category}
                  </span>
                </div>
                <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase ${getTierColor(tool1.pricingTier)}`}>
                  {tool1.pricingTier}
                </div>
              </div>

              <p className="text-text-secondary mb-8 leading-relaxed">{tool1.description}</p>
              
              <div className="space-y-6 mb-10">
                <div className="p-5 bg-background rounded-2xl border border-border">
                  <span className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Pricing</span>
                  <span className="text-text-primary font-bold">{tool1.pricing}</span>
                </div>
                <div className="p-5 bg-background rounded-2xl border border-border">
                  <span className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Best For</span>
                  <span className="text-text-primary font-bold">{tool1.bestFor}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest">Performance Ratings</h4>
                {[
                  { label: 'Quality', val: tool1.ratings.quality },
                  { label: 'Ease of Use', val: tool1.ratings.easeOfUse },
                  { label: 'Value', val: tool1.ratings.value },
                  { label: 'Features', val: tool1.ratings.features },
                  { label: 'Support', val: tool1.ratings.support }
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">{r.label}</span>
                    <div className="flex items-center gap-3">
                      {renderStars(r.val)}
                      <span className="text-xs font-bold text-text-primary">{r.val}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Comparison Table */}
            <div className="flex flex-col justify-center gap-8 py-10">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-text-primary text-xs font-bold uppercase tracking-widest border border-white/10 mb-4 shadow-sm">
                  <GitCompare size={14} />
                  Comparison Snapshot
                </div>
                <h3 className="text-3xl font-black text-text-primary">The Verdict</h3>
              </div>

              <div className="bg-surface rounded-[2.5rem] border border-border shadow-2xl overflow-hidden divide-y divide-border">
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Generation Speed</span>
                      <div className="font-bold text-text-primary">{tool1.generationSpeed}</div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Generation Speed</span>
                      <div className="font-bold text-text-primary">{tool2.generationSpeed}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Difficulty</span>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold inline-block bg-background border border-border text-text-primary`}>{tool1.difficulty}</div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Difficulty</span>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold inline-block bg-background border border-border text-text-primary`}>{tool2.difficulty}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 p-10 text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary-dark text-3xl font-black shadow-xl mx-auto mb-6 transform hover:rotate-12 transition-transform">
                    <Trophy size={40} />
                  </div>
                  <h4 className="text-2xl font-black text-text-primary mb-2">Overall Winner</h4>
                  <div className="text-white font-black text-3xl mb-4 tracking-tight">
                    {getWinner()?.name}
                  </div>
                  <p className="text-sm text-text-secondary">Based on combined quality, features, and professional suitability scores.</p>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-2xl text-sm font-bold text-text-primary hover:border-white transition-all shadow-sm">
                  <Share2 size={16} /> Share
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-2xl text-sm font-bold text-text-primary hover:border-white transition-all shadow-sm">
                  <Download size={16} /> Export
                </button>
              </div>
            </div>

            {/* Tool 2 Info */}
            <div className="bg-surface rounded-[2.5rem] p-10 border border-border shadow-xl flex flex-col h-full hover:border-white transition-colors">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-4xl font-extrabold text-text-primary mb-2">{tool2.name}</h2>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryGradient(tool2.category)} uppercase tracking-widest`}>
                    {tool2.category}
                  </span>
                </div>
                <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase ${getTierColor(tool2.pricingTier)}`}>
                  {tool2.pricingTier}
                </div>
              </div>

              <p className="text-text-secondary mb-8 leading-relaxed">{tool2.description}</p>
              
              <div className="space-y-6 mb-10">
                <div className="p-5 bg-background rounded-2xl border border-border">
                  <span className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Pricing</span>
                  <span className="text-text-primary font-bold">{tool2.pricing}</span>
                </div>
                <div className="p-5 bg-background rounded-2xl border border-border">
                  <span className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Best For</span>
                  <span className="text-text-primary font-bold">{tool2.bestFor}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest">Performance Ratings</h4>
                {[
                  { label: 'Quality', val: tool2.ratings.quality },
                  { label: 'Ease of Use', val: tool2.ratings.easeOfUse },
                  { label: 'Value', val: tool2.ratings.value },
                  { label: 'Features', val: tool2.ratings.features },
                  { label: 'Support', val: tool2.ratings.support }
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">{r.label}</span>
                    <div className="flex items-center gap-3">
                      {renderStars(r.val)}
                      <span className="text-xs font-bold text-text-primary">{r.val}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pros & Cons Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-surface rounded-[2.5rem] p-10 border border-border shadow-xl">
              <h3 className="text-2xl font-bold mb-8 text-text-primary flex items-center gap-2">
                <Check className="text-white" /> Pros & <X className="text-text-muted" /> Cons: {tool1.name}
              </h3>
              <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Strength Factors</h4>
                  <ul className="space-y-3">
                    {tool1.pros.map((pro, i) => (
                      <li key={i} className="flex items-center gap-3 text-text-primary">
                        <Check size={18} className="text-white shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Limitations</h4>
                  <ul className="space-y-3">
                    {tool1.cons.map((con, i) => (
                      <li key={i} className="flex items-center gap-3 text-text-secondary">
                        <X size={18} className="text-text-muted shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-[2.5rem] p-10 border border-border shadow-xl">
              <h3 className="text-2xl font-bold mb-8 text-text-primary flex items-center gap-2">
                <Check className="text-white" /> Pros & <X className="text-text-muted" /> Cons: {tool2.name}
              </h3>
              <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Strength Factors</h4>
                  <ul className="space-y-3">
                    {tool2.pros.map((pro, i) => (
                      <li key={i} className="flex items-center gap-3 text-text-primary">
                        <Check size={18} className="text-white shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Limitations</h4>
                  <ul className="space-y-3">
                    {tool2.cons.map((con, i) => (
                      <li key={i} className="flex items-center gap-3 text-text-secondary">
                        <X size={18} className="text-text-muted shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Recommendations */}
          <div className="bg-surface rounded-[3rem] p-12 border border-border">
            <h3 className="text-3xl font-black text-text-primary mb-10 text-center">Smart Recommendation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-background p-8 rounded-[2rem] shadow-xl border border-border hover:border-white transition-colors">
                <h4 className="text-xl font-bold text-text-primary mb-4">Choose {tool1.name} if you...</h4>
                <ul className="space-y-4 mb-8">
                  {tool1.useCases.slice(0, 3).map((uc, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-text-primary shrink-0 mt-0.5">
                        <Check size={14} />
                      </div>
                      <span className="text-text-secondary">Need it for <strong>{uc}</strong> and prioritize professional quality.</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 bg-white text-primary-dark font-bold rounded-xl hover:opacity-90 transition-all">Try {tool1.name}</button>
              </div>

              <div className="bg-background p-8 rounded-[2rem] shadow-xl border border-border hover:border-white transition-colors">
                <h4 className="text-xl font-bold text-text-primary mb-4">Choose {tool2.name} if you...</h4>
                <ul className="space-y-4 mb-8">
                  {tool2.useCases.slice(0, 3).map((uc, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-text-primary shrink-0 mt-0.5">
                        <Check size={14} />
                      </div>
                      <span className="text-text-secondary">Are focused on <strong>{uc}</strong> and want a streamlined workflow.</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 bg-white text-primary-dark font-bold rounded-xl hover:opacity-90 transition-all">Try {tool2.name}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareTools;