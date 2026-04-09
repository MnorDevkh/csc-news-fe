<template>
  <div class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6 md:p-8 max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-50">{{ isEditMode ? 'Edit Article' : 'Create Article' }}</h2>
      <button @click="$router.push({ name: 'adminNews' })" class="text-gray-400 hover:text-gray-600 text-sm font-medium hover:bg-gray-100 px-3 py-1.5 rounded-md transition-all">
        Cancel
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Title -->
      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Title</label>
        <input v-model="form.title" type="text" required
          class="w-full px-4 py-2.5 border border-gray-200 bg-gray-50/80 rounded-md focus:ring-2 focus:ring-[#1a365d]/10 focus:border-[#1a365d] focus:bg-white outline-none text-sm transition-all"
          placeholder="Enter article title" />
      </div>

      <!-- Category -->
      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
        <select v-model="form.category_id" required
          class="w-full px-4 py-2.5 border border-gray-200 bg-gray-50/80 rounded-md focus:ring-2 focus:ring-[#1a365d]/10 focus:border-[#1a365d] focus:bg-white outline-none text-sm transition-all cursor-pointer">
          <option value="" disabled>Select a category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- Thumbnail (cover-style picker) -->
      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Thumbnail</label>
        <div
          class="rounded-xl border-2 border-dashed min-h-[140px] flex items-center justify-center bg-gray-50/80 transition-all cursor-pointer hover:border-[#1a365d]/40 hover:bg-[#1a365d]/[0.03]"
          :class="thumbnailUrl ? 'border-gray-200' : 'border-gray-300'"
          @click="openThumbnailModal"
        >
          <img
            v-if="thumbnailUrl"
            :src="thumbnailUrl"
            alt="Thumbnail"
            class="w-full h-full min-h-[140px] max-h-[200px] object-contain rounded-md"
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
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Excerpt</label>
        <textarea v-model="form.excerpt" rows="2"
          class="w-full px-4 py-2.5 border border-gray-200 bg-gray-50/80 rounded-2xl focus:ring-2 focus:ring-[#1a365d]/10 focus:border-[#1a365d] focus:bg-white outline-none text-sm transition-all"
          placeholder="Brief summary used in listings"></textarea>
      </div>

      <!-- Block-based Content -->
      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Content</label>
        <p class="text-xs text-gray-400 mb-3">Add content blocks and images in any order. Use the buttons below to add more.</p>
        <div class="space-y-4">
          <div
            v-for="(block, index) in contentBlocks"
            :key="block.id"
            class="rounded-md border border-gray-200 bg-gray-50/50 p-4 relative"
          >
            <!-- Text block -->
            <template v-if="block.type === 'text'">
              <div class="prose max-w-none [&_.ck-editor__editable]:min-h-[120px]">
                <ckeditor :editor="editor" v-model="block.html" :config="editorConfig" />
              </div>
            </template>
            <!-- Image block -->
            <template v-else-if="block.type === 'image'">
              <div class="flex flex-wrap gap-3">
                <div
                  v-for="(img, imgIdx) in block.images"
                  :key="img.key || imgIdx"
                  class="relative rounded-md overflow-hidden border border-gray-200 bg-white"
                >
                  <img
                    :src="img.url"
                    :alt="img.filename || 'Image'"
                    class="w-32 h-32 object-cover"
                  />
                </div>
              </div>
            </template>
            <div class="flex items-center justify-between mt-2">
              <span class="text-xs text-gray-400">{{ block.type === 'text' ? 'Content block' : 'Image block' }}</span>
              <button
                type="button"
                class="text-xs text-red-500 hover:text-red-700 transition-colors"
                @click="removeBlock(index)"
              >
                Remove block
              </button>
            </div>
          </div>
          <!-- Add block buttons -->
          <div class="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition-colors text-sm"
              @click="addContentBlock"
            >
              Add content
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md font-medium transition-colors text-sm"
              @click="openContentImageModal"
            >
              <PictureOutlined /> Add image(s)
            </button>
          </div>
        </div>
      </div>

      <!-- Status & Scheduling -->
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</label>
            <select
              v-model="form.status"
              @change="onStatusChange"
              class="w-full px-4 py-2.5 border border-gray-200 bg-gray-50/80 rounded-md focus:ring-2 focus:ring-[#1a365d]/10 focus:border-[#1a365d] focus:bg-white outline-none text-sm transition-all cursor-pointer"
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

          <div v-if="form.status === 'scheduled'">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Publish at</label>
            <input
              v-model="publishAtLocal"
              type="datetime-local"
              :required="form.status === 'scheduled'"
              class="w-full px-4 py-2.5 border border-gray-200 bg-gray-50/80 rounded-md focus:ring-2 focus:ring-[#1a365d]/10 focus:border-[#1a365d] focus:bg-white outline-none text-sm transition-all"
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
      <div class="flex justify-end pt-6 border-t border-gray-100">
        <button type="submit" :disabled="isSubmitting"
          class="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-md shadow-blue-600/20 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:transform-none">
          <span v-if="isSubmitting" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-md"></span>
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
    <!-- Content image(s) modal for block -->
    <ImageSelectModal
      v-model:open="contentImageModalOpen"
      mode="multiple"
      title="Select image(s) for content"
      confirm-label="Add to article"
      @confirm="onContentImagesSelected"
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
  is_featured: true,
  status: 'public'
});

