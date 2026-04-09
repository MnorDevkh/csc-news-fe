<template>
    <nav class="menu-nav bg-white/90 backdrop-blur-xl border-b border-gray-200/60 shadow-[0_1px_8px_rgba(26,54,93,0.04)] mb-3 sm:mb-4 sticky top-0 z-50 flex justify-center w-full font-[Kantumruy_Pro,'Khmer','Koh_Santepheap',sans-serif]">
        <div class="w-full max-w-[1400px] px-[5px] sm:px-5 md:px-6 lg:px-8 xl:px-10 mx-auto">

            <!-- Top Header Bar -->
            <div class="flex justify-between items-center py-3 sm:py-4">
                <div class="flex items-center gap-3 cursor-pointer z-50" @click="router.push('/')">
                    <img
                        src="/image/cropped-logo-1.jpg"
                        alt="CSC News logo"
                        class="h-10 sm:h-12 w-auto object-contain"
                    />
                    <div class="flex flex-col">
                        <!-- <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-blue-600 m-0 leading-none">
                            CSC NEWS</h1> -->
                        <p class="text-xs sm:text-lg font-semibold text-[#1a365d] m-0 tracking-wide uppercase">
                            Catholic Cambodia
                        </p>
                    </div>
                </div>

                <!-- Desktop Search & Actions -->
                <div class="hidden md:flex flex-1 max-w-xl mx-8 justify-end items-center gap-3">
                    <div class="flex flex-1 min-w-0 items-center rounded-full bg-gray-50 pl-4 pr-1 py-1 ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-[#1a365d]/20 transition-all">
                        <input
                            v-model="searchQuery"
                            type="search"
                            placeholder="ស្វែងរកអត្ថបទ..."
                            class="flex-1 min-w-0 py-2 bg-transparent border-0 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0 text-sm"
                            @keydown.enter="performSearch"
                        />
                        <button
                            type="button"
                            class="px-5 py-2 rounded-md bg-[#1a365d] text-white text-sm font-medium hover:bg-[#2a4a7f] shadow-sm shadow-[#1a365d]/15 shrink-0 transition-all"
                            @click="performSearch"
                        >
                            Search
                        </button>
                    </div>
                    <router-link v-if="isAuthenticated" :to="{ name: 'dashboard' }"
                        class="flex items-center gap-2 px-4 py-2 rounded-md bg-[#d4a853] text-white text-sm font-medium hover:bg-[#c49843] shadow-sm shadow-[#d4a853]/20 shrink-0 transition-all">
                        <DashboardIcon class="w-5 h-5" />
                        <span>Dashboard</span>
                    </router-link>
                </div>

                <button
                    type="button"
                    class="md:hidden p-2 text-gray-600 hover:text-[#1a365d] transition-colors"
                    aria-label="Open menu"
                    @click="mobileMenuOpen = true"
                >
                    <MenuIcon class="w-6 h-6" />
                </button>
            </div>

            <!-- Desktop Navigation Menu -->
            <div class="hidden md:block border-t border-gray-100">
                <ul class="menu-list flex flex-wrap items-center gap-0 list-none m-0 p-0 text-base font-medium">
                    <li v-for="item in menuItems" :key="item.path || item.href" class="menu-item-wrapper relative">
                        <!-- Simple link -->
                        <template v-if="!item.children?.length">
                            <a v-if="item.href" :href="item.href" target="_blank" rel="noopener"
                                class="menu-link block px-6 py-3 text-gray-600 hover:text-[#1a365d] transition-colors">
                                {{ item.label }}
                            </a>
                            <router-link v-else :to="item.path!"
                                class="menu-link block px-6 py-3 no-underline text-gray-600 hover:text-[#1a365d] transition-colors"
                                exact-active-class="!text-[#1a365d] !font-semibold border-b-2 border-[#d4a853]">
                                {{ item.label }}
                            </router-link>
                        </template>
                        <!-- Dropdown (News or Structure) -->
                        <template v-else>
                            <button
                                type="button"
                                class="menu-link menu-dropdown-trigger flex items-center gap-1 px-6 py-3 w-full text-left border-0 bg-transparent cursor-pointer transition-colors"
                                :class="
                                    (itemDropdownKey(item) === 'news' ? isNewsActive : isStructureActive)
                                        ? 'text-[#1a365d] font-semibold border-b-2 border-[#d4a853]'
                                        : 'text-gray-600 hover:text-[#1a365d]'
                                "
                                :aria-expanded="itemDropdownKey(item) === 'news' ? newsDropdownOpen : structureDropdownOpen"
                                aria-haspopup="true"
                                @click="
                                    itemDropdownKey(item) === 'news'
                                        ? (newsDropdownOpen = !newsDropdownOpen, (structureDropdownOpen = false))
                                        : (structureDropdownOpen = !structureDropdownOpen, (newsDropdownOpen = false))
                                "
                                @mouseenter="
                                    itemDropdownKey(item) === 'news'
                                        ? ((newsDropdownOpen = true), (structureDropdownOpen = false))
                                        : ((structureDropdownOpen = true), (newsDropdownOpen = false))
                                "
                            >
                                {{ item.label }}
                                <ChevronIcon
                                    :class="[
                                        'w-4 h-4 transition-transform',
                                        (itemDropdownKey(item) === 'news' ? newsDropdownOpen : structureDropdownOpen) &&
                                            'rotate-180',
                                    ]"
                                />
                            </button>
                            <div
                                v-show="itemDropdownKey(item) === 'news' ? newsDropdownOpen : structureDropdownOpen"
                                class="menu-dropdown absolute left-0 top-full min-w-[220px] py-2 bg-white shadow-xl shadow-gray-200/50 ring-1 ring-gray-100 rounded-2xl z-50"
                                @mouseleave="itemDropdownKey(item) === 'news' ? (newsDropdownOpen = false) : (structureDropdownOpen = false)"
                            >
                                <router-link
                                    v-if="itemDropdownKey(item) === 'structure'"
                                    :to="item.path!"
                                    class="block px-4 py-2 text-gray-800 font-medium hover:bg-gray-50 hover:text-[#1a365d] border-b border-gray-100 transition-colors"
                                    @click="structureDropdownOpen = false"
                                >
                                    ទាំងអស់
                                </router-link>
                                <template v-for="group in item.children" :key="group.path || group.label">
                                    <div v-if="group.children?.length" class="py-1">
                                        <router-link
                                            :to="group.path!"
                                            class="block px-4 py-2 text-gray-800 font-medium hover:bg-gray-50 hover:text-[#1a365d] transition-colors"
                                            @click="closeAllDesktopDropdowns"
                                        >
                                            {{ group.label }}
                                        </router-link>
                                        <router-link
                                            v-for="child in group.children"
                                            :key="child.path"
                                            :to="child.path!"
                                            class="block py-1.5 pl-6 pr-4 text-gray-500 hover:bg-gray-50 hover:text-[#1a365d] text-sm transition-colors"
                                            @click="closeAllDesktopDropdowns"
                                        >
                                            {{ child.label }}
                                        </router-link>
                                    </div>
                                    <router-link
                                        v-else
                                        :to="group.path!"
                                        class="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-[#1a365d] transition-colors"
                                        @click="closeAllDesktopDropdowns"
                                    >
                                        {{ group.label }}
                                    </router-link>
                                </template>
                            </div>
                        </template>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Mobile Full Screen Menu Overlay -->
        <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-x-full"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 translate-x-full"
        >
            <div v-if="mobileMenuOpen"
                class="fixed inset-0 z-[60] bg-white flex flex-col overflow-y-auto w-full h-full">
                <div class="flex justify-between items-center p-4 border-b border-gray-200/70 bg-white/95 backdrop-blur-xl sticky top-0 z-10">
                    <div class="flex items-center gap-2">
                        <img
                            src="/image/cropped-logo-1.jpg"
                            alt="CSC News logo"
                            class="h-8 w-auto object-contain"
                        />
                        <h1 class="text-2xl font-extrabold text-[#1a365d] leading-none">CSC NEWS</h1>
                    </div>
                    <button
                        type="button"
                        class="p-2 text-gray-500 hover:text-red-500 transition-colors"
                        aria-label="Close menu"
                        @click="mobileMenuOpen = false"
                    >
                        <CloseIcon class="w-6 h-6" />
                    </button>
                </div>

                <div class="flex-1 p-6 flex flex-col gap-8">
                    <div>
                        <h3 class="text-sm font-bold text-muted uppercase tracking-wider mb-2">Search</h3>
                        <div class="flex flex-1 min-w-0 items-center rounded-full bg-gray-50 pl-4 pr-1 py-1 ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-[#1a365d]/20 transition-all">
                            <input
                                v-model="searchQuery"
                                type="search"
                                placeholder="Search news..."
                                class="flex-1 min-w-0 py-2 bg-transparent border-0 focus:outline-none focus:ring-0"
                                @keydown.enter="() => { performSearch(); mobileMenuOpen = false; }"
                            />
                            <button
                                type="button"
                                class="px-4 py-2 rounded-md bg-[#1a365d] text-white text-sm font-medium hover:bg-[#2a4a7f] shadow-sm transition-all"
                                @click="() => { performSearch(); mobileMenuOpen = false; }"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    <div class="flex-1">
                        <h3 class="text-sm font-bold text-muted uppercase tracking-wider mb-2">Menu</h3>
                        <ul class="mobile-menu-list list-none p-0 m-0 flex flex-col text-lg">
                            <template v-for="item in menuItems" :key="item.path || item.href">
                                <template v-if="!item.children?.length">
                                    <li v-if="item.href">
                                        <a :href="item.href" target="_blank" rel="noopener"
                                            class="block py-3 text-stone-700 hover:text-primary"
                                            @click="mobileMenuOpen = false">
                                            {{ item.label }}
                                        </a>
                                    </li>
                                    <li v-else>
                                        <router-link
                                            :to="item.path!"
                                            class="block py-3 text-stone-700 hover:text-primary"
                                            :class="{ 'text-primary font-medium': route.path === item.path }"
                                            @click="mobileMenuOpen = false"
                                        >
                                            {{ item.label }}
                                        </router-link>
                                    </li>
                                </template>
                                <li v-else>
                                    <button
                                        type="button"
                                        class="flex items-center justify-between w-full py-3 text-left text-stone-700 hover:text-primary"
                                        @click="
                                            itemDropdownKey(item) === 'news'
                                                ? (mobileNewsOpen = !mobileNewsOpen)
                                                : (mobileStructureOpen = !mobileStructureOpen)
                                        "
                                    >
                                        {{ item.label }}
                                        <ChevronIcon
                                            :class="[
                                                'w-5 h-5 transition-transform',
                                                (itemDropdownKey(item) === 'news' ? mobileNewsOpen : mobileStructureOpen) &&
                                                    'rotate-180',
                                            ]"
                                        />
                                    </button>
                                    <div
                                        v-show="itemDropdownKey(item) === 'news' ? mobileNewsOpen : mobileStructureOpen"
                                        class="pl-4 pb-2"
                                    >
                                        <router-link
                                            v-if="itemDropdownKey(item) === 'structure' && item.path"
                                            :to="item.path"
                                            class="block py-2 text-stone-800 font-medium"
                                            :class="{ 'text-primary': route.path === item.path }"
                                            @click="mobileMenuOpen = false"
                                        >
                                            ទាំងអស់
                                        </router-link>
                                        <template v-for="group in item.children" :key="group.path || group.label">
                                            <div v-if="group.children?.length" class="py-2">
                                                <router-link
                                                    :to="group.path!"
                                                    class="block py-2 text-stone-800 font-medium"
                                                    :class="{ 'text-primary': route.path === group.path }"
                                                    @click="mobileMenuOpen = false"
                                                >
                                                    {{ group.label }}
                                                </router-link>
                                                <router-link
                                                    v-for="child in group.children"
                                                    :key="child.path"
                                                    :to="child.path!"
                                                    class="block py-1.5 text-stone-600 text-base"
                                                    :class="{ 'text-primary': route.path === child.path }"
                                                    @click="mobileMenuOpen = false"
                                                >
                                                    {{ child.label }}
                                                </router-link>
                                            </div>
                                            <router-link
                                                v-else
                                                :to="group.path!"
                                                class="block py-2 text-stone-700"
                                                :class="{ 'text-primary font-medium': route.path === group.path }"
                                                @click="mobileMenuOpen = false"
                                            >
                                                {{ group.label }}
                                            </router-link>
                                        </template>
                                    </div>
                                </li>
                            </template>
                        </ul>
                    </div>

                    <div v-if="isAuthenticated" class="pt-4 border-t border-stone-200/70">
                        <router-link
                            :to="{ name: 'dashboard' }"
                            class="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary-hover"
                            @click="mobileMenuOpen = false"
                        >
                            <DashboardIcon class="w-5 h-5" />
                            <span>Dashboard</span>
                        </router-link>
                    </div>

                    <div class="mt-auto pt-8 border-t border-stone-200/70">
                        <a href="#" class="block text-center text-muted text-sm mb-2">Privacy Policy</a>
                        <div class="text-center text-stone-400 text-xs">© 2026 CSC News. All rights reserved.</div>
                    </div>
                </div>
            </div>
        </transition>
    </nav>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { CategoryService } from '@/services/CategoryService';
