import React from 'react';
import { DictionaryTerm, EducationLevel, Category } from '../types/dictionary';
import { CATEGORIES_LIST } from '../data/dictionaryData';
import {
  Search,
  BookOpen,
  Award,
  Bookmark,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Volume2,
  Clock,
  Zap,
  HelpCircle,
} from 'lucide-react';

interface DashboardViewProps {
  terms: DictionaryTerm[];
  onSelectTerm: (term: DictionaryTerm) => void;
  onNavigateToSearch: (initialQuery?: string) => void;
  onNavigateToCategories: () => void;
  onNavigateToQuiz: () => void;
  studentName: string;
  targetLevel: EducationLevel | 'All';
  bookmarkedIds: string[];
  masteredIds: string[];
  recentSearches: string[];
  recentViewedTerms: DictionaryTerm[];
  quizHighScore: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  terms,
  onSelectTerm,
  onNavigateToSearch,
  onNavigateToCategories,
  onNavigateToQuiz,
  studentName,
  targetLevel,
  bookmarkedIds,
  masteredIds,
  recentSearches,
  recentViewedTerms,
  quizHighScore,
}) => {
  // Pick Term of the Day deterministically based on date
  const termOfTheDay = React.useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    return terms[dayOfYear % terms.length] || terms[0];
  }, [terms]);

  const speakTerm = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  const levelLabel =
    targetLevel === 'All'
      ? 'Comprehensive All-Levels'
      : targetLevel === 'Class'
      ? 'CBSE Class 11-12 Boards'
      : targetLevel === 'UG'
      ? 'UG (B.P.Ed / University)'
      : targetLevel === 'PG'
      ? 'PG (M.P.Ed)'
      : targetLevel === 'TGT'
      ? 'TGT (KVS, NVS, DSSSB)'
      : 'PGT / UGC-NET';

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-800 relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-32 -bottom-16 w-48 h-48 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles size={14} />
            <span>Target Level: {levelLabel}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Welcome back, {studentName || 'Physical Education Scholar'}!
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Your encyclopedic dictionary and exam companion covering 120+ verified physical education terms across Exercise Physiology, Biomechanics, Sports Psychology, and Yoga.
          </p>

          {/* Quick Search Launcher Bar inside Hero */}
          <div className="pt-2">
            <div
              onClick={() => onNavigateToSearch('')}
              className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between cursor-pointer transition-all shadow-inner backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 text-slate-300">
                <Search size={20} className="text-sky-400" />
                <span className="text-xs sm:text-sm font-medium">
                  Search terms, physiology, levers, fixtures, or tests...
                </span>
              </div>
              <span className="text-[11px] font-bold bg-sky-500/20 text-sky-200 border border-sky-400/30 px-2 py-0.5 rounded">
                Live Search
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row inside Hero */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Terms in Library
            </span>
            <span className="text-2xl font-black text-sky-400 font-mono mt-0.5 block">
              {terms.length}
            </span>
            <span className="text-[10px] text-slate-400">11 Full Disciplines</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Terms Learned
            </span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-0.5 block">
              {masteredIds.length}
            </span>
            <span className="text-[10px] text-slate-400">
              {Math.round((masteredIds.length / terms.length) * 100)}% Mastered
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Bookmarked
            </span>
            <span className="text-2xl font-black text-rose-400 font-mono mt-0.5 block">
              {bookmarkedIds.length}
            </span>
            <span className="text-[10px] text-slate-400">Quick Revision List</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Quiz Accuracy
            </span>
            <span className="text-2xl font-black text-amber-400 font-mono mt-0.5 block">
              {quizHighScore > 0 ? `${quizHighScore}%` : '--'}
            </span>
            <span className="text-[10px] text-slate-400">Competitive Exam Score</span>
          </div>
        </div>
      </div>

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigateToSearch('')}
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-sky-400 dark:hover:border-sky-500 shadow-xs hover:shadow-sm text-left transition-all group flex items-start justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
              <Search size={20} />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              Dictionary Search
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Instant fuzzy search with typo tolerance and A–Z alphabetical index.
            </p>
          </div>
          <ChevronRight size={18} className="text-slate-300 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
        </button>

        <button
          onClick={onNavigateToQuiz}
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-amber-400 dark:hover:border-amber-500 shadow-xs hover:shadow-sm text-left transition-all group flex items-start justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <Award size={20} />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Exam Quiz &amp; Flashcards
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Dynamic practice tests with instant rationale and missed-terms review.
            </p>
          </div>
          <ChevronRight size={18} className="text-slate-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
        </button>

        <button
          onClick={onNavigateToCategories}
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-teal-400 dark:hover:border-teal-500 shadow-xs hover:shadow-sm text-left transition-all group flex items-start justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
              <BookOpen size={20} />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              Browse Categories
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              11 core domains including Kinesiology, Training Cycles, and Tournaments.
            </p>
          </div>
          <ChevronRight size={18} className="text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {/* Featured Term of the Day */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Term of the Day
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Category: {termOfTheDay.category}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {termOfTheDay.term}
              </h3>
              <span className="text-lg font-bold text-sky-700 dark:text-sky-400 font-hindi">
                {termOfTheDay.hindi}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2 max-w-2xl">
              {termOfTheDay.definition}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => speakTerm(termOfTheDay.term)}
              title="Pronounce term"
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Volume2 size={20} />
            </button>
            <button
              onClick={() => onSelectTerm(termOfTheDay)}
              className="px-5 py-3 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Explore Term Page</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Practical Example Snippet */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border-l-4 border-amber-500 text-xs italic text-slate-600 dark:text-slate-300">
          Field Example: "{termOfTheDay.example}"
        </div>
      </section>

      {/* High-Yield Exam Shortcuts */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            High-Yield Exam Fast Tracks
          </h2>
          <span className="text-xs text-slate-400">Frequently tested questions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              title: 'Class 12 Boards Core',
              query: 'lever',
              desc: 'Levers, Byes, Posture deformities & BMI formulas',
              tag: 'CBSE / NCERT',
            },
            {
              title: 'TGT / PGT Rapid Fire',
              query: 'cardiac output',
              desc: 'Cardiac output, SV, Vital capacity & Overload',
              tag: 'KVS / NVS / DSSSB',
            },
            {
              title: 'UGC-NET Biomechanics',
              query: 'newton',
              desc: 'Planes, Axes, Projectile motion & Center of Gravity',
              tag: 'NET / JRF',
            },
            {
              title: 'Yoga 8 Limbs & Asanas',
              query: 'ashtanga',
              desc: 'Patanjali Sutras, Yamas, Niyamas & Shatkarmas',
              tag: 'Yogic Sciences',
            },
          ].map(track => (
            <div
              key={track.title}
              onClick={() => onNavigateToSearch(track.query)}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 rounded-2xl cursor-pointer transition-all hover:shadow-xs group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                  {track.tag}
                </span>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {track.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {track.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Viewed Terms */}
      {recentViewedTerms.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <Clock size={15} />
            <span>Recently Studied Terms</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recentViewedTerms.slice(0, 3).map(term => (
              <div
                key={term.id}
                onClick={() => onSelectTerm(term)}
                className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-sky-400 transition-all flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {term.term}
                  </h4>
                  <span className="text-xs text-sky-700 dark:text-sky-400 font-hindi">
                    {term.hindi}
                  </span>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Artifact Questions & Collaborative Development Card */}
      <section className="p-5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-2xl text-xs space-y-2 text-sky-950 dark:text-sky-200">
        <div className="flex items-center gap-2 font-bold text-sky-900 dark:text-sky-300 text-sm">
          <HelpCircle size={16} />
          <span>Feedback &amp; Syllabus Customization</span>
        </div>
        <p className="leading-relaxed text-slate-700 dark:text-slate-300">
          PE-DICT is tailored for Indian &amp; international Physical Education syllabi (NCERT Class 11-12, UGC-NET, KVS/NVS/DSSSB TGT/PGT).
          Need specific state exam terms (e.g. UP TGT, Rajasthan PTI, Kerala SET), customized Hindi notes, or deeper biomechanical formulas? All terms and settings are stored locally in your browser.
        </p>
      </section>
    </div>
  );
};