const publishAtLocal = ref('');

// Block-based content: list of { id, type: 'text'|'image', html?: string, images?: [{ url, key }] }
const contentBlocks = ref([]);
const contentImageModalOpen = ref(false);
let nextBlockId = 0;
function nextId() {
  return `block-${++nextBlockId}-${Date.now()}`;
}

function parseContentToBlocks(contentStr) {
  if (!contentStr || !contentStr.trim()) {
    return [];
  }
  const s = contentStr.trim();
  if (s.startsWith('[') && s.endsWith(']')) {
    try {
      const arr = JSON.parse(contentStr);
      if (!Array.isArray(arr)) return [{ id: nextId(), type: 'text', html: contentStr }];
      return arr.map((b) => {
        if (b.type === 'text') {
          return { id: nextId(), type: 'text', html: b.html != null ? String(b.html) : '' };
        }
        if (b.type === 'image' && Array.isArray(b.images)) {
          return {
            id: nextId(),
            type: 'image',
            images: b.images.map((img) => ({ url: img.url || '', key: img.key || '' }))
          };
        }
        return { id: nextId(), type: 'text', html: '' };
      });
    } catch {
      return [{ id: nextId(), type: 'text', html: contentStr }];
    }
  }
  return [{ id: nextId(), type: 'text', html: contentStr }];
}

function serializeBlocks() {
  return contentBlocks.value.map((b) => {
    if (b.type === 'text') return { type: 'text', html: b.html || '' };
    return { type: 'image', images: (b.images || []).map((img) => ({ url: img.url, key: img.key })) };
  });
}

function addContentBlock() {
  contentBlocks.value.push({ id: nextId(), type: 'text', html: '' });
}

function removeBlock(index) {
  contentBlocks.value.splice(index, 1);
}

function openContentImageModal() {
  contentImageModalOpen.value = true;
}

function onContentImagesSelected(items) {
  if (!items || !items.length) return;
  const images = items.map((item) => ({ url: item.url, key: item.key || '' }));
  contentBlocks.value.push({ id: nextId(), type: 'image', images });
}

const nowLocalString = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

const onStatusChange = () => {
  if (form.status === 'draft') {
    publishAtLocal.value = '';
  }
  if (form.status === 'scheduled' && !publishAtLocal.value) {
    publishAtLocal.value = nowLocalString();
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

      contentBlocks.value = parseContentToBlocks(article.content || '');
    } else {
      // Create mode: start with one empty text block
      contentBlocks.value = [{ id: nextId(), type: 'text', html: '' }];
    }
  } catch (error) {
    console.error("Error loading data:", error);
    alert("Failed to load data. Please check console.");
  }
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    form.content = JSON.stringify(serializeBlocks());
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
