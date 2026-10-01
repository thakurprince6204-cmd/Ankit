import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DictionaryTerm, EducationLevel, Category, SearchResult } from '../types/dictionary';
import { CATEGORIES_LIST } from '../data/dictionaryData';
import { searchDictionary, highlightText, groupTermsAlphabetically } from '../utils/searchEngine';
import {
  Search,
  X,
  Bookmark,
  ChevronRight,
  Filter,
  History,
  Sparkles,
  ArrowRight,
  Layers,
  BookOpen,
} from 'lucide-react';

interface SearchViewProps {
  terms: DictionaryTerm[];
  onSelectTerm: (term: DictionaryTerm) => void;
  targetLevel: EducationLevel | 'All';
  bookmarkedIds: string[];
  recentSearches: string[];
  onAddRecentSearch: (query: string) => void;
  onClearRecentSearches: () => void;
  initialQuery?: string;
}

export const SearchView: React.FC<SearchViewProps> = ({
  terms,
  onSelectTerm,
  targetLevel,
  bookmarkedIds,
  recentSearches,
  onAddRecentSearch,
  onClearRecentSearches,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel | 'All'>(targetLevel);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Sync target level if changed from header
  useEffect(() => {
    setSelectedLevel(targetLevel);
  }, [targetLevel]);

  // Sync initial query
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  // Run search engine
  const searchOutput = useMemo(() => {
    return searchDictionary(terms, query, {
      level: selectedLevel,
      category: selectedCategory,
      bookmarkedIds,
      onlyBookmarked,
    });
  }, [terms, query, selectedLevel, selectedCategory, bookmarkedIds, onlyBookmarked]);

  const { results, didYouMean, queryWords } = searchOutput;

  // Group terms alphabetically when query is empty
  const alphabeticalGroups = useMemo(() => {
    if (query.trim().length > 0) return null;
    return groupTermsAlphabetically(
      results.map(r => r.term)
    );
  }, [query, results]);

  const availableLetters = useMemo(() => {
    if (!alphabeticalGroups) return [];
    return Object.keys(alphabeticalGroups).filter(l => alphabeticalGroups[l].length > 0);
  }, [alphabeticalGroups]);

  // Handle enter key to open top result
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && results.length > 0) {
      onAddRecentSearch(results[0].term.term);
      onSelectTerm(results[0].term);
    }
  };

  const handleSelectResult = (term: DictionaryTerm) => {
    onAddRecentSearch(term.term);
    onSelectTerm(term);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" size={22} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search 120+ terms, formulas, tests, byes, muscles (e.g., VO2, Lever, BMI, Harvard)..."
            className="w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
          />
          {query.length > 0 && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Typo Suggestion ("Did you mean?") */}
        {didYouMean && (
          <div className="flex items-center gap-2 text-xs bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 px-3 py-2 rounded-lg">
            <Sparkles size={14} className="text-amber-600 shrink-0" />
            <span>
              Did you mean:{' '}
              <button
                onClick={() => setQuery(didYouMean)}
                className="font-bold underline hover:text-amber-700 dark:hover:text-amber-300"
              >
                {didYouMean}
              </button>
              ?
            </span>
          </div>
        )}

        {/* Filter Chips Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            {(['All', 'Class', 'UG', 'PG', 'TGT', 'PGT'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  selectedLevel === lvl
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {lvl === 'All' ? 'All Levels' : lvl === 'Class' ? 'Class 11-12' : lvl}
              </button>
            ))}
          </div>

          {/* Category & Bookmark Filter */}
          <div className="flex items-center gap-2">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as any)}
              className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="All">All Categories ({CATEGORIES_LIST.length})</option>
              {CATEGORIES_LIST.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Bookmark Filter Button */}
            <button
              onClick={() => setOnlyBookmarked(!onlyBookmarked)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                onlyBookmarked
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Bookmark size={14} fill={onlyBookmarked ? 'currentColor' : 'none'} />
              <span>Saved ({bookmarkedIds.length})</span>
            </button>
          </div>
        </div>

        {/* Recent Searches Chips */}
        {recentSearches.length > 0 && query.length === 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs text-slate-500">
            <History size={14} className="shrink-0" />
            <span className="font-semibold shrink-0">Recent:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {recentSearches.map(s => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 whitespace-nowrap text-[11px]"
                >
                  {s}
                </button>
              ))}
              <button
                onClick={onClearRecentSearches}
                className="text-[10px] text-slate-400 hover:text-rose-600 ml-1 underline shrink-0"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* A-Z Index Bar (Shown when search query is empty) */}
      {alphabeticalGroups && availableLetters.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 shadow-xs">
          <div className="flex items-center justify-between gap-1 overflow-x-auto text-xs font-bold font-mono">
            <button
              onClick={() => setActiveLetter(null)}
              className={`px-2 py-1 rounded transition-colors ${
                activeLetter === null
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              ALL
            </button>
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(char => {
              const count = alphabeticalGroups[char]?.length || 0;
              const hasTerms = count > 0;
              return (
                <button
                  key={char}
                  disabled={!hasTerms}
                  onClick={() => setActiveLetter(char === activeLetter ? null : char)}
                  className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
                    activeLetter === char
                      ? 'bg-sky-600 text-white shadow-xs'
                      : hasTerms
                      ? 'text-slate-800 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800'
                      : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                  }`}
                  title={`${char}: ${count} terms`}
                >
                  {char}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Search Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <strong>{results.length}</strong> terms
          {query.trim() && ` matching "${query}"`}
          {activeLetter && ` beginning with "${activeLetter}"`}
        </span>
        {query.trim() && (
          <span className="text-[11px] text-slate-400">
            Press <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">Enter</kbd> to open top result
          </span>
        )}
      </div>

      {/* Results List */}
      {results.length > 0 ? (
        <div className="space-y-3">
          {/* Alphabetical View when empty search */}
          {alphabeticalGroups && !query.trim() ? (
            (activeLetter ? [activeLetter] : availableLetters).map(letter => {
              const letterTerms = alphabeticalGroups[letter] || [];
              if (letterTerms.length === 0) return null;

              return (
                <div key={letter} className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-black text-sm flex items-center justify-center font-mono">
                      {letter}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {letterTerms.length} {letterTerms.length === 1 ? 'term' : 'terms'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {letterTerms.map(term => (
                      <div
                        key={term.id}
                        onClick={() => handleSelectResult(term)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 rounded-xl p-4 cursor-pointer transition-all hover:shadow-xs group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                              {term.term}
                            </h3>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0">
                              {term.category}
                            </span>
                          </div>

                          <span className="text-xs text-sky-800 dark:text-sky-400 font-hindi font-medium block mt-0.5">
                            {term.hindi}
                          </span>

                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                            {term.definition}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                          <span className="font-mono">
                            {term.level.join(' · ')}
                          </span>
                          <span className="text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            View Study Page <ChevronRight size={14} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            /* Live Filtered Search Results */
            <div className="space-y-3">
              {results.map(({ term, snippet, matchType }) => {
                const highlightedName = highlightText(term.term, queryWords);
                const highlightedSnippet = highlightText(snippet, queryWords);

                return (
                  <div
                    key={term.id}
                    onClick={() => handleSelectResult(term)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 rounded-xl p-4 sm:p-5 cursor-pointer transition-all hover:shadow-xs group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {/* Title with highlighted text */}
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors flex items-center gap-2">
                          <span>
                            {highlightedName.map((part, i) =>
                              part.isMatch ? (
                                <mark key={i} className="bg-sky-200 dark:bg-sky-900 text-sky-900 dark:text-sky-100 rounded px-0.5">
                                  {part.text}
                                </mark>
                              ) : (
                                <span key={i}>{part.text}</span>
                              )
                            )}
                          </span>
                          {bookmarkedIds.includes(term.id) && (
                            <Bookmark size={14} className="text-rose-500 fill-rose-500 inline shrink-0" />
                          )}
                        </h3>

                        {/* Hindi Name */}
                        <span className="text-xs text-sky-800 dark:text-sky-400 font-hindi font-medium block mt-0.5">
                          {term.hindi}
                        </span>
                      </div>

                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider shrink-0">
                        {term.category}
                      </span>
                    </div>

                    {/* Snippet with highlighted matches */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {highlightedSnippet.map((part, i) =>
                        part.isMatch ? (
                          <mark key={i} className="bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-100 font-semibold rounded px-0.5">
                            {part.text}
                          </mark>
                        ) : (
                          <span key={i}>{part.text}</span>
                        )
                      )}
                    </p>

                    {/* Footer info: Levels & Example preview */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Syllabus Levels:</span>
                        <span>{term.level.join(', ')}</span>
                        {term.formula && (
                          <span className="text-sky-600 dark:text-sky-400 font-mono font-semibold">
                            · Formula Included
                          </span>
                        )}
                      </div>

                      <span className="text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore Full Term <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <BookOpen className="mx-auto text-slate-300 dark:text-slate-600" size={48} />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            No terms found matching "{query}"
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, clearing filters, or browsing the categories tab.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedLevel('All');
              setSelectedCategory('All');
              setOnlyBookmarked(false);
            }}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-semibold hover:bg-sky-700 transition-colors inline-block"
          >
            Reset All Search Filters
          </button>
        </div>
      )}
    </div>
  );
};
