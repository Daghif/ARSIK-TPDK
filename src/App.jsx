import { useState, useEffect } from 'react';
import FaceRecognition from './components/FaceRecognition';
import PeopleList from './components/PeopleList';
import { CameraIcon, UsersIcon, HeartPulseIcon } from './components/Icons';
import { getPeople } from './utils/faceStorage';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('detection');
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [peopleCount, setPeopleCount] = useState(0);

  useEffect(() => {
    const people = getPeople();
    setPeopleCount(people.length);
  }, [updateTrigger, activeTab]);

  return (
    <div className="arsik-app">
      {/* Top Header Bar */}
      <header className="arsik-header">
        <div className="header-container">
          <div className="brand-group">
            <div className="brand-badge">
              <HeartPulseIcon size={22} className="brand-icon" />
            </div>
            <div className="brand-text">
              <div className="brand-title-row">
                <h1 className="brand-name">ARSIK</h1>
                <span className="brand-tag">v2.0 Asistif</span>
              </div>
              <p className="brand-desc">Asisten Pengenal Wajah Real-Time Berbantu Suara untuk Lansia Demensia</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs-wrapper">
          <div className="nav-tabs">
            <button 
              className={`nav-tab ${activeTab === 'detection' ? 'active' : ''}`}
              onClick={() => setActiveTab('detection')}
            >
              <CameraIcon size={18} />
              <span>Kamera Deteksi</span>
            </button>
            <button 
              className={`nav-tab ${activeTab === 'people' ? 'active' : ''}`}
              onClick={() => setActiveTab('people')}
            >
              <UsersIcon size={18} />
              <span>Daftar Kerabat</span>
              {peopleCount > 0 && <span className="tab-counter">{peopleCount}</span>}
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="arsik-main">
        {activeTab === 'detection' ? (
          <FaceRecognition onPersonAdded={() => setUpdateTrigger(prev => prev + 1)} />
        ) : (
          <PeopleList onUpdate={() => setUpdateTrigger(prev => prev + 1)} />
        )}
      </main>

      {/* Dignified Assistive Footer */}
      <footer className="arsik-footer">
        <div className="footer-content">
          <p className="footer-hint">
            <strong>Panduan Penggunaan:</strong> Letakkan perangkat di atas meja menghadap lawan bicara lansia. Wajah kerabat akan dikenali secara otomatis dan identitas akan ditampilkan dengan teks kontras tinggi tanpa perlu menekan tombol apa pun.
          </p>
          <div className="footer-credits">
            <span>II4051 Rekayasa Sistem Multimedia • Institut Teknologi Bandung</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
