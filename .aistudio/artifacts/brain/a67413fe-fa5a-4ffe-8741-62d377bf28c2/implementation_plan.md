# Landing Page Komunitas Sosial "Berbagi Kebikean"

Landing page modern, humanis, dan responsif untuk komunitas sosial **"Berbagi Kebikean"** yang berfokus pada aksi berbagi makanan siap santap menggunakan sepeda kepada mereka yang membutuhkan di jalanan. Dilengkapi navigasi responsif (drawer mobile), seksi donasi lengkap (Bank umum, bank digital/e-wallet, QRIS nasional dengan tombol salin otomatis), papan saran/aspirasi komunitas interaktif real-time, formulir pendaftaran relawan pesepeda, galeri dokumentasi foto/video, serta panduan komentar penjelas yang rapi.

## User Review & Critical Decisions

> [!IMPORTANT]
> Berdasarkan jawaban klarifikasi yang telah Anda berikan:
> - **Pilihan Donasi Lengkap**: Disediakan tabulasi terstruktur untuk Bank Konvensional (BCA, Mandiri, BRI, BNI), Bank Digital & E-Wallet (SeaBank, Bank Jago, Flip, Gopay/OVO/Dana), serta QRIS Standar Nasional dengan tombol "Salin Nomor Rekening / No. VA" instan beserta umpan balik visual (toast).
> - **Interaksi Komunitas**: Dilengkapi modul "Dinding Kebaikan" (saran & kata semangat interaktif yang langsung muncul secara real-time) serta formulir "Gabung Relawan Gowes Berbagi".
> - **Kontak & Narahubung**: Disediakan informasi narahubung resmi lengkap (WhatsApp admin dengan tautan langsung, email resmi, titik kumpul/basecamp, dan akun media sosial Instagram & TikTok).
> - **Kemudahan Pembaruan (Customizability)**: Kode sumber ditata dengan komentar penjelas eksplisit di setiap modul (`<!-- EDIT NOMOR REKENING DI SINI -->`, `<!-- UPDATE STATISTIK DI SINI -->`, dll.).

---

## 1. Overview & Core Concept

- **Apa yang Dibangun**: Landing page satu halaman (*single-page responsive landing page*) yang ramah, hangat, dan profesional untuk komunitas "Berbagi Kebikean".
- **Target Audiens**: Donatur perorangan/komunitas, pesepeda lokal yang ingin menjadi relawan gowes berbagi, penerima manfaat, dan mitra sosial.
- **Nilai Utama**: Mempermudah penyaluran donasi dengan transparansi penuh, menyajikan dampak nyata aksi di jalanan melalui foto & video, serta membuka kesempatan siapa saja untuk bergabung mengayuh sepeda sambil menebar kebaikan.

---

## 2. User Experience & Visual Design

### A. Alur Pengguna (User Flow)
1. **Header & Hero**: Disambut dengan logo dan tipografi khas "Berbagi Kebikean", pesan misi "Mengayuh Harapan, Membagi Kebaikan", serta tombol CTA cepat ke seksi Donasi & Agenda Aksi.
2. **Tentang Kami & Misi**: Cerita di balik Berbagi Kebikean—kenapa sepeda menjadi sarana berbagi yang ramah lingkungan, menyentuh gang sempit, dan humanis.
3. **Statistik Dampak (Counter)**: Angka capaian porsi makanan tersalurkan, penerima manfaat, total kilometer gowes, dan kota/rute jelajah.
4. **Seksi Donasi Utama (Rekening & QRIS)**: Kartu donasi pastel interaktif dengan pilihan bank & e-wallet lengkap, tombol *Copy to Clipboard* otomatis, dan tampilan QRIS siap scan.
5. **Agenda & Poster Kegiatan**: Kartu informasi jadwal aksi gowes berbagi berikutnya (lokasi kumpul, waktu, menu makanan yang dibagikan).
6. **Dokumentasi (Foto & Video)**: Galeri visual interaktif serta pemutar video dokumentasi aksi relawan di lapangan.
7. **Dinding Aspirasi & Formulir Relawan**: Pengunjung dapat menuliskan doa/masukan yang tampil langsung, atau mendaftar menjadi relawan pesepeda.
8. **Footer & Tautan Sosmed**: Kontak resmi WhatsApp, Email, Instagram, TikTok, dan hak cipta "Berbagi Kebikean".

