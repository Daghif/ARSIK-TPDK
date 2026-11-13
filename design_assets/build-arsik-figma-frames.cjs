const fs = require('fs');
const path = require('path');

const imgDir = 'C:/Users/Acer/VScode/ARSIK-TPDK/public/images';
const outDir = 'C:/Users/Acer/VScode/ARSIK-TPDK/design_assets/figma_frames';
fs.mkdirSync(outDir, { recursive: true });

function b64(file) {
  const buf = fs.readFileSync(path.join(imgDir, file));
  return 'data:image/jpeg;base64,' + buf.toString('base64');
}

const imgSplash = b64('splash-family.jpg');
const imgBudi = b64('person-budi.jpg');
const imgRina = b64('person-rina.jpg');
const imgDimas = b64('person-dimas.jpg');

const FONT = 'Helvetica, Arial, sans-serif';

// =========================================================================
// VECTOR ICONS (SVG PATHS)
// =========================================================================
const ICONS = {
  heart: (x, y, color = '#1D3557', size = 20) => `
    <g transform="translate(${x}, ${y}) scale(${size / 24})">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="${color}"/>
    </g>`,
  camera: (x, y, color = '#1D3557', size = 20) => `
    <g transform="translate(${x}, ${y}) scale(${size / 24})">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="13" r="4" fill="none" stroke="${color}" stroke-width="2"/>
    </g>`,
  users: (x, y, color = '#1D3557', size = 20) => `
    <g transform="translate(${x}, ${y}) scale(${size / 24})">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="9" cy="7" r="4" fill="none" stroke="${color}" stroke-width="2"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    </g>`,
  switchCam: (x, y, color = '#1D3557', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size / 24})">
      <path d="M20 10c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 1.944.697 3.727 1.859 5.111L4 17h6v-6l-2.071 2.071A5.98 5.98 0 0 1 6 10c0-3.314 2.686-6 6-6s6 2.686 6 6c0 1.258-.387 2.427-1.049 3.393l1.536 1.282A7.96 7.96 0 0 0 20 10z" fill="${color}"/>
    </g>`,
  mic: (x, y, color = '#DC2626', size = 20) => `
    <g transform="translate(${x}, ${y}) scale(${size / 24})">
      <rect x="9" y="2" width="6" height="12" rx="3" fill="none" stroke="${color}" stroke-width="2"/>
      <path d="M5 10v2a7 7 0 0 0 14 0v-2" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      <line x1="12" y1="19" x2="12" y2="22" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    </g>`,
  search: (x, y, color = '#64748B', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size / 24})">
      <circle cx="11" cy="11" r="7" fill="none" stroke="${color}" stroke-width="2"/>
      <path d="M16 16l4.5 4.5" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    </g>`,
  trash: (x, y, color = '#DC2626', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size / 24})">
      <polyline points="3 6 5 6 21 6" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`,
  clock: (x, y, color = '#64748B', size = 15) => `
    <g transform="translate(${x}, ${y}) scale(${size / 24})">
      <circle cx="12" cy="12" r="9" fill="none" stroke="${color}" stroke-width="2"/>
      <polyline points="12 7 12 12 15 15" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    </g>`,
  shield: (x, y, color = '#15803D', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size / 24})">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 12l2 2 4-4" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`,
  userPlus: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size / 24})">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="8.5" cy="7" r="4" fill="none" stroke="${color}" stroke-width="2"/>
      <line x1="20" y1="8" x2="20" y2="14" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      <line x1="23" y1="11" x2="17" y2="11" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    </g>`,
  close: (x, y, color = '#0F172A', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size / 24})">
      <line x1="18" y1="6" x2="6" y2="18" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    </g>`,
};

// =========================================================================
// SYSTEM BARS (Status Bar + Home Indicator)
// =========================================================================
function renderStatusBar(isDark = false) {
  const color = isDark ? '#FFFFFF' : '#0F172A';
  return `
  <g id="System_Status_Bar">
    <text x="32" y="27" font-family="${FONT}" font-size="13" font-weight="700" fill="${color}">09:41</text>
    <!-- Dynamic Island / Notch -->
    <rect x="156" y="11" width="81" height="22" rx="11" fill="#0C0F0D"/>
    <!-- Signal Bars -->
    <rect x="307" y="21" width="3" height="6" rx="1" fill="${color}"/>
    <rect x="312" y="19" width="3" height="8" rx="1" fill="${color}"/>
    <rect x="317" y="16" width="3" height="11" rx="1" fill="${color}"/>
    <rect x="322" y="14" width="3" height="13" rx="1" fill="${color}"/>
    <!-- Battery -->
    <rect x="334" y="15" width="23" height="12" rx="3.5" fill="none" stroke="${color}" stroke-width="1.3"/>
    <rect x="336.5" y="17.5" width="16" height="7" rx="1.8" fill="${color}"/>
    <rect x="358.2" y="18.5" width="2" height="5" rx="1" fill="${color}"/>
  </g>`;
}

function renderHomeIndicator(isDark = false) {
  const color = isDark ? '#FFFFFF' : '#0F172A';
  const opacity = isDark ? '0.35' : '0.25';
  return `
  <g id="Home_Gesture_Indicator">
    <rect x="134" y="836" width="125" height="5" rx="2.5" fill="${color}" fill-opacity="${opacity}"/>
  </g>`;
}

// =========================================================================
// LO-FI SHELL (Clean Wireframe Architecture, 393 x 852)
// =========================================================================
function wrapLofiScreen(id, title, activeTab, bodySvg, showBars = true) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="393" height="852" viewBox="0 0 393 852" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="clip_${id}">
      <rect x="0" y="0" width="393" height="852" rx="36"/>
    </clipPath>
  </defs>
  <g id="${id}" clip-path="url(#clip_${id})">
    <!-- Background Canvas -->
    <rect id="Screen_Background" x="0" y="0" width="393" height="852" rx="36" fill="#F8FAFC"/>

    ${renderStatusBar(false)}

    ${showBars ? `
    <!-- Top App Bar -->
    <rect id="Top_App_Bar" x="0" y="44" width="393" height="60" fill="#FFFFFF"/>
    <line x1="0" y1="104" x2="393" y2="104" stroke="#334155" stroke-width="1.5"/>
    <rect x="20" y="54" width="40" height="40" rx="10" fill="#FFFFFF" stroke="#334155" stroke-width="2"/>
    <text x="40" y="79" text-anchor="middle" font-family="${FONT}" font-size="11" font-weight="900" fill="#334155">LOGO</text>
    <text x="70" y="72" font-family="${FONT}" font-size="18" font-weight="900" fill="#0F172A">ARSIK</text>
    <text x="70" y="90" font-family="${FONT}" font-size="12" font-weight="700" fill="#64748B">Asisten Pengenal Kerabat</text>
    ` : ''}

    <!-- Screen Body Content -->
    ${bodySvg}

    ${showBars ? `
    <!-- Bottom 2-Tab Navigation Bar -->
    <rect id="Bottom_Nav_Bar" x="0" y="756" width="393" height="80" fill="#FFFFFF"/>
    <line x1="0" y1="756" x2="393" y2="756" stroke="#334155" stroke-width="1.5"/>
    <!-- Tab 1: Kamera Deteksi -->
    <rect x="18" y="768" width="172" height="52" rx="14" fill="${activeTab === 1 ? '#CBD5E1' : '#FFFFFF'}" stroke="${activeTab === 1 ? '#0F172A' : '#64748B'}" stroke-width="2"/>
    <text x="104" y="800" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="900" fill="#0F172A">[ Kamera Deteksi ]</text>
    <!-- Tab 2: Daftar Kerabat -->
    <rect x="203" y="768" width="172" height="52" rx="14" fill="${activeTab === 2 ? '#CBD5E1' : '#FFFFFF'}" stroke="${activeTab === 2 ? '#0F172A' : '#64748B'}" stroke-width="2"/>
    <text x="289" y="800" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="900" fill="#0F172A">[ Daftar Kerabat ]</text>
    ` : ''}

    ${renderHomeIndicator(false)}

    <!-- Outer Device Border -->
    <rect id="Device_Frame_Border" x="0.75" y="0.75" width="391.5" height="850.5" rx="35.25" fill="none" stroke="#334155" stroke-width="1.5"/>
  </g>
