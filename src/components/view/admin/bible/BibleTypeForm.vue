<template>
  <div class="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold text-gray-800">
        {{ isEditMode ? 'Edit Bible Type' : 'Create Bible Type' }}
      </h2>
      <button @click="$router.push({ name: 'adminBibleTypes' })" class="text-gray-500 hover:text-gray-700">
        Cancel
      </button>
    </div>

    <div v-if="pageLoading" class="flex justify-center py-16">
      <a-spin size="large" />
    </div>

    <div v-else-if="loadError" class="text-center py-12">
      <p class="text-red-600 mb-4">{{ loadError }}</p>
      <button
        @click="$router.push({ name: 'adminBibleTypes' })"
        class="text-blue-600 hover:text-blue-800 font-medium"
      >
        Back to Bible Types
      </button>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div
        v-if="feedbackMsg"
        class="px-4 py-3 rounded-lg text-sm flex items-center justify-between"
        :class="feedbackType === 'success'
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-red-50 text-red-700 border border-red-200'"
      >
        <span>{{ feedbackMsg }}</span>
        <button type="button" @click="feedbackMsg = ''" class="ml-3 text-current opacity-60 hover:opacity-100">
          &times;
        </button>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Bible type name"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Slug (optional)</label>
        <input
          v-model="form.slug"
          type="text"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-600"
          placeholder="url-slug"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
        <div class="prose max-w-none">
          <ckeditor :editor="editor" v-model="form.description" :config="editorConfig"></ckeditor>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL (optional)</label>
        <input
          v-model="form.thumbnail"
          type="text"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="https://..."
        />
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
import BaseAPI from '@/services/BaseAPI';
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

const endpoint = '/bible-types/';

const isEditMode = computed(() => !!route.params.id);
const isSubmitting = ref(false);
const pageLoading = ref(false);
const loadError = ref(null);
const feedbackMsg = ref('');
const feedbackType = ref('success');

const form = reactive({
  name: '',
  slug: '',
  description: '',
  thumbnail: '',
});

onMounted(async () => {
  if (!isEditMode.value) {
    pageLoading.value = false;
    return;
  }

  pageLoading.value = true;
  try {
    const res = await BaseAPI.authClient.get(`${endpoint}${route.params.id}`);
    const t = res.data;
    Object.assign(form, {
      name: t.name || '',
      slug: t.slug || '',
      description: t.description || '',
      thumbnail: t.thumbnail || '',
    });
  } catch (err) {
    console.error('Error loading bible type:', err);
    loadError.value = 'Failed to load bible type. Please try again.';
  } finally {
    pageLoading.value = false;
  }
});

async function handleSubmit() {
  feedbackMsg.value = '';
  try {
    isSubmitting.value = true;
    const payload = {
      name: form.name,
      slug: form.slug || null,
      description: form.description || null,
      thumbnail: form.thumbnail || null,
    };

    if (isEditMode.value) {
      await BaseAPI.authClient.put(`${endpoint}${route.params.id}`, payload);
      feedbackType.value = 'success';
      feedbackMsg.value = 'Bible type updated successfully.';
    } else {
      await BaseAPI.authClient.post(endpoint, payload);
      feedbackType.value = 'success';
      feedbackMsg.value = 'Bible type created successfully.';
    }

    setTimeout(() => router.push({ name: 'adminBibleTypes' }), 800);
  } catch (err) {
    console.error('Error saving bible type:', err);
    const detail = err.response?.data?.detail;
    feedbackType.value = 'error';
    feedbackMsg.value =
      typeof detail === 'string' ? detail : 'Failed to save bible type. Please check your inputs and try again.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

