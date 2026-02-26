<template>
  <div class="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold text-gray-800">{{ isEditMode ? 'Edit Verse' : 'Create Verse' }}</h2>
      <button @click="goBack" class="text-gray-500 hover:text-gray-700">Cancel</button>
    </div>

    <div v-if="pageLoading" class="flex justify-center py-16">
      <a-spin size="large" />
    </div>

    <div v-else-if="loadError" class="text-center py-12">
      <p class="text-red-600 mb-4">{{ loadError }}</p>
      <button @click="goBack" class="text-blue-600 hover:text-blue-800 font-medium">Back to Verses</button>
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
        <label class="block text-sm font-medium text-gray-700 mb-2">Verse number</label>
        <input
          v-model.number="form.verse_number"
          type="number"
          required
          min="1"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="1"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          v-model="form.content"
          rows="6"
          required
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-serif"
          placeholder="Verse text..."
        />
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
import VerseService from '@/services/VerseService';

const route = useRoute();
const router = useRouter();

const chapterId = computed(() => route.params.chapterId);
const isEditMode = computed(() => !!route.params.verseId);
const isSubmitting = ref(false);
const pageLoading = ref(false);
const loadError = ref(null);
const feedbackMsg = ref('');
const feedbackType = ref('success');

const form = reactive({
  verse_number: 1,
  content: '',
  status: 'active',
  is_featured: false,
  order_index: '',
  chapter_id: null,
});

function goBack() {
  router.push({ name: 'adminVerseList', params: { chapterId: chapterId.value } });
}

onMounted(async () => {
  form.chapter_id = chapterId.value;
  pageLoading.value = isEditMode.value;
  if (!isEditMode.value) {
    pageLoading.value = false;
    return;
  }
  try {
    const res = await VerseService.getVerse(route.params.verseId);
    const v = res.data;
    Object.assign(form, {
      verse_number: v.verse_number ?? 1,
      content: v.content || '',
      status: v.status || 'active',
      is_featured: v.is_featured || false,
      order_index: v.order_index ?? '',
      chapter_id: v.chapter_id || chapterId.value,
    });
  } catch (err) {
    console.error('Error loading verse:', err);
    loadError.value = 'Failed to load verse. Please try again.';
  } finally {
    pageLoading.value = false;
  }
});

async function handleSubmit() {
  feedbackMsg.value = '';
  try {
    isSubmitting.value = true;
    const payload = {
      verse_number: form.verse_number,
      content: form.content,
      status: form.status,
      is_featured: form.is_featured,
      order_index: form.order_index || null,
      chapter_id: form.chapter_id,
    };
    if (isEditMode.value) {
      await VerseService.updateVerse(route.params.verseId, payload);
      feedbackType.value = 'success';
      feedbackMsg.value = 'Verse updated successfully.';
    } else {
      await VerseService.createVerse(payload);
      feedbackType.value = 'success';
      feedbackMsg.value = 'Verse created successfully.';
    }
    setTimeout(goBack, 800);
  } catch (err) {
    console.error('Error saving verse:', err);
    const detail = err.response?.data?.detail;
    feedbackType.value = 'error';
    feedbackMsg.value =
      typeof detail === 'string' ? detail : 'Failed to save verse. Please check your inputs and try again.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>
