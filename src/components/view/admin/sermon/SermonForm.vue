<template>
  <div class="bg-white p-8 rounded-md shadow-sm border border-gray-200 max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold text-gray-800">
        {{ isEditMode ? 'Edit Sermon' : 'Create Sermon' }}
      </h2>
      <button @click="$router.push({ name: 'adminSermons' })" class="text-gray-500 hover:text-gray-700">
        Cancel
      </button>
    </div>

    <div v-if="pageLoading" class="flex justify-center py-16">
      <a-spin size="large" />
    </div>

    <div v-else-if="loadError" class="text-center py-12">
      <p class="text-red-600 mb-4">{{ loadError }}</p>
      <button
        @click="$router.push({ name: 'adminSermons' })"
        class="text-blue-600 hover:text-blue-800 font-medium"
      >
        Back to Sermons
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

      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          v-model="form.title"
          type="text"
          required
          class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Sermon title"
        />
      </div>

      <!-- Snippet & Preacher -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Preacher</label>
          <input
            v-model="form.preacher"
            type="text"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. Fr. Sok Na"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            v-model="form.sermon_date"
            type="date"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
        <textarea
          v-model="form.snippet"
          rows="3"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Short summary to show in lists..."
        />
      </div>

      <!-- Thumbnail -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
        <div
          class="rounded-md border-2 border-dashed min-h-[140px] flex items-center justify-center bg-gray-50/80 transition-colors cursor-pointer hover:border-blue-400 hover:bg-blue-50/30"
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
            <span class="text-sm">Click to select thumbnail image</span>
          </div>
        </div>
        <button
          v-if="thumbnailUrl"
          type="button"
          class="mt-2 text-xs text-red-500 hover:text-red-700 transition-colors"
          @click="removeThumbnail"
        >
          Remove thumbnail
        </button>
      </div>

      <!-- Media upload -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Sermon Media</label>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div class="md:col-span-2">
            <input
              ref="mediaInputRef"
              type="file"
              accept="audio/*,video/*"
              class="hidden"
              @change="handleMediaSelect"
            />
            <button
              type="button"
              :disabled="mediaUploading"
              class="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-800 px-4 py-2 rounded-md font-medium transition-colors"
              @click="triggerMediaInput"
            >
              <PlusOutlined />
              {{ mediaUploading ? 'Uploading…' : (form.media_url ? 'Replace media' : 'Upload media') }}
            </button>
            <p class="mt-2 text-xs text-gray-500">Audio or video up to 100 MB. Videos are compressed on the server for web playback.</p>
            <p v-if="mediaError" class="mt-2 text-xs text-red-600">{{ mediaError }}</p>
          </div>
          <div class="md:text-right text-sm text-gray-500">
            <div v-if="form.media_url" class="truncate mb-1">
              Linked: {{ form.media_url }}
            </div>
            <div>
              <label class="mr-2">Type:</label>
              <select
                v-model="form.media_type"
                class="px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="">Select</option>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Status -->
      <div class="flex items-center gap-6 pb-2">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="form.status"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
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
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ImageSelectModal from '@/components/ImageSelectModal.vue';
import { PictureOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { SermonService } from '@/services/SermonService';

const route = useRoute();
const router = useRouter();

const isEditMode = computed(() => !!route.params.id);
const isSubmitting = ref(false);
const pageLoading = ref(false);
const loadError = ref(null);
const feedbackMsg = ref('');
const feedbackType = ref('success');

// Thumbnail picker
const thumbnailModalOpen = ref(false);
const thumbnailUrl = ref('');

// Media upload
const mediaInputRef = ref(null);
const mediaUploading = ref(false);
const mediaError = ref(null);

const form = reactive({
  title: '',
  preacher: '',
  sermon_date: '',
  snippet: '',
  thumbnail: '',
  media_url: '',
  media_type: '',
  status: 'active',
});

function openThumbnailModal() {
  thumbnailModalOpen.value = true;
}

function onThumbnailSelected(items) {
  const item = items[0];
  if (item) {
    thumbnailUrl.value = item.url;
    form.thumbnail = item.url;
  }
}

function removeThumbnail() {
  thumbnailUrl.value = '';
  form.thumbnail = '';
}

function triggerMediaInput() {
  mediaInputRef.value?.click();
}

async function handleMediaSelect(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  mediaError.value = null;
  mediaUploading.value = true;
  try {
    const { url } = await SermonService.uploadMedia(file);
    form.media_url = url;
  } catch (err) {
    console.error('Failed to upload media', err);
    mediaError.value =
      err.response?.data?.detail || err.message || 'Failed to upload sermon media.';
  } finally {
    mediaUploading.value = false;
    event.target.value = '';
  }
}

onMounted(async () => {
  pageLoading.value = isEditMode.value;
  try {
    if (isEditMode.value) {
      const sermon = await SermonService.getSermonById(route.params.id);
      Object.assign(form, {
        title: sermon.title,
        preacher: sermon.preacher || '',
        sermon_date: sermon.sermon_date
          ? sermon.sermon_date.substring(0, 10)
          : '',
        snippet: sermon.snippet || '',
        thumbnail: sermon.thumbnail || '',
        media_url: sermon.media_url || '',
        media_type: sermon.media_type || '',
        status: sermon.status || 'active',
      });
      if (sermon.thumbnail) {
        thumbnailUrl.value = sermon.thumbnail;
      }
    }
  } catch (err) {
    console.error('Error loading sermon:', err);
    loadError.value = 'Failed to load sermon data. Please try again.';
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
    if (!payload.preacher) payload.preacher = null;
    if (!payload.snippet) payload.snippet = null;
    if (!payload.thumbnail) payload.thumbnail = null;
    if (!payload.media_url) payload.media_url = null;
    if (!payload.media_type) payload.media_type = null;

    if (isEditMode.value) {
      await SermonService.updateSermon(route.params.id, payload);
      feedbackType.value = 'success';
      feedbackMsg.value = 'Sermon updated successfully!';
    } else {
      await SermonService.createSermon(payload);
      feedbackType.value = 'success';
      feedbackMsg.value = 'Sermon created successfully!';
    }
    setTimeout(() => router.push({ name: 'adminSermons' }), 800);
  } catch (err) {
    console.error('Error saving sermon:', err);
    const detail = err.response?.data?.detail;
    feedbackType.value = 'error';
    feedbackMsg.value =
      typeof detail === 'string'
        ? detail
        : 'Failed to save sermon. Please check your inputs and try again.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

