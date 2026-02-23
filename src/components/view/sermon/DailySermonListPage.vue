<template>
  <div class="min-h-screen bg-gray-50 py-12 font-sans">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-3xl font-extrabold text-purple-900 sm:text-4xl">Daily Sermons</h1>
        <p class="mt-4 text-lg text-gray-500">Inspirational messages to guide your daily walk.</p>
      </div>

      <div class="space-y-6">
        <div v-for="sermon in sermons" :key="sermon.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-all duration-300">

          <div class="md:w-1/3 h-48 md:h-auto relative">
            <img :src="sermon.thumbnail" :alt="sermon.title" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div
                class="h-12 w-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <PlayCircleOutlined class="text-2xl text-purple-600 ml-1" />
              </div>
            </div>
          </div>

          <div class="p-6 md:w-2/3 flex flex-col justify-center">
            <div class="flex items-center text-sm text-gray-400 mb-2">
              <UserOutlined class="mr-2" /> {{ sermon.preacher }} &middot; <span class="ml-2">{{ sermon.date }}</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-3">{{ sermon.title }}</h3>
            <p class="text-gray-600 mb-4 line-clamp-2">{{ sermon.snippet }}</p>

            <button
              class="self-start px-6 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100 transition-colors flex items-center gap-2">
              Listen Now
              <SoundOutlined />
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination Mock -->
      <div class="flex justify-center mt-12">
        <a-pagination v-model:current="current" :total="30" show-less-items />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { PlayCircleOutlined, UserOutlined, SoundOutlined } from '@ant-design/icons-vue';

const current = ref(1);

const sermons = ref([
  {
    id: 1,
    title: 'Walking in Faith',
    preacher: 'Fr. Sok Na',
    date: 'Jan 31, 2026',
    snippet: 'Faith is not just believing, it is trusting in God even when the path is unclear. Today we explore the journey of Abraham.',
    thumbnail: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'The Power of Forgiveness',
    preacher: 'Bishop Ly',
    date: 'Jan 30, 2026',
    snippet: 'Forgiveness frees the forgiver more than the forgiven. Let us learn how to let go of bitterness and embrace peace.',
    thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58293a469d?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Living a Generous Life',
    preacher: 'Fr. Dara',
    date: 'Jan 29, 2026',
    snippet: 'Generosity is not only about money, but about giving of our time, talents, and love to those around us.',
    thumbnail: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop'
  },
]);

</script>
