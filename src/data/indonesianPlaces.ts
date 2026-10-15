export interface SuggestedPlace {
  title: string;
  subtitle: string;
  category: 'station' | 'mall' | 'landmark' | 'hospital' | 'residential' | 'office';
  lat: number;
  lng: number;
}

export const INDONESIAN_SUGGESTED_PLACES: SuggestedPlace[] = [
  {
    title: 'Stasiun Gambir',
    subtitle: 'Jl. Medan Merdeka Tim. No.1, Gambir, Jakarta Pusat',
    category: 'station',
    lat: -6.1768,
    lng: 106.8307,
  },
  {
    title: 'Grand Indonesia Mall',
    subtitle: 'Jl. M.H. Thamrin No.1, Menteng, Jakarta Pusat',
    category: 'mall',
    lat: -6.1953,
    lng: 106.8209,
  },
  {
    title: 'Monumen Nasional (Monas)',
    subtitle: 'Gambir, Kecamatan Gambir, Kota Jakarta Pusat',
    category: 'landmark',
    lat: -6.1754,
    lng: 106.8272,
  },
  {
    title: 'Bandara Internasional Soekarno-Hatta (Terminal 3)',
    subtitle: 'Pajang, Benda, Kota Tangerang, Banten',
    category: 'station',
    lat: -6.1256,
    lng: 106.6558,
  },
  {
    title: 'Stasiun Manggarai',
    subtitle: 'Jl. Manggarai Utara 1, Tebet, Jakarta Selatan',
    category: 'station',
    lat: -6.2104,
    lng: 106.8502,
  },
  {
    title: 'Pondok Indah Mall (PIM 2)',
    subtitle: 'Jl. Metro Pondok Indah, Kebayoran Lama, Jakarta Selatan',
    category: 'mall',
    lat: -6.2657,
    lng: 106.7842,
  },
  {
    title: 'Senayan City',
    subtitle: 'Jl. Asia Afrika No.19, Gelora, Tanah Abang, Jakarta Pusat',
    category: 'mall',
    lat: -6.2274,
    lng: 106.7978,
  },
  {
    title: 'RSUP Dr. Cipto Mangunkusumo (RSCM)',
    subtitle: 'Jl. Diponegoro No.71, Kenari, Senen, Jakarta Pusat',
    category: 'hospital',
    lat: -6.1979,
    lng: 106.8488,
  },
  {
    title: 'Universitas Indonesia (Kampus Salemba)',
    subtitle: 'Jl. Salemba Raya No.4, Kenari, Senen, Jakarta Pusat',
    category: 'landmark',
    lat: -6.1947,
    lng: 106.8519,
  },
  {
    title: 'Stasiun Bandung (Hall)',
    subtitle: 'Jl. Kebon Kawung No.43, Pasir Kaliki, Cicendo, Bandung',
    category: 'station',
    lat: -6.9126,
    lng: 107.6025,
  },
  {
    title: 'Paris Van Java Resort Lifestyle Place',
    subtitle: 'Jl. Sukajadi No.131-139, Cipedes, Sukajadi, Bandung',
    category: 'mall',
    lat: -6.8893,
    lng: 107.5959,
  },
  {
    title: 'Gedung Sate',
    subtitle: 'Jl. Diponegoro No.22, Citarum, Bandung Wetan, Kota Bandung',
    category: 'landmark',
    lat: -6.9025,
    lng: 107.6186,
  },
  {
    title: 'Stasiun Surabaya Gubeng',
    subtitle: 'Jl. Gubeng Masjid No.1, Pacar Keling, Tambaksari, Surabaya',
    category: 'station',
    lat: -7.2655,
    lng: 112.7521,
  },
  {
    title: 'Tunjungan Plaza 6',
    subtitle: 'Jl. Embong Malang No.7-21, Kedungdoro, Tegalsari, Surabaya',
    category: 'mall',
    lat: -7.2618,
    lng: 112.7388,
  },
  {
    title: 'Alun-Alun Kota Malang',
    subtitle: 'Jl. Merdeka Barat, Kauman, Klojen, Kota Malang',
    category: 'landmark',
    lat: -7.9826,
    lng: 112.6308,
  },
  {
    title: 'Malioboro Mall',
    subtitle: 'Jl. Malioboro No.52-58, Suryatmajan, Danurejan, Yogyakarta',
    category: 'mall',
    lat: -7.7928,
    lng: 110.3667,
  },
  {
    title: 'Stasiun Tugu Yogyakarta',
    subtitle: 'Jl. Margo Utomo No.1, Sosromenduran, Gedong Tengen, Yogyakarta',
    category: 'station',
    lat: -7.7892,
    lng: 110.3636,
  },
  {
    title: 'Bandara Internasional I Gusti Ngurah Rai',
    subtitle: 'Tuban, Kuta, Kabupaten Badung, Bali',
    category: 'station',
    lat: -8.7482,
    lng: 115.1672,
  },
];

export const POPULAR_QUICK_TAGS = [
  'Stasiun Terdekat',
  'Mall / Pusat Belanja',
  'Rumah Sakit',
  'Kampus / Sekolah',
  'Perumahan / Rumah',
  'Alun-Alun / Taman',
];
