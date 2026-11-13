// Modul Pengenalan Suara Bahasa Indonesia berbasis Web Speech API (SK-F08 & SK-NF04)

const INDONESIAN_RELATIONS = [
  'cucu',
  'anak',
  'istri',
  'suami',
  'ibu',
  'bunda',
  'mama',
  'ayah',
  'bapak',
  'papa',
  'kakak',
  'adik',
  'menantu',
  'keponakan',
  'ponakan',
  'sepupu',
  'paman',
  'om',
  'bibi',
  'tante',
  'tetangga',
  'teman',
  'sahabat',
  'perawat',
  'pendamping',
  'dokter',
  'saudara',
];

const capitalizeWords = (str) =>
  str
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

export class SpeechListener {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.onResult = null;
    this.onTranscriptChange = null;
    this.onStatusChange = null;
    this.transcript = '';
  }

  static isSupported() {
    return (
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    );
  }

  initialize() {
    if (!SpeechListener.isSupported()) {
      return false;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'id-ID';
    } catch (error) {
      console.error('Gagal menginisialisasi Web Speech API:', error);
      return false;
    }

    this.recognition.onresult = (event) => {
      let interimText = '';
      let finalChunk = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const piece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalChunk += piece + ' ';
        } else {
          interimText += piece;
        }
      }

      const displayTranscript = (this.transcript + ' ' + interimText).trim();
      if (this.onTranscriptChange && displayTranscript) {
        this.onTranscriptChange(displayTranscript);
      }

      if (finalChunk) {
        this.transcript = (this.transcript + ' ' + finalChunk).trim();
        if (this.onTranscriptChange) {
          this.onTranscriptChange(this.transcript);
        }
        this.analyzeTranscript(finalChunk);
      }
    };

    this.recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        this.isListening = false;
        if (this.onStatusChange) {
          this.onStatusChange({
            listening: false,
            error: 'Izin mikrofon ditolak pada peramban. Silakan isi nama secara manual di bawah.',
          });
        }
      }
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        try {
          this.recognition.start();
        } catch {
          this.isListening = false;
          if (this.onStatusChange) {
            this.onStatusChange({ listening: false });
          }
        }
      } else if (this.onStatusChange) {
        this.onStatusChange({ listening: false });
      }
    };

    return true;
  }

  start({ onResult, onTranscriptChange, onStatusChange } = {}) {
    if (typeof onResult === 'function') {
      this.onResult = onResult;
    }
    if (typeof onTranscriptChange === 'function') {
      this.onTranscriptChange = onTranscriptChange;
    }
    if (typeof onStatusChange === 'function') {
      this.onStatusChange = onStatusChange;
    }

    if (this.isListening) {
      return true;
    }

    if (!this.recognition && !this.initialize()) {
      if (this.onStatusChange) {
        this.onStatusChange({
          listening: false,
          error: 'Peramban tidak mendukung pengenalan suara otomatis. Gunakan formulir manual.',
        });
      }
      return false;
    }

    this.transcript = '';
    this.isListening = true;

    try {
      this.recognition.start();
      if (this.onStatusChange) {
        this.onStatusChange({ listening: true, error: null });
      }
      return true;
    } catch {
      this.isListening = false;
      return false;
    }
  }

  stop() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore stop errors when already stopped
      }
    }
    if (this.onStatusChange) {
      this.onStatusChange({ listening: false });
    }
  }

  analyzeTranscript(text) {
    const extracted = this.extractNameAndRelation(text);
    if (extracted && this.onResult) {
      this.onResult(extracted);
    }
  }

  /**
   * Mengekstrak Nama dan Hubungan Keluarga dari kalimat Bahasa Indonesia (SK-F08 & Postel's Law)
   * Pola utama:
   * 1. "ini [nama], [relasi] saya" / "ini [nama] [relasi] saya"
   * 2. "kenalkan [nama], [relasi] saya"
   * 3. "namanya [nama], [relasi] saya"
   * 4. "ini [relasi] saya, [nama]"
   */
  extractNameAndRelation(rawText) {
    if (!rawText) return null;
    const cleaned = rawText
      .toLowerCase()
      .replace(/[.!?]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Pola 1-3: (ini | kenalkan | perkenalkan | namanya) [nama], [relasi] (saya | ibu | bapak)?
    const primaryPatterns = [
      /(?:ini|kenalkan|perkenalkan|namanya)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)\s*,?\s+([a-zA-Z]+)\s+(?:saya|ibu|bapak|kita)/i,
      /([a-zA-Z]+(?:\s+[a-zA-Z]+)?)\s+adalah\s+([a-zA-Z]+)\s+(?:saya|ibu|bapak)/i,
    ];

    for (const pattern of primaryPatterns) {
      const match = cleaned.match(pattern);
      if (match) {
        const firstPart = match[1].trim();
        const secondPart = match[2].trim();

        // Cek apakah kata pertama justru relasi (misal: "ini cucu saya dimas")
        if (INDONESIAN_RELATIONS.includes(firstPart.toLowerCase())) {
          return {
            name: capitalizeWords(secondPart),
            relation: capitalizeWords(firstPart),
          };
        }

        return {
          name: capitalizeWords(firstPart),
          relation: capitalizeWords(secondPart),
        };
      }
    }

    // Pola 4: "ini [relasi] saya [nama]"
    const reversePattern =
      /(?:ini|kenalkan|perkenalkan)?\s*([a-zA-Z]+)\s+(?:saya|ibu|bapak)\s*,?\s*(?:namanya\s+)?([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i;
    const revMatch = cleaned.match(reversePattern);
    if (
      revMatch &&
      INDONESIAN_RELATIONS.includes(revMatch[1].trim().toLowerCase())
    ) {
      return {
        name: capitalizeWords(revMatch[2]),
        relation: capitalizeWords(revMatch[1]),
      };
    }

    return null;
  }
}