</svg>`;
}

// =========================================================================
// HI-FI SHELL (High-Fidelity Mobile Design, 393 x 852)
// =========================================================================
function wrapHifiScreen(id, title, activeTab, bodySvg, defsExtra = '', showBars = true) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="393" height="852" viewBox="0 0 393 852" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="clip_${id}">
      <rect x="0" y="0" width="393" height="852" rx="36"/>
    </clipPath>
    <!-- Multi-layered Soft Drop Shadow -->
    <filter id="shadowCard" x="-10%" y="-8%" width="120%" height="124%">
      <feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#0F172A" flood-opacity="0.08"/>
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#0F172A" flood-opacity="0.04"/>
    </filter>
    <filter id="shadowBtn" x="-10%" y="-10%" width="120%" height="128%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#1D3557" flood-opacity="0.22"/>
    </filter>
    ${defsExtra}
  </defs>
  <g id="${id}" clip-path="url(#clip_${id})">
    <!-- Surface Background -->
    <rect id="Screen_Background" x="0" y="0" width="393" height="852" rx="36" fill="#F8FAFC"/>

    ${renderStatusBar(false)}

    ${showBars ? `
    <!-- Top App Bar -->
    <rect id="Top_App_Bar" x="0" y="44" width="393" height="60" fill="#FFFFFF"/>
    <line x1="0" y1="104" x2="393" y2="104" stroke="#0F172A" stroke-opacity="0.08" stroke-width="0.5"/>
    
    <!-- ARSIK Logo Mark -->
    <rect x="20" y="54" width="40" height="40" rx="12" fill="#1D3557" filter="url(#shadowBtn)"/>
    ${ICONS.heart(28, 62, '#FFFFFF', 24)}
    
    <text x="70" y="73" font-family="${FONT}" font-size="19" font-weight="900" fill="#0F172A">ARSIK</text>
    <text x="70" y="90" font-family="${FONT}" font-size="12" font-weight="700" fill="#64748B">Asisten Pengenal Kerabat</text>
    ` : ''}

    <!-- Screen Body Content -->
    ${bodySvg}

    ${showBars ? `
    <!-- Bottom 2-Tab Navigation Bar -->
    <rect id="Bottom_Nav_Bar" x="0" y="756" width="393" height="80" fill="#FFFFFF"/>
    <line x1="0" y1="756" x2="393" y2="756" stroke="#0F172A" stroke-opacity="0.08" stroke-width="0.5"/>
    
    <!-- Tab 1: Kamera Deteksi -->
    <rect x="18" y="768" width="172" height="52" rx="14" fill="${activeTab === 1 ? '#1D3557' : '#F1F5F9'}" stroke="#0F172A" stroke-opacity="${activeTab === 1 ? '0' : '0.1'}" stroke-width="0.5" ${activeTab === 1 ? 'filter="url(#shadowBtn)"' : ''}/>
    ${ICONS.camera(34, 782, activeTab === 1 ? '#FFFFFF' : '#475569', 24)}
    <text x="68" y="800" font-family="${FONT}" font-size="14.5" font-weight="900" fill="${activeTab === 1 ? '#FFFFFF' : '#334155'}">Kamera Deteksi</text>

    <!-- Tab 2: Daftar Kerabat -->
    <rect x="203" y="768" width="172" height="52" rx="14" fill="${activeTab === 2 ? '#1D3557' : '#F1F5F9'}" stroke="#0F172A" stroke-opacity="${activeTab === 2 ? '0' : '0.1'}" stroke-width="0.5" ${activeTab === 2 ? 'filter="url(#shadowBtn)"' : ''}/>
    ${ICONS.users(219, 782, activeTab === 2 ? '#FFFFFF' : '#475569', 24)}
    <text x="253" y="800" font-family="${FONT}" font-size="14.5" font-weight="900" fill="${activeTab === 2 ? '#FFFFFF' : '#334155'}">Daftar Kerabat</text>
    ` : ''}

    ${renderHomeIndicator(false)}

    <!-- Outer Device Border -->
    <rect id="Device_Frame_Border" x="0.5" y="0.5" width="392" height="851" rx="35.5" fill="none" stroke="#0F172A" stroke-opacity="0.16" stroke-width="1"/>
  </g>
</svg>`;
}

// =========================================================================
// 1. LO-FI 01: SPLASH SCREEN & MODEL PRELOAD
// =========================================================================
const lofi01 = wrapLofiScreen('01_LOFI_Splash_Screen_Offline_Preload', 'Lo-Fi 01: Splash Screen', 0, `
  <!-- Wireframe Photo Placeholder with Diagonal Cross -->
  <g id="Placeholder_Splash_Photo">
    <rect x="20" y="80" width="353" height="210" rx="18" fill="#FFFFFF" stroke="#64748B" stroke-width="2" stroke-dasharray="6 6"/>
    <line x1="20" y1="80" x2="373" y2="290" stroke="#CBD5E1" stroke-width="1.5"/>
    <line x1="373" y1="80" x2="20" y2="290" stroke="#CBD5E1" stroke-width="1.5"/>
    <rect x="96" y="165" width="200" height="40" rx="8" fill="#FFFFFF" stroke="#334155" stroke-width="1.5"/>
    <text x="196" y="190" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="900" fill="#0F172A">[ Foto Dokumentasi Lansia &amp; Keluarga ]</text>
  </g>

  <!-- Title & Copy Box -->
  <g id="Title_Block">
    <rect x="20" y="310" width="353" height="114" rx="18" fill="#FFFFFF" stroke="#334155" stroke-width="2"/>
    <text x="196" y="348" text-anchor="middle" font-family="${FONT}" font-size="28" font-weight="900" fill="#0F172A">ARSIK</text>
    <text x="196" y="374" text-anchor="middle" font-family="${FONT}" font-size="13.5" font-weight="700" fill="#334155">Aplikasi Rekayasa Sistem Identifikasi Kerabat</text>
    <text x="196" y="398" text-anchor="middle" font-family="${FONT}" font-size="12.5" font-weight="400" fill="#64748B">Asisten pengenal wajah keluarga untuk pasien demensia</text>
  </g>

  <!-- Preload Progress Card -->
  <g id="Preload_Progress_Box">
    <rect x="20" y="444" width="353" height="106" rx="18" fill="#FFFFFF" stroke="#334155" stroke-width="2"/>
    <circle cx="44" cy="474" r="6" fill="#334155"/>
    <text x="58" y="479" font-family="${FONT}" font-size="13.5" font-weight="900" fill="#0F172A">MEMUAT MODEL AI LOKAL (SK-F02)</text>
    <text x="349" y="479" text-anchor="end" font-family="${FONT}" font-size="14" font-weight="900" fill="#0F172A">85%</text>
    <rect x="40" y="496" width="313" height="14" rx="7" fill="#F1F5F9" stroke="#334155" stroke-width="1.5"/>
    <rect x="42" y="498" width="260" height="10" rx="5" fill="#334155"/>
    <text x="40" y="532" font-family="${FONT}" font-size="11.5" font-weight="400" fill="#64748B">Inisialisasi TinyFaceDetector, FaceLandmark68, &amp; FaceRecognitionNet.</text>
  </g>

  <!-- Local Privacy Banner (SK-NF03) -->
  <g id="Privacy_Banner">
    <rect x="20" y="570" width="353" height="92" rx="18" fill="#F8FAFC" stroke="#64748B" stroke-width="2" stroke-dasharray="6 6"/>
    <text x="196" y="605" text-anchor="middle" font-family="${FONT}" font-size="13.5" font-weight="900" fill="#0F172A">[ 100% Privasi Perangkat Lokal / UU PDP No. 27/2022 ]</text>
    <text x="196" y="628" text-anchor="middle" font-family="${FONT}" font-size="12" font-weight="400" fill="#475569">Vektor biometrik &amp; foto wajah kerabat tersimpan di localStorage.</text>
    <text x="196" y="646" text-anchor="middle" font-family="${FONT}" font-size="12" font-weight="400" fill="#475569">Tidak ada data yang dikirim ke peladen eksternal.</text>
  </g>
`, false);

