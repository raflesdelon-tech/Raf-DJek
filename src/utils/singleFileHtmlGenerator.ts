import { ADMIN_WHATSAPP_NUMBER, ADMIN_WHATSAPP_DISPLAY } from '../data/services';

export function getSingleFileHtmlCode(customApiKey?: string): string {
  const apiKeyPlaceholder = customApiKey && customApiKey.trim() ? customApiKey.trim() : 'YOUR_API_KEY';
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>D'Jek - Layanan Transportasi & Kurir Online</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: { sans: ['"Plus Jakarta Sans"', 'sans-serif'] }
        }
      }
    }
  </script>
  <style>
    .pac-container {
      background-color: #ffffff !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 0.75rem !important;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1) !important;
      font-family: 'Plus Jakarta Sans', sans-serif !important;
      margin-top: 6px !important;
      z-index: 99999 !important;
    }
    .pac-item {
      color: #334155 !important;
      border-top: 1px solid #f1f5f9 !important;
      padding: 10px 14px !important;
      cursor: pointer !important;
    }
    .pac-item:hover { background-color: #f0f7ff !important; }
    .pac-item-query { color: #0284c7 !important; font-weight: 700 !important; }
  </style>
  <script 
    src="https://maps.googleapis.com/maps/api/js?key=${apiKeyPlaceholder}&libraries=places&language=id&region=ID&callback=initGoogleMapsAutocomplete" 
    async 
    defer>
  </script>
</head>
<body class="bg-slate-100 text-slate-800 min-h-screen flex justify-center selection:bg-blue-600 selection:text-white">
  <div class="w-full max-w-md min-h-screen bg-white flex flex-col shadow-xl relative border-x border-slate-200">
    <header class="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div class="flex items-center space-x-2.5">
        <div>
          <div class="flex items-center gap-1.5">
            <h1 class="text-lg font-black text-[#001e5a]">D'Jek</h1>
            <span class="text-[9px] bg-blue-50 text-blue-700 font-extrabold px-1.5 py-0.5 rounded border border-blue-200">ONLINE</span>
          </div>
          <p class="text-[10px] text-slate-500">Pesan Langsung via WhatsApp</p>
        </div>
      </div>
      <div class="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Buka 24 Jam</span>
      </div>
    </header>

    <div id="homeScreen" class="flex flex-col flex-1 justify-between p-4 space-y-3.5">
      <div class="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-xs">
        <div class="flex items-center gap-2.5 min-w-0 flex-1">
          <div class="min-w-0 flex-1">
            <div class="text-[10px] text-slate-500 font-bold uppercase">GPS Terintegrasi</div>
            <p id="homeGpsStatusText" class="text-xs font-semibold text-slate-800 truncate mt-0.5">Mendeteksi lokasi GPS Anda...</p>
          </div>
        </div>
        <button type="button" onclick="requestInitialGps()" class="p-1.5 text-xs text-blue-600 bg-white rounded-lg border border-slate-200 font-bold shadow-xs">
          Segarkan
        </button>
      </div>

      <div class="bg-gradient-to-br from-[#001e5a] via-[#004bb5] to-[#006ee6] text-white rounded-2xl p-4 shadow-md">
        <span class="text-[11px] font-bold text-blue-200 block">Pesan Praktis via WhatsApp</span>
        <h2 class="text-lg font-black mt-1">Pilih Layanan D'Jek</h2>
        <p class="text-xs text-blue-100 mt-1 leading-relaxed">
          Pilih layanan, isi nama dan patokan alamat atau ambil titik GPS, pesanan otomatis dikirim ke WhatsApp Admin.
        </p>
      </div>

      <div class="space-y-3 flex-1 flex flex-col justify-center">
        <button onclick="openBooking('D\\'Ride', 'Ojek Motor', 'Contoh: Helm bersih, jangan ngebut')" 
          class="w-full text-left p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-blue-600 active:scale-[0.99] transition-all flex items-center justify-between shadow-xs hover:shadow-md">
          <div class="flex items-center gap-3.5">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-black text-base text-slate-900">D'Ride</h3>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Ojek Motor</span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">Ojek Motor Gesit & Cepat</p>
              <span class="text-[11px] text-blue-600 font-semibold block mt-1">Pilih untuk memesan &rarr;</span>
            </div>
          </div>
          <span class="text-lg text-slate-400">&rarr;</span>
        </button>

        <button onclick="openBooking('D\\'Send', 'Kurir Barang', 'Contoh: Paket dokumen atau baju')" 
          class="w-full text-left p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-emerald-600 active:scale-[0.99] transition-all flex items-center justify-between shadow-xs hover:shadow-md">
          <div class="flex items-center gap-3.5">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-black text-base text-slate-900">D'Send</h3>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Kurir Barang</span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">Kurir Pengiriman Paket & Dokumen</p>
              <span class="text-[11px] text-emerald-600 font-semibold block mt-1">Pilih untuk memesan &rarr;</span>
            </div>
          </div>
          <span class="text-lg text-slate-400">&rarr;</span>
        </button>
      </div>

      <a href="https://api.whatsapp.com/send?phone=${ADMIN_WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer" class="bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-3 flex items-center justify-between text-xs shadow-xs">
        <div class="flex items-center gap-2.5">
          <div>
            <div class="font-bold text-slate-900">WhatsApp Admin D'Jek</div>
            <div class="text-[11px] text-emerald-600 font-semibold">${ADMIN_WHATSAPP_DISPLAY}</div>
          </div>
        </div>
        <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-lg">Chat WA</span>
      </a>
    </div>

    <div id="bookingScreen" class="hidden flex-col flex-1 bg-white">
      <div class="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <button type="button" onclick="closeBooking()" class="text-xs font-bold text-slate-700 hover:text-blue-600 py-1.5 px-3 rounded-xl bg-slate-100 border border-slate-200">
          &larr; Kembali
        </button>
        <div class="text-right">
          <span id="screenServiceTitle" class="text-xs font-bold text-slate-900 block">D'Ride</span>
          <span id="screenServiceBadge" class="text-[10px] text-slate-500 font-medium">Ojek Motor</span>
        </div>
      </div>

      <form id="orderForm" onsubmit="event.preventDefault(); submitToWhatsApp();" class="p-4 space-y-3.5 flex-1">
        <div class="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-1.5 shadow-xs">
          <label class="block text-xs font-bold text-slate-800">
            Nama Pemesan <span class="text-blue-600">*</span>
          </label>
          <input type="text" id="custName" placeholder="Ketik nama lengkap Anda..." required 
            class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none">
        </div>

        <div class="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2 shadow-xs">
          <label class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>Lokasi Penjemputan (Awal)</span>
            <span class="text-blue-600">*</span>
          </label>
          <input type="text" id="pickupAddr" placeholder="Alamat jemput atau patokan..." required 
            class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none">
        </div>

        <div class="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2 shadow-xs">
          <label class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>Lokasi Tujuan (Akhir)</span>
            <span class="text-blue-600">*</span>
          </label>
          <input type="text" id="destAddr" placeholder="Alamat tujuan atau patokan..." required 
            class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none">
        </div>

        <div class="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-1.5 shadow-xs">
          <label class="block text-xs font-bold text-slate-800">
            Catatan Tambahan <span class="text-slate-400 font-normal">(Opsional)</span>
          </label>
          <textarea id="orderNotes" rows="2" placeholder="Contoh: Helm bersih" 
            class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none resize-none"></textarea>
        </div>

        <div class="pt-1">
          <button type="submit" 
            class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20">
            <span>Kirim Pesanan ke WhatsApp Admin</span>
          </button>
          <p class="text-center text-[10px] text-slate-500 mt-2">
            Pemesanan langsung diteruskan ke WhatsApp Admin (${ADMIN_WHATSAPP_DISPLAY})
          </p>
        </div>
      </form>
    </div>
  </div>

  <script>
    const ADMIN_WA = "${ADMIN_WHATSAPP_NUMBER}";
    let currentService = "D'Ride";

    function requestInitialGps() {
      if (!navigator.geolocation) {
        document.getElementById('homeGpsStatusText').textContent = "Browser tidak mendukung GPS";
        return;
      }
      document.getElementById('homeGpsStatusText').textContent = "Mendeteksi titik GPS Anda...";
      navigator.geolocation.getCurrentPosition(
        pos => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const myDetectedAddress = "Lokasi GPS Saya (" + lat.toFixed(4) + ", " + lng.toFixed(4) + ")";
          document.getElementById('homeGpsStatusText').textContent = myDetectedAddress;
        },
        () => {
          document.getElementById('homeGpsStatusText').textContent = "Izin lokasi belum diizinkan";
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
    requestInitialGps();

    function openBooking(name, badge, hint) {
      currentService = name;
      document.getElementById('screenServiceTitle').textContent = name;
      document.getElementById('screenServiceBadge').textContent = badge;
      document.getElementById('orderNotes').placeholder = hint;
      document.getElementById('homeScreen').classList.add('hidden');
      document.getElementById('bookingScreen').classList.remove('hidden');
      document.getElementById('bookingScreen').classList.add('flex');
    }

    function closeBooking() {
      document.getElementById('bookingScreen').classList.add('hidden');
      document.getElementById('bookingScreen').classList.remove('flex');
      document.getElementById('homeScreen').classList.remove('hidden');
    }

    function submitToWhatsApp() {
      const name = document.getElementById('custName').value.trim();
      const pickup = document.getElementById('pickupAddr').value.trim();
      const dest = document.getElementById('destAddr').value.trim();
      const notes = document.getElementById('orderNotes').value.trim() || '-';

      const msg = "Halo Admin D'Jek, saya ingin memesan layanan:\\n- Layanan: " + currentService + "\\n- Nama: " + name + "\\n- Jemput: " + pickup + "\\n- Tujuan: " + dest + "\\n- Catatan: " + notes + "\\nMohon segera diproses, terima kasih!";
      const webUrl = "https://api.whatsapp.com/send?phone=" + ADMIN_WA + "&text=" + encodeURIComponent(msg);
      window.open(webUrl, '_blank');
    }

    function initGoogleMapsAutocomplete() {
      try {
        if (window.google && window.google.maps && window.google.maps.places) {
          const opt = { componentRestrictions: { country: 'id' } };
          new google.maps.places.Autocomplete(document.getElementById('pickupAddr'), opt);
          new google.maps.places.Autocomplete(document.getElementById('destAddr'), opt);
        }
      } catch(e){}
    }
  </script>
</body>
</html>`;
}
