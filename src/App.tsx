import React, { useState, useEffect } from 'react';
import { DictionaryTerm, UserPreferences, EducationLevel, Category } from './types/dictionary';
import { DICTIONARY_TERMS } from './data/dictionaryData';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { SearchView } from './components/SearchView';
import { TermDetailView } from './components/TermDetailView';
import { CategoriesView } from './components/CategoriesView';
import { QuizView } from './components/QuizView';
import { SettingsView } from './components/SettingsView';

const STORAGE_KEY = 'pe_dict_user_preferences_v2';

const defaultPreferences: UserPreferences = {
  name: 'Student',
  targetLevel: 'All',
  languageMode: 'bilingual',
  theme: 'light',
  textSize: 'normal',
  speechSpeed: 1.0,
  bookmarkedIds: ['cardiac-output', 'first-class-lever', 'harvard-step-test', 'bye', 'ashtanga-yoga'],
  masteredIds: ['cardiac-output', 'newtons-first-law'],
  recentSearches: ['Cardiac Output', 'Lever', 'Harvard Step Test', 'Lordosis'],
  recentViewedIds: ['cardiac-output', 'first-class-lever', 'ashtanga-yoga'],
  quizHistory: [],
};

export default function App() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultPreferences, ...parsed };
      }
    } catch {
      // Fallback
    }
    return defaultPreferences;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'search' | 'categories' | 'quiz' | 'settings'>('dashboard');
  const [selectedTerm, setSelectedTerm] = useState<DictionaryTerm | null>(null);
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');

  // Persist preferences in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Storage error
    }
  }, [preferences]);

  // Synchronize dark theme class on document element
  useEffect(() => {
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.theme]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const handleSelectTerm = (term: DictionaryTerm) => {
    setSelectedTerm(term);
    // Add to recently viewed without duplicates
    setPreferences(prev => {
      const nextViewed = [term.id, ...prev.recentViewedIds.filter(id => id !== term.id)].slice(0, 10);
      return { ...prev, recentViewedIds: nextViewed };
    });
  };

  const handleToggleBookmark = (termId: string) => {
    setPreferences(prev => {
      const isBookmarked = prev.bookmarkedIds.includes(termId);
      const nextBookmarks = isBookmarked
        ? prev.bookmarkedIds.filter(id => id !== termId)
        : [...prev.bookmarkedIds, termId];
      return { ...prev, bookmarkedIds: nextBookmarks };
    });
  };

  const handleToggleMastered = (termId: string) => {
    setPreferences(prev => {
      const isMastered = prev.masteredIds.includes(termId);
      const nextMastered = isMastered
        ? prev.masteredIds.filter(id => id !== termId)
        : [...prev.masteredIds, termId];
      return { ...prev, masteredIds: nextMastered };
    });
  };

  const handleAddRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setPreferences(prev => {
      const nextRecent = [trimmed, ...prev.recentSearches.filter(q => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
      return { ...prev, recentSearches: nextRecent };
    });
  };

  const handleClearRecentSearches = () => {
    setPreferences(prev => ({ ...prev, recentSearches: [] }));
  };

  const handleRecordQuizResult = (score: number, total: number, level: string, category: string) => {
    setPreferences(prev => {
      const newRecord = {
        id: `quiz-${Date.now()}`,
        date: new Date().toISOString(),
        score,
        total,
        level,
        category,
      };
      return {
        ...prev,
        quizHistory: [newRecord, ...prev.quizHistory].slice(0, 20),
      };
    });
  };

  const handleResetData = () => {
    setPreferences(defaultPreferences);
    setSelectedTerm(null);
  };

  // Navigate to search with initial query
  const handleNavigateToSearch = (query?: string) => {
    setSelectedTerm(null);
    setSearchInitialQuery(query || '');
    setActiveTab('search');
  };

  const handleSelectCategoryFromBrowse = (category: Category) => {
    setSelectedTerm(null);
    setSearchInitialQuery('');
    setActiveTab('search');
  };

  // Compute Recently Viewed Terms objects
  const recentViewedTerms = React.useMemo(() => {
    return preferences.recentViewedIds
      .map(id => DICTIONARY_TERMS.find(t => t.id === id))
      .filter((t): t is DictionaryTerm => Boolean(t));
  }, [preferences.recentViewedIds]);

  // Compute best quiz percentage
  const quizHighScore = React.useMemo(() => {
    if (preferences.quizHistory.length === 0) return 85; // Initial benchmark
    return Math.max(...preferences.quizHistory.map(q => Math.round((q.score / q.total) * 100)));
  }, [preferences.quizHistory]);

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200`}>
      {/* Universal 3-Zone Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={tab => {
          setSelectedTerm(null);
          setActiveTab(tab);
        }}
        targetLevel={preferences.targetLevel}
        setTargetLevel={lvl => updatePreferences({ targetLevel: lvl })}
        bookmarkCount={preferences.bookmarkedIds.length}
        theme={preferences.theme}
        setTheme={th => updatePreferences({ theme: th })}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6">
        {selectedTerm ? (
          /* Term Detail Page */
          <TermDetailView
            term={selectedTerm}
            onBack={() => setSelectedTerm(null)}
            onSelectTerm={handleSelectTerm}
            allTerms={DICTIONARY_TERMS}
            isBookmarked={preferences.bookmarkedIds.includes(selectedTerm.id)}
            onToggleBookmark={handleToggleBookmark}
            isMastered={preferences.masteredIds.includes(selectedTerm.id)}
            onToggleMastered={handleToggleMastered}
            languageMode={preferences.languageMode}
            speechSpeed={preferences.speechSpeed}
          />
        ) : (
          /* Tab Views */
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                terms={DICTIONARY_TERMS}
                onSelectTerm={handleSelectTerm}
                onNavigateToSearch={handleNavigateToSearch}
                onNavigateToCategories={() => {
                  setSelectedTerm(null);
                  setActiveTab('categories');
                }}
                onNavigateToQuiz={() => {
                  setSelectedTerm(null);
                  setActiveTab('quiz');
                }}
                studentName={preferences.name}
                targetLevel={preferences.targetLevel}
                bookmarkedIds={preferences.bookmarkedIds}
                masteredIds={preferences.masteredIds}
                recentSearches={preferences.recentSearches}
                recentViewedTerms={recentViewedTerms}
                quizHighScore={quizHighScore}
              />
            )}

            {activeTab === 'search' && (
              <SearchView
                terms={DICTIONARY_TERMS}
                onSelectTerm={handleSelectTerm}
                targetLevel={preferences.targetLevel}
                bookmarkedIds={preferences.bookmarkedIds}
                recentSearches={preferences.recentSearches}
                onAddRecentSearch={handleAddRecentSearch}
                onClearRecentSearches={handleClearRecentSearches}
                initialQuery={searchInitialQuery}
              />
            )}

            {activeTab === 'categories' && (
              <CategoriesView
                terms={DICTIONARY_TERMS}
                onSelectCategory={handleSelectCategoryFromBrowse}
                onSelectTerm={handleSelectTerm}
              />
            )}

            {activeTab === 'quiz' && (
              <QuizView
                terms={DICTIONARY_TERMS}
                onSelectTerm={handleSelectTerm}
                targetLevel={preferences.targetLevel}
                onRecordQuizResult={handleRecordQuizResult}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                preferences={preferences}
                onUpdatePreferences={updatePreferences}
                onResetData={handleResetData}
                onClearRecentSearches={handleClearRecentSearches}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200">PE-DICT</span> · Physical Education Dictionary &amp; Exam Companion
            <span className="hidden sm:inline"> — Aligned with NCERT, UGC-NET, KVS/NVS/DSSSB Standards</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Local Browser Cache Storage</span>
            <span aria-hidden="true">·</span>
            <span>Bilingual English &amp; हिन्दी</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
