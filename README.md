# MAJESTY BALI 🥊

Website + mobile app untuk **MAJESTY BALI** — akademi bela diri kombat (HIIT, Flexibility, Mind & Body Healing, Taekwondo, Kickboxing, Boxing, MMA, Wrestling) di Bali.

Proyek ini menggabungkan:
- **`mma-theme`** (tema WordPress Majesty MMA — gaya visual *kombat*: merah neon + emas, font Teko/Inter, konten Bahasa Indonesia)
- **`raw-gym`** (aplikasi mobile Ionic + Capacitor + React — kelas, trainer, booking, produk, push notification, cache offline SQLite)
- **`raw-gym-api`** (backend Laravel)

Target domain: **learnmmabalimajesty.com** · Hosting: cPanel (digita50_economic)

---

## 📁 Struktur Repo

| Folder | Isi | Stack |
|---|---|---|
| `web/` | Situs utama — **PWA** (bisa di-install sebagai app di HP tanpa Play Store) | HTML + CSS + JS murni |
| `app/` | Aplikasi anggota (member app) — bisa dibangun jadi **APK Android** (sideload, tanpa Play Store) | Ionic + Capacitor + React + Vite |
| `api/` | Backend REST API (opsional, untuk data dinamis) | Laravel (PHP) |
| `wordpress/` | Tema WordPress `mma-theme` yang sudah disesuaikan (branding + kelas) | PHP/WordPress |

```
mma-bali-majesty/
├── web/                 ← Situs publik + PWA (deploy ke hosting / FC nginx)
│   ├── index.html       ← Satu halaman: beranda, program, agenda, kejuaraan,
│   │                      keanggotaan, coaching, sponsor, tiket, kontak
│   ├── manifest.webmanifest  ← PWA manifest (nama, ikon, tema)
│   ├── sw.js                 ← Service worker (offline & installable)
│   ├── nginx.conf            ← Konfigurasi untuk Function Compute (nginx)
│   └── assets/
│       ├── css/style.css     ← Seluruh gaya visual (variabel warna di :root)
│       ├── js/main.js        ← Interaksi + nomor WhatsApp admin (ADMIN_WA)
│       └── icons/            ← Ikon PWA 192/512/maskable + apple-touch
├── app/                 ← Aplikasi anggota (Capacitor)
├── api/                 ← Laravel API
└── README.md
```

---

## 🌐 Situs Web (`web/`)

### Cara menjalankan lokal

```bash
cd web
# opsi 1 — buka langsung di browser
open index.html

# opsi 2 — server lokal
npx serve .          # lalu buka http://localhost:3000
```

### Install sebagai aplikasi di HP (PWA — tanpa Play Store)

1. Buka URL situs di browser HP (Chrome Android / Safari iOS).
2. Android: menu ⋮ → **"Install app" / "Tambahkan ke layar utama"**.
3. iOS: tombol **Share** → **"Add to Home Screen"**.
4. Aplikasi muncul di layar utama seperti app biasa, bisa jalan offline.

### Kustomisasi cepat

| Yang mau diubah | File / lokasi |
|---|---|
| Nomor WhatsApp admin | `assets/js/config.js` → `wa` (satu-satunya tempat) |
| Harga / biaya (contoh) | `index.html` — cari `fee-card`, `plan-card`, `tiket-card` |
| Agenda / jadwal event | `index.html` — section `#agenda` |
| Daftar 8 kelas | `assets/js/config.js` → `classes` (otomatis render ke kartu & form) |
| Warna tema | `assets/css/style.css` → variabel di `:root` (`--red-neon`, `--gold-premium`, dll.) |
| Kontak / alamat | `index.html` — section `#kontak` |
| Teks & copywriting | `index.html` — semua section |
| Ikon aplikasi | `assets/icons/` + `manifest.webmanifest` |

---

## 📱 Aplikasi Mobile (`app/`)

Aplikasi anggota berbasis **Ionic + Capacitor** (React). Bisa dijalankan sebagai:
1. **Web app** — `npm run dev`
2. **APK Android** (sideload, tanpa Play Store) — lihat di bawah
3. **iOS** — `npx cap add ios` lalu buka dengan Xcode

