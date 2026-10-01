import React, { useState } from 'react';
import { DictionaryTerm } from '../types/dictionary';
import { DiagramViewer } from './DiagramViewer';
import {
  ArrowLeft,
  Bookmark,
  Volume2,
  CheckCircle,
  ExternalLink,
  BookOpen,
  HelpCircle,
  ChevronRight,
  Share2,
  Sparkles,
} from 'lucide-react';

interface TermDetailViewProps {
  term: DictionaryTerm;
  onBack: () => void;
  onSelectTerm: (term: DictionaryTerm) => void;
  allTerms: DictionaryTerm[];
  isBookmarked: boolean;
  onToggleBookmark: (termId: string) => void;
  isMastered: boolean;
  onToggleMastered: (termId: string) => void;
  languageMode: 'bilingual' | 'english' | 'hindi';
  speechSpeed: number;
}

export const TermDetailView: React.FC<TermDetailViewProps> = ({
  term,
  onBack,
  onSelectTerm,
  allTerms,
  isBookmarked,
  onToggleBookmark,
  isMastered,
  onToggleMastered,
  languageMode,
  speechSpeed,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Audio pronunciation via Web Speech API
  const handlePronounce = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(term.term);
      utterance.rate = speechSpeed || 0.95;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleShare = () => {
    const text = `${term.term} (${term.hindi}) - Physical Education Dictionary:\n${term.definition}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Find related terms
  const relatedTerms = allTerms.filter(t => term.relatedTermIds?.includes(t.id));

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-800 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Mark Mastered */}
          <button
            onClick={() => onToggleMastered(term.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isMastered
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <CheckCircle size={15} className={isMastered ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'} />
            <span>{isMastered ? 'Learned / Mastered' : 'Mark as Learned'}</span>
          </button>

          {/* Bookmark Toggle */}
          <button
            onClick={() => onToggleBookmark(term.id)}
            aria-label="Bookmark term"
            className={`p-2 rounded-lg border transition-all ${
              isBookmarked
                ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:border-rose-800'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            aria-label="Share term"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {copied && (
        <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-lg text-center">
          Term definition copied to clipboard!
        </div>
      )}

      {/* Main Term Hero Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header Titles */}
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">{term.category}</span>
            {term.subCategory && (
              <>
                <span aria-hidden="true">·</span>
                <span>{term.subCategory}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-slate-400">
              Levels: {term.level.join(', ')}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {term.term}
              </h1>

              {/* Hindi & Phonetics */}
              {(languageMode === 'bilingual' || languageMode === 'hindi') && (
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="text-xl sm:text-2xl font-bold text-sky-800 dark:text-sky-400 font-hindi">
                    {term.hindi}
                  </span>
                  {term.pronunciation && (
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono italic">
                      /{term.pronunciation}/
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Audio Button */}
            <button
              onClick={handlePronounce}
              title="Pronounce term"
              className={`p-3 rounded-xl border transition-all ${
                isPlayingAudio
                  ? 'bg-sky-600 text-white border-sky-600 animate-pulse'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-slate-700'
              }`}
            >
              <Volume2 size={22} />
            </button>
          </div>

          {/* Level Badges */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {term.level.map(lvl => (
              <span
                key={lvl}
                className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {lvl === 'Class' ? 'Class 11-12' : lvl === 'UG' ? 'UG (B.P.Ed)' : lvl === 'PG' ? 'PG (M.P.Ed)' : lvl}
              </span>
            ))}
            {term.synonyms.length > 0 && (
              <span className="px-2.5 py-0.5 rounded text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                Also known as: {term.synonyms.join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* Academic Definition */}
        <section className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Academic Definition
          </span>
          <p className="text-lg sm:text-xl text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
            {term.definition}
          </p>

          {term.detailedExplanation && (
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
              {term.detailedExplanation}
            </p>
          )}
        </section>

        {/* Formula Box if present */}
        {term.formula && (
          <div className="p-4 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-xl space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
              <Sparkles size={14} /> Mathematical / Scientific Formula
            </span>
            <div className="text-base sm:text-lg font-mono font-bold text-sky-950 dark:text-sky-100">
              {term.formula}
            </div>
          </div>
        )}

        {/* Practical Field Example */}
        <section className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Practical Sport &amp; Field Example
          </span>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border-l-4 border-sky-500 text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
            "{term.example}"
          </div>
        </section>

        {/* Exam Notes & High-Frequency Trap */}
        {term.examNotes && (
          <section className="space-y-2">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-950 dark:text-amber-200 leading-relaxed">
              <span className="font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5 mb-1 text-xs">
                <HelpCircle size={15} /> Exam Notes &amp; Previous Questions (TGT / PGT / CBSE)
              </span>
              {term.examNotes}
            </div>
          </section>
        )}

        {/* Real Interactive Scientific Illustration (Not empty placeholder!) */}
        <section className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Interactive Concept Diagram
          </span>
          <DiagramViewer
            type={term.diagramType || 'general'}
            title={term.diagramTitle || `${term.term} Visual Breakdown`}
            subtitle={term.diagramSubtitle}
          />
        </section>

        {/* Action Links & Citations */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Source Citation */}
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <BookOpen size={15} className="text-sky-600 shrink-0" />
            <span>
              <strong>Standard Source:</strong> {term.source}
            </span>
          </div>

          {/* YouTube Tutorial Link */}
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
              term.videoQuery || `${term.term} physical education lecture`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 font-semibold hover:bg-red-100 transition-colors"
          >
            <span>Watch Video Reference on YouTube</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Related Terms Navigation */}
      {relatedTerms.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
            Interconnected Syllabus Concepts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedTerms.map(rt => (
              <div
                key={rt.id}
                onClick={() => onSelectTerm(rt)}
                className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-sky-400 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                    {rt.term}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {rt.definition}
                  </p>
                </div>
                <ChevronRight size={18} className="text-slate-400 group-hover:text-sky-600 shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
