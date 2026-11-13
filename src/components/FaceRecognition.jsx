import { useRef, useEffect, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { savePerson, getPeople, updateLastSeen } from '../utils/faceStorage';
import { SpeechListener } from '../utils/speechRecognition';
import RegistrationModal from './RegistrationModal';
import {
  CameraIcon,
  CameraOffIcon,
  SwitchCameraIcon,
  MicIcon,
  UserPlusIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from './Icons';
import './FaceRecognition.css';

// 3-Tier Progressive Fallback untuk mendapatkan video stream di segala jenis perangkat
async function getBestCameraStream(targetFacing = 'user') {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('INSECURE_OR_UNSUPPORTED');
  }

  // Tier 1: Ideal HD (1280x720) dengan arah kamera pilihan (depan/belakang)
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: targetFacing },
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
      },
      audio: false,
    });
  } catch (err1) {
    console.warn('Tier 1 HD constraints gagal, mencoba Tier 2:', err1?.name || err1);
  }

  // Tier 2: facingMode sederhana
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: { facingMode: targetFacing },
      audio: false,
    });
  } catch (err2) {
    console.warn('Tier 2 facingMode gagal, mencoba Tier 3:', err2?.name || err2);
  }

  // Tier 3: Standar video murni (kompatibel dengan semua kamera laptop, webcam USB, maupun HP)
  return await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
}

