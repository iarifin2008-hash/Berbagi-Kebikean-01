/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ============================================================================
 * FILE KONFIGURASI KONTEN LANDING PAGE: "Berbagi Kebikean"
 * ============================================================================
 * Seluruh konten website dapat diubah melalui file ini atau secara instan
 * melalui panel developer di website.
 */

export interface BankAccountItem {
  id: string;
  name: string;
  accountNumber: string;
  accountHolder: string;
  badge: string;
}

export interface ImpactStatItem {
  id: string;
  value: string;
  label: string;
  sublabel: string;
}

export interface ActionAgendaItem {
  id: string;
  title: string;
  date: string;
  time: string;
  meetingPoint: string;
  targetPortion: string;
  route: string;
  status: string;
  posterImage: string;
}

export interface GalleryMediaItem {
  id: string;
  type: 'image' | 'video';
  title: string;
  desc: string;
  src: string; // URL gambar / Base64 ATAU URL embed video YouTube
  location: string;
}

export interface CommunityContactsConfig {
  whatsappNumber: string;
  whatsappDisplay: string;
  email: string;
  address: string;
  instagram: string;
  instagramHandle: string;
  tiktok: string;
  tiktokHandle: string;
}

export interface HeroConfig {
  badge: string;
  titleLine1: string;
  titleHighlight: string;
  titleLine2: string;
  description: string;
  heroImage: string;
  donationCostPerPortion: string;
}

export interface AboutSectionConfig {
  badge: string;
  title: string;
  intro: string;
  photo: string;
  philosophyTagline: string;
  values: {
    id: string;
    number: number;
    title: string;
    desc: string;
  }[];
}

export interface WallConfig {
  badgeText: string;
  title: string;
  description: string;
  submitButtonText: string;
  listTitle: string;
  inputPlaceholder: string;
}

export interface VolunteerSectionConfig {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  modalTitle: string;
  submitButtonText: string;
  showBikeTypeField: boolean; // Opsi tampilkan jenis sepeda
  showExperienceField: boolean; // Opsi tampilkan pengalaman bersepeda
  bikeOptions: string[];
  targetWhatsAppNumber: string;
  waTemplate: string;
}

export interface SiteConfig {
  communityName: string;
  communitySubTagline: string;
  logoImage: string;
  tagline: string;
  hero: HeroConfig;
  stats: ImpactStatItem[];
  bankAccounts: BankAccountItem[];
  qrisImage: string;
  qrisTitle: string;
  qrisDescription: string;
  donationWhatsAppMessage: string;
  about: AboutSectionConfig;
  agendaList: ActionAgendaItem[];
  galleryMedia: GalleryMediaItem[];
  volunteerConfig: VolunteerSectionConfig;
  wallConfig: WallConfig;
  footerCopyrightNote: string;
  contacts: CommunityContactsConfig;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  // 1. IDENTITAS KOMUNITAS
  communityName: 'Berbagi Kebikean',
  communitySubTagline: 'Gowes Berbagi Makanan Jalanan',
  logoImage: '',
  tagline: 'Mengayuh Harapan, Membagi Kebaikan',

  // 2. HERO SECTION
  hero: {
    badge: 'Gerakan Sosial Pesepeda Indonesia · 100% Amanah & Transparan',
    titleLine1: 'Mengayuh Harapan,',
    titleHighlight: 'Membagi Kebaikan',
    titleLine2: 'di Setiap Putaran Roda.',
    description: 'Komunitas Berbagi Kebikean mengantarkan makanan hangat dan bergizi menggunakan sepeda langsung ke tangan para pejuang jalanan, lansia dhuafa, dan pekerja kebersihan kota hingga pelosok gang sempit.',
    heroImage: '/src/assets/images/hero_berbagi_kebikean_1794029314840.jpg',
    donationCostPerPortion: 'Rp 15.000'
  },

  // 3. STATISTIK DAMPAK (COUNTER)
  stats: [
    {
      id: 'porsi',
      value: '0',
      label: 'Porsi Makanan',
      sublabel: 'Menu bergizi & higienis siap santap'
    },
    {
      id: 'penerima',
      value: '200+',
      label: 'Penerima Manfaat',
      sublabel: 'Petugas kebersihan, lansia & pejuang jalanan'
    },
    {
      id: 'rute',
      value: '48+',
      label: 'Rute Aksi Berbagi',
      sublabel: 'Menembus sudut kota & lorong gang'
    },
    {
      id: 'relawan',
      value: '0',
      label: 'Teman Kebaikan',
      sublabel: 'Relawan & pesepeda yang siap mengayuh'
    }
  ],