import { StructurePageService } from '@/services/StructurePageService';
import MenuIcon from './icons/MenuIcon.vue';
import CloseIcon from './icons/CloseIcon.vue';
import ChevronIcon from './icons/ChevronIcon.vue';
import DashboardIcon from './icons/DashboardIcon.vue';

interface MenuChild {
    label: string;
    path: string;
    children?: MenuChild[];
}

interface MenuItem {
    label: string;
    path?: string;
    href?: string;
    children?: MenuChild[];
    /** Which dropdown state to use when item has children */
    dropdown?: 'news' | 'structure';
}

const searchQuery = ref('');
const router = useRouter();
const route = useRoute();
const { isAuthenticated, initAuth } = useAuth();

const mobileMenuOpen = ref(false);
const newsDropdownOpen = ref(false);
const structureDropdownOpen = ref(false);
const mobileNewsOpen = ref(false);
const mobileStructureOpen = ref(false);

const STRUCTURE_MENU_FALLBACK: MenuChild[] = [
    { label: 'ក្រុមលោកអភិបាល', path: '/structure/bishops-council' },
    { label: 'លោកអភិបាលទទួលបន្ទុក', path: '/structure/bishop-portfolios' },
    { label: 'សភាលោកអភិបាល ឡាវ _កម្ពុជា', path: '/structure/bishops-conference-laos-cambodia' },
    { label: 'គណៈកម្មការអន្តរភូមិភាគ', path: '/structure/inter-diocesan-committee' },
];

