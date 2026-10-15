import React, { useState } from 'react';
import { MessageSquare, Phone, Send, ShieldCheck, CheckCheck } from 'lucide-react';
import { ADMIN_WHATSAPP_DISPLAY, ADMIN_WHATSAPP_NUMBER } from '../data/services';

export const ChatView: React.FC = () => {
  const [inputMsg, setInputMsg] = useState('');

  const quickQuestions = [
    'Halo Admin, mau tanya ketersediaan driver saat ini.',
    'Bisa tolong cek pesanan saya?',
    "Bagaimana cara top up saldo D'Pay?",
    'Apakah melayani kurir antar kota?',
  ];

  const handleSendToWhatsApp = (textToSend?: string) => {
    const message = textToSend || inputMsg.trim() || "Halo Admin D'Jek, saya butuh bantuan.";
    const url = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.location.href = url;
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Header CS */}
      <div className="bg-[#141923] border border-[#232b3b] rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-orange-500/20">
              CS
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#141923] rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-white text-sm">Customer Care D'Jek</h2>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-[11px] text-emerald-400 font-medium">Online 24 Jam • Respon Cepat</p>
            <p className="text-[10px] text-slate-400">{ADMIN_WHATSAPP_DISPLAY}</p>
          </div>
        </div>
        <a
          href={`https://wa.me/${ADMIN_WHATSAPP_NUMBER}`}
          className="w-9 h-9 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 flex items-center justify-center transition-colors"
        >
          <Phone className="w-4 h-4" />
        </a>
      </div>

      {/* Simulated Chat Dialogue Bubble */}
      <div className="bg-[#10131b] border border-[#1e2534] rounded-2xl p-4 space-y-3">
        <div className="flex items-start gap-2.5 max-w-[85%]">
          <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
            D'
          </div>
          <div className="bg-[#171d29] border border-[#252f42] rounded-2xl rounded-tl-sm p-3 text-xs text-slate-200 space-y-1">
            <p className="font-bold text-orange-400 text-[11px]">Admin Resmi D'Jek</p>
            <p className="leading-relaxed">
              Halo Kak! Selamat datang di Pusat Bantuan D'Jek. Ada yang bisa kami bantu seputar pesanan, tarif, atau layanan driver?
            </p>
            <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-1">
              <span>Baru saja</span>
              <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Quick Question Chips */}
        <div className="pt-2">
          <div className="text-[11px] font-semibold text-slate-400 mb-2">Pertanyaan Populer:</div>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendToWhatsApp(q)}
                className="text-[11px] text-slate-300 bg-[#161c27] hover:bg-[#20293a] border border-[#252f42] hover:border-orange-500/40 px-2.5 py-1.5 rounded-xl transition-colors text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input & Direct Send */}
      <div className="bg-[#141923] border border-[#232b3b] rounded-2xl p-2.5 flex items-center gap-2">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendToWhatsApp();
          }}
          placeholder="Ketik pesan untuk Admin WhatsApp..."
          className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => handleSendToWhatsApp()}
          className="p-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-colors shadow-md shadow-orange-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Big Action Button */}
      <button
        type="button"
        onClick={() => handleSendToWhatsApp()}
        className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
      >
        <MessageSquare className="w-4 h-4" />
        <span>Buka WhatsApp Resmi Admin ({ADMIN_WHATSAPP_DISPLAY})</span>
      </button>
    </div>
  );
};
