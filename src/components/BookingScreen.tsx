import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  User,
  Navigation,
  Send,
  AlertCircle,
  Bike,
  PackageCheck,
  ShoppingCart,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  X,
  Link as LinkIcon,
  Search,
  Banknote,
  QrCode,
  MapPin,
  ArrowUpDown,
} from 'lucide-react';
import { SpoonForkIcon } from './SpoonForkIcon';
import { WhatsAppIcon } from './WhatsAppIcon';
import { ServiceItem, UserLocationState } from '../types';
import { ADMIN_WHATSAPP_NUMBER, ADMIN_WHATSAPP_DISPLAY } from '../data/services';
import { isGoogleMapsLoaded, loadGoogleMapsScript } from '../utils/googleMapsLoader';
import { detectCurrentLocation, formatGoogleMapsUrl } from '../utils/locationService';

interface BookingScreenProps {
  service: ServiceItem;
  onBack: () => void;
  apiKey: string;
  userLocation: UserLocationState;
}

export const BookingScreen: React.FC<BookingScreenProps> = ({
  service,
  onBack,
  apiKey,
  userLocation,
}) => {
  const [customerName, setCustomerName] = useState('');
  // Kolom Telusuri Lokasi (Google Maps) & Titik Awal / Jemput / Beli
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupLandmark, setPickupLandmark] = useState('');
  const [pickupMapsUrl, setPickupMapsUrl] = useState('');

  // Kolom Telusuri Lokasi (Google Maps) & Titik Tujuan / Antar
  const [destinationAddress, setDestinationAddress] = useState('');
  const [destLandmark, setDestLandmark] = useState('');
  const [destMapsUrl, setDestMapsUrl] = useState('');

  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Tunai (Cash)' | 'QRIS / Transfer'>('Tunai (Cash)');

  const handleSwapLocations = () => {
    const tempAddr = pickupAddress;
    const tempLandmark = pickupLandmark;
    const tempMapsUrl = pickupMapsUrl;
    setPickupAddress(destinationAddress);
    setPickupLandmark(destLandmark);
    setPickupMapsUrl(destMapsUrl);
    setDestinationAddress(tempAddr);
    setDestLandmark(tempLandmark);
    setDestMapsUrl(tempMapsUrl);
  };

  const [isLocatingPickup, setIsLocatingPickup] = useState(false);
  const [isLocatingDest, setIsLocatingDest] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Modal dialog WhatsApp
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formattedMessage, setFormattedMessage] = useState('');
  const [waLinkWeb, setWaLinkWeb] = useState('');
  const [waLinkApp, setWaLinkApp] = useState('');
  const [copied, setCopied] = useState(false);

  const pickupInputRef = useRef<HTMLInputElement>(null);
  const destInputRef = useRef<HTMLInputElement>(null);
  const pickupAutocompleteRef = useRef<any>(null);
  const destAutocompleteRef = useRef<any>(null);

  // Konfigurasi label spesifik per layanan
  const getServiceLabels = (id: string) => {
    switch (id) {
      case 'd-food':
        return {
          pickupLabel: 'Lokasi Warung / Restoran (Tempat Beli)',
          pickupPlaceholder: 'Telusuri lokasi warung/resto (Google Maps)...',
          pickupLandmarkPlaceholder: 'Patokan / nama kedai / resto (cth: RM Padang Sederhana)',
          destLabel: 'Lokasi Pengantaran (Rumah / Kantor)',
          destPlaceholder: 'Telusuri alamat tujuan antar (Google Maps)...',
          destLandmarkPlaceholder: 'Patokan alamat antar (cth: pagar hijau / kamar 12)',
          notesLabel: 'Daftar Pesanan Makanan & Minuman',
          notesPlaceholder: 'Tuliskan daftar makanan/minuman yang ingin dibeli, porsi, dan request...',
          pickupPrompt: 'Tempat Beli / Warung',
          destPrompt: 'Lokasi Pengantaran',
          notesPrompt: 'Pesanan Makanan',
        };
      case 'd-mart':
        return {
          pickupLabel: 'Lokasi Minimarket / Toko (Tempat Belanja)',
          pickupPlaceholder: 'Telusuri minimarket / toko (Google Maps)...',
          pickupLandmarkPlaceholder: 'Patokan minimarket (cth: Indomaret Sudirman / Alfamidi)',
          destLabel: 'Lokasi Pengantaran (Rumah / Kantor)',
          destPlaceholder: 'Telusuri alamat tujuan antar (Google Maps)...',
          destLandmarkPlaceholder: 'Patokan alamat antar (cth: pagar hitam / ruko no 5)',
          notesLabel: 'Daftar Barang Belanjaan',
          notesPlaceholder: 'Tuliskan daftar barang belanjaan, merk, jumlah di Indomaret / Alfamart...',
          pickupPrompt: 'Tempat Belanja / Toko',
          destPrompt: 'Lokasi Pengantaran',
          notesPrompt: 'Daftar Belanjaan',
        };
      case 'd-send':
        return {
          pickupLabel: 'Lokasi Pengambilan Paket (Awal)',
          pickupPlaceholder: 'Telusuri lokasi ambil paket (Google Maps)...',
          pickupLandmarkPlaceholder: 'Patokan tempat ambil paket (cth: pos satpam / ruko)',
          destLabel: 'Lokasi Tujuan Pengiriman (Akhir)',
          destPlaceholder: 'Telusuri alamat tujuan paket (Google Maps)...',
          destLandmarkPlaceholder: 'Patokan penerima (cth: rumah pagar putih / kantor lt 2)',
          notesLabel: 'Catatan Paket & Penerima (Opsional)',
          notesPlaceholder: 'Contoh: Paket baju 1 box, penerima Bpk. Joko (0812xxxx), titip satpam',
          pickupPrompt: 'Lokasi Ambil Paket',
          destPrompt: 'Tujuan Pengiriman',
          notesPrompt: 'Catatan Paket',
        };
      default: // d-ride
        return {
          pickupLabel: 'Lokasi Penjemputan (Awal)',
          pickupPlaceholder: 'Telusuri lokasi penjemputan (Google Maps)...',
          pickupLandmarkPlaceholder: 'Patokan alamat jemput (cth: lobi depan / pagar hitam)',
          destLabel: 'Lokasi Tujuan (Akhir)',
          destPlaceholder: 'Telusuri lokasi tujuan (Google Maps)...',
          destLandmarkPlaceholder: 'Patokan alamat tujuan (cth: depan minimarket / ruko)',
          notesLabel: 'Catatan Tambahan (Opsional)',
          notesPlaceholder: 'Contoh: Helm bersih, jemput di lobi depan, jangan ngebut',
          pickupPrompt: 'Jemput',
          destPrompt: 'Tujuan',
          notesPrompt: 'Catatan',
        };
    }
  };

  const labels = getServiceLabels(service.id);

  const renderServiceIcon = (id: string, className = 'w-5 h-5') => {
    switch (id) {
      case 'd-ride':
        return <Bike className={className} />;
      case 'd-send':
        return <PackageCheck className={className} />;
      case 'd-food':
        return <SpoonForkIcon className={className} />;
      case 'd-mart':
        return <ShoppingCart className={className} />;
      default:
        return <Bike className={className} />;
    }
  };

  const getServiceBadgeStyle = (id: string) => {
    switch (id) {
      case 'd-ride':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'd-send':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'd-food':
        return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'd-mart':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      default:
        return 'bg-blue-50 text-blue-600 border-blue-200';
    }
  };

  // Setup Google Maps Places Autocomplete pada Kolom Telusuri Lokasi
  useEffect(() => {
    let isMounted = true;
    const setupAutocomplete = () => {
      if (!isGoogleMapsLoaded() || !window.google?.maps?.places) return;
      try {
        const options = {
          componentRestrictions: { country: 'id' },
          fields: ['formatted_address', 'name', 'geometry'],
        };
        if (pickupInputRef.current && !pickupAutocompleteRef.current) {
          const autocomplete = new window.google.maps.places.Autocomplete(
            pickupInputRef.current,
            options
          );
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place) {
              const addr = place.formatted_address || place.name || '';
              setPickupAddress(addr);
              if (place.geometry?.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setPickupMapsUrl(formatGoogleMapsUrl(lat, lng));
              }
            }
          });
          pickupAutocompleteRef.current = autocomplete;
        }
        if (destInputRef.current && !destAutocompleteRef.current) {
          const autocomplete = new window.google.maps.places.Autocomplete(
            destInputRef.current,
            options
          );
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place) {
              const addr = place.formatted_address || place.name || '';
              setDestinationAddress(addr);
              if (place.geometry?.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setDestMapsUrl(formatGoogleMapsUrl(lat, lng));
              }
            }
          });
          destAutocompleteRef.current = autocomplete;
        }
      } catch (err) {
        console.warn('Google Maps Autocomplete setup notice:', err);
      }
    };

    if (isGoogleMapsLoaded()) {
      setupAutocomplete();
    } else if (apiKey) {
      loadGoogleMapsScript(apiKey).then((loaded) => {
        if (loaded && isMounted) {
          setupAutocomplete();
        }
      });
    }

    const interval = setInterval(() => {
      if (isGoogleMapsLoaded()) {
        setupAutocomplete();
        clearInterval(interval);
      }
    }, 400);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [apiKey]);

  // Cek jika pengguna edit/paste link Google Maps langsung ke kolom telusuri
  const handlePickupChange = (value: string) => {
    setPickupAddress(value);
    if (!value.trim()) {
      setPickupMapsUrl('');
    } else if (value.includes('maps.google.com') || value.includes('goo.gl') || value.includes('maps.app')) {
      const match = value.match(/(https?:\/\/[^\s]+)/);
      if (match) {
        setPickupMapsUrl(match[0]);
      }
    }
  };

  const handleDestChange = (value: string) => {
    setDestinationAddress(value);
    if (!value.trim()) {
      setDestMapsUrl('');
    } else if (value.includes('maps.google.com') || value.includes('goo.gl') || value.includes('maps.app')) {
      const match = value.match(/(https?:\/\/[^\s]+)/);
      if (match) {
        setDestMapsUrl(match[0]);
      }
    }
  };

  // Ambil Lokasi (GPS) untuk Titik Awal / Jemput
  const applyGpsToPickup = async () => {
    if (userLocation.status === 'granted' && userLocation.mapsUrl) {
      setPickupAddress(userLocation.address || 'Titik Lokasi GPS Saya');
      setPickupMapsUrl(userLocation.mapsUrl);
      return;
    }
    setIsLocatingPickup(true);
    const loc = await detectCurrentLocation();
    setIsLocatingPickup(false);
    if (loc.status === 'granted' && loc.mapsUrl) {
      setPickupAddress(loc.address || 'Titik Lokasi GPS Saya');
      setPickupMapsUrl(loc.mapsUrl);
    } else {
      alert('Izin GPS belum aktif di perangkat Anda. Silakan ketik lokasi pada kolom telusuri (Google Maps).');
    }
  };

  // Ambil Lokasi (GPS) untuk Titik Tujuan / Antar
  const applyGpsToDest = async () => {
    if (userLocation.status === 'granted' && userLocation.mapsUrl) {
      setDestinationAddress(userLocation.address || 'Titik Lokasi GPS Saya');
      setDestMapsUrl(userLocation.mapsUrl);
      return;
    }
    setIsLocatingDest(true);
    const loc = await detectCurrentLocation();
    setIsLocatingDest(false);
    if (loc.status === 'granted' && loc.mapsUrl) {
      setDestinationAddress(loc.address || 'Titik Lokasi GPS Saya');
      setDestMapsUrl(loc.mapsUrl);
    } else {
      alert('Izin GPS belum aktif di perangkat Anda. Silakan ketik lokasi pada kolom telusuri (Google Maps).');
    }
  };

  const formatLocationEntry = (addressText: string, landmark: string, mapsUrl: string): string => {
    let baseAddr = addressText.trim();
    const cleanLandmark = landmark.trim();
    const cleanUrl = mapsUrl.trim();
    if (cleanLandmark) {
      baseAddr = baseAddr ? `${baseAddr} (Patokan: ${cleanLandmark})` : `Patokan: ${cleanLandmark}`;
    }
    if (cleanUrl) {
      if (baseAddr) {
        return `${baseAddr} - ${cleanUrl}`;
      }
      return cleanUrl;
    }
    return baseAddr || '-';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!customerName.trim()) {
      setValidationError('Silakan masukkan Nama Anda.');
      return;
    }

    if (!pickupAddress.trim() && !pickupMapsUrl && !pickupLandmark.trim()) {
      setValidationError(`Silakan telusuri atau tentukan ${labels.pickupLabel}.`);
      return;
    }

    if (!destinationAddress.trim() && !destMapsUrl && !destLandmark.trim()) {
      setValidationError(`Silakan telusuri atau tentukan ${labels.destLabel}.`);
      return;
    }

    const cleanNotes = notes.trim() ? notes.trim() : '-';
    const jemputText = formatLocationEntry(pickupAddress, pickupLandmark, pickupMapsUrl);
    const tujuanText = formatLocationEntry(destinationAddress, destLandmark, destMapsUrl);

    const waMessage = `Halo Admin D'Jek, saya ingin memesan layanan:
- Layanan: ${service.name} (${service.badge})
- Nama: ${customerName.trim()}
- ${labels.pickupPrompt}: ${jemputText}
- ${labels.destPrompt}: ${tujuanText}
- ${labels.notesPrompt}: ${cleanNotes}
- Metode Pembayaran: ${paymentMethod}

Mohon segera diproses, terima kasih!`;

    const encoded = encodeURIComponent(waMessage);
    const directWaUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encoded}`;
    const webUrl = `https://api.whatsapp.com/send?phone=${ADMIN_WHATSAPP_NUMBER}&text=${encoded}`;
    const appUrl = `whatsapp://send?phone=${ADMIN_WHATSAPP_NUMBER}&text=${encoded}`;

    setFormattedMessage(waMessage);
    setWaLinkWeb(webUrl);
    setWaLinkApp(appUrl);
    setShowSuccessModal(true);

    try {
      const link = document.createElement('a');
      link.href = directWaUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      // modal tetap aktif
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-full animate-in fade-in slide-in-from-right duration-200 relative bg-slate-50/50">
      {/* Top Navigation Bar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>Kembali</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <h2 className="text-xs font-black text-slate-900 leading-tight">{service.name}</h2>
            <p className="text-[10px] text-slate-500 font-semibold">{service.badge}</p>
          </div>
          <div className={`p-1.5 rounded-lg border ${getServiceBadgeStyle(service.id)}`}>
            {renderServiceIcon(service.id, 'w-4 h-4')}
          </div>
        </div>
      </div>

      {/* Formulir Pemesanan Sederhana */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* 1. Nama Pemesan */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-2.5 space-y-1 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Nama Pemesan</span>
                <span className="text-rose-500">*</span>
              </label>
              {customerName.trim() && (
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Terisi
                </span>
              )}
            </div>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Masukkan nama Anda..."
              required
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-100 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 transition-all outline-none"
            />
          </div>

          {/* 2. Rute Perjalanan (Titik Awal & Titik Tujuan) */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-2.5 space-y-2 shadow-2xs">
            {/* Titik Jemput / Awal */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-blue-100 shrink-0"></span>
                  <span className="truncate">{labels.pickupPrompt} (Awal)</span>
                  <span className="text-rose-500">*</span>
                </label>
                {pickupMapsUrl && (
                  <span className="text-[9px] text-emerald-700 font-bold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Maps Terhubung
                  </span>
                )}
              </div>

              <div className="flex items-stretch gap-2">
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <div className="relative shrink-0 h-8">
                    <Search className="w-3.5 h-3.5 text-blue-600 absolute left-2.5 top-2.5 pointer-events-none" />
                    <input
                      ref={pickupInputRef}
                      type="text"
                      value={pickupAddress}
                      onChange={(e) => handlePickupChange(e.target.value)}
                      placeholder={labels.pickupPlaceholder}
                      required={!pickupMapsUrl && !pickupLandmark}
                      autoComplete="off"
                      className="w-full h-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-100 rounded-lg pl-8 pr-2 text-xs text-slate-800 placeholder-slate-400 transition-all outline-none"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={pickupLandmark}
                    onChange={(e) => setPickupLandmark(e.target.value)}
                    placeholder={labels.pickupLandmarkPlaceholder}
                    className="w-full flex-1 min-h-[48px] bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-700 placeholder-slate-400 outline-none resize-none leading-snug block"
                  />
                </div>
                <button
                  type="button"
                  onClick={applyGpsToPickup}
                  disabled={isLocatingPickup}
                  title="Klik untuk ambil lokasi saat ini"
                  className={`w-[84px] sm:w-[90px] self-stretch flex flex-col items-center justify-center p-2 rounded-xl border text-center shrink-0 cursor-pointer transition-all active:scale-95 ${
                    pickupMapsUrl
                      ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-2xs ring-1 ring-blue-300'
                      : 'bg-slate-50 hover:bg-blue-50 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700'
                  }`}
                >
                  <span className="text-[9.5px] leading-tight font-bold text-center">
                    Klik untuk ambil lokasi saat ini
                  </span>
                  <Navigation className={`w-3.5 h-3.5 text-rose-500 mt-1 shrink-0 ${isLocatingPickup ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {pickupMapsUrl && (
                <div className="px-2 py-1 rounded-lg bg-blue-50/90 border border-blue-200 text-blue-900 text-[10px] flex items-center justify-between">
                  <div className="flex items-center gap-1 truncate">
                    <LinkIcon className="w-3 h-3 text-blue-600 shrink-0" />
                    <span className="truncate font-medium">{pickupMapsUrl}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-1">
                    <a
                      href={pickupMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-0.5 text-blue-600 hover:text-blue-800"
                      title="Buka di Google Maps"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setPickupMapsUrl('')}
                      className="text-slate-400 hover:text-slate-700 px-1 text-xs cursor-pointer"
                      title="Hapus Link"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tombol Tukar Titik (Swap) */}
            <div className="relative flex items-center justify-between my-0.5 px-1">
              <div className="border-t border-dashed border-slate-200 flex-1"></div>
              <button
                type="button"
                onClick={handleSwapLocations}
                title="Tukar Titik Awal & Tujuan"
                className="mx-2 flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-2 py-0.5 rounded-md border border-slate-200 transition-colors cursor-pointer active:scale-95"
              >
                <ArrowUpDown className="w-2.5 h-2.5 text-blue-600" />
                <span>Tukar Titik</span>
              </button>
              <div className="border-t border-dashed border-slate-200 flex-1"></div>
            </div>

            {/* Titik Tujuan / Akhir */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-rose-100 shrink-0"></span>
                  <span className="truncate">{labels.destPrompt} (Tujuan)</span>
                  <span className="text-rose-500">*</span>
                </label>
                {destMapsUrl && (
                  <span className="text-[9px] text-emerald-700 font-bold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Maps Terhubung
                  </span>
                )}
              </div>

              <div className="flex items-stretch gap-2">
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <div className="relative shrink-0 h-8">
                    <Search className="w-3.5 h-3.5 text-blue-600 absolute left-2.5 top-2.5 pointer-events-none" />
                    <input
                      ref={destInputRef}
                      type="text"
                      value={destinationAddress}
                      onChange={(e) => handleDestChange(e.target.value)}
                      placeholder={labels.destPlaceholder}
                      required={!destMapsUrl && !destLandmark}
                      autoComplete="off"
                      className="w-full h-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-100 rounded-lg pl-8 pr-2 text-xs text-slate-800 placeholder-slate-400 transition-all outline-none"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={destLandmark}
                    onChange={(e) => setDestLandmark(e.target.value)}
                    placeholder={labels.destLandmarkPlaceholder}
                    className="w-full flex-1 min-h-[48px] bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-700 placeholder-slate-400 outline-none resize-none leading-snug block"
                  />
                </div>
                <button
                  type="button"
                  onClick={applyGpsToDest}
                  disabled={isLocatingDest}
                  title="Klik untuk ambil lokasi saat ini"
                  className={`w-[84px] sm:w-[90px] self-stretch flex flex-col items-center justify-center p-2 rounded-xl border text-center shrink-0 cursor-pointer transition-all active:scale-95 ${
                    destMapsUrl
                      ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-2xs ring-1 ring-rose-200'
                      : 'bg-slate-50 hover:bg-rose-50 border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-700'
                  }`}
                >
                  <span className="text-[9.5px] leading-tight font-bold text-center">
                    Klik untuk ambil lokasi saat ini
                  </span>
                  <Navigation className={`w-3.5 h-3.5 text-rose-500 mt-1 shrink-0 ${isLocatingDest ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {destMapsUrl && (
                <div className="px-2 py-1 rounded-lg bg-blue-50/90 border border-blue-200 text-blue-900 text-[10px] flex items-center justify-between">
                  <div className="flex items-center gap-1 truncate">
                    <LinkIcon className="w-3 h-3 text-blue-600 shrink-0" />
                    <span className="truncate font-medium">{destMapsUrl}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-1">
                    <a
                      href={destMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-0.5 text-blue-600 hover:text-blue-800"
                      title="Buka di Google Maps"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setDestMapsUrl('')}
                      className="text-slate-400 hover:text-slate-700 px-1 text-xs cursor-pointer"
                      title="Hapus Link"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Catatan / Detail Pesanan */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-2.5 space-y-1 shadow-2xs">
            <label className="text-[11px] font-bold text-slate-800 flex items-center justify-between">
              <span>{labels.notesLabel}</span>
              <span className="text-[10px] text-slate-400 font-normal">Opsional</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={labels.notesPlaceholder}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-100 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 transition-all outline-none"
            />
          </div>

          {/* 4. Metode Pembayaran */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-2 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                <span>Metode Pembayaran</span>
                <span className="text-rose-500">*</span>
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                {paymentMethod}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('Tunai (Cash)')}
                className={`py-1.5 px-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                  paymentMethod === 'Tunai (Cash)'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Banknote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Tunai (Cash)</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('QRIS / Transfer')}
                className={`py-1.5 px-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                  paymentMethod === 'QRIS / Transfer'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">QRIS / Transfer</span>
              </button>
            </div>
          </div>

          {/* Pesan Validasi Jika Kosong */}
          {validationError && (
            <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5 animate-in fade-in">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Tombol Kirim Pesanan via WhatsApp */}
        <div className="pt-1.5 pb-2 space-y-1">
          <button
            type="submit"
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 active:scale-[0.99] transition-all cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4 shrink-0" />
            <span>Kirim Pesanan ke WhatsApp Admin</span>
          </button>
          
          <div className="flex items-center justify-center gap-1 text-center text-[10px] text-slate-500">
            <span>WhatsApp Admin:</span>
            <strong className="text-slate-700 font-bold">{ADMIN_WHATSAPP_DISPLAY}</strong>
          </div>
        </div>
      </form>

      {/* Modal Dialog WhatsApp */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Pesanan Siap Dikirim!</h3>
                  <p className="text-[11px] text-emerald-600 font-bold">WhatsApp: {ADMIN_WHATSAPP_DISPLAY}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Klik tombol di bawah untuk membuka WhatsApp. Admin dapat langsung mengklik link Google Maps lokasi Anda:
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-[11px] font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto select-all">
              {formattedMessage}
            </div>

            <div className="space-y-2 pt-1">
              <a
                href={waLinkWeb}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all text-center"
              >
                <WhatsAppIcon className="w-4 h-4 shrink-0" />
                <span>Buka WhatsApp Sekarang</span>
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="w-full py-2 px-3 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Teks Pesan Berhasil Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Pesan (Jika ingin paste manual)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