  // 4. DAFTAR REKENING BANK & E-WALLET DONASI (2 BAGIAN SAJA: REKENING & QRIS)
  bankAccounts: [
    {
      id: 'seabank',
      name: 'SeaBank Indonesia',
      accountNumber: '901928374619',
      accountHolder: 'BERBAGI KEBIKEAN (Aksi Sosial)',
      badge: 'SeaBank'
    },
    {
      id: 'bca',
      name: 'Bank Central Asia (BCA)',
      accountNumber: '8220918231',
      accountHolder: 'BERBAGI KEBIKEAN INDONESIA',
      badge: 'BCA'
    },
    {
      id: 'mandiri',
      name: 'Bank Mandiri',
      accountNumber: '1370029381023',
      accountHolder: 'BERBAGI KEBIKEAN INDONESIA',
      badge: 'Mandiri'
    },
    {
      id: 'ewallet',
      name: 'GoPay / OVO / DANA',
      accountNumber: '088216419059',
      accountHolder: 'A/N BERBAGI KEBIKEAN',
      badge: 'E-Wallet'
    }
  ],

  // 5. QRIS STANDAR NASIONAL & KONFIRMASI DONASI WA
  qrisImage: '/src/assets/images/qris_standar_nasional_1794029316679.jpg',
  qrisTitle: 'QRIS Standar Nasional Berbagi Kebikean',
  qrisDescription: 'Bebas biaya admin. Scan barcode menggunakan m-Banking (BCA, Mandiri, BRI, BNI) atau E-Wallet (GoPay, OVO, Dana, ShopeePay, LinkAja).',
  donationWhatsAppMessage: 'Hai Teman Kebaikan, aku mau titip kebaikan nih... Ini bukti transfernya ya, semoga berkah dan bermanfaat! 🙏✨',

  // 6. TENTANG KAMI & MISI LATAR BELAKANG (DAPAT DIEDIT PENUH)
  about: {
    badge: 'Misi & Latar Belakang',
    title: 'Mengapa Memilih Sepeda untuk Berbagi Kebaikan?',
    intro: 'Komunitas Berbagi Kebikean lahir dari sebuah kesadaran sederhana: di sepanjang jalanan kota yang ramai, ada banyak pejuang nafkah lansia, pemulung, dan petugas kebersihan yang sering kali melewatkan sarapan pagi demi menafkahi keluarga.',
    photo: '/src/assets/images/dokumentasi_gowes_relawan_1794029317354.jpg',
    philosophyTagline: '"Sepeda bukan sekadar alat transportasi, tetapi jembatan silaturahmi yang menyapa saudara kita tanpa sekat kaca mobil."',
    values: [
      {
        id: 'val-1',
        number: 1,
        title: 'Menembus Gang & Lorong Sempit',
        desc: 'Sepeda memiliki kelincahan tinggi untuk masuk ke kawasan yang tidak terjangkau mobil, sehingga bantuan tersampaikan langsung tepat sasaran.'
      },
      {
        id: 'val-2',
        number: 2,
        title: 'Menjaga Martabat & Membangun Kedekatan',
        desc: 'Relawan turun langsung dari sadel sepeda, menyapa dengan senyum ramah, mengobrol, dan menyerahkan makanan dengan penuh rasa hormat.'
      },
      {
        id: 'val-3',
        number: 3,
        title: 'Kebugaran Jasmani & Amal Jariyah',
        desc: 'Menggabungkan gaya hidup sehat bersepeda dengan kepedulian sosial yang nyata bagi sesama insan.'
      }
    ]
  },

  // 7. AGENDA AKSI MENDATANG (MENDUKUNG BANYAK AGENDA & UPLOAD POSTER)
  agendaList: [
    {
      id: 'agenda-1',
      title: 'Jumat Berkah: Berbagi Makanan',
      date: 'Jumat, Setiap Pekan',
      time: '05:45 - 08:30 WIB (Pagi)',
      meetingPoint: 'Taman Suropati / Titik Kumpul Basecamp Kebaikan',
      targetPortion: '300 Porsi Nasi Hangat Lengkap + Buah & Air Mineral',
      route: 'Rute Jalur Perintis, Pasar Tradisional, hingga Pemukiman Warga',
      status: 'Pendaftaran Terbuka',
      posterImage: '/src/assets/images/poster_kegiatan_gowes_1794029315952.jpg'
    },
    {
      id: 'agenda-2',
      title: 'Gowes Subuh Peduli Lansia Dhuafa',
      date: 'Minggu Pagi, Awal Bulan',
      time: '06:00 - 09:00 WIB',
      meetingPoint: 'Pelataran Masjid Agung / Titik Kumpul Relawan',
      targetPortion: '200 Paket Sembako Ringan & Sarapan Bergizi',
      route: 'Kawasan Pemukiman Padat & Pinggiran Rel Kereta',
      status: 'Pendaftaran Terbuka',
      posterImage: '/src/assets/images/hero_berbagi_kebikean_1794029314840.jpg'
    }
  ],

