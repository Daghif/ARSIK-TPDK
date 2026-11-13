import { useState, useEffect } from 'react';
import { getPeople, deletePerson, clearAllPeople } from '../utils/faceStorage';
import { 
  UsersIcon, 
  TrashIcon, 
  SearchIcon, 
  CloseIcon, 
  ShieldCheckIcon, 
  AlertCircleIcon,
  UserCheckIcon 
} from './Icons';
import './PeopleList.css';

const PeopleList = ({ onUpdate }) => {
  const [people, setPeople] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    loadPeople();
  }, []);

  const loadPeople = () => {
    const data = getPeople();
    setPeople(data);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Hapus profil kerabat "${name}" dari memori perangkat? Tindakan ini tidak dapat dibatalkan.`)) {
      deletePerson(id);
      loadPeople();
      if (onUpdate) onUpdate();
      if (selectedPerson?.id === id) {
        setSelectedPerson(null);
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('PERINGATAN: Anda akan menghapus seluruh data kerabat yang tersimpan di perangkat ini. Lanjutkan?')) {
      clearAllPeople();
      loadPeople();
      if (onUpdate) onUpdate();
      setSelectedPerson(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const filteredPeople = people.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.relation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="people-directory">
      {/* Directory Header Bar */}
      <div className="directory-header">
        <div className="directory-title-wrap">
          <div className="dir-icon-badge">
            <UsersIcon size={22} />
          </div>
          <div>
            <h2 className="directory-title">Direktori Kerabat Terdaftar</h2>
            <p className="directory-subtitle">
              Profil anggota keluarga dan pendamping yang dikenali secara otomatis oleh sistem ARSIK.
            </p>
          </div>
        </div>

        {people.length > 0 && (
          <div className="directory-actions">
            <button onClick={handleClearAll} className="btn-danger-soft">
              <TrashIcon size={16} />
              <span>Hapus Seluruh Data</span>
            </button>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      {people.length > 0 && (
        <div className="search-bar-wrap">
          <div className="search-input-box">
            <SearchIcon size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau relasi keluarga..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="btn-clear-search" onClick={() => setSearchQuery('')}>
                <CloseIcon size={16} />
              </button>
            )}
          </div>
          <span className="search-count-pill">
            Menampilkan {filteredPeople.length} dari {people.length} kerabat
          </span>
        </div>
      )}

      {/* Empty State */}
      {people.length === 0 ? (
        <div className="directory-empty-state">
          <div className="empty-avatar-icon">
            <UsersIcon size={44} />
          </div>
          <h3>Belum Ada Kerabat yang Terdaftar</h3>
          <p>
            Buka tab <strong>Kamera Deteksi</strong> dan hadapkan kamera ke wajah kerabat. 
            Sistem akan secara otomatis memotong foto wajah dan mendengarkan nama melalui ucapan pendamping.
          </p>
        </div>
      ) : filteredPeople.length === 0 ? (
        <div className="no-search-results">
          <AlertCircleIcon size={32} />
          <p>Tidak ditemukan kerabat dengan kata kunci "<strong>{searchQuery}</strong>".</p>
        </div>
      ) : (
        /* Family Profile Cards Grid */
        <div className="directory-grid">
          {filteredPeople.map((person) => (
            <div
              key={person.id}
              className="family-card"
              onClick={() => setSelectedPerson(person)}
            >
              <div className="family-card-img-wrap">
                <img src={person.imageData} alt={person.name} className="family-card-img" />
                <span className="relation-tag-badge">{person.relation}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(person.id, person.name);
                  }}
                  className="btn-card-delete"
                  title="Hapus profil ini"
                >
                  <TrashIcon size={15} />
                </button>
              </div>

              <div className="family-card-body">
                <h4 className="family-name">{person.name}</h4>
                <div className="family-meta-row">
                  <span className="meta-label">Terakhir terdeteksi:</span>
                  <span className="meta-val">{formatDate(person.lastSeen)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Person Detail Modal */}
      {selectedPerson && (
        <div className="detail-modal-backdrop" onClick={() => setSelectedPerson(null)}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="detail-modal-header">
              <div className="modal-title-row">
                <UserCheckIcon size={20} className="icon-emerald" />
                <h3>Detail Profil Kerabat</h3>
              </div>
              <button className="btn-close-modal" onClick={() => setSelectedPerson(null)}>
                <CloseIcon size={18} />
              </button>
            </div>

            <div className="detail-modal-body">
              <div className="detail-img-col">
                <img src={selectedPerson.imageData} alt={selectedPerson.name} className="detail-img" />
                <div className="biometric-verified-chip">
                  <ShieldCheckIcon size={14} />
                  <span>Vektor 128-D Terenkripsi Lokal</span>
                </div>
              </div>

              <div className="detail-info-col">
                <h2 className="detail-person-name">{selectedPerson.name}</h2>
                <div className="detail-badge-row">
                  <span className="relation-badge-large">{selectedPerson.relation}</span>
                </div>

                <div className="detail-meta-list">
                  <div className="meta-item">
                    <span className="meta-key">ID Sistem Biometrik:</span>
                    <span className="meta-code">{selectedPerson.id}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-key">Tanggal Didaftarkan:</span>
                    <span className="meta-data">{formatDate(selectedPerson.addedDate)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-key">Waktu Terakhir Terlihat:</span>
                    <span className="meta-data">{formatDate(selectedPerson.lastSeen)}</span>
                  </div>
                </div>

                <div className="detail-modal-actions">
                  <button 
                    className="btn-modal-delete"
                    onClick={() => handleDelete(selectedPerson.id, selectedPerson.name)}
                  >
                    <TrashIcon size={16} />
                    <span>Hapus Profil Ini</span>
                  </button>
                  <button 
                    className="btn-modal-close"
                    onClick={() => setSelectedPerson(null)}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeopleList;
