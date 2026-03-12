<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800">{{ isEditMode ? 'Edit Article' : 'Create Article' }}</h2>
      <button @click="$router.push({ name: 'adminNews' })" class="text-gray-500 hover:text-gray-700">
        Cancel
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input v-model="form.title" type="text" required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Enter article title" />
      </div>

      <!-- Category -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select v-model="form.category_id" required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="" disabled>Select a category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- Thumbnail (cover-style picker) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
        <div
          class="rounded-lg border-2 border-dashed min-h-[140px] flex items-center justify-center bg-gray-50/80 transition-colors cursor-pointer hover:border-blue-400 hover:bg-blue-50/30"
          :class="thumbnailUrl ? 'border-gray-200' : 'border-gray-300'"
          @click="openThumbnailModal"
        >
          <img
            v-if="thumbnailUrl"
            :src="thumbnailUrl"
            alt="Thumbnail"
            class="w-full h-full min-h-[140px] max-h-[200px] object-contain rounded-lg"
          />
          <div v-else class="flex flex-col items-center gap-2 text-gray-400 py-6">
            <PictureOutlined class="text-4xl" />
            <span class="text-sm">Click to select thumbnail image (optional)</span>
          </div>
        </div>
        <!-- Remove thumbnail button -->
        <button
          v-if="thumbnailUrl"
          type="button"
          class="mt-2 text-xs text-red-500 hover:text-red-700 transition-colors"
          @click="removeThumbnail"
        >
          Remove thumbnail
        </button>
      </div>

      <!-- Excerpt -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
        <textarea v-model="form.excerpt" rows="2"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Brief summary used in listings"></textarea>
      </div>

      <!-- CKEditor Content -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
        <div class="prose max-w-none [&_.ck-editor__editable]:min-h-[200px]">
          <ckeditor :editor="editor" v-model="form.content" :config="editorConfig"></ckeditor>
        </div>
      </div>

      <!-- Status & Scheduling -->
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="form.status"
              @change="onStatusChange"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="public">Public</option>
            </select>
            <p class="mt-1 text-xs text-gray-400">
              <template v-if="form.status === 'draft'">Hidden from the site.</template>
              <template v-else-if="form.status === 'scheduled'">Will appear on the site when publish time arrives.</template>
              <template v-else>Visible on the site now.</template>
            </p>
          </div>

          <div v-if="form.status !== 'draft'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Publish at</label>
            <input
              v-model="publishAtLocal"
              type="datetime-local"
              :required="form.status === 'scheduled'"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
            <p class="mt-1 text-xs text-gray-400">
              <template v-if="form.status === 'scheduled'">Required. The article goes live at this time.</template>
              <template v-else>Defaults to now if left empty.</template>
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="form.is_featured" class="w-4 h-4 text-blue-600 rounded border-gray-300" />
            <span class="text-sm text-gray-700">Featured article</span>
          </label>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end pt-4 border-t border-gray-100">
        <button type="submit" :disabled="isSubmitting"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
          <span v-if="isSubmitting" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          {{ isEditMode ? 'Update Article' : 'Create Article' }}
        </button>
      </div>
    </form>

    <!-- Thumbnail selection modal -->
    <ImageSelectModal
      v-model:open="thumbnailModalOpen"
      mode="single"
      title="Select thumbnail image"
      confirm-label="Select"
      @confirm="onThumbnailSelected"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NewsService } from '@/services/NewsService';
import { CategoryService } from '@/services/CategoryService';
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Link, List, Heading, BlockQuote, Table, TableToolbar, Font, Alignment, PasteFromOffice } from 'ckeditor5';
import ImageSelectModal from '@/components/ImageSelectModal.vue';
import { PictureOutlined } from '@ant-design/icons-vue';

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
};

const route = useRoute();
const router = useRouter();

const isEditMode = computed(() => !!route.params.id);
const isSubmitting = ref(false);
const categories = ref([]);

// Thumbnail picker state
const thumbnailModalOpen = ref(false);
const thumbnailUrl = ref('');
const thumbnailKey = ref('');

const form = reactive({
  title: '',
  category_id: '',
  thumbnail: '',
  excerpt: '',
  content: '',
  is_featured: false,
  status: 'public'
});

const publishAtLocal = ref('');

const nowLocalString = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

const onStatusChange = () => {
  if (form.status === 'public' && !publishAtLocal.value) {
    publishAtLocal.value = nowLocalString();
  }
  if (form.status === 'draft') {
    publishAtLocal.value = '';
  }
};

const toLocalInput = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const toIsoWithOffset = (localString) => {
  if (!localString) return null;
  // localString is like '2026-03-11T10:07'
  const d = new Date(localString);
  return d.toISOString();
};

const openThumbnailModal = () => {
  thumbnailModalOpen.value = true;
};

const onThumbnailSelected = (items) => {
  const item = items[0];
  if (item) {
    thumbnailUrl.value = item.url;
    thumbnailKey.value = item.key || '';
    form.thumbnail = item.url;
  }
};

const removeThumbnail = () => {
  thumbnailUrl.value = '';
  thumbnailKey.value = '';
  form.thumbnail = '';
};

onMounted(async () => {
  try {
    // Fetch categories for dropdown
    const cats = await CategoryService.getAllCategories();
    categories.value = cats;

    // If edit mode, fetch article details
    if (isEditMode.value) {
      const article = await NewsService.getArticleById(route.params.id);
      Object.assign(form, {
        title: article.title,
        category_id: article.category_id,
        thumbnail: article.thumbnail,
        excerpt: article.excerpt,
        content: article.content,
        is_featured: article.is_featured,
        status: article.status
      });

      if (article.thumbnail) {
        thumbnailUrl.value = article.thumbnail;
      }

      if (article.publish_at) {
        publishAtLocal.value = toLocalInput(article.publish_at);
      }
    }
  } catch (error) {
    console.error("Error loading data:", error);
    alert("Failed to load data. Please check console.");
  }
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    const payload = {
      ...form,
      publish_at: publishAtLocal.value ? toIsoWithOffset(publishAtLocal.value) : undefined,
    };

    if (isEditMode.value) {
      await NewsService.updateArticle(route.params.id, payload);
      alert('Article updated successfully!');
    } else {
      await NewsService.createArticle(payload);
      alert('Article created successfully!');
    }
    router.push({ name: 'adminNews' });
  } catch (error) {
    console.error("Error saving article:", error);
    alert("Failed to save article. Please check console.");
  } finally {
    isSubmitting.value = false;
  }
};

</script>
