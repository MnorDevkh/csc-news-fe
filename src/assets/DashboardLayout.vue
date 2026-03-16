<template>
  <div class="flex h-screen bg-gray-50 text-gray-800">
    <!-- Sidebar -->
    <aside class="hidden md:flex w-64 flex-col bg-white border-r border-gray-200">
      <div class="flex items-center gap-3 px-6 h-16 border-b border-gray-200">
        <div
          class="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
          A
        </div>
        <h1 class="text-xl font-bold text-gray-800 tracking-tight">Admin Portal</h1>
      </div>

      <div class="flex-1 overflow-y-auto py-4">
        <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" style="width: 256px" mode="inline"
          :items="menuItems" class="admin-sidebar-menu border-none" @click="handleClick" />
      </div>

      <div class="p-4 border-t border-gray-200">
        <a href="#" @click.prevent="logout"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50 transition-colors">
          <LogoutOutlined class="text-lg" />
          <span>Logout</span>
        </a>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">

      <!-- Top Navigation -->
      <header class="h-16 flex items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
        <div class="flex items-center gap-4">
          <!-- Mobile Menu Toggle (Visible only on mobile) -->
          <button class="md:hidden text-gray-500 p-2">
            <MenuOutlined />
          </button>

          <div class="relative hidden sm:block">
            <SearchOutlined class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Global search..."
              class="w-64 rounded-full border border-gray-300 py-1.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all">
          </div>
        </div>

        <div class="flex items-center gap-6">
          <button class="relative text-gray-500 hover:text-blue-600 transition-colors">
            <BellOutlined class="text-xl" />
            <span class="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
          </button>

          <div class="h-8 w-px bg-gray-200"></div>

          <div class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
            <img :src="user?.avatar || 'https://i.pravatar.cc/150'" alt="User Avatar"
              class="h-9 w-9 rounded-full border border-gray-200">
            <div class="hidden sm:block text-left">
              <p class="text-sm font-semibold text-gray-900 leading-tight">{{ user?.name || 'User' }}</p>
              <p class="text-xs text-gray-500">{{ user?.role || 'Guest' }}</p>
            </div>
            <DownOutlined class="text-xs text-gray-400 hidden sm:block" />
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main class="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8">
        <router-view v-slot="{ Component }">
          <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import {
  AppstoreOutlined,
  FileTextOutlined,
  ReadOutlined,
  SoundOutlined,
  PictureOutlined,
  FireOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  SearchOutlined,
  BellOutlined,
  MenuOutlined,
  DownOutlined,
  TagsOutlined,
  UnorderedListOutlined,
  BookOutlined
} from '@ant-design/icons-vue';
import { useAuth } from '../composables/useAuth';
import { useBibleManagementContext } from '@/composables/useBibleManagementContext';
import { onMounted, h, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const { user, logout, initAuth } = useAuth();
const { lastBibleId, lastChapterId } = useBibleManagementContext();
const route = useRoute();
const router = useRouter();

const chapterRouteNames = ['adminChapterList', 'adminChapterCreate', 'adminChapterEdit'];
const verseRouteNames = ['adminVerseList', 'adminVerseCreate', 'adminVerseEdit'];

// Map child admin routes to their parent sidebar keys
const childToParentMap = {
  createNews: 'adminNews',
  editNews: 'adminNews',
  createCategory: 'adminCategories',
  editCategory: 'adminCategories',
  createDailyReading: 'adminBible',
  editDailyReading: 'adminBible',
  createSermon: 'adminSermons',
  editSermon: 'adminSermons',
  adminGalleryCreate: 'adminGallery',
  adminGalleryEdit: 'adminGallery',
  adminBibleCreate: 'bible',
  adminBibleEdit: 'bible',
  createMessengerIssue: 'adminMessengerIssues',
  editMessengerIssue: 'adminMessengerIssues',
};

const menuRouteKeys = [
  'dashboard',
  'adminNews',
  'adminCategories',
  'adminBible',
  'adminSermons',
  'adminMessengerIssues',
  'adminGallery',
  'adminSaints',
  'adminPanel',
];

const selectedKeys = ref([]);
const openKeys = ref(['bible-management']);


const menuItems = reactive([
  {
    key: 'dashboard',
    icon: () => h(AppstoreOutlined),
    label: 'Dashboard',
    title: 'Dashboard',
  }, {
    key: 'adminNews',
    icon: () => h(FileTextOutlined),
    label: 'News & Articles',
    title: 'News & Articles',
  },
  {
    key: 'adminCategories',
    icon: () => h(TagsOutlined),
    label: 'Categories',
    title: 'Categories',
  },
  {
    key: 'adminBible',
    icon: () => h(ReadOutlined),
    label: 'Bible Readings',
    title: 'Bible Readings',
  },
  {
    key: 'bible-management',
    icon: () => h(BookOutlined),
    label: 'Bible Management',
    title: 'Bible Management',
  },
  {
    key: 'bible',
    label: 'Bible',
    title: 'Bible',
  },
  {
    key: 'chapters',
    label: 'Chapters',
    title: 'Chapters',
  },
  {
    key: 'verses',
    label: 'Verses',
    title: 'Verses',
  },
  {
    key: 'adminSermons',
    icon: () => h(SoundOutlined),
    label: 'Sermons',
    title: 'Sermons',
  },
  {
    key: 'adminMessengerIssues',
    icon: () => h(FileTextOutlined),
    label: 'The Messenger',
    title: 'The Messenger',
  },
  {
    key: 'adminGallery',
    icon: () => h(PictureOutlined),
    label: 'Media Gallery',
    title: 'Media Gallery',
  },
  {
    key: 'adminSaints',
    icon: () => h(FireOutlined),
    label: 'Saints',
    title: 'Saints',
  },

  {
    key: 'system-group',
    icon: () => h(SettingOutlined),
    label: 'System',
    title: 'System',
    children: [
      {
        key: 'adminPanel',
        icon: () => h(TeamOutlined),
        label: 'User Management',
        title: 'User Management',
      },
      {
        key: 'settings',
        icon: () => h(SettingOutlined),
        label: 'Settings',
        title: 'Settings',
      },
    ],
  },
]);

function handleClick(e) {
  const k = String(e.key);
  if (k === 'settings') return;
  if (k === 'bible-management') {
    router.push({ name: 'adminBibleTypes' });
    return;
  }
  if (k === 'bible') {
    router.push({ name: 'adminBibleManagement' });
    return;
  }
  if (k === 'chapters') {
    router.push({ name: 'adminChapterList' });
    return;
  }
  if (k === 'verses') {
    if (lastChapterId.value) {
      router.push({ name: 'adminVerseList' });
    } else {
      router.push({ name: 'adminVerseList' });
    }
    return;
  }
  router.push({ name: k });
}

onMounted(() => {
  initAuth();
});
</script>

<style scoped></style>