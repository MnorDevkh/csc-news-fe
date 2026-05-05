<script setup>
import { BibleService } from '@/services/BibleService'
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import {
  ArrowLeftOutlined,
  BookOutlined,
  FileTextOutlined,
  HistoryOutlined,
  LoadingOutlined,
  ReadOutlined,
  RightOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons-vue'

const props = defineProps({
  setPageMeta: {
    type: Function,
    default: null,
  },
})

const bibleItems = ref([])
const isLoading = ref(false)
const route = useRoute()
const router = useRouter()

const bibleTypeOptions = [
  { value: 'NT', label: 'ព្រះគម្ពីរសម្ព័ន្ធមេត្រីថ្មី' },
  { value: 'OT', label: 'ព្រះគម្ពីរសម្ព័ន្ធមេត្រីចាស់' },
]

const selectedType = computed(() => (route.params.type || route.query.bible_type_code || 'NT').toString().toUpperCase())

const typeLabel = computed(() => {
  switch (selectedType.value) {
    case 'OT':
      return 'ព្រះគម្ពីរសម្ព័ន្ធមេត្រីចាស់'
    case 'NT':
    default:
      return 'ព្រះគម្ពីរសម្ព័ន្ធមេត្រីថ្មី'
  }
})

const filters = ref({
  language: 'km',
  order_by: 'bible_number',
})

const pageIndex = ref(1)
const pageSize = ref(100)
const totalPages = ref(1)
const totalElements = ref(0)

/** When a remote thumbnail fails to load, fall back to the icon tile. */
const brokenThumbnails = ref({})

const thumbKey = (id) => String(id)

const onThumbnailError = (id) => {
  const k = thumbKey(id)
  brokenThumbnails.value = { ...brokenThumbnails.value, [k]: true }
}

const fetchBibles = async () => {
  try {
    isLoading.value = true
    brokenThumbnails.value = {}

    const page = pageIndex.value || 1
    const size = pageSize.value || 100

    const params = {
      skip: (page - 1) * size,
      limit: size,
      language: filters.value.language || undefined,
      order_by: filters.value.order_by || 'bible_number',
      bible_type_code: selectedType.value,
    }

    const res = await BibleService.getBibles(params)
    const data = res.data
    const items = data?.items ?? (Array.isArray(data) ? data : [])

    bibleItems.value = items.map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      short_code: item.short_code || item.code || item.slug,
      description: item.description || '',
      thumbnail: item.thumbnail,
      chapter_count: Number(item.chapter_count) || 0,
      verse_count: Number(item.verse_count) || 0,
    }))

    if (data && typeof data.total_elements === 'number') {
      totalElements.value = data.total_elements
      totalPages.value = data.total_pages || 1
      pageIndex.value = data.page_index || page
      pageSize.value = data.page_size || size
    } else {
      totalElements.value = items.length
      totalPages.value = 1
      pageIndex.value = 1
    }
  } catch (error) {
    console.error('Failed to fetch bible list:', error)
    bibleItems.value = []
    totalElements.value = 0
    totalPages.value = 1
    pageIndex.value = 1
  } finally {
    isLoading.value = false
  }
}

const syncPageMeta = () => {
  props.setPageMeta?.({
    title: `សៀវភៅព្រះគម្ពីរ (${typeLabel.value})`,
    subtitle: 'ជ្រើសរើសសៀវភៅ ដើម្បីអានជំពូក និងខណ្ឌនៅខាងមុខ។',
  })
}

onMounted(() => {
  syncPageMeta()
  fetchBibles()
})

onUnmounted(() => {
  props.setPageMeta?.(null)
})

watch(
  () => route.params.type || route.query.bible_type_code,
  () => {
    pageIndex.value = 1
    syncPageMeta()
    fetchBibles()
  }
)

const navigateToDetail = (id) => {
  router.push({ name: 'bibleReadBook', params: { type: selectedType.value, bibleId: id } })
}

