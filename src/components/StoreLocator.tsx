import { useEffect, useMemo, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { Store, UserLocation, StoreWithDistance } from '../types';
import { calculateDistance, formatDistance } from '../utils/distance';
import { logViewMap } from '../utils/analytics';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default markers in webpack/vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons
const userLocationIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #4b53bc; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const storeIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #ff9933; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
    <span style="color: white; font-size: 12px;">💊</span>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface StoreLocatorProps {
  stores: Store[];
  userLocation: UserLocation | null;
  maxStores?: number;
}

// Map bounds fitter component
function MapBoundsFitter({ stores }: { stores: StoreWithDistance[] }) {
  const map = useMap();

  useEffect(() => {
    if (stores.length > 0) {
      const bounds = L.latLngBounds(stores.map((s) => [s.lat, s.lon]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, stores]);

  return null;
}

export function StoreLocator({ stores, userLocation: initialUserLocation, maxStores = 5 }: StoreLocatorProps) {
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(initialUserLocation);
  const [locationQuery, setLocationQuery] = useState('');
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Calculate distances and sort
  const storesWithDistance = useMemo(() => {
    if (!userLocation) return [];

    const withDistance: StoreWithDistance[] = stores.map((store) => ({
      ...store,
      distance: calculateDistance(userLocation.lat, userLocation.lon, store.lat, store.lon),
    }));

    return withDistance.sort((a, b) => a.distance - b.distance).slice(0, maxStores);
  }, [stores, userLocation, maxStores]);

  // Default center (India center if no user location)
  const defaultCenter: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lon]
    : [20.5937, 78.9629];

  // Log analytics when map is viewed
  useEffect(() => {
    if (storesWithDistance.length > 0) {
      logViewMap(storesWithDistance.length);
    }
  }, [storesWithDistance.length]);

  const handleStoreClick = useCallback((storeId: string) => {
    setSelectedStore(storeId);
  }, []);

  // Search for a location using Nominatim (OpenStreetMap)
  const searchLocation = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsSearchingLocation(true);
    setLocationError(null);

    try {
      // Nominatim geocoding API - free but has rate limits (1 request/sec)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', India')}&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );

      if (!response.ok) {
        throw new Error('Failed to search location');
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        setUserLocation({
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
        });
      } else {
        setLocationError('Location not found. Please try a different search.');
      }
    } catch (err) {
      setLocationError('Failed to search location. Please try again.');
    } finally {
      setIsSearchingLocation(false);
    }
  }, []);

  // Reset to current GPS location
  const resetToCurrentLocation = useCallback(() => {
    if (initialUserLocation) {
      setUserLocation(initialUserLocation);
      setLocationQuery('');
      setLocationError(null);
    }
  }, [initialUserLocation]);

  // Location Search UI
  const renderLocationSearch = () => (
    <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant mb-4">
      <label className="font-label-lg text-on-surface block mb-2">
        Search stores near:
      </label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchLocation(locationQuery)}
            placeholder="Enter city or area (e.g., Mumbai, Delhi)"
            className="w-full px-4 py-3 bg-white border border-outline-variant rounded-xl font-body-md text-on-surface placeholder:text-outline/50 outline-none focus:border-primary"
          />
        </div>
        <button
          onClick={() => searchLocation(locationQuery)}
          disabled={isSearchingLocation || !locationQuery.trim()}
          className="px-4 py-3 bg-primary text-on-primary rounded-xl font-label-lg btn-press disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSearchingLocation ? (
            <span className="animate-spin">⟳</span>
          ) : (
            <span className="material-symbols-outlined">search</span>
          )}
          <span className="hidden sm:inline">Search</span>
        </button>
        {initialUserLocation && (
          <button
            onClick={resetToCurrentLocation}
            className="px-4 py-3 bg-surface-container text-on-surface border border-outline-variant rounded-xl font-label-lg btn-press flex items-center gap-2"
            title="Use my current location"
          >
            <span className="material-symbols-outlined">my_location</span>
            <span className="hidden sm:inline">My Location</span>
          </button>
        )}
      </div>
      {locationError && (
        <p className="text-error font-label-sm mt-2">{locationError}</p>
      )}
      <p className="text-on-surface-variant font-label-sm mt-2">
        Tip: Enter your city, area, or pincode to find nearby stores
      </p>
    </div>
  );

  if (!userLocation) {
    return (
      <div>
        {renderLocationSearch()}
        <div className="bg-error-container rounded-xl p-6 border border-outline-variant">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-error">location_off</span>
            <div>
              <h3 className="font-label-lg text-on-surface">No Location Set</h3>
              <p className="font-body-md text-on-surface-variant">
                Search for a location above or enable location access to find nearby stores.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {renderLocationSearch()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Store List */}
        <div className="lg:col-span-1 space-y-3 order-2 lg:order-1">
          <h3 className="font-headline-md text-headline-md mb-4">Nearest Stores</h3>

        {storesWithDistance.length === 0 ? (
          <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
            <p className="font-body-md text-on-surface-variant">No stores found nearby.</p>
          </div>
        ) : (
          storesWithDistance.map((store) => (
            <div
              key={store.id}
              onClick={() => handleStoreClick(store.id)}
              className={`bg-white p-4 rounded-xl border transition-colors cursor-pointer group ${
                selectedStore === store.id
                  ? 'border-primary-container bg-surface-container-low'
                  : 'border-outline-variant hover:border-primary-container'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-label-lg text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                  {store.name}
                </span>
                <span className="text-secondary font-label-sm text-label-sm flex-shrink-0 ml-2">
                  {formatDistance(store.distance)}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant font-body-md mb-2 line-clamp-2">
                {store.address}, {store.city}
              </p>
              <div className="flex items-center gap-4">
                {store.phone && (
                  <a
                    href={`tel:${store.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-sm text-primary hover:underline font-label-sm"
                  >
                    <span className="material-symbols-outlined text-sm">phone</span>
                    {store.phone}
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-sm text-primary hover:underline font-label-sm"
                >
                  <span className="material-symbols-outlined text-sm">directions</span>
                  Directions
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Map */}
      <div className="lg:col-span-2 order-1 lg:order-2">
        <div className="bg-surface-container-high rounded-xl h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden relative border border-outline-variant">
          <MapContainer
            center={defaultCenter}
            zoom={userLocation ? 13 : 5}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User location marker */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lon]} icon={userLocationIcon}>
                <Popup>Your Location</Popup>
              </Marker>
            )}

            {/* Store markers */}
            {storesWithDistance.map((store) => (
              <Marker
                key={store.id}
                position={[store.lat, store.lon]}
                icon={storeIcon}
                eventHandlers={{
                  click: () => handleStoreClick(store.id),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-label-lg text-on-surface mb-1">{store.name}</h4>
                    <p className="font-label-sm text-on-surface-variant mb-2">{store.address}</p>
                    <p className="font-label-sm text-secondary mb-2">
                      {formatDistance(store.distance)} away
                    </p>
                    {store.phone && (
                      <a
                        href={`tel:${store.phone}`}
                        className="text-primary hover:underline font-label-sm"
                      >
                        {store.phone}
                      </a>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Fit bounds to show all markers */}
            {storesWithDistance.length > 0 && <MapBoundsFitter stores={storesWithDistance} />}
          </MapContainer>
        </div>
      </div>
    </div>
  </div>
  );
}
