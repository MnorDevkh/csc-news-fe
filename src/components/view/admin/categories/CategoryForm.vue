<template>
  <div class="category-form bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto my-6">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold text-gray-800">{{ isEditMode ? 'Edit Category' : 'Create Category' }}</h2>
      <button @click="$router.push({ name: 'adminCategories' })" class="text-gray-500 hover:text-gray-700">
        Cancel
      </button>
    </div>

    <!-- Loading state for edit mode -->
    <div v-if="pageLoading" class="flex justify-center py-16">
      <a-spin size="large" />
    </div>

    <!-- Load error -->
    <div v-else-if="loadError" class="text-center py-12">
      <p class="text-red-600 mb-4">{{ loadError }}</p>
      <button @click="$router.push({ name: 'adminCategories' })" class="text-blue-600 hover:text-blue-800 font-medium">
        Back to Categories
      </button>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Feedback banner -->
      <div v-if="feedbackMsg"
        class="px-4 py-3 rounded-lg text-sm flex items-center justify-between"
        :class="feedbackType === 'success'
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-red-50 text-red-700 border border-red-200'"
      >
        <span>{{ feedbackMsg }}</span>
        <button type="button" @click="feedbackMsg = ''" class="ml-3 text-current opacity-60 hover:opacity-100">&times;</button>
      </div>

      <!-- Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <div class="space-y-3 pb-2 ">
            <input v-model="form.name" type="text" required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Category Name" />

            <!-- Slug -->
             <input v-model="form.slug" type="text"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-600"
            placeholder="slug-url-path (optional)" />
        </div>
      </div>

      <!-- Parent Category & Order -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
             <label class="block text-sm font-medium text-gray-700 mb-2">Parent Category</label>
             <select v-model="form.parent_id" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                 <option :value="null">None (Top Level)</option>
                 <option v-for="cat in parentCategories" :key="cat.id" :value="cat.id">
                     {{ cat.name }}
                 </option>
             </select>
        </div>
         <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Order Number</label>
            <input v-model="form.order_no" type="number"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="0" />
        </div>
      </div>

      <!-- Thumbnail (cover-style picker) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
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
            <span class="text-sm">Click to select thumbnail image</span>
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

      <!-- Description (CKEditor) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
         <div class="prose max-w-none">
          <ckeditor :editor="editor" v-model="form.description" :config="editorConfig"></ckeditor>
        </div>
      </div>

      <!-- Options -->
      <div class="flex items-center gap-6 pb-2">
         <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select v-model="form.status" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>
         </div>

         <div class="flex items-center gap-2 pt-6">
            <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="form.is_featured" class="w-4 h-4 text-blue-600 rounded border-gray-300" />
                <span class="text-sm font-medium text-gray-700">Featured Category</span>
            </label>
         </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end pt-6 border-t border-gray-100">
        <button type="submit" :disabled="isSubmitting"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2">
          <span v-if="isSubmitting" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          {{ isEditMode ? 'Update' : 'Create' }}
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
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CategoryService } from '@/services/CategoryService';
import ImageSelectModal from '@/components/ImageSelectModal.vue';
import { PictureOutlined } from '@ant-design/icons-vue';
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Link, List, PasteFromOffice, Font, Alignment, Heading, BlockQuote, Table, TableToolbar } from 'ckeditor5';

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
const pageLoading = ref(false);
const loadError = ref(null);
const feedbackMsg = ref('');
const feedbackType = ref('success');
const parentCategories = ref([]);
const categories = ref([]);

// Thumbnail picker state
const thumbnailModalOpen = ref(false);
const thumbnailUrl = ref('');
const thumbnailKey = ref('');

const form = reactive({
  name: '',
  slug: '',
  description: '',
  thumbnail: '',
  parent_id: null,
  order_no: 0,
  is_featured: false,
  status: 'active'
});

const slugManuallyEdited = ref(false);

watch(() => form.slug, (newVal) => {
    if (newVal && newVal.length > 0) {
        slugManuallyEdited.value = true;
    }
});

watch(() => form.name, (newName) => {
    if (!isEditMode.value && !slugManuallyEdited.value && newName) {
        form.slug = newName
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
});

function showFeedback(msg, type = 'success') {
  feedbackMsg.value = msg;
  feedbackType.value = type;
  if (type === 'success') {
    setTimeout(() => { feedbackMsg.value = ''; }, 4000);
  }
}

function openThumbnailModal() {
  thumbnailModalOpen.value = true;
}

function onThumbnailSelected(items) {
  const item = items[0];
  if (item) {
    thumbnailUrl.value = item.url;
    thumbnailKey.value = item.key || '';
    form.thumbnail = item.url;
  }
}

function removeThumbnail() {
  thumbnailUrl.value = '';
  thumbnailKey.value = '';
  form.thumbnail = '';
}

onMounted(async () => {
  pageLoading.value = isEditMode.value;
  try {
    const allCats = await CategoryService.getAllCategories();
    categories.value = allCats;
    parentCategories.value = isEditMode.value
        ? allCats.filter(c => c.id !== route.params.id)
        : allCats;

    if (isEditMode.value) {
      const category = await CategoryService.getCategoryById(route.params.id);
      Object.assign(form, {
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        thumbnail: category.thumbnail || '',
        parent_id: category.parent_id,
        order_no: category.order_no || 0,
        is_featured: category.is_featured || false,
        status: category.status
      });
      if (category.thumbnail) {
        thumbnailUrl.value = category.thumbnail;
      }
    }
  } catch (err) {
    console.error("Error loading category:", err);
    loadError.value = "Failed to load category data. Please try again.";
  } finally {
    pageLoading.value = false;
  }
});

const handleSubmit = async () => {
  feedbackMsg.value = '';
  try {
    isSubmitting.value = true;
    if (isEditMode.value) {
      await CategoryService.updateCategory(route.params.id, form);
      showFeedback('Category updated successfully!');
    } else {
      await CategoryService.createCategory(form);
      showFeedback('Category created successfully!');
    }
    setTimeout(() => router.push({ name: 'adminCategories' }), 800);
  } catch (err) {
    console.error("Error saving category:", err);
    const detail = err.response?.data?.detail;
    showFeedback(detail || 'Failed to save category. Please check your inputs and try again.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
<style scoped>
.category-form :deep(.ck-editor__editable_inline) {
  min-height: 180px;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
}

.category-form :deep(.ck.ck-editor__main) {
  border-radius: 0.5rem;
  overflow: hidden;
}

.category-form :deep(.ck.ck-toolbar) {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.category-form :deep(.ck.ck-content) {
  font-size: 0.95rem;
  line-height: 1.6;
}
</style>
