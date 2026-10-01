import React from 'react';
import { EducationLevel } from '../types/dictionary';
import { Search, Bookmark, BookOpen, Layers, Award, Settings, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'search' | 'categories' | 'quiz' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'search' | 'categories' | 'quiz' | 'settings') => void;
  targetLevel: EducationLevel | 'All';
  setTargetLevel: (level: EducationLevel | 'All') => void;
  bookmarkCount: number;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  targetLevel,
  setTargetLevel,
  bookmarkCount,
  theme,
  setTheme,
}) => {
  const levels: Array<{ id: EducationLevel | 'All'; label: string }> = [
    { id: 'All', label: 'All Levels' },
    { id: 'Class', label: 'Class 11-12' },
    { id: 'UG', label: 'UG (B.P.Ed)' },
    { id: 'PG', label: 'PG (M.P.Ed)' },
    { id: 'TGT', label: 'TGT Exams' },
    { id: 'PGT', label: 'PGT / NET' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand Wordmark */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="text-left group flex items-center gap-2.5 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-sky-600 dark:bg-sky-500 text-white flex items-center justify-center font-black text-lg shadow-xs group-hover:scale-105 transition-transform">
            PE
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white block leading-none">
              PE-DICT
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              Physical Education Dictionary
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BookOpen },
            { id: 'search', label: 'Search Engine', icon: Search },
            { id: 'categories', label: 'Categories', icon: Layers },
            { id: 'quiz', label: 'Exam Quiz', icon: Award },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Level Filter & Actions */}
        <div className="flex items-center gap-2">
          {/* Level Dropdown */}
          <select
            value={targetLevel}
            onChange={e => setTargetLevel(e.target.value as any)}
            aria-label="Target Education Level"
            className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {levels.map(l => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>

          {/* Quick Bookmark View Trigger */}
          <button
            onClick={() => {
              setActiveTab('search');
            }}
            title="Bookmarked terms"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
          >
            <Bookmark size={18} />
            {bookmarkCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle theme"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden flex justify-around items-center border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-1.5 px-2">
        {[
          { id: 'dashboard', label: 'Home', icon: BookOpen },
          { id: 'search', label: 'Search', icon: Search },
          { id: 'categories', label: 'Topics', icon: Layers },
          { id: 'quiz', label: 'Quiz', icon: Award },
          { id: 'settings', label: 'More', icon: Settings },
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-bold transition-all ${
                isActive
                  ? 'text-sky-600 dark:text-sky-400 font-extrabold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon size={18} className="mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
