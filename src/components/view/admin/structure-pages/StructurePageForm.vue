<template>
  <div class="mx-auto px-3 sm:px-4 pb-8">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">
          {{ isEdit ? 'Edit structure page' : 'New structure page' }}
        </h1>
        <p class="text-sm text-slate-500">Visual page builder — layouts, blocks, and live preview.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
          @click="router.push({ name: 'adminStructurePages' })"
        >
          Back to list
        </button>
        <button
          type="button"
          class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-40"
          :disabled="!isEdit || isLoading"
          @click="discardChanges"
        >
          Discard
        </button>
        <button
          type="button"
          class="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          :disabled="!isEdit || form.status !== 'active'"
          @click="viewPage"
        >
          View page
        </button>
        <button
          type="button"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
          :disabled="isSubmitting || isLoading"
          @click="handleSubmit"
        >
          {{ isSubmitting ? 'Saving…' : 'Save page' }}
        </button>
      </div>
    </div>

    <div
      v-if="message"
      class="mb-4 rounded-lg border px-4 py-2.5 text-sm"
      :class="
        messageType === 'error'
          ? 'border-red-200 bg-red-50 text-red-800'
          : 'border-blue-200 bg-blue-50 text-blue-800'
      "
    >
      {{ message }}
    </div>

    <div v-if="isLoading" class="flex min-h-[480px] items-center justify-center text-slate-500">
      Loading page…
    </div>

    <div v-else class="grid items-start gap-4 lg:grid-cols-[minmax(520px,3fr)_2fr]">
      <aside class="space-y-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto lg:pr-1">
        <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 class="mb-3 font-semibold text-slate-900">Page settings</h2>
          <div class="grid gap-3 sm:grid-cols-2">
            <label v-if="!isEdit" class="text-sm font-medium text-slate-700 sm:col-span-2">
              URL slug
              <input
                v-model="form.slug"
                required
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                class="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm"
                placeholder="e.g. bishops-council"
              />
            </label>
            <label v-else class="text-sm font-medium text-slate-700 sm:col-span-2">
              URL slug
              <input
                :value="editSlug"
                disabled
                class="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-600"
              />
            </label>
            <label class="text-sm font-medium text-slate-700 sm:col-span-2">
              Title
              <input
                v-model="form.title"
                required
                class="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              />
            </label>
            <label class="text-sm font-medium text-slate-700">
              Order
              <input
                v-model.number="form.order_no"
                type="number"
                min="0"
                step="1"
                class="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              />
            </label>
            <label class="text-sm font-medium text-slate-700">
              Status
              <select
                v-model="form.status"
                class="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </label>
          </div>

          <label class="mt-3 block text-sm font-medium text-slate-700">
            Thumbnail
            <div
              class="mt-1 rounded-md border-2 border-dashed min-h-[100px] flex items-center justify-center bg-gray-50/80 cursor-pointer hover:border-blue-400"
              :class="thumbnailUrl ? 'border-gray-200' : 'border-gray-300'"
              @click="thumbnailModalOpen = true"
            >
              <img
                v-if="thumbnailUrl"
                :src="thumbnailUrl"
                alt="Thumbnail"
                class="max-h-[140px] w-full object-contain rounded-md"
              />
              <div v-else class="flex flex-col items-center gap-2 text-gray-400 py-4">
                <PictureOutlined class="text-3xl" />
                <span class="text-xs">Click to select (optional)</span>
              </div>
            </div>
            <button
              v-if="thumbnailUrl"
              type="button"
              class="mt-2 text-xs text-red-500 hover:text-red-700"
              @click="removeThumbnail"
            >
              Remove thumbnail
            </button>
          </label>

          <label class="mt-3 block text-sm font-medium text-slate-700">
            Excerpt
            <textarea
              v-model="form.excerpt"
              rows="2"
              class="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              placeholder="Brief summary (optional)"
            />
          </label>
        </section>

        <section class="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div class="mb-3 flex items-center justify-between">
            <div>
              <h2 class="font-semibold text-slate-900">Page content</h2>
              <p class="text-xs text-slate-500">{{ sections.length }} top-level sections</p>
            </div>
            <button
              type="button"
              class="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500"
              @click="openPicker()"
            >
              + Add content
            </button>
          </div>

          <div v-if="sections.length" class="space-y-3">
            <SectionBuilder
              v-for="(section, index) in sections"
              :key="section.id || index"
              :section="section"
              :index="index"
              :total="sections.length"
              @remove="removeSection(index)"
              @move-up="moveSection(index, -1)"
              @move-down="moveSection(index, 1)"
              @add-to="openPicker($event)"
            />
          </div>
          <button
            v-else
            type="button"
            class="flex min-h-40 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-slate-500 transition hover:border-blue-500 hover:text-blue-600"
            @click="openPicker()"
          >
            <span class="text-3xl">＋</span>
            <span class="mt-2 text-sm font-semibold">Choose a layout or block</span>
          </button>
        </section>
      </aside>

      <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h2 class="font-semibold text-slate-900">Live preview</h2>
            <p class="text-xs text-slate-500">Updates as you edit.</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="inline-flex rounded-md border border-gray-200 overflow-hidden bg-white">
              <button
                type="button"
                class="px-2.5 py-1.5 text-xs font-medium"
                :class="previewDevice === 'desktop' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'"
                @click="previewDevice = 'desktop'"
              >
                Desktop
              </button>
              <button
                type="button"
                class="px-2.5 py-1.5 text-xs font-medium"
                :class="previewDevice === 'mobile' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'"
                @click="previewDevice = 'mobile'"
              >
                Mobile
              </button>
            </div>
            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
              /structure/{{ isEdit ? editSlug : form.slug || '…' }}
            </span>
          </div>
        </div>
        <div class="h-[calc(100vh-10rem)] min-h-[560px] overflow-y-auto bg-slate-50">
          <div
            class="mx-auto bg-white min-h-full"
            :class="previewDevice === 'mobile' ? 'max-w-[390px] shadow-sm' : ''"
          >
            <div v-if="form.thumbnail" class="aspect-video w-full bg-gray-100 overflow-hidden">
              <img :src="form.thumbnail" :alt="form.title || 'thumbnail'" class="w-full h-full object-cover" />
            </div>
            <div class="p-4 sm:p-6">
              <div class="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-2">
                {{ form.title || 'Untitled' }}
              </div>
              <div v-if="form.excerpt" class="mb-4 text-gray-600">{{ form.excerpt }}</div>
              <PageRenderer :sections="sections" compact />
            </div>
          </div>
        </div>
      </section>
    </div>

    <ImageSelectModal
      v-model:open="thumbnailModalOpen"
      mode="single"
      title="Select thumbnail image"
      confirm-label="Select"
      @confirm="onThumbnailSelected"
    />
    <BlockPicker
      v-if="pickerOpen"
      @close="pickerOpen = false"
      @pick-block="addBlock"
      @pick-layout="addLayout"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { PictureOutlined } from '@ant-design/icons-vue';
