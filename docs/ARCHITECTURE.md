# ARSITEKTUR TEKNIS & ALUR SISTEM: ARSIK
**Aplikasi Rekayasa Sistem Identifikasi Kerabat (Dementia Patient Assistant)**

Dokumen ini menjelaskan arsitektur perangkat lunak, aliran data multimedia, skema penyimpanan data, dan pedoman desain antarmuka bagi pengembang serta AI Assistant dalam merekayasa aplikasi ARSIK.

---

## 1. Diagram Alir Sistem (System Data Flow)

Sistem memadukan tiga modalitas multimedia: **Video** (kamera), **Audio** (mikrofon), dan **Teks/Grafis** (kanvas antarmuka) yang dieksekusi secara lokal di dalam peramban web:

```mermaid
flowchart TD
    subgraph Input Multimedia
        A[Kamera Laptop/Ponsel] -->|Aliran Video WebRTC| B[Elemen Video HTML5]
        M[Mikrofon Perangkat] -->|Gelombang Suara| N[Web Speech API id-ID]
    end

    subgraph Pipeline Deteksi Wajah (Setiap 300ms)
        B --> C[TinyFaceDetector]
        C -->|Bounding Box Wajah| D[FaceLandmark68Net]
        D -->|Penyelarasan 68 Titik| E[FaceRecognitionNet]
        E -->|Deskriptor Wajah 128-D| F[Modul Pencocokan Jarak Euklides]
    end

    subgraph Basis Data Klien (LocalStorage)
        DB[(arsik_people)] <-->|Fetch & Update lastSeen| F
    end

    subgraph Logika Klasifikasi
        F -->|Jarak < 0.6| G[Wajah Dikenal]
        F -->|Jarak >= 0.6| H[Wajah Tidak Dikenal]
    end

    subgraph Luaran Antarmuka Pasien
        G -->|Render Hijau Bold 20px| K[Kanvas Overlay: Nama & Relasi]
        H -->|Render Merah Bold 20px| L[Kanvas Overlay: Tidak Dikenal]
    end

    subgraph Alur Pendaftaran Baru (Caregiver)
        H -->|Auto Crop JPEG| P[Pending Face State]
        P -->|Aktifkan Mikrofon| N
        N -->|Pola: ini Dimas cucu saya| Q[Ekstraktor Nama & Relasi]
        Q -->|Simpan Profil| DB
        P -.->|Jika Suara Gagal| R[Modal Form Manual Cadangan]
        R -->|Input Manual| DB
    end
```

---

## 2. Struktur Modul dan Direktori Kode

Struktur proyek React 19 + Vite yang direkomendasikan:

```text
src/
├── assets/
│   └── (ikon, gambar pendukung)
├── components/
│   ├── FaceRecognition.jsx       # Layar utama pasien: Kamera, canvas overlay, loop inferensi
│   ├── FaceRecognition.css       # Desain kontras tinggi, layout full/clean
│   ├── PeopleList.jsx            # Layar caregiver: Manajemen profil & riwayat last seen
│   ├── PeopleList.css            # Desain kartu profil yang rapi dan mudah dibaca
│   ├── RegistrationModal.jsx     # Dialog konfirmasi suara / input manual cadangan
│   └── RegistrationModal.css     # Modal dengan tombol besar dan feedback visual
├── utils/
│   ├── faceStorage.js            # Abstraksi LocalStorage, serialisasi Float32Array
│   ├── speechRecognition.js      # Wrapper Web Speech API & regex parser Bahasa Indonesia
│   └── euclideanDistance.js      # Komputasi matematis vektor jarak Euklides
├── App.jsx                       # Komponen root: Navigasi 2-Tab sederhana
├── App.css                       # Layout utama & aturan aksesibilitas global
├── index.css                     # Reset CSS & styling dasar
└── main.jsx                      # Titik masuk React DOM
public/
└── models/                       # Bobot model face-api.js (wajib di folder public)
    ├── tiny_face_detector_model-weights_manifest.json
    ├── tiny_face_detector_model-shard1
    ├── face_landmark_68_model-weights_manifest.json
    ├── face_landmark_68_model-shard1
    ├── face_recognition_model-weights_manifest.json
    ├── face_recognition_model-shard1
    └── face_recognition_model-shard2
```

---

## 3. Detail Implementasi Subsistem

### 3.1 Subsistem Pemrosesan Wajah (`face-api.js`)
* **Pemanggilan Model:**
  ```javascript
  const MODEL_URL = '/models';
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
  ]);
  ```
* **Loop Deteksi (Throttled Interval 300ms):**
  ```javascript
  setInterval(async () => {
    if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;
    
    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
      .withFaceLandmarks()
      .withFaceDescriptors();

    // Resize koordinat ke ukuran kanvas tampilan
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    // Jalankan pencocokan dengan daftar orang tersimpan...
  }, 300);
  ```
