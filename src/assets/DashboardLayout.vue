<template>
  <div class="flex h-screen bg-[#f8f9fa] text-gray-800">
    <!-- Sidebar -->
    <aside class="hidden md:flex w-[260px] flex-col bg-gradient-to-b from-[#1e2f5c] to-[#4165d1] text-white">
      <!-- Logo -->
      <div class="flex items-center gap-3 px-6 h-[72px] border-b border-white/10">
        <div
          class="h-9 w-9 rounded-md bg-gradient-to-br from-[#e02838] to-[#c42230] flex items-center justify-center text-[#4165d1] font-extrabold text-lg shadow-lg shadow-[#e02838]/20">
          C
        </div>
        <div>
          <h1 class="text-lg font-bold text-white tracking-tight leading-none">CSC Admin</h1>
          <p class="text-[10px] text-blue-300/60 font-medium tracking-wider uppercase">Control Panel</p>
        </div>
      </div>

      <!-- Menu -->
      <div class="flex-1 overflow-y-auto py-4 px-3">
        <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" style="width: 100%" mode="inline"
          :items="visibleMenuItems"
          class="admin-sidebar-menu !bg-transparent !border-none !text-white/80 [&_.ant-menu-item]:!rounded-md [&_.ant-menu-item]:!mx-0 [&_.ant-menu-item]:!mb-0.5 [&_.ant-menu-item:hover]:!bg-white/10 [&_.ant-menu-item-selected]:!bg-white/15 [&_.ant-menu-item-selected]:!text-[#e02838] [&_.ant-menu-item-selected]:!font-semibold [&_.ant-menu-submenu-title]:!rounded-md [&_.ant-menu-submenu-title:hover]:!bg-white/10 [&_.ant-menu-sub]:!bg-transparent [&_.ant-menu-item]:!text-white/75 [&_.ant-menu-submenu-title]:!text-white/75 [&_.ant-menu-item-active]:!text-white [&_.ant-menu-submenu-arrow]:!text-white/40"
          @click="handleClick" />
      </div>

      <!-- Sidebar Footer -->
      <div class="p-4 border-t border-white/10">
        <a href="#" @click.prevent="logout"
          class="flex items-center gap-3 rounded-md px-4 py-2.5 text-red-300/80 hover:bg-red-500/15 hover:text-red-300 transition-all duration-200">
          <LogoutOutlined class="text-base" />
          <span class="text-sm font-medium">Sign Out</span>
        </a>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">

      <!-- Top Navigation -->
      <header class="h-[72px] flex items-center justify-between border-b border-gray-200/80 bg-white px-6 shadow-sm">
        <div class="flex items-center gap-4">
          <!-- Mobile Menu Toggle -->
          <button @click="mobileDrawerOpen = true" class="md:hidden text-gray-500 p-2 hover:bg-gray-100 rounded-md transition-colors">
            <MenuOutlined />
          </button>

          <div class="relative hidden sm:block">
            <SearchOutlined class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search anything..."
              class="w-72 rounded-md border border-gray-200 bg-gray-50/80 py-2.5 pl-11 pr-4 text-sm focus:border-[#4165d1] focus:outline-none focus:ring-2 focus:ring-[#4165d1]/10 focus:bg-white transition-all placeholder:text-gray-400">
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- Visit Site Link -->
          <router-link to="/"
            class="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium text-gray-500 hover:text-[#4165d1] hover:bg-[#4165d1]/5 transition-all">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
            Visit Site
          </router-link>

          <button class="relative text-gray-400 hover:text-[#4165d1] transition-colors p-2 hover:bg-gray-100 rounded-md">
            <BellOutlined class="text-lg" />
            <span class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#e02838] ring-2 ring-white"></span>
          </button>

          <div class="h-7 w-px bg-gray-200"></div>

          <div class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
            <div class="h-9 w-9 rounded-md bg-gradient-to-br from-[#4165d1] to-[#3554b8] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {{ (user?.name || 'U').charAt(0).toUpperCase() }}
            </div>
            <div class="hidden sm:block text-left">
              <p class="text-sm font-semibold text-gray-800 leading-tight">{{ user?.name || 'User' }}</p>
              <p class="text-[11px] text-gray-400">{{ user?.role || 'Administrator' }}</p>
            </div>
            <DownOutlined class="text-[10px] text-gray-400 hidden sm:block" />
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main class="flex-1 overflow-y-auto bg-[#f8f9fa] p-5 md:p-8">
        <router-view v-slot="{ Component }">
          <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- Mobile Drawer -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="mobileDrawerOpen" class="fixed inset-0 z-50 md:hidden" @click.self="mobileDrawerOpen = false">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="mobileDrawerOpen = false"></div>
        <aside class="absolute left-0 top-0 bottom-0 w-[280px] bg-gradient-to-b from-[#1e2f5c] to-[#4165d1] shadow-2xl flex flex-col"
          style="animation: fade-in-slide 0.3s ease-out">
          <div class="flex items-center justify-between px-5 h-[72px] border-b border-white/10">
            <div class="flex items-center gap-3">
              <div class="h-9 w-9 rounded-md bg-gradient-to-br from-[#e02838] to-[#c42230] flex items-center justify-center text-[#4165d1] font-extrabold text-lg">C</div>
              <h1 class="text-lg font-bold text-white">CSC Admin</h1>
            </div>
            <button @click="mobileDrawerOpen = false" class="text-white/60 hover:text-white p-1">
              <CloseOutlined />
            </button>
          </div>
          <div class="flex-1 overflow-y-auto py-4 px-3">
            <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" mode="inline"
              :items="visibleMenuItems"
              class="admin-sidebar-menu !bg-transparent !border-none !text-white/80 [&_.ant-menu-item]:!rounded-md [&_.ant-menu-item:hover]:!bg-white/10 [&_.ant-menu-item-selected]:!bg-white/15 [&_.ant-menu-item-selected]:!text-[#e02838] [&_.ant-menu-sub]:!bg-transparent [&_.ant-menu-item]:!text-white/75 [&_.ant-menu-submenu-title]:!text-white/75 [&_.ant-menu-submenu-title]:!rounded-md [&_.ant-menu-submenu-title:hover]:!bg-white/10"
              @click="(e) => { handleClick(e); mobileDrawerOpen = false; }" />
          </div>
          <div class="p-4 border-t border-white/10">
            <a href="#" @click.prevent="() => { logout(); mobileDrawerOpen = false; }"
              class="flex items-center gap-3 rounded-md px-4 py-2.5 text-red-300/80 hover:bg-red-500/15 transition-colors">
              <LogoutOutlined class="text-base" />
              <span class="text-sm font-medium">Sign Out</span>
            </a>
          </div>
        </aside>
      </div>
    </transition>
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
  BookOutlined,
  HistoryOutlined,
  ApartmentOutlined,
  CloseOutlined,
} from '@ant-design/icons-vue';
import { useAuth } from '../composables/useAuth';
import { useBibleManagementContext } from '@/composables/useBibleManagementContext';
import { onMounted, h, computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const { user, logout, initAuth, hasPermission } = useAuth();
const { lastBibleId, lastChapterId } = useBibleManagementContext();
const route = useRoute();
const router = useRouter();

const mobileDrawerOpen = ref(false);

const chapterRouteNames = ['adminChapterList', 'adminChapterCreate', 'adminChapterEdit'];
const verseRouteNames = ['adminVerseList', 'adminVerseCreate', 'adminVerseEdit'];

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
  createSermonIssue: 'adminSermonIssues',
  editSermonIssue: 'adminSermonIssues',
  createSaint: 'adminSaints',
  editSaint: 'adminSaints',
  createStructurePage: 'adminStructurePages',
  editStructurePage: 'adminStructurePages',
};

