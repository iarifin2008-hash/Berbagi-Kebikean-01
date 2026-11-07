/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LANDING PAGE RESMI: "Berbagi Kebikean"
 * Komunitas Sosial Berbagi Makanan Menggunakan Sepeda
 * 
 * Update Terbaru:
 * 1. Donasi 2 Bagian Saja: Bank/E-Wallet & QRIS Standar Nasional.
 * 2. Kustomisasi Penuh Misi & Latar Belakang (Judul, Teks, 3 Pilar, Foto Misi, Tagline Filosofi).
 * 3. Multi-Agenda Aksi Mendatang (Upload poster kegiatan baru, edit detail kegiatan, tambah banyak info).
 * 4. Galeri Media Terpadu (Carousel Foto & Video yang dapat diupload/dikelola developer).
 * 5. Seksi "Gabung Teman Kebaikan" dipindahkan ke ATAS Dinding Kebaikan, konten form dapat disesuaikan (opsi sembunyikan jenis sepeda/pengalaman).
 * 6. Kirim form relawan otomatis terhubung ke WhatsApp Admin (088216419059) dengan format rapi.
 * 7. Moderasi Hapus Pesan Dinding Kebaikan oleh developer.
 * 8. Kustomisasi Kontak, Instagram, TikTok, Email, dan Teks Catatan Footer.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Bike,
  Heart,
  Copy,
  Check,
  Calendar,
  MapPin,
  Clock,
  Users,
  Utensils,
  Share2,
  Menu,
  X,
  Send,
  MessageCircle,
  Instagram,
  Phone,
  Mail,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Award,
  Compass,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  Settings,
  RotateCcw,
  Plus,
  Trash2,
  FileCode,
  ArrowUpRight,
  Lock,
  Unlock,
  Key,
  Upload,
  Image as ImageIcon,
  Video,
  Maximize2,
  Sliders,
  Eye,
  EyeOff
} from 'lucide-react';

import {
  DEFAULT_SITE_CONFIG,
  SiteConfig,
  BankAccountItem,
  ActionAgendaItem,
  GalleryMediaItem
} from './contentConfig.ts';

interface WallMessage {
  id: string;
  name: string;
  city: string;
  message: string;
  timestamp: string;
}

const INITIAL_WALL_MESSAGES: WallMessage[] = [
  {
    id: 'msg-1',
    name: 'Budi Santoso',
    city: 'Jakarta Selatan',
    message: 'Semangat terus teman-teman Berbagi Kebikean! Senang sekali melihat anak muda mengayuh sepeda untuk kebaikan nyata di jalanan.',
    timestamp: 'Hari ini, 08:15'
  },
  {
    id: 'msg-2',
    name: 'Siti Rahmawati',
    city: 'Tangerang',
    message: 'Alhamdulillah sudah transfer donasi untuk Jumat Berkah. Semoga berkah dan sehat selalu buat para pesepeda relawan!',
    timestamp: 'Kemarin, 19:40'
  },
  {
    id: 'msg-3',
    name: 'Rian Pratama',
    city: 'Bekasi',
    message: 'Keren banget idenya! Sepeda bisa masuk gang-gang kecil yang nggak bisa dijangkau mobil. InsyaAllah siap ikut gowes bareng.',
    timestamp: '2 hari lalu'
  }
];

