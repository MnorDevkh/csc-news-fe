<template>
  <div class="min-h-[calc(100vh-4rem)] bg-[#f8f9ff]">
    <div class="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-10">
        <div class="min-w-0">
          <h2 class="text-3xl font-bold tracking-tight text-[#0b1c30]">
            {{ isEditMode ? 'Edit Article' : 'Create Article' }}
          </h2>
          <p class="text-sm text-[#45464d] mt-1">
            {{ isEditMode ? 'Update your article content and publishing settings.' : 'Write and publish a new article.'
            }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="$router.push({ name: 'adminNews' })" type="button"
            class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-[#45464d] hover:text-[#0b1c30] bg-white hover:bg-[#eff4ff] border border-[#c6c6cd] rounded transition-colors">
            Cancel
          </button>
        </div>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-12 items-start">

          <!-- ─── Main editor column ─── -->
          <section class="max-w-[1020px] w-full mx-auto xl:mx-0">

            <!-- Title -->
            <div class="mb-10">
              <input v-model="form.title" type="text" required placeholder="Enter article title..."
                class="w-full bg-transparent border-0 border-b border-[#c6c6cd] focus:border-[#3755c3] pb-3 text-4xl font-bold tracking-tight text-[#0b1c30] placeholder:text-[#c6c6cd] focus:ring-0 outline-none transition-colors" />
            </div>

            <!-- Excerpt -->
            <div class="mb-8">
              <label class="block text-xs font-semibold text-[#45464d] uppercase tracking-wider mb-2">Excerpt</label>
              <textarea v-model="form.excerpt" rows="2" placeholder="Brief summary used in listings..."
                class="w-full px-4 py-3 border border-[#c6c6cd] bg-white rounded focus:ring-0 focus:border-[#3755c3] outline-none text-sm text-[#0b1c30] transition-colors resize-none"></textarea>
            </div>



            <!-- Sticky toolbar -->
            <div class="sticky top-4 z-10 -mx-4 sm:-mx-6 lg:mx-0 mb-4">
              <div
                class="bg-[#f8f9ff]/95 backdrop-blur border-y border-[#c6c6cd] lg:border lg:rounded px-4 sm:px-6 lg:px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                <div class="flex flex-wrap items-center gap-1.5">
                  <span class="text-xs font-semibold text-[#76777d] uppercase tracking-wider mr-1">Add block:</span>
                  <button type="button"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#131b2e] hover:bg-[#0b1c30] text-white transition-colors"
                    @click="addContentBlock">&#9776; Text</button>
                  <button type="button"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#dde1ff] hover:bg-[#b8c4ff] text-[#173bab] border border-[#b8c4ff] transition-colors"
                    @click="openContentImageModal">&#128247; Image</button>
                  <button type="button"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#e5eeff] hover:bg-[#dde1ff] text-[#3755c3] border border-[#b8c4ff] transition-colors"
                    @click="addMixedBlock">&#9638; Columns</button>
                </div>
                <div class="text-xs text-[#76777d]">{{ contentBlocks.length }} block{{ contentBlocks.length !== 1 ? 's'
                  : '' }}</div>
              </div>
            </div>

            <!-- Content blocks -->
            <div>
              <div class="space-y-0">

                <!-- Inline inserter before first block -->
                <div class="group relative flex items-center justify-center h-6 mb-1">
                  <div
                    class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-[#e5eeff] opacity-0 group-hover:opacity-100 transition-opacity">
                  </div>
                  <div class="relative flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" title="Insert text" @click="insertBlock(0, 'text')"
                      class="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-[#c6c6cd] text-[#3755c3] hover:bg-[#3755c3] hover:text-white hover:border-[#3755c3] text-xs font-bold transition-all shadow-sm">+</button>
                    <button type="button" title="Insert image" @click="insertImageBlock(0)"
                      class="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-[#c6c6cd] text-[#76777d] hover:bg-[#dde1ff] hover:border-[#b8c4ff] hover:text-[#173bab] text-xs transition-all shadow-sm">&#128247;</button>
                    <button type="button" title="Insert columns" @click="insertBlock(0, 'mixed')"
                      class="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-[#c6c6cd] text-[#76777d] hover:bg-[#e5eeff] hover:border-[#b8c4ff] hover:text-[#3755c3] text-xs transition-all shadow-sm">&#9638;</button>
                  </div>
                </div>

                <template v-for="(block, index) in contentBlocks" :key="block.id">
                  <!-- Block card -->
                  <div
                    class="group/block relative rounded border border-transparent hover:border-[#c6c6cd] bg-white transition-all">

                    <!-- Block type label + controls -->
                    <div
                      class="flex items-center justify-between gap-3 px-3 py-1.5 opacity-0 group-hover/block:opacity-100 transition-opacity">
                      <span class="text-[10px] font-semibold text-[#76777d] uppercase tracking-widest">
                        {{ block.type === 'text' ? 'Text' : block.type === 'image' ? 'Image' : 'Columns' }}
                      </span>
                      <div class="flex items-center gap-2">
                        <!-- Column layout picker for mixed blocks -->
                        <template v-if="block.type === 'mixed'">
                          <div class="flex items-center gap-0.5">
                            <button type="button" @click="block.layout = '1/2'"
                              :class="block.layout === '1/2' ? 'bg-[#131b2e] text-white' : 'bg-[#f8f9ff] text-[#45464d] border border-[#c6c6cd] hover:bg-[#eff4ff]'"
                              class="px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors">1:1</button>
                            <button type="button" @click="block.layout = '3/4'"
                              :class="block.layout === '3/4' ? 'bg-[#131b2e] text-white' : 'bg-[#f8f9ff] text-[#45464d] border border-[#c6c6cd] hover:bg-[#eff4ff]'"
                              class="px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors">3:1</button>
                            <button type="button" @click="block.layout = '1/4'"
                              :class="block.layout === '1/4' ? 'bg-[#131b2e] text-white' : 'bg-[#f8f9ff] text-[#45464d] border border-[#c6c6cd] hover:bg-[#eff4ff]'"
                              class="px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors">1:3</button>
                          </div>
                        </template>
                        <!-- Move up / down -->
                        <button type="button" :disabled="index === 0" @click="moveBlock(index, -1)"
                          class="text-[#76777d] hover:text-[#0b1c30] disabled:opacity-30 text-xs transition-colors"
                          title="Move up">&#8593;</button>
                        <button type="button" :disabled="index === contentBlocks.length - 1"
                          @click="moveBlock(index, 1)"
                          class="text-[#76777d] hover:text-[#0b1c30] disabled:opacity-30 text-xs transition-colors"
                          title="Move down">&#8595;</button>
                        <button type="button" @click="removeBlock(index)"
                          class="text-xs font-semibold text-[#ba1a1a] hover:text-[#93000a] transition-colors"
                          title="Remove">&#10005;</button>
                      </div>
                    </div>

                    <!-- Text block -->
                    <template v-if="block.type === 'text'">
                      <div
                        class="[&_.ck-editor__top]:border-b [&_.ck-editor__top]:border-[#e5eeff] [&_.ck-toolbar]:bg-[#f8f9ff] [&_.ck-editor__editable]:min-h-[180px] [&_.ck-editor__editable]:border-0 [&_.ck-editor__editable]:shadow-none [&_.ck.ck-editor]:border-0 [&_.ck.ck-editor]:shadow-none">
                        <ckeditor :editor="editor" v-model="block.html" :config="editorConfig" />
                      </div>
                    </template>

                    <!-- Image block -->
                    <template v-else-if="block.type === 'image'">
                      <div class="flex flex-wrap p-3 gap-2">
                        <div v-for="(img, imgIdx) in block.images" :key="img.key || imgIdx"
                          class="relative group/img rounded overflow-hidden">
                          <img :src="img.url" :alt="img.filename || 'Image'" class="w-36 h-28 object-cover" />
                          <button type="button" @click="removeImageFromBlock(index, imgIdx)"
                            class="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">&#10005;</button>
                        </div>
                        <button type="button" @click="openAddMoreImages(index)"
                          class="w-36 h-28 rounded border-2 border-dashed border-[#c6c6cd] bg-[#f8f9ff] hover:border-[#3755c3] hover:bg-[#eff4ff] flex flex-col items-center justify-center gap-1 text-[#76777d] hover:text-[#3755c3] transition-all">
                          <PictureOutlined class="text-xl" />
                          <span class="text-xs">Add more</span>
                        </button>
                      </div>
                    </template>

                    <!-- Mixed/Columns block -->
                    <template v-else-if="block.type === 'mixed'">
                      <div class="grid min-h-[220px] border-t border-[#e5eeff]"
                        :style="block.layout === '3/4' ? 'grid-template-columns: 3fr 1fr' : block.layout === '1/4' ? 'grid-template-columns: 1fr 3fr' : 'grid-template-columns: 1fr 1fr'">
                        <!-- Image column -->
                        <div
                          class="relative min-w-0 overflow-hidden bg-[#f8f9ff] border-r border-[#e5eeff] flex items-center justify-center cursor-pointer group/imgcol"
                          @click="openMixedImagePicker(index)">
                          <img v-if="block.image" :src="block.image.url" alt=""
                            class="w-full h-full object-cover absolute inset-0" />
                          <div v-if="!block.image"
                            class="flex flex-col items-center gap-2 text-[#76777d] group-hover/imgcol:text-[#3755c3] transition-colors z-10">
                            <PictureOutlined class="text-3xl" />
                            <span class="text-xs font-medium">Click to add image</span>
                          </div>
                          <div v-else
                            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover/imgcol:opacity-100 transition-opacity bg-black/20 z-10">
                            <span
                              class="bg-white/90 text-xs font-bold px-3 py-1 rounded border border-[#c6c6cd]">Replace</span>
                          </div>
                        </div>
                        <!-- Text column -->
                        <div
                          class="min-w-0 [&_.ck.ck-editor]:h-full [&_.ck-editor__editable]:min-h-[220px] [&_.ck-editor__editable]:border-0 [&_.ck-editor__editable]:shadow-none [&_.ck.ck-editor]:border-0 [&_.ck.ck-editor]:shadow-none [&_.ck-editor__top]:border-b [&_.ck-editor__top]:border-[#e5eeff] [&_.ck-toolbar]:bg-[#f8f9ff]">
                          <ckeditor :editor="editor" v-model="block.html" :config="editorConfig" />
                        </div>
                      </div>
                    </template>
                  </div>

                  <!-- Inline inserter AFTER each block -->
                  <div class="group relative flex items-center justify-center h-6 my-1">
                    <div
                      class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-[#e5eeff] opacity-0 group-hover:opacity-100 transition-opacity">
                    </div>
                    <div class="relative flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" title="Insert text" @click="insertBlock(index + 1, 'text')"
                        class="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-[#c6c6cd] text-[#3755c3] hover:bg-[#3755c3] hover:text-white hover:border-[#3755c3] text-xs font-bold transition-all shadow-sm">+</button>
                      <button type="button" title="Insert image" @click="insertImageBlock(index + 1)"
                        class="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-[#c6c6cd] text-[#76777d] hover:bg-[#dde1ff] hover:border-[#b8c4ff] hover:text-[#173bab] text-xs transition-all shadow-sm">&#128247;</button>
                      <button type="button" title="Insert columns" @click="insertBlock(index + 1, 'mixed')"
                        class="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-[#c6c6cd] text-[#76777d] hover:bg-[#e5eeff] hover:border-[#b8c4ff] hover:text-[#3755c3] text-xs transition-all shadow-sm">&#9638;</button>
                    </div>
                  </div>
                </template>

                <!-- Empty state -->
                <div v-if="!contentBlocks.length"
                  class="rounded border-2 border-dashed border-[#c6c6cd] bg-[#f8f9ff] px-6 py-14 text-center">
                  <div class="text-2xl mb-2">&#9776;</div>
                  <div class="text-sm font-semibold text-[#0b1c30] mb-1">Start writing</div>
                  <div class="text-sm text-[#45464d] mb-5">Add your first block using the toolbar above.</div>
                  <div class="flex flex-wrap items-center justify-center gap-2">
                    <button type="button"
                      class="inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-medium bg-[#131b2e] text-white hover:bg-[#0b1c30] transition-colors"
                      @click="addContentBlock">&#9776; Add text</button>
                    <button type="button"
                      class="inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-medium bg-white text-[#0b1c30] hover:bg-[#eff4ff] border border-[#c6c6cd] transition-colors"
                      @click="openContentImageModal">&#128247; Add image</button>
                    <button type="button"
                      class="inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-medium bg-[#e5eeff] text-[#3755c3] hover:bg-[#dde1ff] border border-[#b8c4ff] transition-colors"
                      @click="addMixedBlock">&#9638; Columns</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- ─── Sidebar ─── -->
          <aside class="space-y-6">

            <!-- Status & Scheduling -->
            <div class="bg-white rounded border border-[#c6c6cd] shadow-sm p-6">
              <h3 class="text-xs font-semibold uppercase tracking-wider text-[#45464d] mb-5">Status &amp; Scheduling
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-[#45464d] uppercase tracking-wider mb-2">Status</label>
                  <select v-model="form.status" @change="onStatusChange"
                    class="w-full px-4 py-2.5 border border-[#c6c6cd] bg-[#f8f9ff] rounded focus:ring-0 focus:border-[#3755c3] outline-none text-sm text-[#0b1c30] transition-colors cursor-pointer">
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="public">Public</option>
                  </select>
                  <p class="mt-1.5 text-xs text-[#76777d]">
                    <template v-if="form.status === 'draft'">Hidden from the site.</template>
                    <template v-else-if="form.status === 'scheduled'">Will appear when publish time arrives.</template>
                    <template v-else>Visible on the site now.</template>
                  </p>
                </div>

                <div v-if="form.status === 'scheduled'">
                  <label class="block text-xs font-semibold text-[#45464d] uppercase tracking-wider mb-2">Publish
                    at</label>
                  <input v-model="publishAtLocal" type="datetime-local" :required="form.status === 'scheduled'"
                    class="w-full px-4 py-2.5 border border-[#c6c6cd] bg-[#f8f9ff] rounded focus:ring-0 focus:border-[#3755c3] outline-none text-sm text-[#0b1c30] transition-colors" />
                  <p class="mt-1.5 text-xs text-[#76777d]">Required. The article goes live at this time.</p>
                </div>

                <label class="flex items-center gap-2.5 cursor-pointer pt-1">
                  <input type="checkbox" v-model="form.is_featured"
                    class="w-4 h-4 rounded border-[#c6c6cd] text-[#3755c3] focus:ring-[#3755c3]/20" />
                  <span class="text-sm text-[#0b1c30]">Featured article</span>
                </label>

                <div class="pt-3 border-t border-[#e5eeff]">
                  <button type="submit" :disabled="isSubmitting"
                    class="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#131b2e] hover:bg-[#0b1c30] text-white text-sm font-semibold rounded shadow-sm transition-colors disabled:opacity-60">
                    <span v-if="isSubmitting"
                      class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    {{ isEditMode ? 'Update Article' : 'Publish Article' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Thumbnail -->
            <div class="bg-white rounded border border-[#c6c6cd] shadow-sm p-6">
              <div class="flex items-center justify-between gap-3 mb-4">
                <h3 class="text-xs font-semibold uppercase tracking-wider text-[#45464d]">Featured Image</h3>
                <button v-if="thumbnailUrl" type="button"
                  class="text-xs font-semibold text-[#ba1a1a] hover:text-[#93000a] transition-colors"
                  @click="removeThumbnail">
                  Remove
                </button>
              </div>
              <button type="button" class="w-full rounded border-2 border-dashed overflow-hidden transition-all group"
                :class="thumbnailUrl ? 'border-[#c6c6cd]' : 'border-[#c6c6cd] hover:border-[#3755c3] hover:bg-[#eff4ff]'"
                @click="openThumbnailModal">
                <div v-if="thumbnailUrl" class="aspect-video w-full relative">
                  <img :src="thumbnailUrl" alt="Thumbnail"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div
                    class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <span
                      class="bg-white/90 backdrop-blur px-3 py-1.5 text-xs font-bold border border-[#c6c6cd] rounded shadow-sm">Replace
                      Image</span>
                  </div>
                </div>
                <div v-else
                  class="flex flex-col items-center justify-center gap-2 py-10 text-[#76777d] group-hover:text-[#3755c3] transition-colors">
                  <PictureOutlined class="text-4xl" />
                  <span class="text-sm">Click to select thumbnail</span>
                </div>
              </button>
            </div>

            <!-- Categories -->
            <div class="bg-white rounded border border-[#c6c6cd] shadow-sm overflow-hidden">
              <div class="p-5 border-b border-[#e5eeff]">
                <div class="flex items-end justify-between gap-3">
                  <h3 class="text-xs font-semibold uppercase tracking-wider text-[#45464d]">Categories</h3>
                  <span class="text-xs text-[#3755c3] font-semibold">{{ form.category_ids.length }} selected</span>
                </div>
                <div class="mt-3">
                  <input v-model="categoryFilter" type="text" placeholder="Search categories..."
                    class="w-full px-3 py-2.5 border border-[#c6c6cd] bg-[#f8f9ff] rounded focus:ring-0 focus:border-[#3755c3] outline-none text-sm text-[#0b1c30] transition-colors" />
                </div>
              </div>

              <div class="max-h-64 overflow-y-auto p-2">
                <label v-for="cat in filteredCategories" :key="cat.id"
                  class="group flex items-center gap-3 px-3 py-2 rounded hover:bg-[#eff4ff] cursor-pointer select-none transition-colors">
                  <input type="checkbox" :value="cat.id" v-model="form.category_ids"
                    class="w-4 h-4 rounded border-[#c6c6cd] text-[#3755c3] focus:ring-[#3755c3]/20" />
                  <span class="text-sm text-[#0b1c30] truncate">{{ cat.name }}</span>
                </label>
                <div v-if="!filteredCategories.length" class="text-sm text-[#76777d] px-3 py-6 text-center">
                  No categories found.
                </div>
              </div>

              <div class="p-4 border-t border-[#e5eeff] bg-[#eff4ff]/50 flex items-center justify-between gap-3">
                <button type="button"
                  class="text-xs font-semibold text-[#45464d] hover:text-[#0b1c30] transition-colors"
                  @click="form.category_ids = []">
                  Clear all
                </button>
                <div v-if="form.category_ids.length" class="text-xs text-[#3755c3] font-medium truncate">
                  {{ selectedCategoryNames }}
                </div>
                <div v-else class="text-xs text-[#76777d]">
                  Pick one or more.
                </div>
              </div>
            </div>

          </aside>
        </div>

        <!-- Modals -->
        <ImageSelectModal v-model:open="thumbnailModalOpen" mode="single" title="Select thumbnail image"
          confirm-label="Select" @confirm="onThumbnailSelected" />
        <ImageSelectModal v-model:open="contentImageModalOpen" mode="multiple" title="Select image(s) for content"
          confirm-label="Add to article" @confirm="onContentImagesSelected" />
        <ImageSelectModal v-model:open="mixedImageModalOpen" mode="single" title="Select image for column"
          confirm-label="Use image" @confirm="onMixedImageSelected" />
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NewsService } from '@/services/NewsService';
import { CategoryService } from '@/services/CategoryService';
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold, Italic, Underline, Strikethrough, Code, Subscript, Superscript,
  Link, AutoLink,
  List, ListProperties, TodoList,
  Heading,
  BlockQuote,
  Table, TableToolbar, TableCaption, TableColumnResize, TableCellProperties, TableProperties,
  Font,
  Alignment,
  Indent, IndentBlock,
  HorizontalLine,
  CodeBlock,
  FindAndReplace,
  RemoveFormat,
  SpecialCharacters, SpecialCharactersEssentials,
  Highlight,
  GeneralHtmlSupport,
  SourceEditing,
  PasteFromOffice,
} from 'ckeditor5';
import ImageSelectModal from '@/components/ImageSelectModal.vue';
import { PictureOutlined } from '@ant-design/icons-vue';

const editor = ClassicEditor;
const editorConfig = {
  licenseKey: 'GPL',
  plugins: [
    Essentials, Paragraph,
    Bold, Italic, Underline, Strikethrough, Code, Subscript, Superscript,
    Link, AutoLink,
    List, ListProperties, TodoList,
    Heading,
    BlockQuote,
    Table, TableToolbar, TableCaption, TableColumnResize, TableCellProperties, TableProperties,
    Font,
    Alignment,
    Indent, IndentBlock,
    HorizontalLine,
    CodeBlock,
    FindAndReplace,
    RemoveFormat,
    SpecialCharacters, SpecialCharactersEssentials,
    Highlight,
    GeneralHtmlSupport,
    SourceEditing,
    PasteFromOffice,
  ],
  toolbar: {
    items: [
      'heading', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'subscript', 'superscript', 'code', '|',
      'removeFormat', '|',
      'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor', 'highlight', '|',
      'alignment', '|',
      'link', '|',
      'bulletedList', 'numberedList', 'todoList', '|',
      'outdent', 'indent', '|',
      'blockQuote', 'horizontalLine', '|',
      'insertTable', '|',
      'codeBlock', '|',
      'specialCharacters', '|',
      'findAndReplace', '|',
      'sourceEditing', '|',
      'undo', 'redo',
    ],
    shouldNotGroupWhenFull: false,
  },
  table: {
    contentToolbar: [
      'tableColumn', 'tableRow', 'mergeTableCells',
      'tableProperties', 'tableCellProperties',
    ],
  },
  list: {
    properties: {
      styles: true,
      startIndex: true,
      reversed: true,
    },
  },
  alignment: {
    options: ['left', 'center', 'right', 'justify'],
  },
  htmlSupport: {
    allow: [
      { name: /.*/, attributes: true, classes: true, styles: true },
    ],
  },
};

const route = useRoute();
const router = useRouter();

const isEditMode = computed(() => !!route.params.id);
const isSubmitting = ref(false);
const categories = ref([]);
const categoryFilter = ref('');
const filteredCategories = computed(() => {
  const q = (categoryFilter.value || '').trim().toLowerCase();
  const list = Array.isArray(categories.value) ? categories.value : [];
  if (!q) return list;
  return list.filter((c) => (c?.name || '').toLowerCase().includes(q));
});
const selectedCategoryNames = computed(() => {
  const list = Array.isArray(categories.value) ? categories.value : [];
  const selected = new Set(Array.isArray(form.category_ids) ? form.category_ids : []);
  const names = list.filter((c) => selected.has(c.id)).map((c) => c.name).filter(Boolean);
  return names.slice(0, 3).join(', ') + (names.length > 3 ? ` +${names.length - 3} more` : '');
});

// Thumbnail picker state
const thumbnailModalOpen = ref(false);
const thumbnailUrl = ref('');
const thumbnailKey = ref('');

const form = reactive({
  title: '',
  category_ids: [],
  thumbnail: '',
  excerpt: '',
  content: '',
  is_featured: true,
  status: 'public'
});

const publishAtLocal = ref('');

// Block-based content (internal UI model): list of { id, type: 'text'|'image'|'mixed', html?, images?: [{ url, key }], ... }
const contentBlocks = ref([]);
const contentImageModalOpen = ref(false);
const mixedImageModalOpen = ref(false);
const mixedImageTargetIndex = ref(-1);
let nextBlockId = 0;
function nextId() {
  return `block-${++nextBlockId}-${Date.now()}`;
}

function parseContentToBlocks(contentStr) {
  if (!contentStr || !contentStr.trim()) return [];
  const s = contentStr.trim();
  if (s.startsWith('[') && s.endsWith(']')) {
    try {
      const arr = JSON.parse(contentStr);
      if (!Array.isArray(arr)) return [{ id: nextId(), type: 'text', html: contentStr }];
      return arr.map((b) => {
        if (b.type === 'text') return { id: nextId(), type: 'text', html: b.html != null ? String(b.html) : '' };
        if (b.type === 'image') {
          // Accept both legacy { images: [{url}] } and new { url: "..." }
          if (typeof b.url === 'string') {
            return { id: nextId(), type: 'image', images: [{ url: b.url, key: b.key || '' }] };
          }
          if (Array.isArray(b.images)) {
            return { id: nextId(), type: 'image', images: b.images.map((img) => ({ url: img.url || '', key: img.key || '' })) };
          }
          return { id: nextId(), type: 'image', images: [] };
        }
        if (b.type === 'gallery') {
          // New: { type: 'gallery', urls: [...] } (also accept legacy images array)
          if (Array.isArray(b.urls)) {
            return { id: nextId(), type: 'image', images: b.urls.filter((u) => typeof u === 'string').map((u) => ({ url: u, key: '' })) };
          }
          if (Array.isArray(b.images)) {
            return { id: nextId(), type: 'image', images: b.images.map((img) => ({ url: img.url || '', key: img.key || '' })) };
          }
          return { id: nextId(), type: 'image', images: [] };
        }
        if (b.type === 'mixed') {
          return { id: nextId(), type: 'mixed', layout: b.layout || '1/2', image: b.image || null, html: b.html || '' };
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
    if (b.type === 'mixed') return { type: 'mixed', layout: b.layout || '1/2', image: b.image || null, html: b.html || '' };
    const imgs = Array.isArray(b.images) ? b.images.filter((img) => img && typeof img.url === 'string' && img.url) : [];
    if (imgs.length <= 1) {
      return { type: 'image', url: imgs[0]?.url || '' };
    }
    return { type: 'gallery', urls: imgs.map((img) => img.url) };
  });
}

function addContentBlock() {
  contentBlocks.value.push({ id: nextId(), type: 'text', html: '' });
}

function addMixedBlock() {
  contentBlocks.value.push({ id: nextId(), type: 'mixed', layout: '1/2', image: null, html: '' });
}

// Insert a block at a specific position
function insertBlock(atIndex, type) {
  const block = type === 'mixed'
    ? { id: nextId(), type: 'mixed', layout: '1/2', image: null, html: '' }
    : { id: nextId(), type: 'text', html: '' };
  contentBlocks.value.splice(atIndex, 0, block);
}

// Open image modal then insert image block at position
const pendingImageInsertIndex = ref(-1);
function insertImageBlock(atIndex) {
  pendingImageInsertIndex.value = atIndex;
  contentImageModalOpen.value = true;
}

// Move block up (-1) or down (+1)
function moveBlock(index, dir) {
  const arr = contentBlocks.value;
  const target = index + dir;
  if (target < 0 || target >= arr.length) return;
  [arr[index], arr[target]] = [arr[target], arr[index]];
}

function removeBlock(index) {
  contentBlocks.value.splice(index, 1);
}

// Remove a single image from an image block
function removeImageFromBlock(blockIndex, imgIndex) {
  const block = contentBlocks.value[blockIndex];
  if (block?.images) {
    block.images.splice(imgIndex, 1);
    if (!block.images.length) contentBlocks.value.splice(blockIndex, 1);
  }
}

// Track which image block to append more images to
const addMoreImagesTargetIndex = ref(-1);
function openAddMoreImages(blockIndex) {
  addMoreImagesTargetIndex.value = blockIndex;
  contentImageModalOpen.value = true;
}

function openContentImageModal() {
  pendingImageInsertIndex.value = -1;
  addMoreImagesTargetIndex.value = -1;
  contentImageModalOpen.value = true;
}

function openMixedImagePicker(index) {
  mixedImageTargetIndex.value = index;
  mixedImageModalOpen.value = true;
}

function onMixedImageSelected(items) {
  const item = items && items[0];
  const idx = mixedImageTargetIndex.value;
  if (item && idx >= 0 && contentBlocks.value[idx]) {
    contentBlocks.value[idx].image = { url: item.url, key: item.key || '' };
  }
  mixedImageTargetIndex.value = -1;
}

function onContentImagesSelected(items) {
  if (!items || !items.length) return;
  const images = items.map((item) => ({ url: item.url, key: item.key || '' }));

  // Append to existing image block
  const appendIdx = addMoreImagesTargetIndex.value;
  if (appendIdx >= 0 && contentBlocks.value[appendIdx]?.type === 'image') {
    contentBlocks.value[appendIdx].images.push(...images);
    addMoreImagesTargetIndex.value = -1;
    return;
  }
  addMoreImagesTargetIndex.value = -1;

  // Insert at a specific position from inline inserter
  const insertIdx = pendingImageInsertIndex.value;
  if (insertIdx >= 0) {
    contentBlocks.value.splice(insertIdx, 0, { id: nextId(), type: 'image', images });
    pendingImageInsertIndex.value = -1;
    return;
  }
  pendingImageInsertIndex.value = -1;

  // Default: push to end
  contentBlocks.value.push({ id: nextId(), type: 'image', images });
}

const nowLocalString = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

const onStatusChange = () => {
  if (form.status === 'draft') {
    publishAtLocal.value = '';
  }
  if (form.status === 'scheduled' && !publishAtLocal.value) {
    publishAtLocal.value = nowLocalString();
  }
};

const toLocalInput = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const toIsoWithOffset = (localString) => {
  if (!localString) return null;
  // localString is like '2026-03-11T10:07'
  const d = new Date(localString);
  return d.toISOString();
};

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
  try {
    // Fetch categories for dropdown
    const cats = await CategoryService.getAllCategories();
    categories.value = cats;

    // If edit mode, fetch article details
    if (isEditMode.value) {
      const article = await NewsService.getArticleById(route.params.id);
      const categoryIds =
        Array.isArray(article?.categories) && article.categories.length
          ? article.categories.map((c) => c.id).filter(Boolean)
          : article?.category_id
            ? [article.category_id]
            : [];
      Object.assign(form, {
        title: article.title,
        category_ids: categoryIds,
        thumbnail: article.thumbnail,
        excerpt: article.excerpt,
        content: article.content,
        is_featured: article.is_featured,
        status: article.status
      });

      if (article.thumbnail) {
        thumbnailUrl.value = article.thumbnail;
      }

      if (article.publish_at) {
        publishAtLocal.value = toLocalInput(article.publish_at);
      }

      contentBlocks.value = parseContentToBlocks(article.content || '');
    } else {
      // Create mode: start with one empty text block
      contentBlocks.value = [{ id: nextId(), type: 'text', html: '' }];
    }
  } catch (error) {
    console.error("Error loading data:", error);
    alert("Failed to load data. Please check console.");
  }
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    form.content = JSON.stringify(serializeBlocks());
    const payload = {
      ...form,
      category_ids: Array.isArray(form.category_ids) ? form.category_ids : [],
      publish_at: publishAtLocal.value ? toIsoWithOffset(publishAtLocal.value) : undefined,
    };

    if (isEditMode.value) {
      await NewsService.updateArticle(route.params.id, payload);
      alert('Article updated successfully!');
    } else {
      await NewsService.createArticle(payload);
      alert('Article created successfully!');
    }
    router.push({ name: 'adminNews' });
  } catch (error) {
    console.error("Error saving article:", error);
    alert("Failed to save article. Please check console.");
  } finally {
    isSubmitting.value = false;
  }
};

</script>

<style scoped>
/* ─── CKEditor: frameless until focused ────────────────────────────── */

/* Remove all outer borders & shadows from the CK root */
:deep(.ck.ck-editor) {
  border: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
}

/* Hide the toolbar by default */
:deep(.ck-editor__top) {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.18s ease, opacity 0.15s ease;
  pointer-events: none;
}

/* Show toolbar + focus ring when editor is active */
:deep(.ck-editor:has(.ck-focused) .ck-editor__top) {
  max-height: 500px;
  opacity: 1;
  pointer-events: auto;
  overflow: visible;
}

/* Subtle blue outline on the editable area when focused */
:deep(.ck-editor__editable.ck-focused) {
  outline: 2px solid #3755c3 !important;
  outline-offset: -2px;
  box-shadow: none !important;
}

/* Remove default CK focus border (we replace with outline above) */
:deep(.ck-editor__editable:focus) {
  border: none !important;
  box-shadow: none !important;
}
</style>
