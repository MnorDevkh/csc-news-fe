<template>
    <nav class="bg-white shadow-sm font-sans mb-4 sticky top-0 z-50 flex justify-center w-full [&_.ant-menu-horizontal]:border-b-0 [&_.ant-menu-horizontal]:leading-[46px] [&_.ant-menu-item]:px-6 [&_.ant-menu-item-selected]:!text-blue-600 [&_.ant-menu-submenu-selected]:!text-blue-600 [&_.ant-menu-item::after]:!border-b-2 [&_.ant-menu-item::after]:!border-blue-600 [&_.ant-menu-submenu::after]:!border-b-2 [&_.ant-menu-submenu::after]:!border-blue-600 [&_.ant-menu-inline_.ant-menu-item]:h-[50px] [&_.ant-menu-inline_.ant-menu-item]:leading-[50px] [&_.ant-menu-inline_.ant-menu-item]:mb-2 [&_.ant-menu-inline]:border-r-0 [&_.ant-menu]:font-[Kantumruy_Pro,'Khmer','Koh_Santepheap',sans-serif] [&_.ant-menu-item]:font-[Kantumruy_Pro,'Khmer','Koh_Santepheap',sans-serif] [&_.ant-menu-submenu-title]:font-[Kantumruy_Pro,'Khmer','Koh_Santepheap',sans-serif]">
        <div class="w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 mx-auto">

            <!-- Top Header Bar -->
            <div class="flex justify-between items-center py-4">

                <!-- Logo Section -->
                <div class="flex items-center gap-3 cursor-pointer z-50" @click="router.push('/')">
                    <!-- Logo Image (Optional) -->
                    <!-- <img src="/logo.png" class="h-10 w-10"/> -->
                    <div class="flex flex-col">
                        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-blue-600 m-0 leading-none">
                            CSC NEWS</h1>
                        <p class="text-xs sm:text-lg font-medium text-gray-500 m-0 tracking-wide uppercase">Catholic
                            Cambodia</p>
                    </div>
                </div>

                <!-- Desktop Search & Actions -->
                <div class="hidden md:flex flex-1 max-w-xl mx-8 justify-end items-center gap-3">
                    <div class="flex items-center gap-2 flex-1">
                        <a-input-search v-model:value="searchQuery" placeholder="ស្វែងរកអត្ថបទ..." enter-button="Search"
                            size="large" @search="performSearch" class="w-full" />
                    </div>
                    <router-link v-if="isAuthenticated" :to="{ name: 'dashboard' }"
                        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shrink-0">
                        <DashboardOutlined />
                        <span>Dashboard</span>
                    </router-link>
                </div>

                <!-- Mobile Burger Button -->
                <button @click="mobileMenuOpen = true"
                    class="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors">
                    <MenuOutlined class="text-2xl" />
                </button>

            </div>

            <!-- Desktop Navigation Menu -->
            <div class="hidden md:block border-t border-gray-100">
                <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="handleClick"
                    class="justify-start border-none text-base font-medium" />
            </div>

        </div>

        <!-- Mobile Full Screen Menu Overlay -->
        <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-x-full"
            enter-to-class="opacity-100 translate-x-0" leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 translate-x-full">
            <div v-if="mobileMenuOpen"
                class="fixed inset-0 z-[60] bg-white flex flex-col overflow-y-auto w-full h-full">

                <!-- Mobile Menu Header -->
                <div class="flex justify-between items-center p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <div class="flex flex-col">
                        <h1 class="text-2xl font-extrabold text-blue-600 leading-none">CSC NEWS</h1>
                    </div>
                    <button @click="mobileMenuOpen = false"
                        class="p-2 text-gray-500 hover:text-red-500 transition-colors">
                        <CloseOutlined class="text-2xl" />
                    </button>
                </div>

                <div class="flex-1 p-6 flex flex-col gap-8">

                    <!-- Mobile Search -->
                    <div>
                        <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Search</h3>
                        <a-input-search v-model:value="searchQuery" placeholder="Search news..." enter-button
                            size="large" @search="() => { performSearch(); mobileMenuOpen = false; }" />
                    </div>

                    <!-- Mobile Menu Items -->
                    <div class="flex-1">
                        <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Menu</h3>
                        <a-menu v-model:selectedKeys="current" mode="inline" :items="items"
                            @click="(e) => { handleClick(e); mobileMenuOpen = false; }" class="border-none text-lg" />
                    </div>

                    <!-- Dashboard (when logged in) -->
                    <div v-if="isAuthenticated" class="pt-4 border-t border-gray-100">
                        <router-link :to="{ name: 'dashboard' }"
                            class="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                            @click="mobileMenuOpen = false">
                            <DashboardOutlined />
                            <span>Dashboard</span>
                        </router-link>
                    </div>

                    <!-- Footer / Extra Links -->
                    <div class="mt-auto pt-8 border-t border-gray-100">
                        <a href="#" class="block text-center text-gray-500 text-sm mb-2">Privacy Policy</a>
                        <div class="text-center text-gray-400 text-xs">© 2026 CSC News. All rights reserved.</div>
                    </div>

                </div>
            </div>
        </transition>

    </nav>
