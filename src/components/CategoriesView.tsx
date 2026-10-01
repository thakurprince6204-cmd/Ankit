import React from 'react';
import { Category, DictionaryTerm } from '../types/dictionary';
import { CATEGORIES_LIST } from '../data/dictionaryData';
import {
  HeartPulse,
  Compass,
  Zap,
  Brain,
  Ruler,
  Bandage,
  ShieldCheck,
  Sun,
  Trophy,
  Apple,
  Flame,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface CategoriesViewProps {
  terms: DictionaryTerm[];
  onSelectCategory: (category: Category) => void;
  onSelectTerm: (term: DictionaryTerm) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  terms,
  onSelectCategory,
  onSelectTerm,
}) => {
  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case 'Physiology':
        return HeartPulse;
      case 'Biomechanics':
        return Compass;
      case 'Training':
        return Zap;
      case 'Sports Psychology':
        return Brain;
      case 'Measurement':
        return Ruler;
      case 'Sports Medicine':
        return Bandage;
      case 'Health & Posture':
        return ShieldCheck;
      case 'Yoga':
        return Sun;
      case 'Sports Management':
        return Trophy;
      case 'Nutrition & Doping':
        return Apple;
      case 'Olympism & History':
        return Flame;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Physical Education Disciplines
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Curated across CBSE Class 11-12, UGC-NET Physical Education, and TGT/PGT recruitment standards.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CATEGORIES_LIST.map(cat => {
          const Icon = getCategoryIcon(cat.id);
          const catTerms = terms.filter(t => t.category === cat.id);
          const sampleTerms = catTerms.slice(0, 4);

          return (
            <div
              key={cat.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-sky-400 dark:hover:border-sky-500 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-100 dark:border-sky-900">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        {cat.label}
                      </h3>
                      <span className="text-xs text-sky-800 dark:text-sky-400 font-hindi font-medium">
                        {cat.hindi}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                    {catTerms.length} Terms
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {cat.description}
                </p>

                {/* Sample Terms Chips */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {sampleTerms.map(st => (
                    <button
                      key={st.id}
                      onClick={() => onSelectTerm(st)}
                      className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700 hover:border-sky-400 hover:text-sky-600 transition-colors"
                    >
                      {st.term}
                    </button>
                  ))}
                  {catTerms.length > 4 && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 self-center">
                      +{catTerms.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectCategory(cat.id)}
                className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center justify-between group-hover:text-sky-700 transition-colors"
              >
                <span>Browse All {catTerms.length} Terms in this Domain</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
