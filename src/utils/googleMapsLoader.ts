declare global {
  interface Window {
    google?: any;
    __googleMapsCallback?: () => void;
  }
}

let isScriptLoading = false;
const scriptLoadCallbacks: Array<(loaded: boolean) => void> = [];

export function isGoogleMapsLoaded(): boolean {
  return typeof window !== 'undefined' && !!(window.google && window.google.maps && window.google.maps.places);
}

export function loadGoogleMapsScript(apiKey: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (isGoogleMapsLoaded()) {
      resolve(true);
      return;
    }

    if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_API_KEY') {
      resolve(false);
      return;
    }

    // If script with matching key already exists
    const existingScript = document.getElementById('google-maps-places-script') as HTMLScriptElement | null;
    if (existingScript) {
      if (existingScript.src.includes(`key=${apiKey}`)) {
        if (isGoogleMapsLoaded()) {
          resolve(true);
          return;
        }
      } else {
        // Remove old script to swap key
        existingScript.remove();
        if (window.google) {
          delete window.google;
        }
      }
    }

    scriptLoadCallbacks.push(resolve);

    if (isScriptLoading) {
      return;
    }

    isScriptLoading = true;
    const script = document.createElement('script');
    script.id = 'google-maps-places-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey.trim())}&libraries=places&language=id&region=ID&callback=__googleMapsCallback`;
    script.async = true;
    script.defer = true;

    window.__googleMapsCallback = () => {
      isScriptLoading = false;
      scriptLoadCallbacks.forEach((cb) => cb(true));
      scriptLoadCallbacks.length = 0;
    };

    script.onerror = () => {
      isScriptLoading = false;
      scriptLoadCallbacks.forEach((cb) => cb(false));
      scriptLoadCallbacks.length = 0;
    };

    document.head.appendChild(script);
  });
}

/**
 * Calculates Haversine distance in KM between two geographic coordinates
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  // Account for road curvature factor (~1.25x direct distance)
  return Math.round(d * 1.28 * 10) / 10;
}

/**
 * Format currency to IDR Rupiah
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}
