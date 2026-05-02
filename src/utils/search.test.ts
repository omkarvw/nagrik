import { describe, it, expect } from 'vitest';
import { searchMedicines } from './search';
import type { Medicine } from '../types';

// Sample test medicines
const testMedicines: Medicine[] = [
  {
    id: '1',
    genericName: 'Paracetamol 500mg Tablet',
    brandedEquivalents: [{ name: 'Calpol 500', mrp: 25.5, manufacturer: 'GSK' }],
    janAushadhiPrice: 9.5,
    category: 'Pain Relief',
    packSize: '10 tablets',
  },
  {
    id: '2',
    genericName: 'Aceclofenac and Paracetamol Tablet',
    brandedEquivalents: [{ name: 'Hifenac-P', mrp: 89, manufacturer: 'Intas' }],
    janAushadhiPrice: 35,
    category: 'Pain Relief',
    packSize: '10 tablets',
  },
  {
    id: '3',
    genericName: 'Amoxicillin 500mg Capsule',
    brandedEquivalents: [{ name: 'Augmentin 500', mrp: 120, manufacturer: 'GSK' }],
    janAushadhiPrice: 45,
    category: 'Antibiotics',
    packSize: '10 capsules',
  },
  {
    id: '4',
    genericName: 'Para-Amino Salicylic Acid Tablet',
    brandedEquivalents: [{ name: 'Paser', mrp: 200, manufacturer: 'Jacobus' }],
    janAushadhiPrice: 85,
    category: 'Antibiotics',
    packSize: '10 tablets',
  },
  {
    id: '5',
    genericName: 'Vitamin D3 60000 IU',
    brandedEquivalents: [{ name: 'Calpol-D', mrp: 50, manufacturer: 'GSK' }],
    janAushadhiPrice: 22,
    category: 'Vitamins',
    packSize: '4 capsules',
  },
];

describe('searchMedicines', () => {
  it('returns empty array for empty query', () => {
    const results = searchMedicines(testMedicines, '', 10);
    expect(results).toEqual([]);
  });

  it('returns empty array when no matches found', () => {
    const results = searchMedicines(testMedicines, 'xyznonexistent', 10);
    expect(results).toEqual([]);
  });

  it('returns medicines containing query in generic name', () => {
    const results = searchMedicines(testMedicines, 'paracetamol', 10);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.medicine.genericName.includes('Paracetamol'))).toBe(true);
  });

  it('ranks generic name starts-with matches higher (score 10)', () => {
    const results = searchMedicines(testMedicines, 'para', 10);

    // Should find Paracetamol first (starts with "Para")
    // Before Para-Amino Salicylic (contains but doesn't start with)
    const paracetamolIndex = results.findIndex(
      r => r.medicine.genericName === 'Paracetamol 500mg Tablet'
    );
    const pasIndex = results.findIndex(
      r => r.medicine.genericName === 'Para-Amino Salicylic Acid Tablet'
    );

    expect(paracetamolIndex).toBeGreaterThanOrEqual(0);
    if (pasIndex >= 0) {
      expect(paracetamolIndex).toBeLessThan(pasIndex);
    }
  });

  it('ranks word-boundary matches higher than substring matches', () => {
    const results = searchMedicines(testMedicines, 'paracetamol', 10);

    // "Paracetamol 500mg" should rank higher than "Aceclofenac and Paracetamol"
    const standaloneIndex = results.findIndex(
      r => r.medicine.genericName === 'Paracetamol 500mg Tablet'
    );
    const compoundIndex = results.findIndex(
      r => r.medicine.genericName === 'Aceclofenac and Paracetamol Tablet'
    );

    expect(standaloneIndex).toBeGreaterThanOrEqual(0);
    expect(compoundIndex).toBeGreaterThanOrEqual(0);
    expect(standaloneIndex).toBeLessThan(compoundIndex);
  });

  it('returns results sorted by score descending', () => {
    const results = searchMedicines(testMedicines, 'para', 10);
    expect(results.length).toBeGreaterThan(1);

    // All results should have scores
    expect(results.every(r => typeof (r as { score?: number }).score === 'number')).toBe(true);

    // Scores should be in descending order
    for (let i = 1; i < results.length; i++) {
      const prevScore = (results[i - 1] as { score?: number }).score || 0;
      const currScore = (results[i] as { score?: number }).score || 0;
      expect(prevScore).toBeGreaterThanOrEqual(currScore);
    }
  });

  it('respects the limit parameter', () => {
    const results = searchMedicines(testMedicines, 'a', 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });

  it('removes duplicate medicines keeping highest score', () => {
    // Search that could match same medicine through generic and branded
    const results = searchMedicines(testMedicines, 'calpol', 10);

    // Should find Calpol branded equivalent but medicine should appear once
    const medicineIds = results.map(r => r.medicine.id);
    const uniqueIds = [...new Set(medicineIds)];
    expect(medicineIds.length).toBe(uniqueIds.length);
  });

  it('matches branded equivalents', () => {
    const results = searchMedicines(testMedicines, 'augmentin', 10);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.matchType === 'branded')).toBe(true);
  });
});
