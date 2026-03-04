<template>
  <div class="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold text-gray-800">{{ isEditMode ? 'Edit Section' : 'Create Section' }}</h2>
      <button @click="goBack" class="text-gray-500 hover:text-gray-700">Cancel</button>
    </div>

    <div v-if="!chapterId" class="py-12 text-center text-gray-500">
      <p>Chapter is required (e.g. ?chapter_id=...).</p>
      <router-link :to="{ name: 'adminChapterList' }" class="text-blue-600 hover:underline mt-2 inline-block">Go to Chapters</router-link>
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
        <label class="block text-sm font-medium text-gray-700 mb-2">Title (optional)</label>
        <input
          v-model="form.title"
          type="text"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Section title"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Start verse <span class="text-red-500">*</span></label>
          <input
            v-model.number="form.start_verse"
            type="number"
            required
            min="1"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="1"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">End verse <span class="text-red-500">*</span></label>
          <input
            v-model.number="form.end_verse"
            type="number"
            required
            min="1"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="1"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Order no</label>
        <input
          v-model.number="form.order_no"
          type="number"
          min="0"
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
import SectionService from '@/services/SectionService';

const route = useRoute();
const router = useRouter();

const chapterId = computed(() => route.query.chapter_id || null);
const isEditMode = computed(() => !!route.params.sectionId);
const isSubmitting = ref(false);
const feedbackMsg = ref('');
const feedbackType = ref('success');

const form = reactive({
  title: '',
  start_verse: 1,
  end_verse: 1,
  order_no: 0,
});

function goBack() {
  router.push({ name: 'adminSectionList', query: { chapter_id: chapterId.value } });
}

onMounted(async () => {
  if (!isEditMode.value) return;
  try {
    const res = await SectionService.getSection(route.params.sectionId);
    const s = res.data;
    Object.assign(form, {
      title: s.title || '',
      start_verse: s.start_verse ?? 1,
      end_verse: s.end_verse ?? 1,
      order_no: s.order_no ?? 0,
    });
  } catch (err) {
    console.error('Error loading section:', err);
  }
});

async function handleSubmit() {
  feedbackMsg.value = '';
  if (!chapterId.value) {
    feedbackType.value = 'error';
    feedbackMsg.value = 'Chapter is required.';
    return;
  }
  try {
    isSubmitting.value = true;
    const payload = {
      chapter_id: chapterId.value,
      title: form.title || null,
      start_verse: form.start_verse,
      end_verse: form.end_verse,
      order_no: form.order_no ?? 0,
    };
    if (isEditMode.value) {
      await SectionService.updateSection(route.params.sectionId, {
        title: payload.title,
        start_verse: payload.start_verse,
        end_verse: payload.end_verse,
        order_no: payload.order_no,
      });
      feedbackType.value = 'success';
      feedbackMsg.value = 'Section updated successfully.';
    } else {
      await SectionService.createSection(payload);
      feedbackType.value = 'success';
      feedbackMsg.value = 'Section created successfully.';
    }
    setTimeout(goBack, 800);
  } catch (err) {
    console.error('Error saving section:', err);
    const detail = err.response?.data?.detail;
    feedbackType.value = 'error';
    feedbackMsg.value =
      typeof detail === 'string' ? detail : 'Failed to save section. Please check your inputs and try again.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>
