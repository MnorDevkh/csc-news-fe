<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { BibleService } from '@/services/BibleService'
import VerseService from '@/services/VerseService'

const router = useRouter()

const query = ref('')
const isSearching = ref(false)
const bibleResults = ref([])
const verseResults = ref([])
const activeTab = ref<'all' | 'bibles' | 'verses'>('all')

const hasResults = computed(
  () => bibleResults.value.length > 0 || verseResults.value.length > 0
)

const filteredBibleResults = computed(() => bibleResults.value)
const filteredVerseResults = computed(() => verseResults.value)

const goToBible = (bible) => {
  const type = bible.bible_type_code || 'NT'
  router.push({
    name: 'bibleReadBook',
    params: { type, bibleId: bible.id },
  })
}

const goToVerse = (item) => {
  const type = item.bible?.bible_type_code || 'NT'
  router.push({
    name: 'bibleReadChapter',
    params: {
      type,
      bibleId: item.bible_id || item.bible?.id,
      chapterId: item.chapter_id,
    },
  })
}

const performSearch = async () => {
  const term = query.value.trim()
  if (!term) {
    bibleResults.value = []
    verseResults.value = []
    return
  }

  isSearching.value = true
  bibleResults.value = []
  verseResults.value = []

  try {
    const [bRes, vRes] = await Promise.allSettled([
      BibleService.searchBibles(term),
      VerseService.searchVerses?.(term),
    ])

    if (bRes.status === 'fulfilled') {
      const raw = bRes.value
      const items = raw?.items || (Array.isArray(raw) ? raw : [])
      bibleResults.value = items
    }

    if (vRes.status === 'fulfilled' && vRes.value) {
      const raw = vRes.value
      const items = raw?.items || (Array.isArray(raw) ? raw : [])
      verseResults.value = items
    }
  } catch (error) {
    console.error('Bible search failed:', error)
  } finally {
    isSearching.value = false
  }
}

const handleSubmit = (e) => {
  e.preventDefault()
  performSearch()
}
</script>

<template>
  <div class="min-h-[calc(100vh-3.5rem-3.5rem)] bg-gray-50 dark:bg-slate-950">
    <div class="max-w-5xl mx-auto px-0 pt-4 sm:pt-6 pb-12 sm:pb-16">
      <header class="mb-4">
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-slate-50">
          ស្វែងរកព្រះគម្ពីរ
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-slate-400">
          ស្វែងរកតាមឈ្មោះសៀវភៅ ជំពូក ខណ្ឌ ឬពាក្យគន្លឹះ។
        </p>
      </header>

      <!-- Search input -->
      <form class="mt-3" @submit="handleSubmit">
        <div class="relative">
          <input
            v-model="query"
            type="search"
            class="w-full rounded-2xl border border-gray-200 bg-white/80 px-4 py-2.5 pr-10 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:bg-slate-900/80 dark:border-slate-700 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:ring-sky-900/70"
            placeholder="ឧ. ម៉ាថាយ 5  ឬ  សេចក្ដីស្រឡាញ់"
          />
          <button
            type="submit"
            class="absolute inset-y-0 right-1 my-1 px-3 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
            :disabled="isSearching"
          >
            {{ isSearching ? 'កំពុងស្វែងរក…' : 'ស្វែងរក' }}
          </button>
        </div>
      </form>

      <!-- Tabs -->
      <div
        v-if="hasResults"
        class="mt-5 inline-flex rounded-md bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-0.5 text-xs"
      >
        <button
          type="button"
          class="px-3 py-1.5 rounded-md"
          :class="activeTab === 'all' ? 'bg-white dark:bg-slate-800 shadow-sm text-gray-900 dark:text-slate-50' : 'text-gray-500 dark:text-slate-400'"
          @click="activeTab = 'all'"
        >
          ទាំងអស់
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-md"
          :class="activeTab === 'bibles' ? 'bg-white dark:bg-slate-800 shadow-sm text-gray-900 dark:text-slate-50' : 'text-gray-500 dark:text-slate-400'"
          @click="activeTab = 'bibles'"
        >
          សៀវភៅ
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-md"
          :class="activeTab === 'verses' ? 'bg-white dark:bg-slate-800 shadow-sm text-gray-900 dark:text-slate-50' : 'text-gray-500 dark:text-slate-400'"
          @click="activeTab = 'verses'"
        >
          ខណ្ឌ
        </button>
      </div>

      <!-- No results -->
      <div
        v-if="!isSearching && !hasResults && query"
        class="mt-8 text-center text-sm text-gray-500 dark:text-slate-400"
      >
        មិនមានលទ្ធផលសម្រាប់
        <span class="font-semibold">“{{ query }}”</span>
      </div>

      <!-- Results -->
      <div class="mt-6 space-y-8">
        <!-- Bible results -->
        <section
          v-if="(activeTab === 'all' || activeTab === 'bibles') && filteredBibleResults.length"
        >
          <h2 class="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">
            សៀវភៅព្រះគម្ពីរ
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              v-for="b in filteredBibleResults"
              :key="b.id"
              type="button"
              @click="goToBible(b)"
              class="flex flex-col items-stretch rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-gray-100 dark:border-slate-800 px-4 py-3.5 text-left shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-sky-600/70 transition-all"
            >
              <div class="flex items-center justify-between gap-2">
                <div>
                  <p class="text-sm font-semibold text-gray-900 dark:text-slate-50">
                    {{ b.name }}
                  </p>
                  <p class="mt-0.5 text-[11px] text-gray-500 dark:text-slate-400">
                    {{ b.type === 'OT' ? 'សម្ព័ន្ធចាស់' : 'សម្ព័ន្ធថ្មី' }}
                    <span v-if="b.language" class="mx-1">•</span>
                    <span v-if="b.language">{{ b.language }}</span>
                  </p>
                </div>
                <span
                  v-if="b.slug"
                  class="inline-flex h-6 px-2 rounded-full bg-blue-50 text-[11px] font-semibold tracking-wide uppercase text-blue-700 dark:bg-sky-900/60 dark:text-sky-200"
                >
                  {{ b.slug }}
                </span>
              </div>
              <p
                v-if="b.description && b.description !== 'string'"
                class="mt-1.5 text-xs text-gray-500 dark:text-slate-400 line-clamp-2"
              >
                {{ b.description }}
              </p>
            </button>
          </div>
        </section>

        <!-- Verse results -->
        <section
          v-if="(activeTab === 'all' || activeTab === 'verses') && filteredVerseResults.length"
        >
          <h2 class="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">
            ខណ្ឌព្រះគម្ពីរ
          </h2>
          <div class="space-y-2">
            <button
              v-for="v in filteredVerseResults"
              :key="v.id"
              type="button"
              @click="goToVerse(v)"
              class="w-full text-left rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-gray-100 dark:border-slate-800 px-4 py-3.5 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-sky-600/70 transition-all"
            >
              <div class="flex items-center justify-between gap-2 mb-1">
                <p class="text-xs font-semibold text-blue-700 dark:text-sky-300">
                  {{ v.book_name || v.bible?.name }}
                  <span v-if="v.chapter_number"> {{ v.chapter_number }}:{{ v.verse_number }}</span>
                </p>
              </div>
              <p class="text-sm text-gray-800 dark:text-slate-100 leading-relaxed line-clamp-2">
                {{ v.verse_text }}
              </p>
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

