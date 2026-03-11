<template>
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">News & Articles</h2>
                <p class="text-gray-500 text-sm">Manage all news content and publications</p>
            </div>
            <button @click="router.push({ name: 'createNews' })"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
                <PlusOutlined />
                <span>Create Article</span>
            </button>
        </div>

        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="relative flex-1">
                <SearchOutlined class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search articles by title..."
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    @keyup.enter="onFilterChange"
                >
            </div>
            <select
                v-model="selectedCategoryId"
                class="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
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
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Article</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Author</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="article in articles" :key="article.id" class="hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4">
                            <div class="flex items-center">
                                <div class="h-10 w-10 flex-shrink-0" v-if="article.thumbnail">
                                    <img class="h-10 w-10 rounded-lg object-cover" :src="article.thumbnail" alt="" />
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900 line-clamp-1">{{ article.title }}
                                    </div>
                                    <div class="text-xs text-gray-500 line-clamp-1">{{ article.excerpt }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span
                                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {{ article.category?.name || 'Uncategorized' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ article.author }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ article.publish_at || article.publish_at }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span v-if="article.status === 'published'"
                                class="text-green-600 text-xs font-bold flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-green-600"></span> Published
                            </span>
                            <span v-else class="text-gray-500 text-xs font-bold flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-gray-500"></span> Draft
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div class="flex justify-end gap-2">
                                <button @click="$router.push({ name: 'editNews', params: { id: article.id } })" class="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                                    <EditOutlined />
                                </button>
                                <button @click="deleteArticle(article.id)" class="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
                                    <DeleteOutlined />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="mt-4 flex justify-end">
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
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
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
