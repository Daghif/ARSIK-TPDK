import { useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { HeartPulseIcon, ShieldCheckIcon, CheckCircleIcon } from './Icons';
import './SplashScreen.css';

const SplashScreen = ({ onReady }) => {
  const [progress, setProgress] = useState(15);
  const [stepText, setStepText] = useState('Menyiapkan sistem pengenalan wajah...');
  const [isExiting, setIsExiting] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadAllModels = async () => {
      try {
        const MODEL_URL = '/models';

        if (mounted) {
          setProgress(32);
          setStepText('Memuat pendeteksi wajah (TinyFaceDetector)...');
        }
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);

        if (mounted) {
          setProgress(68);
          setStepText('Memuat pemetaan titik wajah (Landmark 68)...');
        }
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);

        if (mounted) {
          setProgress(92);
          setStepText('Menyiapkan pengenal identitas kerabat...');
        }
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

        if (mounted) {
          setProgress(100);
          setStepText('Sistem siap digunakan.');
          setTimeout(() => {
            if (!mounted) return;
            setIsExiting(true);
            setTimeout(() => {
              if (mounted && onReady) onReady(true);
            }, 190);
          }, 550);
        }
      } catch (err) {
        console.error('Gagal memuat model AI dari /models:', err);
        if (mounted) {
          setLoadError(
            'Berkas model pengenalan wajah belum lengkap. Anda tetap dapat masuk ke aplikasi.'
          );
          setProgress(100);
        }
      }
    };

    loadAllModels();
    return () => {
      mounted = false;
    };
  }, [onReady]);

  const handleManualContinue = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onReady) onReady(false);
    }, 180);
  };

  return (
    <div className={`arsik-splash ${isExiting ? 'splash-exit' : ''}`} role="status" aria-live="polite">
      <div className="splash-card">
        {/* Foto Asli Keluarga & Lansia (Bukan AI, memberikan kehangatan manusiawi) */}
        <div className="splash-photo-banner">
          <img
            src="/images/splash-family.jpg"
            alt="Kedekatan nenek dan cucu dalam keluarga"
            className="splash-photo-img"
          />
          <div className="splash-photo-overlay">
            <span className="splash-institution-badge">
              II4051 Rekayasa Sistem Multimedia • STEI ITB
            </span>
          </div>
        </div>

        <div className="splash-content-body">
          {/* Identitas Aplikasi */}
          <div className="splash-hero">
            <div className="splash-brand-inline">
              <div className="splash-logo-box" aria-hidden="true">
                <HeartPulseIcon size={26} />
              </div>
              <div className="splash-brand-titles">
                <h1 className="splash-title">ARSIK</h1>
                <p className="splash-acronym">
                  Aplikasi Rekayasa Sistem Identifikasi Kerabat
                </p>
              </div>
            </div>

            <p className="splash-tagline">
              Membantu lansia mengenali wajah anak, cucu, dan kerabat terdekat secara langsung melalui kamera dan suara.
            </p>
          </div>

          {/* Progres Pemuatan Model (Doherty Threshold Feedback) */}
          <div className="splash-progress-section">
            <div className="splash-progress-header">
              <span className="splash-step-label">{stepText}</span>
              <span className="splash-percent">{progress}%</span>
            </div>
            <div className="splash-progress-track" aria-hidden="true">
              <div
                className="splash-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            {progress === 100 && !loadError && (
              <div className="splash-ready-pill">
                <CheckCircleIcon size={18} />
                <span>Model Pengenalan Wajah Siap</span>
              </div>
            )}

            {loadError && (
              <div className="splash-error-box">
                <p>{loadError}</p>
                <button
                  type="button"
                  onClick={handleManualContinue}
                  className="splash-continue-btn arsik-btn-interactive"
                >
                  Masuk ke Aplikasi
                </button>
              </div>
            )}
          </div>

          {/* Jaminan Privasi Lokal (SK-NF03) */}
          <div className="splash-privacy-box">
            <ShieldCheckIcon size={20} className="splash-privacy-icon" />
            <div className="splash-privacy-text">
              <strong>100% Privasi Perangkat Lokal</strong>
              <span>
                Foto dan data wajah keluarga tersimpan aman di HP ini dan tidak pernah dikirim ke internet.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
