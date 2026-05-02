import { useState } from 'react';
import { Layout } from './components/Layout';
import { SearchAutocomplete } from './components/SearchAutocomplete';
import { MedicineComparison } from './components/MedicineComparison';
import { StoreLocator } from './components/StoreLocator';
import { SkeletonLoader } from './components/SkeletonLoader';
import { ErrorCard } from './components/ErrorCard';
import { useMedicineData } from './hooks/useMedicineData';
import { useGeolocation } from './hooks/useGeolocation';
import type { Medicine } from './types';
import { MedicinesList } from './components/MedicinesList';
import { logSelectMedicine } from './utils/analytics';

function App() {
  const { medicines, stores, loading, error, refetch } = useMedicineData();
  const { location: userLocation, loading: locationLoading, error: locationError, requestLocation } = useGeolocation();
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const handleSelectMedicine = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    logSelectMedicine(medicine.id, medicine.genericName);

    // Scroll to comparison section
    const element = document.getElementById('comparison-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-12">
        {/* Hero Section */}
        <section className="text-center mb-8 md:mb-12">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-3 md:mb-4">
            Jan Aushadhi Medicine Portal
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto px-4">
            Find affordable generic medicine alternatives and save up to 90% on your healthcare expenses.
          </p>
        </section>

        {/* Search Section */}
        <section className="mb-8 md:mb-12">
          {loading ? (
            <SkeletonLoader variant="search" />
          ) : error ? (
            <ErrorCard
              title="Failed to load medicines"
              message={error}
              onRetry={refetch}
            />
          ) : (
            <SearchAutocomplete
              medicines={medicines}
              onSelect={handleSelectMedicine}
              placeholder="Search by medicine name (e.g., Paracetamol, Crocin)..."
            />
          )}
        </section>

        {/* Medicine Comparison Section */}
        <section id="comparison-section" className="mb-8 md:mb-16">
          {loading ? (
            <SkeletonLoader variant="comparison" />
          ) : selectedMedicine ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline-lg text-headline-lg text-on-surface">
                  Medicine Comparison
                </h2>
                <button
                  onClick={() => setSelectedMedicine(null)}
                  className="text-on-surface-variant hover:text-primary font-label-lg flex items-center gap-1"
                >
                  <span className="material-symbols-outlined">close</span>
                  Clear
                </button>
              </div>
              <MedicineComparison medicine={selectedMedicine} />
            </>
          ) : (
            <div className="bg-surface-container rounded-xl p-6 md:p-12 border border-outline-variant text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl md:text-4xl text-primary">
                  search
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                Search for a Medicine
              </h3>
              <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
                Enter a generic or branded medicine name above to see price comparisons and potential savings.
              </p>

              {/* Quick Search Suggestions */}
              {!loading && medicines.length > 0 && (
                <div className="mt-6">
                  <p className="font-label-sm text-on-surface-variant mb-3">Popular searches:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {medicines.slice(0, 6).map((med) => (
                      <button
                        key={med.id}
                        onClick={() => handleSelectMedicine(med)}
                        className="px-3 py-1.5 bg-white border border-outline-variant rounded-full font-label-sm text-on-surface hover:border-primary-container hover:text-primary transition-colors"
                      >
                        {med.genericName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Store Locator Section */}
        <section id="stores" className="mb-8 md:mb-16">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">
                Find Nearby Stores
              </h2>
              <p className="font-body-md text-on-surface-variant mt-1">
                Locate Jan Aushadhi Kendras near you
              </p>
            </div>
            {locationError && (
              <button
                onClick={requestLocation}
                className="text-primary font-label-lg flex items-center gap-1"
              >
                <span className="material-symbols-outlined">my_location</span>
                Enable Location
              </button>
            )}
          </div>

          {loading || locationLoading ? (
            <SkeletonLoader variant="map" />
          ) : (
            <StoreLocator
              stores={stores}
              userLocation={userLocation}
              maxStores={5}
            />
          )}
        </section>

        {/* Info Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
          <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant">
            <div className="w-12 h-12 bg-primary-container/20 rounded-lg flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary text-2xl">verified</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
              Quality Assured
            </h3>
            <p className="font-body-md text-on-surface-variant">
              All Jan Aushadhi medicines undergo strict quality testing and are approved by regulatory authorities.
            </p>
          </div>

          <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant">
            <div className="w-12 h-12 bg-secondary-container/30 rounded-lg flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-secondary text-2xl">savings</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
              Save Up to 90%
            </h3>
            <p className="font-body-md text-on-surface-variant">
              Generic medicines provide the same therapeutic value at a fraction of branded medicine costs.
            </p>
          </div>

          <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant">
            <div className="w-12 h-12 bg-tertiary-container/30 rounded-lg flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-tertiary text-2xl">location_on</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
              Nationwide Network
            </h3>
            <p className="font-body-md text-on-surface-variant">
              Over 18,000 Jan Aushadhi Kendras across India ensuring accessibility in urban and rural areas.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-outline-variant pt-8 pb-24 md:pb-8">
          <div className="text-center">
            <p className="font-label-sm text-on-surface-variant">
              Data sourced from{' '}
              <a
                href="https://janaushadhi.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Jan Aushadhi Portal
              </a>
            </p>
            <p className="font-label-sm text-on-surface-variant mt-2">
              © 2024 Jan Aushadhi Medicine Savings Portal. Built for public welfare.
            </p>
          </div>
        </footer>
      </div>
    </Layout>
  );
}

export default App;
