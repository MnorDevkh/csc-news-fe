<template>
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">News & Articles</h2>
                <p class="text-gray-500 text-sm">Manage all news content and publications</p>
            </div>
            <button
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
                <PlusOutlined />
                <span>Create Article</span>
            </button>
        </div>

        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="relative flex-1">
                <SearchOutlined class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search articles by title..."
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all">
            </div>
            <select
                class="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer">
                <option value="">All Categories</option>
                <option value="Local">Local News</option>
                <option value="Vatican">Vatican</option>
                <option value="Events">Events</option>
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
                                <div class="h-10 w-10 flex-shrink-0">
                                    <img class="h-10 w-10 rounded-lg object-cover" :src="article.image" alt="" />
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900 line-clamp-1">{{ article.title }}
                                    </div>
                                    <div class="text-xs text-gray-500 line-clamp-1">{{ article.snippet }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span
                                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {{ article.category }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ article.author }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ article.date }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span v-if="article.status === 'Published'"
                                class="text-green-600 text-xs font-bold flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-green-600"></span> Published
                            </span>
                            <span v-else class="text-gray-500 text-xs font-bold flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-gray-500"></span> Draft
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div class="flex justify-end gap-2">
                                <button class="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                                    <EditOutlined />
                                </button>
                                <button class="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
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
            <a-pagination v-model:current="currentPage" :total="50" show-less-items />
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';

const currentPage = ref(1);

const articles = ref([
    {
        id: 1,
        title: 'Bishop Calls for Unity in Annual Conference',
        snippet: 'The annual bishops conference highlighted the importance of...',
        category: 'Local',
        author: 'Fr. John',
        date: 'Jan 31, 2026',
        image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=2069&auto=format&fit=crop',
        status: 'Published'
    },
    {
        id: 2,
        title: 'New Community Center Opens in Battambang',
        snippet: 'A joyful celebration marked the opening of the new center...',
        category: 'Events',
        author: 'Sarah Mey',
        date: 'Jan 28, 2026',
        image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
        status: 'Published'
    },
    {
        id: 3,
        title: 'Reflection on the Gospel of Mark',
        snippet: 'Understanding the deeper meaning behind the parables...',
        category: 'Vatican',
        author: 'Admin',
        date: 'Jan 25, 2026',
        image: 'https://images.unsplash.com/photo-1507692049790-de58293a469d?q=80&w=2070&auto=format&fit=crop',
        status: 'Draft'
    },
]);
</script>
