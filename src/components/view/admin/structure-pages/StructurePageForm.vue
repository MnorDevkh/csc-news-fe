<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800">
        {{ isEdit ? 'Edit structure page' : 'New structure page' }}
      </h2>
      <button type="button" @click="$router.push({ name: 'adminStructurePages' })" class="text-gray-500 hover:text-gray-700">
        Cancel
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div v-if="!isEdit">
        <label class="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
        <input
          v-model="form.slug"
          type="text"
          required
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
          placeholder="e.g. bishops-council"
        />
        <p class="text-xs text-gray-500 mt-1">Lowercase letters, numbers, hyphens only.</p>
      </div>
      <div v-else>
        <label class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
        <input :value="editSlug" type="text" disabled
          class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 font-mono text-sm" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Order</label>
          <input v-model.number="form.order_no" type="number" min="0" step="1"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="form.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input v-model="form.title" type="text" required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Enter page title" />
      </div>

      <!-- Thumbnail (cover-style picker) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
        <div
          class="rounded-lg border-2 border-dashed min-h-[140px] flex items-center justify-center bg-gray-50/80 transition-colors cursor-pointer hover:border-blue-400 hover:bg-blue-50/30"
          :class="thumbnailUrl ? 'border-gray-200' : 'border-gray-300'"
          @click="openThumbnailModal"
        >
          <img
            v-if="thumbnailUrl"
            :src="thumbnailUrl"
            alt="Thumbnail"
            class="w-full h-full min-h-[140px] max-h-[200px] object-contain rounded-lg"
          />
          <div v-else class="flex flex-col items-center gap-2 text-gray-400 py-6">
            <PictureOutlined class="text-4xl" />
            <span class="text-sm">Click to select thumbnail image (optional)</span>
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

      <!-- Excerpt -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
        <textarea v-model="form.excerpt" rows="2"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Brief summary (optional)"></textarea>
      </div>

      <!-- Block-based Content -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
        <p class="text-xs text-gray-500 mb-2">Add content blocks and images in any order. Use the buttons below to add more.</p>
        <div class="space-y-4">
          <div
            v-for="(block, index) in contentBlocks"
            :key="block.id"
            class="rounded-lg border border-gray-200 bg-gray-50/50 p-4 relative"
          >
            <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500">Block type</span>
                <select
                  class="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  :value="uiBlockKind(block)"
                  @change="onBlockKindChange(index, $event.target.value)"
                >
                  <option value="text">Text (full)</option>
                  <option value="text_image_full">Text + image (full)</option>
                  <option value="text_image_left">Text + image (left)</option>
                  <option value="text_image_right">Text + image (right)</option>
                  <option value="image">Image(s)</option>
                </select>
              </div>
              <button
                type="button"
                class="text-xs text-red-500 hover:text-red-700 transition-colors"
                @click="removeBlock(index)"
              >
                Remove block
              </button>
            </div>

            <template v-if="block.type === 'text'">
              <div class="prose max-w-none [&_.ck-editor__editable]:min-h-[120px]">
                <ckeditor :editor="editor" v-model="block.html" :config="editorConfig" />
              </div>
            </template>
            <template v-else-if="block.type === 'text_image'">
              <div class="grid grid-cols-1 gap-4">
                <div class="prose max-w-none [&_.ck-editor__editable]:min-h-[120px]">
                  <ckeditor :editor="editor" v-model="block.html" :config="editorConfig" />
                </div>

                <div class="rounded-lg border border-gray-200 bg-white p-3">
                  <div class="flex items-center justify-between gap-3">
                    <div class="text-sm font-medium text-gray-700">Block image</div>
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md font-medium transition-colors text-sm"
                        @click="openTextImageModal(index)"
                      >
                        <PictureOutlined /> Choose image
                      </button>
                      <button
                        v-if="block.image && block.image.url"
                        type="button"
                        class="text-xs text-red-500 hover:text-red-700 transition-colors"
                        @click="removeTextImage(index)"
                      >
                        Remove image
                      </button>
                    </div>
                  </div>

                  <div class="mt-3 flex flex-wrap items-center gap-2">
                    <label class="text-xs text-gray-500">Columns</label>
                    <select
                      class="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      v-model="block.ratio"
                    >
                      <option value="1/2">Image 1/2 - Text 1/2</option>
                      <option value="1/3">Image 1/3 - Text 2/3</option>
                      <option value="2/3">Image 2/3 - Text 1/3</option>
                    </select>
                  </div>

                  <div v-if="block.image && block.image.url" class="mt-3">
                    <img
                      :src="block.image.url"
                      alt="Block image"
                      class="w-full max-w-xs rounded-lg border border-gray-200 object-contain bg-gray-50"
                    />
                    <div class="mt-1 text-xs text-gray-400 truncate">{{ block.image.url }}</div>
                  </div>
                  <div v-else class="mt-3 text-xs text-gray-400">No image selected.</div>

                  <div class="mt-3">
                    <label class="block text-xs text-gray-500 mb-1">Image title</label>
                    <input
                      v-model="block.caption"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      placeholder="Optional caption"
                    />
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="block.type === 'image'">
              <div class="flex flex-wrap gap-3">
                <div
                  v-for="(img, imgIdx) in block.images"
                  :key="img.key || imgIdx"
                  class="relative rounded-lg overflow-hidden border border-gray-200 bg-white"
                >
                  <img
                    :src="img.url"
                    :alt="img.filename || 'Image'"
                    class="w-32 h-32 object-cover"
                  />
                </div>
              </div>
            </template>
            <div class="mt-2 text-xs text-gray-400">
              <span v-if="block.type === 'text'">Text block</span>
              <span v-else-if="block.type === 'text_image'">Text + image block ({{ block.layout }})</span>
              <span v-else>Image block</span>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
              @click="addContentBlock"
            >
              Add content
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors text-sm"
              @click="openContentImageModal"
            >
              <PictureOutlined /> Add image(s)
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-4 border-t border-gray-100">
        <button type="submit" :disabled="isSubmitting"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
          <span v-if="isSubmitting" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          Save page
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
    <ImageSelectModal
      v-model:open="contentImageModalOpen"
      mode="multiple"
      title="Select image(s) for content"
      confirm-label="Add to page"
      @confirm="onContentImagesSelected"
    />
    <ImageSelectModal
      v-model:open="textImageModalOpen"
      mode="single"
      title="Select image for text+image block"
      confirm-label="Select"
      @confirm="onTextImageSelected"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Link, List, Heading, BlockQuote, Table, TableToolbar, Font, Alignment, PasteFromOffice } from 'ckeditor5';