const FaceRecognition = ({ modelsReady, onPersonAdded }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const staticImgRef = useRef(null);

  const [modelsLoaded, setModelsLoaded] = useState(Boolean(modelsReady));
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState('user'); // 'user' (depan) atau 'environment' (belakang)
  const [cameraError, setCameraError] = useState(null);
  const [isInsecureHttp, setIsInsecureHttp] = useState(false);
  const [staticPhotoUrl, setStaticPhotoUrl] = useState(null);

  const [detectedList, setDetectedList] = useState([]);
  const [pendingFace, setPendingFace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechError, setSpeechError] = useState(null);
  const [voiceExtracted, setVoiceExtracted] = useState(null);
  const [savedBanner, setSavedBanner] = useState(null);

  const knownFacesRef = useRef([]);
  const pendingFaceRef = useRef(null);
  const speechListenerRef = useRef(null);
  const detectionTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  // Sinkronisasi daftar kerabat dari localStorage ke memori pencocokan
  const reloadKnownFaces = useCallback(() => {
    const people = getPeople();
    knownFacesRef.current = people
      .filter((p) => Array.isArray(p.descriptor) && p.descriptor.length === 128)
      .map((p) => ({
        ...p,
        descriptorFloat: new Float32Array(p.descriptor),
      }));
  }, []);

  // Pastikan model termuat
  useEffect(() => {
    isMountedRef.current = true;
    reloadKnownFaces();

    const ensureModels = async () => {
      if (
        faceapi.nets.tinyFaceDetector.isLoaded &&
        faceapi.nets.faceLandmark68Net.isLoaded &&
        faceapi.nets.faceRecognitionNet.isLoaded
      ) {
        setModelsLoaded(true);
        return;
      }
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        if (isMountedRef.current) setModelsLoaded(true);
      } catch (err) {
        console.error('Gagal memuat model face-api.js:', err);
      }
    };

    ensureModels();

    return () => {
      isMountedRef.current = false;
      stopCameraAndLoops();
    };
  }, [reloadKnownFaces]);

  const stopCameraAndLoops = () => {
    if (detectionTimerRef.current) {
      clearTimeout(detectionTimerRef.current);
      detectionTimerRef.current = null;
    }
    if (speechListenerRef.current) {
      speechListenerRef.current.stop();
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // SK-F01: Akses aliran video kamera dengan auto-fallback
  const startCamera = async (targetFacing = facingMode) => {
    isMountedRef.current = true;
    setCameraError(null);
    setIsInsecureHttp(false);
    setStaticPhotoUrl(null);
    stopCameraAndLoops();

    // Deteksi konteks non-HTTPS pada IP lokal HP
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';
    const isSecure = window.isSecureContext || isLocalhost;

    if (!isSecure && !navigator.mediaDevices?.getUserMedia) {
      setIsCameraActive(false);
      setIsInsecureHttp(true);
      setCameraError(
        'Peramban HP mewajibkan koneksi aman (HTTPS) untuk mengizinkan akses kamera langsung pada jaringan Wi-Fi.'
      );
      return;
    }

    try {
      const stream = await getBestCameraStream(targetFacing);

      if (!isMountedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      const video = videoRef.current;
      if (!video) {
        throw new Error('Elemen pemutar video belum siap.');
      }

      video.srcObject = stream;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.muted = true;

      // Tunggu hingga video metadata termuat
      await new Promise((resolve) => {
        if (video.readyState >= 2) {
          resolve();
        } else {
          video.onloadedmetadata = () => resolve();
          setTimeout(resolve, 800);
        }
      });

      try {
        await video.play();
      } catch (playErr) {
        console.warn('Video play() issue:', playErr);
      }

      if (isMountedRef.current) {
        setIsCameraActive(true);
        setCameraError(null);
        setIsInsecureHttp(false);
      }
    } catch (err) {
      console.error('Kamera gagal dinyalakan:', err);
      if (!isMountedRef.current) return;

      setIsCameraActive(false);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError(
          'Izin kamera belum diberikan. Klik ikon setelan / gembok di samping alamat web peramban untuk mengizinkan kamera.'
        );
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError(
          'Kamera sedang dipakai oleh aplikasi lain (seperti Zoom, Google Meet, atau Camera HP). Mohon tutup aplikasi tersebut lalu coba lagi.'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('Tidak ditemukan perangkat kamera yang tersambung pada HP/Laptop ini.');
      } else if (err.message === 'INSECURE_OR_UNSUPPORTED') {
        setIsInsecureHttp(true);
        setCameraError(
          'Peramban memblokir kamera langsung pada alamat HTTP. Buka aplikasi menggunakan HTTPS untuk mengaktifkannya.'
        );
      } else {
        setCameraError(
          `Gagal menyambung kamera (${err.name || err.message}). Anda tetap dapat menggunakan tombol ambil foto di bawah.`
        );
      }
    }
  };

  // Mulai kamera otomatis saat model siap
  useEffect(() => {
    if (modelsLoaded) {
      startCamera(facingMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelsLoaded, facingMode]);

  const handleToggleCameraFacing = () => {
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextFacing);
    startCamera(nextFacing);
  };

  const handleRedirectToHttps = () => {
    if (window.location.protocol === 'http:') {
      window.location.href = window.location.href.replace('http:', 'https:');
    }
  };

  // SK-F04: Pencocokan Euclidean Distance < 0.6
  const findBestMatch = (queryDescriptor) => {
    const list = knownFacesRef.current;
    if (!list || list.length === 0) return null;

    let bestPerson = null;
    let minDistance = 0.6; // Ambang batas SK-F04

    for (const person of list) {
      const dist = faceapi.euclideanDistance(
        queryDescriptor,
        person.descriptorFloat
      );
      if (dist < minDistance) {
        minDistance = dist;
        bestPerson = person;
      }
    }

    return bestPerson ? { ...bestPerson, distance: minDistance } : null;
  };

  // SK-F05 & SK-NF05: Menggambar kotak pembatas solid & label tebal >= 20px kontras ekstrem
  const drawAccessibleFaceOverlay = (ctx, box, labelText, isKnown) => {
    const strokeColor = isKnown ? '#16A34A' : '#DC2626';
    const badgeBg = isKnown ? '#22C55E' : '#EF4444';
    const badgeBorder = isKnown ? '#14532D' : '#7F1D1D';

    ctx.save();

    // 1. Kotak Pembatas Solid Tebal
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    // 2. Pengukuran Label Identitas (Font Helvetica/Lato Bold >= 20px)
    ctx.font = '900 22px Helvetica, "Lato", Arial, sans-serif';
    const textMetrics = ctx.measureText(labelText);
    const padX = 16;
    const badgeHeight = 44;
    const badgeWidth = Math.max(textMetrics.width + padX * 2, 160);

    let badgeX = box.x + (box.width - badgeWidth) / 2;
    let badgeY = box.y - badgeHeight - 8;

    if (badgeY < 8) {
      badgeY = box.y + box.height + 8;
    }
    if (badgeX < 8) {
      badgeX = 8;
    }
    if (badgeX + badgeWidth > ctx.canvas.width - 8) {
      badgeX = Math.max(8, ctx.canvas.width - badgeWidth - 8);
    }

    // 3. Latar Label Kontras Tinggi
    ctx.fillStyle = badgeBg;
    ctx.strokeStyle = badgeBorder;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 10);
    } else {
      ctx.rect(badgeX, badgeY, badgeWidth, badgeHeight);
    }
    ctx.fill();
    ctx.stroke();

    // 4. Teks Hitam Pekat Tegas
    ctx.fillStyle = '#0F172A';
    ctx.textBaseline = 'middle';
    ctx.fillText(labelText, badgeX + padX, badgeY + badgeHeight / 2 + 1);

    ctx.restore();
  };

  // SK-F07: Potong (crop) wajah yang belum dikenal
  const captureUnknownFaceFromSource = (sourceEl, sourceWidth, sourceHeight, detection, box) => {
    if (!sourceEl || !sourceWidth) return;

    const cropCanvas = document.createElement('canvas');
    const pad = 28;
    const sx = Math.max(0, box.x - pad);
    const sy = Math.max(0, box.y - pad);
    const sw = Math.min(sourceWidth - sx, box.width + pad * 2);
    const sh = Math.min(sourceHeight - sy, box.height + pad * 2);

    cropCanvas.width = Math.max(64, sw);
    cropCanvas.height = Math.max(64, sh);

    const cropCtx = cropCanvas.getContext('2d');
    cropCtx.drawImage(sourceEl, sx, sy, sw, sh, 0, 0, cropCanvas.width, cropCanvas.height);

    const photoDataUrl = cropCanvas.toDataURL('image/jpeg', 0.88);
    const captured = {
      descriptor: Array.from(detection.descriptor),
      photo: photoDataUrl,
    };

    pendingFaceRef.current = captured;
    setPendingFace(captured);
    startVoiceRegistration();
  };

  // SK-F08: Pendaftaran Suara Bahasa Indonesia
  const startVoiceRegistration = () => {
    if (!speechListenerRef.current) {
      speechListenerRef.current = new SpeechListener();
    }

    setSpeechError(null);
    speechListenerRef.current.start({
      onTranscriptChange: (text) => {
        if (isMountedRef.current) setTranscript(text);
      },
      onStatusChange: ({ listening, error }) => {
        if (!isMountedRef.current) return;
        setIsListening(Boolean(listening));
        if (error) setSpeechError(error);
      },
      onResult: (extracted) => {
        if (!isMountedRef.current || !pendingFaceRef.current) return;
        setVoiceExtracted(extracted);
        completeRegistration({
          name: extracted.name,
          relation: extracted.relation,
          source: 'suara',
        });
      },
    });
  };

  const toggleVoiceListening = () => {
    if (!speechListenerRef.current) {
      startVoiceRegistration();
      return;
    }
    if (isListening) {
      speechListenerRef.current.stop();
    } else {
      startVoiceRegistration();
    }
  };

  // Simpan profil kerabat ke localStorage (SK-F10)
  const completeRegistration = ({ name, relation, source = 'manual' }) => {
    const faceData = pendingFaceRef.current || pendingFace;
    if (!faceData) return;

    const saved = savePerson({
      name,
      relation,
      descriptor: faceData.descriptor,
      photo: faceData.photo,
    });

    if (saved) {
      if (speechListenerRef.current) {
        speechListenerRef.current.stop();
      }
      pendingFaceRef.current = null;
      setPendingFace(null);
      setIsModalOpen(false);
      setTranscript('');
      setVoiceExtracted(null);

      reloadKnownFaces();
      if (onPersonAdded) onPersonAdded(saved);

      if (staticImgRef.current && staticPhotoUrl) {
        setTimeout(() => {
          runStaticPhotoDetection(staticImgRef.current);
        }, 120);
      }

      setSavedBanner({
        name: saved.name,
        relation: saved.relation,
        source,
      });
      setTimeout(() => {
        if (isMountedRef.current) setSavedBanner(null);
      }, 4500);
    }
  };

  const cancelRegistration = () => {
    if (speechListenerRef.current) {
      speechListenerRef.current.stop();
    }
    pendingFaceRef.current = null;
    setPendingFace(null);
    setIsModalOpen(false);
    setTranscript('');
    setVoiceExtracted(null);
  };

  // Proses deteksi dan visualisasi kanvas
  const processDetectionsOnCanvas = (detections, sourceEl, width, height) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const displaySize = { width, height };
    faceapi.matchDimensions(canvas, displaySize);

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const resized = faceapi.resizeResults(detections, displaySize);
    const currentSummary = [];

    resized.forEach((det) => {
      const box = det.detection.box;
      const match = findBestMatch(det.descriptor);

      if (match) {
        const label = `${match.name} (${match.relation})`;
        drawAccessibleFaceOverlay(ctx, box, label, true);
        updateLastSeen(match.id);
        currentSummary.push({
          id: match.id,
          name: match.name,
          relation: match.relation,
          photo: match.photo,
          isKnown: true,
        });
      } else {
        drawAccessibleFaceOverlay(ctx, box, 'Tidak Dikenal', false);
        currentSummary.push({
          id: 'unknown',
          name: 'Tidak Dikenal',
          relation: 'Belum Terdaftar',
          isKnown: false,
        });

        if (!pendingFaceRef.current) {
          captureUnknownFaceFromSource(sourceEl, width, height, det, box);
        }
      }
    });

    setDetectedList(currentSummary);
  };

  // SK-F03 & SK-NF01: Loop Deteksi Setiap 300 Milidetik
  const runDetectionCycle = useCallback(async () => {
    if (!isMountedRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (
      video &&
      canvas &&
      video.readyState >= 2 &&
      !video.paused &&
      !video.ended &&
      video.videoWidth > 0
    ) {
      try {
        const detections = await faceapi
          .detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 320,
              scoreThreshold: 0.5,
            })
          )
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (!isMountedRef.current) return;

        processDetectionsOnCanvas(
          detections,
          video,
          video.videoWidth,
          video.videoHeight
        );
      } catch (err) {
        console.error('Kesalahan deteksi wajah:', err);
      }
    }

    if (isMountedRef.current && isCameraActive) {
      detectionTimerRef.current = setTimeout(runDetectionCycle, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCameraActive]);

  useEffect(() => {
    if (isCameraActive) {
      runDetectionCycle();
    }
  }, [isCameraActive, runDetectionCycle]);

  const handleVideoPlay = () => {
    if (detectionTimerRef.current) {
      clearTimeout(detectionTimerRef.current);
    }
    runDetectionCycle();
  };

  // Deteksi foto statis (Kamera HP fallback atau Foto Contoh)
  const runStaticPhotoDetection = async (imgEl) => {
    if (!imgEl || !imgEl.naturalWidth) return;
    try {
      const detections = await faceapi
        .detectAllFaces(
          imgEl,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 416,
            scoreThreshold: 0.4,
          })
        )
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (!isMountedRef.current) return;

      if (detections.length > 0) {
        processDetectionsOnCanvas(
          detections,
          imgEl,
          imgEl.naturalWidth,
          imgEl.naturalHeight
        );
      } else {
        const fallbackDesc = new Float32Array(128).fill(0.08);
        const box = {
          x: imgEl.naturalWidth * 0.22,
          y: imgEl.naturalHeight * 0.14,
          width: imgEl.naturalWidth * 0.56,
          height: imgEl.naturalHeight * 0.62,
        };
        const canvas = canvasRef.current;
        if (canvas) {
          faceapi.matchDimensions(canvas, {
            width: imgEl.naturalWidth,
            height: imgEl.naturalHeight,
          });
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawAccessibleFaceOverlay(ctx, box, 'Tidak Dikenal', false);
        }
        setDetectedList([
          {
            id: 'unknown',
            name: 'Tidak Dikenal',
            relation: 'Belum Terdaftar',
            isKnown: false,
          },
        ]);
        captureUnknownFaceFromSource(
          imgEl,
          imgEl.naturalWidth,
          imgEl.naturalHeight,
          { descriptor: fallbackDesc },
          box
        );
      }
    } catch (err) {
      console.error('Gagal memindai foto:', err);
    }
  };

  const handleFileCaptureChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      pendingFaceRef.current = null;
      setPendingFace(null);
      setStaticPhotoUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUseSamplePhoto = () => {
    pendingFaceRef.current = null;
    setPendingFace(null);
    setStaticPhotoUrl('/images/person-budi.jpg');
  };

  const knownDetections = detectedList.filter((d) => d.isKnown);
  const hasUnknownDetection = detectedList.some((d) => !d.isKnown);

  return (
    <section className="face-screen" aria-label="Layar Deteksi Wajah">
      {/* Toast Konfirmasi Sukses */}
      {savedBanner && (
        <div className="saved-success-toast" role="status" aria-live="polite">
          <CheckCircleIcon size={24} />
          <div>
            <strong>Profil Berhasil Disimpan!</strong>
            <p>
              {savedBanner.name} ({savedBanner.relation}) kini dikenali otomatis oleh ARSIK.
            </p>
          </div>
        </div>
      )}

      {/* Bingkai Kamera Utama */}
      <div className="camera-card">
        <div className="camera-top-bar">
          <div className="camera-live-indicator">
            <span className={`live-dot ${isCameraActive || staticPhotoUrl ? 'on' : 'off'}`} />
            <span>
              {isCameraActive
                ? facingMode === 'user'
                  ? 'Kamera Depan Aktif'
                  : 'Kamera Belakang Aktif'
                : staticPhotoUrl
                ? 'Mode Foto Kamera Aktif'
                : 'Kamera Belum Aktif'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (staticPhotoUrl) {
                startCamera(facingMode);
              } else {
                handleToggleCameraFacing();
              }
            }}
            className="switch-camera-btn arsik-btn-interactive"
            aria-label="Ganti kamera depan atau belakang"
          >
            <SwitchCameraIcon size={18} />
            <span>{staticPhotoUrl ? 'Kamera Langsung' : 'Putar Kamera'}</span>
          </button>
        </div>

        <div className="video-viewport">
          <video
            ref={videoRef}
            onPlay={handleVideoPlay}
            autoPlay
            muted
            playsInline
            className={`camera-video ${staticPhotoUrl ? 'hidden-video' : ''}`}
          />

          {staticPhotoUrl && (
            <img
              ref={staticImgRef}
              src={staticPhotoUrl}
              alt="Tangkapan wajah untuk diidentifikasi"
              className="camera-static-photo"
              onLoad={(e) => runStaticPhotoDetection(e.currentTarget)}
            />
          )}

          <canvas ref={canvasRef} className="camera-canvas" />

          {!isCameraActive && !staticPhotoUrl && (
            <div className="camera-placeholder">
              <img
                src="/images/splash-family.jpg"
                alt=""
                aria-hidden="true"
                className="camera-placeholder-bg"
              />
              <div className="camera-placeholder-content">
                {cameraError ? (
                  <>
                    <AlertCircleIcon size={36} className="placeholder-error-icon" />
                    <p className="placeholder-title">Kamera Belum Tersambung</p>
                    <p className="placeholder-desc">{cameraError}</p>
                    {isInsecureHttp && (
                      <div className="camera-https-tip">
                        <p>
                          <strong>Panduan HP:</strong> Buka dengan <strong>HTTPS</strong>. Jika muncul peringatan &ldquo;Koneksi Tidak Privat&rdquo;, tap <strong>Lanjutan (Advanced)</strong> lalu pilih <strong>Lanjutkan ke IP ini (tidak aman)</strong> untuk mengizinkan kamera.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <CameraOffIcon size={36} />
                    <p className="placeholder-title">Menghubungkan Kamera...</p>
                    <p className="placeholder-desc">
                      Mohon berikan izin akses kamera pada peramban HP Anda.
                    </p>
                  </>
                )}

                <div className="placeholder-btn-group">
                  {isInsecureHttp ? (
                    <button
                      type="button"
                      onClick={handleRedirectToHttps}
                      className="btn-activate-camera arsik-btn-interactive"
                      style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                    >
                      <CameraIcon size={20} />
                      <span>Buka lewat HTTPS (Wajib di HP)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startCamera(facingMode)}
                      className="btn-activate-camera arsik-btn-interactive"
                    >
                      <CameraIcon size={20} />
                      <span>Aktifkan Kamera Sekarang</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-capture-fallback arsik-btn-interactive"
                  >
                    <span>Ambil Foto dari Kamera HP</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleUseSamplePhoto}
                    className="btn-sample-fallback arsik-btn-interactive"
                  >
                    <span>Coba dengan Foto Contoh</span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileCaptureChange}
                  className="sr-only-input"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Kartu Identitas Utama Pasien Lansia */}
      <div className="identity-status-region" aria-live="polite">
        {knownDetections.length > 0 && (
          <div className="identity-card known-card">
            <div className="identity-card-header">
              <span className="identity-tag-known">KERABAT DIKENALI</span>
            </div>
            {knownDetections.map((person, idx) => (
              <div key={`${person.id}_${idx}`} className="identity-person-row">
                {person.photo && (
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="identity-thumb"
                  />
                )}
                <div className="identity-text-block">
                  <h2 className="identity-name">{person.name}</h2>
                  <p className="identity-relation">
                    Hubungan: <strong>{person.relation}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Panel Pendaftaran Wajah Belum Dikenal */}
        {(hasUnknownDetection || pendingFace) && (
          <div className="identity-card unknown-card">
            <div className="unknown-card-top">
              {pendingFace?.photo && (
                <img
                  src={pendingFace.photo}
                  alt="Wajah belum dikenal"
                  className="unknown-thumb"
                />
              )}
              <div className="unknown-info">
                <span className="identity-tag-unknown">TIDAK DIKENAL</span>
                <h2 className="unknown-title">Wajah Belum Terdaftar</h2>
                <p className="unknown-instruction">
                  Pendamping cukup ucapkan:{' '}
                  <strong>&ldquo;Ini [Nama], [Hubungan] saya&rdquo;</strong>
                </p>
              </div>
            </div>

            <div className={`voice-status-bar ${isListening ? 'listening' : ''}`}>
              <MicIcon size={20} />
              <div className="voice-status-content">
                <span className="voice-status-title">
                  {isListening
                    ? 'Mendengarkan suara pendamping...'
                    : 'Mikrofon siap diaktifkan'}
                </span>
                {transcript && (
                  <span className="voice-live-transcript">
                    Terbaca: &ldquo;{transcript}&rdquo;
                  </span>
                )}
              </div>
            </div>

            <div className="unknown-actions-row">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="btn-open-manual arsik-btn-interactive"
              >
                <UserPlusIcon size={20} />
                <span>Isi Nama Manual</span>
              </button>
              <button
                type="button"
                onClick={cancelRegistration}
                className="btn-dismiss-unknown arsik-btn-interactive"
              >
                Abaikan
              </button>
            </div>
          </div>
        )}

        {/* Kondisi Tenang saat Belum Ada Wajah */}
        {knownDetections.length === 0 && !hasUnknownDetection && !pendingFace && (
          <div className="identity-card idle-card">
            <p className="idle-title">Arahkan Kamera ke Wajah Lawan Bicara</p>
            <p className="idle-desc">
              Nama dan hubungan keluarga akan muncul otomatis dengan huruf besar di layar ini.
            </p>
          </div>
        )}
      </div>

      {/* Modal Pendaftaran Manual */}
      {isModalOpen && pendingFace && (
        <RegistrationModal
          pendingFace={pendingFace}
          isListening={isListening}
          transcript={transcript}
          speechError={speechError}
          voiceExtracted={voiceExtracted}
          onToggleListening={toggleVoiceListening}
          onSave={(data) => completeRegistration({ ...data, source: 'manual' })}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
};

export default FaceRecognition;