// =========================================================================
// 2. LO-FI 02: TAB 1 — WAJAH DIKENALI
// =========================================================================
const lofi02 = wrapLofiScreen('02_LOFI_Kamera_Deteksi_Wajah_Dikenal', 'Lo-Fi 02: Wajah Dikenal', 1, `
  <!-- Camera Card Wireframe -->
  <rect x="20" y="116" width="353" height="380" rx="20" fill="#FFFFFF" stroke="#334155" stroke-width="2"/>
  
  <!-- Camera Top Bar -->
  <rect x="20" y="116" width="353" height="48" rx="20" fill="#F8FAFC"/>
  <line x1="20" y1="164" x2="373" y2="164" stroke="#334155" stroke-width="1.5"/>
  <circle cx="42" cy="140" r="5" fill="#334155"/>
  <text x="56" y="145" font-family="${FONT}" font-size="13" font-weight="900" fill="#0F172A">Kamera Depan Aktif</text>
  <rect x="250" y="126" width="110" height="30" rx="8" fill="#FFFFFF" stroke="#334155" stroke-width="1.5"/>
  <text x="305" y="146" text-anchor="middle" font-family="${FONT}" font-size="12" font-weight="900" fill="#0F172A">[ Putar Kamera ]</text>

  <!-- Viewport Area with Wireframe Box -->
  <rect x="22" y="166" width="349" height="328" fill="#F1F5F9"/>
  <!-- Bounding Box Wireframe -->
  <rect x="106" y="200" width="180" height="180" rx="12" fill="#FFFFFF" stroke="#0F172A" stroke-width="3" stroke-dasharray="6 4"/>
  <text x="196" y="296" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="900" fill="#334155">[ BBOX HIJAU SOLID ]</text>
  
  <!-- Overlay Label >= 20px Bold (SK-NF05) -->
  <rect x="46" y="420" width="300" height="52" rx="12" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5"/>
  <text x="196" y="452" text-anchor="middle" font-family="${FONT}" font-size="20" font-weight="900" fill="#0F172A">Budi Santoso (Anak Pertama)</text>

  <!-- Known Identity Card Below Camera -->
  <rect x="20" y="512" width="353" height="150" rx="20" fill="#FFFFFF" stroke="#334155" stroke-width="2"/>
  <rect x="36" y="528" width="144" height="24" rx="12" fill="#CBD5E1" stroke="#334155" stroke-width="1.5"/>
  <text x="108" y="544" text-anchor="middle" font-family="${FONT}" font-size="11" font-weight="900" fill="#0F172A">KERABAT DIKENALI</text>

  <!-- Thumbnail Placeholder -->
  <rect x="36" y="564" width="76" height="76" rx="16" fill="#F8FAFC" stroke="#334155" stroke-width="2" stroke-dasharray="4 4"/>
  <text x="74" y="607" text-anchor="middle" font-family="${FONT}" font-size="11" font-weight="900" fill="#475569">[Foto]</text>

  <text x="126" y="598" font-family="${FONT}" font-size="26" font-weight="900" fill="#0F172A">Budi Santoso</text>
  <text x="126" y="626" font-family="${FONT}" font-size="17" font-weight="700" fill="#334155">Hubungan: Anak Pertama</text>
`, true);

// =========================================================================
// 3. LO-FI 03: TAB 1 — WAJAH BELUM DIKENAL & REGISTRASI SUARA
// =========================================================================
const lofi03 = wrapLofiScreen('03_LOFI_Kamera_Deteksi_Wajah_Asing_Suara', 'Lo-Fi 03: Wajah Belum Dikenal', 1, `
  <!-- Camera Card Wireframe -->
  <rect x="20" y="116" width="353" height="320" rx="20" fill="#FFFFFF" stroke="#334155" stroke-width="2"/>
  
  <!-- Camera Top Bar -->
  <rect x="20" y="116" width="353" height="48" rx="20" fill="#F8FAFC"/>
  <line x1="20" y1="164" x2="373" y2="164" stroke="#334155" stroke-width="1.5"/>
  <circle cx="42" cy="140" r="5" fill="#334155"/>
  <text x="56" y="145" font-family="${FONT}" font-size="13" font-weight="900" fill="#0F172A">Kamera Depan Aktif</text>
  <rect x="250" y="126" width="110" height="30" rx="8" fill="#FFFFFF" stroke="#334155" stroke-width="1.5"/>
  <text x="305" y="146" text-anchor="middle" font-family="${FONT}" font-size="12" font-weight="900" fill="#0F172A">[ Putar Kamera ]</text>

  <!-- Viewport Area -->
  <rect x="22" y="166" width="349" height="268" fill="#F1F5F9"/>
  <rect x="116" y="186" width="160" height="160" rx="12" fill="#FFFFFF" stroke="#0F172A" stroke-width="3" stroke-dasharray="6 4"/>
  <text x="196" y="272" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="900" fill="#334155">[ BBOX MERAH SOLID ]</text>

  <!-- Overlay Label Tidak Dikenal -->
  <rect x="96" y="366" width="200" height="46" rx="12" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5"/>
  <text x="196" y="396" text-anchor="middle" font-family="${FONT}" font-size="20" font-weight="900" fill="#0F172A">Tidak Dikenal</text>

  <!-- Auto Voice Registration Card (SK-F07 & SK-F08) -->
  <rect x="20" y="452" width="353" height="236" rx="20" fill="#FFFFFF" stroke="#334155" stroke-width="2"/>
  
  <rect x="36" y="468" width="60" height="60" rx="14" fill="#F8FAFC" stroke="#334155" stroke-width="2" stroke-dasharray="4 4"/>
  <text x="66" y="503" text-anchor="middle" font-family="${FONT}" font-size="10" font-weight="900" fill="#475569">[Crop]</text>

  <rect x="110" y="468" width="116" height="22" rx="11" fill="#E2E8F0" stroke="#334155" stroke-width="1.5"/>
  <text x="168" y="483" text-anchor="middle" font-family="${FONT}" font-size="10.5" font-weight="900" fill="#0F172A">TIDAK DIKENAL</text>
  <text x="110" y="510" font-family="${FONT}" font-size="18" font-weight="900" fill="#0F172A">Wajah Belum Terdaftar</text>
  <text x="110" y="528" font-family="${FONT}" font-size="12" font-weight="700" fill="#475569">Ucapkan: &ldquo;Ini [Nama], [Hubungan] saya&rdquo;</text>

  <!-- Mic Live Status Bar -->
  <rect x="36" y="542" width="321" height="64" rx="12" fill="#F8FAFC" stroke="#64748B" stroke-width="2" stroke-dasharray="5 5"/>
  <text x="52" y="568" font-family="${FONT}" font-size="13" font-weight="900" fill="#0F172A">[ Mikrofon Aktif Mendengarkan... ]</text>
  <text x="52" y="590" font-family="${FONT}" font-size="13" font-weight="700" fill="#334155">Terbaca: &ldquo;Ini Dimas Pratama, cucu saya&rdquo;</text>

  <!-- Action Buttons -->
  <rect x="36" y="620" width="200" height="50" rx="14" fill="#CBD5E1" stroke="#0F172A" stroke-width="2"/>
  <text x="136" y="651" text-anchor="middle" font-family="${FONT}" font-size="14.5" font-weight="900" fill="#0F172A">[ Isi Nama Manual ]</text>
  <rect x="246" y="620" width="111" height="50" rx="14" fill="#FFFFFF" stroke="#334155" stroke-width="2"/>
  <text x="301" y="651" text-anchor="middle" font-family="${FONT}" font-size="14.5" font-weight="900" fill="#0F172A">[ Abaikan ]</text>
`, true);

