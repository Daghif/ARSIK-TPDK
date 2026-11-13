# SPESIFIKASI DAN KEBUTUHAN SISTEM: ARSIK
**Aplikasi Rekayasa Sistem Identifikasi Kerabat (Dementia Patient Assistant)**

Dokumen ini disusun berdasarkan naskah laporan *Tugas Proyek dalam Kelompok (TPdK) Mata Kuliah II4051 Rekayasa Sistem Multimedia*, Program Studi Sistem dan Teknologi Informasi, STEI ITB (2026).

---

## 1. Latar Belakang & Perumusan Masalah

### 1.1 Permasalahan Klinis
Demensia merupakan sindrom penurunan fungsi kognitif yang memengaruhi daya ingat, orientasi, pemahaman, dan penilaian. Salah satu manifestasi klinis yang paling menimbulkan distres psikologis berat adalah **prosopagnosia** (ketidakmampuan mengenali wajah orang yang dikenal, termasuk anak, pasangan, atau cucu). Penderita sering mengalami kecemasan, rasa malu, frustrasi, hingga isolasi sosial.

### 1.2 Masalah Aksesibilitas Solusi
Banyak solusi teknologi asistif yang ada memerlukan perangkat keras khusus (*smart glasses*) dengan harga sangat mahal, sulit diakses di Indonesia, serta membebani lansia saat memakainya di kepala. Selain itu, solusi umum berbasis ponsel sering kali memproses dan mengunggah foto wajah ke server *cloud*, yang berisiko melanggar privasi data biometrik pasien (Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi).

---

## 2. Analisis Pemangku Kepentingan & Persona

### 2.1 Pemangku Kepentingan (Stakeholders)
| Pemangku Kepentingan | Peran dalam Sistem | Kepentingan Utama |
| :--- | :--- | :--- |
| **Pasien Demensia** | Pengguna Akhir (*End-User* / Penonton Layar) | Mengenali kerabat di sekitarnya secara pasif tanpa harus mengoperasikan kontrol aplikasi yang rumit. |
| **Pendamping / Caregiver / Keluarga** | Pengguna Pengelola (*Local Operator*) | Mendaftarkan dan mengelola profil kerabat dengan cepat, mudah (lewat suara/teks), serta memastikan foto keluarga tetap aman secara lokal. |
| **Kerabat / Tamu** | Subjek Data Biometrik | Wajah dan data identitasnya tidak disebarkan ke peladen publik (*cloud*). |

### 2.2 Persona dan Skenario Penggunaan
* **Persona 1: Pasien (Ibu S, 72 tahun)**
  * *Kondisi:* Demensia tahap awal–menengah. Sering lupa wajah cucu atau keponakan yang jarang datang.
  * *Karakteristik:* Mengalami penurunan ketajaman visual, mudah bingung jika layar penuh teks/tombol, tidak mahir menggunakan gadget.
* **Persona 2: Pendamping (Rina, 40 tahun)**
  * *Kondisi:* Anak perempuan sekaligus perawat utama Ibu S. Memiliki laptop dan ponsel cerdas.
  * *Karakteristik:* Menginginkan sistem yang praktis, siap pakai tanpa membeli alat mahal, dan sangat peduli privasi keluarga.
* **Skenario Nyata:**
  1. Seorang cucu bernama Dimas datang berkunjung ke rumah.
  2. Kamera ARSIK menangkap wajah Dimas. Karena belum terdaftar, sistem menandainya dengan kotak merah bertuliskan **"Tidak Dikenal"**.
  3. Rina (caregiver) yang mendampingi berucap: *"Ini Dimas, cucu saya."*
  4. Sistem otomatis mencatat wajah dan menyimpan identitas Dimas.
  5. Pada kunjungan selanjutnya, ketika Dimas berdiri di depan kamera, layar langsung menampilkan label hijau tebal **"Dimas (Cucu)"**. Ibu S dapat membaca nama cucunya dengan jelas dan menyapa dengan tenang.

---

## 3. Hasil Matriks Keputusan Pemilihan Solusi

Evaluasi 3 alternatif solusi komputasi multimedia menggunakan metode *Weighted Scoring* (Skala 1–5):

