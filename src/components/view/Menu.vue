<template>
    <nav class="bg-white shadow-sm font-sans mb-4 sticky top-0 z-50">
        <div class="max-w-[1400px] mx-auto">
            <!-- Top Header Section -->
            <div class="flex flex-col md:flex-row justify-between items-center py-4 px-6 gap-4">
                <!-- Logo Section -->
                <div class="flex flex-col md:flex-row items-center md:items-end gap-3 text-center md:text-left cursor-pointer"
                    @click="router.push('/')">
                    <!-- You could add an image logo here if available -->
                    <div>
                        <h1 class="text-4xl font-extrabold tracking-tight text-blue-600 m-0 leading-none">CSC NEWS</h1>
                        <p class="text-lg font-medium text-gray-500 m-0 tracking-wide uppercase">Catholic Cambodia</p>
                    </div>
                </div>

                <!-- Search Section -->
                <div class="w-full md:w-1/3">
                    <div class="flex flex-col gap-1">
                        <span
                            class="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">ស្វែងរកព័ត៌មាន</span>
                        <a-input-search v-model:value="searchQuery" placeholder="ស្វែងរកអត្ថបទ..." enter-button="Search"
                            size="large" @search="performSearch" class="w-full" />
                    </div>
                </div>
            </div>

            <!-- Navigation Menu -->
            <div class="border-t border-gray-100">
                <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="handleClick"
                    class="justify-center md:justify-start border-none text-base font-medium" />
            </div>
        </div>
    </nav>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { useRouter } from 'vue-router';
import { MailOutlined, HomeOutlined, ReadOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { MenuProps } from 'ant-design-vue';

const searchQuery = ref('');
const router = useRouter();
const current = ref<string[]>(['/']);

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
        key: '/news', // Changed duplicate key to unique
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
/* Custom overrides for Ant Design Menu to match the modern look */
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
</style>
