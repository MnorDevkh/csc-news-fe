<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { ArrowRightOutlined } from '@ant-design/icons-vue';
import { SaintService } from '@/services/SaintService';

const loading = ref(true);
const error = ref('');
const saints = ref([]);

const saintsList = computed(() => saints.value || []);

async function loadSaints() {
  loading.value = true;
  error.value = '';
  try {
    const data = await SaintService.getPublicSaints({ skip: 0, limit: 5 });
    saints.value = data?.items || [];
  } catch (e) {
    console.error('Failed to load saints:', e);
    error.value = 'Failed to load saints. Please try again later.';
    saints.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadSaints();
});
</script>

<template>
  <div class="w-full">
    <div v-if="loading" class="py-6 text-sm text-gray-500">
      Loading...
    </div>

    <div v-else-if="error" class="py-6 text-sm text-red-600">
      {{ error }}
    </div>

    <div v-else-if="!saintsList.length" class="py-6 text-sm text-gray-500">
      No saints found.
    </div>

    <ul v-else class="divide-y divide-gray-200">
      <li v-for="saint in saintsList" :key="saint.id" class="group">
        <RouterLink
          :to="{ name: 'saintDetail', params: { slug: saint.slug } }"
          class="flex items-start gap-4 py-4 px-1 hover:bg-gray-50 transition-colors duration-200"
        >
          <div class="flex-shrink-0">
            <img
              :src="saint.image_url"
              :alt="saint.name"
              class="h-25 w-25 rounded-md object-cover shadow-sm bg-gray-100"
              loading="lazy"
            >
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-semibold text-gray-800 group-hover:text-burgundy transition-colors">
              {{ saint.name }}
            </h4>
            <p class="text-sm text-gray-500">Feast Day: {{ saint.feast_day || '-' }}</p>
            <p class="text-sm text-gray-600 mt-1 line-clamp-2">
              {{ saint.bio_snippet || '' }}
            </p>
          </div>
          <ArrowRightOutlined class="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
        </RouterLink>
      </li>
    </ul>
  </div>
</template>