  // 8. GALERI DOKUMENTASI CAROUSEL (FOTO & VIDEO DISATUKAN DENGAN ELEGAN)
  galleryMedia: [
    {
      id: 'media-1',
      type: 'image',
      title: 'Pemberian Paket Makanan Hangat',
      desc: 'Menyapa pedagang kecil dan pekerja pembersih jalanan di pagi hari yang cerah.',
      src: '/src/assets/images/dokumentasi_berbagi_makanan_1794029317913.jpg',
      location: 'Rute Pasar & Kawasan Pejalan Kaki'
    },
    {
      id: 'media-2',
      type: 'image',
      title: 'Persiapan & Packing Makanan Segar',
      desc: 'Gotong royong relawan menata paket nasi kotak hangat ke keranjang sepeda.',
      src: '/src/assets/images/dokumentasi_packing_makanan_1794033890974.jpg',
      location: 'Dapur Komunitas Kebaikan'
    },
    {
      id: 'media-3',
      type: 'video',
      title: 'Cerita Hangat dari Sadel Sepeda (Dokumenter)',
      desc: 'Menyaksikan langsung kisah para penerima manfaat dan ketulusan para pesepeda relawan.',
      src: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?controls=1&rel=0&modestbranding=1',
      location: 'Dokumentasi Video Aksi'
    },
    {
      id: 'media-4',
      type: 'image',
      title: 'Senyuman Hangat Sahabat Jalanan',
      desc: 'Kebahagiaan tulus kakek pedagang menyambut sarapan pagi bernutrisi.',
      src: '/src/assets/images/dokumentasi_senyum_penerima_1794033890968.jpg',
      location: 'Trotoar Jalan Protokol'
    },
    {
      id: 'media-5',
      type: 'image',
      title: 'Briefing Relawan Sebelum Mengayuh',
      desc: 'Kekompakan relawan sepeda dengan tas termal pembawa makanan hangat.',
      src: '/src/assets/images/dokumentasi_gowes_relawan_1794029317354.jpg',
      location: 'Titik Kumpul Taman Kota'
    },
    {
      id: 'media-6',
      type: 'image',
      title: 'Aksi Gowes Masuk Gang Sempit',
      desc: 'Sepeda menjadi solusi fleksibel menyapa lansia di pemukiman padat.',
      src: '/src/assets/images/hero_berbagi_kebikean_1794029314840.jpg',
      location: 'Pemukiman Warga'
    }
  ],

  // 9. GABUNG TEMAN KEBAIKAN / RELAWAN (DILETAKKAN DI ATAS DINDING KEBAIKAN)
  volunteerConfig: {
    title: 'Ingin Ikut Gowes Berbagi Langsung?',
    subtitle: 'Gabung Teman Kebaikan Berbagi Kebikean',
    description: 'Semua jenis sepeda disambut hangat. Mari bersama-sama mengayuh sepeda sambil menebarkan paket makanan bergizi bagi mereka yang berjuang di jalanan.',
    buttonText: 'Daftar Jadi Teman Kebaikan',
    modalTitle: 'Formulir Pendaftaran Teman Kebaikan',
    submitButtonText: 'Kirim & Terhubung ke WhatsApp',
    showBikeTypeField: true, // Bisa diubah/dinonaktifkan oleh developer
    showExperienceField: false, // Bisa diubah/dinonaktifkan oleh developer
    bikeOptions: [
      'Sepeda Lipat / Folding Bike',
      'Mountain Bike (MTB)',
      'Road Bike / Gravel',
      'Sepeda Mini / City Bike',
      'Sepeda Onthel / Klasik',
      'Lainnya'
    ],
    targetWhatsAppNumber: '088216419059',
    waTemplate: 'Hai Teman Kebaikan, aku [Nama Anda], [Nomor HP Anda], [Asal Anda], ingin menjadi bagian dari Teman Kebaikan.'
  },

  // 10. DINDING KEBAIKAN CONFIG
  wallConfig: {
    badgeText: 'Dinding Kebaikan Real-Time',
    title: 'Titipkan Doa, Saran, & Kata Semangat',
    description: 'Pesan dan masukan Anda akan langsung tampil secara real-time di dinding ini untuk membakar semangat para pesepeda relawan di jalanan.',
    submitButtonText: 'Kirim Pesan ke Dinding',
    listTitle: 'Pesan & Doa Sahabat Kebaikan',
    inputPlaceholder: 'Tuliskan kata-kata semangat atau saran untuk aksi gowes berbagi...'
  },

  // 11. FOOTER & COPYRIGHT NOTE
  footerCopyrightNote: 'Dibuat dengan ❤️ untuk kemanusiaan, pesepeda, dan kebaikan jalanan.',

  // 12. KONTAK & MEDIA SOSIAL RESMI (LENGKAP DAN LANGSUNG TERHUBUNG)
  contacts: {
    whatsappNumber: '6288216419059',
    whatsappDisplay: '+62 882-1641-9059',
    email: 'halo@berbagikebikean.id',
    address: 'Jl. Sepeda Kebaikan No. 7, Jakarta / Depok, Indonesia',
    instagram: 'https://instagram.com/berbagikebikean',
    instagramHandle: '@berbagikebikean',
    tiktok: 'https://tiktok.com/@berbagikebikean',
    tiktokHandle: '@berbagikebikean'
  }
};
