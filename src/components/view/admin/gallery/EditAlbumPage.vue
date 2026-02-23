<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Edit Album</h2>
      <button
        type="button"
        class="text-gray-500 hover:text-gray-700"
        @click="$router.push({ name: 'adminGallery' })"
      >
        Cancel
      </button>
    </div>

    <div v-if="pageLoading" class="flex justify-center py-16">
      <a-spin size="large" />
    </div>

    <form v-else @submit.prevent="submitForm" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Album Title</label>
        <input
          v-model="form.title"
          type="text"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="e.g., Summer 2024 Collection"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Describe the mood or context of this collection..."
        />
      </div>

      <!-- Cover image preview (click to pick) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Cover image</label>
        <div
          class="rounded-lg border-2 border-dashed min-h-[140px] flex items-center justify-center bg-gray-50/80 transition-colors cursor-pointer hover:border-blue-400 hover:bg-blue-50/30"
          :class="coverUrl ? 'border-gray-200' : 'border-gray-300'"
          @click="openCoverModal"
        >
          <img
            v-if="coverUrl"
            :src="coverUrl"
            alt="Cover"
            class="w-full h-full min-h-[140px] max-h-[200px] object-contain rounded-lg"
          />
          <div v-else class="flex flex-col items-center gap-2 text-gray-400 py-6">
            <PictureOutlined class="text-4xl" />
            <span class="text-sm">Click to select cover image</span>
          </div>
        </div>
      </div>

      <!-- Photos -->
      <div>
        <div class="flex items-center gap-2 mb-2">
          <label class="text-sm font-medium text-gray-700">Photos</label>
          <span v-if="selectedList.length" class="text-sm text-blue-600 font-medium">
            {{ selectedList.length }} photos selected
          </span>
        </div>
        <div class="flex gap-3 overflow-x-auto pb-2">
          <button
            type="button"
            class="flex-shrink-0 w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"
            @click="openSelectModal"
          >
            <PlusOutlined class="text-2xl" />
          </button>
          <div
            v-for="(item, idx) in selectedList"
            :key="item.id"
            class="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 bg-gray-100 group transition-all border-gray-200"
          >
            <img
              :src="item.url"
              alt=""
              class="w-full h-full object-cover"
            />
            <button
              type="button"
              class="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-sm leading-none shadow transition-colors opacity-0 group-hover:opacity-100"
              title="Remove"
              @click.stop="removeSelected(idx)"
            >
              <CloseOutlined class="text-xs" />
            </button>
          </div>
        </div>
      </div>

      <p v-if="submitError" class="text-sm text-red-600">{{ submitError }}</p>
      <div class="flex justify-between items-center pt-2">
        <button
          type="button"
          class="px-4 py-2 text-gray-600 hover:text-gray-800"
          @click="$router.push({ name: 'adminGallery' })"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="saving || !form.title?.trim() || !selectedList.length"
          class="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white font-medium transition-colors"
        >
          {{ saving ? 'Saving…' : 'Save Changes' }}
          <ArrowRightOutlined class="text-sm" />
        </button>
      </div>
    </form>

    <!-- Select photos modal -->
    <a-modal
      v-model:open="selectModalOpen"
      title="Select photos"
      width="720px"
      :footer="null"
    >
      <div class="flex border-b border-gray-200 mb-4">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === 'existing' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="activeTab = 'existing'"
        >
          From existing uploads
        </button>
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === 'upload' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="activeTab = 'upload'"
        >
          Upload new
        </button>
      </div>

      <div v-show="activeTab === 'existing'" class="py-2 min-h-[280px]">
        <div v-if="existingLoading" class="flex justify-center py-12">
          <a-spin size="large" />
        </div>
        <div v-else-if="!existingPhotos.length" class="text-center py-12 text-gray-500">
          No photos uploaded yet. Use the "Upload new" tab to add images.
        </div>
        <div v-else class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-[320px] overflow-y-auto">
          <div
            v-for="item in existingPhotos"
            :key="item.key"
            class="relative aspect-square rounded-lg overflow-hidden border-2 transition-all flex-shrink-0"
            :class="[
              isAlreadyInAlbum(item)
                ? 'border-green-500 ring-2 ring-green-200 cursor-default'
                : isSelectedInModal(item)
                  ? 'border-blue-600 ring-2 ring-blue-200 cursor-pointer'
                  : 'border-gray-200 hover:border-gray-300 cursor-pointer'
            ]"
            @click="!isAlreadyInAlbum(item) && toggleModalSelection(item)"
          >
            <img
              :src="item.url"
              :alt="item.filename || item.key"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div
              v-if="isAlreadyInAlbum(item)"
              class="absolute inset-0 flex items-center justify-center bg-green-600/20"
            >
              <span class="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">In album</span>
            </div>
            <div
              v-else-if="isSelectedInModal(item)"
              class="absolute inset-0 flex items-center justify-center bg-blue-600/20"
            >
              <span class="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">Selected</span>
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'upload'" class="py-2 min-h-[280px]">
        <input
          ref="fileInputRef"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          class="hidden"
          @change="onFileSelectInModal"
        />
        <button
          type="button"
          :disabled="uploading"
          class="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
          @click="fileInputRef?.click()"
        >
          <PlusOutlined />
          {{ uploading ? 'Uploading…' : 'Choose files' }}
        </button>
        <p v-if="uploadError" class="mt-2 text-sm text-red-600">{{ uploadError }}</p>
        <div v-if="uploadedInSession.length" class="mt-4">
          <p class="text-sm text-gray-500 mb-2">Uploaded ({{ uploadedInSession.length }})</p>
          <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-[240px] overflow-y-auto">
            <div
              v-for="item in uploadedInSession"
              :key="item.key"
              class="relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all flex-shrink-0"
              :class="isSelectedInModal(item) ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'"
              @click="toggleModalSelection(item)"
            >
              <img
                :src="item.url"
                :alt="item.filename || item.key"
                class="w-full h-full object-cover"
              />
              <div
                v-if="isSelectedInModal(item)"
                class="absolute inset-0 flex items-center justify-center bg-blue-600/20"
              >
                <span class="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">Selected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          @click="closeSelectModal"
        >
          <CloseOutlined />
          Cancel
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
          :disabled="!modalPendingList.length"
          @click="addModalSelectionToAlbum"
        >
          <PlusOutlined />
          Add to album ({{ modalPendingList.length }})
        </button>
      </div>
    </a-modal>

    <!-- Cover selection modal -->
    <a-modal
      v-model:open="coverModalOpen"
      title="Select cover image"
      width="720px"
      :footer="null"
    >
      <div class="py-2 min-h-[280px]">
        <div v-if="coverPhotosLoading" class="flex justify-center py-12">
          <a-spin size="large" />
        </div>
        <div v-else-if="!coverPhotos.length" class="text-center py-12 text-gray-500">
          No photos uploaded yet.
        </div>
        <div v-else class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-[320px] overflow-y-auto">
          <div
            v-for="item in coverPhotos"
            :key="item.key"
            class="relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all flex-shrink-0"
            :class="coverKey === item.key ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'"
            @click="pickCover(item)"
          >
            <img
              :src="item.url"
              :alt="item.filename || item.key"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div
              v-if="coverKey === item.key"
              class="absolute inset-0 flex items-center justify-center bg-blue-600/20"
            >
              <span class="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">Cover</span>
            </div>
          </div>
        </div>
      </div>
    </a-modal>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { PictureOutlined, PlusOutlined, CloseOutlined, ArrowRightOutlined } from '@ant-design/icons-vue';