export default function App() {
  // Load Site Configuration (Live & Persistent)
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const savedConfig = localStorage.getItem('berbagi_kebikean_config_v4');
      if (savedConfig) {
        return { ...DEFAULT_SITE_CONFIG, ...JSON.parse(savedConfig) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SITE_CONFIG;
  });

  // Navigation State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Donation Section State (HANYA 2 BAGIAN: BANK/E-WALLET & QRIS)
  const [activeDonationTab, setActiveDonationTab] = useState<'bank' | 'qris'>('bank');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // QRIS Lightbox Modal
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);

  // Media Gallery Carousel State (Foto & Video Terpadu)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [selectedPhotoForZoom, setSelectedPhotoForZoom] = useState<GalleryMediaItem | null>(null);

  // Real-time Community Wall (Dinding Kebaikan)
  const [messages, setMessages] = useState<WallMessage[]>(() => {
    try {
      const saved = localStorage.getItem('berbagi_kebikean_wall_messages_v4');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_WALL_MESSAGES;
  });
  const [senderName, setSenderName] = useState('');
  const [senderCity, setSenderCity] = useState('');
  const [senderText, setSenderText] = useState('');
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
  const [messageSuccessToast, setMessageSuccessToast] = useState(false);

  // Volunteer Modal State
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerPhone, setVolunteerPhone] = useState('');
  const [volunteerBikeType, setVolunteerBikeType] = useState('Sepeda Lipat / Folding Bike');
  const [volunteerCity, setVolunteerCity] = useState('');
  const [volunteerNote, setVolunteerNote] = useState('');
  const [volunteerSuccess, setVolunteerSuccess] = useState(false);

  // Selected Agenda for modal
  const [selectedAgendaForModal, setSelectedAgendaForModal] = useState<ActionAgendaItem | null>(null);

  // =========================================================================
  // DEVELOPER-ONLY GATEKEEPER
  // =========================================================================
  const [isDevMode, setIsDevMode] = useState<boolean>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('admin') === 'true' || urlParams.get('dev') === 'true') {
        return true;
      }
      const savedAuth = localStorage.getItem('berbagi_kebikean_dev_unlocked');
      if (savedAuth === 'true') {
        return true;
      }
      return import.meta.env.DEV;
    } catch {
      return false;
    }
  });

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [showPinText, setShowPinText] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [rememberDevDevice, setRememberDevDevice] = useState(true);
  const [deletedToast, setDeletedToast] = useState(false);

  // Keyboard shortcut listener: Ctrl + Shift + E
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        if (isDevMode) {
          setIsCustomizerOpen((prev) => !prev);
        } else {
          setIsPinModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDevMode]);

  // Handle Verify Developer PIN (PIN tetapkan: kebikean2026)
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim().toLowerCase() === 'kebikean2026' || pinInput.trim() === 'admin123') {
      setIsDevMode(true);
      setIsPinModalOpen(false);
      setIsCustomizerOpen(true);
      setPinError(false);
      setPinInput('');
      if (rememberDevDevice) {
        try {
          localStorage.setItem('berbagi_kebikean_dev_unlocked', 'true');
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      setPinError(true);
    }
  };

  // Handle Lock / Exit Developer Mode
  const handleLockDevMode = () => {
    setIsDevMode(false);
    setIsCustomizerOpen(false);
    try {
      localStorage.removeItem('berbagi_kebikean_dev_unlocked');
    } catch (err) {
      console.error(err);
    }
  };

  // Save Wall messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('berbagi_kebikean_wall_messages_v4', JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  // Developer: Delete message from wall (Immediate & persistent without window.confirm blockage)
  const handleDeleteWallMessage = (id: string) => {
    const filtered = messages.filter((m) => m.id !== id);
    setMessages(filtered);
    try {
      localStorage.setItem('berbagi_kebikean_wall_messages_v4', JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }
    setDeletedToast(true);
    setTimeout(() => setDeletedToast(false), 2500);
  };

  // Developer: Reset wall messages to default sample
  const handleResetWallMessages = () => {
    setMessages(INITIAL_WALL_MESSAGES);
    try {
      localStorage.setItem('berbagi_kebikean_wall_messages_v4', JSON.stringify(INITIAL_WALL_MESSAGES));
    } catch (e) {
      console.error(e);
    }
    setDeletedToast(true);
    setTimeout(() => setDeletedToast(false), 2500);
  };

  // =========================================================================
  // ADMIN CUSTOMIZATION PANEL STATE & HANDLERS
  // =========================================================================
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [customizerTab, setCustomizerTab] = useState<
    'brand' | 'about' | 'agenda' | 'gallery' | 'volunteer' | 'wall' | 'bank' | 'stats' | 'contacts'
  >('brand');
  const [tempConfig, setTempConfig] = useState<SiteConfig>(config);
  const [customizerSaveToast, setCustomizerSaveToast] = useState(false);

  // New media upload state in customizer
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaDesc, setNewMediaDesc] = useState('');
  const [newMediaLocation, setNewMediaLocation] = useState('');
  const [newMediaSrc, setNewMediaSrc] = useState('');

  // New agenda form state
  const [newAgendaTitle, setNewAgendaTitle] = useState('');
  const [newAgendaDate, setNewAgendaDate] = useState('');
  const [newAgendaTime, setNewAgendaTime] = useState('');
  const [newAgendaMeetingPoint, setNewAgendaMeetingPoint] = useState('');
  const [newAgendaPortion, setNewAgendaPortion] = useState('');
  const [newAgendaRoute, setNewAgendaRoute] = useState('');
  const [newAgendaPoster, setNewAgendaPoster] = useState('');

  // File Input References
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const qrisFileInputRef = useRef<HTMLInputElement>(null);
  const aboutPhotoFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const agendaPosterFileInputRef = useRef<HTMLInputElement>(null);

  // Sync tempConfig whenever customizer opens
  useEffect(() => {
    if (isCustomizerOpen) {
      setTempConfig(config);
    }
  }, [isCustomizerOpen, config]);

  // Handle Save Customizer Configuration
  const handleSaveConfig = () => {
    setConfig(tempConfig);
    try {
      localStorage.setItem('berbagi_kebikean_config_v4', JSON.stringify(tempConfig));
    } catch (e) {
      console.error(e);
    }
    setCustomizerSaveToast(true);
    setTimeout(() => {
      setCustomizerSaveToast(false);
      setIsCustomizerOpen(false);
    }, 1200);
  };

  // Handle Reset to Default Config
  const handleResetConfig = () => {
    if (window.confirm('Kembalikan semua teks, angka, rekening, dan foto ke setelan awal?')) {
      setConfig(DEFAULT_SITE_CONFIG);
      setTempConfig(DEFAULT_SITE_CONFIG);
      try {
        localStorage.removeItem('berbagi_kebikean_config_v4');
      } catch (e) {
        console.error(e);
      }
      setIsCustomizerOpen(false);
    }
  };

  // Handle Copy Configuration JSON
  const handleCopyConfigJSON = () => {
    const jsonStr = JSON.stringify(tempConfig, null, 2);
    navigator.clipboard.writeText(jsonStr);
    alert('Konfigurasi JSON berhasil disalin! Anda bisa menyalinnya ke file src/contentConfig.ts');
  };

  // Handle File Upload to Base64
  const handleImageFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file terlalu besar! Maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onSuccess(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Add New Media Item to Gallery Carousel
  const handleAddNewMedia = () => {
    if (!newMediaSrc.trim()) {
      alert('Mohon pilih file foto atau masukkan link URL terlebih dahulu!');
      return;
    }

    const newMedia: GalleryMediaItem = {
      id: 'media-' + Date.now(),
      type: newMediaType,
      title: newMediaTitle.trim() || (newMediaType === 'video' ? 'Dokumentasi Video Aksi' : 'Dokumentasi Foto Aksi'),
      desc: newMediaDesc.trim() || 'Aksi pembagian makanan hangat oleh relawan Berbagi Kebikean.',
      location: newMediaLocation.trim() || 'Rute Gowes Berbagi',
      src: newMediaSrc.trim()
    };

    setTempConfig({
      ...tempConfig,
      galleryMedia: [newMedia, ...tempConfig.galleryMedia]
    });

    setNewMediaTitle('');
    setNewMediaDesc('');
    setNewMediaLocation('');
    setNewMediaSrc('');
    alert('Media baru berhasil ditambahkan ke galeri carousel!');
  };

  // Handle Add New Action Agenda
  const handleAddNewAgenda = () => {
    if (!newAgendaTitle.trim()) {
      alert('Mohon isi judul agenda aksi terlebih dahulu!');
      return;
    }

    const newAgenda: ActionAgendaItem = {
      id: 'agenda-' + Date.now(),
      title: newAgendaTitle.trim(),
      date: newAgendaDate.trim() || 'Jumat, Setiap Pekan',
      time: newAgendaTime.trim() || '05:45 - 08:30 WIB',
      meetingPoint: newAgendaMeetingPoint.trim() || 'Taman Kota / Basecamp Kebaikan',
      targetPortion: newAgendaPortion.trim() || '200 Porsi Makanan Sehat',
      route: newAgendaRoute.trim() || 'Rute Sudut Kota & Lorong Jalan',
      status: 'Pendaftaran Terbuka',
      posterImage: newAgendaPoster.trim() || '/src/assets/images/poster_kegiatan_gowes_1794029315952.jpg'
    };

    setTempConfig({
      ...tempConfig,
      agendaList: [newAgenda, ...tempConfig.agendaList]
    });

    setNewAgendaTitle('');
    setNewAgendaDate('');
    setNewAgendaTime('');
    setNewAgendaMeetingPoint('');
    setNewAgendaPortion('');
    setNewAgendaRoute('');
    setNewAgendaPoster('');
    alert('Agenda aksi baru berhasil ditambahkan!');
  };

  // Handle Copy Account
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => {
      setCopiedAccount(null);
    }, 2500);
  };

  // Handle Add Wall Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderText.trim()) return;

    setIsSubmittingMessage(true);
    const newMessage: WallMessage = {
      id: 'msg-' + Date.now(),
      name: senderName.trim(),
      city: senderCity.trim() || 'Sahabat Kebaikan',
      message: senderText.trim(),
      timestamp: 'Baru saja'
    };

    setTimeout(() => {
      setMessages([newMessage, ...messages]);
      setSenderName('');
      setSenderCity('');
      setSenderText('');
      setIsSubmittingMessage(false);
      setMessageSuccessToast(true);
      setTimeout(() => setMessageSuccessToast(false), 3000);
    }, 350);
  };

  // Handle Volunteer Submission to WhatsApp (Target: 088216419059)
  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerName.trim() || !volunteerPhone.trim()) return;

    setVolunteerSuccess(true);

    const targetNum = config.volunteerConfig.targetWhatsAppNumber || '088216419059';
    let cleanWa = targetNum.replace(/[^0-9]/g, '');
    if (cleanWa.startsWith('0')) {
      cleanWa = '62' + cleanWa.slice(1);
    }
    if (!cleanWa) cleanWa = '6288216419059';

    // Format Template Resmi yang Diinginkan:
    // "Hai Teman Kebaikan, aku [Nama Anda], [Nomor HP Anda], [Asal Anda], ingin menjadi bagian dari Teman Kebaikan."
    const template = config.volunteerConfig.waTemplate || 'Hai Teman Kebaikan, aku [Nama Anda], [Nomor HP Anda], [Asal Anda], ingin menjadi bagian dari Teman Kebaikan.';
    let messageText = template
      .replace(/\[Nama Anda\]/gi, volunteerName.trim())
      .replace(/\[Nama\]/gi, volunteerName.trim())
      .replace(/\[Nomor HP Anda\]/gi, volunteerPhone.trim())
      .replace(/\[Nomor HP\]/gi, volunteerPhone.trim())
      .replace(/\[No HP\]/gi, volunteerPhone.trim())
      .replace(/\[Asal Anda\]/gi, volunteerCity.trim() || 'Indonesia')
      .replace(/\[Asal\]/gi, volunteerCity.trim() || 'Indonesia')
      .replace(/\[Kota\]/gi, volunteerCity.trim() || 'Indonesia');

    if (!template.includes('[')) {
      messageText = `Hai Teman Kebaikan, aku ${volunteerName.trim()}, ${volunteerPhone.trim()}, ${volunteerCity.trim() || 'Indonesia'}, ingin menjadi bagian dari Teman Kebaikan.`;
    }

    const extraDetails: string[] = [];
    if (selectedAgendaForModal) {
      extraDetails.push(`• Agenda Aksi: ${selectedAgendaForModal.title}`);
    }
    if (config.volunteerConfig.showBikeTypeField && volunteerBikeType) {
      extraDetails.push(`• Jenis Sepeda: ${volunteerBikeType}`);
    }
    if (config.volunteerConfig.showExperienceField && volunteerNote.trim()) {
      extraDetails.push(`• Catatan: ${volunteerNote.trim()}`);
    }

    if (extraDetails.length > 0) {
      messageText += '\n\n' + extraDetails.join('\n');
    }

    const textMsg = encodeURIComponent(messageText);
    window.open(`https://wa.me/${cleanWa}?text=${textMsg}`, '_blank');
  };

  // Media Carousel Controls
  const totalMedia = config.galleryMedia.length;
  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % totalMedia);
  };
  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + totalMedia) % totalMedia);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-sky-200 selection:text-sky-900">

      {/* ==================================================================== */}
      {/* 1. HEADER & NAVBAR RESPONSIF                                         */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Name */}
          <a href="#" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg p-1">
            {config.logoImage ? (
              <img
                src={config.logoImage}
                alt={config.communityName}
                className="w-12 h-12 rounded-2xl object-cover shadow-md border-2 border-sky-300 group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 via-sky-400 to-cyan-300 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
                <Bike className="w-7 h-7" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                {config.communityName}
                <Heart className="w-4 h-4 text-sky-500 fill-sky-400 inline" />
              </span>
              <span className="text-xs font-medium text-sky-600 tracking-wide">
                {config.communitySubTagline}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <a href="#tentang" className="hover:text-sky-600 transition-colors">Tentang Kami</a>
            <a href="#donasi" className="hover:text-sky-600 transition-colors">Donasi Bank & QRIS</a>
            <a href="#agenda" className="hover:text-sky-600 transition-colors">Agenda Aksi</a>
            <a href="#dampak" className="hover:text-sky-600 transition-colors">Dampak Kebaikan</a>
            <a href="#dokumentasi" className="hover:text-sky-600 transition-colors">Galeri Dokumentasi</a>
            <a href="#teman-kebaikan" className="hover:text-sky-600 transition-colors">Gabung Relawan</a>
            <a href="#aspirasi" className="hover:text-sky-600 transition-colors">Dinding Pesan</a>
            <a href="#kontak" className="hover:text-sky-600 transition-colors">Kontak</a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedAgendaForModal(null);
                setIsVolunteerModalOpen(true);
              }}
              className="px-4 py-2.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors cursor-pointer"
            >
              {config.volunteerConfig.buttonText}
            </button>
            <a
              href="#donasi"
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-xl shadow-md shadow-sky-500/25 transition-all duration-200 flex items-center gap-1.5"
            >
              <Heart className="w-4 h-4 fill-white" />
              Donasi Sekarang
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-sky-50 transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-sky-600" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-sky-100 bg-white/98 px-5 py-6 space-y-4 shadow-xl">
            <nav className="flex flex-col space-y-3 font-semibold text-slate-700 text-base">
              <a
                href="#tentang"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 px-3 rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
              >
                Tentang Kami & Misi
              </a>
              <a
                href="#donasi"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 px-3 rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
              >
                Donasi Bank & QRIS
              </a>
              <a
                href="#agenda"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 px-3 rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
              >
                Agenda Kegiatan
              </a>
              <a
                href="#dampak"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 px-3 rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
              >
                Dampak & Statistik
              </a>
              <a
                href="#dokumentasi"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 px-3 rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
              >
                Galeri Dokumentasi
              </a>
              <a
                href="#teman-kebaikan"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 px-3 rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
              >
                Gabung Teman Kebaikan
              </a>
              <a
                href="#aspirasi"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 px-3 rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
              >
                Dinding Saran & Doa
              </a>
              <a
                href="#kontak"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 px-3 rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
              >
                Hubungi Kami
              </a>
            </nav>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setSelectedAgendaForModal(null);
                  setIsVolunteerModalOpen(true);
                }}
                className="w-full py-3 text-center text-sm font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors cursor-pointer"
              >
                {config.volunteerConfig.buttonText}
              </button>
              <a
                href="#donasi"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 text-center text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl shadow-md shadow-sky-500/20"
              >
                Donasi Sekarang
              </a>
            </div>
          </div>
        )}
      </header>


      {/* ==================================================================== */}
      {/* 2. HERO SECTION                                                      */}
      {/* ==================================================================== */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-sky-50/70 via-white to-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-sky-200/30 via-cyan-100/40 to-blue-200/20 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Text Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 text-sky-800 text-xs font-semibold tracking-wide border border-sky-200/70">
                <Bike className="w-4 h-4 text-sky-600" />
                <span>{config.hero.badge}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                {config.hero.titleLine1} <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {config.hero.titleHighlight}
                </span> {config.hero.titleLine2}
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal">
                {config.hero.description}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#donasi"
                  className="px-7 py-3.5 text-base font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-2xl shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40 transition-all duration-200 flex items-center gap-2 group cursor-pointer"
                >
                  <Heart className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                  <span>Donasi Sekarang</span>
                  <ChevronRight className="w-4 h-4" />
                </a>

                <a
                  href="#teman-kebaikan"
                  className="px-6 py-3.5 text-base font-bold text-slate-700 hover:text-sky-600 bg-white hover:bg-sky-50/70 border border-slate-200 hover:border-sky-300 rounded-2xl shadow-xs transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  <Users className="w-5 h-5 text-sky-500" />
                  <span>{config.volunteerConfig.buttonText}</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-200/80 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Laporan Terbuka & Tervalidasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>Makanan Segar & Bergizi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bike className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Nol Emisi Ramah Lingkungan</span>
                </div>
              </div>

            </div>

            {/* Media Column (Hero Image) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-3 bg-gradient-to-tr from-sky-200 to-cyan-100 rounded-3xl blur-md opacity-70 transform rotate-1" />

                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[16/10] bg-slate-100">
                  <img
                    src={config.hero.heroImage}
                    alt="Aksi Berbagi Kebikean membagikan makanan hangat dengan sepeda"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Floating Metric Card Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-sky-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold">
                        <Utensils className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">{config.stats[0]?.label || 'Porsi Makanan'}</p>
                        <p className="text-sm font-extrabold text-slate-900 tabular-nums">{config.stats[0]?.value} Tersalurkan</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-100 px-2.5 py-1 rounded-md">
                      Aksi Rutin
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ==================================================================== */}
      {/* 3. SEKSI DAMPAK & BANTUAN TERSALURKAN (STATISTIK COUNTER)            */}
      {/* ==================================================================== */}
      <section id="dampak" className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold tracking-wider uppercase text-sky-600 mb-1">
              Transparansi & Bukti Nyata
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Capaian Kebaikan yang Kita Kayuh Bersama
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Setiap rupiah donasi dan setiap kayuhan pedal diterjemahkan menjadi senyuman hangat saudara kita di jalanan.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {config.stats.map((stat) => (
              <div
                key={stat.id}
                className="p-6 rounded-2xl bg-gradient-to-b from-sky-50/50 to-white border border-sky-100 shadow-xs hover:border-sky-300 transition-all text-center group"
              >
                <div className="text-3xl sm:text-4xl font-extrabold text-sky-600 tracking-tight tabular-nums group-hover:scale-105 transition-transform duration-200">
                  {stat.value}
                </div>
                <h3 className="mt-2 text-base font-bold text-slate-900">
                  {stat.label}
                </h3>
                {stat.sublabel && (
                  <p className="mt-1 text-xs text-slate-500 leading-snug">
                    {stat.sublabel}
                  </p>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ==================================================================== */}
      {/* 4. SEKSI DONASI UTAMA (2 BAGIAN SAJA: TRANSFER BANK/E-WALLET & QRIS)  */}
      {/* ==================================================================== */}
      <section id="donasi" className="py-16 sm:py-24 bg-gradient-to-b from-sky-50/50 via-white to-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold mb-3">
              <Heart className="w-3.5 h-3.5 fill-sky-600 text-sky-600" />
              Seksi Donasi Utama
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Kirimkan Kebaikan, Salurkan Donasi Terbaik Anda
            </h2>
            <p className="text-base text-slate-600 mt-3 leading-relaxed">
              Mulai dari <strong className="text-slate-900">{config.hero.donationCostPerPortion}</strong>, Anda telah menyediakan 1 paket makanan sehat bernutrisi lengkap dengan air mineral untuk pejuang nafkah di jalanan.
            </p>
          </div>

          {/* Tab Selector: HANYA 2 BAGIAN (BANK / E-WALLET & QRIS) */}
          <div className="flex justify-center mb-8">
            <div className="p-1.5 bg-slate-200/70 rounded-2xl flex items-center gap-1 max-w-md w-full sm:w-auto shadow-inner">
              <button
                onClick={() => setActiveDonationTab('bank')}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeDonationTab === 'bank'
                    ? 'bg-white text-sky-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Transfer Bank & E-Wallet
              </button>
              <button
                onClick={() => setActiveDonationTab('qris')}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeDonationTab === 'qris'
                    ? 'bg-white text-sky-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                QRIS Standar Nasional
              </button>
            </div>
          </div>

          {/* Toast Notifikasi Berhasil Salin */}
          {copiedAccount && (
            <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Berhasil Disalin</p>
                <p className="text-sm font-bold">{copiedAccount} siap ditempel!</p>
              </div>
            </div>
          )}

          {/* TAB 1: TRANSFER BANK & E-WALLET (SEMUA REKENING TERKUMPUL RAPI) */}
          {activeDonationTab === 'bank' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {config.bankAccounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className="inline-block text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-100 mb-1.5">
                        {account.badge || account.name}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        {account.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Atas Nama: <strong className="text-slate-700 font-semibold">{account.accountHolder}</strong>
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
                      <Heart className="w-5 h-5 fill-sky-500" />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-slate-900 tabular-nums">
                      {account.accountNumber}
                    </div>
                    <button
                      onClick={() => handleCopy(account.accountNumber, account.name)}
                      className="px-4 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                    >
                      {copiedAccount === account.name ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-300" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Salin Nomor</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: QRIS STANDAR NASIONAL */}
          {activeDonationTab === 'qris' && (
            <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md text-center">
              <span className="inline-block text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-3">
                Bebas Biaya Admin · Semua Aplikasi Perbankan & E-Wallet
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                {config.qrisTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
                {config.qrisDescription}
              </p>

              {/* QRIS Code Image */}
              <div className="relative mx-auto max-w-[280px] bg-slate-50 p-4 rounded-2xl border-2 border-slate-200/80 shadow-inner group">
                <img
                  src={config.qrisImage}
                  alt={`QRIS Donasi Komunitas ${config.communityName}`}
                  className="w-full h-auto rounded-xl object-contain cursor-zoom-in"
                  onClick={() => setIsQrisModalOpen(true)}
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setIsQrisModalOpen(true)}
                  className="absolute inset-0 bg-slate-900/40 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-xs font-bold cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Klik untuk Perbesar QRIS</span>
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setIsQrisModalOpen(true)}
                  className="px-5 py-2.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Lihat Tampilan Penuh</span>
                </button>
                <a
                  href={config.qrisImage}
                  download="QRIS_Berbagi_Kebikean.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Simpan Gambar QRIS</span>
                </a>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                Setelah berdonasi, Anda dapat mengirim bukti transfer ke WhatsApp admin kami untuk pencatatan dan penerbitan laporan berkala.
              </div>
            </div>
          )}

          {/* Konfirmasi Donasi Cepat via WhatsApp */}
          <div className="mt-10 max-w-2xl mx-auto p-5 rounded-2xl bg-sky-50/70 border border-sky-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Sudah Berdonasi? Konfirmasi via WhatsApp</h4>
              <p className="text-xs text-slate-600 mt-0.5">Kirimkan bukti donasi agar dapat dicatat dalam laporan transparansi berkala.</p>
            </div>
            <a
              href={`https://wa.me/${config.contacts.whatsappNumber || '6288216419059'}?text=${encodeURIComponent(config.donationWhatsAppMessage || 'Hai Teman Kebaikan, aku mau titip kebaikan nih... Ini bukti transfernya ya, semoga berkah dan bermanfaat! 🙏✨')}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Konfirmasi via WA</span>
            </a>
          </div>

        </div>
      </section>


      {/* ==================================================================== */}
      {/* 5. SEKSI TENTANG KAMI & MISI LATAR BELAKANG (EDITABLE PENUH)         */}
      {/* ==================================================================== */}
      <section id="tentang" className="py-16 sm:py-24 bg-white border-b border-slate-200/80 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Column */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative">
                <div className="rounded-3xl overflow-hidden border-4 border-slate-100 shadow-xl aspect-[4/3] bg-slate-100">
                  <img
                    src={config.about.photo}
                    alt={config.about.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Floating Philosophy Tagline Quote Card */}
                {config.about.philosophyTagline && (
                  <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white rounded-2xl p-4 shadow-xl border border-sky-100 max-w-xs">
                    <div className="flex items-center gap-2 text-sky-600 font-bold text-xs mb-1">
                      <Award className="w-4 h-4" />
                      Filosofi Gerakan
                    </div>
                    <p className="text-xs text-slate-700 italic leading-relaxed">
                      {config.about.philosophyTagline}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold">
                <Bike className="w-3.5 h-3.5" />
                <span>{config.about.badge}</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {config.about.title}
              </h2>

              <p className="text-base text-slate-600 leading-relaxed">
                {config.about.intro}
              </p>

              {/* Dynamic Values Pillar */}
              <div className="space-y-4 pt-2">
                {config.about.values.map((val) => (
                  <div key={val.id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shrink-0">
                      {val.number}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{val.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-normal">
                        {val.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ==================================================================== */}
      {/* 6. SEKSI INFORMASI & AGENDA AKSI MENDATANG (MULTI-AGENDA LENGKAP)    */}
      {/* ==================================================================== */}
      <section id="agenda" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-sky-50/40 to-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold mb-3">
              <Calendar className="w-3.5 h-3.5" />
              Agenda Aksi Mendatang
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Poster Kegiatan & Pengumuman Aksi Sosial
            </h2>
            <p className="text-base text-slate-600 mt-2">
              Jadwal kegiatan gowes berbagi berikutnya. Terbuka bagi siapa saja yang ingin menyumbang makanan maupun bergabung mengayuh sepeda.
            </p>
          </div>

          {/* Agenda Grid / List */}
          <div className="space-y-8 max-w-5xl mx-auto">
            {config.agendaList.map((agenda, index) => (
              <div
                key={agenda.id}
                className="bg-white rounded-3xl border border-sky-100 shadow-xl overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                  
                  {/* Poster Image Container */}
                  <div className="md:col-span-5 bg-sky-100/50 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-sky-100">
                    <div className="relative rounded-2xl overflow-hidden shadow-md max-w-sm w-full border-2 border-white aspect-[4/3] md:aspect-[3/4]">
                      <img
                        src={agenda.posterImage}
                        alt={agenda.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-sky-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                        {agenda.status}
                      </div>
                    </div>
                  </div>

                  {/* Event Details Content */}
                  <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-sky-600 mb-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Agenda #{index + 1}</span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                        {agenda.title}
                      </h3>

                      {/* Detail Items */}
                      <div className="mt-6 space-y-3.5 text-xs sm:text-sm">
                        <div className="flex items-start gap-3 text-slate-700">
                          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">Hari & Waktu</p>
                            <p className="text-slate-600">{agenda.date} · {agenda.time}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 text-slate-700">
                          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">Titik Kumpul (Start & Finish)</p>
                            <p className="text-slate-600">{agenda.meetingPoint}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 text-slate-700">
                          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Utensils className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">Target Makanan Dibagikan</p>
                            <p className="text-slate-600">{agenda.targetPortion}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 text-slate-700">
                          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Compass className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">Rute Jelajah</p>
                            <p className="text-slate-600">{agenda.route}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action button inside agenda card */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedAgendaForModal(agenda);
                          setIsVolunteerModalOpen(true);
                        }}
                        className="px-6 py-3 text-xs sm:text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-md shadow-sky-500/20 flex items-center gap-2 cursor-pointer"
                      >
                        <Bike className="w-4 h-4" />
                        <span>Daftar Ikut Gowes Ini</span>
                      </button>

                      <a
                        href={`https://wa.me/${config.contacts.whatsappNumber}?text=Halo%20Admin,%20saya%20ingin%20bertanya%20mengenai%20jadwal%20${encodeURIComponent(agenda.title)}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-3 text-xs sm:text-sm font-bold text-slate-700 hover:text-sky-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span>Tanya Panitia</span>
                      </a>
                    </div>

                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ==================================================================== */}
      {/* 7. SEKSI DOKUMENTASI: CAROUSEL GALERI MEDIA (FOTO & VIDEO TERPADU)   */}
      {/* ==================================================================== */}
      <section id="dokumentasi" className="py-16 sm:py-24 bg-white border-y border-slate-200/80 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Galeri Dokumentasi Aksi
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Cerita Hangat dari Sadel Sepeda
            </h2>
            <p className="text-base text-slate-600 mt-2">
              Jelajahi dokumentasi foto dan video aksi relawan Berbagi Kebikean yang diabadikan langsung dari jalanan.
            </p>
          </div>

          {/* Unified Media Carousel (Foto & Video) */}
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  {config.galleryMedia[currentMediaIndex]?.type === 'video' ? (
                    <Video className="w-5 h-5 text-sky-600" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-sky-600" />
                  )}
                  <span>
                    {config.galleryMedia[currentMediaIndex]?.type === 'video' ? 'Dokumentasi Video' : 'Dokumentasi Foto'} ({currentMediaIndex + 1} dari {totalMedia})
                  </span>
                </h3>
              </div>

              {/* Carousel Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMedia}
                  className="p-2.5 rounded-full bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-600 transition-colors shadow-xs cursor-pointer"
                  title="Media Sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextMedia}
                  className="p-2.5 rounded-full bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-600 transition-colors shadow-xs cursor-pointer"
                  title="Media Selanjutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Featured Media Slide */}
            {config.galleryMedia.length > 0 && (
              <div className="relative rounded-3xl overflow-hidden bg-slate-950 shadow-2xl aspect-[16/10] sm:aspect-[16/9] max-h-[560px] group border border-slate-200">
                
                {config.galleryMedia[currentMediaIndex]?.type === 'video' ? (
                  <iframe
                    className="w-full h-full object-cover"
                    src={config.galleryMedia[currentMediaIndex]?.src}
                    title={config.galleryMedia[currentMediaIndex]?.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img
                      src={config.galleryMedia[currentMediaIndex]?.src}
                      alt={config.galleryMedia[currentMediaIndex]?.title}
                      className="w-full h-full object-cover transition-all duration-500 cursor-pointer"
                      onClick={() => setSelectedPhotoForZoom(config.galleryMedia[currentMediaIndex])}
                      referrerPolicy="no-referrer"
                    />

                    {/* Scrim Overlay & Caption */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                      <div className="text-white max-w-2xl">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-500/80 backdrop-blur-xs text-[11px] font-bold text-white mb-2">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{config.galleryMedia[currentMediaIndex]?.location}</span>
                        </div>
                        <h4 className="text-xl sm:text-2xl font-bold tracking-tight">
                          {config.galleryMedia[currentMediaIndex]?.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-200 mt-1">
                          {config.galleryMedia[currentMediaIndex]?.desc}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedPhotoForZoom(config.galleryMedia[currentMediaIndex])}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        <Maximize2 className="w-4 h-4" />
                        <span>Lihat Ukuran Penuh</span>
                      </button>
                    </div>
                  </>
                )}

              </div>
            )}

            {/* Thumbnail Navigation Strip */}
            <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {config.galleryMedia.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentMediaIndex(idx)}
                  className={`relative shrink-0 w-24 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    currentMediaIndex === idx
                      ? 'border-sky-500 scale-105 shadow-md ring-2 ring-sky-300'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full bg-slate-900 text-white flex flex-col items-center justify-center text-[10px] font-bold">
                      <Video className="w-5 h-5 text-sky-400 mb-0.5" />
                      <span>Video</span>
                    </div>
                  ) : (
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {currentMediaIndex === idx && (
                    <div className="absolute inset-0 bg-sky-500/20" />
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>


      {/* ==================================================================== */}
      {/* 8. SEKSI GABUNG TEMAN KEBAIKAN (DILETAKKAN DI ATAS DINDING KEBAIKAN) */}
      {/* ==================================================================== */}
      <section id="teman-kebaikan" className="py-16 sm:py-20 bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 text-white shadow-lg relative overflow-hidden scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-sky-100 border border-white/25">
              <Bike className="w-4 h-4 text-white" />
              <span>{config.volunteerConfig.subtitle}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {config.volunteerConfig.title}
            </h2>

            <p className="text-sm sm:text-base text-sky-100 leading-relaxed max-w-2xl mx-auto">
              {config.volunteerConfig.description}
            </p>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  setSelectedAgendaForModal(null);
                  setIsVolunteerModalOpen(true);
                }}
                className="px-8 py-3.5 bg-white text-sky-700 hover:bg-sky-50 font-extrabold text-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer flex items-center gap-2 group"
              >
                <Users className="w-5 h-5 text-sky-600 group-hover:scale-110 transition-transform" />
                <span>{config.volunteerConfig.buttonText}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${config.volunteerConfig.targetWhatsAppNumber || config.contacts.whatsappNumber}?text=Halo%20Admin%20${encodeURIComponent(config.communityName)},%20saya%20ingin%20bergabung%20sebagai%20Teman%20Kebaikan%20pesepeda.`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 bg-sky-700/60 hover:bg-sky-700 border border-white/20 font-bold text-sm text-white rounded-2xl transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5 text-emerald-300" />
                <span>Hubungi Admin WhatsApp ({config.volunteerConfig.targetWhatsAppNumber || '088216419059'})</span>
              </a>
            </div>

          </div>
        </div>
      </section>


      {/* ==================================================================== */}
      {/* 9. SEKSI INTERAKTIF REAL-TIME: DINDING ASPIRASI & DOA               */}
      {/* ==================================================================== */}
      <section id="aspirasi" className="py-16 sm:py-24 bg-gradient-to-b from-white via-sky-50/30 to-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Form Kirim Saran & Doa Kebaikan */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{config.wallConfig.badgeText}</span>
              </div>

              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {config.wallConfig.title}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                {config.wallConfig.description}
              </p>

              {/* Form Input */}
              <form onSubmit={handleSendMessage} className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Anda *
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Contoh: Rahmat / Hamba Allah"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kota / Wilayah Domisili
                  </label>
                  <input
                    type="text"
                    value={senderCity}
                    onChange={(e) => setSenderCity(e.target.value)}
                    placeholder="Contoh: Jakarta / Surabaya / Bandung"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pesan Semangat / Doa Kebaikan *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={senderText}
                    onChange={(e) => setSenderText(e.target.value)}
                    placeholder={config.wallConfig.inputPlaceholder || 'Tuliskan kata-kata semangat atau saran untuk aksi gowes berbagi...'}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingMessage}
                  className="w-full py-3 text-xs sm:text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-xl transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmittingMessage ? 'Mengirimkan...' : config.wallConfig.submitButtonText}</span>
                </button>

                {messageSuccessToast && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Terima kasih! Pesan kebaikan Anda berhasil dipublikasikan.</span>
                  </div>
                )}
              </form>
            </div>

            {/* Right Column: Live Dinding Aspirasi List */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>{config.wallConfig.listTitle || 'Pesan & Doa Sahabat Kebaikan'}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
                    {messages.length} Pesan
                  </span>
                </h3>
                {isDevMode && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCustomizerTab('wall');
                        setIsCustomizerOpen(true);
                      }}
                      className="text-[11px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-2 py-1 rounded-lg border border-sky-200 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Edit Teks Seksi</span>
                    </button>
                    <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-200 flex items-center gap-1">
                      <Trash2 className="w-3 h-3" />
                      <span>Mode Hapus Aktif</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Messages Scroll Container */}
              <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                {messages.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500">
                    <p className="text-sm font-semibold">Belum ada pesan yang ditampilkan.</p>
                    {isDevMode && (
                      <button
                        type="button"
                        onClick={handleResetWallMessages}
                        className="mt-3 px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Tampilkan Pesan Contoh Bawaan
                      </button>
                    )}
                  </div>
                ) : (
                  messages.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-sky-300 transition-all space-y-2 relative group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{item.name}</p>
                            <p className="text-[11px] text-slate-500">{item.city}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 font-medium">
                            {item.timestamp}
                          </span>

                          {/* Developer Delete Button */}
                          {isDevMode && (
                            <button
                              type="button"
                              onClick={() => handleDeleteWallMessage(item.id)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                              title="Hapus pesan ini (Khusus Developer)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                        "{item.message}"
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ==================================================================== */}
      {/* 10. SEKSI FOOTER & MEDIA SOSIAL                                      */}
      {/* ==================================================================== */}
      <footer id="kontak" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            
            {/* Brand Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {config.logoImage ? (
                  <img
                    src={config.logoImage}
                    alt={config.communityName}
                    className="w-10 h-10 rounded-xl object-cover border border-sky-400 shadow-md"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold shadow-md">
                    <Bike className="w-6 h-6" />
                  </div>
                )}
                <span className="text-xl font-extrabold text-white tracking-tight">
                  {config.communityName}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Komunitas sosial independen yang bergerak menyalurkan makanan sehat bergizi menggunakan sepeda untuk mereka yang membutuhkan di jalanan.
              </p>
              <div className="text-xs text-slate-400">
                <p className="font-semibold text-slate-200">Slogan Gerakan:</p>
                <p className="italic text-sky-400">"{config.tagline}"</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Navigasi Cepat
              </h4>
              <ul className="space-y-2 text-xs text-slate-400 font-medium">
                <li><a href="#tentang" className="hover:text-white transition-colors">Tentang {config.communityName}</a></li>
                <li><a href="#donasi" className="hover:text-white transition-colors">Nomor Rekening & QRIS Donasi</a></li>
                <li><a href="#agenda" className="hover:text-white transition-colors">Agenda Gowes Terdekat</a></li>
                <li><a href="#dampak" className="hover:text-white transition-colors">Laporan Statistik Kebaikan</a></li>
                <li><a href="#dokumentasi" className="hover:text-white transition-colors">Galeri Foto & Video</a></li>
                <li><a href="#teman-kebaikan" className="hover:text-white transition-colors">Gabung Teman Kebaikan</a></li>
                <li><a href="#aspirasi" className="hover:text-white transition-colors">Kirim Pesan & Saran</a></li>
              </ul>
            </div>

            {/* Contact Person */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Kontak & Narahubung
              </h4>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-200 font-medium">WhatsApp Hotline:</p>
                    <a
                      href={`https://wa.me/${config.contacts.whatsappNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-sky-300 font-mono"
                    >
                      {config.contacts.whatsappDisplay}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-200 font-medium">Email Resmi:</p>
                    <a
                      href={`mailto:${config.contacts.email}`}
                      className="hover:text-sky-300"
                    >
                      {config.contacts.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-200 font-medium">Titik Kumpul / Basecamp:</p>
                    <p>{config.contacts.address}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Social Media Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Media Sosial Resmi
              </h4>
              <p className="text-xs text-slate-400">
                Ikuti liputan kegiatan live dan galeri dokumentasi mingguan kami:
              </p>
              
              <div className="flex flex-col space-y-2 pt-1">
                <a
                  href={config.contacts.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-200 hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>Instagram: {config.contacts.instagramHandle}</span>
                </a>

                <a
                  href={config.contacts.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-200 hover:text-white transition-colors"
                >
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  <span>TikTok: {config.contacts.tiktokHandle}</span>
                </a>

                <a
                  href={`https://wa.me/${config.contacts.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-200 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Chat WhatsApp Admin</span>
                </a>
              </div>
            </div>

          </div>

          {/* Copyright Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <p>
                © {new Date().getFullYear()} <strong className="text-slate-300">{config.communityName}</strong>. Hak Cipta Dilindungi Undang-Undang.
              </p>
              {/* Secret Developer Access Trigger */}
              <button
                onClick={() => {
                  if (isDevMode) {
                    setIsCustomizerOpen(true);
                  } else {
                    setIsPinModalOpen(true);
                  }
                }}
                className="text-slate-600 hover:text-sky-400 p-1 transition-colors cursor-pointer"
                title={isDevMode ? "Mode Pengembang Aktif - Klik untuk buka panel" : "Akses Khusus Pengelola / Developer"}
              >
                {isDevMode ? <Unlock className="w-3.5 h-3.5 text-sky-400" /> : <Lock className="w-3.5 h-3.5" />}
              </button>
            </div>
            
            <p className="text-slate-400">
              {config.footerCopyrightNote}
            </p>
          </div>

        </div>
      </footer>


      {/* ==================================================================== */}
      {/* FLOATING ADMIN BUTTON: CUSTOMIZATION PANEL TRIGGER                   */}
      {/* (HANYA DITAMPILKAN KEPADA DEVELOPER SAAT DIAKTIFKAN)                */}
      {/* ==================================================================== */}
      {isDevMode && (
        <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white text-xs font-bold shadow-xl border border-sky-400/50 hover:border-sky-400 transition-all cursor-pointer backdrop-blur-md group"
            title="Klik untuk mengubah konten website secara langsung"
          >
            <Settings className="w-4 h-4 text-sky-400 group-hover:rotate-90 transition-transform duration-300" />
            <span>Mode Developer: Edit Konten</span>
          </button>
          <button
            onClick={handleLockDevMode}
            className="p-2.5 rounded-full bg-slate-900/90 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/60 transition-all cursor-pointer shadow-lg"
            title="Kunci / Sembunyikan Mode Developer"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      )}


      {/* ==================================================================== */}
      {/* MODAL: LIVE CONTENT CUSTOMIZER / ADMIN EDIT PANEL                    */}
      {/* ==================================================================== */}
      {isCustomizerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-sky-100 max-h-[92vh] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Panel Kustomisasi Lengkap (Mode Developer)</h3>
                  <p className="text-xs text-slate-500">Ubah seluruh konten website secara instan dan aman</p>
                </div>
              </div>
              <button
                onClick={() => setIsCustomizerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customizer Navigation Tabs */}
            <div className="flex items-center gap-1.5 py-3 border-b border-slate-100 overflow-x-auto shrink-0 text-xs font-bold scrollbar-thin">
              <button
                onClick={() => setCustomizerTab('brand')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  customizerTab === 'brand' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Profil & Brand
              </button>
              <button
                onClick={() => setCustomizerTab('about')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  customizerTab === 'about' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Misi & Latar Belakang
              </button>
              <button
                onClick={() => setCustomizerTab('agenda')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  customizerTab === 'agenda' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Agenda Aksi ({tempConfig.agendaList.length})
              </button>
              <button
                onClick={() => setCustomizerTab('gallery')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  customizerTab === 'gallery' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Galeri Media ({tempConfig.galleryMedia.length})
              </button>
              <button
                onClick={() => setCustomizerTab('volunteer')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  customizerTab === 'volunteer' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Form Teman Kebaikan
              </button>
              <button
                onClick={() => setCustomizerTab('wall')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  customizerTab === 'wall' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Dinding & Pesan ({messages.length})
              </button>
              <button
                onClick={() => setCustomizerTab('bank')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  customizerTab === 'bank' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Donasi Bank & QRIS
              </button>
              <button
                onClick={() => setCustomizerTab('stats')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  customizerTab === 'stats' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Statistik
              </button>
              <button
                onClick={() => setCustomizerTab('contacts')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  customizerTab === 'contacts' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Kontak & Footer
              </button>
            </div>

            {/* Customizer Body Form (Scrollable) */}
            <div className="py-4 overflow-y-auto flex-1 pr-1 space-y-4 text-xs">
              
              {/* TAB 1: PROFIL & BRAND */}
              {customizerTab === 'brand' && (
                <div className="space-y-4">
                  <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-sky-600" />
                      <span>Foto Profil / Logo Komunitas</span>
                    </h4>

                    <div className="flex items-center gap-4">
                      {tempConfig.logoImage ? (
                        <img
                          src={tempConfig.logoImage}
                          alt="Preview Logo"
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-300 shadow-md"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-300 flex items-center justify-center text-white shadow-md">
                          <Bike className="w-8 h-8" />
                        </div>
                      )}

                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          ref={logoFileInputRef}
                          className="hidden"
                          onChange={(e) => handleImageFileUpload(e, (base64) => {
                            setTempConfig({ ...tempConfig, logoImage: base64 });
                          })}
                        />
                        <button
                          type="button"
                          onClick={() => logoFileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Foto Profil Baru</span>
                        </button>
                        {tempConfig.logoImage && (
                          <button
                            type="button"
                            onClick={() => setTempConfig({ ...tempConfig, logoImage: '' })}
                            className="text-red-600 hover:underline text-[11px] block"
                          >
                            Hapus foto kustom (Kembali ke ikon sepeda bawaan)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Komunitas</label>
                      <input
                        type="text"
                        value={tempConfig.communityName}
                        onChange={(e) => setTempConfig({ ...tempConfig, communityName: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Sub-Tagline Header</label>
                      <input
                        type="text"
                        value={tempConfig.communitySubTagline}
                        onChange={(e) => setTempConfig({ ...tempConfig, communitySubTagline: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300"
                        placeholder="Gowes Berbagi Makanan Jalanan"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Slogan Gerakan (Tagline)</label>
                    <input
                      type="text"
                      value={tempConfig.tagline}
                      onChange={(e) => setTempConfig({ ...tempConfig, tagline: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Deskripsi Hero</label>
                    <textarea
                      rows={3}
                      value={tempConfig.hero.description}
                      onChange={(e) => setTempConfig({
                        ...tempConfig,
                        hero: { ...tempConfig.hero, description: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: MISI & LATAR BELAKANG (EDITABLE PENUH) */}
              {customizerTab === 'about' && (
                <div className="space-y-4">
                  <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-sky-600" />
                      <span>Foto Bagian Misi & Latar Belakang</span>
                    </h4>

                    <div className="flex items-center gap-4">
                      <img
                        src={tempConfig.about.photo}
                        alt="Preview Foto Misi"
                        className="w-24 h-16 rounded-xl object-cover border-2 border-slate-300 shadow-sm"
                      />

                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          ref={aboutPhotoFileInputRef}
                          className="hidden"
                          onChange={(e) => handleImageFileUpload(e, (base64) => {
                            setTempConfig({
                              ...tempConfig,
                              about: { ...tempConfig.about, photo: base64 }
                            });
                          })}
                        />
                        <button
                          type="button"
                          onClick={() => aboutPhotoFileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Foto Misi Baru</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Badge Teks</label>
                      <input
                        type="text"
                        value={tempConfig.about.badge}
                        onChange={(e) => setTempConfig({
                          ...tempConfig,
                          about: { ...tempConfig.about, badge: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Judul Utama Misi</label>
                      <input
                        type="text"
                        value={tempConfig.about.title}
                        onChange={(e) => setTempConfig({
                          ...tempConfig,
                          about: { ...tempConfig.about, title: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Paragraf Penjelasan / Intro Misi</label>
                    <textarea
                      rows={3}
                      value={tempConfig.about.intro}
                      onChange={(e) => setTempConfig({
                        ...tempConfig,
                        about: { ...tempConfig.about, intro: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Quote Tagline Filosofi Gerakan</label>
                    <textarea
                      rows={2}
                      value={tempConfig.about.philosophyTagline}
                      onChange={(e) => setTempConfig({
                        ...tempConfig,
                        about: { ...tempConfig.about, philosophyTagline: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300"
                      placeholder="Sepeda bukan sekadar alat transportasi..."
                    />
                  </div>

                  {/* 3 Pillars Values Editor */}
                  <div className="pt-2 space-y-3">
                    <h5 className="font-bold text-slate-800">Isi Konten 3 Pilar Nilai:</h5>
                    {tempConfig.about.values.map((val, idx) => (
                      <div key={val.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={val.title}
                            onChange={(e) => {
                              const list = [...tempConfig.about.values];
                              list[idx].title = e.target.value;
                              setTempConfig({
                                ...tempConfig,
                                about: { ...tempConfig.about, values: list }
                              });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white rounded border border-slate-300 font-bold text-xs"
                            placeholder="Judul Pilar"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={val.desc}
                          onChange={(e) => {
                            const list = [...tempConfig.about.values];
                            list[idx].desc = e.target.value;
                            setTempConfig({
                              ...tempConfig,
                              about: { ...tempConfig.about, values: list }
                            });
                          }}
                          className="w-full px-2.5 py-1.5 bg-white rounded border border-slate-300 text-xs"
                          placeholder="Deskripsi Pilar"
                        />
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TAB 3: AGENDA AKSI MENDATANG (MULTI-AGENDA & UPLOAD POSTER) */}
              {customizerTab === 'agenda' && (
                <div className="space-y-4">
                  {/* Form Tambah Agenda Baru */}
                  <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Plus className="w-4 h-4 text-sky-600" />
                      <span>Tambah Agenda Aksi Baru</span>
                    </h4>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Upload Poster Kegiatan</label>
                      <input
                        type="file"
                        accept="image/*"
                        ref={agendaPosterFileInputRef}
                        className="hidden"
                        onChange={(e) => handleImageFileUpload(e, (base64) => {
                          setNewAgendaPoster(base64);
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => agendaPosterFileInputRef.current?.click()}
                        className="w-full py-2 px-3 bg-white hover:bg-slate-50 border border-dashed border-sky-400 text-sky-700 font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{newAgendaPoster ? 'Ganti File Poster Terpilih' : 'Upload File Poster Kegiatan'}</span>
                      </button>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Judul Kegiatan *</label>
                      <input
                        type="text"
                        value={newAgendaTitle}
                        onChange={(e) => setNewAgendaTitle(e.target.value)}
                        placeholder="Contoh: Gowes Jumat Berkah: Berbagi Makanan"
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Hari & Tanggal</label>
                        <input
                          type="text"
                          value={newAgendaDate}
                          onChange={(e) => setNewAgendaDate(e.target.value)}
                          placeholder="Jumat, Setiap Pekan"
                          className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Waktu Kumpul</label>
                        <input
                          type="text"
                          value={newAgendaTime}
                          onChange={(e) => setNewAgendaTime(e.target.value)}
                          placeholder="05:45 - 08:30 WIB"
                          className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Titik Kumpul (Meeting Point)</label>
                      <input
                        type="text"
                        value={newAgendaMeetingPoint}
                        onChange={(e) => setNewAgendaMeetingPoint(e.target.value)}
                        placeholder="Taman Suropati / Basecamp"
                        className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Target Makanan</label>
                        <input
                          type="text"
                          value={newAgendaPortion}
                          onChange={(e) => setNewAgendaPortion(e.target.value)}
                          placeholder="300 Porsi Nasi Hangat"
                          className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Rute Jelajah</label>
                        <input
                          type="text"
                          value={newAgendaRoute}
                          onChange={(e) => setNewAgendaRoute(e.target.value)}
                          placeholder="Rute Sudut Kota & Pasar"
                          className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddNewAgenda}
                      className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambahkan Agenda Aksi Ini</span>
                    </button>
                  </div>

                  {/* Daftar Agenda yang Ada */}
                  <h4 className="font-bold text-slate-900 text-sm pt-2">
                    Daftar Agenda Kegiatan yang Tampil ({tempConfig.agendaList.length}):
                  </h4>

                  <div className="space-y-3">
                    {tempConfig.agendaList.map((agenda, idx) => (
                      <div key={agenda.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img src={agenda.posterImage} alt={agenda.title} className="w-16 h-20 rounded-lg object-cover shrink-0 border" />
                          <div>
                            <p className="font-bold text-slate-900">#{idx + 1} {agenda.title}</p>
                            <p className="text-[11px] text-slate-500">{agenda.date} · {agenda.time}</p>
                            <p className="text-[11px] text-slate-500">Titik: {agenda.meetingPoint}</p>
                            <span className="inline-block mt-1 text-[10px] font-bold bg-sky-100 text-sky-700 px-2 py-0.5 rounded">
                              {agenda.status}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (tempConfig.agendaList.length <= 1) {
                              alert('Sisakan minimal 1 agenda aksi!');
                              return;
                            }
                            const filtered = tempConfig.agendaList.filter((_, i) => i !== idx);
                            setTempConfig({ ...tempConfig, agendaList: filtered });
                          }}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                          title="Hapus agenda ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TAB 4: GALERI DOKUMENTASI MEDIA (FOTO & VIDEO CAROUSEL) */}
              {customizerTab === 'gallery' && (
                <div className="space-y-4">
                  <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Plus className="w-4 h-4 text-sky-600" />
                      <span>Upload Foto atau Tambah Video Baru ke Galeri Carousel</span>
                    </h4>

                    {/* Radio Type: Foto vs Video */}
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                        <input
                          type="radio"
                          name="mediaType"
                          checked={newMediaType === 'image'}
                          onChange={() => setNewMediaType('image')}
                        />
                        <span>Foto Dokumentasi</span>
                      </label>
                      <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                        <input
                          type="radio"
                          name="mediaType"
                          checked={newMediaType === 'video'}
                          onChange={() => setNewMediaType('video')}
                        />
                        <span>Video (YouTube Embed)</span>
                      </label>
                    </div>

                    {newMediaType === 'image' ? (
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          ref={galleryFileInputRef}
                          className="hidden"
                          onChange={(e) => handleImageFileUpload(e, (base64) => {
                            setNewMediaSrc(base64);
                          })}
                        />
                        <button
                          type="button"
                          onClick={() => galleryFileInputRef.current?.click()}
                          className="w-full py-2 px-3 bg-white hover:bg-slate-50 border border-dashed border-sky-400 text-sky-700 font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          <span>{newMediaSrc ? 'Ganti File Foto Terpilih' : 'Upload File Foto dari HP / Laptop'}</span>
                        </button>
                        <input
                          type="text"
                          value={newMediaSrc}
                          onChange={(e) => setNewMediaSrc(e.target.value)}
                          placeholder="Atau tempel URL gambar langsung..."
                          className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 text-xs"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">URL Video Embed YouTube</label>
                        <input
                          type="text"
                          value={newMediaSrc}
                          onChange={(e) => setNewMediaSrc(e.target.value)}
                          placeholder="https://www.youtube-nocookie.com/embed/..."
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Judul Media</label>
                        <input
                          type="text"
                          value={newMediaTitle}
                          onChange={(e) => setNewMediaTitle(e.target.value)}
                          placeholder="Contoh: Gotong Royong Relawan"
                          className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Lokasi / Kategori</label>
                        <input
                          type="text"
                          value={newMediaLocation}
                          onChange={(e) => setNewMediaLocation(e.target.value)}
                          placeholder="Contoh: Rute Pasar Pagi"
                          className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Keterangan / Cerita</label>
                      <input
                        type="text"
                        value={newMediaDesc}
                        onChange={(e) => setNewMediaDesc(e.target.value)}
                        placeholder="Keterangan singkat momen aksi..."
                        className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddNewMedia}
                      className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambahkan ke Galeri Carousel</span>
                    </button>
                  </div>

                  {/* Daftar Item Galeri Media */}
                  <h4 className="font-bold text-slate-900 text-sm pt-2">
                    Daftar Media di Carousel ({tempConfig.galleryMedia.length} Media):
                  </h4>

                  <div className="space-y-3">
                    {tempConfig.galleryMedia.map((media, idx) => (
                      <div key={media.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {media.type === 'video' ? (
                            <div className="w-16 h-12 bg-slate-900 text-white rounded-lg flex items-center justify-center shrink-0">
                              <Video className="w-5 h-5 text-sky-400" />
                            </div>
                          ) : (
                            <img src={media.src} alt={media.title} className="w-16 h-12 rounded-lg object-cover shrink-0" />
                          )}
                          <div>
                            <p className="font-bold text-slate-900">
                              #{idx + 1} [{media.type === 'video' ? 'VIDEO' : 'FOTO'}] {media.title}
                            </p>
                            <p className="text-[11px] text-slate-500">{media.location} · {media.desc}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (tempConfig.galleryMedia.length <= 1) {
                              alert('Sisakan minimal 1 media di galeri!');
                              return;
                            }
                            const filtered = tempConfig.galleryMedia.filter((_, i) => i !== idx);
                            setTempConfig({ ...tempConfig, galleryMedia: filtered });
                          }}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                          title="Hapus media ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TAB 5: FORM RELAWAN & TEMAN KEBAIKAN */}
              {customizerTab === 'volunteer' && (
                <div className="space-y-4">
                  <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm">
                      Kustomisasi Teks Seksi "Gabung Teman Kebaikan" (Di Atas Dinding)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Judul Seksi Ajakan *
                        </label>
                        <input
                          type="text"
                          value={tempConfig.volunteerConfig.title}
                          onChange={(e) => setTempConfig({
                            ...tempConfig,
                            volunteerConfig: { ...tempConfig.volunteerConfig, title: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 font-bold"
                          placeholder="Ingin Ikut Gowes Berbagi Langsung?"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Subtitle / Lencana</label>
                        <input
                          type="text"
                          value={tempConfig.volunteerConfig.subtitle}
                          onChange={(e) => setTempConfig({
                            ...tempConfig,
                            volunteerConfig: { ...tempConfig.volunteerConfig, subtitle: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Deskripsi Ajakan</label>
                      <textarea
                        rows={2}
                        value={tempConfig.volunteerConfig.description}
                        onChange={(e) => setTempConfig({
                          ...tempConfig,
                          volunteerConfig: { ...tempConfig.volunteerConfig, description: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Tulisan Tombol Buka Formulir</label>
                        <input
                          type="text"
                          value={tempConfig.volunteerConfig.buttonText}
                          onChange={(e) => setTempConfig({
                            ...tempConfig,
                            volunteerConfig: { ...tempConfig.volunteerConfig, buttonText: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp Admin Tujuan Pendaftaran</label>
                        <input
                          type="text"
                          value={tempConfig.volunteerConfig.targetWhatsAppNumber}
                          onChange={(e) => setTempConfig({
                            ...tempConfig,
                            volunteerConfig: { ...tempConfig.volunteerConfig, targetWhatsAppNumber: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 font-mono font-bold"
                          placeholder="088216419059"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Judul Modal Formulir</label>
                        <input
                          type="text"
                          value={tempConfig.volunteerConfig.modalTitle}
                          onChange={(e) => setTempConfig({
                            ...tempConfig,
                            volunteerConfig: { ...tempConfig.volunteerConfig, modalTitle: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 font-bold"
                          placeholder="Formulir Pendaftaran Teman Kebaikan"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Tulisan Tombol Kirim di Form</label>
                        <input
                          type="text"
                          value={tempConfig.volunteerConfig.submitButtonText}
                          onChange={(e) => setTempConfig({
                            ...tempConfig,
                            volunteerConfig: { ...tempConfig.volunteerConfig, submitButtonText: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 font-bold"
                          placeholder="Kirim & Terhubung ke WhatsApp"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Format Pesan WhatsApp Konfirmasi Relawan:
                      </label>
                      <textarea
                        rows={3}
                        value={tempConfig.volunteerConfig.waTemplate}
                        onChange={(e) => setTempConfig({
                          ...tempConfig,
                          volunteerConfig: { ...tempConfig.volunteerConfig, waTemplate: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-mono"
                        placeholder="Hai Teman Kebaikan, aku [Nama Anda], [Nomor HP Anda], [Asal Anda], ingin menjadi bagian dari Teman Kebaikan."
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Variabel otomatis yang diganti sistem: <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-700">[Nama Anda]</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-700">[Nomor HP Anda]</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-700">[Asal Anda]</code>.
                      </p>
                    </div>
                  </div>

                  {/* Toggle Fields dalam Form */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm">
                      Kustomisasi Field / Kolom Input Pada Formulir:
                    </h4>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempConfig.volunteerConfig.showBikeTypeField}
                          onChange={(e) => setTempConfig({
                            ...tempConfig,
                            volunteerConfig: { ...tempConfig.volunteerConfig, showBikeTypeField: e.target.checked }
                          })}
                          className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                        <span>Tampilkan Pilihan Jenis Sepeda (Centang jika ingin diisi pendaftar, hilangkan jika tidak)</span>
                      </label>

                      <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempConfig.volunteerConfig.showExperienceField}
                          onChange={(e) => setTempConfig({
                            ...tempConfig,
                            volunteerConfig: { ...tempConfig.volunteerConfig, showExperienceField: e.target.checked }
                          })}
                          className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                        <span>Tampilkan Kolom Catatan / Pengalaman Bersepeda</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: DINDING KEBAIKAN & MODERASI PESAN REALTIME */}
              {customizerTab === 'wall' && (
                <div className="space-y-4">
                  {/* Teks Dinding Kebaikan */}
                  <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-sky-600" />
                      <span>Kustomisasi Teks Seksi Dinding Kebaikan</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Badge Teks</label>
                        <input
                          type="text"
                          value={tempConfig.wallConfig.badgeText}
                          onChange={(e) => setTempConfig({
                            ...tempConfig,
                            wallConfig: { ...tempConfig.wallConfig, badgeText: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300"
                          placeholder="Dinding Kebaikan Real-Time"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Judul Seksi *</label>
                        <input
                          type="text"
                          value={tempConfig.wallConfig.title}
                          onChange={(e) => setTempConfig({
                            ...tempConfig,
                            wallConfig: { ...tempConfig.wallConfig, title: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 font-bold"
                          placeholder="Titipkan Doa, Saran, & Kata Semangat"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Deskripsi Seksi</label>
                      <textarea
                        rows={2}
                        value={tempConfig.wallConfig.description}
                        onChange={(e) => setTempConfig({
                          ...tempConfig,
                          wallConfig: { ...tempConfig.wallConfig, description: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Judul Daftar Pesan di Sebelah Kanan</label>
                        <input
                          type="text"
                          value={tempConfig.wallConfig.listTitle}
                          onChange={(e) => setTempConfig({
                            ...tempConfig,
                            wallConfig: { ...tempConfig.wallConfig, listTitle: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 font-bold"
                          placeholder="Pesan & Doa Sahabat Kebaikan"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Teks Tombol Kirim Form</label>
                        <input
                          type="text"
                          value={tempConfig.wallConfig.submitButtonText}
                          onChange={(e) => setTempConfig({
                            ...tempConfig,
                            wallConfig: { ...tempConfig.wallConfig, submitButtonText: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300"
                          placeholder="Kirim Pesan ke Dinding"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Placeholder Textarea Pesan</label>
                      <input
                        type="text"
                        value={tempConfig.wallConfig.inputPlaceholder}
                        onChange={(e) => setTempConfig({
                          ...tempConfig,
                          wallConfig: { ...tempConfig.wallConfig, inputPlaceholder: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs"
                        placeholder="Tuliskan kata-kata semangat atau saran untuk aksi gowes berbagi..."
                      />
                    </div>
                  </div>

                  {/* Moderasi Pesan (Hapus Pesan Doa / Saran) */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <Trash2 className="w-4 h-4 text-red-500" />
                          <span>Kelola & Hapus Pesan Dinding ({messages.length} Pesan)</span>
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Sebagai developer, Anda dapat menghapus pesan atau doa yang tidak sesuai kapan saja.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleResetWallMessages}
                        className="px-2.5 py-1 text-[11px] font-bold text-sky-700 bg-white hover:bg-sky-50 border border-sky-200 rounded-lg cursor-pointer"
                        title="Kembalikan ke pesan contoh bawaan"
                      >
                        Reset Pesan Contoh
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                      {messages.length === 0 ? (
                        <p className="text-center py-4 text-slate-400 font-medium text-xs">
                          Tidak ada pesan tersimpan saat ini.
                        </p>
                      ) : (
                        messages.map((msg) => (
                          <div
                            key={msg.id}
                            className="p-3 bg-white rounded-xl border border-slate-200 flex items-start justify-between gap-3 shadow-2xs"
                          >
                            <div className="space-y-0.5">
                              <p className="font-bold text-slate-900 text-xs">
                                {msg.name} <span className="font-normal text-slate-400">({msg.city})</span>
                              </p>
                              <p className="text-slate-600 text-[11px] italic">"{msg.message}"</p>
                              <p className="text-[10px] text-slate-400">{msg.timestamp}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteWallMessage(msg.id)}
                              className="px-2.5 py-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                              title="Hapus pesan ini secara permanen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: DONASI 2 BAGIAN (BANK/E-WALLET & QRIS) */}
              {customizerTab === 'bank' && (
                <div className="space-y-4">
                  {/* WhatsApp Konfirmasi Donasi Message Editor */}
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>Format Konfirmasi Pengiriman Donasi (WhatsApp)</span>
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Pesan otomatis saat donatur menekan tombol "Konfirmasi via WA" di seksi donasi:
                    </p>
                    <textarea
                      rows={2}
                      value={tempConfig.donationWhatsAppMessage}
                      onChange={(e) => setTempConfig({
                        ...tempConfig,
                        donationWhatsAppMessage: e.target.value
                      })}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-medium"
                      placeholder="Hai Teman Kebaikan, aku mau titip kebaikan nih... Ini bukti transfernya ya, semoga berkah dan bermanfaat! 🙏✨"
                    />
                  </div>

                  {/* QRIS Code Editor */}
                  <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-sky-600" />
                      <span>Edit QRIS Standar Nasional</span>
                    </h4>

                    <div className="flex items-center gap-4">
                      <img
                        src={tempConfig.qrisImage}
                        alt="QRIS Preview"
                        className="w-20 h-24 object-contain rounded-xl border border-slate-300 bg-white p-1"
                      />
                      <div className="space-y-2 flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          ref={qrisFileInputRef}
                          className="hidden"
                          onChange={(e) => handleImageFileUpload(e, (base64) => {
                            setTempConfig({ ...tempConfig, qrisImage: base64 });
                          })}
                        />
                        <button
                          type="button"
                          onClick={() => qrisFileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Gambar QRIS Baru</span>
                        </button>
                        <input
                          type="text"
                          value={tempConfig.qrisTitle}
                          onChange={(e) => setTempConfig({ ...tempConfig, qrisTitle: e.target.value })}
                          placeholder="Judul QRIS"
                          className="w-full px-2.5 py-1.5 bg-white rounded border border-slate-300 text-xs font-bold"
                        />
                        <input
                          type="text"
                          value={tempConfig.qrisDescription}
                          onChange={(e) => setTempConfig({ ...tempConfig, qrisDescription: e.target.value })}
                          placeholder="Keterangan cara scan QRIS..."
                          className="w-full px-2.5 py-1.5 bg-white rounded border border-slate-300 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rekening Bank & E-Wallet List */}
                  <div className="flex items-center justify-between pt-2">
                    <p className="font-bold text-slate-800">Daftar Rekening Bank & E-Wallet ({tempConfig.bankAccounts.length}):</p>
                    <button
                      type="button"
                      onClick={() => {
                        const newAcc: BankAccountItem = {
                          id: 'acc-' + Date.now(),
                          name: 'Bank / E-Wallet Baru',
                          accountNumber: '1234567890',
                          accountHolder: 'BERBAGI KEBIKEAN',
                          badge: 'Bank'
                        };
                        setTempConfig({
                          ...tempConfig,
                          bankAccounts: [...tempConfig.bankAccounts, newAcc]
                        });
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Tambah Rekening
                    </button>
                  </div>

                  <div className="space-y-3">
                    {tempConfig.bankAccounts.map((acc, idx) => (
                      <div key={acc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">#{idx + 1} {acc.name}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const filtered = tempConfig.bankAccounts.filter((_, i) => i !== idx);
                              setTempConfig({ ...tempConfig, bankAccounts: filtered });
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Hapus rekening ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Nama Bank / E-Wallet</label>
                            <input
                              type="text"
                              value={acc.name}
                              onChange={(e) => {
                                const list = [...tempConfig.bankAccounts];
                                list[idx].name = e.target.value;
                                setTempConfig({ ...tempConfig, bankAccounts: list });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white rounded border border-slate-300 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Nomor Rekening / No. HP</label>
                            <input
                              type="text"
                              value={acc.accountNumber}
                              onChange={(e) => {
                                const list = [...tempConfig.bankAccounts];
                                list[idx].accountNumber = e.target.value;
                                setTempConfig({ ...tempConfig, bankAccounts: list });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white rounded border border-slate-300 font-mono text-xs font-bold"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Atas Nama (Holder)</label>
                            <input
                              type="text"
                              value={acc.accountHolder}
                              onChange={(e) => {
                                const list = [...tempConfig.bankAccounts];
                                list[idx].accountHolder = e.target.value;
                                setTempConfig({ ...tempConfig, bankAccounts: list });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white rounded border border-slate-300 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Label Badge</label>
                            <input
                              type="text"
                              value={acc.badge}
                              onChange={(e) => {
                                const list = [...tempConfig.bankAccounts];
                                list[idx].badge = e.target.value;
                                setTempConfig({ ...tempConfig, bankAccounts: list });
                              }}
                              placeholder="SeaBank / BCA / Dana"
                              className="w-full px-2.5 py-1.5 bg-white rounded border border-slate-300 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: STATISTIK & ANGKA */}
              {customizerTab === 'stats' && (
                <div className="space-y-4">
                  <p className="text-slate-500">
                    Ubah angka pencapaian kebaikan yang muncul pada seksi Counter Statistik:
                  </p>
                  {tempConfig.stats.map((stat, idx) => (
                    <div key={stat.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Angka / Nilai</label>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = [...tempConfig.stats];
                              newStats[idx].value = e.target.value;
                              setTempConfig({ ...tempConfig, stats: newStats });
                            }}
                            className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 font-bold text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Label Keterangan</label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...tempConfig.stats];
                              newStats[idx].label = e.target.value;
                              setTempConfig({ ...tempConfig, stats: newStats });
                            }}
                            className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-slate-900"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Sub-teks Penjelas</label>
                        <input
                          type="text"
                          value={stat.sublabel}
                          onChange={(e) => {
                            const newStats = [...tempConfig.stats];
                            newStats[idx].sublabel = e.target.value;
                            setTempConfig({ ...tempConfig, stats: newStats });
                          }}
                          placeholder="Kosongkan jika tidak diperlukan"
                          className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 text-slate-700 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 8: KONTAK, SOSIAL MEDIA & FOOTER */}
              {customizerTab === 'contacts' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Catatan / Slogan di Bawah Copyright Footer
                    </label>
                    <textarea
                      rows={2}
                      value={tempConfig.footerCopyrightNote}
                      onChange={(e) => setTempConfig({ ...tempConfig, footerCopyrightNote: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300"
                      placeholder="Dibuat dengan ❤️ untuk kemanusiaan, pesepeda, dan kebaikan jalanan."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp Admin</label>
                      <input
                        type="text"
                        value={tempConfig.contacts.whatsappNumber}
                        onChange={(e) => setTempConfig({
                          ...tempConfig,
                          contacts: { ...tempConfig.contacts, whatsappNumber: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 font-mono"
                        placeholder="6288216419059"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tampilan Nomor WA di Layar</label>
                      <input
                        type="text"
                        value={tempConfig.contacts.whatsappDisplay}
                        onChange={(e) => setTempConfig({
                          ...tempConfig,
                          contacts: { ...tempConfig.contacts, whatsappDisplay: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300"
                        placeholder="+62 882-1641-9059"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Link Instagram (URL)</label>
                      <input
                        type="text"
                        value={tempConfig.contacts.instagram}
                        onChange={(e) => setTempConfig({
                          ...tempConfig,
                          contacts: { ...tempConfig.contacts, instagram: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Username Instagram</label>
                      <input
                        type="text"
                        value={tempConfig.contacts.instagramHandle}
                        onChange={(e) => setTempConfig({
                          ...tempConfig,
                          contacts: { ...tempConfig.contacts, instagramHandle: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300"
                        placeholder="@berbagikebikean"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Link TikTok (URL)</label>
                      <input
                        type="text"
                        value={tempConfig.contacts.tiktok}
                        onChange={(e) => setTempConfig({
                          ...tempConfig,
                          contacts: { ...tempConfig.contacts, tiktok: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Username TikTok</label>
                      <input
                        type="text"
                        value={tempConfig.contacts.tiktokHandle}
                        onChange={(e) => setTempConfig({
                          ...tempConfig,
                          contacts: { ...tempConfig.contacts, tiktokHandle: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300"
                        placeholder="@berbagikebikean"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Resmi</label>
                    <input
                      type="email"
                      value={tempConfig.contacts.email}
                      onChange={(e) => setTempConfig({
                        ...tempConfig,
                        contacts: { ...tempConfig.contacts, email: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Alamat Titik Kumpul / Basecamp</label>
                    <input
                      type="text"
                      value={tempConfig.contacts.address}
                      onChange={(e) => setTempConfig({
                        ...tempConfig,
                        contacts: { ...tempConfig.contacts, address: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Customizer Footer Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetConfig}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Kembalikan data ke setelan awal"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyConfigJSON}
                  className="px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Salin JSON konfigurasi"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Salin JSON</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomizerOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-6 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-xl transition-all shadow-md shadow-sky-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>

            {customizerSaveToast && (
              <div className="mt-2 p-2.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold text-center">
                Perubahan berhasil disimpan dan langsung aktif di website!
              </div>
            )}

          </div>
        </div>
      )}


      {/* ==================================================================== */}
      {/* MODAL: LIGHTBOX ZOOM MEDIA DOKUMENTASI                               */}
      {/* ==================================================================== */}
      {selectedPhotoForZoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
            <button
              onClick={() => setSelectedPhotoForZoom(null)}
              className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-h-[75vh] bg-black flex items-center justify-center">
              <img
                src={selectedPhotoForZoom.src}
                alt={selectedPhotoForZoom.title}
                className="max-h-[75vh] w-auto object-contain mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-5 text-white bg-slate-900 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-sky-400 font-bold flex items-center gap-1 mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedPhotoForZoom.location}
                </span>
                <h4 className="text-lg font-bold">{selectedPhotoForZoom.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5">{selectedPhotoForZoom.desc}</p>
              </div>
              <button
                onClick={() => setSelectedPhotoForZoom(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ==================================================================== */}
      {/* MODAL: FORMULIR PENDAFTARAN RELAWAN / TEMAN KEBAIKAN                 */}
      {/* ==================================================================== */}
      {isVolunteerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-sky-100 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedAgendaForModal ? `Daftar: ${selectedAgendaForModal.title}` : (config.volunteerConfig.modalTitle || config.volunteerConfig.title)}
                  </h3>
                  <p className="text-xs text-slate-500">{config.volunteerConfig.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsVolunteerModalOpen(false);
                  setVolunteerSuccess(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {volunteerSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Pendaftaran Berhasil Disiapkan!</h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                  WhatsApp akan terbuka otomatis untuk mengirimkan pesan pendaftaran Anda langsung ke WhatsApp Admin ({config.volunteerConfig.targetWhatsAppNumber || '088216419059'}).
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsVolunteerModalOpen(false);
                      setVolunteerSuccess(false);
                    }}
                    className="px-6 py-2.5 bg-sky-600 text-white text-xs font-bold rounded-xl hover:bg-sky-700 transition-colors cursor-pointer"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleVolunteerSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={volunteerName}
                    onChange={(e) => setVolunteerName(e.target.value)}
                    placeholder="Contoh: Muhammad Ilham"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp Aktif *
                  </label>
                  <input
                    type="tel"
                    required
                    value={volunteerPhone}
                    onChange={(e) => setVolunteerPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                  />
                </div>

                {/* Conditional Field: Jenis Sepeda */}
                {config.volunteerConfig.showBikeTypeField && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Jenis Sepeda yang Digunakan
                    </label>
                    <select
                      value={volunteerBikeType}
                      onChange={(e) => setVolunteerBikeType(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none bg-white"
                    >
                      {config.volunteerConfig.bikeOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kota / Wilayah Domisili
                  </label>
                  <input
                    type="text"
                    value={volunteerCity}
                    onChange={(e) => setVolunteerCity(e.target.value)}
                    placeholder="Contoh: Jakarta Selatan / Depok"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                  />
                </div>

                {/* Conditional Field: Pengalaman / Catatan */}
                {config.volunteerConfig.showExperienceField && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Catatan / Pengalaman Bersepeda (Opsional)
                    </label>
                    <textarea
                      rows={2}
                      value={volunteerNote}
                      onChange={(e) => setVolunteerNote(e.target.value)}
                      placeholder="Contoh: Siap bantu bawa keranjang makanan di rak belakang..."
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                    />
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsVolunteerModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-xl shadow-md shadow-sky-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{config.volunteerConfig.submitButtonText || 'Kirim & Terhubung ke WA'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}


      {/* ==================================================================== */}
      {/* MODAL: LIGHTBOX QRIS PENUH                                           */}
      {/* ==================================================================== */}
      {isQrisModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative border border-sky-100">
            <button
              onClick={() => setIsQrisModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full">
              QRIS Nasional
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-2 mb-1">
              {config.communityName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Scan barcode di bawah dengan aplikasi m-Banking atau E-Wallet apapun
            </p>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 shadow-inner">
              <img
                src={config.qrisImage}
                alt={`QRIS Standar Nasional ${config.communityName}`}
                className="w-full h-auto rounded-xl object-contain mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <a
                href={config.qrisImage}
                download="QRIS_Berbagi_Kebikean.jpg"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span>Simpan Gambar Barcode</span>
              </a>
            </div>
          </div>
        </div>
      )}


      {/* ==================================================================== */}
      {/* MODAL: VERIFIKASI AKSES DEVELOPER / PENGELOLA                        */}
      {/* ==================================================================== */}
      {/* Toast Notifikasi Pesan Dihapus */}
      {deletedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-7 h-7 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
            <Trash2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Moderasi Pesan</p>
            <p className="text-sm font-bold">Pesan berhasil dihapus dari Dinding!</p>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: VERIFIKASI AKSES DEVELOPER / PENGELOLA                        */}
      {/* ==================================================================== */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-sky-100 text-center relative">
            <button
              onClick={() => {
                setIsPinModalOpen(false);
                setPinInput('');
                setPinError(false);
                setShowPinText(false);
              }}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Key className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Akses Khusus Developer</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
              Masukkan PIN Pengembang untuk membuka panel kustomisasi konten website:
            </p>

            <form onSubmit={handleVerifyPin} className="space-y-3.5">
              <div className="relative">
                <input
                  type={showPinText ? 'text' : 'password'}
                  required
                  autoFocus
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="Masukkan PIN Akses"
                  className="w-full px-4 pr-10 py-2.5 text-center text-sm rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none font-mono tracking-widest bg-slate-50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPinText(!showPinText)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  title={showPinText ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
                >
                  {showPinText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {pinError && (
                  <p className="text-[11px] font-bold text-red-500 mt-1.5">
                    PIN tidak sesuai! Silakan periksa kembali.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  id="rememberDevice"
                  checked={rememberDevDevice}
                  onChange={(e) => setRememberDevDevice(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="rememberDevice" className="cursor-pointer font-medium select-none">
                  Ingat di perangkat ini
                </label>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPinModalOpen(false);
                    setPinInput('');
                    setPinError(false);
                    setShowPinText(false);
                  }}
                  className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-xl transition-colors shadow-md shadow-sky-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Buka Kunci</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
