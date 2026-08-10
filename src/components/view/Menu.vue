<template>
    <nav class="menu-nav sticky top-0 z-50 mb-0 flex w-full justify-center border-b border-line/70 bg-ivory/95 backdrop-blur-md shadow-soft">
        <div class="container-site w-full px-3 sm:px-5 md:px-6 lg:px-8 xl:px-10 mx-auto">

            <!-- Top Header Bar -->
            <div class="flex justify-between items-center py-3 sm:py-3.5">
                <div class="group flex min-w-0 items-center gap-2.5 sm:gap-3 cursor-pointer z-50" @click="router.push('/')">
                    <img
                        src="/image/cropped-logo-1.jpg"
                        alt="CSC News logo"
                        class="h-10 sm:h-11 w-auto object-contain"
                    />
                    <div class="flex min-w-0 flex-col">
                        <p class="font-display m-0 truncate text-base font-semibold tracking-wide text-navy sm:text-xl">
                            CSC News
                        </p>
                        <p class="m-0 hidden text-[10px] font-medium tracking-[0.18em] text-primary uppercase sm:block">
                            {{ t('menu.tagline') }}
                        </p>
                    </div>
                </div>

                <!-- Desktop Search & Actions -->
                <div class="hidden md:flex flex-1 max-w-xl mx-8 justify-end items-center gap-3">
                    <div class="flex flex-1 min-w-0 items-center border border-line bg-surface-elevated pl-4 pr-1 py-1 focus-within:border-primary transition-all">
                        <input
                            v-model="searchQuery"
                            type="search"
                            :placeholder="t('menu.searchPlaceholder')"
                            class="flex-1 min-w-0 py-2 bg-transparent border-0 text-ink placeholder:text-muted focus:outline-none focus:ring-0 text-sm"
                            @keydown.enter="performSearch"
                        />
                        <button
                            type="button"
                            class="px-5 py-2 bg-navy text-cream text-sm font-semibold hover:bg-primary-hover shrink-0 transition-all"
                            @click="performSearch"
                        >
                            {{ t('menu.search') }}
                        </button>
                    </div>
                    <!-- Language switcher -->
                    <div class="flex items-center border border-line bg-surface-sunken p-0.5 shrink-0">
                        <button
                            type="button"
                            class="px-2.5 py-1.5 text-xs font-semibold transition-all"
                            :class="lang === 'km' ? 'bg-navy text-cream' : 'text-muted hover:text-primary'"
                            @click="setLang('km')"
                        >{{ t('lang.km') }}</button>
                        <button
                            type="button"
                            class="px-2.5 py-1.5 text-xs font-semibold transition-all"
                            :class="lang === 'en' ? 'bg-navy text-cream' : 'text-muted hover:text-primary'"
                            @click="setLang('en')"
                        >{{ t('lang.en') }}</button>
                    </div>
                    <router-link v-if="isAuthenticated" :to="{ name: 'dashboard' }"
                        class="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold hover:bg-primary-hover shrink-0 transition-all">
                        <DashboardIcon class="w-5 h-5" />
                        <span>{{ t('menu.dashboard') }}</span>
                    </router-link>
                </div>

                <button
                    type="button"
                    class="md:hidden inline-flex h-11 w-11 items-center justify-center border border-navy/20 bg-surface-elevated text-navy hover:border-primary hover:text-primary transition-colors"
                    :aria-label="t('menu.openMenu')"
                    @click="mobileMenuOpen = true"
                >
                    <MenuIcon class="w-6 h-6" />
                </button>
            </div>

            <!-- Desktop Navigation Menu -->
            <div class="hidden md:block border-t border-line/60">
                <ul class="menu-list flex flex-wrap items-center gap-0 list-none m-0 p-0 text-[13px] font-medium tracking-wide">
                    <li v-for="item in menuItems" :key="item.path || item.href" class="menu-item-wrapper relative">
                        <!-- Simple link -->
                        <template v-if="!item.children?.length">
                            <a v-if="item.href" :href="item.href" target="_blank" rel="noopener"
                                class="menu-link block px-4 lg:px-5 py-3 text-ink-soft hover:text-primary transition-colors">
                                {{ item.label }}
                            </a>
                            <router-link v-else :to="item.path!"
                                class="menu-link block px-4 lg:px-5 py-3 no-underline text-ink-soft hover:text-primary transition-colors"
                                exact-active-class="!text-primary !font-semibold border-b-2 border-primary">
                                {{ item.label }}
                            </router-link>
                        </template>
                        <!-- Dropdown (News or Structure) -->
                        <template v-else>
                            <button
                                type="button"
                                class="menu-link menu-dropdown-trigger flex items-center gap-1 px-4 lg:px-5 py-3 w-full text-left border-0 bg-transparent cursor-pointer transition-colors"
                                :class="
                                    (itemDropdownKey(item) === 'news' ? isNewsActive : isStructureActive)
                                        ? 'text-primary font-semibold border-b-2 border-primary'
                                        : 'text-ink-soft hover:text-primary'
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
                                class="menu-dropdown absolute left-0 top-full min-w-[240px] py-2 bg-ivory border border-line shadow-soft z-50"
                                @mouseleave="itemDropdownKey(item) === 'news' ? (newsDropdownOpen = false) : (structureDropdownOpen = false)"
                            >
                                <router-link
                                    v-if="itemDropdownKey(item) === 'structure'"
                                    :to="item.path!"
                                    class="block px-4 py-2.5 text-navy font-medium hover:bg-cream-dark hover:text-primary border-b border-line transition-colors"
                                    @click="structureDropdownOpen = false"
                                >
                                    {{ t('menu.all') }}
                                </router-link>
                                <template v-for="group in item.children" :key="group.path || group.label">
                                    <div v-if="group.children?.length" class="py-1">
                                        <router-link
                                            :to="group.path!"
                                            class="block px-4 py-2 text-navy font-medium hover:bg-cream-dark hover:text-primary transition-colors"
                                            @click="closeAllDesktopDropdowns"
                                        >
                                            {{ group.label }}
                                        </router-link>
                                        <router-link
                                            v-for="child in group.children"
                                            :key="child.path"
                                            :to="child.path!"
                                            class="block py-1.5 pl-6 pr-4 text-ink-soft hover:bg-cream-dark hover:text-primary text-sm transition-colors"
                                            @click="closeAllDesktopDropdowns"
                                        >
                                            {{ child.label }}
                                        </router-link>
                                    </div>
                                    <router-link
                                        v-else
                                        :to="group.path!"
                                        class="block px-4 py-2.5 text-ink-soft hover:bg-cream-dark hover:text-primary transition-colors"
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
                class="fixed inset-0 z-[60] bg-ivory flex flex-col overflow-y-auto w-full h-full">
                <div class="flex justify-between items-center p-4 border-b border-line bg-ivory/95 backdrop-blur-md sticky top-0 z-10">
                    <div class="flex items-center gap-2.5">
                        <img
                            src="/image/cropped-logo-1.jpg"
                            alt="CSC News logo"
                            class="h-8 w-auto object-contain"
                        />
                        <h1 class="font-display text-xl font-semibold text-navy leading-none m-0">CSC News</h1>
                    </div>
                    <button
                        type="button"
                        class="inline-flex h-10 w-10 items-center justify-center border border-navy/15 text-navy hover:text-primary transition-colors"
                        :aria-label="t('menu.closeMenu')"
                        @click="mobileMenuOpen = false"
                    >
                        <CloseIcon class="w-6 h-6" />
                    </button>
                </div>

                <div class="flex-1 p-5 flex flex-col gap-8">
                    <div>
                        <h3 class="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">{{ t('menu.search') }}</h3>
                        <div class="flex flex-1 min-w-0 items-center border border-line bg-surface-elevated pl-4 pr-1 py-1 focus-within:border-primary transition-all">
                            <input
                                v-model="searchQuery"
                                type="search"
                                :placeholder="t('menu.searchPlaceholder')"
                                class="flex-1 min-w-0 py-2 bg-transparent border-0 focus:outline-none focus:ring-0"
                                @keydown.enter="() => { performSearch(); mobileMenuOpen = false; }"
                            />
                            <button
                                type="button"
                                class="px-4 py-2 bg-navy text-cream text-sm font-semibold hover:bg-primary-hover transition-all"
                                @click="() => { performSearch(); mobileMenuOpen = false; }"
                            >
                                {{ t('menu.search') }}
                            </button>
                        </div>
                        <div class="flex items-center gap-2 mt-3">
                            <div class="flex items-center border border-line bg-surface-sunken p-0.5">
                                <button
                                    type="button"
                                    class="px-3 py-1.5 text-xs font-semibold transition-all"
                                    :class="lang === 'km' ? 'bg-navy text-cream' : 'text-muted'"
                                    @click="setLang('km')"
                                >{{ t('lang.km') }}</button>
                                <button
                                    type="button"
                                    class="px-3 py-1.5 text-xs font-semibold transition-all"
                                    :class="lang === 'en' ? 'bg-navy text-cream' : 'text-muted'"
                                    @click="setLang('en')"
                                >{{ t('lang.en') }}</button>
                            </div>
                        </div>
                    </div>

                    <div class="flex-1">
                        <h3 class="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">{{ t('menu.navTitle') }}</h3>
                        <ul class="mobile-menu-list list-none p-0 m-0 flex flex-col text-base">
                            <template v-for="item in menuItems" :key="item.path || item.href">
                                <template v-if="!item.children?.length">
                                    <li v-if="item.href">
                                        <a :href="item.href" target="_blank" rel="noopener"
                                            class="block rounded-sm px-3 py-3.5 text-ink-soft hover:bg-cream hover:text-primary"
                                            @click="mobileMenuOpen = false">
                                            {{ item.label }}
                                        </a>
                                    </li>
                                    <li v-else>
                                        <router-link
                                            :to="item.path!"
                                            class="block rounded-sm px-3 py-3.5 text-ink-soft hover:bg-cream hover:text-primary"
                                            :class="{ 'bg-cream-dark text-primary font-medium': route.path === item.path }"
                                            @click="mobileMenuOpen = false"
                                        >
                                            {{ item.label }}
                                        </router-link>
                                    </li>
                                </template>
                                <li v-else>
                                    <button
                                        type="button"
                                        class="flex items-center justify-between w-full rounded-sm px-3 py-3.5 text-left text-ink-soft hover:bg-cream hover:text-primary"
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
                                            class="block py-2 px-3 text-navy font-medium"
                                            :class="{ 'text-primary': route.path === item.path }"
                                            @click="mobileMenuOpen = false"
                                        >
                                            {{ t('menu.all') }}
                                        </router-link>
                                        <template v-for="group in item.children" :key="group.path || group.label">
                                            <div v-if="group.children?.length" class="py-2">
                                                <router-link
                                                    :to="group.path!"
                                                    class="block py-2 px-3 text-navy font-medium"
                                                    :class="{ 'text-primary': route.path === group.path }"
                                                    @click="mobileMenuOpen = false"
                                                >
                                                    {{ group.label }}
                                                </router-link>
                                                <router-link
                                                    v-for="child in group.children"
                                                    :key="child.path"
                                                    :to="child.path!"
                                                    class="block py-1.5 px-3 text-ink-soft text-sm"
                                                    :class="{ 'text-primary': route.path === child.path }"
                                                    @click="mobileMenuOpen = false"
                                                >
                                                    {{ child.label }}
                                                </router-link>
                                            </div>
                                            <router-link
                                                v-else
                                                :to="group.path!"
                                                class="block py-2 px-3 text-ink-soft"
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

                    <div v-if="isAuthenticated" class="pt-4 border-t border-line">
                        <router-link
                            :to="{ name: 'dashboard' }"
                            class="flex items-center justify-center gap-2 w-full py-3 px-4 bg-navy text-cream font-semibold hover:bg-primary-hover"
                            @click="mobileMenuOpen = false"
                        >
                            <DashboardIcon class="w-5 h-5" />
                            <span>{{ t('menu.dashboard') }}</span>
                        </router-link>
                    </div>

                    <div class="mt-auto pt-8 border-t border-line">
                        <a href="#" class="block text-center text-muted text-sm mb-2">{{ t('menu.privacy') }}</a>
                        <div class="text-center text-muted/70 text-xs">{{ t('menu.copyright') }}</div>
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
    labelKey?: string;
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
    { labelKey: 'menu.structureBishopsCouncil', label: '', path: '/structure/bishops-council' },
    { labelKey: 'menu.structureBishopPortfolios', label: '', path: '/structure/bishop-portfolios' },
    { labelKey: 'menu.structureBishopsConference', label: '', path: '/structure/bishops-conference-laos-cambodia' },
    { labelKey: 'menu.structureInterDiocesan', label: '', path: '/structure/inter-diocesan-committee' },
];

