import { useState, useEffect, useCallback } from 'react';
import type { Medicine, Store } from '../types';

interface UseMedicineDataReturn {
  medicines: Medicine[];
  stores: Store[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to load medicine and store data from JSON files
 * @returns Object with data, loading state, error, and refetch function
 */
export function useMedicineData(): UseMedicineDataReturn {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [productsResponse, storesResponse] = await Promise.all([
        fetch('./data/jan-aushadhi-products.json'),
        fetch('./data/jan-aushadhi-stores.json'),
      ]);

      if (!productsResponse.ok) {
        throw new Error(`Failed to load products: ${productsResponse.statusText}`);
      }
      if (!storesResponse.ok) {
        throw new Error(`Failed to load stores: ${storesResponse.statusText}`);
      }

      const [productsData, storesData] = await Promise.all([
        productsResponse.json(),
        storesResponse.json(),
      ]);

      setMedicines(productsData);
      setStores(storesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    medicines,
    stores,
    loading,
    error,
    refetch: fetchData,
  };
}
