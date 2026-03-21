<script setup>
import { ref, watch } from 'vue'

const fontSize = ref('normal')

watch(fontSize, (val) => {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.style.setProperty('--bible-font-scale', val === 'xl' ? '1.15' : val === 'large' ? '1.05' : '1')
})
</script>

<template>
  <div class="min-h-[calc(100vh-3.5rem-3.5rem)] ">
    <div class="max-w-3xl mx-auto px-0 pt-4 sm:pt-6 pb-12 sm:pb-16">
      <header class="mb-4">
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          ការកំណត់ការអាន
        </h1>
        <p class="mt-1 text-sm text-slate-600">
          កំណត់ទំហំអក្សរឱ្យសមរម្យសម្រាប់ការអានប្រចាំថ្ងៃ។
        </p>
      </header>

      <div class="mt-6 space-y-6">
        <!-- Font size -->
        <section
          class="rounded-2xl bg-white/90 border border-amber-100 p-4 shadow-sm"
        >
          <h2 class="text-sm font-semibold text-slate-900">
            ទំហំអក្សរ
          </h2>
          <p class="mt-1 text-xs text-slate-500">
            ជ្រើសរើសទំហំអក្សរដែលសមរម្យសម្រាប់ភ្នែករបស់អ្នក។
          </p>
          <div class="mt-3 inline-flex rounded-full  border border-amber-200 p-0.5 text-xs">
            <button
              type="button"
              class="px-3 py-1.5 rounded-full"
              :class="fontSize === 'normal' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'"
              @click="fontSize = 'normal'"
            >
              តូច
            </button>
            <button
              type="button"
              class="px-3 py-1.5 rounded-full"
              :class="fontSize === 'large' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'"
              @click="fontSize = 'large'"
            >
              មធ្យម
            </button>
            <button
              type="button"
              class="px-3 py-1.5 rounded-full"
              :class="fontSize === 'xl' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'"
              @click="fontSize = 'xl'"
            >
              ធំ
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