// =========================================================================
// 4. LO-FI 04: MODAL PENDAFTARAN MANUAL CADANGAN
// =========================================================================
const lofi04 = wrapLofiScreen('04_LOFI_Modal_Form_Manual_Cadangan', 'Lo-Fi 04: Modal Form Manual', 1, `
  <!-- Dimmed Backdrop -->
  <rect x="0" y="104" width="393" height="652" fill="#334155" fill-opacity="0.3"/>

  <!-- Bottom Sheet Modal Surface -->
  <rect x="16" y="174" width="361" height="540" rx="24" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5"/>
  
  <rect x="34" y="196" width="138" height="24" rx="12" fill="#E2E8F0" stroke="#334155" stroke-width="1.5"/>
  <text x="103" y="212" text-anchor="middle" font-family="${FONT}" font-size="10.5" font-weight="900" fill="#0F172A">WAJAH BELUM DIKENAL</text>
  <text x="34" y="244" font-family="${FONT}" font-size="22" font-weight="900" fill="#0F172A">Daftarkan Kerabat Baru</text>
  
  <rect x="325" y="196" width="36" height="36" rx="10" fill="#F8FAFC" stroke="#334155" stroke-width="1.5"/>
  <text x="343" y="219" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="900" fill="#0F172A">X</text>

  <!-- Cropped Face + Mic Banner -->
  <rect x="34" y="260" width="325" height="88" rx="14" fill="#F8FAFC" stroke="#64748B" stroke-width="2" stroke-dasharray="5 5"/>
  <rect x="46" y="272" width="64" height="64" rx="12" fill="#FFFFFF" stroke="#334155" stroke-width="1.5"/>
  <text x="78" y="309" text-anchor="middle" font-family="${FONT}" font-size="10" font-weight="900" fill="#334155">[Foto Crop]</text>
  <text x="124" y="296" font-family="${FONT}" font-size="13" font-weight="900" fill="#0F172A">[ Mikrofon Aktif (id-ID) ]</text>
  <text x="124" y="316" font-family="${FONT}" font-size="12" font-weight="400" fill="#475569">Bicara langsung atau isi form di bawah.</text>

  <!-- Form Fields -->
  <text x="34" y="374" font-family="${FONT}" font-size="14" font-weight="900" fill="#0F172A">Nama Panggilan / Lengkap</text>
  <rect x="34" y="384" width="325" height="50" rx="12" fill="#FFFFFF" stroke="#334155" stroke-width="2"/>
  <text x="50" y="415" font-family="${FONT}" font-size="16" font-weight="700" fill="#0F172A">Dimas Pratama</text>

  <text x="34" y="460" font-family="${FONT}" font-size="14" font-weight="900" fill="#0F172A">Hubungan Keluarga</text>
  <rect x="34" y="470" width="325" height="50" rx="12" fill="#FFFFFF" stroke="#334155" stroke-width="2"/>
  <text x="50" y="501" font-family="${FONT}" font-size="16" font-weight="700" fill="#0F172A">Cucu</text>

  <!-- Chips -->
  <rect x="34" y="534" width="62" height="34" rx="17" fill="#FFFFFF" stroke="#334155" stroke-width="1.5"/>
  <text x="65" y="556" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="700" fill="#0F172A">Anak</text>
  <rect x="104" y="534" width="62" height="34" rx="17" fill="#CBD5E1" stroke="#0F172A" stroke-width="2"/>
  <text x="135" y="556" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="900" fill="#0F172A">Cucu</text>
  <rect x="174" y="534" width="80" height="34" rx="17" fill="#FFFFFF" stroke="#334155" stroke-width="1.5"/>
  <text x="214" y="556" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="700" fill="#0F172A">Menantu</text>
  <rect x="262" y="534" width="84" height="34" rx="17" fill="#FFFFFF" stroke="#334155" stroke-width="1.5"/>
  <text x="304" y="556" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="700" fill="#0F172A">Pasangan</text>

  <!-- Submit Buttons -->
  <rect x="34" y="630" width="115" height="54" rx="14" fill="#F8FAFC" stroke="#334155" stroke-width="2"/>
  <text x="91" y="663" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="900" fill="#0F172A">Batal</text>
  <rect x="159" y="630" width="200" height="54" rx="14" fill="#CBD5E1" stroke="#0F172A" stroke-width="2"/>
  <text x="259" y="663" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="900" fill="#0F172A">Simpan Profil</text>
`, true);

// =========================================================================
// 5. LO-FI 05: TAB 2 — DAFTAR KERABAT (CAREGIVER)
// =========================================================================
const lofi05 = wrapLofiScreen('05_LOFI_Daftar_Kerabat_Caregiver', 'Lo-Fi 05: Daftar Kerabat', 2, `
  <!-- Header Card with Search -->
  <rect x="20" y="116" width="353" height="118" rx="20" fill="#FFFFFF" stroke="#334155" stroke-width="2"/>
  <text x="38" y="146" font-family="${FONT}" font-size="19" font-weight="900" fill="#0F172A">Daftar Kerabat Terdaftar</text>
  <text x="38" y="166" font-family="${FONT}" font-size="13" font-weight="700" fill="#64748B">3 anggota keluarga tersimpan di perangkat ini.</text>
  
  <rect x="38" y="178" width="317" height="42" rx="12" fill="#F8FAFC" stroke="#64748B" stroke-width="2" stroke-dasharray="5 5"/>
  <text x="54" y="204" font-family="${FONT}" font-size="13.5" font-weight="700" fill="#64748B">[ Cari nama atau hubungan... ]</text>

  <!-- Person Row 1 -->
  <rect x="20" y="248" width="353" height="88" rx="18" fill="#FFFFFF" stroke="#334155" stroke-width="2"/>
  <rect x="34" y="262" width="60" height="60" rx="14" fill="#F8FAFC" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text x="64" y="297" text-anchor="middle" font-family="${FONT}" font-size="10" font-weight="900" fill="#475569">[Foto]</text>
  <text x="106" y="287" font-family="${FONT}" font-size="18" font-weight="900" fill="#0F172A">Budi Santoso</text>
  <rect x="216" y="272" width="90" height="22" rx="11" fill="#E2E8F0" stroke="#334155" stroke-width="1"/>
  <text x="261" y="287" text-anchor="middle" font-family="${FONT}" font-size="11" font-weight="900" fill="#0F172A">Anak Pertama</text>
  <text x="106" y="310" font-family="${FONT}" font-size="13" font-weight="700" fill="#64748B">Terakhir terlihat: Baru saja</text>
  <rect x="318" y="272" width="40" height="40" rx="10" fill="#F8FAFC" stroke="#334155" stroke-width="1.5"/>
  <text x="338" y="297" text-anchor="middle" font-family="${FONT}" font-size="11" font-weight="900" fill="#0F172A">[Del]</text>

  <!-- Person Row 2 -->
  <rect x="20" y="350" width="353" height="88" rx="18" fill="#FFFFFF" stroke="#334155" stroke-width="2"/>
  <rect x="34" y="364" width="60" height="60" rx="14" fill="#F8FAFC" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text x="64" y="399" text-anchor="middle" font-family="${FONT}" font-size="10" font-weight="900" fill="#475569">[Foto]</text>
  <text x="106" y="389" font-family="${FONT}" font-size="18" font-weight="900" fill="#0F172A">Rina Wulandari</text>
  <rect x="236" y="374" width="70" height="22" rx="11" fill="#E2E8F0" stroke="#334155" stroke-width="1"/>
  <text x="271" y="389" text-anchor="middle" font-family="${FONT}" font-size="11" font-weight="900" fill="#0F172A">Menantu</text>
  <text x="106" y="412" font-family="${FONT}" font-size="13" font-weight="700" fill="#64748B">Terakhir terlihat: Hari ini, 08:30</text>
  <rect x="318" y="374" width="40" height="40" rx="10" fill="#F8FAFC" stroke="#334155" stroke-width="1.5"/>
  <text x="338" y="399" text-anchor="middle" font-family="${FONT}" font-size="11" font-weight="900" fill="#0F172A">[Del]</text>

  <!-- Person Row 3 -->
  <rect x="20" y="452" width="353" height="88" rx="18" fill="#FFFFFF" stroke="#334155" stroke-width="2"/>
  <rect x="34" y="466" width="60" height="60" rx="14" fill="#F8FAFC" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text x="64" y="501" text-anchor="middle" font-family="${FONT}" font-size="10" font-weight="900" fill="#475569">[Foto]</text>
  <text x="106" y="491" font-family="${FONT}" font-size="18" font-weight="900" fill="#0F172A">Dimas Pratama</text>
  <rect x="236" y="476" width="60" height="22" rx="11" fill="#E2E8F0" stroke="#334155" stroke-width="1"/>
  <text x="266" y="491" text-anchor="middle" font-family="${FONT}" font-size="11" font-weight="900" fill="#0F172A">Cucu</text>
  <text x="106" y="514" font-family="${FONT}" font-size="13" font-weight="700" fill="#64748B">Terakhir terlihat: Kemarin, 16:45</text>
  <rect x="318" y="476" width="40" height="40" rx="10" fill="#F8FAFC" stroke="#334155" stroke-width="1.5"/>
  <text x="338" y="501" text-anchor="middle" font-family="${FONT}" font-size="11" font-weight="900" fill="#0F172A">[Del]</text>

  <!-- Clear All & Privacy Footer -->
  <rect x="20" y="560" width="353" height="50" rx="14" fill="#F8FAFC" stroke="#334155" stroke-width="2"/>
  <text x="196" y="591" text-anchor="middle" font-family="${FONT}" font-size="15" font-weight="900" fill="#0F172A">[ Hapus Seluruh Data Kerabat ]</text>

  <rect x="20" y="624" width="353" height="60" rx="14" fill="#FFFFFF" stroke="#334155" stroke-width="1.5"/>
  <text x="36" y="648" font-family="${FONT}" font-size="12" font-weight="700" fill="#334155">Penyimpanan Lokal: arsik_people (localStorage)</text>
  <text x="36" y="668" font-family="${FONT}" font-size="11.5" font-weight="400" fill="#64748B">Sesuai UU Pelindungan Data Pribadi No. 27 Tahun 2022.</text>
`, true);

