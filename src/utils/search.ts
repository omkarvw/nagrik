import type { Medicine, SearchSuggestion } from '../types';

/**
 * Extended search suggestion with relevance score for internal ranking
 */
type ScoredSuggestion = SearchSuggestion & { score: number };

/**
 * Normalize a string for search (lowercase, remove extra spaces)
 */
function normalize(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Calculate relevance score for a match
 * @param text The text being searched (already normalized)
 * @param query The search query (already normalized)
 * @param isStartOfWord Whether match at start scores higher
 * @returns Relevance score
 */
function calculateGenericScore(text: string, query: string): number {
  // +10 points: text starts with query
  if (text.startsWith(query)) {
    return 10;
  }

  // Find the position of the query in the text
  const index = text.indexOf(query);
  if (index === -1) {
    return 0;
  }

  // +7 points: query is at a word boundary (preceded by space or start)
  const charBefore = index > 0 ? text[index - 1] : ' ';
  if (charBefore === ' ' || charBefore === '-' || charBefore === '(') {
    return 7;
  }

  // +5 points: query appears anywhere
  return 5;
}

/**
 * Calculate score for branded equivalent matches
 * @param brandedName The branded name (normalized)
 * @param query The search query (normalized)
 * @returns Score for branded match
 */
function calculateBrandedScore(brandedName: string, query: string): number {
  // +3 points: branded name starts with query
  if (brandedName.startsWith(query)) {
    return 3;
  }

  // +1 point: branded name contains query
  if (brandedName.includes(query)) {
    return 1;
  }

  return 0;
}

/**
 * Search medicines by generic name or branded equivalents
 * @param medicines Array of medicines to search
 * @param query Search query string
 * @param limit Maximum number of results (default 10)
 * @returns Array of search suggestions sorted by relevance
 */
export function searchMedicines(
  medicines: Medicine[],
  query: string,
  limit: number = 10
): ScoredSuggestion[] {
  const normalizedQuery = normalize(query);

  if (normalizedQuery.length === 0) {
    return [];
  }

  const scoredSuggestions: ScoredSuggestion[] = [];
  const seenMedicineIds = new Set<string>();

  for (const medicine of medicines) {
    let bestScore = 0;
    let bestMatch: ScoredSuggestion | null = null;

    // Check generic name match
    const genericName = normalize(medicine.genericName);
    const genericScore = calculateGenericScore(genericName, normalizedQuery);

    if (genericScore > 0) {
      bestScore = genericScore;
      bestMatch = {
        medicine,
        matchedName: medicine.genericName,
        matchType: 'generic',
        score: genericScore,
      };
    }

    // Check branded equivalents (collect ALL matches, don't break early)
    for (const branded of medicine.brandedEquivalents) {
      const brandedName = normalize(branded.name);
      const brandedScore = calculateBrandedScore(brandedName, normalizedQuery);

      if (brandedScore > 0 && brandedScore > bestScore) {
        bestScore = brandedScore;
        bestMatch = {
          medicine,
          matchedName: `${branded.name} (${medicine.genericName})`,
          matchType: 'branded',
          score: brandedScore,
        };
      }
    }

    // If we found a match and haven't seen this medicine yet
    if (bestMatch && !seenMedicineIds.has(medicine.id)) {
      scoredSuggestions.push(bestMatch);
      seenMedicineIds.add(medicine.id);
    }
  }

  // Sort by score descending, then slice to limit
  scoredSuggestions.sort((a, b) => b.score - a.score);

  return scoredSuggestions.slice(0, limit);
}

/**
 * Calculate average branded price for a medicine
 * @param medicine Medicine object
 * @returns Average MRP of branded equivalents
 */
export function getAverageBrandedPrice(medicine: Medicine): number {
  if (medicine.brandedEquivalents.length === 0) return 0;
  const total = medicine.brandedEquivalents.reduce((sum, b) => sum + b.mrp, 0);
  return total / medicine.brandedEquivalents.length;
}

/**
 * Calculate savings amount and percentage
 * @param medicine Medicine object
 * @returns Object with amount and percentage
 */
export function calculateSavings(medicine: Medicine): {
  amount: number;
  percentage: number;
} {
  const avgBranded = getAverageBrandedPrice(medicine);
  const amount = avgBranded - medicine.janAushadhiPrice;
  const percentage = avgBranded > 0 ? (amount / avgBranded) * 100 : 0;

  return {
    amount: Math.max(0, amount),
    percentage: Math.max(0, percentage),
  };
}

/**
 * Format currency for display
 * @param amount Amount in rupees
 * @returns Formatted string with ₹ symbol
 */
export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

/**
 * Format percentage for display
 * @param percentage Percentage value
 * @returns Formatted string with % symbol
 */
export function formatPercentage(percentage: number): string {
  return `${Math.round(percentage)}%`;
}
