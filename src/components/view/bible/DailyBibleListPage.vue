<template>
  <div class="min-h-screen bg-gray-50 py-12 font-sans">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-extrabold text-blue-900 sm:text-4xl">Daily Bible Readings</h1>
        <p class="mt-4 text-lg text-gray-500">Nourish your soul with the Word of God every day.</p>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="reading in readings" :key="reading.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col"
          @click="openReading(reading.id)">

          <div class="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center text-sm text-gray-400 mb-3">
                <CalendarOutlined class="mr-2" /> {{ reading.date }}
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">{{ reading.title }}</h3>
              <p class="text-gray-600 mb-4 line-clamp-3">{{ reading.snippet }}</p>
            </div>

            <div class="pt-4 border-t border-gray-50 flex items-center justify-between text-blue-600 font-medium">
              <span>Read Full Text</span>
              <ArrowRightOutlined />
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination Mock -->
      <div class="flex justify-center mt-10">
        <a-pagination v-model:current="current" :total="50" show-less-items />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { CalendarOutlined, ArrowRightOutlined } from '@ant-design/icons-vue';

const router = useRouter();
const current = ref(1);

const readings = ref([
  { id: 1, title: 'First Reading: Genesis 1:1-31', date: 'Jan 31, 2026', snippet: 'In the beginning God created the heavens and the earth. Now the earth was formless and empty, darkness was over the surface of the deep...' },
  { id: 2, title: 'Gospel: Matthew 5:1-12', date: 'Jan 30, 2026', snippet: 'Now when Jesus saw the crowds, he went up on a mountainside and sat down. His disciples came to him, and he began to teach them...' },
  { id: 3, title: 'Psalm 23', date: 'Jan 29, 2026', snippet: 'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters...' },
  { id: 4, title: 'Second Reading: Romans 8:28-39', date: 'Jan 28, 2026', snippet: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose...' },
  { id: 5, title: 'Gospel: Mark 4:1-9', date: 'Jan 27, 2026', snippet: 'Again Jesus began to teach by the lake. The crowd that gathered around him was so large that he got into a boat and sat in it...' },
  { id: 6, title: 'Proverbs 3:5-6', date: 'Jan 26, 2026', snippet: 'Trust in the Lord with all your heart in and lean not on your own understanding; in all your ways submit to him...' },
]);

const openReading = (id) => {
  // In real app, navigate to detail page
  // router.push({ name: 'dailyBibleDetail', params: { id } });
  console.log("Open reading", id);
};
</script>
