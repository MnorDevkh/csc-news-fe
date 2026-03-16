<template>
  <div class="daily-reading-form bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-3xl mx-auto my-6">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold text-gray-800">
        {{ isEditMode ? 'Edit Daily Reading' : 'Create Daily Reading' }}
      </h2>
      <button @click="$router.push({ name: 'adminBible' })" class="text-gray-500 hover:text-gray-700">
        Cancel
      </button>
    </div>

    <div v-if="pageLoading" class="flex justify-center py-16">
      <a-spin size="large" />
    </div>

    <!-- <div v-else-if="loadError" class="text-center py-12">
      <p class="text-red-600 mb-4">{{ loadError }}</p>
      <button
        @click="$router.push({ name: 'adminBible' })"
        class="text-blue-600 hover:text-blue-800 font-medium"
      >
        Back to Daily Readings
      </button>
    </div> -->

    <form v-else @submit.prevent="handleSubmit" class="space-y-8">
      <div
        v-if="feedbackMsg"
        class="px-4 py-3 rounded-lg text-sm flex items-center justify-between"
        :class="feedbackType === 'success'
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-red-50 text-red-700 border border-red-200'"
      >
        <span>{{ feedbackMsg }}</span>
        <button
          type="button"
          @click="feedbackMsg = ''"
          class="ml-3 text-current opacity-60 hover:opacity-100"
        >
          &times;
        </button>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          v-model="form.title"
          type="text"
          required
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Daily reading title or theme"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Reference</label>
          <input
            v-model="form.reference"
            type="text"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. John 3:16-18"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            v-model="form.reading_date"
            type="date"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
        <textarea
          v-model="form.snippet"
          rows="3"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Short summary to show in lists..."
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Full Text</label>
        <div class="prose max-w-none">
          <ckeditor :editor="editor" v-model="form.content" :config="editorConfig"></ckeditor>
        </div>
      </div>

      <div class="flex items-center gap-6 pb-2">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="form.status"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end pt-6 border-t border-gray-100">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <span
            v-if="isSubmitting"
            class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
          />
          {{ isEditMode ? 'Update' : 'Create' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { DailyReadingService } from '@/services/DailyReadingService';
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

const isEditMode = computed(() => !!route.params.id);
const isSubmitting = ref(false);
const pageLoading = ref(false);
const loadError = ref(null);
const feedbackMsg = ref('');
const feedbackType = ref('success');

const form = reactive({
  title: '',
  reference: '',
  reading_date: '',
  snippet: '',
  content: '',
  status: 'active',
});

onMounted(async () => {
  pageLoading.value = isEditMode.value;
  try {
    if (isEditMode.value) {
      const reading = await DailyReadingService.getReadingById(route.params.id);
      Object.assign(form, {
        title: reading.title || '',
        reference: reading.reference || '',
        reading_date: reading.reading_date
          ? reading.reading_date.substring(0, 10)
          : '',
        snippet: reading.snippet || '',
        content: reading.content || '',
        status: reading.status || 'active',
      });
    }
  } catch (err) {
    console.error('Error loading daily reading:', err);
    loadError.value = 'Failed to load daily reading data. Please try again.';
  } finally {
    pageLoading.value = false;
  }
});

async function handleSubmit() {
  feedbackMsg.value = '';
  try {
    isSubmitting.value = true;
    const payload = { ...form };

    if (!payload.reference) payload.reference = null;
    if (!payload.snippet) payload.snippet = null;
    if (!payload.content) payload.content = null;

    if (isEditMode.value) {
      await DailyReadingService.updateReading(route.params.id, payload);
      feedbackType.value = 'success';
      feedbackMsg.value = 'Daily reading updated successfully!';
    } else {
      await DailyReadingService.createReading(payload);
      feedbackType.value = 'success';
      feedbackMsg.value = 'Daily reading created successfully!';
    }
    setTimeout(() => router.push({ name: 'adminBible' }), 800);
  } catch (err) {
    console.error('Error saving daily reading:', err);
    const detail = err.response?.data?.detail;
    feedbackType.value = 'error';
    feedbackMsg.value =
      typeof detail === 'string'
        ? detail
        : 'Failed to save daily reading. Please check your inputs and try again.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.daily-reading-form :deep(.ck-editor__editable_inline) {
  min-height: 220px;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
}

.daily-reading-form :deep(.ck.ck-editor__main) {
  border-radius: 0.5rem;
  overflow: hidden;
}

.daily-reading-form :deep(.ck.ck-toolbar) {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.daily-reading-form :deep(.ck.ck-content) {
  font-size: 0.95rem;
  line-height: 1.6;
}

.daily-reading-form :deep(table) {
  width: 100%;
  max-width: 100%;
  table-layout: auto;
  border-collapse: collapse;
}

.daily-reading-form :deep(td),
.daily-reading-form :deep(th) {
  word-break: break-word;
  padding: 0.4rem 0.5rem;
}
</style>

