import React from 'react';
import { Search, Moon, Sun, Menu, Bell } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery, isDark, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-30 glass border-b border-border py-3 lg:py-4 px-4 lg:px-10 flex items-center justify-between">
      <div className="lg:hidden flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-dark font-bold text-lg">
          C
        </div>
      </div>

      <div className="relative max-w-md w-full ml-4 lg:ml-0">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
        <input 
          type="text" 
          placeholder="Search AI tools..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface border border-border rounded-xl py-2.5 pl-11 pr-4 focus:border-white/50 transition-all text-sm outline-none text-text-primary placeholder-text-muted"
        />
      </div>

      <div className="flex items-center gap-2 lg:gap-4 ml-4">
        <button className="hidden sm:flex p-2.5 text-text-secondary hover:bg-surface rounded-xl transition-colors relative border border-transparent hover:border-border">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-white rounded-full border-2 border-background"></span>
        </button>
        <button className="hidden lg:flex px-5 py-2.5 bg-white text-primary-dark font-bold rounded-xl text-sm hover:bg-opacity-90 transition-opacity">
          Submit Tool
        </button>
      </div>
    </header>
  );
};

export default Header;