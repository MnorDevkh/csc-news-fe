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

      <!-- Thumbnail URL -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
        <input v-model="form.thumbnail" type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="https://example.com/image.jpg" />
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

      <!-- Options -->
      <div class="flex items-center gap-6">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="form.is_featured" class="w-4 h-4 text-blue-600 rounded border-gray-300" />
          <span class="text-sm text-gray-700">Featured Article</span>
        </label>
        
        <label class="flex items-center gap-2 cursor-pointer">
           <!-- Simple status toggle for now, backend expects 'draft' or 'published' or 'archived' -->
           <input type="checkbox" :checked="form.status === 'published'" @change="toggleStatus" class="w-4 h-4 text-green-600 rounded border-gray-300" />
           <span class="text-sm text-gray-700">Publish Immediately</span>
        </label>
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NewsService } from '@/services/NewsService';
import { CategoryService } from '@/services/CategoryService';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const editor = ClassicEditor;
const editorConfig = {
  // CKEditor configuration
  toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable', 'undo', 'redo' ]
};

const route = useRoute();
const router = useRouter();

const isEditMode = computed(() => !!route.params.id);
const isSubmitting = ref(false);
const categories = ref([]);

const form = reactive({
  title: '',
  category_id: '',
  thumbnail: '',
  excerpt: '',
  content: '',
  is_featured: false,
  status: 'draft'
});

const toggleStatus = (e) => {
  form.status = e.target.checked ? 'published' : 'draft';
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
    }
  } catch (error) {
    console.error("Error loading data:", error);
    alert("Failed to load data. Please check console.");
  }
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    if (isEditMode.value) {
      await NewsService.updateArticle(route.params.id, form);
      alert('Article updated successfully!');
    } else {
      await NewsService.createArticle(form);
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
