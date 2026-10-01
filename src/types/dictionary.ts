export type EducationLevel = 'Class' | 'UG' | 'PG' | 'TGT' | 'PGT';

export type Category =
  | 'Physiology'
  | 'Biomechanics'
  | 'Training'
  | 'Sports Psychology'
  | 'Measurement'
  | 'Sports Medicine'
  | 'Health & Posture'
  | 'Yoga'
  | 'Sports Management'
  | 'Nutrition & Doping'
  | 'Olympism & History';

export type DiagramType =
  | 'lever'
  | 'cardiac'
  | 'spirometry'
  | 'tournament'
  | 'posture'
  | 'pricer'
  | 'ashtanga'
  | 'newton'
  | 'energy'
  | 'harvard'
  | 'planes'
  | 'fitt'
  | 'somatotype'
  | 'general';

export interface DictionaryTerm {
  id: string;
  term: string;
  hindi: string;
  pronunciation?: string;
  category: Category;
  subCategory?: string;
  level: EducationLevel[];
  synonyms: string[];
  definition: string;
  detailedExplanation?: string;
  example: string;
  examNotes?: string;
  formula?: string;
  diagramType?: DiagramType;
  diagramTitle?: string;
  diagramSubtitle?: string;
  source: string;
  videoQuery: string;
  relatedTermIds: string[];
}

export interface QuizQuestion {
  id: string;
  termId: string;
  termName: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  level: EducationLevel[];
  category: Category;
}

export interface UserPreferences {
  name: string;
  targetLevel: EducationLevel | 'All';
  languageMode: 'bilingual' | 'english' | 'hindi';
  theme: 'light' | 'dark';
  textSize: 'normal' | 'large' | 'compact';
  speechSpeed: number; // 0.8, 1.0, 1.2
  bookmarkedIds: string[];
  masteredIds: string[];
  recentSearches: string[];
  recentViewedIds: string[];
  quizHistory: Array<{
    id: string;
    date: string;
    score: number;
    total: number;
    level: string;
    category: string;
  }>;
}

export interface SearchResult {
  term: DictionaryTerm;
  score: number;
  highlightedTerm: string;
  snippet: string;
  matchType: 'exact' | 'prefix' | 'synonym' | 'term-word' | 'definition' | 'example';
}
