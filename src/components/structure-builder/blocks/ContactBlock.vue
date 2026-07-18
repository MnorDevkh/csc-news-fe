<script setup>
import { ref } from 'vue';
import { blockWrapperClass, blockInlineStyle } from '../utils/blockStyles';

defineProps({
  data: { type: Object, default: () => ({}) },
});

const name = ref('');
const email = ref('');
const message = ref('');
const submitted = ref(false);

function onSubmit(e) {
  e.preventDefault();
  submitted.value = true;
}
</script>

<template>
  <section
    :class="blockWrapperClass(data, 'px-4 py-12')"
    :style="blockInlineStyle(data)"
  >
    <div class="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
      <div>
        <h2
          v-if="data.title"
          class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
        >
          {{ data.title }}
        </h2>
        <p v-if="data.subtitle" class="mt-3 text-slate-600">
          {{ data.subtitle }}
        </p>

        <ul class="mt-8 space-y-4 text-sm text-slate-700">
          <li v-if="data.email">
            <span class="font-medium text-slate-500">Email</span>
            <br />
            <a :href="`mailto:${data.email}`" class="text-blue-600 hover:underline">
              {{ data.email }}
            </a>
          </li>
          <li v-if="data.phone">
            <span class="font-medium text-slate-500">Phone</span>
            <br />
            <a :href="`tel:${data.phone}`" class="hover:underline">{{ data.phone }}</a>
          </li>
          <li v-if="data.address">
            <span class="font-medium text-slate-500">Address</span>
            <br />
            {{ data.address }}
          </li>
        </ul>
      </div>

      <form
        v-if="data.showForm !== false"
        class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        @submit="onSubmit"
      >
        <div v-if="submitted" class="py-8 text-center text-blue-600">
          Thanks — your message was recorded (demo mode).
        </div>
        <template v-else>
          <label class="block text-sm font-medium text-slate-700">
            Name
            <input
              v-model="name"
              required
              type="text"
              class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
          <label class="mt-4 block text-sm font-medium text-slate-700">
            Email
            <input
              v-model="email"
              required
              type="email"
              class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
          <label class="mt-4 block text-sm font-medium text-slate-700">
            Message
            <textarea
              v-model="message"
              required
              rows="4"
              class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
          <button
            type="submit"
            class="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            {{ data.submitText || 'Send message' }}
          </button>
        </template>
      </form>
    </div>
  </section>
</template>