import ImageSelectModal from '@/components/ImageSelectModal.vue';
import { PictureOutlined } from '@ant-design/icons-vue';
import { StructurePageService } from '@/services/StructurePageService';

const props = defineProps({
  slug: {
    type: String,
    default: '',
  },
});

const route = useRoute();
const router = useRouter();
const editSlug = computed(() => String(props.slug || route.params.slug || '').trim());
const isEdit = computed(() => editSlug.value.length > 0);

const editor = ClassicEditor;
const editorConfig = {
  licenseKey: 'GPL',
  plugins: [
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Link,
    List,
    Heading,
    BlockQuote,
    Table,
    TableToolbar,
    Font,
    Alignment,
    PasteFromOffice,
  ],
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    'bulletedList',
    'numberedList',
    'blockQuote',
    'insertTable',
    '|',
    'fontColor',
    'fontBackgroundColor',
    'alignment',
    '|',
    'undo',
    'redo',
  ],
};

const isSubmitting = ref(false);

const thumbnailModalOpen = ref(false);
const thumbnailUrl = ref('');
const thumbnailKey = ref('');

const form = reactive({
  slug: '',
  title: '',
  thumbnail: '',
  excerpt: '',
  content: '',
  order_no: 0,
  status: 'active',
});

const contentBlocks = ref([]);
const contentImageModalOpen = ref(false);
const textImageModalOpen = ref(false);
const activeTextImageBlockIndex = ref(-1);
let nextBlockId = 0;
function nextId() {
  return `block-${++nextBlockId}-${Date.now()}`;
}

function uiBlockKind(block) {
  if (!block) return 'text';
  if (block.type === 'text') return 'text';
  if (block.type === 'image') return 'image';
  if (block.type === 'text_image') {
    if (block.layout === 'left') return 'text_image_left';
    if (block.layout === 'right') return 'text_image_right';
    return 'text_image_full';
  }
  return 'text';
}

function onBlockKindChange(index, kind) {
  const current = contentBlocks.value[index];
  if (!current) return;

  if (kind === 'text') {
    contentBlocks.value[index] = {
      id: current.id || nextId(),
      type: 'text',
      html: current.html || '',
    };
    return;
  }

  if (kind === 'image') {
    contentBlocks.value[index] = {
      id: current.id || nextId(),
      type: 'image',
      images: current.images || [],
    };
    return;
  }

  const layout =
    kind === 'text_image_left' ? 'left' :
    kind === 'text_image_right' ? 'right' :
    'full';

  const existingImageUrl = current.image?.url || '';
  const existingImageKey = current.image?.key || '';
  contentBlocks.value[index] = {
    id: current.id || nextId(),
    type: 'text_image',
    layout,
    html: current.html || '',
    image: { url: existingImageUrl, key: existingImageKey },
    ratio: current.ratio || '1/2',
    caption: current.caption || '',
  };
}

function openTextImageModal(index) {
  activeTextImageBlockIndex.value = index;
  textImageModalOpen.value = true;
}

function onTextImageSelected(items) {
  const idx = activeTextImageBlockIndex.value;
  const block = contentBlocks.value[idx];
  const item = items && items[0] ? items[0] : null;
  if (!block || block.type !== 'text_image' || !item) return;
  block.image = { url: item.url, key: item.key || '' };
}

function removeTextImage(index) {
  const block = contentBlocks.value[index];
  if (!block || block.type !== 'text_image') return;
  block.image = { url: '', key: '' };
}

