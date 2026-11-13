# Panduan AI Assistant (AGENTS.md) - Proyek ARSIK

Dokumen ini adalah instruksi panduan tunggal (*single source of truth*) bagi AI Assistant (seperti Antigravity, Cursor, Claude, GitHub Copilot) yang bekerja pada repositori **ARSIK**. Setiap kali Anda (AI) membaca repositori ini, Anda **WAJIB** mengikuti semua prinsip, batasan arsitektur, dan aturan aksesibilitas di bawah ini tanpa pengecualian.

---

## 1. Ringkasan Proyek

* **Nama Proyek:** ARSIK (*Aplikasi Rekayasa Sistem Identifikasi Kerabat* / *Dementia Patient Assistant*)
* **Konteks Akademik:** Tugas Proyek Kelompok (TPdK) Mata Kuliah II4051 Rekayasa Sistem Multimedia, Program Studi Sistem dan Teknologi Informasi, STEI - Institut Teknologi Bandung (2026).
* **Tujuan Utama:** Membantu pasien demensia yang mengalami gangguan pengenalan wajah (*prosopagnosia*) agar dapat mengenali kerabat/keluarga di sekitarnya secara waktu nyata (*real-time*), serta membantu pendamping (*caregiver*) mendaftarkan dan mengelola data kerabat dengan mudah.
* **Teknologi Utama:** React 19, Vite, `face-api.js` (TensorFlow.js / WebGL), Web Speech API (`webkitSpeechRecognition`), Browser `localStorage`.

---

## 2. Batasan Arsitektur Kritis (NON-NEGOTIABLE)

1. **100% Client-Side & Local-First (UU PDP No. 27 Tahun 2022 / SK-NF03):**
   * **DILARANG KERAS** membuat peladen backend eksternal (Node/Express, Python/Flask, Supabase, Firebase, dsb.) untuk menyimpan data wajah atau profil.
   * Seluruh ekstraksi fitur wajah, perbandingan jarak Euklides, dan penyimpanan data **HARUS** berada di dalam peramban (*client-side*).
   * Data disimpan pada `localStorage` peramban dengan serialisasi JSON.
2. **Hanya Dua Tab Navigasi (SK-NF06):**
   * Antarmuka aplikasi **HANYA** boleh memiliki 2 tab utama:
     1. **Tab 1: Deteksi Wajah** (Layar utama untuk Pasien Demensia).
     2. **Tab 2: Daftar Kerabat / Kelola Profil** (Layar untuk Pendamping / Caregiver).
   * Jangan menambahkan menu samping (*sidebar*) yang rumit, navigasi bersarang, atau halaman login terpisah. Tidak ada "Caregiver Portal" terpisah di backend.
3. **Tanpa Perangkat Keras Tambahan (SK-NF08):**
   * Aplikasi hanya mengandalkan webcam/kamera dan mikrofon bawaan laptop atau smartphone melalui standar WebRTC `navigator.mediaDevices.getUserMedia`.

---

## 3. Aturan Desain Antarmuka untuk Lansia & Demensia (MANDATORI)

Pasien demensia memiliki penurunan kognitif (*cognitive decline*), keterbatasan persepsi visual, dan mudah mengalami kebingungan/agitasi (*cognitive overload*). Oleh karena itu, aturan desain berikut wajib dipatuhi:

1. **Prinsip Bebas Distraksi (*Distraction-Free*):**
   * Pada tab **Deteksi Wajah**, antarmuka harus sebersih mungkin. Hanya fokus menampilkan umpan video dan kotak deteksi.
   * Hindari tombol-tombol teknis, log status konsol di layar, atau efek animasi visual yang berkelap-kelip.
2. **Tipografi & Kontras Ekstrem (SK-NF05 & WCAG 2.2):**
   * Ukuran font label identitas **minimal 20px dan TEBAL (BOLD)**.
   * **Wajah Dikenal:** Kotak pembatas (bounding box) berwarna hijau solid (misal: `#22c55e`), label teks hitam tegas di atas latar belakang hijau kontras tinggi.
   * **Wajah Belum Dikenal:** Kotak pembatas berwarna merah solid (misal: `#ef4444`), label teks hitam tegas di atas latar belakang merah dengan tulisan `"Tidak Dikenal"`.
3. **Bahasa Indonesia Baku & Ramah (SK-F08):**
   * Seluruh label antarmuka, pesan bantuan, dan umpan balik suara harus menggunakan **Bahasa Indonesia**.
   * Jangan mencampur istilah bahasa Inggris teknis seperti "Bounding Box", "Descriptor", atau "Idle State" di hadapan pasien.
4. **Target Sentuh Besar (*Touch Target*):**
   * Semua tombol navigasi tab dan tombol aksi harus memiliki ukuran minimal **48px × 48px** dengan padding lega untuk memudahkan lansia atau caregiver dengan tremor/penurunan motorik halus.

---

## 4. Alur & Logika Kerja Multimedia