// =========================================================================
// 6. HI-FI 01: SPLASH SCREEN DENGAN REAL STOCK PHOTO
// =========================================================================
const hifi01 = wrapHifiScreen('06_HIFI_Splash_Screen_Offline_Preloader', 'Hi-Fi 01: Splash Screen', 0, `
  <!-- Main Splash Container Card -->
  <rect x="20" y="64" width="353" height="696" rx="26" fill="#FFFFFF" stroke="#0F172A" stroke-opacity="0.08" stroke-width="0.5" filter="url(#shadowCard)"/>

  <!-- Academic Course Badge -->
  <rect x="44" y="86" width="305" height="28" rx="14" fill="#EBF2FA" stroke="#1D3557" stroke-opacity="0.18" stroke-width="0.5"/>
  <text x="196" y="104" text-anchor="middle" font-family="${FONT}" font-size="11" font-weight="900" letter-spacing="0.4" fill="#1D3557">II4051 REKAYASA SISTEM MULTIMEDIA · STEI ITB</text>

  <!-- Real Human Stock Photo Hero -->
  <g id="Hero_Photo_Banner">
    <g clip-path="url(#clipSplashHero)">
      <image href="${imgSplash}" x="40" y="126" width="313" height="210" preserveAspectRatio="xMidYMid slice"/>
      <!-- Soft Gradient Scrim -->
      <rect x="40" y="270" width="313" height="66" fill="#0F172A" fill-opacity="0.6"/>
      <text x="56" y="310" font-family="${FONT}" font-size="13" font-weight="900" fill="#FFFFFF">Mendampingi Lansia Mengenali Kerabat</text>
    </g>
    <rect x="40" y="126" width="313" height="210" rx="18" stroke="#0F172A" stroke-opacity="0.1" stroke-width="0.5"/>
  </g>

  <!-- App Title & Identity -->
  <g id="Brand_Info_Block">
    <rect x="176" y="356" width="40" height="40" rx="12" fill="#1D3557" filter="url(#shadowBtn)"/>
    ${ICONS.heart(184, 364, '#FFFFFF', 24)}

    <text x="196" y="422" text-anchor="middle" font-family="${FONT}" font-size="30" font-weight="900" letter-spacing="-0.5" fill="#0F172A">ARSIK</text>
    <text x="196" y="444" text-anchor="middle" font-family="${FONT}" font-size="13.5" font-weight="900" fill="#1D3557">Aplikasi Rekayasa Sistem Identifikasi Kerabat</text>
    <text x="196" y="470" text-anchor="middle" font-family="${FONT}" font-size="13.5" font-weight="400" fill="#334155">Asisten pengenal wajah keluarga secara langsung</text>
    <text x="196" y="490" text-anchor="middle" font-family="${FONT}" font-size="13.5" font-weight="400" fill="#334155">dengan tipografi kontras tinggi untuk lansia.</text>
  </g>

  <!-- Model Initialization Progress Card (SK-F02) -->
  <g id="Model_Initialization_Card">
    <rect x="40" y="522" width="313" height="100" rx="18" fill="#F8FAFC" stroke="#0F172A" stroke-opacity="0.08" stroke-width="0.5"/>
    <circle cx="60" cy="550" r="5" fill="#15803D"/>
    <text x="74" y="554" font-family="${FONT}" font-size="12.5" font-weight="900" fill="#0F172A">MEMUAT PENGENAL WAJAH LOKAL</text>
    <text x="333" y="554" text-anchor="end" font-family="${FONT}" font-size="13" font-weight="900" fill="#15803D">85%</text>
    <rect x="60" y="568" width="273" height="10" rx="5" fill="#E2E8F0"/>
    <rect x="60" y="568" width="232" height="10" rx="5" fill="#1D3557"/>
    <text x="60" y="598" font-family="${FONT}" font-size="11.5" font-weight="400" fill="#64748B">TinyFaceDetector · 68 Landmarks · 128-Dim Vector</text>
  </g>

  <!-- Privacy Assurance Banner (SK-NF03) -->
  <g id="Privacy_Card">
    <rect x="40" y="638" width="313" height="96" rx="18" fill="#F0FDF4" stroke="#15803D" stroke-opacity="0.3" stroke-width="0.5"/>
    ${ICONS.shield(56, 654, '#15803D', 22)}
    <text x="86" y="668" font-family="${FONT}" font-size="13.5" font-weight="900" fill="#14532D">100% Privasi Perangkat Lokal</text>
    <text x="56" y="694" font-family="${FONT}" font-size="12" font-weight="400" fill="#166534">Foto &amp; data biometrik disimpan aman di HP ini</text>
    <text x="56" y="712" font-family="${FONT}" font-size="12" font-weight="400" fill="#166534">sesuai UU Pelindungan Data Pribadi No. 27/2022.</text>
  </g>
`, `
  <clipPath id="clipSplashHero">
    <rect x="40" y="126" width="313" height="210" rx="18"/>
  </clipPath>
`, false);

