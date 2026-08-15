/* ═══════════════════════════════════════════════════════════
   MAJESTY BALI — Konfigurasi terpusat (anti-hardcode)
   Ubah semua nilai penting DI SINI saja, lalu seluruh situs
   (teks brand, kontak, kelas, form) otomatis menyesuaikan.
   ═══════════════════════════════════════════════════════════ */
window.MAJESTY_CONFIG = {
  // ── Brand ──
  brand: "MAJESTY BALI",
  brandSmall: "BALI",
  brandTagline: "Kombat & Fitness Camp",
  heroSubtitle: "MAJESTY BALI OPEN CAMP",
  heroTitle1: "Kombat & Fitness Camp",
  heroTitle2: "di Pulau Dewata",

  // ── Kontak resmi (ganti dengan nomor/alamat asli) ──
  wa: "6281234567890",        // format internasional, tanpa +
  waDisplay: "0812-3456-7890",
  email: "admin@learnmmabalimajesty.com",
  address: "Denpasar, Bali, Indonesia",
  addressNote: "(isi alamat dojo asli di config.js)",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Denpasar+Bali+Indonesia",

  // ── Daftar kelas yang diadakan (8 kelas resmi) ──
  classes: [
    { name: "HIIT", icon: "🔥", desc: "High Intensity Interval Training — bakar kalori maksimal, tingkatkan daya tahan jantung & paru.", tag: "Semua Level" },
    { name: "Flexibility", icon: "🧘", desc: "Latihan kelenturan, mobilitas sendi, dan pencegahan cedera untuk semua umur.", tag: "Semua Level" },
    { name: "Mind & Body Healing", icon: "🌿", desc: "Kelas pemulihan pikiran & tubuh — pernapasan, meditasi gerak, dan relaksasi.", tag: "Semua Level" },
    { name: "Taekwondo", icon: "🥋", desc: "Seni bela diri Korea — tendangan presisi, pola (poomsae), dan tanding kyorugi.", tag: "Anak & Dewasa" },
    { name: "Kickboxing", icon: "🦵", desc: "Perpaduan tinju dan tendangan ala K-1 — kardio keras sekaligus teknik tanding.", tag: "Semua Level" },
    { name: "Boxing", icon: "🥊", desc: "Fundamental tinju: footwork, kombinasi pukulan, dan sparring terkontrol.", tag: "Semua Level" },
    { name: "MMA", icon: "⚔️", desc: "Mixed Martial Arts lengkap — striking, wrestling, dan ground game untuk atlet tanding.", tag: "Atlet & Tanding" },
    { name: "Wrestling", icon: "🤼", desc: "Gulat — takedown, kontrol, dan pin. Fondasi pertarungan jarak dekat.", tag: "Semua Level" }
  ]
};
