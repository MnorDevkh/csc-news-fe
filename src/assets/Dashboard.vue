<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-sm text-gray-500 mt-1">Welcome back! Here's an overview of your content.</p>
      </div>
      <div class="flex items-center gap-3">
        <router-link :to="{ name: 'createNews' }"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
          <PlusOutlined />
          New Article
        </router-link>
      </div>
    </div>

    <!-- Analytics Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 hover:shadow-md transition-shadow group">
        <div class="flex items-center justify-between mb-3">
          <div class="h-11 w-11 rounded-md bg-[#1a365d]/8 flex items-center justify-center group-hover:bg-[#1a365d]/12 transition-colors">
            <FileTextOutlined class="text-lg text-[#1a365d]" />
          </div>
          <span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Live</span>
        </div>
        <p class="text-sm font-medium text-gray-500 mb-1">Published Articles</p>
        <p class="text-2xl font-bold text-gray-900">{{ stats.articles }}</p>
      </div>

      <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 hover:shadow-md transition-shadow group">
        <div class="flex items-center justify-between mb-3">
          <div class="h-11 w-11 rounded-md bg-[#d4a853]/10 flex items-center justify-center group-hover:bg-[#d4a853]/15 transition-colors">
            <TagsOutlined class="text-lg text-[#d4a853]" />
          </div>
          <span class="text-xs font-medium text-[#d4a853] bg-[#d4a853]/10 px-2 py-1 rounded-md">Active</span>
        </div>
        <p class="text-sm font-medium text-gray-500 mb-1">Categories</p>
        <p class="text-2xl font-bold text-gray-900">{{ stats.categories }}</p>
      </div>

      <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 hover:shadow-md transition-shadow group">
        <div class="flex items-center justify-between mb-3">
          <div class="h-11 w-11 rounded-md bg-violet-100/80 flex items-center justify-center group-hover:bg-violet-100 transition-colors">
            <PictureOutlined class="text-lg text-violet-600" />
          </div>
        </div>
        <p class="text-sm font-medium text-gray-500 mb-1">Media Files</p>
        <p class="text-2xl font-bold text-gray-900">{{ stats.media }}</p>
      </div>

      <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 hover:shadow-md transition-shadow group">
        <div class="flex items-center justify-between mb-3">
          <div class="h-11 w-11 rounded-md bg-sky-100/80 flex items-center justify-center group-hover:bg-sky-100 transition-colors">
            <ReadOutlined class="text-lg text-sky-600" />
          </div>
        </div>
        <p class="text-sm font-medium text-gray-500 mb-1">Bible Readings</p>
        <p class="text-2xl font-bold text-gray-900">{{ stats.readings }}</p>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 pt-4">

      <!-- Quick Actions -->
      <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 lg:col-span-2">
        <h3 class="text-lg font-bold text-gray-900 mb-5">Quick Actions</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <router-link v-for="action in quickActions" :key="action.name" :to="action.to"
            class="flex flex-col items-center gap-3 p-4 rounded-2xl bg-gray-50/80 hover:bg-[#1a365d]/5 border border-transparent hover:border-[#1a365d]/10 transition-all duration-200 group cursor-pointer">
            <div class="h-10 w-10 rounded-md flex items-center justify-center transition-colors"
              :class="action.iconBg">
              <component :is="action.icon" class="text-base" :class="action.iconColor" />
            </div>
            <span class="text-xs font-medium text-gray-600 group-hover:text-[#1a365d] text-center transition-colors">{{ action.name }}</span>
          </router-link>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h3 class="text-lg font-bold text-gray-900 mb-5">System Info</h3>
        <div class="space-y-4">
          <div class="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80">
            <div class="h-8 w-8 rounded-md bg-emerald-100 flex items-center justify-center">
              <CheckCircleOutlined class="text-emerald-600 text-sm" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-800">System Status</p>
              <p class="text-xs text-emerald-600">All services operational</p>
            </div>
          </div>
          <div class="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80">
            <div class="h-8 w-8 rounded-md bg-[#1a365d]/10 flex items-center justify-center">
              <GlobalOutlined class="text-[#1a365d] text-sm" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-800">Version</p>
              <p class="text-xs text-gray-500">CSC News v2.0</p>
            </div>
          </div>
          <div class="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80">
            <div class="h-8 w-8 rounded-md bg-[#d4a853]/10 flex items-center justify-center">
              <ClockCircleOutlined class="text-[#d4a853] text-sm" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-800">Last Updated</p>
              <p class="text-xs text-gray-500">{{ new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, h, onMounted } from 'vue';
import {
  PlusOutlined,
  FileTextOutlined,
  TagsOutlined,
  PictureOutlined,
  ReadOutlined,
  SoundOutlined,
  FireOutlined,
  BookOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
  ApartmentOutlined,
} from '@ant-design/icons-vue';
import { NewsService } from '@/services/NewsService';

const stats = ref({
  articles: '—',
  categories: '—',
  media: '—',
  readings: '—',
});

const quickActions = [
  { name: 'New Article', to: { name: 'createNews' }, icon: FileTextOutlined, iconBg: 'bg-[#1a365d]/8', iconColor: 'text-[#1a365d]' },
  { name: 'Categories', to: { name: 'adminCategories' }, icon: TagsOutlined, iconBg: 'bg-[#d4a853]/10', iconColor: 'text-[#d4a853]' },
  { name: 'Bible Readings', to: { name: 'adminBible' }, icon: ReadOutlined, iconBg: 'bg-sky-100/80', iconColor: 'text-sky-600' },
  { name: 'New Sermon', to: { name: 'createSermon' }, icon: SoundOutlined, iconBg: 'bg-emerald-100/80', iconColor: 'text-emerald-600' },
  { name: 'Media Gallery', to: { name: 'adminGallery' }, icon: PictureOutlined, iconBg: 'bg-violet-100/80', iconColor: 'text-violet-600' },
  { name: 'Structure', to: { name: 'adminStructurePages' }, icon: ApartmentOutlined, iconBg: 'bg-orange-100/80', iconColor: 'text-orange-600' },
];

onMounted(async () => {
  try {
    const [articles, categories] = await Promise.all([
      NewsService.getAllArticles({ skip: 0, limit: 1 }),
      NewsService.getNewsCategories(),
    ]);
    stats.value.articles = articles?.total_elements ?? (articles?.items?.length || 0);
    stats.value.categories = Array.isArray(categories) ? categories.length : (categories?.items?.length || 0);
    stats.value.media = '—';
    stats.value.readings = '—';
  } catch {
    // fallback
  }
});
</script>