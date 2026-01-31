<template>
    <nav class="bg-white shadow-sm font-sans mb-4 sticky top-0 z-50 flex justify-center w-full">
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
                <div class="hidden md:flex flex-1 max-w-xl mx-8 justify-end">
                    <div class="flex items-center gap-2 w-full">
                        <a-input-search v-model:value="searchQuery" placeholder="ស្វែងរកអត្ថបទ..." enter-button="Search"
                            size="large" @search="performSearch" class="w-full" />
                    </div>
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
import { h, ref } from 'vue';
import { useRouter } from 'vue-router';
import { MailOutlined, HomeOutlined, ReadOutlined, SettingOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { MenuProps } from 'ant-design-vue';

const searchQuery = ref('');
const router = useRouter();
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
        key: '/bible/types',
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
                label: 'ពត៌មានផ្សេងៗ',
                children: [
                    {
                        label: 'Option 1',
                        key: 'other:1',
                    },
                    {
                        label: 'Option 2',
                        key: 'other:2',
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

<style scoped>
/* Custom overrides for Ant Design Menu */
:deep(.ant-menu-horizontal) {
    border-bottom: none;
    line-height: 46px;
}

:deep(.ant-menu-item) {
    padding: 0 24px;
}

:deep(.ant-menu-item-selected),
:deep(.ant-menu-submenu-selected) {
    color: #2563eb !important;
    /* Tailwind blue-600 */
}

:deep(.ant-menu-item::after),
:deep(.ant-menu-submenu::after) {
    border-bottom-width: 2px !important;
    border-bottom-color: #2563eb !important;
}

/* Mobile Menu Overrides to make it look clean */
:deep(.ant-menu-inline .ant-menu-item) {
    height: 50px;
    line-height: 50px;
    margin-bottom: 8px;
}

:deep(.ant-menu-inline) {
    border-right: none;
}
</style>
