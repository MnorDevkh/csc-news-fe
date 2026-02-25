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
    <ImageSelectModal
      v-model:open="selectModalOpen"
      mode="multiple"
      :existing-selected-keys="Array.from(selectedKeys)"
      title="Select photos"
      confirm-label="Add to album"
      @confirm="onAddPhotosToAlbum"
    />

    <!-- Cover selection modal -->
    <ImageSelectModal
      v-model:open="coverModalOpen"
      mode="single"
      title="Select cover image"
      confirm-label="Select"
      @confirm="onCoverSelected"
    />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { PictureOutlined, PlusOutlined, CloseOutlined, ArrowRightOutlined } from '@ant-design/icons-vue';
import ImageSelectModal from '@/components/ImageSelectModal.vue';
import { GalleryService } from '@/services/GalleryService';

const router = useRouter();
const route = useRoute();
const albumId = route.params.id;

const pageLoading = ref(true);
const selectModalOpen = ref(false);
const coverModalOpen = ref(false);
const form = ref({ title: '', description: '' });
const selectedList = ref([]);
const selectedKeys = ref(new Set());
const coverUrl = ref('');
const coverKey = ref('');
const saving = ref(false);
const submitError = ref(null);

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
  selectModalOpen.value = true;
}

function openCoverModal() {
  coverModalOpen.value = true;
}

function onAddPhotosToAlbum(items) {
  for (const item of items) {
    if (selectedKeys.value.has(item.key)) continue;
    selectedList.value.push({ ...item });
    selectedKeys.value = new Set([...selectedKeys.value, item.key]);
  }
}

function onCoverSelected(items) {
  const item = items[0];
  if (item) {
    coverUrl.value = item.url;
    coverKey.value = item.key || '';
  }
}

function removeSelected(idx) {
  const item = selectedList.value[idx];
  if (item.key) selectedKeys.value = new Set([...selectedKeys.value].filter((k) => k !== item.key));
  selectedList.value.splice(idx, 1);
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
