<template>
    <div class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center p-6 pb-0 gap-4">
            <div>
                <h2 class="text-xl font-bold text-gray-900">News & Articles</h2>
                <p class="text-gray-400 text-sm mt-0.5">Manage all news content and publications</p>
            </div>
            <button @click="router.push({ name: 'createNews' })"
                class="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#1a365d] to-[#2a4a7f] text-white text-sm font-medium rounded-xl shadow-md shadow-[#1a365d]/15 hover:shadow-lg hover:-translate-y-0.5 transition-all">
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
                    class="w-full pl-11 pr-4 py-2.5 border border-gray-200 bg-gray-50/80 rounded-xl focus:ring-2 focus:ring-[#1a365d]/10 focus:border-[#1a365d] focus:bg-white outline-none transition-all text-sm"
                    @keyup.enter="onFilterChange"
                >
            </div>
            <select
                v-model="selectedCategoryId"
                class="border border-gray-200 bg-gray-50/80 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1a365d]/10 focus:border-[#1a365d] focus:bg-white outline-none cursor-pointer text-sm transition-all"
                @change="onFilterChange"
            >
                <option value="">All Categories</option>
                <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.id"
                >
                    {{ category.name }}
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
                                <div class="h-11 w-11 flex-shrink-0 rounded-xl overflow-hidden ring-1 ring-gray-100" v-if="article.thumbnail">
                                    <img class="h-11 w-11 object-cover" :src="article.thumbnail" alt="" />
                                </div>
                                <div class="h-11 w-11 flex-shrink-0 rounded-xl bg-[#1a365d]/5 flex items-center justify-center" v-else>
                                    <FileTextOutlined class="text-[#1a365d]/40" />
                                </div>
                                <div class="min-w-0">
                                    <div class="text-sm font-semibold text-gray-900 line-clamp-1">{{ article.title }}</div>
                                    <div class="text-xs text-gray-400 line-clamp-1 mt-0.5">{{ article.excerpt }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#1a365d]/8 text-[#1a365d]">
                                {{ article.category?.name || 'Uncategorized' }}
                            </span>
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
                                class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg"
                            >
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Public
                            </span>
                            <span
                                v-else-if="articleEffectiveStatus(article) === 'scheduled'"
                                class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a365d] bg-[#1a365d]/8 px-2.5 py-1 rounded-lg"
                            >
                                <span class="w-1.5 h-1.5 rounded-full bg-[#1a365d]"></span>
                                Scheduled
                            </span>
                            <span
                                v-else
                                class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg"
                            >
                                <span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                Draft
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div class="flex justify-end gap-1">
                                <button @click="$router.push({ name: 'editNews', params: { id: article.id } })"
                                    class="p-2 text-gray-400 hover:text-[#1a365d] hover:bg-[#1a365d]/5 rounded-lg transition-all">
                                    <EditOutlined />
                                </button>
                                <button @click="deleteArticle(article.id)"
                                    class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
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
        };

        if (searchQuery.value) {
            params.search = searchQuery.value;
        }

        if (selectedCategoryId.value) {
            params.category_id = selectedCategoryId.value;
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

const onFilterChange = () => {
    currentPage.value = 1;
    loadArticles();
};

const onPageChange = (page) => {
    currentPage.value = page;
    loadArticles();
};

const deleteArticle = async (id) => {
    if(!confirm("Are you sure you want to delete this article?")) return;
    try {
        await NewsService.deleteArticle(id);
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
