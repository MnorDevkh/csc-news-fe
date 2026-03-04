import { ref, watch } from 'vue'

const STORAGE_KEY = 'bible-reading-bookmarks-v1'

function loadFromStorage() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveToStorage(data) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore
  }
}

const items = ref(loadFromStorage())

watch(
  items,
  (val) => {
    saveToStorage(val)
  },
  { deep: true }
)

export function useBibleBookmarks() {
  const bookmarks = items

  function keyFor(verse) {
    return [
      verse.bibleId || verse.bible_id || '',
      verse.chapterId || verse.chapter_id || '',
      verse.verseId || verse.verse_id || verse.id || '',
    ]
      .map(String)
      .join(':')
  }

  function toggleBookmark(payload) {
    const k = keyFor(payload)
    const index = bookmarks.value.findIndex((b) => b.key === k)
    if (index >= 0) {
      bookmarks.value.splice(index, 1)
      return
    }
    bookmarks.value.unshift({
      key: k,
      bibleId: payload.bibleId || payload.bible_id,
      chapterId: payload.chapterId || payload.chapter_id,
      verseId: payload.verseId || payload.verse_id || payload.id,
      bookName: payload.bookName,
      chapterNumber: payload.chapterNumber,
      verseNumber: payload.verseNumber,
      verse_text: payload.verse_text ?? payload.content,
      createdAt: new Date().toISOString(),
    })
  }

  function isBookmarked(payload) {
    const k = keyFor(payload)
    return bookmarks.value.some((b) => b.key === k)
  }

  return {
    bookmarks,
    toggleBookmark,
    isBookmarked,
  }
}

