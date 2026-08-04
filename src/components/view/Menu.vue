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
                        <p class="text-xs sm:text-lg font-semibold text-primary m-0 tracking-wide uppercase">
                            Catholic Cambodia
                        </p>
                    </div>
                </div>

                <!-- Desktop Search & Actions -->
                <div class="hidden md:flex flex-1 max-w-xl mx-8 justify-end items-center gap-3">
                    <div class="flex flex-1 min-w-0 items-center rounded-full bg-gray-50 pl-4 pr-1 py-1 ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-primary/25 transition-all">
                        <input
                            v-model="searchQuery"
                            type="search"
                            :placeholder="t('menu.searchPlaceholder')"
                            class="flex-1 min-w-0 py-2 bg-transparent border-0 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0 text-sm"
                            @keydown.enter="performSearch"
                        />
                        <button
                            type="button"
                            class="btn-primary shrink-0"
                            @click="performSearch"
                        >
                            {{ t('menu.search') }}
                        </button>
                    </div>
                    <!-- Language switcher -->
                    <div class="flex items-center rounded-full ring-1 ring-gray-200 bg-gray-50 p-0.5 shrink-0">
                        <button
                            type="button"
                            class="px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                            :class="lang === 'km' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-primary'"
                            @click="setLang('km')"
                        >ខ្មែរ</button>
                        <button
                            type="button"
                            class="px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                            :class="lang === 'en' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-primary'"
                            @click="setLang('en')"
                        >EN</button>
                    </div>
                    <router-link v-if="isAuthenticated" :to="{ name: 'dashboard' }"
                        class="btn-accent shrink-0 no-underline">
                        <DashboardIcon class="w-5 h-5" />
                        <span>{{ t('menu.dashboard') }}</span>
                    </router-link>
                </div>

                <button
                    type="button"
                    class="md:hidden p-2 text-gray-600 hover:text-primary transition-colors"
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
                                class="menu-link nav-link-brand block px-6 py-3">
                                {{ item.label }}
                            </a>
                            <router-link v-else :to="item.path!"
                                class="menu-link nav-link-brand block px-6 py-3 no-underline"
                                exact-active-class="is-active border-b-2 border-accent">
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
                                        ? 'text-primary font-semibold border-b-2 border-accent'
                                        : 'nav-link-brand'
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
                                class="menu-dropdown absolute left-0 top-full min-w-[220px] py-2 bg-white shadow-xl shadow-primary/8 ring-1 ring-primary/8 rounded-2xl z-50"
                                @mouseleave="itemDropdownKey(item) === 'news' ? (newsDropdownOpen = false) : (structureDropdownOpen = false)"
                            >
                                <router-link
                                    v-if="itemDropdownKey(item) === 'structure'"
                                    :to="item.path!"
                                    class="interactive-row interactive-row--tint block px-4 py-2 text-gray-800 font-medium border-b border-gray-100"
                                    @click="structureDropdownOpen = false"
                                >
                                    ទាំងអស់
                                </router-link>
                                <template v-for="group in item.children" :key="group.path || group.label">
                                    <div v-if="group.children?.length" class="py-1">
                                        <router-link
                                            :to="group.path!"
                                            class="interactive-row interactive-row--tint block px-4 py-2 text-gray-800 font-medium"
                                            @click="closeAllDesktopDropdowns"
                                        >
                                            {{ group.label }}
                                        </router-link>
                                        <router-link
                                            v-for="child in group.children"
                                            :key="child.path"
                                            :to="child.path!"
                                            class="interactive-row interactive-row--tint block py-1.5 pl-6 pr-4 text-gray-500 text-sm"
                                            @click="closeAllDesktopDropdowns"
                                        >
                                            {{ child.label }}
                                        </router-link>
                                    </div>
                                    <router-link
                                        v-else
                                        :to="group.path!"
                                        class="interactive-row interactive-row--tint block px-4 py-2 text-gray-600"
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
                        <h1 class="text-2xl font-extrabold text-primary leading-none">CSC NEWS</h1>
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
                        <h3 class="text-sm font-bold text-muted uppercase tracking-wider mb-2">{{ t('menu.search') }}</h3>
                        <div class="flex flex-1 min-w-0 items-center rounded-full bg-gray-50 pl-4 pr-1 py-1 ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-primary/25 transition-all">
                            <input
                                v-model="searchQuery"
                                type="search"
                                :placeholder="t('menu.searchPlaceholder')"
                                class="flex-1 min-w-0 py-2 bg-transparent border-0 focus:outline-none focus:ring-0"
                                @keydown.enter="() => { performSearch(); mobileMenuOpen = false; }"
                            />
                            <button
                                type="button"
                                class="btn-primary"
                                @click="() => { performSearch(); mobileMenuOpen = false; }"
                            >
                                {{ t('menu.search') }}
                            </button>
                        </div>
                        <div class="flex items-center gap-2 mt-3">
                            <div class="flex items-center rounded-full ring-1 ring-gray-200 bg-gray-50 p-0.5">
                                <button
                                    type="button"
                                    class="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                                    :class="lang === 'km' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-primary'"
                                    @click="setLang('km')"
                                >ខ្មែរ</button>
                                <button
                                    type="button"
                                    class="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                                    :class="lang === 'en' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-primary'"
                                    @click="setLang('en')"
                                >EN</button>
                            </div>
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
                            class="btn-accent w-full no-underline"
                            @click="mobileMenuOpen = false"
                        >
                            <DashboardIcon class="w-5 h-5" />
                            <span>{{ t('menu.dashboard') }}</span>
                        </router-link>
                    </div>

                    <div class="mt-auto pt-8 border-t border-stone-200/70">
                        <a href="#" class="block text-center text-muted text-sm mb-2">{{ t('menu.privacy') }}</a>
                        <div class="text-center text-stone-400 text-xs">{{ t('menu.copyright') }}</div>
                    </div>
                </div>
            </div>
        </transition>
    </nav>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuth } from '@/composables/useAuth';
