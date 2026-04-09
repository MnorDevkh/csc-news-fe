<template>
  <div class="bg-white p-8 rounded-md shadow-sm border border-gray-200 max-w-2xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold text-gray-800">{{ isEditMode ? 'Edit Chapter' : 'Create Chapter' }}</h2>
      <button @click="goBack" class="text-gray-500 hover:text-gray-700">Cancel</button>
    </div>

    <div v-if="pageLoading" class="flex justify-center py-16">
      <a-spin size="large" />
    </div>

    <div v-else-if="loadError" class="text-center py-12">
      <p class="text-red-600 mb-4">{{ loadError }}</p>
      <button @click="goBack" class="text-blue-600 hover:text-blue-800 font-medium">Back to Chapters</button>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div
        v-if="feedbackMsg"
        class="px-4 py-3 rounded-md text-sm flex items-center justify-between"
        :class="feedbackType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'"
      >
        <span>{{ feedbackMsg }}</span>
        <button type="button" @click="feedbackMsg = ''" class="ml-3 text-current opacity-60 hover:opacity-100">&times;</button>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Languages (filter)</label>
        <div class="flex flex-wrap gap-4 mb-1">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="langKm" type="checkbox" class="w-4 h-4 text-blue-600 rounded border-gray-300" />
            <span class="text-sm text-gray-700">Khmer (km)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="langEn" type="checkbox" class="w-4 h-4 text-blue-600 rounded border-gray-300" />
            <span class="text-sm text-gray-700">English (en)</span>
          </label>
        </div>
        <p class="text-xs text-gray-500 mb-3">Show Bibles that match at least one selected language (default: Khmer).</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Bible <span class="text-red-500">*</span></label>
        <select
          v-model="form.bible_id"
          required
          :disabled="isEditMode"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select a Bible</option>
          <option
            v-for="b in bibleOptionsFiltered"
            :key="b.id"
            :value="b.id"
          >
            {{ b.name }}{{ b.language ? ` (${b.language})` : '' }}
          </option>
        </select>
        <p v-if="isEditMode" class="mt-1 text-xs text-gray-500">Bible cannot be changed when editing.</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Chapter number <span class="text-red-500">*</span></label>
        <input
          v-model.number="form.chapter_number"
          type="number"
          required
          min="1"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="1"
        />
      </div>

      <div v-if="isEditMode" class="pt-4 border-t border-gray-100">
        <router-link
          :to="{ name: 'adminSectionList', query: { chapter_id: route.params.chapterId } }"
          class="text-blue-600 hover:text-blue-800 font-medium"
        >
          Manage sections for this chapter
        </router-link>
      </div>

      <div class="flex justify-end pt-6 border-t border-gray-100">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <span v-if="isSubmitting" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          {{ isEditMode ? 'Update' : 'Create' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ChapterService from '@/services/ChapterService';
import { BibleService } from '@/services/BibleService';
import { bibleMatchesLanguageFilter } from '@/utils/bibleLanguage';

const route = useRoute();
const router = useRouter();

const bibleId = computed(() => route.params.bibleId);
const isEditMode = computed(() => !!route.params.chapterId);
const isSubmitting = ref(false);
const pageLoading = ref(false);
const loadError = ref(null);
const feedbackMsg = ref('');
const feedbackType = ref('success');
const bibleOptions = ref([]);
const langKm = ref(true);
const langEn = ref(false);

const bibleOptionsFiltered = computed(() => {
  const filtered = bibleOptions.value.filter((b) =>
    bibleMatchesLanguageFilter(b, { km: langKm.value, en: langEn.value }),
  );
  const selectedId = form.bible_id ?? bibleId.value;
  if (!selectedId) return filtered;
  if (filtered.some((b) => b.id === selectedId)) return filtered;
  const extra = bibleOptions.value.find((b) => b.id === selectedId);
  return extra ? [...filtered, extra] : filtered;
});

const form = reactive({
  chapter_number: 1,
  bible_id: null,
});

function goBack() {
  const q = form.bible_id || bibleId.value ? { bible: form.bible_id || bibleId.value } : {};
  router.push({ name: 'adminChapterList', query: q });
}

async function loadBibleOptions() {
  try {
    const res = await BibleService.getBibles({
      skip: 0,
      limit: 200,
      order_by: 'bible_number',
    });
    const data = res.data;
    bibleOptions.value = data?.items ?? (Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('Failed to load bible options', err);
    bibleOptions.value = [];
  }
}

onMounted(async () => {
  await loadBibleOptions();
  if (!form.bible_id && bibleId.value) {
    form.bible_id = bibleId.value;
  }
  pageLoading.value = isEditMode.value;
  if (!isEditMode.value) {
    pageLoading.value = false;
    return;
  }
  try {
    const res = await ChapterService.getChapter(route.params.chapterId);
    const ch = res.data;
    Object.assign(form, {
      chapter_number: ch.chapter_number ?? 1,
      bible_id: ch.bible_id || bibleId.value,
    });
  } catch (err) {
    console.error('Error loading chapter:', err);
    loadError.value = 'Failed to load chapter. Please try again.';
  } finally {
    pageLoading.value = false;
  }
});

async function handleSubmit() {
  feedbackMsg.value = '';
  const effectiveBibleId = form.bible_id ?? bibleId.value;
  if (!effectiveBibleId) {
    feedbackType.value = 'error';
    feedbackMsg.value = 'Please select a Bible.';
    return;
  }
  try {
    isSubmitting.value = true;
    const payload = {
      chapter_number: form.chapter_number,
      bible_id: effectiveBibleId,
    };
    if (isEditMode.value) {
      await ChapterService.updateChapter(route.params.chapterId, payload);
      feedbackType.value = 'success';
      feedbackMsg.value = 'Chapter updated successfully.';
    } else {
      await ChapterService.createChapter(payload);
      feedbackType.value = 'success';
      feedbackMsg.value = 'Chapter created successfully.';
    }
    setTimeout(goBack, 800);
  } catch (err) {
    console.error('Error saving chapter:', err);
    const detail = err.response?.data?.detail;
    feedbackType.value = 'error';
    feedbackMsg.value =
      typeof detail === 'string' ? detail : 'Failed to save chapter. Please check your inputs and try again.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>
