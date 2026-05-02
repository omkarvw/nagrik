import type { AnalyticsEvent } from '../types';

/**
 * Log analytics event to console
 * Ready to be swapped for Plausible/PostHog later
 * @param event Analytics event object
 */
export function logEvent(event: AnalyticsEvent): void {
  // eslint-disable-next-line no-console
  console.log('[Analytics]', event.type, event);
}

/**
 * Log search event
 */
export function logSearch(query: string): void {
  logEvent({ type: 'search', query });
}

/**
 * Log medicine selection event
 */
export function logSelectMedicine(medicineId: string, medicineName: string): void {
  logEvent({ type: 'select_medicine', medicineId, medicineName });
}

/**
 * Log comparison view event
 */
export function logViewComparison(medicineId: string): void {
  logEvent({ type: 'view_comparison', medicineId });
}

/**
 * Log map view event
 */
export function logViewMap(storeCount: number): void {
  logEvent({ type: 'view_map', storeCount });
}

/**
 * Log share savings event
 */
export function logShareSavings(medicineId: string, savingsAmount: number): void {
  logEvent({ type: 'share_savings', medicineId, savingsAmount });
}

/**
 * Log copy link event
 */
export function logCopyLink(path: string): void {
  logEvent({ type: 'copy_link', path });
}
