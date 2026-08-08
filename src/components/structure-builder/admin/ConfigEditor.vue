<script setup>
import { computed, ref } from 'vue';
import { PictureOutlined } from '@ant-design/icons-vue';
import ImageSelectModal from '@/components/ImageSelectModal.vue';
import { getBlockDefinition } from '../blockCatalog';
import { editor, editorConfig } from './editorConfig';

const props = defineProps({
  section: { type: Object, required: true },
});

const definition = computed(() => getBlockDefinition(props.section.type));
const config = computed(() => {
  if (!props.section.config) props.section.config = {};
  return props.section.config;
});

const mediaModalOpen = ref(false);
const mediaTarget = ref({ kind: 'field', key: '', listKey: '', index: -1 });

function value(key) {
  return config.value[key];
}

function update(key, nextValue) {
  config.value[key] = nextValue;
}

function inputValue(event) {
  return event.target.value;
}

function selectValue(event, field) {
  const raw = inputValue(event);
  return field.options?.find((option) => String(option.value) === raw)?.value ?? raw;
}

function list(key) {
  const current = config.value[key];
  if (Array.isArray(current)) return current;
  config.value[key] = [];
  return config.value[key];
}

function addListItem(key) {
  const defaults = {
    cards: {
      title: 'New card',
      description: 'Card description',
      icon: '✦',
      image: '',
      link: '',
      linkLabel: 'បើក',
    },
    images: { src: '', alt: 'Gallery image', caption: '' },
    items:
      props.section.type === 'faq'
        ? { question: 'New question', answer: 'Add the answer.' }
        : { title: 'New item', content: 'Add content.' },
  };
  list(key).push({ ...(defaults[key] ?? {}) });
}

function removeListItem(key, index) {
  list(key).splice(index, 1);
}

function openMediaField(key) {
  mediaTarget.value = { kind: 'field', key, listKey: '', index: -1 };
  mediaModalOpen.value = true;
}

function openMediaList(listKey, index, fieldKey = 'src') {
  mediaTarget.value = { kind: 'list', key: fieldKey, listKey, index };
  mediaModalOpen.value = true;
}

function openGalleryPicker() {
  mediaTarget.value = { kind: 'gallery-multi', key: '', listKey: 'images', index: -1 };
  mediaModalOpen.value = true;
}

function onMediaSelected(items) {
  if (!items?.length) return;
  const target = mediaTarget.value;

  if (target.kind === 'gallery-multi') {
    const images = list('images');
    items.forEach((item) => {
      images.push({
        src: item.url,
        alt: item.title || item.filename || '',
        caption: item.title || '',
      });
    });
    return;
  }

  const url = items[0].url;
  if (target.kind === 'field') {
    update(target.key, url);
    return;
  }
  if (target.kind === 'list' && target.listKey && target.index >= 0) {
    const row = list(target.listKey)[target.index];
    if (row) row[target.key] = url;
  }
}
</script>

