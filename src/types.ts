export type ServiceId = 'd-ride' | 'd-car' | 'd-food' | 'd-send' | 'd-shop' | 'd-mart';

export interface ServiceItem {
  id: ServiceId;
  name: string;
  tagline: string;
  category: string;
  basePrice: number;
  perKmPrice: number;
  icon: string;
  color: string;
  accentBg: string;
  badge?: string;
  notesPlaceholder: string;
  description: string;
}

export interface BookingData {
  serviceId: ServiceId;
  customerName: string;
  customerPhone?: string;
  pickupAddress: string;
  pickupPlaceId?: string;
  pickupCoords?: { lat: number; lng: number };
  destinationAddress: string;
  destinationPlaceId?: string;
  destinationCoords?: { lat: number; lng: number };
  notes: string;
  paymentMethod: 'cash' | 'qris' | 'transfer';
  estimatedDistanceKm?: number;
  estimatedFare?: number;
}

export type TabType = 'home' | 'activity' | 'chat' | 'profile';

export interface UserLocationState {
  lat: number | null;
  lng: number | null;
  mapsUrl: string;
  address: string;
  status: 'requesting' | 'granted' | 'denied' | 'idle';
  errorMessage?: string;
}

export interface OrderRecord {
  id: string;
  serviceId: ServiceId;
  serviceName: string;
  customerName: string;
  pickup: string;
  destination: string;
  notes: string;
  fare: number;
  paymentMethod: string;
  createdAt: string;
  status: 'Menunggu Driver' | 'Driver Menuju Lokasi' | 'Selesai';
}
