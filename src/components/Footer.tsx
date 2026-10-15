import React from 'react';
import { Phone, Shield, Clock } from 'lucide-react';
import { ADMIN_WHATSAPP_DISPLAY, ADMIN_WHATSAPP_NUMBER } from '../data/services';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-8 pt-6 border-t border-slate-200 text-center space-y-4 pb-6">
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Operasional: 24 Jam Nonstop</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>Driver Resmi & Berpengalaman</span>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 inline-block">
        <a
          href={`https://wa.me/${ADMIN_WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-slate-700 hover:text-emerald-600 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-600" />
          <span>Layanan Bantuan WhatsApp: <strong>{ADMIN_WHATSAPP_DISPLAY}</strong></span>
        </a>
      </div>

      <div className="text-[11px] text-slate-400 space-y-1">
        <p className="font-semibold text-slate-500">
          D'Jek &copy; 2026. Aplikasi Transportasi & Logistik Online Mobile-First.
        </p>
        <p className="text-[10px] text-slate-400">
          Didesain khusus untuk kecepatan, integrasi WhatsApp langsung, dan Google Maps Places Autocomplete.
        </p>
      </div>
    </footer>
  );
};
