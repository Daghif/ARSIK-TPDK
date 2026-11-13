// Modul penyimpanan lokal profil kerabat (100% Client-Side sesuai UU PDP No. 27/2022 & SK-F10)
const STORAGE_KEY = 'arsik_people';
const LEGACY_STORAGE_KEY = 'dementia_app_faces';

/**
 * Pembangkit ID unik yang tahan collision (mencegah bug duplikasi ID dalam perulangan sinkron)
 */
export const generateUniqueId = (prefix = 'arsik') => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return `${prefix}_${crypto.randomUUID()}`;
    } catch {
      // Fallback jika crypto.randomUUID tidak tersedia
    }
  }
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 9);
  const perfPart =
    typeof performance !== 'undefined' && performance.now
      ? Math.floor(performance.now() * 1000).toString(36)
      : Math.floor(Math.random() * 100000).toString(36);
  return `${prefix}_${timestamp}_${perfPart}_${randomPart}`;
};

/**
 * Normalisasi objek profil agar selalu mematuhi skema PersonProfile di AGENTS.md
 */
const normalizePerson = (item, fallbackIndex = 0) => {
  const now = new Date().toISOString();
  const rawId = item && item.id ? String(item.id).trim() : '';
  const id = rawId.length > 0 ? rawId : generateUniqueId(`arsik_${fallbackIndex}`);

  return {
    id,
    name: String(item?.name || 'Kerabat').trim(),
    relation: String(item?.relation || 'Keluarga').trim(),
    descriptor: Array.isArray(item?.descriptor)
      ? item.descriptor
      : item?.descriptor
        ? Array.from(item.descriptor)
        : [],
    photo: item?.photo || item?.imageData || '',
    createdAt: item?.createdAt || item?.addedDate || now,
    lastSeen: item?.lastSeen || item?.createdAt || item?.addedDate || now,
  };
};

/**
 * Mengambil seluruh daftar kerabat dari localStorage (SK-F11)
 * Dilengkapi proteksi otomatis terhadap duplikasi ID akibat migrasi atau loop data sebelumnya
 */
export const getPeople = () => {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    let items = [];

    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        items = parsed;
      }
    } else {
      // Migrasi otomatis jika ada data dari kunci lama
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        const legacyParsed = JSON.parse(legacyRaw);
        if (Array.isArray(legacyParsed) && legacyParsed.length > 0) {
          items = legacyParsed;
        }
      }
    }

    if (items.length === 0) {
      return [];
    }

    let hasCollisionsOrMissingIds = false;
    const seenIds = new Set();

    const normalizedList = items.map((item, index) => {
      let person = normalizePerson(item, index);
      // Jika ID kembar/duplikat dari data lama, buatkan ID unik baru
      if (seenIds.has(person.id)) {
        person.id = generateUniqueId(`arsik_${index}`);
        hasCollisionsOrMissingIds = true;
      }
      seenIds.add(person.id);
      return person;
    });

    // Otomatis bersihkan & perbaiki localStorage jika sebelumnya ada ID kembar
    if (hasCollisionsOrMissingIds || !raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedList));
    }

    return normalizedList;
  } catch (error) {
    console.error('Gagal membaca data kerabat dari localStorage:', error);
    return [];
  }
};

/**
 * Menyimpan profil kerabat baru ke localStorage (SK-F10)
 */
export const savePerson = (personData) => {
  try {
    const people = getPeople();
    const now = new Date().toISOString();

    const uniqueId =
      personData?.id && String(personData.id).trim().length > 0
        ? String(personData.id).trim()
        : generateUniqueId('arsik');

    const newPerson = {
      id: uniqueId,
      name: String(personData?.name || 'Kerabat').trim(),
      relation: String(personData?.relation || 'Keluarga').trim(),
      descriptor: Array.isArray(personData?.descriptor)
        ? personData.descriptor
        : personData?.descriptor
          ? Array.from(personData.descriptor)
          : [],
      photo: personData?.photo || personData?.imageData || '',
      createdAt: now,
      lastSeen: now,
    };

    // Cegah duplikasi jika sudah ada item dengan ID yang sama
    const existingIndex = people.findIndex((p) => String(p.id).trim() === uniqueId);
    if (existingIndex !== -1) {
      people[existingIndex] = newPerson;
    } else {
      people.unshift(newPerson);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
    return newPerson;
  } catch (error) {
    console.error('Gagal menyimpan profil kerabat:', error);
    return null;
  }
};

/**
 * Memperbarui waktu terakhir terlihat (lastSeen) saat wajah dikenali (SK-F06)
 * Dibatasi pembaruan tulis setiap >= 10 detik untuk menjaga efisiensi storage
 */
const lastWriteMap = new Map();

export const updateLastSeen = (personId) => {
  try {
    if (!personId) return;
    const targetId = String(personId).trim();
    const nowMs = Date.now();
    const lastWrite = lastWriteMap.get(targetId) || 0;
    if (nowMs - lastWrite < 10000) {
      return;
    }
    lastWriteMap.set(targetId, nowMs);

    const people = getPeople();
    const index = people.findIndex((p) => String(p.id).trim() === targetId);
    if (index !== -1) {
      people[index].lastSeen = new Date(nowMs).toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
    }
  } catch (error) {
    console.error('Gagal memperbarui waktu terakhir terlihat:', error);
  }
};

/**
 * Menghapus satu profil kerabat berdasarkan ID (SK-F12)
 */
export const deletePerson = (personId) => {
  try {
    if (!personId) return false;
    const targetId = String(personId).trim();
    const people = getPeople();
    const initialCount = people.length;
    const filtered = people.filter((p) => String(p.id).trim() !== targetId);

    if (filtered.length !== initialCount) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Gagal menghapus profil kerabat:', error);
    return false;
  }
};

/**
 * Menghapus seluruh profil kerabat dari localStorage (SK-F12)
 */
export const clearAllPeople = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Gagal menghapus seluruh data kerabat:', error);
    return false;
  }
};

/**
 * Memformat timestamp ISO menjadi teks Bahasa Indonesia yang ramah bagi lansia & pendamping
 */
export const formatFriendlyTime = (isoString) => {
  if (!isoString) return 'Belum tercatat';
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return 'Belum tercatat';

    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) {
      return 'Baru saja terlihat';
    }

    const timeStr = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return `Hari ini, pukul ${timeStr}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
      return `Kemarin, pukul ${timeStr}`;
    }

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return 'Belum tercatat';
  }
};
