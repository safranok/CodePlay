import React from 'react';
import { Calendar, Layers, Search, ShieldCheck } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    { icon: <Calendar size={24} />, title: 'Regularly Updated', desc: 'Fresh content added monthly' },
    { icon: <Layers size={24} />, title: 'Categorized', desc: 'Easy navigation by use case' },
    { icon: <Search size={24} />, title: 'Comprehensive', desc: '140+ tools across 7 categories' },
    { icon: <ShieldCheck size={24} />, title: 'Free to Browse', desc: 'No hidden costs or paywalls' },
  ];

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 bg-surface rounded-3xl shadow-sm border border-border hover:border-white transition-all">
              <div className="w-16 h-16 rounded-2xl bg-white/5 text-white flex items-center justify-center mb-6 border border-white/10">
                {f.icon}
              </div>
              <h4 className="text-lg font-bold text-text-primary mb-2">{f.title}</h4>
              <p className="text-sm text-text-secondary">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;