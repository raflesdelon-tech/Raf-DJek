import { UserLocationState } from '../types';

export function formatGoogleMapsUrl(lat: number, lng: number): string {
  return `https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
}

export async function detectCurrentLocation(): Promise<UserLocationState> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      resolve({
        lat: null,
        lng: null,
        mapsUrl: '',
        address: '',
        status: 'denied',
        errorMessage: 'Browser tidak mendukung akses GPS Geolocation.',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const mapsUrl = formatGoogleMapsUrl(lat, lng);
        let address = `Lokasi GPS Saya (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

        // Coba gunakan Google Geocoder jika library Google Maps telah dimuat
        if (window.google?.maps?.Geocoder) {
          try {
            const geocoder = new window.google.maps.Geocoder();
            const res = await new Promise<any>((resGeocode) => {
              geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
                if (status === 'OK' && results && results[0]) {
                  resGeocode(results[0].formatted_address);
                } else {
                  resGeocode(null);
                }
              });
            });
            if (res) address = res;
          } catch (e) {
            // fallback
          }
        } else {
          // Coba reverse geocode cepat via OpenStreetMap API jika Google Maps belum aktif
          try {
            const resp = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
              { headers: { 'Accept-Language': 'id' } }
            );
            if (resp.ok) {
              const data = await resp.json();
              if (data && data.display_name) {
                // Ambil nama jalan & area ringkas
                address = data.display_name.split(',').slice(0, 3).join(', ');
              }
            }
          } catch (e) {
            // fallback nama koordinat
          }
        }

        resolve({
          lat,
          lng,
          mapsUrl,
          address,
          status: 'granted',
        });
      },
      (err) => {
        let msg = 'Izin lokasi belum diberikan.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Akses lokasi ditolak oleh pengguna.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Waktu pencarian lokasi GPS habis.';
        }

        resolve({
          lat: null,
          lng: null,
          mapsUrl: '',
          address: '',
          status: 'denied',
          errorMessage: msg,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}