### B. Palet Warna & Tipografi
- **Filosofi Warna**: Nuansa biru cerah logo dikombinasikan dengan pastel mint/cyan lembut dan putih bersih.
  - *Dominant Canvas (60%)*: Bersih, putih salju lembut (`#F8FAFC` hingga `#FFFFFF`) dengan aksen latar pastel halus (`#F0FDF4` / `#F0F9FF`).
  - *Structural Surfaces (30%)*: Kartu bergradasi halus *sky pastel* (`#E0F2FE`), *mint cream* (`#ECFDF5`), dan border hairline lembut (`#BAE6FD`).
  - *Accent Budget (10%)*: Biru cerah ramah (`#0284C7` / `#0369A1`) untuk tombol CTA dan sorotan aktif.
- **Tipografi**:
  - *Display / Headings*: `Plus Jakarta Sans` berbobot tebal (Bold/SemiBold) yang modern, ramah, dan bersahabat.
  - *Body Prose*: `DM Sans` / `Plus Jakarta Sans` (Regular 400 & Medium 500) yang mudah dibaca di layar HP maupun laptop.
  - *Angka & Rekening*: `font-mono tabular-nums` untuk nomor rekening dan angka statistik agar rapi dan tidak bergeser.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Tabulasi Donasi Terstruktur**
  - *Pendekatan*: Mengelompokkan nomor rekening ke dalam 3 tab yang rapi: *Bank Nasional*, *Bank Digital & E-Wallet*, dan *QRIS Nasional*.
  - *Alasan*: Menghindari daftar rekening panjang yang membingungkan pengunjung HP; donatur dapat memilih bank mereka dalam satu ketukan dan langsung menyalin nomor rekening dengan notifikasi centang hijau "Tersalin!".

- **Decision 2: Papan Saran & Aspirasi Real-Time (Dinding Kebaikan)**
  - *Pendekatan*: Menyediakan form pesan dukungan yang langsung di-*render* secara instan ke daftar komentar interaktif dengan penyimpanan persisten di browser (localStorage) dan data awal yang hangat.
  - *Alasan*: Memenuhi permintaan pengguna untuk fitur saran dan masukan yang bisa dilihat setiap orang secara langsung tanpa memerlukan setup server backend yang rumit.

- **Decision 3: Formulir Relawan Pesepeda Terpadu**
  - *Pendekatan*: Formulir modal/in-page dengan validasi nomor WhatsApp, pilihan jenis sepeda (Road bike, MTB, Folding bike, Onthel/City bike), dan konfirmasi pengiriman yang langsung terhubung ke WhatsApp panitia.
  - *Alasan*: Mempermudah koordinasi relawan baru secara riil dan langsung bisa dihubungi oleh koordinator lapangan.

---

## 4. Technical Architecture & Component Structure

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Top Navbar & Mobile Navigation Drawer               │
│  [Logo Berbagi Kebikean]  ───  [Nav Links: Tentang, Donasi, Aksi]  ─── [CTA]│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│              Hero Section: Mengayuh Harapan, Membagi Kebaikan          │
│        (Sub-teks Visi, 2 CTA Utama: Donasi Sekarang & Gabung Gowes)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                   Statistik Dampak (Counter Kebaikan)                  │
│   [Porsi Makanan: 12.500+]  [Penerima: 4.800+]  [Rute: 35+ Jalur]      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│      Seksi Donasi Utama (Multi-Bank, E-Wallet, QRIS + Tombol Salin)    │
│  - Tab Bank: BCA, Mandiri, BRI, BNI (Copy Rekening 1-Click)            │
│  - Tab Digital: SeaBank, Bank Jago, Flip, Gopay/OVO/Dana               │
│  - Tab QRIS: QR Code Standar Nasional + Unduh Gambar QRIS              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                    Tentang Kami & Misi Bersepeda                       │
│    (Kenapa Sepeda? Transparansi 100%, Sentuh Gang Sempit, Ramah Alam)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│            Agenda Aksi Mendatang & Poster Kegiatan Terbaru             │
│   (Wadah Kartu Poster Agenda yang Sangat Mudah Di-update Pengelola)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                Dokumentasi Kegiatan (Galeri Foto & Video)              │
│       - Grid Galeri Foto Aksi Lapangan Relawan                         │
│       - Slot Video Pemutar Responsif Dokumentasi Aksi                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│       Interaksi Komunitas: Dinding Aspirasi & Formulir Relawan         │
│   - Dinding Pesan & Doa Real-Time (Form kirim pesan + daftar live)     │
│   - Formulir Pendaftaran Relawan Pesepeda (Kirim langsung via WA)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                  Footer & Media Sosial Komunitas                       │
│   (WhatsApp Hotline, Email Resmi, Basecamp, IG, TikTok, Copyright)    │
└────────────────────────────────────────────────────────────────────────┘
```

Rencana ini siap dieksekusi setelah mendapatkan persetujuan Anda.