import { getPhotos, uploadPhoto, getPhotoUrl } from '@/services/PhotoUploadService';
import { GalleryService } from '@/services/GalleryService';

const router = useRouter();
const route = useRoute();
const albumId = route.params.id;

const pageLoading = ref(true);
const selectModalOpen = ref(false);
const coverModalOpen = ref(false);
const coverPhotos = ref([]);
const coverPhotosLoading = ref(false);
const activeTab = ref('existing');
const form = ref({ title: '', description: '' });
const existingPhotos = ref([]);
const existingLoading = ref(false);
const selectedList = ref([]);
const selectedKeys = ref(new Set());
const coverUrl = ref('');
const coverKey = ref('');
const fileInputRef = ref(null);
const uploading = ref(false);
const uploadError = ref(null);
const uploadedInSession = ref([]);
const saving = ref(false);
const submitError = ref(null);

const modalPendingList = ref([]);
const modalPendingKeys = ref(new Set());

let nextId = 0;
function nextSelectedId() {
  return `sel-${++nextId}`;
}

async function loadAlbum() {
  pageLoading.value = true;
  try {
    const album = await GalleryService.get(albumId);
    form.value.title = album.title || '';
    form.value.description = album.description || '';
    coverUrl.value = album.cover || '';
    coverKey.value = '';

    const images = album.images || [];
    selectedList.value = images.map((img) => {
      const url = typeof img === 'object' ? img.url : img;
      const key = typeof img === 'object' ? img.key : undefined;
      const title = typeof img === 'object' ? img.title || '' : '';
      const id = nextSelectedId();
      if (key) selectedKeys.value = new Set([...selectedKeys.value, key]);
      return { id, key, url, title };
    });

    if (album.cover && !coverKey.value) {
      const match = selectedList.value.find((i) => i.url === album.cover);
      if (match?.key) coverKey.value = match.key;
    }
  } catch (e) {
    console.error('Failed to load album', e);
    submitError.value = 'Failed to load album data';
  } finally {
    pageLoading.value = false;
  }
}

