import { DictionaryTerm, SearchResult } from '../types/dictionary';

// Levenshtein distance for fuzzy matching & typo suggestions
function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array(an + 1)
    .fill(null)
    .map(() => Array(bn + 1).fill(null));

  for (let i = 0; i <= an; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= bn; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= an; i += 1) {
    for (let j = 1; j <= bn; j += 1) {
      const cost = a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return matrix[an][bn];
}

// Generate smart excerpt snippet around matched word
export function extractSnippet(text: string, queryWords: string[], maxLength: number = 140): string {
  if (!text) return '';
  const lowerText = text.toLowerCase();
  
  let bestIndex = -1;
  for (const word of queryWords) {
    const idx = lowerText.indexOf(word.toLowerCase());
    if (idx !== -1) {
      bestIndex = idx;
      break;
    }
  }

  if (bestIndex === -1) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  const start = Math.max(0, bestIndex - 45);
  const end = Math.min(text.length, bestIndex + 95);
  let snippet = text.slice(start, end);

  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';

  return snippet;
}

// Highlight tokens safely
export function highlightText(text: string, queryWords: string[]): Array<{ text: string; isMatch: boolean }> {
  if (!text || queryWords.length === 0) return [{ text, isMatch: false }];

  const escaped = queryWords
    .filter(w => w.trim().length > 0)
    .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (escaped.length === 0) return [{ text, isMatch: false }];

  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);

  return parts.map(part => ({
    text: part,
    isMatch: queryWords.some(qw => qw.toLowerCase() === part.toLowerCase())
  }));
}

// Search and rank terms
export function searchDictionary(
  terms: DictionaryTerm[],
  rawQuery: string,
  options: {
    level?: string;
    category?: string;
    bookmarkedIds?: string[];
    onlyBookmarked?: boolean;
  } = {}
): {
  results: SearchResult[];
  didYouMean?: string;
  queryWords: string[];
} {
  const query = rawQuery.trim();
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 0);

  // First apply filters
  let filtered = terms;
  if (options.level && options.level !== 'All') {
    filtered = filtered.filter(t => t.level.includes(options.level as any));
  }
  if (options.category && options.category !== 'All') {
    filtered = filtered.filter(t => t.category === options.category);
  }
  if (options.onlyBookmarked && options.bookmarkedIds) {
    const bSet = new Set(options.bookmarkedIds);
    filtered = filtered.filter(t => bSet.has(t.id));
  }

  // If query is empty, return alphabetical listing
  if (queryWords.length === 0) {
    const sorted = [...filtered].sort((a, b) => a.term.localeCompare(b.term));
    return {
      results: sorted.map(t => ({
        term: t,
        score: 1,
        highlightedTerm: t.term,
        snippet: t.definition.length > 140 ? t.definition.slice(0, 140) + '...' : t.definition,
        matchType: 'exact'
      })),
      queryWords: []
    };
  }

  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  for (const term of filtered) {
    const termLower = term.term.toLowerCase();
    const hindiLower = term.hindi.toLowerCase();
    const defLower = term.definition.toLowerCase();
    const exLower = term.example.toLowerCase();
    const catLower = term.category.toLowerCase();
    const synsLower = term.synonyms.map(s => s.toLowerCase());

    let score = 0;
    let matchType: SearchResult['matchType'] = 'term-word';

    // 1. Exact term match
    if (termLower === lowerQuery) {
      score += 1500;
      matchType = 'exact';
    }
    // 2. Term starts with query
    else if (termLower.startsWith(lowerQuery)) {
      score += 800;
      matchType = 'prefix';
    }
    // 3. Synonym / abbreviation exact or starts with
    else if (synsLower.some(s => s === lowerQuery)) {
      score += 700;
      matchType = 'synonym';
    } else if (synsLower.some(s => s.startsWith(lowerQuery))) {
      score += 450;
      matchType = 'synonym';
    }
    // 4. Term contains query substring
    else if (termLower.includes(lowerQuery)) {
      score += 400;
      matchType = 'term-word';
    }

    // Check all words match condition
    const matchesAllWordsInTerm = queryWords.every(w => termLower.includes(w) || synsLower.some(s => s.includes(w)));
    if (matchesAllWordsInTerm && score === 0) {
      score += 350;
      matchType = 'term-word';
    }

    // Check Hindi name match
    if (hindiLower.includes(lowerQuery)) {
      score += 300;
    }

    // Check Definition match
    const wordsInDefCount = queryWords.filter(w => defLower.includes(w)).length;
    if (wordsInDefCount > 0) {
      score += wordsInDefCount * 60;
      if (score < 200) matchType = 'definition';
    }

    // Check Example match
    const wordsInExCount = queryWords.filter(w => exLower.includes(w)).length;
    if (wordsInExCount > 0) {
      score += wordsInExCount * 30;
      if (score < 100) matchType = 'example';
    }

    // Check Category match
    if (catLower.includes(lowerQuery)) {
      score += 40;
    }

    if (score > 0) {
      results.push({
        term,
        score,
        highlightedTerm: term.term,
        snippet: extractSnippet(term.definition, queryWords),
        matchType
      });
    }
  }

  // Sort results descending by score
  results.sort((a, b) => b.score - a.score);

  // Typo detection / "Did you mean?" if 0 results or weak results
  let didYouMean: string | undefined = undefined;
  if (results.length === 0 && lowerQuery.length >= 3) {
    let bestDistance = 999;
    let candidate = '';

    for (const term of terms) {
      // Check term name
      const dist = levenshteinDistance(lowerQuery, term.term.toLowerCase());
      if (dist < bestDistance && dist <= Math.max(2, Math.floor(lowerQuery.length * 0.4))) {
        bestDistance = dist;
        candidate = term.term;
      }

      // Check synonyms
      for (const syn of term.synonyms) {
        const sDist = levenshteinDistance(lowerQuery, syn.toLowerCase());
        if (sDist < bestDistance && sDist <= 2) {
          bestDistance = sDist;
          candidate = syn;
        }
      }
    }

    if (candidate && candidate.toLowerCase() !== lowerQuery) {
      didYouMean = candidate;
    }
  }

  return {
    results,
    didYouMean,
    queryWords
  };
}

// Group terms alphabetically for A-Z encyclopedic index
export function groupTermsAlphabetically(terms: DictionaryTerm[]): Record<string, DictionaryTerm[]> {
  const groups: Record<string, DictionaryTerm[]> = {};
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  for (const l of letters) {
    groups[l] = [];
  }

  for (const term of terms) {
    const firstChar = term.term.charAt(0).toUpperCase();
    if (groups[firstChar]) {
      groups[firstChar].push(term);
    } else {
      if (!groups['#']) groups['#'] = [];
      groups['#'].push(term);
    }
  }

  // Sort within each bucket
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => a.term.localeCompare(b.term));
  }

  return groups;
}
