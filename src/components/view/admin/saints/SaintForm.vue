<template>
  <div class="saint-form bg-white p-8 rounded-md shadow-sm border border-gray-200 max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold text-gray-800">
        {{ isEditMode ? 'Edit Saint' : 'Create Saint' }}
      </h2>
      <div class="flex items-center gap-4">
        <button
          type="button"
          class="text-gray-600 hover:text-gray-800 font-medium"
          @click="openPreview"
        >
          Preview
        </button>
        <button
          type="button"
          class="text-gray-500 hover:text-gray-700"
          @click="$router.push({ name: 'adminSaints' })"
        >
          Cancel
        </button>
      </div>
    </div>

    <div v-if="pageLoading" class="flex justify-center py-16">
      <a-spin size="large" />
    </div>

    <div v-else-if="loadError" class="text-center py-12">
      <p class="text-red-600 mb-4">{{ loadError }}</p>
      <button
        type="button"
        @click="$router.push({ name: 'adminSaints' })"
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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Saint name"
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
            placeholder="saint-name"
          />
          <p class="mt-1 text-xs text-gray-400">Used in the public URL: <span class="font-mono">/saints/{{ form.slug || '...' }}</span></p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Feast day</label>
          <input
            v-model="form.feast_day"
            type="text"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. March 19"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Patron of</label>
          <input
            v-model="form.patron_of"
            type="text"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. Families, workers..."
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Bio snippet</label>
        <textarea
          v-model="form.bio_snippet"
          rows="3"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Short teaser used in lists..."
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <div class="prose max-w-none">
          <ckeditor :editor="editor" v-model="form.content" :config="editorConfig"></ckeditor>
        </div>
        <p class="mt-1 text-xs text-gray-400">This will be rendered on the public detail page.</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Image</label>
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="w-full sm:w-64">
            <div class="relative w-full h-36 rounded-md border border-gray-200 bg-gray-50 overflow-hidden">
              <img
                v-if="form.image_url"
                :src="form.image_url"
                alt="Saint image"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                No image selected
              </div>
            </div>
          </div>
          <div class="flex-1 flex items-start gap-3">
            <button
              type="button"
              class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
              @click="openImageModal"
            >
              <PictureOutlined />
              Select image
            </button>
            <button
              v-if="form.image_url"
              type="button"
              class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
              @click="form.image_url = ''"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <label class="text-sm font-medium text-gray-700">Published</label>
        <input
          v-model="form.is_published"
          type="checkbox"
          class="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
      </div>

      <div class="flex justify-end pt-6 border-t border-gray-100">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-md shadow-blue-600/20 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:transform-none"
        >
          <span v-if="isSubmitting" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-md" />
          {{ isEditMode ? 'Update Saint' : 'Create Saint' }}
        </button>
      </div>
    </form>

    <ImageSelectModal
      v-model:open="imageModalOpen"
      mode="single"
      title="Select image"
      confirm-label="Select"
      @confirm="onImageSelected"
    />

    <a-modal
      v-model:open="previewOpen"
      title="Preview"
      width="900px"
      :footer="null"
    >
      <div class="bg-gray-50 p-4 rounded-md">
        <article class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-5">
            <div class="lg:col-span-2 bg-gray-100">
              <img
                v-if="form.image_url"
                :src="form.image_url"
                :alt="form.name"
                class="w-full h-56 lg:h-full object-cover"
              />
              <div v-else class="w-full h-56 lg:h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            </div>
            <div class="lg:col-span-3 p-5 sm:p-7">
              <h1 class="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">
                {{ form.name || 'Saint name' }}
              </h1>

              <div class="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
                <span class="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 ring-1 ring-gray-200">
                  Feast Day: {{ form.feast_day || '-' }}
                </span>
                <span
                  v-if="form.patron_of"
                  class="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 ring-1 ring-gray-200"
                >
                  Patron of: {{ form.patron_of }}
                </span>
              </div>

              <p v-if="form.bio_snippet" class="mt-4 text-gray-700">
                {{ form.bio_snippet }}
              </p>

              <div
                v-if="form.content"
                class="mt-6 article-body prose prose-gray prose-lg max-w-none"
                v-html="form.content"
              />
            </div>
          </div>
        </article>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PictureOutlined } from '@ant-design/icons-vue';
import ImageSelectModal from '@/components/ImageSelectModal.vue';
import { SaintService } from '@/services/SaintService';
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

const route = useRoute();
const router = useRouter();

const isEditMode = computed(() => !!route.params.id);

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

const pageLoading = ref(false);
const loadError = ref('');
const isSubmitting = ref(false);

const feedbackMsg = ref('');
const feedbackType = ref('success');

const imageModalOpen = ref(false);
const previewOpen = ref(false);

const form = reactive({
  name: '',
  slug: '',
  feast_day: '',
  patron_of: '',
  bio_snippet: '',
  content: '',
  image_url: '',
  is_published: true,
});

function slugify(value) {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function autoGenerateSlug() {
  if (!form.slug && form.name) {
    form.slug = slugify(form.name);
  }
}

function openImageModal() {
  imageModalOpen.value = true;
}

function onImageSelected(payload) {
  // ImageSelectModal confirm payload varies by mode; normalize to a url string when possible.
  const item = Array.isArray(payload) ? payload[0] : payload;
  const url = item?.url || item?.public_url || item?.thumbnail || item;
  if (typeof url === 'string') {
    form.image_url = url;
  }
}

function openPreview() {
  previewOpen.value = true;
}

function setFeedback(type, msg) {
  feedbackType.value = type;
  feedbackMsg.value = msg;
}

async function handleSubmit() {
  isSubmitting.value = true;
  feedbackMsg.value = '';
  try {
    const payload = {
      name: form.name,
      slug: form.slug,
      feast_day: form.feast_day || null,
      patron_of: form.patron_of || null,
      bio_snippet: form.bio_snippet || null,
      content: form.content || null,
      image_url: form.image_url || null,
      is_published: !!form.is_published,
    };

    if (isEditMode.value) {
      await SaintService.updateSaint(route.params.id, payload);
      setFeedback('success', 'Saint updated successfully.');
    } else {
      await SaintService.createSaint(payload);
      setFeedback('success', 'Saint created successfully.');
    }

    setTimeout(() => router.push({ name: 'adminSaints' }), 800);
  } catch (err) {
    console.error('Failed to save saint:', err);
    const detail = err.response?.data?.detail;
    setFeedback('error', detail || err.message || 'Failed to save saint.');
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(async () => {
  pageLoading.value = isEditMode.value;
  loadError.value = '';
  try {
    if (isEditMode.value) {
      const data = await SaintService.getAdminSaintById(route.params.id);
      form.name = data?.name || '';
      form.slug = data?.slug || '';
      form.feast_day = data?.feast_day || '';
      form.patron_of = data?.patron_of || '';
      form.bio_snippet = data?.bio_snippet || '';
      form.content = data?.content || '';
      form.image_url = data?.image_url || '';
      form.is_published = !!data?.is_published;
    }
  } catch (err) {
    console.error('Failed to load saint:', err);
    const status = err.response?.status;
    loadError.value =
      status === 404 ? 'Saint not found.' : (err.response?.data?.detail || err.message || 'Failed to load saint.');
  } finally {
    pageLoading.value = false;
  }
});
</script>

<style scoped>
.saint-form :deep(.ck.ck-editor__editable) {
  min-height: 380px;
}
</style>

