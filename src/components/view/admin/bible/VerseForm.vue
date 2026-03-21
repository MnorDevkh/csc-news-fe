<template>
  <div class="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold text-gray-800">{{ isEditMode ? 'Edit Verse' : 'Create Verse' }}</h2>
      <button @click="goBack" class="text-gray-500 hover:text-gray-700">Cancel</button>
    </div>

    <div v-if="pageLoading" class="flex justify-center py-16">
      <a-spin size="large" />
    </div>

    <div v-else-if="loadError" class="text-center py-12">
      <p class="text-red-600 mb-4">{{ loadError }}</p>
      <button @click="goBack" class="text-blue-600 hover:text-blue-800 font-medium">Back to Verses</button>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div
        v-if="feedbackMsg"
        class="px-4 py-3 rounded-lg text-sm flex items-center justify-between"
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
        <p class="text-xs text-gray-500 mb-3">Show chapters whose Bible matches at least one selected language (default: Khmer).</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Chapter</label>
        <select
          v-model="form.chapter_id"
          required
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option disabled value="">
            {{ chaptersLoading ? 'Loading chapters...' : 'Select chapter' }}
          </option>
          <option
            v-for="ch in chaptersFiltered"
            :key="ch.id"
            :value="ch.id"
          >
            Chapter {{ ch.chapter_number }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Verse number</label>
        <input
          v-model.number="form.verse_number"
          type="number"
          required
          min="1"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="1"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Verse text <span class="text-red-500">*</span></label>
        <div class="prose max-w-none">
          <ckeditor :editor="editor" v-model="form.verse_text" :config="editorConfig"></ckeditor>
        </div>
      </div>

      <div class="flex justify-end pt-6 border-t border-gray-100">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
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
import VerseService from '@/services/VerseService';
import ChapterService from '@/services/ChapterService';
import { chapterMatchesLanguageFilter } from '@/utils/bibleLanguage';
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Link,
  List,
  Heading,
  BlockQuote,
  Table,
  TableToolbar,
  Font,
  Alignment,
  PasteFromOffice,
  GeneralHtmlSupport,
} from 'ckeditor5';

const editor = ClassicEditor;
const editorConfig = {
  licenseKey: 'GPL',
  plugins: [
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Link,
    List,
    Heading,
    BlockQuote,
    Table,
    TableToolbar,
    Font,
    Alignment,
    PasteFromOffice,
    GeneralHtmlSupport,
  ],
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    'bulletedList',
    'numberedList',
    'blockQuote',
    'insertTable',
    '|',
    'fontColor',
    'fontBackgroundColor',
    'alignment',
    '|',
    'undo',
    'redo',
  ],
  htmlSupport: {
    allow: [
      {
        name: /.*/,
        styles: true,
        attributes: true,
        classes: true,
      },
    ],
  },
};

const route = useRoute();
const router = useRouter();

const chapterId = computed(() => route.params.chapterId);
const isEditMode = computed(() => !!route.params.verseId);
const isSubmitting = ref(false);
const pageLoading = ref(false);
const loadError = ref(null);
const feedbackMsg = ref('');
const feedbackType = ref('success');

const chapters = ref([]);
const chaptersLoading = ref(false);
const langKm = ref(true);
const langEn = ref(false);

const chaptersFiltered = computed(() => {
  const filtered = chapters.value.filter((ch) => {
    if (!ch?.bible) return true;
    return chapterMatchesLanguageFilter(ch, { km: langKm.value, en: langEn.value });
  });
  const selectedId = form.chapter_id;
  if (!selectedId) return filtered;
  if (filtered.some((ch) => ch.id === selectedId)) return filtered;
  const extra = chapters.value.find((ch) => ch.id === selectedId);
  return extra ? [...filtered, extra] : filtered;
});

const form = reactive({
  verse_number: 1,
  verse_text: '',
  chapter_id: '',
});

async function loadChapters() {
  chaptersLoading.value = true;
  try {
    const res = await ChapterService.getChapters({
      skip: 0,
      limit: 500,
      order_by: 'chapter_number',
    });
    const data = res.data;
    chapters.value = data?.items ?? (Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('Error loading chapters:', err);
  } finally {
    chaptersLoading.value = false;
  }
}

function goBack() {
  router.push({ name: 'adminVerseList', params: { chapterId: chapterId.value } });
}

onMounted(async () => {
  await loadChapters();
  if (chapterId.value) {
    form.chapter_id = chapterId.value;
  }
  pageLoading.value = isEditMode.value;
  if (!isEditMode.value) {
    pageLoading.value = false;
    return;
  }
  try {
    const res = await VerseService.getVerse(route.params.verseId);
    const v = res.data;
    Object.assign(form, {
      verse_number: v.verse_number ?? 1,
      verse_text: v.verse_text || '',
      chapter_id: v.chapter_id || chapterId.value,
    });
  } catch (err) {
    console.error('Error loading verse:', err);
    loadError.value = 'Failed to load verse. Please try again.';
  } finally {
    pageLoading.value = false;
  }
});

async function handleSubmit() {
  feedbackMsg.value = '';
  try {
    if (!form.chapter_id) {
      feedbackType.value = 'error';
      feedbackMsg.value = 'Please select a chapter.';
      return;
    }

    isSubmitting.value = true;
    const payload = {
      verse_number: form.verse_number,
      verse_text: form.verse_text,
      chapter_id: form.chapter_id,
    };
    if (isEditMode.value) {
      await VerseService.updateVerse(route.params.verseId, payload);
      feedbackType.value = 'success';
      feedbackMsg.value = 'Verse updated successfully.';
    } else {
      await VerseService.createVerse(payload);
      feedbackType.value = 'success';
      feedbackMsg.value = 'Verse created successfully.';
    }
    setTimeout(goBack, 800);
  } catch (err) {
    console.error('Error saving verse:', err);
    const detail = err.response?.data?.detail;
    feedbackType.value = 'error';
    feedbackMsg.value =
      typeof detail === 'string' ? detail : 'Failed to save verse. Please check your inputs and try again.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>
