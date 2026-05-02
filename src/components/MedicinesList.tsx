import { useState, useMemo } from 'react';
import type { Medicine } from '../types';
import { calculateSavings, formatCurrency, formatPercentage } from '../utils/search';

interface MedicinesListProps {
  medicines: Medicine[];
  onSelect: (medicine: Medicine) => void;
}

export function MedicinesList({ medicines, onSelect }: MedicinesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(medicines.map((m) => m.category));
    return ['All', ...Array.from(cats)].sort();
  }, [medicines]);

  // Filter medicines
  const filteredMedicines = useMemo(() => {
    return medicines.filter((med) => {
      const matchesSearch =
        med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.brandedEquivalents.some((b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === 'All' || med.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [medicines, searchQuery, selectedCategory]);

  return (
    <div>
      {/* Search and Filter */}
      <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicines..."
              className="w-full px-4 py-3 bg-white border border-outline-variant rounded-xl font-body-md text-on-surface placeholder:text-outline/50 outline-none focus:border-primary"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-white border border-outline-variant rounded-xl font-body-md text-on-surface outline-none focus:border-primary cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <p className="text-on-surface-variant font-label-sm mt-2">
          Showing {filteredMedicines.length} of {medicines.length} medicines
        </p>
      </div>

      {/* Medicines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMedicines.map((medicine) => {
          const savings = calculateSavings(medicine);
          return (
            <div
              key={medicine.id}
              onClick={() => onSelect(medicine)}
              className="bg-white rounded-xl border border-outline-variant p-4 cursor-pointer hover:border-primary-container hover:shadow-card-hover transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="bg-surface-container-high text-on-surface-variant font-label-sm px-2 py-1 rounded-full">
                  {medicine.category}
                </span>
                <span className="bg-secondary-container text-secondary font-label-lg px-3 py-1 rounded-full">
                  Save {formatPercentage(savings.percentage)}
                </span>
              </div>

              <h3 className="font-headline-md text-headline-md text-on-surface mb-1">
                {medicine.genericName}
              </h3>
              <p className="text-on-surface-variant font-label-sm mb-3">
                {medicine.packSize}
              </p>

              {/* Price Comparison */}
              <div className="bg-surface-container rounded-lg p-3 mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-on-surface-variant font-label-sm">
                    Jan Aushadhi:
                  </span>
                  <span className="text-secondary font-label-lg">
                    {formatCurrency(medicine.janAushadhiPrice)}
                  </span>
                </div>
                {medicine.brandedEquivalents.slice(0, 2).map((branded) => (
                  <div
                    key={branded.name}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-outline font-label-sm">
                      {branded.name}:
                    </span>
                    <span className="text-on-surface-variant line-through font-label-sm">
                      {formatCurrency(branded.mrp)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Savings Highlight */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-on-surface-variant font-label-sm">You Save:</p>
                  <p className="text-secondary font-headline-md">
                    {formatCurrency(savings.amount)}
                  </p>
                </div>
                <span className="material-symbols-outlined text-primary">
                  arrow_forward
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMedicines.length === 0 && (
        <div className="text-center py-12">
          <p className="text-on-surface-variant font-body-lg">
            No medicines found. Try a different search.
          </p>
        </div>
      )}
    </div>
  );
}