### A. Pengenalan Wajah (Face Recognition)
* **Model yang Digunakan (SK-F02):**
  * `tinyFaceDetector` (inferensi cepat dan ringan).
  * `faceLandmark68Net` (penyelarasan 68 titik anatomi wajah).
  * `faceRecognitionNet` (ekstraksi vektor deskriptor 128 dimensi).
* **Frekuensi Deteksi (SK-F03 & SK-NF01):** Interval pemindaian wajah dijalankan berkala setiap **300 milidetik** ($\pm 3$ kali per detik) agar peramban tetap responsif tanpa *frame drop*.
* **Formula Kemiripan (SK-F04):**
  * Hitung *Euclidean Distance* antara deskriptor wajah yang terdeteksi dengan semua deskriptor yang tersimpan di `localStorage`.
  * **Ambang Batas (*Threshold*):** Wajah dianggap COCOK jika jarak terkecil $< 0.6$.
* **Pembaruan Waktu Terlihat (SK-F06):** Saat wajah cocok, perbarui nilai `lastSeen` profil tersebut dengan timestamp ISO terkini.

### B. Pendaftaran Suara & Form Cadangan (Speech Registration)
* **Pemicu Otomatis (SK-F07):** Ketika wajah berstatus "Tidak Dikenal" terdeteksi stabil di depan kamera:
  1. Sistem memotong (*crop*) kanvas area wajah tersebut sebagai gambar JPEG (data URL).
  2. Simpan sementara deskriptor 128 dimensi tersebut sebagai `pendingFace`.
  3. Aktifkan mikrofon secara otomatis menggunakan Web Speech API (`id-ID`).
* **Pola Kalimat Suara (SK-F08):** Sistem mengenali ucapan bahasa Indonesia dengan pola:
  * `"ini [nama], [relasi] saya"` (contoh: *"ini Dimas, cucu saya"*)
  * `"kenalkan [nama], [relasi] saya"`
  * `"namanya [nama], [relasi] saya"`
  * Ekstrak variabel `[nama]` dan `[relasi]`, lalu simpan otomatis ke profil baru.
* **Form Isian Manual Cadangan (SK-F09):** Jika browser tidak mendukung Web Speech API, ruangan terlalu bising, atau mik gagal mengenali ucapan, sistem wajib menyediakan modal/form isian manual yang simpel (input Nama dan Relasi).

---

## 5. Struktur Data Profil (`localStorage`)

Kunci penyimpanan di `localStorage`: `arsik_people`
Format data berupa JSON Array of Objects:

```typescript
interface PersonProfile {
  id: string;              // UUID unik atau timestamp string
  name: string;            // Nama kerabat (misal: "Dimas")
  relation: string;        // Hubungan keluarga (misal: "Cucu")
  descriptor: number[];    // Float32Array yang diserialisasi menjadi array numerik 128 angka
  photo: string;           // Potongan foto wajah dalam format base64 JPEG
  createdAt: string;       // Timestamp ISO tanggal pertama kali didaftarkan
  lastSeen: string;        // Timestamp ISO waktu terakhir terdeteksi di kamera
}
```

---

## 6. Petunjuk Implementasi Komponen React

1. **`src/components/FaceRecognition.jsx` (Tab 1):**
   * Mengatur stream video kamera (`getUserMedia` resolusi ideal $1280 \times 720$).
   * Menggambar overlay canvas sinkron di atas video.
   * Mengelola state deteksi, auto-crop foto, integrasi mikrofon Web Speech API, dan modal pendaftaran.
2. **`src/components/PeopleList.jsx` (Tab 2 - Caregiver):**
   * Menampilkan kartu profil kerabat: thumbnail foto hasil crop, nama tebal, relasi, tanggal dibuat, dan status `lastSeen` yang mudah dibaca (misal: *"Hari ini, 14:20"* atau *"2 hari yang lalu"*).
   * Fitur hapus profil individual atau hapus seluruh data dengan **dialog konfirmasi wajib** (mencegah ketidaksengajaan).
3. **`src/utils/faceStorage.js`:**
   * Fungsi helper pembantu: `getPeople()`, `savePerson(person)`, `deletePerson(id)`, `clearAllPeople()`, `updateLastSeen(id)`.
4. **`src/utils/speechRecognition.js`:**
   * Wrapper `webkitSpeechRecognition` dengan bahasa `id-ID`, filter regex kalimat pengenalan, dan callback status (mendengarkan, sukses, gagal).

---

## 7. Hal yang Harus Dihindari (Anti-Patterns)
* ❌ **JANGAN** membuat antarmuka berbahasa Inggris untuk pasien lansia.
* ❌ **JANGAN** menggunakan font tipis, kecil ($< 16\text{px}$), atau kontras rendah (seperti abu-abu di atas putih).
* ❌ **JANGAN** melakukan fetch ke API server luar untuk data biometrik/wajah.
* ❌ **JANGAN** menjalankan inferensi deteksi wajah pada setiap frame animasi (`requestAnimationFrame` tanpa throttle), karena akan membuat laptop/smartphone mengalami *overheating* dan patah-patah. Gunakan interval $\approx 300\text{ms}$.