// =========================================================================
// 7. HI-FI 02: TAB 1 — WAJAH KERABAT DIKENALI (HIJAU SOLID)
// =========================================================================
const hifi02 = wrapHifiScreen('07_HIFI_Kamera_Deteksi_Wajah_Dikenal', 'Hi-Fi 02: Wajah Dikenal', 1, `
  <!-- Camera Card -->
  <g id="Camera_Card_Viewport">
    <rect x="20" y="116" width="353" height="400" rx="22" fill="#FFFFFF" stroke="#0F172A" stroke-opacity="0.08" stroke-width="0.5" filter="url(#shadowCard)"/>
    
    <!-- Camera Header -->
    <rect x="20" y="116" width="353" height="50" rx="22" fill="#FFFFFF"/>
    <line x1="20" y1="166" x2="373" y2="166" stroke="#0F172A" stroke-opacity="0.08" stroke-width="0.5"/>
    <circle cx="42" cy="141" r="5" fill="#22C55E"/>
    <text x="56" y="146" font-family="${FONT}" font-size="13.5" font-weight="900" fill="#0F172A">Kamera Depan Aktif</text>
    
    <!-- Switch Camera Button -->
    <rect x="238" y="127" width="122" height="30" rx="10" fill="#F1F5F9" stroke="#0F172A" stroke-opacity="0.12" stroke-width="0.5"/>
    ${ICONS.switchCam(248, 133, '#0F172A', 18)}
    <text x="274" y="147" font-family="${FONT}" font-size="12" font-weight="900" fill="#0F172A">Putar Kamera</text>

    <!-- Real Viewport with Real Photo -->
    <g clip-path="url(#clipCamKnownHi)">
      <image href="${imgBudi}" x="20" y="166" width="353" height="350" preserveAspectRatio="xMidYMid slice"/>
      
      <!-- Solid Green Bounding Box (SK-F05) -->
      <rect x="96" y="200" width="200" height="200" rx="16" fill="none" stroke="#22C55E" stroke-width="4.5"/>
      
      <!-- High Contrast Label >= 20px Bold (SK-NF05) -->
      <rect x="42" y="416" width="309" height="54" rx="14" fill="#22C55E" stroke="#14532D" stroke-width="1.5" filter="url(#shadowBtn)"/>
      <text x="196" y="450" text-anchor="middle" font-family="${FONT}" font-size="21" font-weight="900" fill="#0F172A">Budi Santoso (Anak Pertama)</text>
    </g>
    <rect x="20" y="116" width="353" height="400" rx="22" stroke="#0F172A" stroke-opacity="0.12" stroke-width="0.5"/>
  </g>

  <!-- Known Identity Bottom Card -->
  <g id="Known_Identity_Summary_Card">
    <rect x="20" y="534" width="353" height="196" rx="22" fill="#F0FDF4" stroke="#15803D" stroke-opacity="0.32" stroke-width="0.5" filter="url(#shadowCard)"/>
    
    <!-- Pill Badge -->
    <rect x="38" y="552" width="148" height="26" rx="13" fill="#15803D"/>
    <text x="112" y="569" text-anchor="middle" font-family="${FONT}" font-size="11.5" font-weight="900" letter-spacing="0.5" fill="#FFFFFF">KERABAT DIKENALI</text>

    <!-- Person Row -->
    <g clip-path="url(#clipThumbBudi)">
      <image href="${imgBudi}" x="38" y="590" width="76" height="76" preserveAspectRatio="xMidYMid slice"/>
    </g>
    <rect x="38" y="590" width="76" height="76" rx="18" stroke="#15803D" stroke-opacity="0.4" stroke-width="0.5"/>

    <text x="130" y="622" font-family="${FONT}" font-size="26" font-weight="900" fill="#0F172A">Budi Santoso</text>
    <text x="130" y="650" font-family="${FONT}" font-size="18" font-weight="700" fill="#14532D">Hubungan: Anak Pertama</text>
    
    <!-- Live Seen Status -->
    <line x1="38" y1="680" x2="355" y2="680" stroke="#15803D" stroke-opacity="0.2" stroke-width="0.5"/>
    ${ICONS.clock(40, 693, '#14532D', 18)}
    <text x="66" y="707" font-family="${FONT}" font-size="13.5" font-weight="700" fill="#14532D">Terakhir terlihat di depan kamera: Baru saja</text>
  </g>
`, `
  <clipPath id="clipCamKnownHi">
    <rect x="20" y="166" width="353" height="350"/>
  </clipPath>
  <clipPath id="clipThumbBudi">
    <rect x="38" y="590" width="76" height="76" rx="18"/>
  </clipPath>
`, true);

// =========================================================================
// 8. HI-FI 03: TAB 1 — WAJAH BELUM DIKENAL & REGISTRASI SUARA
// =========================================================================
const hifi03 = wrapHifiScreen('08_HIFI_Kamera_Deteksi_Wajah_Asing_Suara', 'Hi-Fi 03: Wajah Belum Dikenal', 1, `
  <!-- Camera Card -->
  <g id="Camera_Card_Viewport">
    <rect x="20" y="116" width="353" height="340" rx="22" fill="#FFFFFF" stroke="#0F172A" stroke-opacity="0.08" stroke-width="0.5" filter="url(#shadowCard)"/>
    
    <!-- Camera Header -->
    <rect x="20" y="116" width="353" height="50" rx="22" fill="#FFFFFF"/>
    <line x1="20" y1="166" x2="373" y2="166" stroke="#0F172A" stroke-opacity="0.08" stroke-width="0.5"/>
    <circle cx="42" cy="141" r="5" fill="#22C55E"/>
    <text x="56" y="146" font-family="${FONT}" font-size="13.5" font-weight="900" fill="#0F172A">Kamera Depan Aktif</text>
    
    <rect x="238" y="127" width="122" height="30" rx="10" fill="#F1F5F9" stroke="#0F172A" stroke-opacity="0.12" stroke-width="0.5"/>
    ${ICONS.switchCam(248, 133, '#0F172A', 18)}
    <text x="274" y="147" font-family="${FONT}" font-size="12" font-weight="900" fill="#0F172A">Putar Kamera</text>

    <!-- Real Viewport with Dimas Photo -->
    <g clip-path="url(#clipCamUnknownHi)">
      <image href="${imgDimas}" x="20" y="166" width="353" height="290" preserveAspectRatio="xMidYMid slice"/>
      
      <!-- Solid Red Bounding Box (SK-F05) -->
      <rect x="108" y="186" width="176" height="176" rx="16" fill="none" stroke="#EF4444" stroke-width="4.5"/>
      
      <!-- Unknown Label Badge >= 20px Bold (SK-NF05) -->
      <rect x="96" y="376" width="200" height="50" rx="14" fill="#EF4444" stroke="#7F1D1D" stroke-width="1.5" filter="url(#shadowBtn)"/>
      <text x="196" y="408" text-anchor="middle" font-family="${FONT}" font-size="21" font-weight="900" fill="#0F172A">Tidak Dikenal</text>
    </g>
    <rect x="20" y="116" width="353" height="340" rx="22" stroke="#0F172A" stroke-opacity="0.12" stroke-width="0.5"/>
  </g>

  <!-- Auto Voice Registration Card (SK-F07 & SK-F08) -->
  <g id="Unknown_Voice_Registration_Card">
    <rect x="20" y="474" width="353" height="262" rx="22" fill="#FFF1F2" stroke="#DC2626" stroke-opacity="0.32" stroke-width="0.5" filter="url(#shadowCard)"/>
    
    <!-- Top Row: Cropped Face + Title -->
    <g clip-path="url(#clipThumbDimas)">
      <image href="${imgDimas}" x="38" y="492" width="64" height="64" preserveAspectRatio="xMidYMid slice"/>
    </g>
    <rect x="38" y="492" width="64" height="64" rx="16" stroke="#DC2626" stroke-opacity="0.4" stroke-width="0.5"/>

    <rect x="114" y="492" width="118" height="22" rx="11" fill="#DC2626"/>
    <text x="173" y="507" text-anchor="middle" font-family="${FONT}" font-size="10.5" font-weight="900" letter-spacing="0.5" fill="#FFFFFF">TIDAK DIKENAL</text>
    <text x="114" y="533" font-family="${FONT}" font-size="19" font-weight="900" fill="#0F172A">Wajah Belum Terdaftar</text>
    <text x="114" y="552" font-family="${FONT}" font-size="12.5" font-weight="700" fill="#7F1D1D">Ucapkan: &ldquo;Ini [Nama], [Hubungan] saya&rdquo;</text>

    <!-- Voice Listener Status Bar -->
    <rect x="38" y="570" width="317" height="68" rx="14" fill="#FFFFFF" stroke="#DC2626" stroke-opacity="0.3" stroke-width="0.5"/>
    ${ICONS.mic(50, 582, '#DC2626', 22)}
    <text x="80" y="596" font-family="${FONT}" font-size="13.5" font-weight="900" fill="#991B1B">Mendengarkan suara pendamping (id-ID)...</text>
    <text x="80" y="618" font-family="${FONT}" font-size="14" font-weight="900" fill="#1D3557">Terbaca: &ldquo;Ini Dimas Pratama, cucu saya&rdquo;</text>

    <!-- CTA Buttons (Fitts's Law >= 52px) -->
    <rect x="38" y="652" width="205" height="54" rx="14" fill="#1D3557" filter="url(#shadowBtn)"/>
    ${ICONS.userPlus(52, 668, '#FFFFFF', 20)}
    <text x="148" y="685" text-anchor="middle" font-family="${FONT}" font-size="15.5" font-weight="900" fill="#FFFFFF">Isi Nama Manual</text>

    <rect x="253" y="652" width="102" height="54" rx="14" fill="#FFFFFF" stroke="#991B1B" stroke-opacity="0.35" stroke-width="0.5"/>
    <text x="304" y="685" text-anchor="middle" font-family="${FONT}" font-size="15" font-weight="900" fill="#991B1B">Abaikan</text>
  </g>
`, `
  <clipPath id="clipCamUnknownHi">
    <rect x="20" y="166" width="353" height="290"/>
  </clipPath>
  <clipPath id="clipThumbDimas">
    <rect x="38" y="492" width="64" height="64" rx="16"/>
  </clipPath>
`, true);

