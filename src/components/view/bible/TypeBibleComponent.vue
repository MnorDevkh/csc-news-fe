<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { BibleService } from '@/services/BibleService'

const router = useRouter()

const testamentCards = ref([])

const gradientForType = () => 'from-indigo-600 via-indigo-500 to-indigo-400'

onMounted(async () => {
  try {
    const data = await BibleService.getBibleTypes()
    const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []
    if (!items.length) return

    testamentCards.value = items.map((t, index) => {
      const type = t.id || t.slug || `type-${index}`
      const isOT = type === 'OT'
      const isNT = type === 'NT'
      const isIntro = type === 'Introduction'
      const isPW = type === 'PW'

      return {
        id: t.id || type,
        type,
        title: t.name || type,
        subtitle:
          isOT
            ? '39 សៀវភៅ'
            : isNT
              ? '27 សៀវភៅ'
              : isIntro
                ? 'សេចក្ដីណែនាំទូទៅ'
                : isPW
                  ? 'កាព្យ និងពាក្យប្រៀបប្រាស'
                  : (t.slug || type),
        description: t.description || '',
        gradient: gradientForType(type, index),
        badge: isOT
          ? 'OLD TESTAMENT'
          : isNT
            ? 'NEW TESTAMENT'
            : isIntro
              ? 'INTRODUCTION'
              : isPW
                ? 'POETRY & WISDOM'
                : 'BIBLE TYPE',
      }
    })
  } catch (error) {
    console.error('Failed to load bible types for reader home', error)
  }
})

const goToTestament = (type) => {
  if (!type) return
  router.push({ name: 'bibleReadType', params: { type } })
}
</script>

<template>
  <div class="min-h-[calc(100vh-3.5rem-3.5rem)]  flex">
    <div class="max-w-7xl px-0 py-6 sm:py-10 w-full">
      <!-- Hero copy -->
      <section class="text-center mb-6 sm:mb-10">
        <p class="text-xs font-semibold tracking-[0.25em] uppercase text-amber-700/80">
          Bible Reading
        </p>
        <h1 class="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          ជ្រើសរើសសម្ព័ន្ធព្រះគម្ពីរ
        </h1>
        <p class="mt-3 max-w-xl mx-auto text-sm sm:text-base text-slate-600 text-center">
          ចាប់ផ្តើមដោយជ្រើសរើសសម្ព័ន្ធចាស់ ឬសម្ព័ន្ធថ្មី។ បន្ទាប់មក អ្នកអាចជ្រើសសៀវភៅ ជំពូក និងខណ្ឌបានយ៉ាងងាយស្រួល។
        </p>
      </section>

      <!-- Testament cards -->
      <section
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mt-4 justify-items-center w-full"
      >
        <button
          v-for="card in testamentCards"
          :key="card.id"
          type="button"
          @click="goToTestament(card.type)"
          class="group relative overflow-hidden rounded-3xl w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50"
        >
          <div class="absolute inset-0 bg-gradient-to-br" :class="card.gradient" />
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_20%_0,rgba(255,255,255,0.2),transparent_55%),radial-gradient(circle_at_80%_120%,rgba(0,0,0,0.35),transparent_55%)]" />

          <div class="relative px-4 py-6 sm:px-7 sm:py-8 flex flex-col h-full text-left text-white">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-xs font-semibold tracking-[0.28em] uppercase opacity-80">
                  {{ card.badge }}
                </p>
                <h2 class="mt-2 text-2xl font-extrabold tracking-tight drop-shadow-sm">
                  {{ card.title }}
                </h2>
              </div>
              <div
                class="flex-shrink-0 h-12 w-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shadow-inner">
                <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7"
                    d="M5 4h8a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3-3V4z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7"
                    d="M11 4h8a3 3 0 0 1 3 3v13h-8a3 3 0 0 0-3-3V4z" />
                </svg>
              </div>
            </div>

            <p class="mt-3 text-sm sm:text-[15px] text-amber-50/90 max-w-xs">
              {{ card.description }}
            </p>

            <div class="mt-4 flex items-center justify-between text-xs sm:text-sm font-medium">
              <span class="inline-flex items-center gap-1.5">
                <span
                  class="inline-flex h-6 px-2 rounded-full bg-black/20 border border-white/25 text-[11px] uppercase tracking-[0.18em]">
                  {{ card.subtitle }}
                </span>
              </span>
              <span class="inline-flex items-center gap-1 text-amber-50/90 group-hover:text-white transition-colors">
                ចាប់ផ្តើមអាន
                <svg class="h-3.5 w-3.5 translate-x-0 group-hover:translate-x-0.5 transition-transform"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </button>
      </section>
    </div>
  </div>
</template>