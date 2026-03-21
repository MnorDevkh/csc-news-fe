<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBibleBookmarks } from '@/composables/useBibleBookmarks'

const router = useRouter()
const { bookmarks } = useBibleBookmarks()

const grouped = computed(() => {
  const groups = {}
  for (const b of bookmarks.value) {
    const key = `${b.bookName || 'Unknown'}|${b.chapterNumber || ''}`
    if (!groups[key]) {
      groups[key] = {
        bookName: b.bookName,
        chapterNumber: b.chapterNumber,
        items: [],
      }
    }
    groups[key].items.push(b)
  }
  return Object.values(groups).sort((a, b) => (a.bookName || '').localeCompare(b.bookName || ''))
})

const goToVerse = (b) => {
  router.push({
    name: 'bibleReadChapter',
    params: {
      type: 'NT',
      bibleId: b.bibleId,
      chapterId: b.chapterId,
    },
  })
}
</script>

<template>
  <div class="min-h-[calc(100vh-3.5rem-3.5rem)] bg-gray-50 dark:bg-slate-950">
    <div class="max-w-5xl mx-auto px-0 pt-4 sm:pt-6 pb-12 sm:pb-16">
      <header class="mb-4">
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-slate-50">
          ខណ្ឌដែលបានសម្គាល់
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-slate-400">
          បញ្ជីខណ្ឌដែលអ្នកបានរក្សាទុកសម្រាប់អានម្ដងទៀត។
        </p>
      </header>

      <div v-if="bookmarks.length === 0" class="mt-10 text-center text-sm text-gray-500 dark:text-slate-400">
        មិនទាន់មានខណ្ឌដែលបានសម្គាល់ទេ។ អាចចុចសម្គាល់នៅពេលអានខណ្ឌនៅលើទំព័រអាន។
      </div>

      <div v-else class="mt-6 space-y-5">
        <section
          v-for="group in grouped"
          :key="`${group.bookName}-${group.chapterNumber}`"
          class="rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-gray-100 dark:border-slate-800 p-4 shadow-sm"
        >
          <h2 class="text-sm font-semibold text-gray-800 dark:text-slate-100 mb-2">
            {{ group.bookName }}
            <span v-if="group.chapterNumber"> {{ group.chapterNumber }}</span>
          </h2>
          <div class="space-y-2">
            <button
              v-for="b in group.items"
              :key="b.key"
              type="button"
              @click="goToVerse(b)"
              class="w-full text-left rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-900/70 px-3 py-2 text-sm hover:border-blue-200 dark:hover:border-sky-600/70 hover:bg-white dark:hover:bg-slate-900 transition-all"
            >
              <p class="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-0.5">
                ខណ្ឌ {{ b.verseNumber }}
              </p>
              <p class="text-[13px] text-gray-800 dark:text-slate-100 leading-relaxed line-clamp-2">
                {{ b.verse_text ?? b.content }}
              </p>
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

