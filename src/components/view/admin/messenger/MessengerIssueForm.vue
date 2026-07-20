<template>
  <div class="bg-white p-8 rounded-md shadow-sm border border-gray-200 max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold text-gray-800">
        {{ isEditMode ? 'Edit Messenger Issue' : 'Create Messenger Issue' }}
      </h2>
      <button @click="$router.push({ name: 'adminMessengerIssues' })" class="text-gray-500 hover:text-gray-700">
        Cancel
      </button>
    </div>

    <div v-if="pageLoading" class="flex justify-center py-16">
      <a-spin size="large" />
    </div>

    <div v-else-if="loadError" class="text-center py-12">
      <p class="text-red-600 mb-4">{{ loadError }}</p>
      <button
        @click="$router.push({ name: 'adminMessengerIssues' })"
        class="text-blue-600 hover:text-blue-800 font-medium"
      >
        Back to list
      </button>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-8">
      <div
        v-if="feedbackMsg"
        class="px-4 py-3 rounded-md text-sm flex items-center justify-between"
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

      <!-- Title & Slug -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Issue title"
            @blur="autoGenerateSlug"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Slug</label>
          <input
            v-model="form.slug"
            type="text"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="slug-for-url"
          />
        </div>
      </div>

      <!-- Issue date -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Issue date</label>
          <input
            v-model="form.issue_date"
            type="date"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div class="flex items-center gap-3 pt-7">
          <label class="text-sm font-medium text-gray-700">Published</label>
          <input
            v-model="form.is_published"
            type="checkbox"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
        </div>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Short description to show in listings..."
        />
      </div>

      <!-- Thumbnail URL -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL (optional)</label>
        <input
          v-model="form.thumbnail_url"
          type="url"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="https://example.com/cover.jpg"
        />
        <p class="mt-1 text-xs text-gray-500">You can reuse an image from the gallery or an external URL.</p>
      </div>

      <!-- PDF upload -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">PDF file</label>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div class="md:col-span-2">
            <input
              ref="pdfInputRef"
              type="file"
              accept="application/pdf"
              class="hidden"
              @change="handlePdfSelect"
            />
            <button
              type="button"
              :disabled="pdfUploading"
              class="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-800 px-4 py-2 rounded-md font-medium transition-colors"
              @click="triggerPdfInput"
            >
              <PlusOutlined />
              {{ pdfUploading ? 'Uploading…' : (form.pdf_url ? 'Replace PDF' : 'Upload PDF') }}
            </button>
            <p v-if="pdfError" class="mt-2 text-xs text-red-600">{{ pdfError }}</p>
          </div>
          <div class="md:text-right text-sm text-gray-500">
            <div v-if="form.pdf_url" class="truncate mb-1">
              Linked: {{ form.pdf_url }}
            </div>
            <div v-else class="text-xs text-gray-400">
              No PDF linked yet
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end pt-6 border-t border-gray-100">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors flex items-center gap-2"
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
import { PlusOutlined } from '@ant-design/icons-vue';
import { MessengerService } from '@/services/MessengerService';

const route = useRoute();
const router = useRouter();

const isEditMode = computed(() => !!route.params.id);
const isSubmitting = ref(false);
const pageLoading = ref(false);
const loadError = ref(null);
const feedbackMsg = ref('');
const feedbackType = ref('success');
const resolvedIssueId = ref(null);

const pdfInputRef = ref(null);
const pdfUploading = ref(false);
const pdfError = ref(null);

const form = reactive({
  title: '',
  slug: '',
  description: '',
  issue_date: '',
  pdf_url: '',
  thumbnail_url: '',
  is_published: false,
});

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value) {
  return UUID_RE.test(String(value || ''));
}

function slugify(value) {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function autoGenerateSlug() {
  if (!form.slug && form.title) {
    form.slug = slugify(form.title);
  }
}

function triggerPdfInput() {
  pdfInputRef.value?.click();
}

async function handlePdfSelect(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  pdfError.value = null;
  pdfUploading.value = true;
  try {
    const { url } = await MessengerService.uploadPdf(file);
    form.pdf_url = url;
  } catch (err) {
    console.error('Failed to upload PDF', err);
    const status = err.response?.status;
    const detail = err.response?.data?.detail;
    if (status === 401 || status === 403) {
      pdfError.value = 'Your session has expired. Please log in again, then retry the upload.';
    } else {
      pdfError.value = detail || err.message || 'Failed to upload PDF file.';
    }
  } finally {
    pdfUploading.value = false;
    event.target.value = '';
  }
}

onMounted(async () => {
  pageLoading.value = isEditMode.value;
  try {
    if (isEditMode.value) {
      const param = route.params.id;
      const issue = isUuid(param)
        ? await MessengerService.getAdminIssueById(param)
        : await MessengerService.getAdminIssueBySlug(param);
      resolvedIssueId.value = issue.id;
      Object.assign(form, {
        title: issue.title,
        slug: issue.slug,
        description: issue.description || '',
        issue_date: issue.issue_date ? issue.issue_date.substring(0, 10) : '',
        pdf_url: issue.pdf_url || '',
        thumbnail_url: issue.thumbnail_url || '',
        is_published: !!issue.is_published,
      });
    }
  } catch (err) {
    console.error('Error loading messenger issue:', err);
    loadError.value = 'Failed to load issue data. Please try again.';
  } finally {
    pageLoading.value = false;
  }
});

async function handleSubmit() {
  feedbackMsg.value = '';
  try {
    isSubmitting.value = true;
    const payload = { ...form };

    // Normalize empty strings to null where appropriate
    if (!payload.description) payload.description = null;
    if (!payload.thumbnail_url) payload.thumbnail_url = null;

    if (!payload.pdf_url) {
      feedbackType.value = 'error';
      feedbackMsg.value = 'Please upload a PDF file before saving.';
      isSubmitting.value = false;
      return;
    }

    if (isEditMode.value) {
      await MessengerService.updateIssue(resolvedIssueId.value || route.params.id, payload);
      feedbackType.value = 'success';
      feedbackMsg.value = 'Issue updated successfully!';
    } else {
      await MessengerService.createIssue(payload);
      feedbackType.value = 'success';
      feedbackMsg.value = 'Issue created successfully!';
    }
    setTimeout(() => router.push({ name: 'adminMessengerIssues' }), 800);
  } catch (err) {
    console.error('Error saving messenger issue:', err);
    const detail = err.response?.data?.detail;
    feedbackType.value = 'error';
    feedbackMsg.value =
      typeof detail === 'string'
        ? detail
        : 'Failed to save issue. Please check your inputs and try again.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

