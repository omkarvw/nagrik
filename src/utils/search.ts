import type { Medicine, SearchSuggestion } from '../types';

/**
 * Normalize a string for search (lowercase, remove extra spaces)
 */
function normalize(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Search medicines by generic name or branded equivalents
 * @param medicines Array of medicines to search
 * @param query Search query string
 * @param limit Maximum number of results (default 10)
 * @returns Array of search suggestions
 */
export function searchMedicines(
  medicines: Medicine[],
  query: string,
  limit: number = 10
): SearchSuggestion[] {
  const normalizedQuery = normalize(query);

  if (normalizedQuery.length === 0) {
    return [];
  }

  const suggestions: SearchSuggestion[] = [];

  for (const medicine of medicines) {
    // Check generic name match
    const genericName = normalize(medicine.genericName);
    if (genericName.includes(normalizedQuery)) {
      suggestions.push({
        medicine,
        matchedName: medicine.genericName,
        matchType: 'generic',
      });
      continue;
    }

    // Check branded equivalents
    for (const branded of medicine.brandedEquivalents) {
      const brandedName = normalize(branded.name);
      if (brandedName.includes(normalizedQuery)) {
        suggestions.push({
          medicine,
          matchedName: `${branded.name} (${medicine.genericName})`,
          matchType: 'branded',
        });
        break;
      }
    }

    if (suggestions.length >= limit) {
      break;
    }
  }

  return suggestions.slice(0, limit);
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
