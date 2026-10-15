import React, { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { BookingScreen } from './components/BookingScreen';
import { SERVICES } from './data/services';
import { ServiceItem, UserLocationState } from './types';
import { loadGoogleMapsScript } from './utils/googleMapsLoader';

export default function App() {
  // Screen state: null = Halaman Depan (Pilih Layanan), ServiceItem = Layar Pemesanan
  const [activeService, setActiveService] = useState<ServiceItem | null>(null);
  // Status dan titik koordinat GPS lokasi pemesan
  const [userLocation, setUserLocation] = useState<UserLocationState>({
    lat: null,
    lng: null,
    mapsUrl: '',
    address: '',
    status: 'idle',
  });

  const [apiKey] = useState<string>(() => {
    return (
      (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
      localStorage.getItem('djek_google_maps_api_key') ||
      'AIzaSyDXXSUDgi8ie66ft1Wa1V7o4O6FicDHnVk'
    );
  });

  // Preload Google Maps script jika key tersedia
  useEffect(() => {
    if (apiKey) {
      loadGoogleMapsScript(apiKey);
    }
  }, [apiKey]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col items-center justify-start sm:py-6 sm:px-4">
      {/* Mobile Frame Container (Light Theme matching Logo) */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[780px] bg-white sm:rounded-[36px] border-x sm:border border-slate-200 shadow-xl shadow-slate-300/50 flex flex-col relative overflow-hidden">
        {/* Dynamic Screen View: Sederhana 2 Layar (Depan -> Form Pemesanan) */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
          {!activeService ? (
            /* LAYAR 1: Halaman Depan Sederhana (4 Pilihan Layanan) */
            <HomeScreen
              services={SERVICES}
              onSelectService={(service) => setActiveService(service)}
            />
          ) : (
            /* LAYAR 2: Terbuka Setelah Pilih Layanan (Formulir Pemesanan) */
            <div className="flex-1 overflow-y-auto">
              <BookingScreen
                service={activeService}
                onBack={() => setActiveService(null)}
                apiKey={apiKey}
                userLocation={userLocation}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
