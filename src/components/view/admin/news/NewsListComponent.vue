<template>
    <div class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center p-6 pb-0 gap-4">
            <div>
                <h2 class="text-xl font-bold text-gray-900">News & Articles</h2>
                <p class="text-gray-400 text-sm mt-0.5">Manage all news content and publications</p>
            </div>
            <button @click="router.push({ name: 'createNews' })"
                class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <PlusOutlined />
                <span>Create Article</span>
            </button>
        </div>

        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-3 p-6">
            <div class="relative flex-1">
                <SearchOutlined class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search articles by title..."
                    class="w-full pl-11 pr-4 py-2.5 border border-gray-200 bg-gray-50/80 rounded-md focus:ring-2 focus:ring-[#4165d1]/10 focus:border-[#4165d1] focus:bg-white outline-none transition-all text-sm"
                    @keyup.enter="onFilterChange"
                >
            </div>
            <div class="flex items-center rounded-md border border-gray-200 bg-gray-50/80 p-0.5">
                <button
                    type="button"
                    class="px-3 py-2 rounded text-xs font-semibold transition-all"
                    :class="langFilter === '' ? 'bg-white text-[#4165d1] shadow-sm' : 'text-gray-500 hover:text-[#4165d1]'"
                    @click="setLangFilter('')"
                >All</button>
                <button
                    type="button"
                    class="px-3 py-2 rounded text-xs font-semibold transition-all"
                    :class="langFilter === 'km' ? 'bg-white text-[#4165d1] shadow-sm' : 'text-gray-500 hover:text-[#4165d1]'"
                    @click="setLangFilter('km')"
                >ខ្មែរ</button>
                <button
                    type="button"
                    class="px-3 py-2 rounded text-xs font-semibold transition-all"
                    :class="langFilter === 'en' ? 'bg-white text-[#4165d1] shadow-sm' : 'text-gray-500 hover:text-[#4165d1]'"
                    @click="setLangFilter('en')"
                >EN</button>
            </div>
            <select
                v-model="selectedCategoryId"
                class="border border-gray-200 bg-gray-50/80 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-[#4165d1]/10 focus:border-[#4165d1] focus:bg-white outline-none cursor-pointer text-sm transition-all"
                @change="onFilterChange"
            >
                <option value="">All Categories</option>
                <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.id"
                >
                    {{ category.name }}{{ category.lang ? ` (${category.lang})` : '' }}
                </option>
            </select>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-100">
                <thead>
                    <tr class="bg-gray-50/80">
                        <th class="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Article</th>
                        <th class="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Category</th>
                        <th class="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Author</th>
                        <th class="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Date</th>
                        <th class="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Status</th>
                        <th class="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    <tr v-for="article in articles" :key="article.id" class="hover:bg-gray-50/60 transition-colors">
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                <div class="h-11 w-16 flex-shrink-0 rounded-md overflow-hidden ring-1 ring-gray-100" v-if="article.thumbnail">
                                    <img class="h-11 w-16 object-cover" :src="article.thumbnail" alt="" />
                                </div>
                                <div class="h-11 w-16 flex-shrink-0 rounded-md bg-[#4165d1]/5 flex items-center justify-center" v-else>
                                    <FileTextOutlined class="text-[#4165d1]/40" />
                                </div>
                                <div class="min-w-0">
                                    <div class="flex items-center gap-2">
                                        <div class="text-sm font-semibold text-gray-900 line-clamp-1">{{ article.title }}</div>
                                        <span
                                            class="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide"
                                            :class="(article.lang || 'km') === 'en' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-800'"
                                        >{{ (article.lang || 'km').toUpperCase() }}</span>
                                    </div>
                                    <div class="text-xs text-gray-400 line-clamp-1 mt-0.5">{{ article.excerpt }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex flex-wrap gap-1.5">
                                <span
                                    v-for="cat in (article.categories?.length ? article.categories : (article.category ? [article.category] : []))"
                                    :key="cat.id || cat.slug || cat.name"
                                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#4165d1]/8 text-[#4165d1]"
                                >
                                    {{ cat.name }}
                                </span>
                                <span
                                    v-if="!(article.categories?.length) && !article.category"
                                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500"
                                >
                                    Uncategorized
                                </span>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ article.author }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {{ formatDate(article.publish_at || article.created_at) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span
                                v-if="articleEffectiveStatus(article) === 'public'"
                                class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full"
                            >
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Public
                            </span>
                            <span
                                v-else-if="articleEffectiveStatus(article) === 'scheduled'"
                                class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4165d1] bg-[#4165d1]/8 px-2.5 py-1 rounded-full"
                            >
                                <span class="w-1.5 h-1.5 rounded-full bg-[#4165d1]"></span>
                                Scheduled
                            </span>
                            <span
                                v-else
                                class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full"
                            >
                                <span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                Draft
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div class="flex justify-end gap-1 items-center">
                                <button
                                    v-if="missingLang(article)"
                                    type="button"
                                    @click="addTranslation(article, missingLang(article))"
                                    class="px-2 py-1 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-md text-xs font-bold transition-all"
                                    :title="`Add ${missingLang(article) === 'en' ? 'English' : 'Khmer'} translation`"
                                >
                                    +{{ (missingLang(article) || '').toUpperCase() }}
                                </button>
                                <button @click="$router.push({ name: 'editNews', params: { id: article.id } })"
                                    class="p-2 text-gray-400 hover:text-[#4165d1] hover:bg-[#4165d1]/5 rounded-md transition-all">
                                    <EditOutlined />
                                </button>
                                <button @click="deleteArticle(article)"
                                    class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all">
                                    <DeleteOutlined />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="p-6 pt-4 flex justify-end border-t border-gray-50">
            <a-pagination
                v-model:current="currentPage"
                :total="pagination.total_elements"
                :page-size="pagination.page_size"
                show-less-items
                @change="onPageChange"
            />
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons-vue';
import { NewsService } from '@/services/NewsService';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentPage = ref(1);
const pageSize = 10;
const articles = ref([]);
const categories = ref([]);
const searchQuery = ref('');
const selectedCategoryId = ref('');
const langFilter = ref('');
const pagination = ref({
    total_elements: 0,
    page_size: pageSize,
});

const formatDate = (value) => {
    if (!value) return '';
    const d = new Date(value);
    return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

const articleEffectiveStatus = (article) => {
    if (article.effective_status) {
        return article.effective_status;
    }

    if (article.status === 'draft') return 'draft';
    if (article.status === 'public') return 'public';

    if (article.status === 'scheduled') {
        if (!article.publish_at) return 'scheduled';
        return new Date(article.publish_at) <= new Date() ? 'public' : 'scheduled';
    }

    return article.status;
};

const loadArticles = async () => {
    try {
        const params = {
            skip: (currentPage.value - 1) * pageSize,
            limit: pageSize,
            public_only: false,
        };

        if (searchQuery.value) {
            params.search = searchQuery.value;
        }

        if (selectedCategoryId.value) {
            params.category_id = selectedCategoryId.value;
        }

        if (langFilter.value) {
            params.lang = langFilter.value;
        }

        const data = await NewsService.getAllArticles(params);
        articles.value = data.items || data;
        pagination.value = {
            total_elements: data.total_elements || (data.items ? data.items.length : 0),
            page_size: data.page_size || pageSize,
        };
    } catch (error) {
        console.error("Failed to load articles", error);
    }
};

const loadCategories = async () => {
    try {
        const data = await NewsService.getNewsCategories();
        categories.value = data.items || data;
    } catch (error) {
        console.error("Failed to load categories", error);
    }
};

const setLangFilter = (value) => {
    langFilter.value = value;
    onFilterChange();
};

/** Missing language for this article's translation group, or null if both exist. */
const missingLang = (article) => {
    const present = new Set(
        (article.group_langs || [article.lang || 'km']).map((l) => String(l).toLowerCase())
    );
    if (!present.has('en')) return 'en';
    if (!present.has('km')) return 'km';
    return null;
};

const addTranslation = (article, langCode) => {
    router.push({
        name: 'createNews',
        query: { translation_of: article.id, lang: langCode },
    });
};

const onFilterChange = () => {
    currentPage.value = 1;
    loadArticles();
};

const onPageChange = (page) => {
    currentPage.value = page;
    loadArticles();
};

const deleteArticle = async (article) => {
    if (!confirm('Delete this article translation?')) return;
    let includeTranslations = false;
    try {
        const translations = await NewsService.getTranslations(article.id);
        const others = (translations || []).filter(
            (t) => String(t.id) !== String(article.id)
        ).length;
        if (others > 0) {
            includeTranslations = confirm(
                `This article has ${others} other translation(s). Delete the entire group (all languages)?\n\nOK = delete all translations\nCancel = delete only this language`
            );
        }
    } catch (error) {
        console.warn('Could not load translations for delete prompt', error);
    }
    try {
        await NewsService.deleteArticle(article.id, { includeTranslations });
        await loadArticles();
    } catch (error) {
         console.error("Failed to delete", error);
         alert("Failed to delete article");
    }
}

onMounted(() => {
    loadArticles();
    loadCategories();
});

</script>
