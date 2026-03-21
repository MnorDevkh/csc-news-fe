<template>
  <section>
    <div class="space-y-4">
      <div
        v-for="sermon in sermons"
        :key="sermon.id"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-all duration-200"
      >
        <div class="md:w-1/3 h-40 md:h-auto relative bg-gray-100">
          <img
            v-if="sermon.thumbnail"
            :src="sermon.thumbnail"
            :alt="sermon.title"
            class="w-full h-full object-cover"
          >
          <div
            v-else
            class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-lg font-semibold px-4 text-center"
          >
            {{ sermon.title }}
          </div>
        </div>

        <div class="p-4 sm:p-6 md:w-2/3 flex flex-col justify-center">
          <div
            class="flex items-center justify-center md:justify-start text-xs uppercase tracking-wide text-gray-400 mb-1"
          >
            <span v-if="sermon.preacher" class="flex items-center gap-1">
              <UserOutlined class="text-[11px]" /> {{ sermon.preacher }}
            </span>
            <span
              v-if="sermon.sermon_date"
              class="flex items-center gap-1"
              :class="sermon.preacher ? 'ml-3' : ''"
            >
              <span class="w-1 h-1 rounded-full bg-gray-300" v-if="sermon.preacher" />
              {{ formatDate(sermon.sermon_date) }}
            </span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2 text-center md:text-left">
            <RouterLink
              :to="{ name: 'dailySermonDetail', params: { id: sermon.id } }"
              class="hover:text-purple-700 transition-colors"
            >
              {{ sermon.title }}
            </RouterLink>
          </h3>
          <p class="text-gray-600 mb-4 line-clamp-2 text-center md:text-left">
            {{ sermon.snippet }}
          </p>

          <div class="flex justify-center md:justify-start">
            <RouterLink
              :to="{ name: 'dailySermonDetail', params: { id: sermon.id } }"
              class="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full font-medium hover:bg-purple-100 transition-colors text-sm"
            >
              Listen now
              <SoundOutlined />
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { PlayCircleOutlined, UserOutlined, SoundOutlined } from '@ant-design/icons-vue';
import { SermonService } from '@/services/SermonService';

const props = defineProps({
  setPageMeta: {
    type: Function,
    default: null,
  },
});

const sermons = ref([]);

function formatDate(value) {
  if (!value) return '';
  try {
    const d = new Date(value);
    return d.toLocaleDateString();
  } catch {
    return value;
  }
}

async function loadSermons() {
  try {
    const data = await SermonService.getAllSermons({ limit: 20 });
    sermons.value = data;
  } catch (error) {
    console.error('Failed to load sermons', error);
  }
}

onMounted(() => {
  if (props.setPageMeta) {
    props.setPageMeta({
      title: 'ធម្មទេសនា​ប្រចាំថ្ងៃ',
      // subtitle: 'Short reflections to accompany your daily walk with God.',
    });
  }
  loadSermons();
});
</script>