<template>
  <div class="space-y-4">
    <template v-for="field in definition?.fields" :key="field.key">
      <label v-if="field.type === 'toggle'" class="flex items-center justify-between gap-4 text-sm">
        <span class="font-medium text-slate-700">{{ field.label }}</span>
        <input
          type="checkbox"
          :checked="Boolean(value(field.key))"
          class="h-4 w-4 accent-blue-600"
          @change="update(field.key, $event.target.checked)"
        />
      </label>

      <div v-else-if="field.type === 'richtext'" class="block text-sm">
        <span class="mb-1.5 block font-medium text-slate-700">{{ field.label }}</span>
        <div class="structure-builder-editor rounded-lg border border-slate-300 overflow-hidden">
          <ckeditor
            :key="`${section.id}-${field.key}`"
            :editor="editor"
            :model-value="String(value(field.key) ?? '')"
            :config="editorConfig"
            @update:model-value="update(field.key, $event)"
          />
        </div>
      </div>

      <div v-else-if="field.type === 'media'" class="block text-sm">
        <span class="mb-1.5 block font-medium text-slate-700">{{ field.label }}</span>
        <div class="flex flex-col gap-2">
          <div
            class="rounded-md border-2 border-dashed min-h-[100px] flex items-center justify-center bg-gray-50/80 cursor-pointer hover:border-blue-400"
            :class="value(field.key) ? 'border-gray-200' : 'border-gray-300'"
            @click="openMediaField(field.key)"
          >
            <img
              v-if="value(field.key)"
              :src="String(value(field.key))"
              alt="Selected"
              class="max-h-[140px] w-full object-contain rounded-md"
            />
            <div v-else class="flex flex-col items-center gap-2 text-gray-400 py-4">
              <PictureOutlined class="text-3xl" />
              <span class="text-xs">Click to select from library</span>
            </div>
          </div>
          <input
            :value="String(value(field.key) ?? '')"
            type="url"
            placeholder="Or paste image URL"
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
            @input="update(field.key, inputValue($event))"
          />
          <button
            v-if="value(field.key)"
            type="button"
            class="self-start text-xs text-red-500 hover:text-red-700"
            @click="update(field.key, '')"
          >
            Remove image
          </button>
        </div>
      </div>

      <label v-else class="block text-sm">
        <span class="mb-1.5 block font-medium text-slate-700">{{ field.label }}</span>
        <textarea
          v-if="field.type === 'textarea'"
          :value="String(value(field.key) ?? '')"
          :placeholder="field.placeholder"
          rows="4"
          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          @input="update(field.key, inputValue($event))"
        />
        <select
          v-else-if="field.type === 'select'"
          :value="String(value(field.key) ?? '')"
          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
          @change="update(field.key, selectValue($event, field))"
        >
          <option
            v-for="option in field.options"
            :key="String(option.value)"
            :value="String(option.value)"
          >
            {{ option.label }}
          </option>
        </select>
        <input
          v-else
          :type="field.type === 'color' ? 'color' : field.type === 'number' ? 'number' : field.type === 'url' ? 'url' : 'text'"
          :value="String(value(field.key) ?? '')"
          :placeholder="field.placeholder"
          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          @input="update(field.key, field.type === 'number' ? Number(inputValue($event)) : inputValue($event))"
        />
      </label>
    </template>

    <div v-if="section.type === 'card-grid'" class="border-t border-slate-200 pt-4">
      <div class="mb-3 flex items-center justify-between">
        <h4 class="text-sm font-semibold text-slate-900">Cards</h4>
        <button type="button" class="text-xs font-semibold text-blue-600" @click="addListItem('cards')">
          + Add card
        </button>
      </div>
      <div class="space-y-3">
        <div
          v-for="(card, index) in list('cards')"
          :key="index"
          class="rounded-lg bg-slate-50 p-3"
        >
          <div class="mb-2 flex justify-between">
            <strong class="text-xs text-slate-500">Card {{ index + 1 }}</strong>
            <button type="button" class="text-xs text-red-600" @click="removeListItem('cards', index)">
              Remove
            </button>
          </div>
          <input
            v-model="card.title"
            placeholder="Title"
            class="mb-2 w-full rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm"
          />
          <textarea
            v-model="card.description"
            placeholder="Description"
            rows="2"
            class="mb-2 w-full rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm"
          />
          <input
            v-model="card.icon"
            placeholder="Icon (emoji or symbol)"
            class="mb-2 w-full rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm"
          />
          <div class="mb-2 flex gap-2">
            <input
              v-model="card.image"
              placeholder="Image URL (optional)"
              class="flex-1 rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm"
            />
            <button
              type="button"
              class="rounded-md border border-slate-300 bg-white px-2 text-xs text-blue-600"
              @click="openMediaList('cards', index, 'image')"
            >
              Library
            </button>
          </div>
          <input
            v-model="card.link"
            placeholder="Link"
            class="mb-2 w-full rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm"
          />
          <input
            v-model="card.linkLabel"
            placeholder="Link label (default: បើក)"
            class="w-full rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm"
          />
        </div>
      </div>
    </div>

    <div
      v-if="section.type === 'faq' || section.type === 'accordion'"
      class="border-t border-slate-200 pt-4"
    >
      <div class="mb-3 flex items-center justify-between">
        <h4 class="text-sm font-semibold text-slate-900">Items</h4>
        <button type="button" class="text-xs font-semibold text-blue-600" @click="addListItem('items')">
          + Add item
        </button>
      </div>
      <div class="space-y-3">
        <div
          v-for="(item, index) in list('items')"
          :key="index"
          class="rounded-lg bg-slate-50 p-3"
        >
          <div class="mb-2 flex justify-between">
            <strong class="text-xs text-slate-500">Item {{ index + 1 }}</strong>
            <button type="button" class="text-xs text-red-600" @click="removeListItem('items', index)">
              Remove
            </button>
          </div>
          <input
            v-model="item[section.type === 'faq' ? 'question' : 'title']"
            :placeholder="section.type === 'faq' ? 'Question' : 'Title'"
            class="mb-2 w-full rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm"
          />
          <textarea
            v-model="item[section.type === 'faq' ? 'answer' : 'content']"
            :placeholder="section.type === 'faq' ? 'Answer' : 'Content'"
            rows="3"
            class="w-full rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm"
          />
        </div>
      </div>
    </div>

    <div v-if="section.type === 'gallery'" class="border-t border-slate-200 pt-4">
      <div class="mb-3 flex items-center justify-between gap-2">
        <h4 class="text-sm font-semibold text-slate-900">Images</h4>
        <div class="flex gap-2">
          <button
            type="button"
            class="text-xs font-semibold text-blue-600"
            @click="openGalleryPicker"
          >
            + From library
          </button>
          <button type="button" class="text-xs font-semibold text-blue-600" @click="addListItem('images')">
            + Add URL
          </button>
        </div>
      </div>
      <div class="space-y-3">
        <div
          v-for="(image, index) in list('images')"
          :key="index"
          class="rounded-lg bg-slate-50 p-3"
        >
          <div class="mb-2 flex justify-between">
            <strong class="text-xs text-slate-500">Image {{ index + 1 }}</strong>
            <button type="button" class="text-xs text-red-600" @click="removeListItem('images', index)">
              Remove
            </button>
          </div>
          <div v-if="image.src" class="mb-2">
            <img :src="image.src" alt="" class="h-20 w-full object-cover rounded-md" />
          </div>
          <div class="mb-2 flex gap-2">
            <input
              v-model="image.src"
              placeholder="Image URL"
              class="flex-1 rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm"
            />
            <button
              type="button"
              class="rounded-md border border-slate-300 bg-white px-2 text-xs text-blue-600"
              @click="openMediaList('images', index)"
            >
              Library
            </button>
          </div>
          <input
            v-model="image.alt"
            placeholder="Image description"
            class="mb-2 w-full rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm"
          />
          <input
            v-model="image.caption"
            placeholder="Caption"
            class="w-full rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm"
          />
        </div>
      </div>
    </div>

    <ImageSelectModal
      v-model:open="mediaModalOpen"
      :mode="mediaTarget.kind === 'gallery-multi' ? 'multiple' : 'single'"
      title="Select image"
      confirm-label="Select"
      @confirm="onMediaSelected"
    />
  </div>
</template>

<style scoped>
.structure-builder-editor :deep(.ck-editor__editable) {
  min-height: 120px;
}
</style>
