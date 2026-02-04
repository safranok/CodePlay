
import React, { useState } from 'react';
import { ChevronDown, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';

const TRENDS = [
  { id: 'video', title: 'Video Generation', content: 'Multi-model platforms offering access to Sora, Veo, and Runway in one place. Enhanced realism with film-grade lighting and physics. Audio generation is now standard in most pro tools.' },
  { id: 'text', title: 'Text & Writing', content: 'Shift from standalone tools to integrated features in existing platforms. Brand voice consistency is becoming standard. SEO optimization is now built-in.' },
  { id: 'art', title: 'Image & Art', content: 'Photorealism reaching near-perfect quality. Text rendering in images significantly improved. Real-time generation and editing are the new frontiers.' },
  { id: 'audio', title: 'Audio & Music', content: 'Full song generation with vocals now possible. Royalty-free licensing becoming standard. Integration with DAWs and production tools is increasing.' },
  { id: 'business', title: 'Business & Productivity', content: 'AI orchestration layers connecting multiple tools. Meeting transcription and sentiment analysis. Automated workflow builders.' },
  { id: 'data', title: 'Data & Research', content: 'Natural language queries replacing SQL. Automated data cleaning and preparation. Real-time insights and predictive analytics.' },
  { id: 'code', title: 'Code Development', content: 'Agent mode for autonomous code generation. Context-aware suggestions across entire codebases. Privacy-focused self-hosted options.' },
];

const CHECKLIST = [
  'Integration - Does it work with your existing tools?',
  'Pricing Model - Flat-rate, usage-based, or BYOK?',
  'Privacy & Security - Where is your data stored?',
  'Accuracy - How reliable are the outputs?',
  'Support - What level of customer service is available?',
  'Scalability - Can it grow with your needs?',
  'Compliance - Does it meet industry standards?',
  'Customization - Can you train it on your data?',
];

const TrendsSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-16 py-12">
      <section>
        <div className="flex items-center gap-3 mb-10">
          <TrendingUp className="text-primary" />
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Key Trends in AI Tools 2025</h2>
        </div>
        <div className="grid gap-4">
          {TRENDS.map((t) => (
            <div key={t.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <button 
                onClick={() => setOpenId(openId === t.id ? null : t.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="font-bold text-slate-900 dark:text-white">{t.title}</span>
                <ChevronDown className={`text-slate-400 transition-transform ${openId === t.id ? 'rotate-180' : ''}`} />
              </button>
              <div className={`transition-all duration-300 overflow-hidden ${openId === t.id ? 'max-h-96' : 'max-h-0'}`}>
                <div className="p-6 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  {t.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="bg-primary/5 dark:bg-primary/10 rounded-[2.5rem] p-10 border border-primary/10">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="text-primary" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Choosing the Right AI Tool</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CHECKLIST.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <CheckCircle2 className="text-primary shrink-0" size={24} />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrendsSection;
