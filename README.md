# 🧠 ARSIK (Aplikasi Rekayasa Sistem Identifikasi Kerabat)
> **Dementia Patient Assistant** — Asisten Memori Multimedia Berbasis Web untuk Pasien Demensia dan Pendamping (*Caregiver*).  
> *Tugas Proyek Kelompok (TPdK) II4051 Rekayasa Sistem Multimedia — Program Studi Sistem dan Teknologi Informasi, STEI Institut Teknologi Bandung (2026).*

---

## 📌 Ringkasan Singkat
ARSIK adalah aplikasi web *local-first* yang dirancang khusus untuk membantu penderita demensia mengatasi gejala **prosopagnosia** (ketidakmampuan mengenali wajah keluarga/kerabat). 

Sistem ini memadukan 3 modalitas multimedia secara simultan:
1. **Video (WebRTC MediaDevices):** Menangkap wajah secara waktu nyata (*real-time*) melalui kamera webcam laptop atau smartphone.
2. **Audio (Web Speech API):** Mendaftarkan identitas orang baru secara otomatis melalui ucapan suara pendamping (*"Ini [Nama], [Relasi] saya"*).
3. **Grafis & Teks (Accessible Canvas Overlay):** Menampilkan label nama dan hubungan keluarga dengan tipografi besar tebal ($\ge 20\text{px}$) dan warna kontras tinggi (WCAG 2.2) yang ramah bagi persepsi visual lansia.

---

## 🎨 Desain Antarmuka Figma (Lo-Fi & Hi-Fi)

Desain antarmuka ARSIK dirancang dengan standar aksesibilitas lansia (*elderly-friendly*, WCAG 2.2, touch target $\ge 48\times 48\text{px}$, tanpa animasi berkedip).