/** Rotating accents so the book grid feels varied without extra assets. */
const typeTabClass = (opt) => {
  const active = selectedType.value === opt.value
  if (opt.value === 'NT' && active) {
    return 'bg-gradient-to-r from-sky-600 to-[#1a365d] text-white ring-sky-700/60 shadow-md'
  }
  if (opt.value === 'OT' && active) {
    return 'bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 text-white ring-orange-800/50 shadow-md'
  }
  if (opt.value === 'NT' && !active) {
    return 'bg-sky-50 text-sky-950 ring-sky-200/90 hover:bg-sky-100 hover:ring-sky-300'
  }
  return 'bg-orange-50 text-orange-950 ring-orange-200/90 hover:bg-orange-100 hover:ring-orange-300'
}

const cardAccentByIndex = (idx) => {
  const palettes = [
    {
      cover: 'bg-gradient-to-br from-sky-200/90 via-indigo-50 to-white',
      icon: 'text-sky-700/45',
      badge: 'bg-sky-100/95 text-sky-950 ring-sky-300/70',
      ringHover: 'hover:ring-sky-300/90',
    },
    {
      cover: 'bg-gradient-to-br from-amber-200/90 via-yellow-50 to-white',
      icon: 'text-amber-800/40',
      badge: 'bg-amber-100/95 text-amber-950 ring-amber-300/70',
      ringHover: 'hover:ring-amber-400/80',
    },
    {
      cover: 'bg-gradient-to-br from-emerald-200/85 via-teal-50 to-white',
      icon: 'text-emerald-800/42',
      badge: 'bg-emerald-100/95 text-emerald-950 ring-emerald-300/70',
      ringHover: 'hover:ring-emerald-400/80',
    },
    {
      cover: 'bg-gradient-to-br from-violet-200/88 via-fuchsia-50/80 to-white',
      icon: 'text-violet-800/45',
      badge: 'bg-violet-100/95 text-violet-950 ring-violet-300/70',
      ringHover: 'hover:ring-violet-400/80',
    },
  ]
  return palettes[idx % palettes.length]
}
</script>