import ImageSelectModal from '@/components/ImageSelectModal.vue';
import BlockPicker from '@/components/structure-builder/admin/BlockPicker.vue';
import SectionBuilder from '@/components/structure-builder/admin/SectionBuilder.vue';
import PageRenderer from '@/components/structure-builder/renderer/PageRenderer.vue';
import { createBlock, createLayout } from '@/components/structure-builder/blockCatalog';
import {
  parseContentDocument,
  serializeContentDocument,
} from '@/components/structure-builder/document';
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

const isLoading = ref(false);
const isSubmitting = ref(false);
const message = ref('');
const messageType = ref('info');
const thumbnailModalOpen = ref(false);
const thumbnailUrl = ref('');
const pickerOpen = ref(false);
const addTarget = ref(null);
const previewDevice = ref('desktop');
const sections = ref([]);
const initialSnapshot = ref('');

const form = reactive({
  slug: '',
  title: '',
  thumbnail: '',
  excerpt: '',
  order_no: 0,
  status: 'active',
});

function setMessage(text, type = 'info') {
  message.value = text;
  messageType.value = type;
}

function openPicker(target) {
  addTarget.value = target ?? sections.value;
  pickerOpen.value = true;
}

function addBlock(type) {
  addTarget.value?.push(createBlock(type));
  pickerOpen.value = false;
}

