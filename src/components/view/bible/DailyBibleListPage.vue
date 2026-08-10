<template>
  <div class="min-h-screen bg-gray-50 pt-4 pb-12 font-sans">
    <div class="max-w-5xl mx-auto">
      <div v-if="loading" class="py-16 text-center text-gray-500">
        {{ t('dailyBible.loadingList') }}
      </div>

      <div v-else-if="!readings.length" class="py-16 text-center text-gray-500">
        {{ t('dailyBible.emptyList') }}
      </div>

      <div v-else class="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-2">
        <div
          v-for="reading in readings"
          :key="reading.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col"
          @click="openReading(reading.id)"
        >
          <div class="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center text-sm text-gray-400 mb-3">
                <CalendarOutlined class="mr-2" /> {{ formatDate(reading.reading_date) }}
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">
                {{ reading.title }}
              </h3>
              <p class="text-gray-600 mb-4 line-clamp-3">
                {{ reading.snippet }}
              </p>
            </div>

            <div
              class="pt-4 border-t border-gray-50 flex items-center justify-between text-blue-600 font-medium"
            >
              <span>{{ t('dailyBible.readFull') }}</span>
              <ArrowRightOutlined />
            </div>
          </div>
        </div>
      </div>

      <div v-if="totalElements > pageSize" class="flex justify-center mt-10">
        <a-pagination
          v-model:current="currentPage"
          :page-size="pageSize"
          :total="totalElements"
          show-less-items
          @change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { CalendarOutlined, ArrowRightOutlined } from '@ant-design/icons-vue';
import { DailyReadingService } from '@/services/DailyReadingService';

const { t } = useI18n();

const props = defineProps({
  setPageMeta: {
    type: Function,
    default: null,
  },
});

const router = useRouter();

const PAGE_TITLE = t('dailyBible.title');

const readings = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(12);
const totalElements = ref(0);

function formatDate(value) {
  if (!value) return '';
  try {
    const d = new Date(value);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

async function loadReadings(page = 1) {
  loading.value = true;
  try {
    const limit = pageSize.value;
    const skip = (page - 1) * limit;
    const data = await DailyReadingService.getAllReadings({
      skip,
      limit,
      public_only: true,
    });

    if (Array.isArray(data)) {
      readings.value = data;
      totalElements.value = data.length;
    } else {
      readings.value = data.items || [];
      totalElements.value = data.total_elements || 0;
    }
  } catch (error) {
    console.error('Failed to load daily readings', error);
    readings.value = [];
    totalElements.value = 0;
  } finally {
    loading.value = false;
  }
}

function handlePageChange(page) {
  currentPage.value = page;
  loadReadings(page);
}

function openReading(id) {
  router.push({ name: 'dailyBibleDetail', params: { id } });
}

onMounted(() => {
  if (props.setPageMeta) {
    props.setPageMeta({ title: PAGE_TITLE });
  }
  loadReadings(currentPage.value);
});
</script>