function resolveMenuChildLabels(children: MenuChild[]): MenuChild[] {
    return children.map((child) => ({
        ...child,
        label: child.labelKey ? t(child.labelKey) : child.label,
        children: child.children ? resolveMenuChildLabels(child.children) : undefined,
    }));
}

const rawMenuItems = ref<MenuItem[]>([
    { labelKey: 'menu.home', label: '', path: '/' },
    { labelKey: 'menu.bible', label: '', path: '/read' },
    { labelKey: 'menu.news', label: '', path: '/news', children: [], dropdown: 'news' },
    { labelKey: 'menu.structure', label: '', path: '/structure', children: [], dropdown: 'structure' },
    { labelKey: 'menu.messenger', label: '', path: '/the-messenger' },
    { labelKey: 'menu.sermon', label: '', path: '/the-sermon' },
    { labelKey: 'menu.churchHistory', label: '', path: '/church-history' },
]);

const menuItems = computed(() =>
    rawMenuItems.value.map((item) => ({
        ...item,
        label: item.labelKey ? t(item.labelKey) : item.label,
        children: item.children?.length ? resolveMenuChildLabels(item.children) : item.children,
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
            structureItem.children = STRUCTURE_MENU_FALLBACK.map((item) => ({ ...item }));
        }
    } catch (error) {
        console.error('Failed to load structure menu:', error);
        const structureItem = rawMenuItems.value.find(item => item.dropdown === 'structure');
        if (structureItem) {
            structureItem.children = STRUCTURE_MENU_FALLBACK.map((item) => ({ ...item }));
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
    margin: 0 16px;
}
.menu-list .menu-link.border-b-2::after,
.menu-list .menu-dropdown-trigger.border-b-2::after {
    background: var(--color-gold);
}
.rotate-180 {
    transform: rotate(180deg);
}
</style>
