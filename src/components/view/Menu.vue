<template>
    <nav class="navbar">
        <div class="">
            <div clas="bg-transparent px-8 flex w-[1400px]">
                <section class="flex justify-between items-center p-2 border-b-1 border-blue-500 ">
                    <div class="">
                        <h2 class=" text-4xl font-bold text-blue-500">CSC NEWS</h2>
                        <h2 class=" text-2xl font-bold text-blue-500">Chatholic cambodia</h2>
                    </div>
                    <div>
                        <h2 class="mb-6 border-b-2 border-blue-500 pb-2 text-2xl font-bold text-blue-500">ស្វែងរកព័ត៌មាន
                        </h2>
                        <div class="flex">
                            <input v-model="searchQuery" @keyup.enter="performSearch" type="text"
                                placeholder="ស្វែងរកអត្ថបទ..."
                                class="w-full rounded-l border border-gray-300 p-2 focus:border-blue-500 focus:outline-none" />
                            <button @click="performSearch"
                                class="rounded-r bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600">Search</button>
                        </div>
                    </div>
                </section>
            </div>
            <section>
                <a-menu :selected-keys="current" mode="horizontal" :items="items" @click="handleClick"
                    class="bg-transparent !bg-transparent border-0" />
            </section>
        </div>
    </nav>
</template>
<script lang="ts" setup>
import { h, ref } from 'vue';
import { useRouter } from 'vue-router';
import { MailOutlined, HomeOutlined, ReadOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { MenuProps } from 'ant-design-vue';
const searchQuery = ref('')
const router = useRouter();
const current = ref<string[]>(['']);

const performSearch = () => {
    if (searchQuery.value.trim()) {
        router.push({ name: 'searchResults', query: { q: searchQuery.value } });
    }
};

const handleClick: MenuProps['onClick'] = (e) => {
    // Prevent router navigation for external links (handled by <a> tag in label)
    if (e.key === 'alipay') return;

    // Navigate based on key
    if (e.key === '') {
        router.push('/');
    } else {
        // Assumes other keys match your route paths or names
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
        key: '/bible',
        icon: () => h(ReadOutlined),
        label: 'ព្រះគម្ពីរ',
        title: 'ព្រះគម្ពីរ',
    },
    {
        key: 'sub1',
        icon: () => h(SettingOutlined),
        label: 'Navigation Three - Submenu',
        title: 'Navigation Three - Submenu',
        children: [
            {
                type: 'group',
                label: 'Item 1',
                children: [
                    {
                        label: 'Option 1',
                        key: 'setting:1',
                    },
                    {
                        label: 'Option 2',
                        key: 'setting:2',
                    },
                ],
            },
            {
                type: 'group',
                label: 'Item 2',
                children: [
                    {
                        label: 'Option 3',
                        key: 'setting:3',
                    },
                    {
                        label: 'Option 4',
                        key: 'setting:4',
                    },
                ],
            },
        ],
    },
    {
        key: 'alipay',
        label: h('a', { href: 'https://antdv.com', target: '_blank' }, 'Navigation Four - Link'),
        title: 'Navigation Four - Link',
    },
]);
</script>
