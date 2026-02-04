
export type CategoryId = 
  | 'video' 
  | 'text' 
  | 'art' 
  | 'audio' 
  | 'business' 
  | 'data' 
  | 'code' 
  | 'new-launch'
  | 'all';

export type View = 'home' | 'category' | 'compare' | 'search';

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  description: string;
  color: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  categoryId: CategoryId;
  logo: string;
  tags: string[];
  keywords: string[]; 
  isNew?: boolean;
  isPremium?: boolean;
  url: string;
}

export interface ComparisonData {
  id: string;
  name: string;
  category: string;
  description: string;
  pricing: string;
  pricingTier: 'Budget-friendly' | 'Mid-range' | 'Premium' | 'Freemium';
  bestFor: string;
  keyFeatures: string[];
  pros: string[];
  cons: string[];
  useCases: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  generationSpeed: string;
  ratings: {
    quality: number;
    easeOfUse: number;
    value: number;
    features: number;
    support: number;
  };
}

export type SortOption = 'newest' | 'alphabetical';
