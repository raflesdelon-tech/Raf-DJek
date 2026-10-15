import React, { useState } from 'react';
import {
  Bike,
  PackageCheck,
  ShoppingCart,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { SpoonForkIcon } from './SpoonForkIcon';
import { WhatsAppIcon } from './WhatsAppIcon';
import { ServiceItem } from '../types';
import { ADMIN_WHATSAPP_NUMBER, ADMIN_WHATSAPP_DISPLAY } from '../data/services';

interface HomeScreenProps {
  services: ServiceItem[];
  onSelectService: (service: ServiceItem) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  services,
  onSelectService,
}) => {
  const [bannerError, setBannerError] = useState(false);

  const getServiceConfig = (id: string) => {
    switch (id) {
      case 'd-ride':
        return {
          icon: <Bike className="w-6 h-6" />,
          boxStyle: 'bg-blue-50 text-blue-600 border-blue-200 group-hover:bg-blue-600 group-hover:text-white',
          badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
          hoverBorder: 'hover:border-blue-600',
          titleColor: 'group-hover:text-blue-700',
          arrowHover: 'group-hover:bg-blue-600',
        };
      case 'd-send':
        return {
          icon: <PackageCheck className="w-6 h-6" />,
          boxStyle: 'bg-emerald-50 text-emerald-600 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white',
          badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          hoverBorder: 'hover:border-emerald-600',
          titleColor: 'group-hover:text-emerald-700',
          arrowHover: 'group-hover:bg-emerald-600',
        };
      case 'd-food':
        return {
          icon: <SpoonForkIcon className="w-6 h-6" />,
          boxStyle: 'bg-orange-50 text-orange-600 border-orange-200 group-hover:bg-orange-600 group-hover:text-white',
          badgeStyle: 'bg-orange-50 text-orange-700 border-orange-200',
          hoverBorder: 'hover:border-orange-600',
          titleColor: 'group-hover:text-orange-700',
          arrowHover: 'group-hover:bg-orange-600',
        };
      case 'd-mart':
        return {
          icon: <ShoppingCart className="w-6 h-6" />,
          boxStyle: 'bg-purple-50 text-purple-600 border-purple-200 group-hover:bg-purple-600 group-hover:text-white',
          badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200',
          hoverBorder: 'hover:border-purple-600',
          titleColor: 'group-hover:text-purple-700',
          arrowHover: 'group-hover:bg-purple-600',
        };
      default:
        return {
          icon: <Bike className="w-6 h-6" />,
          boxStyle: 'bg-slate-50 text-slate-600 border-slate-200 group-hover:bg-blue-600 group-hover:text-white',
          badgeStyle: 'bg-slate-50 text-slate-700 border-slate-200',
          hoverBorder: 'hover:border-blue-600',
          titleColor: 'group-hover:text-blue-700',
          arrowHover: 'group-hover:bg-blue-600',
        };
    }
  };

  return (
    <div className="flex flex-col h-full flex-1 min-h-0 justify-between bg-white">
      {/* Tampilan Bagian Atas Halaman Depan Banner Resmi D'Jek */}
      <header className="shrink-0 bg-white border-b border-slate-100 flex items-center justify-center overflow-hidden shadow-2xs">
        {!bannerError ? (
          <img
            src="/djek-banner.png"
            alt="D'Jek Ojek Online"
            className="w-full h-auto max-h-32 object-contain select-none block"
            loading="eager"
            decoding="sync"
            onError={() => setBannerError(true)}
          />
        ) : (
          <div className="w-full px-5 py-4 bg-gradient-to-r from-[#001e5a] via-[#00388d] to-[#0052cc] text-white flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white">D'Jek</span>
                <span className="text-[10px] bg-white/20 text-white font-extrabold px-2 py-0.5 rounded-full backdrop-blur-xs">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-blue-100 font-medium">Layanan Transportasi & Kurir Online</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Aktif 24 Jam</span>
            </div>
          </div>
        )}
      </header>

      {/* 4 Layanan D'Jek */}
      <div className="flex-1 overflow-y-auto p-4 py-4 space-y-3">
        {services.map((service) => {
          const cfg = getServiceConfig(service.id);
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelectService(service)}
              className={`w-full text-left p-3.5 rounded-2xl bg-white border-2 border-slate-200 ${cfg.hoverBorder} active:scale-[0.99] transition-all flex items-center justify-between shadow-xs hover:shadow-md group cursor-pointer`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors shrink-0 ${cfg.boxStyle}`}
                >
                  {cfg.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-black text-sm sm:text-base text-slate-900 ${cfg.titleColor} transition-colors truncate`}>
                      {service.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${cfg.badgeStyle}`}
                    >
                      {service.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium truncate">
                    {service.tagline}
                  </p>
                </div>
              </div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 ${cfg.arrowHover} text-slate-400 group-hover:text-white transition-all shrink-0 ml-2`}>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Bagian Paling Dasar Aplikasi (Bagian Tetap) */}
      <footer className="shrink-0 bg-white border-t border-slate-200/90 px-4 py-3 pb-3.5 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] z-20">
        <a
          href={`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=Halo%20Admin%20D'Jek,%20saya%20ingin%20menanyakan%20info%20tambahan%20mengenai%20tarif%20layanan.`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer group shadow-2xs"
          title="Klik untuk minta info tambahan ke WhatsApp Admin"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <MessageSquare className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
            <span className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-600 italic select-none truncate font-normal">
              Tarif Ditentukan Admin...
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 text-emerald-600 font-semibold text-xs group-hover:underline">
            <span>WhatsApp: {ADMIN_WHATSAPP_DISPLAY}</span>
            <WhatsAppIcon className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
          </div>
        </a>
      </footer>
    </div>
  );
};
