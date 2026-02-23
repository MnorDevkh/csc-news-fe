<script setup>
import { ref, onMounted } from 'vue';
import { UploadOutlined, PictureOutlined } from '@ant-design/icons-vue';
import { uploadPhoto, getPhotos } from '@/services/PhotoUploadService';

const photos = ref([]);
const loading = ref(false);
const uploading = ref(false);
const error = ref(null);
const successMessage = ref(null);
const fileInput = ref(null);

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

function clearMessages() {
  error.value = null;
  successMessage.value = null;
}

async function loadPhotos() {
  loading.value = true;
  clearMessages();
  try {
    photos.value = await getPhotos();
  } catch (e) {
    error.value = e.response?.data?.detail || e.message || 'Failed to load photos';
  } finally {
    loading.value = false;
  }
}

async function handleUpload() {
  const input = fileInput.value;
  if (!input?.files?.length) return;
  const file = input.files[0];
  if (!file) return;
  if (!allowedTypes.includes(file.type)) {
    error.value = 'Please choose a JPEG, PNG, or WebP image.';
    return;
  }
  uploading.value = true;
  clearMessages();
  try {
    await uploadPhoto(file);
    successMessage.value = 'Photo uploaded successfully.';
    input.value = '';
    await loadPhotos();
  } catch (e) {
    error.value = e.response?.data?.detail || e.message || 'Upload failed';
  } finally {
    uploading.value = false;
  }
}

function triggerFileInput() {
  fileInput.value?.click();
}

onMounted(loadPhotos);
</script>

<template>
  <div class="mx-auto p-6 md:p-8 max-w-6xl">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-4 mb-2">
        Photo upload
      </h1>
      <p class="text-gray-500 text-sm">Upload images to display in the gallery. JPEG, PNG, and WebP up to 10 MB.</p>
    </div>

    <!-- Upload area -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        class="hidden"
        @change="handleUpload"
      />
      <div class="flex flex-wrap items-center gap-4">
        <button
          type="button"
          :disabled="uploading"
          class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          @click="triggerFileInput"
        >
          <UploadOutlined />
          {{ uploading ? 'Uploading…' : 'Choose and upload' }}
        </button>
      </div>
      <p v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</p>
      <p v-if="successMessage" class="mt-3 text-sm text-emerald-600">{{ successMessage }}</p>
    </div>

    <!-- Gallery grid -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <PictureOutlined />
        Uploaded images
      </h2>
      <div v-if="loading" class="flex justify-center items-center py-16">
        <a-spin size="large" />
      </div>
      <div v-else-if="!photos.length" class="text-center py-16 text-gray-500">
        No photos yet. Upload an image above.
      </div>
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div
          v-for="item in photos"
          :key="item.key"
          class="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-100"
        >
          <img
            :src="item.url"
            :alt="item.filename || item.key"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </div>
</template>
