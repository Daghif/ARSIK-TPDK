// Text-to-Speech utility using Web Speech Synthesis API (id-ID)

const COOLDOWN_MS = 12000; // 12 seconds cooldown per person
const lastSpokenMap = new Map();

export const isTtsSupported = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

const getIndonesianVoice = () => {
  if (!isTtsSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.toLowerCase() === 'id-id') ||
    voices.find((v) => v.lang.toLowerCase().startsWith('id')) ||
    null
  );
};

export const stopSpeaking = () => {
  if (!isTtsSupported()) return;
  window.speechSynthesis.cancel();
};

export const resetTtsCooldown = () => {
  lastSpokenMap.clear();
};

export const speakText = (text) => {
  if (!isTtsSupported() || !text) return false;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'id-ID';
  utterance.rate = 0.95; // Calm, clear pace for elderly listeners
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  const voice = getIndonesianVoice();
  if (voice) {
    utterance.voice = voice;
  }

  window.speechSynthesis.speak(utterance);
  return true;
};

export const speakPerson = (person) => {
  if (!isTtsSupported() || !person?.id || !person?.name) return false;

  const now = Date.now();
  const lastTime = lastSpokenMap.get(person.id) || 0;

  // Skip if still within cooldown or another utterance is currently playing
  if (now - lastTime < COOLDOWN_MS || window.speechSynthesis.speaking) {
    return false;
  }

  lastSpokenMap.set(person.id, now);
  const message = person.relation
    ? `Ini ${person.name}, ${person.relation} Anda.`
    : `Ini ${person.name}.`;

  return speakText(message);
};
