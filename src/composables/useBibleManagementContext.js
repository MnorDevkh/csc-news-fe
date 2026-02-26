import { ref } from 'vue';

const STORAGE_KEY_BIBLE = 'admin-bible-management-lastBibleId';
const STORAGE_KEY_CHAPTER = 'admin-bible-management-lastChapterId';

function getStored(key) {
  try {
    return sessionStorage.getItem(key) || null;
  } catch {
    return null;
  }
}

function setStored(key, value) {
  try {
    if (value != null && value !== '') {
      sessionStorage.setItem(key, String(value));
    } else {
      sessionStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
}

const lastBibleId = ref(getStored(STORAGE_KEY_BIBLE));
const lastChapterId = ref(getStored(STORAGE_KEY_CHAPTER));

export function useBibleManagementContext() {
  function setLastBibleId(id) {
    const val = id != null && id !== '' ? String(id) : null;
    lastBibleId.value = val;
    setStored(STORAGE_KEY_BIBLE, val);
  }

  function setLastChapterId(id) {
    const val = id != null && id !== '' ? String(id) : null;
    lastChapterId.value = val;
    setStored(STORAGE_KEY_CHAPTER, val);
  }

  return {
    lastBibleId,
    lastChapterId,
    setLastBibleId,
    setLastChapterId,
  };
}