const menuRouteKeys = [
  'dashboard',
  'adminNews',
  'adminCategories',
  'adminBible',
  'adminSermons',
  'adminMessengerIssues',
  'adminSermonIssues',
  'adminGallery',
  'adminSaints',
  'adminChurchHistory',
  'adminStructurePages',
  'adminPanel',
];

const selectedKeys = ref([]);
const openKeys = ref(['bible-management']);

const MENU_BASE = [
  {
    key: 'dashboard',
    permission: 'DASHBOARD-ACCESS',
    icon: () => h(AppstoreOutlined),
    label: 'Dashboard',
    title: 'Dashboard',
  },
  {
    key: 'adminNews',
    permission: 'READ-NEWS',
    icon: () => h(FileTextOutlined),
    label: 'News & Articles',
    title: 'News & Articles',
  },
  {
    key: 'adminCategories',
    permission: 'READ-CATEGORY',
    icon: () => h(TagsOutlined),
    label: 'Categories',
    title: 'Categories',
  },
  {
    key: 'adminBible',
    permission: 'READ-DAILY-READING',
    icon: () => h(ReadOutlined),
    label: 'Bible Readings',
    title: 'Bible Readings',
  },
  {
    key: 'bible-management',
    permission: 'READ-BIBLE',
    icon: () => h(BookOutlined),
    label: 'Bible Management',
    title: 'Bible Management',
  },
  {
    key: 'bible',
    permission: 'READ-BIBLE',
    label: 'Bible',
    title: 'Bible',
  },
  {
    key: 'chapters',
    permission: 'READ-BIBLE',
    label: 'Chapters',
    title: 'Chapters',
  },
  {
    key: 'verses',
    permission: 'READ-BIBLE',
    label: 'Verses',
    title: 'Verses',
  },
  {
    key: 'adminSermons',
    permission: 'READ-SERMON',
    icon: () => h(SoundOutlined),
    label: 'Sermons',
    title: 'Sermons',
  },
  {
    key: 'adminMessengerIssues',
    permission: 'READ-MESSENGER',
    icon: () => h(FileTextOutlined),
    label: 'The Messenger',
    title: 'The Messenger',
  },
  {
    key: 'adminSermonIssues',
    permission: 'READ-SERMON-ISSUE',
    icon: () => h(ReadOutlined),
    label: 'The Sermon',
    title: 'The Sermon',
  },
  {
    key: 'adminGallery',
    permission: 'READ-GALLERY',
    icon: () => h(PictureOutlined),
    label: 'Media Gallery',
    title: 'Media Gallery',
  },
  {
    key: 'adminSaints',
    permission: 'READ-SAINT',
    icon: () => h(FireOutlined),
    label: 'Saints',
    title: 'Saints',
  },
  {
    key: 'adminChurchHistory',
    permission: 'READ-CHURCH-HISTORY',
    icon: () => h(HistoryOutlined),
    label: 'Church History',
    title: 'Church History',
  },
  {
    key: 'adminStructurePages',
    permission: 'READ-STRUCTURE-PAGE',
    icon: () => h(ApartmentOutlined),
    label: 'Structure pages',
    title: 'Structure pages',
  },
  {
    key: 'system-group',
    icon: () => h(SettingOutlined),
    label: 'System',
    title: 'System',
    children: [
      {
        key: 'adminPanel',
        permission: 'MANAGE-USERS',
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
];

function filterMenuByPermission(items) {
  return items
    .map((item) => {
      const { permission, children, ...rest } = item;
      if (permission && !hasPermission(permission)) return null;
      if (children?.length) {
        const nextChildren = filterMenuByPermission(children);
        if (!nextChildren.length) return null;
        return { ...rest, children: nextChildren };
      }
      return { ...rest };
    })
    .filter(Boolean);
}

const visibleMenuItems = computed(() => filterMenuByPermission(MENU_BASE));

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

<style scoped>
/* Override Ant Menu inline styles for our dark sidebar */
.admin-sidebar-menu :deep(.ant-menu-item-group-title) {
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-left: 16px;
}
</style>