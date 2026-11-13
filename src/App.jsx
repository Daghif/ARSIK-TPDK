import { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import FaceRecognition from './components/FaceRecognition';
import PeopleList from './components/PeopleList';
import {
  CameraIcon,
  UsersIcon,
  HeartPulseIcon,
  ShieldCheckIcon,
} from './components/Icons';
import { getPeople } from './utils/faceStorage';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [modelsReady, setModelsReady] = useState(false);
  const [activeTab, setActiveTab] = useState('detection'); // Hanya 2 Tab sesuai SK-NF06
  const [peopleCount, setPeopleCount] = useState(() => getPeople().length);

  const refreshPeopleCount = () => {
    const list = getPeople();
    setPeopleCount(list.length);
  };

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    refreshPeopleCount();
  };

  // Layar Pembuka (Splash Screen) saat memuat model face-api.js
  if (showSplash) {
    return (
      <SplashScreen
        onReady={(loaded) => {
          setModelsReady(Boolean(loaded));
          setShowSplash(false);
        }}
      />
    );
  }

  return (
    <div className="arsik-viewport-bg">
      <div className="arsik-mobile-shell">
        {/* Header Bar Bersih & Bermartabat */}
        <header className="arsik-top-header">
          <div className="header-brand">
            <div className="header-logo-badge" aria-hidden="true">
              <HeartPulseIcon size={22} />
            </div>
            <div className="header-titles">
              <h1 className="header-app-name">ARSIK</h1>
              <p className="header-app-subtitle">Asisten Pengenal Kerabat</p>
            </div>
          </div>

          <div className="header-privacy-pill" title="Data Wajah Tersimpan 100% Lokal di HP Ini">
            <ShieldCheckIcon size={15} />
            <span>100% Lokal</span>
          </div>
        </header>

        {/* Area Konten Utama */}
        <main className="arsik-main-content">
          {activeTab === 'detection' ? (
            <FaceRecognition
              modelsReady={modelsReady}
              onPersonAdded={refreshPeopleCount}
            />
          ) : (
            <PeopleList onUpdate={refreshPeopleCount} />
          )}
        </main>

        {/* Navigasi Bawah 2-Tab Ramah Jempol (Fitts's Law, Hick's Law, & SK-NF06) */}
        <nav className="arsik-bottom-nav" aria-label="Navigasi Utama">
          <div
            className="bottom-nav-indicator"
            style={{
              transform:
                activeTab === 'detection' ? 'translateX(0%)' : 'translateX(100%)',
            }}
            aria-hidden="true"
          />

          <button
            type="button"
            onClick={() => handleSelectTab('detection')}
            className={`bottom-nav-tab arsik-btn-interactive ${
              activeTab === 'detection' ? 'active' : ''
            }`}
            aria-current={activeTab === 'detection' ? 'page' : undefined}
          >
            <CameraIcon size={22} />
            <span>Kamera Deteksi</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('people')}
            className={`bottom-nav-tab arsik-btn-interactive ${
              activeTab === 'people' ? 'active' : ''
            }`}
            aria-current={activeTab === 'people' ? 'page' : undefined}
          >
            <UsersIcon size={22} />
            <span>Daftar Kerabat</span>
            {peopleCount > 0 && (
              <span className="nav-count-badge">{peopleCount}</span>
            )}
          </button>
        </nav>
      </div>
    </div>
  );
}

export default App;