function parseContentToBlocks(contentStr) {
  if (!contentStr || !contentStr.trim()) {
    return [];
  }
  const s = contentStr.trim();
  if (s.startsWith('[') && s.endsWith(']')) {
    try {
      const arr = JSON.parse(contentStr);
      if (!Array.isArray(arr)) return [{ id: nextId(), type: 'text', html: contentStr }];
      return arr.map((b) => {
        if (b.type === 'text') {
          return { id: nextId(), type: 'text', html: b.html != null ? String(b.html) : '' };
        }
        if (b.type === 'text_image') {
          const layout = b.layout === 'left' || b.layout === 'right' || b.layout === 'full' ? b.layout : 'full';
          const ratio = b.ratio === '1/3' || b.ratio === '2/3' || b.ratio === '1/2' ? b.ratio : '1/2';
          const caption = b.caption != null ? String(b.caption) : '';
          const imageUrl = b.image && typeof b.image === 'object' ? (b.image.url || '') : '';
          const imageKey = b.image && typeof b.image === 'object' ? (b.image.key || '') : '';
          return {
            id: nextId(),
            type: 'text_image',
            layout,
            ratio,
            caption,
            html: b.html != null ? String(b.html) : '',
            image: { url: imageUrl, key: imageKey },
          };
        }
        if (b.type === 'image' && Array.isArray(b.images)) {
          return {
            id: nextId(),
            type: 'image',
            images: b.images.map((img) => ({ url: img.url || '', key: img.key || '' }))
          };
        }
        return { id: nextId(), type: 'text', html: '' };
      });
    } catch {
      return [{ id: nextId(), type: 'text', html: contentStr }];
    }
  }
  return [{ id: nextId(), type: 'text', html: contentStr }];
}

function serializeBlocks() {
  return contentBlocks.value.map((b) => {
    if (b.type === 'text') return { type: 'text', html: b.html || '' };
    if (b.type === 'text_image') {
      return {
        type: 'text_image',
        layout: b.layout || 'full',
        ratio: b.ratio || '1/2',
        caption: b.caption || '',
        html: b.html || '',
        image: { url: b.image?.url || '', key: b.image?.key || '' },
      };
    }
    return { type: 'image', images: (b.images || []).map((img) => ({ url: img.url, key: img.key })) };
  });
}

function addContentBlock() {
  contentBlocks.value.push({ id: nextId(), type: 'text', html: '' });
}

function removeBlock(index) {
  contentBlocks.value.splice(index, 1);
}

function openContentImageModal() {
  contentImageModalOpen.value = true;
}

function onContentImagesSelected(items) {
  if (!items || !items.length) return;
  const images = items.map((item) => ({ url: item.url, key: item.key || '' }));
  contentBlocks.value.push({ id: nextId(), type: 'image', images });
}

const openThumbnailModal = () => {
  thumbnailModalOpen.value = true;
};

const onThumbnailSelected = (items) => {
  const item = items[0];
  if (item) {
    thumbnailUrl.value = item.url;
    thumbnailKey.value = item.key || '';
    form.thumbnail = item.url;
  }
};

const removeThumbnail = () => {
  thumbnailUrl.value = '';
  thumbnailKey.value = '';
  form.thumbnail = '';
};

onMounted(async () => {
  if (!isEdit.value) {
    contentBlocks.value = [{ id: nextId(), type: 'text', html: '' }];
    return;
  }
  try {
    const data = await StructurePageService.getAdmin(editSlug.value);
    if (data) {
      form.title = data.title ?? '';
      form.thumbnail = data.thumbnail ?? '';
      form.excerpt = data.excerpt ?? '';
      form.content = data.content ?? '';
      form.order_no = data.order_no ?? 0;
      form.status = data.status === 'draft' ? 'draft' : 'active';
      if (data.thumbnail) thumbnailUrl.value = data.thumbnail;
      contentBlocks.value = parseContentToBlocks(data.content || '');
    }
    if (!contentBlocks.value.length) {
      contentBlocks.value = [{ id: nextId(), type: 'text', html: '' }];
    }
  } catch (error) {
    console.error('Error loading structure page:', error);
    contentBlocks.value = [{ id: nextId(), type: 'text', html: '' }];
  }
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    const contentJson = JSON.stringify(serializeBlocks());
    if (isEdit.value) {
      await StructurePageService.update(editSlug.value, {
        title: form.title,
        thumbnail: form.thumbnail || null,
        excerpt: form.excerpt || null,
        content: contentJson,
        order_no: form.order_no,
        status: form.status,
      });
      alert('Structure page saved.');
    } else {
      const slug = (form.slug || '').trim().toLowerCase();
      if (!slug) {
        alert('Slug is required.');
        return;
      }
      await StructurePageService.create({
        slug,
        title: form.title,
        thumbnail: form.thumbnail || null,
        excerpt: form.excerpt || null,
        content: contentJson,
        order_no: form.order_no,
        status: form.status,
      });
      alert('Structure page created.');
      router.push({ name: 'adminStructurePages' });
    }
  } catch (error) {
    console.error('Error saving structure page:', error);
    alert('Failed to save. Check console / auth token.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
