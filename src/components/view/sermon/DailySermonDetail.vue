<template>
  <section class="pb-4">
    <!-- Back Button -->
    <button @click="$router.back()"
      class="flex items-center text-gray-500 hover:text-purple-600 transition-colors mb-6 group text-sm">
      <ArrowLeftOutlined class="mr-2 group-hover:-translate-x-1 transition-transform" />
      {{ t('dailySermon.backToSermons') }}
    </button>

    <article class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Video/Hero Section -->
      <!-- <div class="aspect-video bg-black relative flex items-center justify-center group">
        <img v-if="sermon.thumbnail" :src="sermon.thumbnail" :alt="sermon.title"
          class="w-full h-full object-cover opacity-80" />
        <div v-else
          class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-600 text-white text-xl font-semibold">
          {{ sermon.title }}
        </div>
        <div v-if="sermon.media_url" class="absolute inset-0 flex items-center justify-center">
          <div
            class="h-20 w-20 bg-purple-600/90 rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
            <CaretRightOutlined class="text-4xl text-white" />
          </div>
        </div>
      </div> -->

      <div class="p-4 sm:p-10">
        <div class="flex flex-col items-start mb-4">
          <div class="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-500">
            <span v-if="sermon.preacher" class="flex items-center gap-1">
              <UserOutlined /> {{ sermon.preacher }}
            </span>
            <span v-if="sermon.sermon_date" class="flex items-center gap-1">
              <CalendarOutlined /> {{ formatDate(sermon.sermon_date) }}
            </span>
          </div>

          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {{ sermon.title }}
          </h1>
        </div>

        <div v-if="sermon.snippet" class="max-w-2xl mx-auto text-left text-gray-700 leading-relaxed mb-6">
          <div class="prose prose-blue max-w-none" v-html="sermon.snippet" />
        </div>

        <div v-if="sermon.media_url" class="mt-6 max-w-2xl mx-auto">
          <div v-if="sermon.media_type === 'video'" class="w-full">
            <video :src="sermon.media_url" controls class="w-full rounded-2xl border border-gray-200 shadow-sm" />
          </div>
          <div v-else class="w-full">
            <audio :src="sermon.media_url" controls class="w-full" />
          </div>
        </div>

        <div class="mt-10 pt-6 border-t border-gray-100 flex justify-center text-xs text-gray-400">
          <span v-if="sermon.status === 'inactive'">
            {{ t('dailySermon.inactive') }}
          </span>
          <span v-else>
            {{ t('dailySermon.thankYou') }}
          </span>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ArrowLeftOutlined, CaretRightOutlined, UserOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons-vue';
import { SermonService } from '@/services/SermonService';

const { t } = useI18n();

const props = defineProps({
  setPageMeta: {
    type: Function,
    default: null,
  },
});

const route = useRoute();
const router = useRouter();

const sermon = ref({
  title: '',
  preacher: '',
  sermon_date: '',
  snippet: '',
  thumbnail: '',
  media_url: '',
  media_type: '',
  status: 'active',
});

function formatDate(value) {
  if (!value) return '';
  try {
    const d = new Date(value);
    return d.toLocaleDateString();
  } catch {
    return value;
  }
}

async function loadSermon() {
  try {
    const data = await SermonService.getSermonById(route.params.id);
    sermon.value = data;

  } catch (error) {
    console.error('Failed to load sermon', error);
    router.push({ name: 'dailySermonList' });
  }
}

onMounted(() => {
  loadSermon();
  if (props.setPageMeta) {
    props.setPageMeta({
      title: t('dailySermon.title'),
    });
  }
});
</script>