// =========================================================================
// 9. HI-FI 04: MODAL FORM PENDAFTARAN CADANGAN
// =========================================================================
const hifi04 = wrapHifiScreen('09_HIFI_Modal_Form_Manual_Cadangan', 'Hi-Fi 04: Modal Form Manual', 1, `
  <!-- Dimmed Scrim Backdrop -->
  <rect x="0" y="104" width="393" height="652" fill="#0F172A" fill-opacity="0.55"/>

  <!-- Bottom Sheet Surface -->
  <g id="Modal_Registration_Sheet">
    <rect x="16" y="156" width="361" height="570" rx="26" fill="#FFFFFF" stroke="#0F172A" stroke-opacity="0.12" stroke-width="0.5" filter="url(#shadowCard)"/>

    <!-- Header Modal -->
    <rect x="36" y="180" width="142" height="24" rx="12" fill="#FEF2F2" stroke="#DC2626" stroke-opacity="0.3" stroke-width="0.5"/>
    <text x="107" y="196" text-anchor="middle" font-family="${FONT}" font-size="11" font-weight="900" fill="#DC2626">WAJAH BELUM DIKENAL</text>
    <text x="36" y="228" font-family="${FONT}" font-size="22" font-weight="900" fill="#0F172A">Daftarkan Kerabat Baru</text>
    
    <rect x="323" y="180" width="38" height="38" rx="12" fill="#F1F5F9" stroke="#0F172A" stroke-opacity="0.1" stroke-width="0.5"/>
    ${ICONS.close(333, 190, '#0F172A', 18)}

    <!-- Cropped Face Preview Box -->
    <rect x="36" y="246" width="321" height="92" rx="16" fill="#F8FAFC" stroke="#0F172A" stroke-opacity="0.08" stroke-width="0.5"/>
    <g clip-path="url(#clipModalCropHi)">
      <image href="${imgDimas}" x="48" y="258" width="68" height="68" preserveAspectRatio="xMidYMid slice"/>
    </g>
    <rect x="48" y="258" width="68" height="68" rx="14" stroke="#0F172A" stroke-opacity="0.16" stroke-width="0.5"/>

    ${ICONS.mic(130, 268, '#DC2626', 18)}
    <text x="154" y="282" font-family="${FONT}" font-size="13.5" font-weight="900" fill="#DC2626">Mikrofon Aktif (id-ID)</text>
    <text x="130" y="304" font-family="${FONT}" font-size="12.5" font-weight="400" fill="#334155">Bicara langsung atau lengkapi kolom</text>
    <text x="130" y="322" font-family="${FONT}" font-size="12.5" font-weight="400" fill="#334155">isian di bawah dengan jelas.</text>

    <!-- Field 1: Nama -->
    <text x="36" y="366" font-family="${FONT}" font-size="14.5" font-weight="900" fill="#0F172A">Nama Panggilan / Lengkap</text>
    <rect x="36" y="376" width="321" height="52" rx="14" fill="#FFFFFF" stroke="#1D3557" stroke-width="1.5"/>
    <text x="52" y="408" font-family="${FONT}" font-size="17" font-weight="700" fill="#0F172A">Dimas Pratama</text>

    <!-- Field 2: Hubungan -->
    <text x="36" y="454" font-family="${FONT}" font-size="14.5" font-weight="900" fill="#0F172A">Hubungan Keluarga</text>
    <rect x="36" y="464" width="321" height="52" rx="14" fill="#FFFFFF" stroke="#0F172A" stroke-opacity="0.2" stroke-width="0.5"/>
    <text x="52" y="496" font-family="${FONT}" font-size="17" font-weight="700" fill="#0F172A">Cucu</text>

    <!-- Quick Chips (Hick's Law) -->
    <rect x="36" y="528" width="62" height="34" rx="17" fill="#F1F5F9" stroke="#0F172A" stroke-opacity="0.12" stroke-width="0.5"/>
    <text x="67" y="550" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="700" fill="#0F172A">Anak</text>
    
    <rect x="106" y="528" width="62" height="34" rx="17" fill="#1D3557" filter="url(#shadowBtn)"/>
    <text x="137" y="550" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="900" fill="#FFFFFF">Cucu</text>
    
    <rect x="176" y="528" width="80" height="34" rx="17" fill="#F1F5F9" stroke="#0F172A" stroke-opacity="0.12" stroke-width="0.5"/>
    <text x="216" y="550" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="700" fill="#0F172A">Menantu</text>
    
    <rect x="264" y="528" width="84" height="34" rx="17" fill="#F1F5F9" stroke="#0F172A" stroke-opacity="0.12" stroke-width="0.5"/>
    <text x="306" y="550" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="700" fill="#0F172A">Pasangan</text>

    <!-- Bottom Action Buttons -->
    <rect x="36" y="642" width="115" height="54" rx="14" fill="#F1F5F9" stroke="#0F172A" stroke-opacity="0.16" stroke-width="0.5"/>
    <text x="93" y="675" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="900" fill="#0F172A">Batal</text>

    <rect x="161" y="642" width="196" height="54" rx="14" fill="#15803D" filter="url(#shadowBtn)"/>
    <text x="259" y="675" text-anchor="middle" font-family="${FONT}" font-size="16.5" font-weight="900" fill="#FFFFFF">Simpan Profil</text>
  </g>
`, `
  <clipPath id="clipModalCropHi">
    <rect x="48" y="258" width="68" height="68" rx="14"/>
  </clipPath>
`, true);