* **Pencocokan Euclidean Distance:**
  ```javascript
  function findBestMatch(queryDescriptor, knownPeople, threshold = 0.6) {
    let bestMatch = { person: null, distance: Infinity };

    for (const person of knownPeople) {
      const dist = faceapi.euclideanDistance(queryDescriptor, person.descriptor);
      if (dist < bestMatch.distance) {
        bestMatch = { person, distance: dist };
      }
    }

    if (bestMatch.distance < threshold) {
      return { isKnown: true, person: bestMatch.person, distance: bestMatch.distance };
    }
    return { isKnown: false, person: null, distance: bestMatch.distance };
  }
  ```

---

### 3.2 Subsistem Pendaftaran Suara (Web Speech API)
* **Inisialisasi & Bahasa:**
  ```javascript
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'id-ID';
  recognition.continuous = false;
  recognition.interimResults = false;
  ```
* **Ekstraksi Entitas Nama & Relasi (Regex Parser):**
  Pola kalimat yang didukung sesuai spesifikasi SK-F08:
  1. `"ini [nama], [relasi] saya"` $\longrightarrow$ Contoh: *"ini dimas, cucu saya"*
  2. `"kenalkan [nama], [relasi] saya"` $\longrightarrow$ Contoh: *"kenalkan siti, anak saya"*
  3. `"namanya [nama], [relasi] saya"` $\longrightarrow$ Contoh: *"namanya budi, adik saya"*
  4. Pola toleransi: `"ini [nama] [relasi] saya"` (tanpa koma jeda bicara).

  ```javascript
  export function parseSpeechIntro(text) {
    const clean = text.toLowerCase().trim();
    const patterns = [
      /(?:ini|kenalkan|namanya)\s+([a-zA-Z\s]+?)(?:,|\s)+([a-zA-Z\s]+?)\s+saya$/i,
      /(?:ini|namanya)\s+([a-zA-Z\s]+?)\s+sebagai\s+([a-zA-Z\s]+)$/i
    ];

    for (const pattern of patterns) {
      const match = clean.match(pattern);
      if (match) {
        return {
          name: capitalizeWords(match[1].trim()),
          relation: capitalizeWords(match[2].trim())
        };
      }
    }
    return null;
  }
  ```

---

### 3.3 Subsistem Penyimpanan Lokal (`faceStorage.js`)
* **Serialisasi Data:** Deskriptor wajah dari `face-api.js` bertipe `Float32Array`. Sebelum disimpan ke `localStorage`, ubah ke Array biasa `Array.from(descriptor)`.
* **Deserialisasi:** Saat memuat dari `localStorage`, konversi kembali menjadi `new Float32Array(person.descriptor)`.
* **Auto-Crop Foto Wajah (Base64 JPEG):**
  Saat wajah tidak dikenal terdeteksi, ekstrak koordinat *bounding box* dari frame video, gambar ke elemen `<canvas>` tersembunyi, lalu konversi ke `canvas.toDataURL('image/jpeg', 0.8)`. Foto ini disimpan agar caregiver dapat melihat visual wajah di daftar kerabat.

---

## 4. Sistem Desain Antarmuka untuk Pasien Lansia

| Elemen UI | Spesifikasi Teknis | Alasan Aksesibilitas |
| :--- | :--- | :--- |
| **Label Wajah Dikenal** | Latar Hijau `#16a34a`, Border `#15803d`, Teks Putih/Hitam Tebal 22px. Format: `[Nama] ([Relasi])` | Kontras WCAG AAA. Pasien langsung tahu nama dan hubungan keluarga. |
| **Label Belum Dikenal** | Latar Merah `#dc2626`, Border `#b91c1c`, Teks Putih Tebal 22px. Format: `Tidak Dikenal` | Memberikan penanda yang jelas tanpa membuat panik. |
| **Navigasi Tab** | Tab Bar horizontal besar di bagian atas, tinggi tombol $\ge 56\text{px}$, font $\ge 18\text{px}$ bold. | Memudahkan navigasi bagi lansia yang memiliki kendala motorik tangan. |
| **Area Video** | Proporsional tengah layar ($16:9$), tidak terpotong, bebas dari overlay teks yang tidak perlu. | Mengurangi beban pemrosesan kognitif (*cognitive load*). |
| **Pesan Status Suara** | Banner mengambang ramah di bawah video: *"Mendengarkan ucapan... (Contoh: 'Ini Budi, anak saya')"* | Memberi kepastian kepada caregiver bahwa sistem sedang aktif mendengarkan. |
| **Dialog Konfirmasi Hapus**| Tombol konfirmasi besar berwarna merah kontras tinggi dan tombol batal berukuran seimbang. | Menghindari kehilangan data berharga akibat ketidaksengajaan. |
