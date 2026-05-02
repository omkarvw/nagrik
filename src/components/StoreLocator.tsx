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

export function StoreLocator({ stores, userLocation, maxStores = 5 }: StoreLocatorProps) {
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

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

  if (!userLocation) {
    return (
      <div className="bg-error-container rounded-xl p-6 border border-outline-variant">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-error">location_off</span>
          <div>
            <h3 className="font-label-lg text-on-surface">Location Required</h3>
            <p className="font-body-md text-on-surface-variant">
              Please enable location access to find nearby stores.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
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
  );
}