* **Figma File:** [TPDK ARSIK — Mobile UI Design (Lo-Fi & Hi-Fi)](https://www.figma.com/design/E5gEfiF8KKEJeVsMa1J1Sb)
* **Aset Berkas SVG Asli:** Tersedia di direktori [`design_assets/figma_frames/`](design_assets/figma_frames/) berisi 10 frame mobile (5 Lo-Fi & 5 Hi-Fi):
  1. `01_LOFI_Splash_Screen_Offline_Preload.svg` & `06_HIFI_Splash_Screen_Offline_Preloader.svg`
  2. `02_LOFI_Kamera_Deteksi_Wajah_Dikenal.svg` & `07_HIFI_Kamera_Deteksi_Wajah_Dikenal.svg`
  3. `03_LOFI_Kamera_Deteksi_Wajah_Asing_Suara.svg` & `08_HIFI_Kamera_Deteksi_Wajah_Asing_Suara.svg`
  4. `04_LOFI_Modal_Form_Manual_Cadangan.svg` & `09_HIFI_Modal_Form_Manual_Cadangan.svg`
  5. `05_LOFI_Daftar_Kerabat_Caregiver.svg` & `10_HIFI_Daftar_Kerabat_Caregiver.svg`

---

## 📚 Dokumentasi Lengkap Proyek

Untuk memahami seluruh spesifikasi, rancangan arsitektur, dan panduan AI, silakan baca berkas berikut:

* [**`AGENTS.md`**](AGENTS.md) : **Panduan Utama untuk AI Assistant & Pengembang** (Aturan arsitektur 100% *local-first*, batasan 2 tab navigasi, pedoman aksesibilitas lansia WCAG 2.2, dan *anti-patterns*).
* [**`docs/SPECIFICATIONS.md`**](docs/SPECIFICATIONS.md) : **Spesifikasi Lengkap Kebutuhan Sistem** (Latar belakang, persona Ibu S & Rina, matriks keputusan solusi, kebutuhan fungsional SK-F01–F12, non-fungsional SK-NF01–NF08, serta matriks keterlacakan).
* [**`docs/ARCHITECTURE.md`**](docs/ARCHITECTURE.md) : **Arsitektur Teknis & Alur Data** (Diagram alir Mermaid, subsistem `face-api.js`, regex parser Web Speech API Bahasa Indonesia, skema `localStorage`, dan sistem desain UI).

---

## 🚀 Memulai Proyek (Quick Start)

### 1. Prasyarat
* Node.js versi 18 atau lebih baru.
* Peramban modern berbasis Chromium (Google Chrome atau Microsoft Edge direkomendasikan untuk dukungan penuh Web Speech API).
* Kamera dan mikrofon aktif pada laptop atau smartphone.

### 2. Instalasi & Menjalankan Aplikasi
```bash
# Clone atau buka direktori proyek
git clone https://github.com/Daghif/ARSIK-TPDK.git
cd ARSIK-TPDK

# Pasang dependensi
npm install

# Unduh model bobot face-api.js (jika belum ada di folder public/models)
npm run download-models

# Jalankan server pengembangan lokal (Mendukung HTTPS untuk HP)
npm run dev
```

### 3. Akses dari Smartphone (Melalui Wi-Fi / LAN)
Aplikasi mendukung pengujian langsung pada smartphone melalui jaringan Wi-Fi lokal:
1. Pastikan laptop dan HP terhubung pada **jaringan Wi-Fi yang sama**.
2. Vite akan menampilkan alamat HTTPS lokal, misalnya: `https://192.168.18.92:5173`.
3. Buka alamat tersebut di Google Chrome pada HP Anda.
4. **Catatan Penting HTTPS Mobile:** Karena Vite menggunakan sertifikat pengembangan lokal (*self-signed*), Chrome HP akan menampilkan layar *"Koneksi Anda tidak pribadi"*. Tap **Lanjutan (Advanced)** $\rightarrow$ tap **Lanjutkan ke 192.168.x.x (tidak aman)**. Setelah itu izin kamera WebRTC akan langsung aktif.
5. Jika kamera terkendala pada peramban tertentu, tersedia tombol cadangan **"Ambil Foto dari Kamera HP"** untuk memotret kerabat secara langsung.

---

## 🗂️ Struktur Direktori Proyek

```
ARSIK-TPDK/
├── design_assets/
│   ├── figma_frames/         # 10 Frame SVG Lo-Fi & Hi-Fi siap pakai
│   └── build-arsik-figma-frames.cjs
├── docs/
│   ├── ARCHITECTURE.md       # Diagram arsitektur, alur data & regex
│   └── SPECIFICATIONS.md     # Spesifikasi kebutuhan SK-F01 s.d. SK-NF08
├── public/
│   ├── images/               # Aset foto keluarga & splash screen
│   ├── models/               # Model bobot face-api.js (TinyFace, Landmark, Recognition)
│   └── manifest.json         # Konfigurasi PWA mobile
├── src/
│   ├── components/
│   │   ├── FaceRecognition.jsx / .css  # Tab 1: Deteksi Kamera & Input Suara
│   │   ├── PeopleList.jsx / .css       # Tab 2: Direktori Kerabat (Hapus 1 / Hapus Semua)
│   │   ├── RegistrationModal.jsx / .css# Modal Form Cadangan Kerabat Baru
│   │   ├── SplashScreen.jsx / .css     # Splash Screen Preload Model Offline
│   │   └── Icons.jsx                   # Ikon SVG Accessible ramah lansia
│   ├── utils/
│   │   ├── faceStorage.js        # Utilitas LocalStorage (UUID, Auto-repair, Deduplikasi)
│   │   └── speechRecognition.js  # Utilitas Web Speech API Bahasa Indonesia
│   ├── App.jsx / .css            # Cangkang Mobile 2-Tab (Fitts's Law)
│   └── index.css                 # Sistem Desain Token Kontras Tinggi
├── AGENTS.md                 # Single source of truth aturan AI Assistant
├── download-models.js        # Skrip pengunduh model face-api.js otomatis
├── vite.config.js            # Konfigurasi Vite + SSL + Host LAN
└── package.json
```

---

## 🔒 Privasi Data (100% Local-First)
Sesuai amanat **UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (SK-NF03)**, seluruh data biometrik wajah (vektor 128 dimensi) dan profil kerabat disimpan secara lokal di dalam memori peramban pengguna (`localStorage` kunci `arsik_people`). Aplikasi **tidak pernah mengirimkan foto maupun deskriptor wajah ke server luar mana pun**.
