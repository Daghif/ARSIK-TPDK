import { useState } from 'react';
import {
  MicIcon,
  CloseIcon,
  CheckCircleIcon,
} from './Icons';
import './RegistrationModal.css';

const QUICK_RELATIONS = [
  'Cucu',
  'Anak',
  'Suami / Istri',
  'Menantu',
  'Kakak / Adik',
  'Keponakan',
  'Pendamping',
  'Tetangga',
];

const RegistrationModal = ({
  pendingFace,
  isListening,
  transcript,
  speechError,
  voiceExtracted,
  onToggleListening,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(() => voiceExtracted?.name || '');
  const [relation, setRelation] = useState(() => voiceExtracted?.relation || '');
  const [formError, setFormError] = useState('');

  if (!pendingFace) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanRelation = relation.trim();

    if (!cleanName || !cleanRelation) {
      setFormError('Mohon isi Nama dan Hubungan Keluarga terlebih dahulu.');
      return;
    }

    setFormError('');
    onSave({
      name: cleanName,
      relation: cleanRelation,
    });
  };

  return (
    <div className="reg-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="reg-modal-title">
      <div className="reg-modal-sheet">
        {/* Header Modal */}
        <div className="reg-modal-header">
          <div className="reg-header-title-group">
            <span className="reg-badge-unknown">Wajah Baru Terdeteksi</span>
            <h2 id="reg-modal-title" className="reg-modal-title">
              Daftarkan Identitas Kerabat
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="reg-close-btn arsik-btn-interactive"
            aria-label="Tutup jendela pendaftaran"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        {/* Pratinjau Foto Wajah & Status Suara (SK-F07 & SK-F08) */}
        <div className="reg-preview-row">
          <div className="reg-photo-frame">
            <img
              src={pendingFace.photo}
              alt="Potongan wajah kerabat baru"
              className="reg-photo-img"
            />
          </div>

          <div className="reg-voice-panel">
            <div className={`reg-mic-status ${isListening ? 'listening' : ''}`}>
              <MicIcon size={20} />
              <span>
                {isListening
                  ? 'Mendengarkan Suara...'
                  : 'Mikrofon Siap Digunakan'}
              </span>
            </div>

            <p className="reg-voice-hint">
              Ucapkan kalimat seperti:{' '}
              <strong>&ldquo;Ini Dimas, cucu saya&rdquo;</strong>
            </p>

            {transcript && (
              <div className="reg-transcript-box">
                <span className="reg-transcript-label">Suara terdengar:</span>
                <p className="reg-transcript-text">&ldquo;{transcript}&rdquo;</p>
              </div>
            )}

            {speechError && (
              <p className="reg-speech-error">{speechError}</p>
            )}

            <button
              type="button"
              onClick={onToggleListening}
              className={`reg-mic-toggle-btn arsik-btn-interactive ${
                isListening ? 'active' : ''
              }`}
            >
              <MicIcon size={18} />
              <span>
                {isListening ? 'Hentikan Mikrofon' : 'Aktifkan Ulang Suara'}
              </span>
            </button>
          </div>
        </div>

        {/* Form Isian Manual Cadangan & Konfirmasi (SK-F09 & Hick's Law) */}
        <form onSubmit={handleSubmit} className="reg-form">
          <div className="reg-field">
            <label htmlFor="arsik-input-name" className="reg-label">
              Nama Panggilan / Lengkap Kerabat
            </label>
            <input
              id="arsik-input-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Dimas"
              className="reg-input"
              autoComplete="off"
            />
          </div>

          <div className="reg-field">
            <label htmlFor="arsik-input-relation" className="reg-label">
              Hubungan Keluarga dengan Pasien
            </label>
            <input
              id="arsik-input-relation"
              type="text"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              placeholder="Contoh: Cucu Pertama"
              className="reg-input"
              autoComplete="off"
            />

            {/* Quick-Select Chips (Hick's Law & Fitts's Law: Meminimalkan ketikan di HP) */}
            <div className="reg-chips-wrap" aria-label="Pilihan cepat hubungan keluarga">
              {QUICK_RELATIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRelation(item)}
                  className={`reg-chip arsik-btn-interactive ${
                    relation.toLowerCase() === item.toLowerCase() ? 'selected' : ''
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {formError && <div className="reg-form-error">{formError}</div>}

          <div className="reg-actions">
            <button
              type="button"
              onClick={onCancel}
              className="reg-btn-secondary arsik-btn-interactive"
            >
              Batal
            </button>
            <button
              type="submit"
              className="reg-btn-primary arsik-btn-interactive"
            >
              <CheckCircleIcon size={22} />
              <span>Simpan Kerabat</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;
