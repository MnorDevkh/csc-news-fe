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
        <nav class="space-y-1 px-3">

          <!-- Dashboard -->
          <router-link :to="{ name: 'dashboard' }"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors group"
            active-class="bg-blue-50 text-blue-700 font-medium shadow-sm ring-1 ring-blue-200">
            <AppstoreOutlined class="text-lg text-gray-400 group-hover:text-blue-600 active:text-blue-700"
              :class="{ '!text-blue-600': $route.name === 'dashboard' }" />
            <span>Dashboard</span>
          </router-link>

          <!-- Content Management Section -->
          <div class="mt-8 mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Content Management
          </div>

          <router-link :to="{ name: 'adminNews' }"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors group"
            active-class="bg-blue-50 text-blue-700 font-medium ring-1 ring-blue-200">
            <FileTextOutlined class="text-lg text-gray-400 group-hover:text-amber-500" />
            <span>News & Articles</span>
          </router-link>

          <router-link :to="{ name: 'adminBible' }"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors group"
            active-class="bg-blue-50 text-blue-700 font-medium ring-1 ring-blue-200">
            <ReadOutlined class="text-lg text-gray-400 group-hover:text-indigo-500" />
            <span>Bible Readings</span>
          </router-link>

          <router-link :to="{ name: 'adminSermons' }"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors group"
            active-class="bg-blue-50 text-blue-700 font-medium ring-1 ring-blue-200">
            <SoundOutlined class="text-lg text-gray-400 group-hover:text-purple-500" />
            <span>Sermons</span>
          </router-link>

          <router-link :to="{ name: 'adminGallery' }"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors group"
            active-class="bg-blue-50 text-blue-700 font-medium ring-1 ring-blue-200">
            <PictureOutlined class="text-lg text-gray-400 group-hover:text-emerald-500" />
            <span>Media Gallery</span>
          </router-link>

          <router-link :to="{ name: 'adminSaints' }"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors group"
            active-class="bg-blue-50 text-blue-700 font-medium ring-1 ring-blue-200">
            <FireOutlined class="text-lg text-gray-400 group-hover:text-orange-500" />
            <span>Saints</span>
          </router-link>

          <!-- System Section -->
          <div class="mt-8 mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            System
          </div>

          <router-link :to="{ name: 'adminPanel' }"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors group"
            active-class="bg-blue-50 text-blue-700 font-medium ring-1 ring-blue-200">
            <TeamOutlined class="text-lg text-gray-400 group-hover:text-blue-600" />
            <span>User Management</span>
          </router-link>

          <a href="#"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors group">
            <SettingOutlined class="text-lg text-gray-400 group-hover:text-gray-600" />
            <span>Settings</span>
          </a>

        </nav>
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
          <transition name="fade" mode="out-in">
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
  DownOutlined
} from '@ant-design/icons-vue';
import { useAuth } from '../composables/useAuth';
import { onMounted } from 'vue';

const { user, logout, initAuth } = useAuth();

onMounted(() => {
  initAuth();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>