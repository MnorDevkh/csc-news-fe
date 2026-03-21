<template>
  <div class="homepage bg-gray-50 min-h-screen pb-12 font-sans flex flex-col items-center">
    <div
      class="w-full max-w-[1400px] px-0 lg:px-10 mx-auto flex flex-col min-h-screen text-slate-900 transition-colors duration-300"
    >
    <!-- Top App Bar -->
    <header
      class="h-14 flex items-center justify-between px-0 sm:px-4 border-b border-amber-200/80 bg-white/95 backdrop-blur"
    >
      <div class="flex  gap-2">
        <RouterLink to="/read" class="flex gap-2">
          <div
            class="h-8 w-8 rounded-xl bg-gradient-to-br from-0 to-rose-500 flex items-center justify-center text-white font-bold text-lg shadow-sm"
          >
            
          </div>
          <div class="hidden sm:block">
            <p class="text-sm font-semibold leading-tight">Bible Reading</p>
            <p class="text-[11px] text-gray-500 leading-tight">
              Simple • Calm • Focused
            </p>
          </div>
        </RouterLink>
      </div>

      <div class="flex items-center gap-2">
        <RouterLink
          :to="{ name: 'bibleSearch' }"
          class="h-9 w-9 flex items-center justify-center rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <span class="sr-only">Search</span>
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
            />
          </svg>
        </RouterLink>
        <RouterLink
          :to="{ name: 'bibleBookmarks' }"
          class="h-9 w-9 flex items-center justify-center rounded-full text-gray-500 hover:text-amber-600 hover: transition-colors"
        >
          <span class="sr-only">Bookmarks</span>
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-3.5L6 20V4z"
            />
          </svg>
        </RouterLink>
        <RouterLink
          :to="{ name: 'bibleSettings' }"
          class="h-9 w-9 flex items-center justify-center rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          <span class="sr-only">Settings</span>
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317a1 1 0 0 1 1.35-.437l.39.195a1 1 0 0 0 .894 0l.39-.195a1 1 0 0 1 1.35.437l.379.758a1 1 0 0 0 .746.54l.842.122a1 1 0 0 1 .884.884l.122.842a1 1 0 0 0 .54.746l.758.379a1 1 0 0 1 .437 1.35l-.195.39a1 1 0 0 0 0 .894l.195.39a1 1 0 0 1-.437 1.35l-.758.379a1 1 0 0 0-.54.746l-.122.842a1 1 0 0 1-.884.884l-.842.122a1 1 0 0 0-.746.54l-.379.758a1 1 0 0 1-1.35.437l-.39-.195a1 1 0 0 0-.894 0l-.39.195a1 1 0 0 1-1.35-.437l-.379-.758a1 1 0 0 0-.746-.54l-.842-.122a1 1 0 0 1-.884-.884l-.122-.842a1 1 0 0 0-.54-.746l-.758-.379a1 1 0 0 1-.437-1.35l.195-.39a1 1 0 0 0 0-.894l-.195-.39a1 1 0 0 1 .437-1.35l.758-.379a1 1 0 0 0 .54-.746l.122-.842a1 1 0 0 1 .884-.884l.842-.122a1 1 0 0 0 .746-.54l.379-.758z"
            />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </RouterLink>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col">
      <section class="flex-1 overflow-y-auto">
        <RouterView v-slot="{ Component }">
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </RouterView>
      </section>

      <!-- Bottom Navigation (mobile) -->
      <nav
        class="md:hidden sticky bottom-0 inset-x-0 border-t border-amber-200/80 /95 backdrop-blur"
      >
        <div class="max-w-xl mx-auto flex items-stretch justify-around py-1.5 text-xs">
          <RouterLink
            :to="{ name: 'bibleReadHome' }"
            class="flex flex-col items-center flex-1 py-1.5 text-gray-500 hover:text-blue-600"
          >
            <svg class="h-5 w-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l9-9 9 9M5 10v10h5V14h4v6h5V10"
              />
            </svg>
            <span>Home</span>
          </RouterLink>
          <RouterLink
            :to="{ name: 'bibleSearch' }"
            class="flex flex-col items-center flex-1 py-1.5 text-gray-500 hover:text-blue-600"
          >
            <svg class="h-5 w-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
              />
            </svg>
            <span>Search</span>
          </RouterLink>
          <RouterLink
            :to="{ name: 'bibleBookmarks' }"
            class="flex flex-col items-center flex-1 py-1.5 text-gray-500 hover:text-amber-600"
          >
            <svg class="h-5 w-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-3.5L6 20V4z"
              />
            </svg>
            <span>Saves</span>
          </RouterLink>
          <RouterLink
            :to="{ name: 'bibleSettings' }"
            class="flex flex-col items-center flex-1 py-1.5 text-gray-500 hover:text-indigo-600"
          >
            <svg class="h-5 w-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317a1 1 0 0 1 1.35-.437l.39.195a1 1 0 0 0 .894 0l.39-.195a1 1 0 0 1 1.35.437l.379.758a1 1 0 0 0 .746.54l.842.122a1 1 0 0 1 .884.884l.122.842a1 1 0 0 0 .54.746l.758.379a1 1 0 0 1 .437 1.35l-.195.39a1 1 0 0 0 0 .894l.195.39a1 1 0 0 1-.437 1.35l-.758.379a1 1 0 0 0-.54.746l-.122.842a1 1 0 0 1-.884.884l-.842.122a1 1 0 0 0-.746.54l-.379.758a1 1 0 0 1-1.35.437l-.39-.195a1 1 0 0 0-.894 0l-.39.195a1 1 0 0 1-1.35-.437l-.379-.758a1 1 0 0 0-.746-.54l-.842-.122a1 1 0 0 1-.884-.884l-.122-.842a1 1 0 0 0-.54-.746l-.758-.379a1 1 0 0 1-.437-1.35l.195-.39a1 1 0 0 0 0-.894l-.195-.39a1 1 0 0 1 .437-1.35l.758-.379a1 1 0 0 0 .54-.746l.122-.842a1 1 0 0 1 .884-.884l.842-.122a1 1 0 0 0 .746-.54l.379-.758z"
              />
            </svg>
            <span>Settings</span>
          </RouterLink>
        </div>
      </nav>
    </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

onMounted(() => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement
    root.classList.remove('dark')
    try {
      localStorage.removeItem('bible-reading-theme-v1')
    } catch {
      // ignore
    }
  }
})
</script>

