<script setup>
import { ref, computed } from 'vue';
import {
  PaperClipOutlined,
  DeleteOutlined,
  FilePdfOutlined,
} from '@ant-design/icons-vue';
import { CommentService } from '@/services/CommentService.js';
import { uploadFile } from '@/services/FileService.js';
import { useAuth } from '@/composables/useAuth';

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  articleId: {
    type: String,
    required: true,
  },
  maxDepth: {
    type: Number,
    default: 5,
  },
  depth: {
    type: Number,
    default: 0,
  },
  currentUserId: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(['reply-submitted', 'comment-deleted']);

const { isAuthenticated } = useAuth();

const showReplyForm = ref(false);
const replyBody = ref('');
const isSubmitting = ref(false);
const isDeleting = ref(false);
const submitError = ref('');
const pendingFiles = ref([]);
const fileInputRef = ref(null);

const canReply = computed(
  () => isAuthenticated.value && props.depth < props.maxDepth - 1
);

const canDelete = computed(
  () =>
    isAuthenticated.value &&
    props.currentUserId != null &&
    props.comment.author_id === props.currentUserId
);

const formattedDate = computed(() => {
  if (!props.comment.created_at) return '';
  return new Date(props.comment.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

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

async function submitReply() {
  submitError.value = '';
  const text = replyBody.value.trim();
  if (!text) {
    submitError.value = 'Please enter a reply.';
    return;
  }

  if (pendingFiles.value.some((f) => f.uploading)) {
    submitError.value = 'Please wait for uploads to finish.';
    return;
  }

  isSubmitting.value = true;
  try {
    const attachmentIds = pendingFiles.value
      .filter((f) => f.fileId)
      .map((f) => f.fileId);

    await CommentService.createComment(props.articleId, {
      body: text,
      parent_id: props.comment.id,
      attachment_ids: attachmentIds,
    });

    replyBody.value = '';
    pendingFiles.value.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    pendingFiles.value = [];
    showReplyForm.value = false;
    emit('reply-submitted');
  } catch (err) {
    const detail = err.response?.data?.detail;
    submitError.value =
      typeof detail === 'string' ? detail : err.message || 'Failed to post reply';
  } finally {
    isSubmitting.value = false;
  }
}

async function deleteComment() {
  if (!canDelete.value || isDeleting.value) return;
  isDeleting.value = true;
  try {
    await CommentService.deleteComment(props.articleId, props.comment.id);
    emit('comment-deleted');
  } catch (err) {
    console.error('Failed to delete comment:', err);
  } finally {
    isDeleting.value = false;
  }
}
</script>

<template>
  <div :class="depth > 0 ? 'border-l-2 border-gray-200 pl-5 mt-4' : 'mt-6'">
    <div class="flex justify-between items-start gap-3 mb-2">
      <div>
        <span class="font-semibold text-gray-800 text-sm">{{ comment.author_name }}</span>
        <span class="text-xs text-gray-400 ml-2">{{ formattedDate }}</span>
      </div>
      <button
        v-if="canDelete"
        type="button"
        class="text-xs text-gray-400 hover:text-red-500 transition-colors"
        :disabled="isDeleting"
        @click="deleteComment"
      >
        {{ isDeleting ? 'Deleting...' : 'Delete' }}
      </button>
    </div>

    <p class="m-0 text-gray-600 text-sm whitespace-pre-wrap">{{ comment.body }}</p>

    <div
      v-if="comment.attachments && comment.attachments.length"
      class="mt-3 flex flex-wrap gap-3"
    >
      <template v-for="att in comment.attachments" :key="att.id">
        <a
          v-if="att.type === 'photo' && att.url"
          :href="att.url"
          target="_blank"
          rel="noopener noreferrer"
          class="block"
        >
          <img
            :src="att.url"
            :alt="att.filename || 'Attachment'"
            class="max-w-[200px] max-h-[160px] rounded-md border border-gray-100 object-cover"
          />
        </a>
        <a
          v-else-if="att.type === 'pdf'"
          :href="att.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-100 rounded-md text-sm text-[#1a365d] hover:bg-gray-100 transition-colors"
        >
          <FilePdfOutlined />
          {{ att.filename || 'PDF attachment' }}
        </a>
      </template>
    </div>

    <div v-if="canReply" class="mt-2">
      <button
        type="button"
        class="bg-transparent border-none text-[#1a365d] cursor-pointer text-sm hover:underline p-0"
        @click="showReplyForm = !showReplyForm"
      >
        Reply
      </button>
    </div>

    <div v-if="showReplyForm" class="mt-3">
      <textarea
        v-model="replyBody"
        placeholder="Write a reply..."
        rows="2"
        class="w-full p-2 border border-gray-200 rounded-md text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#1a365d]/20"
      />

      <div v-if="pendingFiles.length" class="mt-2 flex flex-wrap gap-2">
        <div
          v-for="file in pendingFiles"
          :key="file.id"
          class="flex items-center gap-2 px-2 py-1 bg-gray-50 border border-gray-100 rounded text-xs"
        >
          <span class="text-gray-600 max-w-[100px] truncate">{{ file.name }}</span>
          <button type="button" class="text-gray-400 hover:text-red-500" @click="removePendingFile(file)">
            <DeleteOutlined />
          </button>
        </div>
      </div>

      <div class="mt-2 flex flex-wrap items-center gap-2">
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*,.pdf,application/pdf"
          multiple
          class="hidden"
          @change="onFilesSelected"
        />
        <button
          v-if="pendingFiles.length < 5"
          type="button"
          class="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#1a365d]"
          @click="openFilePicker"
        >
          <PaperClipOutlined /> Attach
        </button>
        <button
          type="button"
          :disabled="isSubmitting"
          class="ml-auto px-3 py-1.5 bg-[#1a365d] text-white text-xs rounded-md hover:bg-[#152a4a] disabled:opacity-50"
          @click="submitReply"
        >
          {{ isSubmitting ? 'Posting...' : 'Submit reply' }}
        </button>
      </div>
      <p v-if="submitError" class="mt-1 text-xs text-red-600 m-0">{{ submitError }}</p>
    </div>

    <div v-if="comment.replies && comment.replies.length" class="mt-2">
      <CommentItem
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        :article-id="articleId"
        :max-depth="maxDepth"
        :depth="depth + 1"
        :current-user-id="currentUserId"
        @reply-submitted="$emit('reply-submitted')"
        @comment-deleted="$emit('comment-deleted')"
      />
    </div>
  </div>
</template>