| Kriteria Penilaian | Bobot | Alternatif 1: Kacamata Pintar (*Smart Glasses*) | Alternatif 2: Album Foto Digital Berbasis Suara | Alternatif 3: Aplikasi Web Real-Time (ARSIK) |
| :--- | :---: | :---: | :---: | :---: |
| **Aksesibilitas Perangkat** | 0,30 | 2 (0,60) | 4 (1,20) | **5 (1,50)** |
| **Integrasi Multimedia** | 0,25 | 5 (1,25) | 3 (0,75) | **4 (1,00)** |
| **Kemudahan Penggunaan** | 0,25 | 2 (0,50) | 4 (1,00) | **4 (1,00)** |
| **Privasi & Keamanan Data** | 0,20 | 3 (0,60) | 3 (0,60) | **4 (0,80)** |
| **Total Skor Akhir** | **1,00** | **2,95** | **3,55** | **4,35 (SOLUSI TERPILIH)** |

*Kesimpulan:* **Alternatif 3 (Aplikasi Web ARSIK)** terpilih karena tidak membutuhkan perangkat keras khusus, memadukan video + audio + teks secara waktu nyata, mudah dipakai, dan data biometrik tersimpan 100% lokal di peramban.

---

## 4. Daftar Kebutuhan Pengguna (User Requirements)

| Kode | Kebutuhan Pengguna | Pemangku Kepentingan Terkait |
| :--- | :--- | :--- |
| **P-01** | Menampilkan nama dan hubungan keluarga secara otomatis di dekat wajah orang yang berada di depan kamera. | Pasien Demensia |
| **P-02** | Mendaftarkan orang baru dengan mudah, cukup melalui ucapan suara, dengan input teks sebagai opsi cadangan. | Pendamping / Caregiver |
| **P-03** | Tampilan yang sangat mudah dibaca: tipografi tebal, kontras tajam, dan pembeda visual tegas antara orang dikenal dan tidak dikenal. | Pasien Demensia |
| **P-04** | Melihat riwayat dan menghapus daftar orang yang sudah tersimpan. | Pendamping / Caregiver |
| **P-05** | Jaminan bahwa foto dan data vektor wajah tidak pernah dikirim atau disimpan di server luar. | Pendamping & Kerabat |
| **P-06** | Dapat langsung dijalankan pada laptop atau ponsel pintar bawaan tanpa perangkat keras tambahan. | Pendamping / Caregiver |

---

## 5. Spesifikasi Kebutuhan Sistem

### 5.1 Kebutuhan Fungsional (SK-F)

#### A. Subsistem Pengenalan Wajah (Computer Vision)
* **SK-F01:** Sistem mengakses aliran video kamera (resolusi ideal $1280 \times 720$) melalui antarmuka `navigator.mediaDevices.getUserMedia`.
* **SK-F02:** Sistem memuat model bobot neural network (`tinyFaceDetector`, `faceLandmark68Net`, dan `faceRecognitionNet`) dari berkas lokal aplikasi `/models`.
* **SK-F03:** Sistem melakukan inferensi deteksi wajah pada bingkai video secara berkala dengan interval **300 milidetik** ($\approx 3$ FPS).
* **SK-F04:** Sistem mengekstraksi vektor deskriptor wajah berdimensi 128 dan mencocokkannya dengan database lokal menggunakan metrik **Jarak Euklides (*Euclidean Distance*)**. Wajah diklasifikasikan sebagai dikenali jika jarak minimum $< 0.6$.
* **SK-F05:** Sistem merender kotak pembatas (*bounding box*) dan label:
  * **Hijau:** Berisi Nama dan Hubungan Keluarga (untuk wajah yang teridentifikasi).
  * **Merah:** Berisi teks `"Tidak Dikenal"` (untuk wajah baru/belum terdaftar).
* **SK-F06:** Sistem memperbarui kolom `lastSeen` (waktu terakhir terlihat) secara otomatis setiap kali seseorang berhasil dikenali.

#### B. Subsistem Pendaftaran Suara (Speech Recognition)
* **SK-F07:** Saat wajah tidak dikenal terdeteksi di depan kamera, sistem secara otomatis:
  1. Memotong (*crop*) visual wajah tersebut beserta deskriptor fiturnya sebagai `pendingFace`.
  2. Mengaktifkan mikrofon peramban untuk mendengarkan perkenalan suara.
* **SK-F08:** Sistem mengubah audio menjadi teks (Bahasa Indonesia `id-ID`) via Web Speech API dan mengekstrak entitas Nama serta Relasi menggunakan pencocokan pola:
  * `"ini [nama], [relasi] saya"`
  * `"kenalkan [nama], [relasi] saya"`
  * `"namanya [nama], [relasi] saya"`
* **SK-F09:** Sistem menyediakan formulir modal isian manual (Nama dan Relasi) sebagai cadangan jika pengenalan suara tidak didukung browser atau gagal mengenali ucapan.

