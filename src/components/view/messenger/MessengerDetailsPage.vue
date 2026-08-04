<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MessengerService } from '@/services/MessengerService';
import MessengerFlipbookViewer from '@/components/view/messenger/MessengerFlipbookViewer.vue';

const route = useRoute();
const router = useRouter();

const issue = ref(null);
const loading = ref(true);
const error = ref('');

const slug = computed(() => route.params.slug);

const issueDateLabel = computed(() => {
  if (!issue.value?.issue_date) return '';
  try {
    return new Date(issue.value.issue_date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return issue.value.issue_date;
  }
});

async function loadIssue() {
  loading.value = true;
  error.value = '';
  issue.value = null;
  try {
    const data = await MessengerService.getIssueBySlug(slug.value);
    issue.value = data;
  } catch (e) {
    console.error('Failed to load messenger issue:', e);
    error.value = 'Failed to load issue. Please try again later.';
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push({ name: 'messengerList' });
}

onMounted(() => {
  loadIssue();
});

watch(slug, () => {
  loadIssue();
});
</script>

<template>
  <div class="issue-reader min-h-screen">
    <div class="mx-auto max-w-6xl px-3 py-4 sm:px-5 sm:py-8">
      <nav class="mb-6 sm:mb-8">
        <button
          type="button"
          class="group inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
          @click="goBack"
        >
          <span
            class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/10 bg-white text-primary transition group-hover:border-primary group-hover:bg-primary group-hover:text-white"
            aria-hidden="true"
          >
            ←
          </span>
          All issues
        </button>
      </nav>

      <div v-if="loading" class="space-y-6 animate-pulse">
        <div class="mx-auto max-w-2xl space-y-3 text-center">
          <div class="mx-auto h-3 w-24 rounded bg-primary/10" />
          <div class="mx-auto h-9 w-3/4 rounded bg-primary/10" />
          <div class="mx-auto h-4 w-full max-w-md rounded bg-primary/10" />
        </div>
        <div class="h-[min(68vh,760px)] min-h-[320px] rounded-2xl bg-primary/5" />
      </div>

      <div v-else-if="error" class="rounded-2xl border border-red-100 bg-white px-6 py-12 text-center">
        <p class="mb-4 text-sm text-red-600">{{ error }}</p>
        <button
          type="button"
          class="text-sm font-semibold text-primary hover:text-primary-hover"
          @click="loadIssue"
        >
          Retry
        </button>
      </div>

      <template v-else>
        <header class="issue-intro mx-auto mb-6 max-w-2xl text-center sm:mb-8">
          <p v-if="issueDateLabel" class="issue-meta">
            {{ issueDateLabel }}
          </p>
          <h1 class="issue-title">
            {{ issue?.title || 'The Messenger' }}
          </h1>
          <div class="issue-rule" aria-hidden="true" />
          <p v-if="issue?.description" class="issue-desc">
            {{ issue.description }}
          </p>
        </header>

        <MessengerFlipbookViewer
          v-if="issue?.pdf_url"
          :pdfUrl="issue.pdf_url"
          :title="issue?.title || 'The Messenger'"
        />

        <div
          v-else
          class="rounded-2xl border border-dashed border-primary/20 bg-white px-6 py-12 text-center text-sm text-muted"
        >
          PDF not available for this issue.
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.issue-reader {
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(26, 54, 93, 0.07), transparent 55%),
    linear-gradient(180deg, #f4f6f9 0%, #f8f9fa 40%, #eef1f5 100%);
}

.issue-meta {
  margin: 0 0 0.65rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #d4a853;
}

.issue-title {
  margin: 0;
  font-family: 'Koh Santepheap', 'Kantumruy Pro', Georgia, serif;
  font-size: clamp(1.65rem, 4vw, 2.35rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #1a365d;
}

.issue-rule {
  width: 2.5rem;
  height: 2px;
  margin: 1rem auto 0;
  border-radius: 9999px;
  background: linear-gradient(90deg, transparent, #d4a853, transparent);
}

.issue-desc {
  margin: 1rem 0 0;
  font-size: 0.95rem;
  line-height: 1.65;
  color: #4b5563;
  text-wrap: balance;
}
</style>
