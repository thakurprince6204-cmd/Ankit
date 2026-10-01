import React, { useState, useMemo } from 'react';
import { DictionaryTerm, EducationLevel, Category, QuizQuestion } from '../types/dictionary';
import { CATEGORIES_LIST } from '../data/dictionaryData';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronRight,
  BookOpen,
  Sparkles,
  HelpCircle,
  Layers,
  Repeat,
} from 'lucide-react';

interface QuizViewProps {
  terms: DictionaryTerm[];
  onSelectTerm: (term: DictionaryTerm) => void;
  targetLevel: EducationLevel | 'All';
  onRecordQuizResult: (score: number, total: number, level: string, category: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  terms,
  onSelectTerm,
  targetLevel,
  onRecordQuizResult,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel | 'All'>(targetLevel);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [activeMode, setActiveMode] = useState<'quiz' | 'flashcards'>('quiz');

  // Active quiz state
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [missedTermIds, setMissedTermIds] = useState<string[]>([]);

  // Flashcard state
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  // Filter pool of terms
  const eligibleTerms = useMemo(() => {
    return terms.filter(t => {
      const matchLevel = selectedLevel === 'All' || t.level.includes(selectedLevel);
      const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
      return matchLevel && matchCat;
    });
  }, [terms, selectedLevel, selectedCategory]);

  // Generate dynamic quiz questions from dictionary terms
  const startQuiz = () => {
    if (eligibleTerms.length < 4) return;

    // Shuffle and pick pool
    const shuffled = [...eligibleTerms].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    const generatedQuestions: QuizQuestion[] = selected.map((term, index) => {
      // Pick 3 distractors from terms of same or other categories
      const otherTerms = terms.filter(t => t.id !== term.id).sort(() => 0.5 - Math.random());
      const distractorDefs = otherTerms.slice(0, 3).map(ot => ot.definition);

      // Correct answer definition
      const allOptions = [term.definition, ...distractorDefs];
      // Shuffle options and remember where correct one landed
      const shuffledOptions = allOptions
        .map(opt => ({ opt, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(item => item.opt);

      const correctIndex = shuffledOptions.indexOf(term.definition);

      return {
        id: `q-${index}`,
        termId: term.id,
        termName: term.term,
        question: `Which of the following statements is the correct academic definition of "${term.term}" (${term.hindi})?`,
        options: shuffledOptions,
        correctIndex,
        explanation: `${term.definition} Practical application: ${term.example} Source: ${term.source}`,
        level: term.level,
        category: term.category,
      };
    });

    setQuestions(generatedQuestions);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsFinished(false);
    setMissedTermIds([]);
    setIsQuizActive(true);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(index);
    setIsAnswerSubmitted(true);

    const currentQ = questions[currentIndex];
    if (index === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    } else {
      setMissedTermIds(prev => [...prev, currentQ.termId]);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
      onRecordQuizResult(score + (selectedAnswer === questions[currentIndex].correctIndex ? 0 : 0), questions.length, selectedLevel, selectedCategory);
    }
  };

  // Flashcard items
  const flashcardTerms = eligibleTerms;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Exam Preparation &amp; Quiz Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Test and consolidate your Physical Education terminology for CBSE, TGT, PGT, and UGC-NET.
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => {
              setActiveMode('quiz');
              setIsQuizActive(false);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMode === 'quiz' ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Practice Quiz
          </button>
          <button
            onClick={() => {
              setActiveMode('flashcards');
              setIsQuizActive(false);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMode === 'flashcards' ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Flashcards
          </button>
        </div>
      </div>

      {/* QUIZ MODE */}
      {activeMode === 'quiz' && (
        <>
          {!isQuizActive ? (
            /* Quiz Setup Card */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Award size={26} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Configure Physical Education Quiz
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Questions are dynamically synthesized with authentic distractors from your syllabus.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* Level selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Target Syllabus Level:
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={e => setSelectedLevel(e.target.value as any)}
                    className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200"
                  >
                    <option value="All">All Levels (Comprehensive)</option>
                    <option value="Class">Class 11 &amp; 12 Boards</option>
                    <option value="UG">UG (B.P.Ed / University)</option>
                    <option value="PG">PG (M.P.Ed)</option>
                    <option value="TGT">TGT (KVS / NVS / DSSSB)</option>
                    <option value="PGT">PGT / UGC-NET Exam</option>
                  </select>
                </div>

                {/* Category selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Subject Domain:
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value as any)}
                    className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200"
                  >
                    <option value="All">All Disciplines (Mixed)</option>
                    {CATEGORIES_LIST.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Count selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Number of Questions:
                  </label>
                  <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
                    {[5, 10, 15].map(cnt => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setQuestionCount(cnt)}
                        className={`flex-1 py-1.5 rounded-md transition-all ${
                          questionCount === cnt
                            ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-xs font-bold'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {cnt} Questions
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {eligibleTerms.length} terms available in this selection
                </span>

                <button
                  disabled={eligibleTerms.length < 4}
                  onClick={startQuiz}
                  className="px-6 py-3 bg-sky-600 text-white rounded-xl text-sm font-bold shadow-xs hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  <span>Start PE Mastery Quiz</span>
                </button>
              </div>
            </div>
          ) : isFinished ? (
            /* Quiz Results Summary */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xs text-center space-y-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/60 border-4 border-emerald-500 flex items-center justify-center text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {score}/{questions.length}
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {score === questions.length
                    ? 'Outstanding! 100% Mastery'
                    : score >= questions.length * 0.7
                    ? 'Well Done! Solid Understanding'
                    : 'Good Effort! Keep Revising'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  You scored {Math.round((score / questions.length) * 100)}% on the {selectedLevel} syllabus quiz.
                </p>
              </div>

              {/* Missed Terms Review */}
              {missedTermIds.length > 0 && (
                <div className="text-left bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Recommended Terms to Review ({missedTermIds.length})
                  </h4>
                  <div className="space-y-2">
                    {missedTermIds.map(tid => {
                      const missedTerm = terms.find(t => t.id === tid);
                      if (!missedTerm) return null;
                      return (
                        <div
                          key={tid}
                          onClick={() => onSelectTerm(missedTerm)}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between cursor-pointer hover:border-sky-400 transition-colors"
                        >
                          <div>
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {missedTerm.term}
                            </span>
                            <span className="text-[11px] text-sky-800 dark:text-sky-400 font-hindi ml-2">
                              {missedTerm.hindi}
                            </span>
                          </div>
                          <span className="text-xs text-sky-600 font-semibold flex items-center gap-1">
                            Review <ChevronRight size={14} />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={startQuiz}
                  className="px-6 py-2.5 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw size={15} />
                  <span>Try Another Quiz</span>
                </button>
                <button
                  onClick={() => setIsQuizActive(false)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Back to Setup
                </button>
              </div>
            </div>
          ) : (
            /* Active Question Card */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              {/* Question Header & Progress Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider font-mono">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <span>Score: {score}</span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    className="bg-sky-600 h-full transition-all duration-300"
                  />
                </div>
              </div>

              {/* Question Text */}
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                {questions[currentIndex]?.question}
              </h2>

              {/* 4 Options */}
              <div className="space-y-2.5">
                {questions[currentIndex]?.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === questions[currentIndex].correctIndex;

                  let optClass = 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-sky-400';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      optClass = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-medium';
                    } else if (isSelected && !isCorrect) {
                      optClass = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-950 dark:text-rose-100';
                    } else {
                      optClass = 'opacity-60 border-slate-200 dark:border-slate-800 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 text-left rounded-xl border text-xs sm:text-sm leading-relaxed transition-all flex items-start gap-3 ${optClass}`}
                    >
                      <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {isAnswerSubmitted && isSelected && !isCorrect && (
                        <XCircle size={18} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Answer Explanation & Next Button */}
              {isAnswerSubmitted && (
                <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs text-sky-950 dark:text-sky-200 uppercase tracking-wider block">
                        Detailed Academic Explanation
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                        {questions[currentIndex]?.explanation}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2 bg-sky-600 text-white rounded-lg text-xs font-bold hover:bg-sky-700 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>{currentIndex + 1 === questions.length ? 'View Final Results' : 'Next Question'}</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* FLASHCARD MODE */}
      {activeMode === 'flashcards' && (
        <div className="space-y-4">
          {flashcardTerms.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-500 font-semibold font-mono">
                <span>
                  Card {flashcardIndex + 1} of {flashcardTerms.length}
                </span>
                <span>Click card to flip</span>
              </div>

              {/* Card Container */}
              <div
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-sky-400 rounded-3xl p-8 sm:p-12 text-center min-h-[300px] flex flex-col items-center justify-center cursor-pointer transition-all shadow-xs"
              >
                {!isCardFlipped ? (
                  /* Front */
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {flashcardTerms[flashcardIndex].category}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                      {flashcardTerms[flashcardIndex].term}
                    </h2>
                    <span className="text-xl text-sky-700 dark:text-sky-400 font-hindi font-bold block">
                      {flashcardTerms[flashcardIndex].hindi}
                    </span>
                    <p className="text-xs text-slate-400 pt-4 flex items-center justify-center gap-1">
                      <Repeat size={14} /> Click to flip and reveal definition &amp; example
                    </p>
                  </div>
                ) : (
                  /* Back */
                  <div className="space-y-4 text-left max-w-lg">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Definition:</span>
                      <p className="text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed mt-0.5">
                        {flashcardTerms[flashcardIndex].definition}
                      </p>
                    </div>

                    {flashcardTerms[flashcardIndex].formula && (
                      <div className="p-2.5 bg-sky-50 dark:bg-sky-950/60 rounded-lg border border-sky-200 dark:border-sky-800 text-xs font-mono font-bold text-sky-900 dark:text-sky-200">
                        {flashcardTerms[flashcardIndex].formula}
                      </div>
                    )}

                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs italic text-slate-600 dark:text-slate-300">
                      "{flashcardTerms[flashcardIndex].example}"
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onSelectTerm(flashcardTerms[flashcardIndex]);
                      }}
                      className="text-xs font-bold text-sky-600 hover:underline inline-flex items-center gap-1"
                    >
                      Open Full Term Page <ChevronRight size={13} />
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between">
                <button
                  disabled={flashcardIndex === 0}
                  onClick={() => {
                    setFlashcardIndex(prev => prev - 1);
                    setIsCardFlipped(false);
                  }}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40"
                >
                  Previous Card
                </button>

                <button
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  {isCardFlipped ? 'Show Front' : 'Show Definition'}
                </button>

                <button
                  disabled={flashcardIndex + 1 === flashcardTerms.length}
                  onClick={() => {
                    setFlashcardIndex(prev => prev + 1);
                    setIsCardFlipped(false);
                  }}
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-semibold disabled:opacity-40"
                >
                  Next Card
                </button>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <p className="text-slate-500 text-xs">No flashcards matching the current level filter.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
