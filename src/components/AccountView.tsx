import React, { useState } from 'react';
import { Phone, MapPin, Tag, Shield, Settings, ChevronRight, Check, Key } from 'lucide-react';
import { ADMIN_WHATSAPP_DISPLAY, ADMIN_WHATSAPP_NUMBER } from '../data/services';

interface AccountViewProps {
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({ apiKey, onSaveApiKey }) => {
  const [showMapSettings, setShowMapSettings] = useState(false);
  const [mapKeyInput, setMapKeyInput] = useState(apiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveMapKey = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(mapKeyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowMapSettings(false);
    }, 1200);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Profile Card */}
      <div className="bg-[#141923] border border-[#232b3b] rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
            DP
          </div>
          <div>
            <h2 className="font-bold text-white text-sm">Pelanggan D'Jek</h2>
            <p className="text-xs text-slate-400">+62 822-****-****</p>
            <span className="inline-block mt-0.5 text-[10px] bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
              Member Prioritas
            </span>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="bg-[#131720] border border-[#222a38] rounded-2xl divide-y divide-[#1e2533] overflow-hidden text-xs">
        {/* Voucher */}
        <div className="p-3.5 flex items-center justify-between hover:bg-[#181d28] transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-200">Voucher & Promo</div>
              <div className="text-[10px] text-slate-400">Kupon DJEKHEMAT aktif</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        {/* Alamat Tersimpan */}
        <div className="p-3.5 flex items-center justify-between hover:bg-[#181d28] transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-200">Alamat Favorit</div>
              <div className="text-[10px] text-slate-400">Rumah, Kantor, Kampus</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        {/* Keamanan & Syarat */}
        <div className="p-3.5 flex items-center justify-between hover:bg-[#181d28] transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-200">Keamanan & Privasi</div>
              <div className="text-[10px] text-slate-400">Driver terverifikasi & asuransi</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        {/* Pengaturan Peta */}
        <div
          onClick={() => setShowMapSettings(!showMapSettings)}
          className="p-3.5 flex items-center justify-between hover:bg-[#181d28] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-200">Pengaturan Google Maps</div>
              <div className="text-[10px] text-slate-400">
                {apiKey ? 'API Pribadi Terpasang' : 'Mode Otomatis Aktif'}
              </div>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${showMapSettings ? 'rotate-90' : ''}`} />
        </div>
      </div>

      {/* Expanded Map Settings Drawer if toggled */}
      {showMapSettings && (
        <form onSubmit={handleSaveMapKey} className="bg-[#141923] border border-[#252f40] rounded-2xl p-4 space-y-3">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5 text-blue-400" />
            <span>Koneksi Google Maps Autocomplete</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Masukkan Google Maps API Key untuk menggunakan fitur pencarian alamat langsung dari Google.
          </p>
          <input
            type="text"
            value={mapKeyInput}
            onChange={(e) => setMapKeyInput(e.target.value)}
            placeholder="Ketik atau tempel Google Maps API Key..."
            className="w-full bg-[#1b2230] border border-[#2c374c] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          />
          {savedSuccess && (
            <div className="text-[11px] text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Pengaturan peta berhasil disimpan.</span>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="submit"
              className="py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
            >
              Simpan
            </button>
          </div>
        </form>
      )}

      {/* Kontak Admin WhatsApp */}
      <a
        href={`https://wa.me/${ADMIN_WHATSAPP_NUMBER}`}
        className="block bg-gradient-to-r from-emerald-950/50 to-[#141923] border border-emerald-500/30 rounded-2xl p-3.5 text-xs hover:border-emerald-500/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">Hubungi Admin D'Jek</div>
              <div className="text-[11px] text-emerald-400">{ADMIN_WHATSAPP_DISPLAY}</div>
            </div>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-lg">
            Hubungi
          </span>
        </div>
      </a>

      {/* Versi App */}
      <div className="text-center pt-2 text-[11px] text-slate-400 space-y-0.5">
        <p className="font-medium text-slate-400">D'Jek Mobile App v2.4.0 (Official Release)</p>
        <p className="text-[10px] text-slate-400">&copy; 2026 D'Jek Indonesia. Hak Cipta Dilindungi.</p>
      </div>
    </div>
  );
};
