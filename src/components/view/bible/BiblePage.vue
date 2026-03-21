<script setup>
import { BibleService } from '@/services/BibleService'
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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

const selectedType = computed(() => (route.params.type || route.query.type || 'NT').toString().toUpperCase())

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
const pageSize = ref(32)
const totalPages = ref(1)
const totalElements = ref(0)

const fetchBibles = async () => {
  try {
    isLoading.value = true

    const page = pageIndex.value || 1
    const size = pageSize.value || 32

    const params = {
      skip: (page - 1) * size,
      limit: size,
      language: filters.value.language || undefined,
      order_by: filters.value.order_by || 'bible_number',
      type: selectedType.value,
    }

    const res = await BibleService.getBibles(params)
    const data = res.data
    const items = data?.items ?? (Array.isArray(data) ? data : [])

    bibleItems.value = items.map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      short_code: item.short_code || item.slug,
      description: item.description || '',
      thumbnail: item.thumbnail,
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
  () => route.params.type || route.query.type,
  () => {
    pageIndex.value = 1
    syncPageMeta()
    fetchBibles()
  }
)

const navigateToDetail = (id) => {
  router.push({ name: 'bibleReadBook', params: { type: selectedType.value, bibleId: id } })
}
</script>

<template>
  <div class="min-h-[calc(100vh-3.5rem-3.5rem)] py-4 sm:py-8">
    <div class="mx-auto max-w-5xl px-0 sm:px-0 lg:px-8">
      <header class="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            សៀវភៅ {{ typeLabel }}
          </h1>
          <p class="mt-1 text-sm text-slate-600">
            ជ្រើសរើសសៀវភៅ ដើម្បីអានជំពូក និងខណ្ឌ។
          </p>
        </div>
      </header>

      <div v-if="isLoading" class="flex justify-center mt-10">
        <div class="h-9 w-9 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>

      <div v-else class="mt-4">
        <div
          v-if="bibleItems.length > 0"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4"
        >
          <button
            v-for="item in bibleItems"
            :key="item.id"
            type="button"
            @click="navigateToDetail(item.id)"
            class="group relative flex flex-col items-stretch rounded-2xl bg-white border border-amber-100 px-3 py-3.5 text-left shadow-sm hover:shadow-md hover:border-amber-300 transition-all"
          >
            <div class="flex items-start justify-between gap-1">
              <span
                class="inline-flex h-6 px-2 rounded-full  text-[11px] font-semibold tracking-wide uppercase text-amber-800"
              >
                {{ item.short_code || item.slug }}
              </span>
            </div>
            <p
              class="mt-2 text-sm font-semibold leading-snug text-slate-900 line-clamp-2 group-hover:text-blue-700"
            >
              {{ item.name }}
            </p>
          </button>
        </div>

        <div
          v-else
          class="mt-10 text-center text-sm text-slate-500"
        >
          មិនទាន់មានសៀវភៅសម្រាប់សម្ព័ន្ធនេះទេ។
        </div>
      </div>
    </div>
  </div>
</template>