<template>
  <div class="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold text-gray-800">{{ isEditMode ? 'Edit Bible' : 'Create Bible' }}</h2>
      <button @click="$router.push({ name: 'adminBibleManagement' })" class="text-gray-500 hover:text-gray-700">
        Cancel
      </button>
    </div>

    <div v-if="pageLoading" class="flex justify-center py-16">
      <a-spin size="large" />
    </div>

    <div v-else-if="loadError" class="text-center py-12">
      <p class="text-red-600 mb-4">{{ loadError }}</p>
      <button @click="$router.push({ name: 'adminBibleManagement' })" class="text-blue-600 hover:text-blue-800 font-medium">
        Back to Bibles
      </button>
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
        <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Bible name"
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
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Short description"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            v-model="form.type"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option
              v-for="option in bibleTypeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <input
            v-model="form.language"
            type="text"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. KM, EN"
          />
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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Audio URL (optional)</label>
          <input
            v-model="form.audio_url"
            type="text"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="https://..."
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Video URL (optional)</label>
          <input
            v-model="form.video_url"
            type="text"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="https://..."
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="form.status"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div class="flex items-center gap-2 pt-8">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.is_featured" type="checkbox" class="w-4 h-4 text-blue-600 rounded border-gray-300" />
            <span class="text-sm font-medium text-gray-700">Featured</span>
          </label>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Order index (optional)</label>
        <input
          v-model="form.order_index"
          type="text"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="0"
        />
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
import { BibleService } from '@/services/BibleService';

const route = useRoute();
const router = useRouter();

const bibleTypeOptions = [
  { value: 'NT', label: 'ព្រះគម្ពីរសម្ព័ន្ធមេត្រីថ្មី' },
  { value: 'OT', label: 'ព្រះគម្ពីរសម្ព័ន្ធមេត្រីចាស់' },
  { value: 'Introduction', label: 'សេចក្ដីណែនាំ' },
  { value: 'PW', label: 'ពាក្យកាព្យ' },
];

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
  type: 'NT',
  language: '',
  audio_url: '',
  video_url: '',
  status: 'active',
  is_featured: false,
  order_index: '',
});

onMounted(async () => {
  pageLoading.value = isEditMode.value;
  if (!isEditMode.value) {
    pageLoading.value = false;
    return;
  }
  try {
    const res = await BibleService.getBible(route.params.id);
    const b = res.data;
    Object.assign(form, {
      name: b.name || '',
      slug: b.slug || '',
      description: b.description || '',
      thumbnail: b.thumbnail || '',
      type: b.type || '',
      language: b.language || '',
      audio_url: b.audio_url || '',
      video_url: b.video_url || '',
      status: b.status || 'active',
      is_featured: b.is_featured || false,
      order_index: b.order_index ?? '',
    });
  } catch (err) {
    console.error('Error loading bible:', err);
    loadError.value = 'Failed to load bible. Please try again.';
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
      type: form.type || null,
      language: form.language || null,
      audio_url: form.audio_url || null,
      video_url: form.video_url || null,
      status: form.status,
      is_featured: form.is_featured,
      order_index: form.order_index || null,
    };
    if (isEditMode.value) {
      await BibleService.updateBible(route.params.id, payload);
      feedbackType.value = 'success';
      feedbackMsg.value = 'Bible updated successfully.';
    } else {
      await BibleService.createBible(payload);
      feedbackType.value = 'success';
      feedbackMsg.value = 'Bible created successfully.';
    }
    setTimeout(() => router.push({ name: 'adminBibleManagement' }), 800);
  } catch (err) {
    console.error('Error saving bible:', err);
    const detail = err.response?.data?.detail;
    feedbackType.value = 'error';
    feedbackMsg.value =
      typeof detail === 'string' ? detail : 'Failed to save bible. Please check your inputs and try again.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>