const menuItems = ref<MenuItem[]>([
    { label: 'ទំព័រដើម', path: '/' },
    { label: 'ព្រះគម្ពីរ', path: '/read' },
    { label: 'ពត៌មាន', path: '/news', children: [], dropdown: 'news' },
    { label: 'រចនាសម្ព័ន្ធព្រះសហគមន៍', path: '/structure', children: [], dropdown: 'structure' },
    { label: 'The Messenger', path: '/the-messenger' },
    { label: 'ប្រវត្តិព្រះសហគមន៍', path: '/church-history' },
    { label: 'Download App', path: '/install-app' },
    { label: 'Links', href: 'https://antdv.com' },
]);

const isNewsActive = computed(() => {
    const path = route.path;
    return path.startsWith('/news');
});

const isStructureActive = computed(() => route.path.startsWith('/structure'));

function itemDropdownKey(item: MenuItem): 'news' | 'structure' {
    return item.dropdown === 'structure' ? 'structure' : 'news';
}

function closeAllDesktopDropdowns() {
    newsDropdownOpen.value = false;
    structureDropdownOpen.value = false;
}

function buildCategoryMenuChildren(categories: any[]): MenuChild[] {
    const parents = categories
        .filter(c => !c.parent_id && c.status === 'active')
        .sort((a, b) => a.order_no - b.order_no);

    return parents.map(parent => {
        const children = categories
            .filter(c => c.parent_id === parent.id && c.status === 'active')
            .sort((a, b) => a.order_no - b.order_no)
            .map(child => ({
                label: child.name,
                path: `/category/${child.slug}`,
            }));

        if (children.length > 0) {
            return {
                label: parent.name,
                path: `/category/${parent.slug}`,
                children,
            };
        }
        return {
            label: parent.name,
            path: `/category/${parent.slug}`,
        };
    });
}