function addLayout(columns) {
  addTarget.value?.push(createLayout(columns));
  pickerOpen.value = false;
}

function removeSection(index) {
  sections.value.splice(index, 1);
}

function moveSection(index, direction) {
  const target = index + direction;
  if (target < 0 || target >= sections.value.length) return;
  const [section] = sections.value.splice(index, 1);
  if (section) sections.value.splice(target, 0, section);
}

function onThumbnailSelected(items) {
  const item = items?.[0];
  if (item) {
    thumbnailUrl.value = item.url;
    form.thumbnail = item.url;
  }
}

function removeThumbnail() {
  thumbnailUrl.value = '';
  form.thumbnail = '';
}

function viewPage() {
  if (!isEdit.value) return;
  const routeData = router.resolve({ name: 'structurePage', params: { slug: editSlug.value } });
  window.open(routeData.href, '_blank');
}

function captureSnapshot() {
  initialSnapshot.value = JSON.stringify({
    form: { ...form },
    sections: sections.value,
  });
}

async function loadPage() {
  if (!isEdit.value) {
    sections.value = [];
    captureSnapshot();
    return;
  }
  isLoading.value = true;
  setMessage('');
  try {
    const data = await StructurePageService.getAdmin(editSlug.value);
    form.title = data.title ?? '';
    form.thumbnail = data.thumbnail ?? '';
    form.excerpt = data.excerpt ?? '';
    form.order_no = data.order_no ?? 0;
    form.status = data.status === 'draft' ? 'draft' : 'active';
    thumbnailUrl.value = data.thumbnail || '';
    const doc = parseContentDocument(data.content || '');
    sections.value = doc.sections;
    if (doc.source === 'legacy-blocks' || doc.source === 'legacy-html') {
      setMessage('Loaded legacy content into the visual builder. Save to upgrade to the new format.');
    }
    captureSnapshot();
  } catch (error) {
    console.error('Error loading structure page:', error);
    setMessage('Could not load this page.', 'error');
    sections.value = [];
  } finally {
    isLoading.value = false;
  }
}

function discardChanges() {
  if (!window.confirm('Discard unsaved changes and reload the saved page?')) return;
  loadPage();
  setMessage('Changes discarded.');
}

async function handleSubmit() {
  try {
    isSubmitting.value = true;
    setMessage('');
    if (!form.title.trim()) {
      setMessage('Title is required.', 'error');
      return;
    }
    const contentJson = serializeContentDocument(sections.value);
    if (isEdit.value) {
      await StructurePageService.update(editSlug.value, {
        title: form.title,
        thumbnail: form.thumbnail || null,
        excerpt: form.excerpt || null,
        content: contentJson,
        order_no: form.order_no,
        status: form.status,
      });
      captureSnapshot();
      setMessage('Structure page saved.');
    } else {
      const slug = (form.slug || '').trim().toLowerCase();
      if (!slug) {
        setMessage('Slug is required.', 'error');
        return;
      }
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        setMessage('Slug may contain lowercase letters, numbers, and hyphens only.', 'error');
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
      setMessage('Structure page created.');
      router.push({ name: 'adminStructurePages' });
    }
  } catch (error) {
    console.error('Error saving structure page:', error);
    const detail = error?.response?.data?.detail;
    setMessage(
      typeof detail === 'string' ? detail : 'Failed to save. Check console / auth token.',
      'error'
    );
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(loadPage);
</script>