#### C. Subsistem Pengelolaan Profil (Data Management)
* **SK-F10:** Sistem menyimpan entitas profil kerabat ke dalam `localStorage` dengan skema:
  * ID (string unik), Nama (string), Relasi (string), Deskriptor Wajah (array float 128-d), Foto Wajah (data URL JPEG), Tanggal Ditambahkan (ISO string), Terakhir Dilihat (ISO string).
* **SK-F11:** Sistem menyediakan tab **Daftar Kerabat** yang menampilkan seluruh profil tersimpan lengkap dengan foto thumbnail, nama, relasi, dan waktu terakhir terlihat.
* **SK-F12:** Sistem memungkinkan penghapusan profil (satu per satu maupun hapus semua) dengan **dialog konfirmasi wajib**.

---

### 5.2 Kebutuhan Non-Fungsional (SK-NF)

| Kode | Aspek | Spesifikasi Kebutuhan Non-Fungsional |
| :--- | :--- | :--- |
| **SK-NF01** | **Performa** | Video kamera berjalan mulus sesuai frame rate asli peramban (30–60 FPS), sedangkan komputasi model AI wajah dijalankan dengan interval $\approx 300\text{ms}$ agar CPU/GPU tidak kelebihan beban (*lag-free*). |
| **SK-NF02** | **Kecepatan Respons** | Label nama dan relasi muncul di atas layar paling lambat **1 detik** setelah wajah masuk ke bidang pandang kamera. |
| **SK-NF03** | **Privasi Data** | Ekstraksi fitur wajah dan penyimpanan data profil berlangsung 100% di sisi klien (*localStorage*). Tidak ada transmisi foto/deskriptor ke internet. |
| **SK-NF04** | **Privasi Suara** | Layanan Web Speech API hanya menerima masukan audio ucapan saat proses pendaftaran berlangsung. Tidak ada streaming mikrofon terus-menerus di latar belakang. |
| **SK-NF05** | **Usabilitas Visual** | Teks label identitas menggunakan tipografi tebal (*bold*) minimal **20px** dengan kontras tinggi (teks hitam di atas latar hijau terang/merah terang) agar jelas terbaca oleh mata lansia. |
| **SK-NF06** | **Usabilitas Tata Letak** | Antarmuka hanya terdiri atas **2 Tab** (*Deteksi Wajah* dan *Daftar Kerabat*). Layar deteksi wajah harus bebas dari tombol debugging atau elemen pengganggu kognitif (*cognitive overload*). |
| **SK-NF07** | **Kompatibilitas** | Berjalan pada peramban modern berbasis Chromium (Google Chrome, Microsoft Edge) yang mendukung WebGL dan Web Speech API. |
| **SK-NF08** | **Portabilitas** | Dapat diakses secara instan via browser pada laptop atau ponsel pintar berkamera tanpa memerlukan instalasi software native maupun perangkat keras tambahan. |

---

## 6. Matriks Keterlacakan (Traceability Matrix)

| Kebutuhan Pengguna | Kebutuhan Sistem Fungsional & Non-Fungsional |
| :--- | :--- |
| **P-01 (Identitas Otomatis)** | SK-F01, SK-F02, SK-F03, SK-F04, SK-F05, SK-F06, SK-NF01, SK-NF02 |
| **P-02 (Pendaftaran Mudah)** | SK-F07, SK-F08, SK-F09 |
| **P-03 (Tampilan Mudah Dibaca)** | SK-F05, SK-NF05, SK-NF06 |
| **P-04 (Kelola Daftar Orang)** | SK-F10, SK-F11, SK-F12 |
| **P-05 (Privasi Lokal)** | SK-NF03, SK-NF04 |
| **P-06 (Tanpa Perangkat Khusus)**| SK-NF07, SK-NF08 |

---

## 7. Landasan Matematis & Algoritma

### 7.1 Jarak Euklides (Euclidean Distance)
Untuk membandingkan apakah wajah yang sedang dilihat kamera ($A$) sama dengan salah satu wajah yang ada di database lokal ($B$):

$$d(A, B) = \sqrt{\sum_{i=1}^{128} (A_i - B_i)^2}$$

* Dimana $A_i$ dan $B_i$ adalah elemen vektor deskriptor wajah ke-$i$ (128 dimensi).
* **Aturan Keputusan:**
  * Jika $\min(d) < 0.6 \longrightarrow$ Wajah Dikenali sebagai subjek pemilik jarak terkecil.
  * Jika $\min(d) \ge 0.6$ atau basis data kosong $\longrightarrow$ Wajah Tidak Dikenal (*Unknown*).
