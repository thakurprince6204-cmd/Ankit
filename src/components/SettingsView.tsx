import React, { useState } from 'react';
import { UserPreferences, EducationLevel } from '../types/dictionary';
import {
  User,
  Globe,
  Sun,
  Moon,
  Volume2,
  Trash2,
  Download,
  BookOpen,
  HelpCircle,
  CheckCircle,
  FileText,
  RotateCcw,
} from 'lucide-react';

interface SettingsViewProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
  onResetData: () => void;
  onClearRecentSearches: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  preferences,
  onUpdatePreferences,
  onResetData,
  onClearRecentSearches,
}) => {
  const [saveToast, setSaveToast] = useState(false);

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(preferences, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pe_dict_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleNameChange = (name: string) => {
    onUpdatePreferences({ name });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Application Settings &amp; Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Customize your syllabus focus, language mode, appearance, and manage your offline study data.
        </p>
      </div>

      {saveToast && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle size={15} />
          <span>Settings saved in local browser storage.</span>
        </div>
      )}

      {/* Profile & Target Level */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <User size={16} /> Student Profile &amp; Examination Goal
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Student / Aspirant Name:
            </label>
            <input
              type="text"
              value={preferences.name}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="Enter your name"
              className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Target Level / Exam Focus:
            </label>
            <select
              value={preferences.targetLevel}
              onChange={e => onUpdatePreferences({ targetLevel: e.target.value as any })}
              className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="All">All Levels (Comprehensive)</option>
              <option value="Class">CBSE Class 11-12 Boards (NCERT)</option>
              <option value="UG">UG (B.P.Ed / B.Sc Physical Education)</option>
              <option value="PG">PG (M.P.Ed / University)</option>
              <option value="TGT">TGT (KVS, NVS, DSSSB, State TET)</option>
              <option value="PGT">PGT / UGC-NET / JRF Exam</option>
            </select>
          </div>
        </div>
      </section>

      {/* Language & Display */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Globe size={16} /> Language &amp; Reading Preferences
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Language Display:
            </label>
            <select
              value={preferences.languageMode}
              onChange={e => onUpdatePreferences({ languageMode: e.target.value as any })}
              className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
            >
              <option value="bilingual">Bilingual (English + Hindi देवनागरी)</option>
              <option value="english">English Only</option>
              <option value="hindi">Hindi Primary</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Appearance Theme:
            </label>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => onUpdatePreferences({ theme: 'light' })}
                className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1 transition-all ${
                  preferences.theme === 'light' ? 'bg-white shadow-xs text-sky-700 font-bold' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sun size={14} /> Light
              </button>
              <button
                type="button"
                onClick={() => onUpdatePreferences({ theme: 'dark' })}
                className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1 transition-all ${
                  preferences.theme === 'dark' ? 'bg-slate-700 shadow-xs text-sky-300 font-bold' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Moon size={14} /> Dark
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Speech Pronunciation Rate:
            </label>
            <select
              value={preferences.speechSpeed}
              onChange={e => onUpdatePreferences({ speechSpeed: Number(e.target.value) })}
              className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
            >
              <option value={0.8}>Slow (0.8x - Clear study)</option>
              <option value={1.0}>Normal (1.0x)</option>
              <option value={1.2}>Fast (1.2x)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Offline Data & Progress Management */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <FileText size={16} /> Local Storage &amp; Study Records
        </h2>

        <div className="text-xs text-slate-600 dark:text-slate-400">
          Your bookmarked terms ({preferences.bookmarkedIds.length}), mastered terms ({preferences.masteredIds.length}), and quiz records are securely stored locally inside your browser cache.
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <Download size={14} />
            <span>Export Study Backup (.json)</span>
          </button>

          <button
            onClick={onClearRecentSearches}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw size={14} />
            <span>Clear Recent Searches</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all bookmarks, learned terms, and quiz records?')) {
                onResetData();
              }
            }}
            className="px-4 py-2 border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-1.5"
          >
            <Trash2 size={14} />
            <span>Reset All Study Progress</span>
          </button>
        </div>
      </section>

      {/* Physical Education Educational FAQ */}
      <section className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <HelpCircle size={16} /> Physical Education Examination Syllabus FAQs
        </h2>

        <div className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
          <div className="py-3 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white">
              Which textbook standards are used in PE-DICT?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Definitions, formulas, and diagrams adhere to the NCERT Physical Education Class 11 &amp; 12 syllabus, UGC-NET Paper II Physical Education syllabus, Guyton &amp; Hall Textbook of Medical Physiology, ACSM Exercise Guidelines, and Sage Patanjali's classical Yoga Sutras.
            </p>
          </div>

          <div className="py-3 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white">
              How are Knockout Tournament Byes calculated?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Total Byes = Next higher power of 2 minus the total number of teams ($2^n - N$). For 11 teams: $16 - 11 = 5$ Byes. Upper half teams = $(N + 1)/2 = 6$; Lower half teams = $(N - 1)/2 = 5$.
            </p>
          </div>

          <div className="py-3 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white">
              What is the "FLE 123" lever mnemonic for competitive exams?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              1st Class has <strong>F</strong>ulcrum in the middle (E-F-L, e.g. neck nodding); 2nd Class has <strong>L</strong>oad in the middle (F-L-E, e.g. ankle plantar flexion); 3rd Class has <strong>E</strong>ffort in the middle (F-E-L, e.g. elbow biceps flexion, the most common human body lever).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
