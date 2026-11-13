import { useState } from 'react';
import {
  getPeople,
  savePerson,
  deletePerson,
  clearAllPeople,
  formatFriendlyTime,
  generateUniqueId,
} from '../utils/faceStorage';
import {
  UsersIcon,
  TrashIcon,
  SearchIcon,
  ClockIcon,
  ShieldCheckIcon,
  AlertCircleIcon,
  CloseIcon,
  UserPlusIcon,
  CheckCircleIcon,
} from './Icons';
import './PeopleList.css';

const SAMPLE_PROFILES = [
  {
    id: 'sample_budi_santoso',
    name: 'Budi Santoso',
    relation: 'Anak Pertama',
    photo: '/images/person-budi.jpg',
    descriptor: new Array(128).fill(0.11),
  },
  {
    id: 'sample_rina_wulandari',
    name: 'Rina Wulandari',
    relation: 'Menantu',
    photo: '/images/person-rina.jpg',
    descriptor: new Array(128).fill(0.24),
  },
  {
    id: 'sample_dimas_pratama',
    name: 'Dimas Pratama',
    relation: 'Cucu',
    photo: '/images/person-dimas.jpg',
    descriptor: new Array(128).fill(0.37),
  },
];

const PeopleList = ({ onUpdate }) => {
  const [people, setPeople] = useState(() => getPeople());
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmState, setConfirmState] = useState(null); // { type: 'single' | 'all', person?: object }
  const [feedbackToast, setFeedbackToast] = useState(null);

  const loadPeople = () => {
    const list = getPeople();
    setPeople(list);
    return list;
  };

  const showToast = (message) => {
    setFeedbackToast(message);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  const handleLoadSamplePeople = () => {
    SAMPLE_PROFILES.forEach((sample, idx) => {
      savePerson({
        ...sample,
        id: sample.id || generateUniqueId(`sample_${idx}`),
      });
    });
    loadPeople();
    showToast('3 contoh profil kerabat berhasil dimuat.');
    if (onUpdate) onUpdate();
  };

  // Hapus 1 profil kerabat spesifik
  const handleExecuteDeleteSingle = (targetPerson) => {
    if (!targetPerson || !targetPerson.id) return;
    const deletedName = targetPerson.name;
    const success = deletePerson(targetPerson.id);
    setConfirmState(null);
    if (success) {
      loadPeople();
      showToast(`Profil "${deletedName}" berhasil dihapus.`);
      if (onUpdate) onUpdate();
    }
  };

  // Hapus seluruh data kerabat sekaligus
  const handleExecuteDeleteAll = () => {
    const success = clearAllPeople();
    setConfirmState(null);
    if (success) {
      loadPeople();
      showToast('Seluruh data kerabat telah dihapus dari perangkat ini.');
      if (onUpdate) onUpdate();
    }
  };

  const filteredPeople = people.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.relation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="people-screen" aria-label="Daftar Kerabat Terdaftar">
      {/* Toast Feedback Notifikasi */}
      {feedbackToast && (
        <div className="people-toast-banner" role="status" aria-live="polite">
          <CheckCircleIcon size={20} className="toast-icon" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Kartu Ringkasan Direktori */}
      <div className="people-header-card">
        <div className="people-header-top">
          <div className="people-header-icon">
            <UsersIcon size={24} />
          </div>
          <div className="people-header-titles">
            <h2 className="people-title">Daftar Kerabat Terdaftar</h2>
            <p className="people-subtitle">
              {people.length > 0
                ? `${people.length} anggota keluarga tersimpan di perangkat ini.`
                : 'Belum ada profil kerabat yang didaftarkan.'}
            </p>
          </div>
          {people.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmState({ type: 'all' })}
              className="btn-header-clear-all arsik-btn-interactive"
              aria-label="Hapus seluruh profil kerabat"
              title="Hapus seluruh profil"
            >
              <TrashIcon size={16} />
              <span>Hapus Semua</span>
            </button>
          )}
        </div>

        {people.length > 0 && (
          <div className="people-controls-row">
            <div className="people-search-box">
              <SearchIcon size={20} className="people-search-icon" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau hubungan..."
                className="people-search-input"
                aria-label="Cari kerabat"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="people-search-clear arsik-btn-interactive"
                  aria-label="Bersihkan pencarian"
                >
                  <CloseIcon size={18} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Daftar Kartu Kerabat (Rule #3: Stagger list rows by 30ms & Miller's Law Chunking) */}
      {people.length === 0 ? (
        <div className="people-empty-card">
          <div className="people-empty-photo-wrap">
            <img
              src="/images/splash-family.jpg"
              alt="Keluarga mendampingi lansia"
              className="people-empty-photo"
            />
          </div>
          <h3 className="people-empty-title">Belum Ada Data Kerabat</h3>
          <p className="people-empty-desc">
            Buka tab <strong>Kamera Deteksi</strong>, arahkan kamera ke wajah kerabat, lalu ucapkan{' '}
            <strong>&ldquo;Ini [Nama], [Hubungan] saya&rdquo;</strong> untuk mendaftarkan secara otomatis.
          </p>
          <button
            type="button"
            onClick={handleLoadSamplePeople}
            className="btn-load-sample arsik-btn-interactive"
          >
            <UserPlusIcon size={18} />
            <span>Muat Contoh Data Kerabat</span>
          </button>
        </div>
      ) : filteredPeople.length === 0 ? (
        <div className="people-empty-card">
          <p className="people-empty-title">
            Tidak ditemukan kerabat dengan kata kunci &ldquo;{searchQuery}&rdquo;
          </p>
        </div>
      ) : (
        <div className="people-list" role="list">
          {filteredPeople.map((person, index) => (
            <article
              key={person.id}
              role="listitem"
              className="person-card"
              style={{ '--row-index': Math.min(index, 12) }}
            >
              <div className="person-avatar-wrap">
                {person.photo ? (
                  <img
                    src={person.photo}
                    alt={`Foto wajah ${person.name}`}
                    className="person-avatar-img"
                  />
                ) : (
                  <div className="person-avatar-fallback">
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="person-info">
                <div className="person-name-row">
                  <h3 className="person-name">{person.name}</h3>
                  <span className="person-relation-pill">{person.relation}</span>
                </div>

                <div className="person-meta-row">
                  <ClockIcon size={16} />
                  <span>Terakhir terlihat: {formatFriendlyTime(person.lastSeen)}</span>
                </div>
              </div>

              {/* Tombol Hapus per Individu */}
              <button
                type="button"
                onClick={() => setConfirmState({ type: 'single', person })}
                className="person-delete-btn arsik-btn-interactive"
                aria-label={`Hapus profil ${person.name}`}
                title={`Hapus profil ${person.name}`}
              >
                <TrashIcon size={20} />
              </button>
            </article>
          ))}
        </div>
      )}

      {/* Tombol Hapus Seluruh Data di Bagian Bawah (SK-F12) */}
      {people.length > 0 && (
        <div className="people-footer-actions">
          <button
            type="button"
            onClick={() => setConfirmState({ type: 'all' })}
            className="btn-clear-all arsik-btn-interactive"
          >
            <TrashIcon size={20} />
            <span>Hapus Seluruh Data Kerabat ({people.length})</span>
          </button>
        </div>
      )}

      {/* Keterangan Privasi Data Lokal (SK-NF03) */}
      <div className="people-privacy-banner">
        <ShieldCheckIcon size={20} className="privacy-banner-icon" />
        <p>
          Seluruh foto dan vektor pengenal wajah disimpan di penyimpanan lokal peramban HP ini (
          <code>arsik_people</code>) sesuai UU Pelindungan Data Pribadi No. 27 Tahun 2022.
        </p>
      </div>

      {/* Dialog Konfirmasi Hapus dengan Pilihan: Hapus 1 Profil ATAU Hapus Semua */}
      {confirmState && (
        <div
          className="confirm-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
        >
          <div className="confirm-modal-box">
            <div className="confirm-icon-badge">
              <AlertCircleIcon size={32} />
            </div>

            {confirmState.type === 'single' && confirmState.person ? (
              <>
                <h3 id="confirm-modal-title" className="confirm-title">
                  Hapus Profil Kerabat
                </h3>

                {/* Pratinjau Profil yang dipilih */}
                <div className="confirm-person-preview">
                  {confirmState.person.photo ? (
                    <img
                      src={confirmState.person.photo}
                      alt={confirmState.person.name}
                      className="confirm-preview-thumb"
                    />
                  ) : (
                    <div className="confirm-preview-thumb-fallback">
                      {confirmState.person.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="confirm-preview-info">
                    <p className="confirm-preview-name">{confirmState.person.name}</p>
                    <p className="confirm-preview-relation">{confirmState.person.relation}</p>
                  </div>
                </div>

                <p className="confirm-desc">
                  Silakan tentukan opsi penghapusan data:
                </p>

                {/* Pilihan: Hapus 1 Saja vs Hapus Semua */}
                <div className="confirm-options-stack">
                  <button
                    type="button"
                    onClick={() => handleExecuteDeleteSingle(confirmState.person)}
                    className="confirm-btn-single arsik-btn-interactive"
                  >
                    <TrashIcon size={18} />
                    <span>Hapus &ldquo;{confirmState.person.name}&rdquo; Saja</span>
                  </button>

                  {people.length > 1 && (
                    <button
                      type="button"
                      onClick={handleExecuteDeleteAll}
                      className="confirm-btn-all arsik-btn-interactive"
                    >
                      <TrashIcon size={18} />
                      <span>Hapus Seluruh Data ({people.length} Kerabat)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setConfirmState(null)}
                    className="confirm-btn-cancel arsik-btn-interactive"
                  >
                    Batal
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 id="confirm-modal-title" className="confirm-title">
                  Hapus Seluruh Data Kerabat?
                </h3>
                <p className="confirm-desc">
                  Semua ({people.length}) data profil, foto, dan fitur pengenalan wajah kerabat akan dihapus permanen dari HP ini.
                </p>
                <div className="confirm-options-stack">
                  <button
                    type="button"
                    onClick={handleExecuteDeleteAll}
                    className="confirm-btn-single arsik-btn-interactive"
                  >
                    <TrashIcon size={18} />
                    <span>Ya, Hapus Seluruh Data</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmState(null)}
                    className="confirm-btn-cancel arsik-btn-interactive"
                  >
                    Batal
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default PeopleList;
