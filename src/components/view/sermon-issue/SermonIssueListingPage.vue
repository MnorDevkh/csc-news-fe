<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SermonIssueService } from '@/services/SermonIssueService';

const { t } = useI18n();

const props = defineProps({
  /** When true, strip page chrome for use inside HomePage or other layouts */
  embed: {
    type: Boolean,
    default: false,
  },
  /** Max issues to fetch; full page defaults to 100, embed defaults to 6 when not set */
  previewLimit: {
    type: Number,
    default: null,
  },
});

const router = useRouter();

const issues = ref([]);
const loading = ref(true);
const error = ref('');

function formatDate(value) {
  if (!value) return '';
  try {
    const d = new Date(value);
    return d.toLocaleDateString();
  } catch {
    return value;
  }
}

function fetchLimit() {
  if (props.previewLimit != null) return props.previewLimit;
  if (props.embed) return 6;
  return 100;
}

async function loadIssues() {
  loading.value = true;
  error.value = '';
  try {
    const data = await SermonIssueService.getIssues({
      skip: 0,
      limit: fetchLimit(),
      is_published: true,
    });
    issues.value = data.items || [];
  } catch (e) {
    console.error('Failed to load sermon issues', e);
    error.value = t('sermonIssue.loadListFailed');
  } finally {
    loading.value = false;
  }
}

function goToDetail(issue) {
  router.push({ name: 'sermonIssueDetail', params: { slug: issue.slug } });
}

onMounted(() => {
  loadIssues();
});
</script>

<template>
  <div :class="embed ? 'w-full' : 'min-h-screen bg-surface py-6 sm:py-10'">
    <div :class="embed ? 'w-full' : 'max-w-6xl mx-auto px-3 sm:px-5'">
      <header v-if="!embed" class="mb-6 sm:mb-8">
        <h1 class="text-3xl font-bold text-stone-900 mb-2 tracking-tight">{{ t('sermonIssue.title') }}</h1>
        <p class="text-stone-600 text-sm">
          {{ t('sermonIssue.subtitle') }}
        </p>
      </header>

      <div
        v-if="loading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-pulse"
      >
        <div
          v-for="n in embed ? 3 : 6"
          :key="n"
          class="bg-surface-elevated rounded-2xl shadow-sm ring-1 ring-black/5 p-4"
        >
          <div class="h-40 bg-stone-200 rounded-xl mb-4" />
          <div class="h-4 bg-stone-200 rounded w-3/4 mb-2" />
          <div class="h-3 bg-stone-200 rounded w-1/2" />
        </div>
      </div>

      <div v-else-if="error" class="bg-surface-elevated rounded-2xl shadow-sm ring-1 ring-red-100/80 p-6 text-center">
        <p class="text-red-600 text-sm mb-0">{{ error }}</p>
      </div>

      <div
        v-else-if="!issues.length"
        class="bg-surface-elevated rounded-2xl shadow-sm ring-1 ring-black/5 p-6 text-center"
      >
        <p class="text-stone-500 text-sm mb-0">{{ t('sermonIssue.noIssues') }}</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <article
          v-for="issue in issues"
          :key="issue.id"
          class="bg-surface-elevated rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden cursor-pointer group flex flex-col hover:shadow-md duration-200 ease-out"
          @click="goToDetail(issue)"
        >
          <div class="relative h-48 bg-stone-100 overflow-hidden">
            <img
              v-if="issue.thumbnail_url"
              :src="issue.thumbnail_url"
              :alt="issue.title"
              class="w-full h-full object-cover group-hover:scale-105 duration-300 ease-out"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-stone-400 text-xs uppercase tracking-wide bg-gradient-to-br from-stone-100 to-stone-200"
            >
              {{ t('sermonIssue.title') }}
            </div>
          </div>
          <div class="p-4 flex-1 flex flex-col">
            <h2 class="text-base font-semibold text-stone-900 mb-1 group-hover:text-primary duration-200">
              {{ issue.title }}
            </h2>
            <p class="text-xs text-stone-500 mb-2">
              {{ formatDate(issue.issue_date) }}
            </p>
            <p class="text-sm text-stone-600 line-clamp-2 flex-1">
              {{ issue.description }}
            </p>
            <div class="mt-4 text-sm text-primary font-medium flex items-center">
              {{ t('sermonIssue.viewIssue') }}
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