### Menjalankan

```bash
cd app
npm install
npm run dev          # mode pengembangan (browser)
npm run build        # build produksi → folder dist/

# Siapkan environment
cp .env.example .env   # isi VITE_API_BASE_URL & VITE_API_KEY
```

### Build APK Android (instal langsung ke HP, tanpa Play Store)

```bash
cd app
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
# hasil: android/app/build/outputs/apk/debug/app-debug.apk
# kirim APK ke HP lalu install (izinkan "install dari sumber tidak dikenal")
```

> ⚠️ Jangan commit `.env` — berisi kunci API. `VITE_API_KEY` harus sama dengan `API_SECRET_KEY` di Laravel.

---

## 🔌 Backend API (`api/`)

Laravel API untuk data dinamis (kelas, booking, produk). Opsional — situs `web/` berfungsi penuh tanpa API (form memakai WhatsApp).

```bash
cd api
composer install
cp .env.example .env   # atur kredensial database
php artisan key:generate
php artisan migrate --seed
php artisan serve      # http://127.0.0.1:8000
```

---

## 🚀 Deployment ke Hosting cPanel (learnmmabalimajesty.com)

Situs `web/` adalah **statis murni** — paling ringan dan paling aman untuk hosting bersama.

1. Login cPanel → **File Manager** → masuk ke `public_html/`.
2. Upload isi folder `web/` (bukan foldernya) ke `public_html/` — `index.html`, `assets/`, `sw.js`, `manifest.webmanifest`.
3. **Pastikan HTTPS aktif**: cPanel → **SSL/TLS Status** → *Run AutoSSL* (Let's Encrypt). Aktifkan **Force HTTPS** di `.htaccess`.
4. Uji: buka `https://learnmmabalimajesty.com` di HP → install PWA.

> **Spek hosting:** paket `digita50_economic` (quota 250 MB) **cukup** untuk situs statis ini (±2 MB). Jika `api/` (Laravel + database) ikut di-hosting di paket yang sama, disarankan upgrade paket (Laravel + MySQL + log bisa memakan ratusan MB) atau host API di VPS terpisah.

---

## 🔐 Keamanan (wajib dibaca)

1. **Segera ganti password cPanel** — password pernah dibagikan lewat chat. cPanel → *Password & Security*.
2. **Jangan pernah commit `.env` / kunci API** ke GitHub (sudah di-`.gitignore`). Kunci API masuk lewat environment variable.
3. **HTTPS wajib** — aktifkan SSL gratis (AutoSSL/Let's Encrypt) agar PWA bisa di-install dan data form terenkripsi.
4. Form pendaftaran di `web/` dikirim via WhatsApp (tanpa backend) — data tidak tersimpan di server publik.
5. Batasi akses `api/` dengan `API_SECRET_KEY` (sudah diterapkan di `app/`).

---

## ✅ Status & Yang Perlu Dilengkapi

- [x] Situs publik + PWA (desktop & mobile, offline, installable) — brand MAJESTY BALI, 8 kelas resmi
- [x] Konfigurasi terpusat `config.js` (anti-hardcode: brand, kontak, kelas)
- [x] Tema WordPress live sudah di-update via FTP (branding MAJESTY BALI)
- [x] Form pendaftaran atlet & kontak (kirim via WhatsApp)
- [x] Struktur repo: web + app + api
- [ ] Ganti nomor WhatsApp admin (`ADMIN_WA`) & alamat dojo asli
- [ ] Ganti harga contoh dengan harga resmi
- [ ] Upload dokumen resmi (Proposal, THB, Formulir) — placeholder siap di `index.html`
- [ ] Isi logo partner/sponsor (placeholder tersedia)
- [ ] Hubungkan `app/` ke backend `api/` yang sudah online
- [ ] Deploy ke cPanel + aktifkan SSL

---

© 2026 MAJESTY BALI. Membangun generasi petarung tangguh dan berprestasi.