<template>
  <div
    class="min-h-[calc(100vh-3.5rem-3.5rem)] bg-gradient-to-b from-slate-50 via-sky-50/35 to-amber-50/45 py-4 sm:py-8"
  >
    <div class="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
      <div class="mb-5 flex flex-wrap items-center gap-2">
        <RouterLink
          :to="{ name: 'bibleReadHome' }"
          class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1a365d] to-[#234e7c] px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-[#1a365d]/25 ring-1 ring-[#163252] transition-all hover:brightness-110 hover:shadow-lg no-underline"
        >
          <ArrowLeftOutlined class="text-white/95" />
          <span>ប្រភេទព្រះគម្ពីរ</span>
        </RouterLink>
        <RouterLink
          :to="{ name: 'bibleSearch' }"
          class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-teal-600/25 ring-1 ring-teal-700/50 transition-all hover:brightness-110 hover:shadow-lg no-underline"
        >
          <SearchOutlined class="text-white/95" />
          <span>ស្វែងរក</span>
        </RouterLink>
      </div>

      <header
        class="mb-6 rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-white/80 backdrop-blur-sm sm:p-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"
      >
        <div class="flex min-w-0 flex-1 items-start gap-3">
          <span
            class="mt-1 h-10 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-[#1a365d] via-sky-500 to-[#d4a853]"
            aria-hidden="true"
          />
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d4a853] via-amber-300 to-amber-600 text-[#1a365d] shadow-md shadow-amber-600/20 ring-2 ring-amber-200/80"
          >
            <BookOutlined class="text-2xl" />
          </div>
          <div class="min-w-0">
            <h1
              class="bg-gradient-to-r from-[#1a365d] via-sky-800 to-amber-900 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl"
            >
              សៀវភៅ {{ typeLabel }}
            </h1>
            <p class="mt-1 text-sm text-slate-600">
              ជ្រើសរើសសៀវភៅ ដើម្បីអានជំពូក និងខណ្ឌ។
            </p>
          </div>
        </div>

        <div class="flex shrink-0 flex-wrap gap-2 sm:justify-end" role="tablist" aria-label="ប្រភេទព្រះគម្ពីរ">
          <RouterLink
            v-for="opt in bibleTypeOptions"
            :key="opt.value"
            :to="{ name: 'bibleReadType', params: { type: opt.value } }"
            role="tab"
            :aria-selected="selectedType === opt.value"
            :class="[
              'inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all no-underline ring-1 shadow-sm',
              typeTabClass(opt),
            ]"
          >
            <ReadOutlined v-if="opt.value === 'NT'" class="text-base" />
            <HistoryOutlined v-else class="text-base" />
            <span class="max-w-[14rem] truncate">{{ opt.label }}</span>
          </RouterLink>
        </div>
      </header>

      <div v-if="isLoading" class="flex flex-col items-center justify-center gap-5 py-14">
        <LoadingOutlined class="text-4xl text-sky-600" :spin="true" />
        <p class="text-sm font-medium text-slate-600">កំពុងផ្ទុកសៀវភៅ…</p>
        <div class="grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          <div
            v-for="n in 8"
            :key="n"
            class="aspect-[4/3] animate-pulse rounded-2xl bg-gradient-to-br"
            :class="
              n % 2 === 0
                ? 'from-sky-200/60 via-indigo-100/50 to-amber-100/55'
                : 'from-emerald-200/55 via-teal-50 to-violet-100/60'
            "
          />
        </div>
      </div>

      <div v-else class="mt-1">
        <div
          v-if="bibleItems.length > 0"
          class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4"
        >
          <button
            v-for="(item, idx) in bibleItems"
            :key="item.id"
            type="button"
            :class="[
              'group relative flex flex-col overflow-hidden rounded-2xl bg-white/90 text-left shadow-md ring-1 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl',
              cardAccentByIndex(idx).ringHover,
              'ring-slate-200/70 hover:bg-white',
            ]"
            @click="navigateToDetail(item.id)"
          >
            <div
              class="relative aspect-[4/3] w-full"
              :class="item.thumbnail && !brokenThumbnails[thumbKey(item.id)] ? '' : cardAccentByIndex(idx).cover"
            >
              <img
                v-if="item.thumbnail && !brokenThumbnails[thumbKey(item.id)]"
                :src="item.thumbnail"
                :alt="item.name"
                class="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                @error="onThumbnailError(item.id)"
              />
              <div
                v-else
                class="absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <BookOutlined :class="['text-4xl drop-shadow-sm', cardAccentByIndex(idx).icon]" />
              </div>
            </div>
            <div class="flex flex-1 flex-col border-t border-slate-100/90 bg-gradient-to-b from-white to-slate-50/80 p-3 pt-2.5">
              <div class="flex items-start justify-between gap-2">
                <span
                  :class="[
                    'inline-flex max-w-[85%] items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1',
                    cardAccentByIndex(idx).badge,
                  ]"
                >
                  {{ item.short_code || item.slug }}
                </span>
                <RightOutlined
                  class="mt-0.5 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#1a365d] opacity-0 group-hover:opacity-100"
                />
              </div>
              <p
                class="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition-colors group-hover:text-[#1a365d]"
              >
                {{ item.name }}
              </p>
              <div
                class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100/80 pt-2 text-[11px] font-medium text-slate-500"
              >
                <span class="inline-flex items-center gap-1">
                  <UnorderedListOutlined class="text-sky-600/80" aria-hidden="true" />
                  <span>{{ item.chapter_count }} ជំពូក</span>
                </span>
                <span class="inline-flex items-center gap-1">
                  <FileTextOutlined class="text-amber-700/75" aria-hidden="true" />
                  <span>{{ item.verse_count }} ខណ្ឌ</span>
                </span>
              </div>
            </div>
          </button>
        </div>

        <div
          v-else
          class="mt-8 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-sky-50 via-white to-amber-50 px-6 py-16 ring-1 ring-sky-200/60 shadow-inner"
        >
          <div
            class="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#1a365d] via-sky-600 to-teal-600 shadow-lg shadow-sky-600/30"
          >
            <BookOutlined class="text-5xl text-white/95" />
          </div>
          <p class="text-center text-sm font-medium text-slate-600">
            មិនទាន់មានសៀវភៅសម្រាប់សម្ព័ន្ធនេះទេ។
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
