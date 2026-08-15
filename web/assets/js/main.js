/* ═══════════════════════════════════════════════════════════
   MAJESTY BALI — main.js
   Semua nilai konfigurasi diambil dari config.js (anti-hardcode).
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const CFG = window.MAJESTY_CONFIG || {
    brand: 'MAJESTY BALI', brandSmall: 'BALI', wa: '6281234567890',
    waDisplay: '0812-3456-7890', email: 'admin@learnmmabalimajesty.com',
    address: 'Denpasar, Bali, Indonesia', addressNote: '',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Denpasar+Bali+Indonesia',
    classes: []
  };

  /* ── Terapkan konfigurasi ke elemen [data-cfg] ────────── */
  const cfgMap = {
    brand: CFG.brand,
    brandSmall: CFG.brandSmall,
    heroSubtitle: CFG.heroSubtitle,
    heroTitle1: CFG.heroTitle1,
    heroTitle2: CFG.heroTitle2,
    waDisplay: CFG.waDisplay,
    email: CFG.email,
    address: CFG.address,
    addressNote: CFG.addressNote,
    wa: 'https://wa.me/' + CFG.wa,
    emailHref: 'mailto:' + CFG.email,
    maps: CFG.mapsUrl
  };
  document.querySelectorAll('[data-cfg]').forEach((el) => {
    const key = el.dataset.cfg;
    if (key === 'wa' || key === 'emailHref' || key === 'maps') {
      el.setAttribute('href', cfgMap[key]);
    } else if (cfgMap[key] !== undefined) {
      el.textContent = cfgMap[key];
    }
  });

  /* ── Render 8 kelas dari config.js ────────────────────── */
  const grid = document.getElementById('programGrid');
  if (grid && Array.isArray(CFG.classes) && CFG.classes.length) {
    grid.innerHTML = CFG.classes.map((c, i) => `
      <article class="program-card">
        <div class="program-icon">${c.icon || '🥊'}</div>
        <h3>${c.name}</h3>
        <p>${c.desc || ''}</p>
        <span class="program-tag">${c.tag || 'Semua Level'}</span>
      </article>`).join('');
  } else {
    grid.innerHTML = '<p class="muted">Daftar kelas belum diisi di config.js.</p>';
  }

  /* ── Isi pilihan kelas pada form pendaftaran ──────────── */
  const kelasSelect = document.getElementById('program_pilihan');
  if (kelasSelect && Array.isArray(CFG.classes)) {
    kelasSelect.innerHTML = CFG.classes.map((c) => `<option value="${c.name}">${c.name}</option>`).join('');
  }

  /* ── Tahun footer ─────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Sticky header & back-to-top ──────────────────────── */
  const header = document.getElementById('siteHeader');
  const backTop = document.getElementById('backTop');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 10);
    if (backTop) backTop.classList.toggle('show', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── Mobile nav ───────────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    mainNav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ── Scrollspy ────────────────────────────────────────── */
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.main-nav a'));
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ── Reveal on scroll ─────────────────────────────────── */
  const revealEls = document.querySelectorAll('.glass-panel, .program-card, .agenda-card, .fee-card, .doc-card, .spec-card, .info-card, .plan-card, .tiket-card, .kontak-card');
  if ('IntersectionObserver' in window) {
    const ro = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.08 }
    );
    revealEls.forEach((el) => { el.classList.add('reveal'); ro.observe(el); });
  }

  /* ── Validasi & pesan WhatsApp ────────────────────────── */
  const showError = (input) => {
    input.classList.add('invalid');
    const msg = input.parentElement.querySelector('.form-error');
    if (msg) msg.classList.add('show');
  };
  const clearError = (input) => {
    input.classList.remove('invalid');
    const msg = input.parentElement.querySelector('.form-error');
    if (msg) msg.classList.remove('show');
  };
  const validWA = (v) => /^(\+62|62|0)8[0-9]{8,12}$/.test((v || '').replace(/[\s-]/g, ''));

  const bindValidation = (form) => {
    form.querySelectorAll('input, select, textarea').forEach((el) => {
      el.addEventListener('input', () => clearError(el));
      el.addEventListener('change', () => clearError(el));
    });
  };

  const buildWaUrl = (text) => 'https://wa.me/' + CFG.wa + '?text=' + encodeURIComponent(text);

  /* ── Form pendaftaran atlet ───────────────────────────── */
  const daftarForm = document.getElementById('daftarForm');
  const daftarSuccess = document.getElementById('daftarSuccess');
  const waSendLink = document.getElementById('waSendLink');

  if (daftarForm) {
    bindValidation(daftarForm);
    daftarForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      let ok = true;
      const req = daftarForm.querySelectorAll('[required]');
      req.forEach((el) => {
        const valid = el.value.trim() !== '' && (el.type !== 'tel' || validWA(el.value));
        if (!valid) { showError(el); ok = false; }
        else clearError(el);
      });
      if (daftarForm.querySelector('input[name="website"]').value !== '') return; // honeypot
      if (!ok) return;

      const f = new FormData(daftarForm);
      const msg =
        '🏆 *PENDAFTARAN ATLET — ' + CFG.brand + '*\n\n' +
        'Nama: ' + f.get('atlet_name') + '\n' +
        'Sasana/Tim: ' + f.get('asal_tim') + '\n' +
        'WA Ofisial: ' + f.get('no_wa') + '\n' +
        'Tgl Lahir: ' + f.get('tanggal_lahir') + '\n' +
        'Jenis Kelamin: ' + f.get('jenis_kelamin') + '\n' +
        'Berat: ' + f.get('berat_badan') + ' kg\n' +
        'Kategori: ' + f.get('kategori_tanding') + '\n' +
        'Kelas: ' + f.get('program_pilihan');
      waSendLink.href = buildWaUrl(msg);
      daftarForm.hidden = true;
      daftarSuccess.hidden = false;
    });
    const again = document.getElementById('daftarAgain');
    if (again) again.addEventListener('click', () => {
      daftarForm.reset();
      daftarForm.hidden = false;
      daftarSuccess.hidden = true;
    });
  }

  /* ── Form kontak ──────────────────────────────────────── */
  const kontakForm = document.getElementById('kontakForm');
  const kontakSuccess = document.getElementById('kontakSuccess');
  const waKontakLink = document.getElementById('waKontakLink');
  if (kontakForm) {
    bindValidation(kontakForm);
    kontakForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      let ok = true;
      kontakForm.querySelectorAll('[required]').forEach((el) => {
        const valid = el.value.trim() !== '' && (el.type !== 'tel' || validWA(el.value));
        if (!valid) { showError(el); ok = false; } else clearError(el);
      });
      if (!ok) return;
      const f = new FormData(kontakForm);
      const msg =
        '💬 *PESAN — ' + CFG.brand + '*\n\n' +
        'Nama: ' + f.get('nama') + '\n' +
        'WA: ' + f.get('wa') + '\n' +
        'Topik: ' + f.get('topik') + '\n' +
        'Pesan: ' + f.get('pesan');
      waKontakLink.href = buildWaUrl(msg);
      kontakForm.hidden = true;
      kontakSuccess.hidden = false;
    });
    const again = document.getElementById('kontakAgain');
    if (again) again.addEventListener('click', () => {
      kontakForm.reset();
      kontakForm.hidden = false;
      kontakSuccess.hidden = true;
    });
  }

  /* ── Modal dokumen ────────────────────────────────────── */
  const modal = document.getElementById('docModal');
  const modalName = document.getElementById('docModalName');
  const modalClose = document.getElementById('docModalClose');
  document.querySelectorAll('.doc-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const doc = btn.dataset.doc || 'dokumen';
      modalName.textContent = doc;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });
  const closeModal = () => {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  };
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ── PWA install ──────────────────────────────────────── */
  let deferredPrompt = null;
  const installBtn = document.getElementById('installBtn');
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.hidden = false;
  });
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) {
        alert('Install aplikasi: buka menu browser lalu pilih "Add to Home Screen" / "Install app".');
        return;
      }
      deferredPrompt.prompt();
      const res = await deferredPrompt.userChoice;
      if (res.outcome === 'accepted') installBtn.hidden = true;
      deferredPrompt = null;
    });
  }
  window.addEventListener('appinstalled', () => { if (installBtn) installBtn.hidden = true; });

  /* ── Service worker (PWA offline) ─────────────────────── */
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch((err) => console.warn('SW register gagal:', err));
    });
  }
})();