function openSelectModal() {
  modalPendingList.value = [];
  modalPendingKeys.value = new Set();
  uploadedInSession.value = [];
  uploadError.value = null;
  activeTab.value = 'existing';
  selectModalOpen.value = true;
  loadExistingPhotos();
}

async function openCoverModal() {
  coverModalOpen.value = true;
  coverPhotosLoading.value = true;
  try {
    coverPhotos.value = await getPhotos();
  } catch (e) {
    console.error('Failed to load photos for cover', e);
    coverPhotos.value = [];
  } finally {
    coverPhotosLoading.value = false;
  }
}

function pickCover(item) {
  coverUrl.value = item.url;
  coverKey.value = item.key || '';
  coverModalOpen.value = false;
}

function closeSelectModal() {
  selectModalOpen.value = false;
  modalPendingList.value = [];
  modalPendingKeys.value = new Set();
}

function isAlreadyInAlbum(item) {
  return selectedKeys.value.has(item.key);
}

function isSelectedInModal(item) {
  return modalPendingKeys.value.has(item.key);
}

function toggleModalSelection(item) {
  if (modalPendingKeys.value.has(item.key)) {
    modalPendingList.value = modalPendingList.value.filter((i) => i.key !== item.key);
    modalPendingKeys.value = new Set([...modalPendingKeys.value].filter((k) => k !== item.key));
  } else {
    modalPendingList.value.push({
      id: nextSelectedId(),
      key: item.key,
      url: item.url,
      title: ''
    });
    modalPendingKeys.value = new Set([...modalPendingKeys.value, item.key]);
  }
}

function addModalSelectionToAlbum() {
  for (const item of modalPendingList.value) {
    if (selectedKeys.value.has(item.key)) continue;
    selectedList.value.push({ ...item, id: nextSelectedId() });
    selectedKeys.value = new Set([...selectedKeys.value, item.key]);
  }
  closeSelectModal();
}

function removeSelected(idx) {
  const item = selectedList.value[idx];
  if (item.key) selectedKeys.value = new Set([...selectedKeys.value].filter((k) => k !== item.key));
  selectedList.value.splice(idx, 1);
}

async function loadExistingPhotos() {
  existingLoading.value = true;
  try {
    existingPhotos.value = await getPhotos();
  } catch (e) {
    console.error('Failed to load photos', e);
    existingPhotos.value = [];
  } finally {
    existingLoading.value = false;
  }
}

async function onFileSelectInModal(e) {
  const files = e.target.files;
  if (!files?.length) return;
  uploadError.value = null;
  uploading.value = true;
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  for (const file of Array.from(files)) {
    if (!allowed.includes(file.type)) continue;
    try {
      const response = await uploadPhoto(file);
      const key = response.key;
      const url = await getPhotoUrl(key);
      const id = nextSelectedId();
      modalPendingList.value.push({ id, key, url, title: '' });
      modalPendingKeys.value = new Set([...modalPendingKeys.value, key]);
      uploadedInSession.value = [...uploadedInSession.value, { key, url, filename: file.name }];
      existingPhotos.value = [...existingPhotos.value, { key, url, filename: file.name }];
    } catch (err) {
      uploadError.value = err.response?.data?.detail || err.message || 'Upload failed';
    }
  }
  uploading.value = false;
  e.target.value = '';
}

async function submitForm() {
  if (!form.value.title?.trim() || !selectedList.value.length) return;
  submitError.value = null;
  saving.value = true;
  try {
    const cover = coverKey.value || coverUrl.value || selectedList.value[0]?.key || selectedList.value[0]?.url || null;
    const images = selectedList.value.map((i) =>
      i.key
        ? { key: i.key, title: i.title?.trim() || null }
        : { url: i.url, title: i.title?.trim() || null }
    );
    await GalleryService.update(albumId, {
      title: form.value.title.trim(),
      description: form.value.description?.trim() || null,
      cover,
      images
    });
    await router.push({ name: 'adminGallery' });
  } catch (err) {
    submitError.value = err.response?.data?.detail || err.message || 'Failed to save album';
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadAlbum();
});
</script>
