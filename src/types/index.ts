// Medicine/Product Types
export interface BrandedEquivalent {
  name: string;
  mrp: number;
  manufacturer: string;
}

export interface Medicine {
  id: string;
  genericName: string;
  brandedEquivalents: BrandedEquivalent[];
  janAushadhiPrice: number;
  category: string;
  packSize: string;
}

// Store Types
export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lon: number;
  phone: string;
}

export interface StoreWithDistance extends Store {
  distance: number; // in kilometers
}

// Search Types
export interface SearchSuggestion {
  medicine: Medicine;
  matchedName: string;
  matchType: 'generic' | 'branded';
}

// Location Types
export interface UserLocation {
  lat: number;
  lon: number;
  accuracy?: number;
}

// Analytics Types
export type AnalyticsEvent =
  | { type: 'search'; query: string }
  | { type: 'select_medicine'; medicineId: string; medicineName: string }
  | { type: 'view_comparison'; medicineId: string }
  | { type: 'view_map'; storeCount: number }
  | { type: 'share_savings'; medicineId: string; savingsAmount: number }
  | { type: 'copy_link'; path: string };
