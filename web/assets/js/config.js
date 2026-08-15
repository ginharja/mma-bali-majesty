/* ═══════════════════════════════════════════════════════════
   MAJESTY BALI — Konfigurasi terpusat (anti-hardcode)
   Ubah semua nilai penting DI SINI saja, lalu seluruh situs
   (teks brand, kontak, jargon, kelas, paket) otomatis menyesuaikan.
   ═══════════════════════════════════════════════════════════ */
window.MAJESTY_CONFIG = {
  // ── Brand ──
  brand: "MAJESTY BALI",
  brandSmall: "BALI",
  brandTagline: "Kombat & Fitness Camp",
  heroSubtitle: "MAJESTY BALI OPEN CAMP",
  heroTitle1: "Kombat & Fitness Camp",
  heroTitle2: "di Pulau Dewata",

  // ── Jargon resmi ──
  jargon: "3 Bulan Menguasai yang Kami Ajarkan",

  // ── Kontak resmi ──
  wa: "6287838872777",              // WhatsApp admin — atas nama Gin
  waName: "Gin",
  waDisplay: "0878-3887-2777",
  email: "admin@learnmmabalimajesty.com",
  address: "Jalan Tunjung Saring Gang Padma No. 10, Denpasar Barat, Bali",
  addressNote: "",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Jalan+Tunjung+Saring+Gang+Padma+No.+10+Denpasar+Barat+Bali",

  // ── URL PRODUCTION (pemisahan agar tidak bentrok) ──
  // WordPress  → https://learnmmabalimajesty.com/          (root, wp-content)
  // Frontend   → https://learnmmabalimajesty.com/app/      (PWA statis ini)
  // Laravel API→ https://learnmmabalimajesty.com/api/      (diarahkan ke public/)
  siteUrl: "https://learnmmabalimajesty.com",
  feUrl: "https://learnmmabalimajesty.com/app/",
  apiBaseUrl: "https://learnmmabalimajesty.com/api",
  wpUrl: "https://learnmmabalimajesty.com",

  // ── Model membership: PER KEDATANGAN / BULANAN (tanpa ikatan tahunan) ──
  membershipNote: "Membership fleksibel — bayar per kedatangan atau bulanan. Tanpa ikatan tahunan seperti tempat lain.",
  plans: [
    { name: "Per Kedatangan", price: "Rp 75rb", period: "/kali", badge: "", note: "Bayar setiap datang latihan — tanpa komitmen." },
    { name: "Bulanan", price: "Rp 350rb", period: "/bulan", badge: "TANPA IKATAN", note: "Akses semua kelas 8 disiplin selama sebulan. Bisa berhenti kapan saja." }
  ],

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
