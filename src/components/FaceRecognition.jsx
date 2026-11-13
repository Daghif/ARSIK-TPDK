import { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { savePerson, getPeople, updateLastSeen } from '../utils/faceStorage';
import { SpeechListener } from '../utils/speechRecognition';
import { speakPerson, stopSpeaking, isTtsSupported } from '../utils/textToSpeech';
import { 
  CameraIcon, 
  CameraOffIcon, 
  MicIcon, 
  UserPlusIcon, 
  CloseIcon, 
  PlayIcon, 
  StopIcon, 
  AlertCircleIcon,
  RefreshIcon,
  Volume2Icon,
  VolumeXIcon
} from './Icons';
import './FaceRecognition.css';

const FaceRecognition = ({ onPersonAdded }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [knownFaces, setKnownFaces] = useState([]);
  const [detectedFaces, setDetectedFaces] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [pendingFace, setPendingFace] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [cameraError, setCameraError] = useState(null);
  const [ttsEnabled, setTtsEnabled] = useState(() => isTtsSupported());
  
  const speechListener = useRef(null);
  const detectionInterval = useRef(null);
  const pendingFaceRef = useRef(null);
  const ttsEnabledRef = useRef(ttsEnabled);

  // Load face-api models from /models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (error) {
        console.error('Gagal memuat model face-api:', error);
      }
    };
    loadModels();
  }, []);

  // Load known faces from storage
  useEffect(() => {
    loadKnownFaces();
  }, []);

  const loadKnownFaces = () => {
    const people = getPeople();
    const faces = people.map(person => ({
      ...person,
      descriptor: new Float32Array(person.descriptor),
    }));
    setKnownFaces(faces);
  };

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Kamera tidak dapat diakses:', error);
      setCameraError('Izin kamera tidak diberikan atau perangkat kamera sedang digunakan oleh aplikasi lain.');
      setIsCameraActive(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    stopDetection();
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Start face detection loop
  const startDetection = () => {
    if (!modelsLoaded) return;
    if (!isCameraActive) {
      startCamera().then(() => {
        setIsDetecting(true);
      });
      return;
    }
    setIsDetecting(true);
  };

  const toggleTts = () => {
    setTtsEnabled((prev) => {
      const next = !prev;
      ttsEnabledRef.current = next;
      if (!next) {
        stopSpeaking();
      }
      return next;
    });
  };

  const stopDetection = () => {
    setIsDetecting(false);
    stopSpeaking();
    if (detectionInterval.current) {
      clearTimeout(detectionInterval.current);
    }
    if (speechListener.current) {
      speechListener.current.stop();
      setIsListening(false);
    }
    // Clear canvas overlay
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setDetectedFaces([]);
  };

  // Helper: Draw Viewfinder Corner Brackets
  const drawViewfinderCorners = (ctx, box, color) => {
    const cornerLength = Math.min(box.width * 0.22, 32);
    const radius = 6;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(box.x, box.y + cornerLength);
    ctx.lineTo(box.x, box.y + radius);
    ctx.arcTo(box.x, box.y, box.x + radius, box.y, radius);
    ctx.lineTo(box.x + cornerLength, box.y);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(box.x + box.width - cornerLength, box.y);
    ctx.lineTo(box.x + box.width - radius, box.y);
    ctx.arcTo(box.x + box.width, box.y, box.x + box.width, box.y + radius, radius);
    ctx.lineTo(box.x + box.width, box.y + cornerLength);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(box.x, box.y + box.height - cornerLength);
    ctx.lineTo(box.x, box.y + box.height - radius);
    ctx.arcTo(box.x, box.y + box.height, box.x + radius, box.y + box.height, radius);
    ctx.lineTo(box.x + cornerLength, box.y + box.height);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(box.x + box.width - cornerLength, box.y + box.height);
    ctx.lineTo(box.x + box.width - radius, box.y + box.height);
    ctx.arcTo(box.x + box.width, box.y + box.height, box.x + box.width, box.y + box.height - radius, radius);
    ctx.lineTo(box.x + box.width, box.y + box.height - cornerLength);
    ctx.stroke();
  };

  // Helper: Draw Frosted Floating Nameplate
  const drawFrostedNameplate = (ctx, box, title, subtitle, isKnown) => {
    ctx.save();
    
    // Measurement
    ctx.font = 'bold 18px "Plus Jakarta Sans", -apple-system, sans-serif';
    const titleWidth = ctx.measureText(title).width;
    
    ctx.font = '600 13px "Plus Jakarta Sans", -apple-system, sans-serif';
    const subWidth = ctx.measureText(subtitle).width;
    
    const cardWidth = Math.max(titleWidth, subWidth) + 32;
    const cardHeight = 56;
    
    // Position card above face (with margin)
    let cardX = box.x + (box.width - cardWidth) / 2;
    let cardY = box.y - cardHeight - 14;
    
    // Edge bounds check
    if (cardY < 10) cardY = box.y + box.height + 14;
    if (cardX < 10) cardX = 10;
    if (cardX + cardWidth > ctx.canvas.width - 10) cardX = ctx.canvas.width - cardWidth - 10;

    // Card Background (Dark Frosted Glass Plate)
    const cardRadius = 10;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardWidth, cardHeight, cardRadius);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)'; // Slate 900 translucent
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.fill();

    // Card Border
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = isKnown ? '#10b981' : '#f59e0b'; // Emerald or Amber
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Render Name / Title (High Contrast Bold)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px "Plus Jakarta Sans", -apple-system, sans-serif';
    ctx.fillText(title, cardX + 16, cardY + 26);

    // Render Relation / Subtitle
    ctx.fillStyle = isKnown ? '#34d399' : '#fbbf24'; // Soft emerald or soft amber
    ctx.font = '600 13px "Plus Jakarta Sans", -apple-system, sans-serif';
    ctx.fillText(subtitle, cardX + 16, cardY + 45);

    ctx.restore();
  };

  // Main Detection Loop
  const detectFaces = async () => {
    if (!isDetecting || !videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === 4 && canvas) {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptors();

      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);
      
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const currentFaces = [];

      resizedDetections.forEach((detection) => {
        const bestMatch = findBestMatch(detection.descriptor);
        const box = detection.detection.box;
        const isKnown = !!bestMatch;

        if (isKnown) {
          drawViewfinderCorners(ctx, box, '#10b981'); // Emerald
          drawFrostedNameplate(ctx, box, bestMatch.name, `Hubungan: ${bestMatch.relation}`, true);
          updateLastSeen(bestMatch.id);
          currentFaces.push({ name: bestMatch.name, relation: bestMatch.relation, isKnown: true });

          // Announce recognized person via TTS (skipped while mic is actively listening)
          if (ttsEnabledRef.current && !speechListener.current?.isListening) {
            speakPerson(bestMatch);
          }
        } else {
          drawViewfinderCorners(ctx, box, '#f59e0b'); // Amber
          drawFrostedNameplate(ctx, box, 'Wajah Belum Terdaftar', 'Mendengarkan suara pendamping...', false);
          currentFaces.push({ name: 'Unknown', relation: 'Belum terdaftar', isKnown: false });

          // Auto-trigger registration if not already pending
          if (!pendingFace && !pendingFaceRef.current) {
            capturePendingFace(detection, box);
          }
        }
      });

      setDetectedFaces(currentFaces);
    }

    // Schedule next cycle (300 ms throttled)
    detectionInterval.current = setTimeout(detectFaces, 300);
  };

  // Matching algorithm (Euclidean Distance < 0.6)
  const findBestMatch = (descriptor) => {
    if (knownFaces.length === 0) return null;
    let bestMatch = null;
    let minDistance = 0.6; // Strict threshold

    knownFaces.forEach((known) => {
      const distance = faceapi.euclideanDistance(descriptor, known.descriptor);
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = known;
      }
    });

    return bestMatch;
  };

  // Capture Unknown Face for Registration
  const capturePendingFace = (detection, box) => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    const padding = 24;
    
    canvas.width = Math.max(10, box.width + padding * 2);
    canvas.height = Math.max(10, box.height + padding * 2);
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      video,
      Math.max(0, box.x - padding),
      Math.max(0, box.y - padding),
      box.width + padding * 2,
      box.height + padding * 2,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const imageData = canvas.toDataURL('image/jpeg', 0.85);
    const faceData = {
      descriptor: Array.from(detection.descriptor),
      imageData,
    };
    
    setPendingFace(faceData);
    pendingFaceRef.current = faceData;

    try {
      startListening();
    } catch (error) {
      console.error('Speech recognition error:', error);
      setTranscript('Silakan gunakan formulir pendaftaran manual');
    }
  };

  // Start Speech Listener
  const startListening = () => {
    stopSpeaking();
    if (!speechListener.current) {
      speechListener.current = new SpeechListener();
    }

    const success = speechListener.current.start((result) => {
      setTranscript(`Terdeteksi: ${result.name} (${result.relation})`);
      if (pendingFaceRef.current) {
        savePendingPerson(result.name, result.relation);
      }
    });

    if (success) {
      setIsListening(true);
      setTranscript('Mendengarkan... Ucapkan: "Ini [Nama], [Relasi] saya"');
    } else {
      setIsListening(false);
      setTranscript('Pengenalan suara tidak aktif — silakan isi formulir di bawah');
    }
  };

  // Save new person to local storage
  const savePendingPerson = (name, relation) => {
    if (!pendingFaceRef.current) return;

    const person = savePerson({
      name,
      relation,
      descriptor: pendingFaceRef.current.descriptor,
      imageData: pendingFaceRef.current.imageData,
    });

    if (person) {
      setPendingFace(null);
      pendingFaceRef.current = null;
      loadKnownFaces();
      if (onPersonAdded) onPersonAdded();
      
      setTranscript(`Sukses tersimpan: ${name} (${relation})`);
      if (speechListener.current) {
        speechListener.current.stop();
        setIsListening(false);
      }

      setTimeout(() => setTranscript(''), 3500);
    }
  };

  const handleManualSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const relation = form.relation.value.trim();

    if (name && relation && (pendingFace || pendingFaceRef.current)) {
      savePendingPerson(name, relation);
      form.reset();
    }
  };

  const cancelPendingFace = () => {
    setPendingFace(null);
    pendingFaceRef.current = null;
    if (speechListener.current) {
      speechListener.current.stop();
      setIsListening(false);
    }
    setTranscript('');
  };

  // Initial Camera setup
  useEffect(() => {
    startCamera();
    return () => {
      stopDetection();
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Sync detection state
  useEffect(() => {
    if (isDetecting) {
      detectFaces();
    }
    return () => {
      if (detectionInterval.current) {
        clearTimeout(detectionInterval.current);
      }
    };
  }, [isDetecting, knownFaces]);

  return (
    <div className="face-recognition-container">
      {/* Top Banner Alert (If camera error) */}
      {cameraError && (
        <div className="alert-banner">
          <AlertCircleIcon size={20} />
          <span>{cameraError}</span>
          <button className="btn-retry" onClick={startCamera}>
            <RefreshIcon size={16} /> Coba Lagi
          </button>
        </div>
      )}

      {/* Main Viewport Card */}
      <div className="viewport-card">
        {/* The Live Video Element */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`video-feed ${isCameraActive ? 'active' : 'hidden'}`}
          onLoadedMetadata={() => {
            if (canvasRef.current && videoRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
            }
          }}
        />

        {/* Dynamic Canvas HUD Overlay */}
        <canvas ref={canvasRef} className="hud-canvas" />

        {/* Camera Inactive / Empty State (Replaces the ugly black void) */}
        {!isCameraActive && (
          <div className="camera-empty-state">
            <div className="empty-icon-wrap">
              <CameraOffIcon size={44} />
            </div>
            <h3 className="empty-title">Kamera Sedang Tidak Aktif</h3>
            <p className="empty-desc">
              Izinkan akses kamera di peramban Anda untuk mengaktifkan pemrosesan pengenalan wajah secara langsung.
            </p>
            <button className="btn-activate-camera" onClick={startCamera}>
              <CameraIcon size={18} />
              <span>Nyalakan Kamera</span>
            </button>
          </div>
        )}

        {/* Floating HUD Badges on Top of Video */}
        {isCameraActive && (
          <div className="viewport-overlay-ui">
            {/* Bottom-Right: Stats Pill */}
            <div className="hud-pill bottom-right">
              <span className="hud-metric">{knownFaces.length} Kerabat</span>
              <span className="hud-separator">•</span>
              <span className="hud-metric">{detectedFaces.length} Terdeteksi</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions & Controls Dock */}
      <div className="control-dock">
        <div className="dock-buttons">
          {!isDetecting ? (
            <button 
              onClick={startDetection} 
              className="btn-action btn-start" 
              disabled={!modelsLoaded}
            >
              <PlayIcon size={18} />
              <span>{modelsLoaded ? 'Mulai Deteksi Wajah' : 'Memuat Model AI...'}</span>
            </button>
          ) : (
            <button onClick={stopDetection} className="btn-action btn-stop">
              <StopIcon size={18} />
              <span>Jeda Pemrosesan</span>
            </button>
          )}

          {isCameraActive ? (
            <button onClick={stopCamera} className="btn-secondary-action">
              <CameraOffIcon size={18} />
              <span>Matikan Kamera</span>
            </button>
          ) : (
            <button onClick={startCamera} className="btn-secondary-action">
              <CameraIcon size={18} />
              <span>Nyalakan Kamera</span>
            </button>
          )}

          {isTtsSupported() && (
            <button
              onClick={toggleTts}
              className={`btn-secondary-action ${ttsEnabled ? 'btn-tts-active' : ''}`}
              title={ttsEnabled ? 'Matikan suara pembaca identitas' : 'Aktifkan suara pembaca identitas'}
            >
              {ttsEnabled ? <Volume2Icon size={18} /> : <VolumeXIcon size={18} />}
              <span>{ttsEnabled ? 'Suara: Aktif' : 'Suara: Mati'}</span>
            </button>
          )}
        </div>

        {/* Real-time Listening Toast Banner */}
        {isListening && (
          <div className="listening-toast">
            <div className="waveform-animation">
              <span className="wave-bar" />
              <span className="wave-bar" />
              <span className="wave-bar" />
              <span className="wave-bar" />
            </div>
            <div className="listening-text-wrap">
              <p className="listening-prompt">Mendengarkan ucapan pendaftaran...</p>
              <p className="listening-hint">Contoh: <em>"Ini Dimas, cucu saya"</em> atau gunakan form di bawah.</p>
            </div>
          </div>
        )}

        {/* Transcript Toast Notice */}
        {transcript && !isListening && (
          <div className="feedback-toast">
            <p>{transcript}</p>
          </div>
        )}
      </div>

      {/* Slide-Over Modal: Multimodal Person Registration */}
      {pendingFace && (
        <div className="registration-modal-backdrop">
          <div className="registration-modal">
            <div className="modal-header">
              <div className="modal-title-group">
                <UserPlusIcon size={20} className="icon-emerald" />
                <h3>Pendaftaran Kerabat Baru</h3>
              </div>
              <button className="btn-close-modal" onClick={cancelPendingFace}>
                <CloseIcon size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-preview-col">
                <div className="face-crop-frame">
                  <img src={pendingFace.imageData} alt="Potret Wajah Terdeteksi" className="face-crop-img" />
                </div>
                <div className="audio-live-status">
                  <MicIcon size={16} className={isListening ? 'icon-listening' : 'icon-muted'} />
                  <span>{isListening ? 'Mikrofon Aktif' : 'Menunggu Suara'}</span>
                </div>
              </div>

              <div className="modal-form-col">
                <p className="form-guide-text">
                  Kamera mendeteksi wajah baru. Anda dapat langsung berbicara di dekat mikrofon atau mengisi identitas di bawah ini:
                </p>

                <form onSubmit={handleManualSave} className="modern-reg-form">
                  <div className="form-field">
                    <label>Nama Lengkap / Panggilan:</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Contoh: Dimas, Siti, Budi"
                      autoFocus
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>Hubungan Keluarga:</label>
                    <input
                      type="text"
                      name="relation"
                      placeholder="Contoh: Cucu, Anak, Perawat"
                      required
                    />
                  </div>

                  <div className="modal-actions">
                    <button type="submit" className="btn-save-person">
                      Simpan Profil Kerabat
                    </button>
                    <button type="button" className="btn-cancel" onClick={cancelPendingFace}>
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceRecognition;