</template>

<script lang="ts" setup>
import { h, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { MailOutlined, HomeOutlined, ReadOutlined, SettingOutlined, MenuOutlined, CloseOutlined, DashboardOutlined } from '@ant-design/icons-vue';
import { MenuProps } from 'ant-design-vue';
import { useAuth } from '@/composables/useAuth';

const searchQuery = ref('');
const router = useRouter();
const { isAuthenticated, initAuth } = useAuth();

onMounted(() => {
    initAuth();
});
const current = ref<string[]>(['/']);
const mobileMenuOpen = ref(false);

const performSearch = () => {
    if (searchQuery.value.trim()) {
        router.push({ name: 'searchResults', query: { q: searchQuery.value } });
    }
};

const handleClick: MenuProps['onClick'] = (e) => {
    // Prevent router navigation for external links (handled by <a> tag in label)
    if (e.key === 'alipay') return;

    // Navigate based on key
    if (e.key) {
        router.push(e.key as string);
    }
};

const items = ref<MenuProps['items']>([
    {
        key: '/',
        icon: () => h(HomeOutlined),
        label: 'ទំព័រដើម',
        title: 'ទំព័រដើម',
    },
    {
        key: '/read',
        icon: () => h(ReadOutlined),
        label: 'ព្រះគម្ពីរ',
        title: 'ព្រះគម្ពីរ',
    },
    {
        key: '/news',
        icon: () => h(SettingOutlined),
        label: 'ពត៌មាន',
        title: 'News',
        children: [
            {
                type: 'group',
                label: 'ពត៌មានភូមិភាគ',
                children: [
                    {
                        label: 'ពត៌មានភូមិភាគភ្នំពេញ',
                        key: 'news:phnompenh',
                    },
                    {
                        label: 'ពត៌មានភូមិភាគកំពង់ចាម',
                        key: 'news:kampongcham',
                    },
                    {
                        label: 'ពត៌មានភូមិភាគបាត់ដំបង',
                        key: 'news:battambang',
                    },
                ],
            },
            {
                type: 'group',
                label: 'ព័ត៌មានពិភពលោក',
                children: [
                    {
                        label: 'ព័ត៌មានវ៉ាទីកង់',
                        key: 'news:vatican',
                    },
                    {
                        label: 'ព្រះវិហារពិភពលោក',
                        key: 'news:worldchurch',
                    },
                ],
            },
        ],
    },
    {
        key: 'alipay',
        label: h('a', { href: 'https://antdv.com', target: '_blank' }, 'Links'),
        title: 'Links',
    },
]);
</script>
