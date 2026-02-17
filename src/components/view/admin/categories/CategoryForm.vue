<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800">{{ isEditMode ? 'Edit Category' : 'Create Category' }}</h2>
      <button @click="$router.push({ name: 'adminCategories' })" class="text-gray-500 hover:text-gray-700">
        Cancel
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <div class="space-y-3">
            <input v-model="form.name" type="text" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Category Name" />
            
            <!-- Slug -->
             <input v-model="form.slug" type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-600"
            placeholder="slug-url-path (optional)" />
        </div>
      </div>

      <!-- Parent Category & Order -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
             <select v-model="form.parent_id" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                 <option :value="null">None (Top Level)</option>
                 <option v-for="cat in parentCategories" :key="cat.id" :value="cat.id">
                     {{ cat.name }}
                 </option>
             </select>
        </div>
         <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Order Number</label>
            <input v-model="form.order_no" type="number"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="0" />
        </div>
      </div>

      <!-- Thumbnail -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
        <input v-model="form.thumbnail" type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="https://example.com/image.jpg" />
      </div>

      <!-- Description (CKEditor) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
         <div class="prose max-w-none">
          <ckeditor :editor="editor" v-model="form.description" :config="editorConfig"></ckeditor>
        </div>
      </div>

      <!-- Status -->
      <!-- Options -->
      <div class="flex items-center gap-6 pb-2">
         <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select v-model="form.status" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
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
      <div class="flex justify-end pt-4 border-t border-gray-100">
        <button type="submit" :disabled="isSubmitting"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
          <span v-if="isSubmitting" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          {{ isEditMode ? 'Update ' : 'Create ' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CategoryService } from '@/services/CategoryService';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const editor = ClassicEditor;
const editorConfig = {
  toolbar: [ 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'undo', 'redo' ] // Simpler toolbar for description
};

const route = useRoute();
const router = useRouter();

const isEditMode = computed(() => !!route.params.id);
const isSubmitting = ref(false);
const parentCategories = ref([]);
const categories = ref([]); // Store all for other uses if needed

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

// Auto-generate slug from name if not manually edited
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

onMounted(async () => {
  try {
    // Fetch categories for parent dropdown
    const allCats = await CategoryService.getAllCategories();
    categories.value = allCats;
    // Filter out current category from parent options if in edit mode (prevent self-parenting)
    parentCategories.value = isEditMode.value 
        ? allCats.filter(c => c.id !== route.params.id) 
        : allCats;

    if (isEditMode.value) {
      const category = await CategoryService.getCategoryById(route.params.id);
      Object.assign(form, {
        name: category.name,
        slug: category.slug, // Keep slug if exists
        description: category.description || '',
        thumbnail: category.thumbnail || '',
        parent_id: category.parent_id,
        order_no: category.order_no || 0,
        is_featured: category.is_featured || false,
        status: category.status
      });
    }
  } catch (error) {
    console.error("Error loading category:", error);
    alert("Failed to load category.");
  }
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    if (isEditMode.value) {
      await CategoryService.updateCategory(route.params.id, form);
      alert('Category updated successfully!');
    } else {
      await CategoryService.createCategory(form);
      alert('Category created successfully!');
    }
    router.push({ name: 'adminCategories' });
  } catch (error) {
    console.error("Error saving category:", error);
    
    // Handle specific error messages from backend
    if (error.response && error.response.data && error.response.data.detail) {
        alert(`Error: ${error.response.data.detail}`);
    } else {
        alert("Failed to save category. Please check your inputs and try again.");
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