import { useSiteLanguage } from '@/composables/useSiteLanguage';
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
    /** i18n key for static labels */
    labelKey?: string;
}

const searchQuery = ref('');
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const { lang, setLang } = useSiteLanguage();
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

const rawMenuItems = ref<MenuItem[]>([
    { labelKey: 'menu.home', label: '', path: '/' },
    { labelKey: 'menu.bible', label: '', path: '/read' },
    { labelKey: 'menu.news', label: '', path: '/news', children: [], dropdown: 'news' },
    { labelKey: 'menu.structure', label: '', path: '/structure', children: [], dropdown: 'structure' },
    { labelKey: 'menu.messenger', label: '', path: '/the-messenger' },
    { labelKey: 'menu.sermon', label: '', path: '/the-sermon' },
    { labelKey: 'menu.churchHistory', label: '', path: '/church-history' },
    { labelKey: 'menu.downloadApp', label: '', path: '/install-app' },
    { labelKey: 'menu.links', label: '', href: 'https://antdv.com' },
]);

const menuItems = computed(() =>
    rawMenuItems.value.map((item) => ({
        ...item,
        label: item.labelKey ? t(item.labelKey) : item.label,
    }))
);

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

function buildCategoryMenuChildren(categories: any): MenuChild[] {
    const list: any[] = Array.isArray(categories) ? categories : [];

    const parents = list
        .filter(c => !c.parent_id && c.status === 'active')
        .sort((a, b) => a.order_no - b.order_no);

    return parents.map(parent => {
        const children = list
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

async function loadCategoryMenu() {
    try {
        const categories = await CategoryService.getAllCategories({ lang: lang.value });
        const newsItem = rawMenuItems.value.find(item => item.path === '/news');
        if (newsItem) {
            newsItem.children = buildCategoryMenuChildren(categories);
        }
    } catch (error) {
        console.error('Failed to load category menu:', error);
    }
}

async function loadStructureMenu() {
    try {
        const pages = await StructurePageService.listPublic();
        const structureItem = rawMenuItems.value.find(item => item.dropdown === 'structure');
        if (structureItem && Array.isArray(pages) && pages.length) {
            structureItem.children = buildStructureMenuChildren(pages);
        } else if (structureItem) {
            structureItem.children = [...STRUCTURE_MENU_FALLBACK];
        }
    } catch (error) {
        console.error('Failed to load structure menu:', error);
        const structureItem = rawMenuItems.value.find(item => item.dropdown === 'structure');
        if (structureItem) {
            structureItem.children = [...STRUCTURE_MENU_FALLBACK];
        }
    }
}

onMounted(async () => {
    initAuth();
    await loadCategoryMenu();
    await loadStructureMenu();
});

watch(lang, () => {
    loadCategoryMenu();
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