const performSearch = () => {
    if (searchQuery.value.trim()) {
        router.push({ name: 'searchResults', query: { q: searchQuery.value } });
    }
};

function buildStructureMenuChildren(pages: { slug: string; title?: string | null }[]): MenuChild[] {
    return pages.map((p) => ({
        label: p.title || p.slug,
        path: `/structure/${p.slug}`,
    }));
}

onMounted(async () => {
    initAuth();
    try {
        const categories = await CategoryService.getAllCategories();
        const newsItem = menuItems.value.find(item => item.path === '/news');
        if (newsItem) {
            newsItem.children = buildCategoryMenuChildren(categories);
        }
    } catch (error) {
        console.error('Failed to load category menu:', error);
    }
    try {
        const pages = await StructurePageService.listPublic();
        const structureItem = menuItems.value.find(item => item.dropdown === 'structure');
        if (structureItem && Array.isArray(pages) && pages.length) {
            structureItem.children = buildStructureMenuChildren(pages);
        } else if (structureItem) {
            structureItem.children = [...STRUCTURE_MENU_FALLBACK];
        }
    } catch (error) {
        console.error('Failed to load structure menu:', error);
        const structureItem = menuItems.value.find(item => item.dropdown === 'structure');
        if (structureItem) {
            structureItem.children = [...STRUCTURE_MENU_FALLBACK];
        }
    }
});
</script>

<style scoped>
.menu-list .menu-link::after {
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: transparent;
    margin: 0 24px;
}
.menu-list .menu-link.border-b-2::after,
.menu-list .menu-dropdown-trigger.border-b-2::after {
    background: var(--color-primary);
}
.rotate-180 {
    transform: rotate(180deg);
}
</style>
