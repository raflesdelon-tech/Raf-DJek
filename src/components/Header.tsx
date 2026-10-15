import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs overflow-hidden transition-all">
      <div className="w-full px-4 py-3 flex items-center justify-between bg-white animate-in fade-in duration-150">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-black text-xl shadow-xs flex items-center justify-center overflow-hidden shrink-0">
            D'
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-[#001e5a] leading-tight">
              D'Jek
            </h1>
            <p className="text-[11px] font-semibold text-slate-500">
              Transportasi, Kurir & Belanja
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-bold text-emerald-700">Online 24 Jam</span>
        </div>
      </div>
    </header>
  );
};
