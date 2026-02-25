<template>
  <a-modal
    :open="open"
    :title="title"
    width="720px"
    :footer="null"
    @update:open="(v) => $emit('update:open', v)"
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

    <!-- Tab: From existing uploads -->
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
            isAlreadySelected(item)
              ? 'border-green-500 ring-2 ring-green-200 cursor-default'
              : isSelectedInModal(item)
                ? 'border-blue-600 ring-2 ring-blue-200 cursor-pointer'
                : 'border-gray-200 hover:border-gray-300 cursor-pointer'
          ]"
          @click="!isAlreadySelected(item) && toggleModalSelection(item)"
        >
          <img
            :src="item.url"
            :alt="item.filename || item.key"
            class="w-full h-full object-cover"
            loading="lazy"
          />
          <div
            v-if="isAlreadySelected(item)"
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

    <!-- Tab: Upload new -->
    <div v-show="activeTab === 'upload'" class="py-2 min-h-[280px]">
      <input
        ref="fileInputRef"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        class="hidden"
        @change="onFileSelect"
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
        @click="handleCancel"
      >
        <CloseOutlined />
        Cancel
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
        :disabled="!modalPendingList.length"
        @click="handleConfirm"
      >
        <PlusOutlined />
        {{ confirmButtonText }}
      </button>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { getPhotos, uploadPhoto, getPhotoUrl } from '@/services/PhotoUploadService';

const props = defineProps({
  open: { type: Boolean, default: false },
  mode: { type: String, default: 'multiple' },
  existingSelectedKeys: { type: [Array, Object], default: () => [] },
  title: { type: String, default: 'Select photos' },
  confirmLabel: { type: String, default: 'Add to album' }
});

const emit = defineEmits(['update:open', 'confirm', 'cancel']);

const activeTab = ref('existing');
const existingPhotos = ref([]);
const existingLoading = ref(false);
const uploadedInSession = ref([]);
const uploading = ref(false);
const uploadError = ref(null);
const modalPendingList = ref([]);
const modalPendingKeys = ref(new Set());
const fileInputRef = ref(null);

let nextId = 0;
function nextSelectedId() {
  return `sel-${++nextId}`;
}

const existingKeysSet = computed(() => {
  const v = props.existingSelectedKeys;
  return v instanceof Set ? v : new Set(Array.isArray(v) ? v : []);
});

const confirmButtonText = computed(() => {
  const n = modalPendingList.value.length;
  if (props.mode === 'single') return props.confirmLabel;
  return `${props.confirmLabel} (${n})`;
});

function isAlreadySelected(item) {
  return props.mode === 'multiple' && existingKeysSet.value.has(item.key);
}

function isSelectedInModal(item) {
  return modalPendingKeys.value.has(item.key);
}

function toggleModalSelection(item) {
  if (modalPendingKeys.value.has(item.key)) {
    modalPendingList.value = modalPendingList.value.filter((i) => i.key !== item.key);
    modalPendingKeys.value = new Set([...modalPendingKeys.value].filter((k) => k !== item.key));
  } else {
    const entry = { id: nextSelectedId(), key: item.key, url: item.url, title: '' };
    if (props.mode === 'single') {
      modalPendingList.value = [entry];
      modalPendingKeys.value = new Set([item.key]);
    } else {
      modalPendingList.value.push(entry);
      modalPendingKeys.value = new Set([...modalPendingKeys.value, item.key]);
    }
  }
}

function resetState() {
  activeTab.value = 'existing';
  modalPendingList.value = [];
  modalPendingKeys.value = new Set();
  uploadedInSession.value = [];
  uploadError.value = null;
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

async function onFileSelect(e) {
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
      const entry = { id, key, url, title: '' };
      if (props.mode === 'single') {
        modalPendingList.value = [entry];
        modalPendingKeys.value = new Set([key]);
      } else {
        modalPendingList.value.push(entry);
        modalPendingKeys.value = new Set([...modalPendingKeys.value, key]);
      }
      uploadedInSession.value = [...uploadedInSession.value, { key, url, filename: file.name }];
      existingPhotos.value = [...existingPhotos.value, { key, url, filename: file.name }];
    } catch (err) {
      uploadError.value = err.response?.data?.detail || err.message || 'Upload failed';
    }
  }
  uploading.value = false;
  e.target.value = '';
}

function handleCancel() {
  emit('update:open', false);
  emit('cancel');
  resetState();
}

function handleConfirm() {
  const items = [...modalPendingList.value];
  emit('confirm', items);
  emit('update:open', false);
  resetState();
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetState();
      loadExistingPhotos();
    }
  }
);
</script>
