<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PaperClipOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { useAuth } from '@/composables/useAuth';
import { CommentService } from '@/services/CommentService.js';
import { uploadFile } from '@/services/FileService.js';
import CommentItem from './CommentItem.vue';

const props = defineProps({
  articleId: {
    type: String,
    required: true,
  },
  maxDepth: {
    type: Number,
    default: 5,
  },
});

const router = useRouter();
const route = useRoute();
const { isAuthenticated, user } = useAuth();

const comments = ref([]);
const total = ref(0);
const isLoading = ref(true);
const hasError = ref(false);
const isSubmitting = ref(false);
const submitError = ref('');

const body = ref('');
const pendingFiles = ref([]);
const fileInputRef = ref(null);

const canAttachMore = computed(() => pendingFiles.value.length < 5);

async function loadComments() {
  isLoading.value = true;
  hasError.value = false;
  try {
    const data = await CommentService.getComments(props.articleId);
    comments.value = data.items || [];
    total.value = data.total ?? comments.value.length;
  } catch (err) {
    console.error('Failed to load comments:', err);
    hasError.value = true;
    comments.value = [];
    total.value = 0;
  } finally {
    isLoading.value = false;
  }
}

function goToLogin() {
  router.push({ name: 'login', query: { redirect: route.fullPath } });
}

function openFilePicker() {
  fileInputRef.value?.click();
}

async function onFilesSelected(event) {
  const files = Array.from(event.target.files || []);
  event.target.value = '';
  if (!files.length) return;

  const remaining = 5 - pendingFiles.value.length;
  const toUpload = files.slice(0, remaining);

  for (const file of toUpload) {
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isImage && !isPdf) {
      submitError.value = 'Only images and PDF files are allowed.';
      continue;
    }

    const entry = {
      id: `pending-${Date.now()}-${Math.random()}`,
      name: file.name,
      previewUrl: isImage ? URL.createObjectURL(file) : null,
      type: isPdf ? 'pdf' : 'photo',
      uploading: true,
      fileId: null,
      error: null,
    };
    pendingFiles.value.push(entry);

    try {
      const uploaded = await uploadFile(file);
      entry.fileId = uploaded.id;
      entry.uploading = false;
    } catch (err) {
      entry.uploading = false;
      entry.error = err.response?.data?.detail || 'Upload failed';
    }
  }
}

function removePendingFile(entry) {
  if (entry.previewUrl) URL.revokeObjectURL(entry.previewUrl);
  pendingFiles.value = pendingFiles.value.filter((f) => f.id !== entry.id);
}

async function submitComment() {
  submitError.value = '';
  const text = body.value.trim();
  if (!text) {
    submitError.value = 'Please enter a comment.';
    return;
  }

  const uploading = pendingFiles.value.some((f) => f.uploading);
  if (uploading) {
    submitError.value = 'Please wait for uploads to finish.';
    return;
  }

  const failed = pendingFiles.value.filter((f) => f.error);
  if (failed.length) {
    submitError.value = 'Remove failed uploads before submitting.';
    return;
  }

  isSubmitting.value = true;
  try {
    const attachmentIds = pendingFiles.value
      .filter((f) => f.fileId)
      .map((f) => f.fileId);

    await CommentService.createComment(props.articleId, {
      body: text,
      attachment_ids: attachmentIds,
    });

    body.value = '';
    pendingFiles.value.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    pendingFiles.value = [];
    await loadComments();
  } catch (err) {
    const detail = err.response?.data?.detail;
    submitError.value =
      typeof detail === 'string' ? detail : err.message || 'Failed to post comment';
  } finally {
    isSubmitting.value = false;
  }
}

async function onReplySubmitted() {
  await loadComments();
}

async function onCommentDeleted() {
  await loadComments();
}

loadComments();
</script>

<template>
  <section class="mt-12 pt-10 border-t border-gray-100">
    <h2 class="text-lg font-bold text-[#1a365d] mb-6">
      Comments
      <span v-if="total" class="text-sm font-normal text-gray-400 ml-2">({{ total }})</span>
    </h2>

    <div v-if="isLoading" class="space-y-4 animate-pulse">
      <div v-for="i in 2" :key="i" class="h-20 bg-gray-100 rounded-md" />
    </div>

    <div v-else-if="hasError" class="text-sm text-red-600 mb-6">
      Could not load comments. Please refresh the page.
    </div>

    <template v-else>
      <div v-if="!isAuthenticated" class="mb-8 p-4 rounded-md bg-gray-50 border border-gray-100">
        <p class="text-sm text-gray-600 m-0">
          <button type="button" class="text-[#1a365d] font-medium hover:underline" @click="goToLogin">
            Sign in
          </button>
          to leave a comment.
        </p>
      </div>

      <div v-else class="mb-8">
        <textarea
          v-model="body"
          placeholder="Write a comment..."
          rows="3"
          class="w-full p-3 border border-gray-200 rounded-md text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#1a365d]/20 focus:border-[#1a365d]/40"
        />

        <div v-if="pendingFiles.length" class="mt-3 flex flex-wrap gap-3">
          <div
            v-for="file in pendingFiles"
            :key="file.id"
            class="relative flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-100 rounded-md text-sm"
          >
            <img
              v-if="file.previewUrl"
              :src="file.previewUrl"
              :alt="file.name"
              class="w-10 h-10 object-cover rounded"
            />
            <span v-else class="text-xs font-medium text-[#1a365d]">PDF</span>
            <span class="text-gray-600 max-w-[140px] truncate">{{ file.name }}</span>
            <span v-if="file.uploading" class="text-xs text-gray-400">Uploading...</span>
            <span v-else-if="file.error" class="text-xs text-red-500">{{ file.error }}</span>
            <button
              type="button"
              class="text-gray-400 hover:text-red-500"
              @click="removePendingFile(file)"
            >
              <DeleteOutlined />
            </button>
          </div>
        </div>

        <div class="mt-3 flex flex-wrap items-center gap-3">
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*,.pdf,application/pdf"
            multiple
            class="hidden"
            @change="onFilesSelected"
          />
          <button
            v-if="canAttachMore"
            type="button"
            class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a365d] transition-colors"
            @click="openFilePicker"
          >
            <PaperClipOutlined /> Attach file
          </button>
          <button
            type="button"
            :disabled="isSubmitting"
            class="ml-auto px-4 py-2 bg-[#1a365d] text-white text-sm font-medium rounded-md hover:bg-[#152a4a] disabled:opacity-50 transition-colors"
            @click="submitComment"
          >
            {{ isSubmitting ? 'Posting...' : 'Post comment' }}
          </button>
        </div>

        <p v-if="submitError" class="mt-2 text-sm text-red-600 m-0">{{ submitError }}</p>
      </div>

      <div v-if="!comments.length && !isLoading" class="text-sm text-gray-400 py-4">
        No comments yet. Be the first to share your thoughts.
      </div>

      <div v-else class="space-y-2">
        <CommentItem
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          :article-id="articleId"
          :max-depth="maxDepth"
          :depth="0"
          :current-user-id="user?.id"
          @reply-submitted="onReplySubmitted"
          @comment-deleted="onCommentDeleted"
        />
      </div>
    </template>
  </section>
</template>