// =========================================================================
// 10. HI-FI 05: TAB 2 — DAFTAR KERABAT (CAREGIVER DIRECTORY)
// =========================================================================
const hifi05 = wrapHifiScreen('10_HIFI_Daftar_Kerabat_Caregiver', 'Hi-Fi 05: Daftar Kerabat', 2, `
  <!-- Directory Header Card with Vector Search Box -->
  <g id="Header_Directory_Card">
    <rect x="20" y="116" width="353" height="124" rx="22" fill="#FFFFFF" stroke="#0F172A" stroke-opacity="0.08" stroke-width="0.5" filter="url(#shadowCard)"/>
    
    <text x="38" y="146" font-family="${FONT}" font-size="19" font-weight="900" fill="#0F172A">Daftar Kerabat Terdaftar</text>
    <text x="38" y="166" font-family="${FONT}" font-size="13" font-weight="700" fill="#64748B">3 anggota keluarga tersimpan di perangkat ini.</text>
    
    <!-- Search Bar with Vector Search Icon -->
    <rect x="38" y="180" width="317" height="44" rx="14" fill="#F8FAFC" stroke="#0F172A" stroke-opacity="0.12" stroke-width="0.5"/>
    ${ICONS.search(50, 193, '#64748B', 18)}
    <text x="76" y="207" font-family="${FONT}" font-size="13.5" font-weight="700" fill="#64748B">Cari nama atau hubungan keluarga...</text>
  </g>

  <!-- Profile Card 1: Budi Santoso -->
  <g id="Card_Person_Budi">
    <rect x="20" y="254" width="353" height="92" rx="20" fill="#FFFFFF" stroke="#0F172A" stroke-opacity="0.08" stroke-width="0.5" filter="url(#shadowCard)"/>
    
    <g clip-path="url(#clipListBudi)">
      <image href="${imgBudi}" x="34" y="268" width="64" height="64" preserveAspectRatio="xMidYMid slice"/>
    </g>
    <rect x="34" y="268" width="64" height="64" rx="16" stroke="#15803D" stroke-opacity="0.35" stroke-width="0.5"/>

    <text x="110" y="293" font-family="${FONT}" font-size="18.5" font-weight="900" fill="#0F172A">Budi Santoso</text>
    <rect x="226" y="278" width="86" height="22" rx="11" fill="#DCFCE7" stroke="#15803D" stroke-opacity="0.3" stroke-width="0.5"/>
    <text x="269" y="293" text-anchor="middle" font-family="${FONT}" font-size="11" font-weight="900" fill="#14532D">Anak Pertama</text>

    ${ICONS.clock(110, 305, '#64748B', 15)}
    <text x="130" y="317" font-family="${FONT}" font-size="12.5" font-weight="700" fill="#64748B">Terakhir terlihat: Baru saja</text>

    <!-- Delete Button -->
    <rect x="320" y="280" width="40" height="40" rx="12" fill="#FEF2F2" stroke="#DC2626" stroke-opacity="0.25" stroke-width="0.5"/>
    ${ICONS.trash(331, 291, '#DC2626', 18)}
  </g>

  <!-- Profile Card 2: Rina Wulandari -->
  <g id="Card_Person_Rina">
    <rect x="20" y="360" width="353" height="92" rx="20" fill="#FFFFFF" stroke="#0F172A" stroke-opacity="0.08" stroke-width="0.5" filter="url(#shadowCard)"/>
    
    <g clip-path="url(#clipListRina)">
      <image href="${imgRina}" x="34" y="374" width="64" height="64" preserveAspectRatio="xMidYMid slice"/>
    </g>
    <rect x="34" y="374" width="64" height="64" rx="16" stroke="#15803D" stroke-opacity="0.35" stroke-width="0.5"/>

    <text x="110" y="399" font-family="${FONT}" font-size="18.5" font-weight="900" fill="#0F172A">Rina Wulandari</text>
    <rect x="240" y="384" width="72" height="22" rx="11" fill="#DCFCE7" stroke="#15803D" stroke-opacity="0.3" stroke-width="0.5"/>
    <text x="276" y="399" text-anchor="middle" font-family="${FONT}" font-size="11" font-weight="900" fill="#14532D">Menantu</text>

    ${ICONS.clock(110, 411, '#64748B', 15)}
    <text x="130" y="423" font-family="${FONT}" font-size="12.5" font-weight="700" fill="#64748B">Terakhir terlihat: Hari ini, 08:30</text>

    <!-- Delete Button -->
    <rect x="320" y="386" width="40" height="40" rx="12" fill="#FEF2F2" stroke="#DC2626" stroke-opacity="0.25" stroke-width="0.5"/>
    ${ICONS.trash(331, 397, '#DC2626', 18)}
  </g>

  <!-- Profile Card 3: Dimas Pratama -->
  <g id="Card_Person_Dimas">
    <rect x="20" y="466" width="353" height="92" rx="20" fill="#FFFFFF" stroke="#0F172A" stroke-opacity="0.08" stroke-width="0.5" filter="url(#shadowCard)"/>
    
    <g clip-path="url(#clipListDimas)">
      <image href="${imgDimas}" x="34" y="480" width="64" height="64" preserveAspectRatio="xMidYMid slice"/>
    </g>
    <rect x="34" y="480" width="64" height="64" rx="16" stroke="#15803D" stroke-opacity="0.35" stroke-width="0.5"/>

    <text x="110" y="505" font-family="${FONT}" font-size="18.5" font-weight="900" fill="#0F172A">Dimas Pratama</text>
    <rect x="246" y="490" width="66" height="22" rx="11" fill="#DCFCE7" stroke="#15803D" stroke-opacity="0.3" stroke-width="0.5"/>
    <text x="279" y="505" text-anchor="middle" font-family="${FONT}" font-size="11" font-weight="900" fill="#14532D">Cucu</text>

    ${ICONS.clock(110, 517, '#64748B', 15)}
    <text x="130" y="529" font-family="${FONT}" font-size="12.5" font-weight="700" fill="#64748B">Terakhir terlihat: Kemarin, 16:45</text>

    <!-- Delete Button -->
    <rect x="320" y="492" width="40" height="40" rx="12" fill="#FEF2F2" stroke="#DC2626" stroke-opacity="0.25" stroke-width="0.5"/>
    ${ICONS.trash(331, 503, '#DC2626', 18)}
  </g>

  <!-- Clear All Profiles Button -->
  <g id="Btn_Clear_All">
    <rect x="20" y="574" width="353" height="52" rx="14" fill="#FEF2F2" stroke="#DC2626" stroke-opacity="0.3" stroke-width="0.5"/>
    ${ICONS.trash(96, 591, '#DC2626', 18)}
    <text x="122" y="606" font-family="${FONT}" font-size="15" font-weight="900" fill="#DC2626">Hapus Seluruh Data Kerabat</text>
  </g>

  <!-- Local Storage Privacy Card (SK-NF03) -->
  <g id="Local_Storage_Banner">
    <rect x="20" y="640" width="353" height="92" rx="16" fill="#FFFFFF" stroke="#0F172A" stroke-opacity="0.08" stroke-width="0.5" filter="url(#shadowCard)"/>
    ${ICONS.shield(34, 654, '#15803D', 20)}
    <text x="62" y="668" font-family="${FONT}" font-size="13" font-weight="900" fill="#0F172A">Penyimpanan Lokal: arsik_people</text>
    <text x="34" y="692" font-family="${FONT}" font-size="12" font-weight="400" fill="#64748B">Vektor wajah 128-dimensi &amp; foto crop disimpan lokal di browser HP</text>
    <text x="34" y="710" font-family="${FONT}" font-size="12" font-weight="400" fill="#64748B">sesuai UU Pelindungan Data Pribadi No. 27 Tahun 2022.</text>
  </g>
`, `
  <clipPath id="clipListBudi">
    <rect x="34" y="268" width="64" height="64" rx="16"/>
  </clipPath>
  <clipPath id="clipListRina">
    <rect x="34" y="374" width="64" height="64" rx="16"/>
  </clipPath>
  <clipPath id="clipListDimas">
    <rect x="34" y="480" width="64" height="64" rx="16"/>
  </clipPath>
`, true);

const frames = [
  ['01_LOFI_Splash_Screen_Offline_Preload.svg', lofi01],
  ['02_LOFI_Kamera_Deteksi_Wajah_Dikenal.svg', lofi02],
  ['03_LOFI_Kamera_Deteksi_Wajah_Asing_Suara.svg', lofi03],
  ['04_LOFI_Modal_Form_Manual_Cadangan.svg', lofi04],
  ['05_LOFI_Daftar_Kerabat_Caregiver.svg', lofi05],
  ['06_HIFI_Splash_Screen_Offline_Preloader.svg', hifi01],
  ['07_HIFI_Kamera_Deteksi_Wajah_Dikenal.svg', hifi02],
  ['08_HIFI_Kamera_Deteksi_Wajah_Asing_Suara.svg', hifi03],
  ['09_HIFI_Modal_Form_Manual_Cadangan.svg', hifi04],
  ['10_HIFI_Daftar_Kerabat_Caregiver.svg', hifi05],
];

for (const [name, content] of frames) {
  const fullPath = path.join(outDir, name);
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Saved', name, '(' + Buffer.byteLength(content) + ' bytes)');
}
