<template>
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">Sermons & Homilies</h2>
                <p class="text-gray-500 text-sm">Upload and manage audio/video sermons</p>
            </div>
            <button
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
                <PlusOutlined />
                <span>New Sermon</span>
            </button>
        </div>

        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="relative flex-1">
                <SearchOutlined class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search sermons..."
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all">
            </div>
            <select class="border border-gray-300 rounded-lg px-4 py-2 bg-white outline-none cursor-pointer">
                <option value="">All Preachers</option>
                <option value="fr_john">Fr. John</option>
                <option value="bishop_ly">Bishop Ly</option>
            </select>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thumbnail</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Preacher</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type
                        </th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="sermon in sermons" :key="sermon.id" class="hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <img :src="sermon.thumbnail" class="h-12 w-20 object-cover rounded shadow-sm">
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm font-medium text-gray-900">{{ sermon.title }}</div>
                            <div class="text-xs text-gray-500">{{ sermon.duration }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ sermon.preacher }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ sermon.date }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span
                                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                {{ sermon.type }}
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
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';

const sermons = ref([
    { id: 1, title: 'Walking in Faith', thumbnail: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=200', preacher: 'Fr. Sok Na', date: '2026-01-31', duration: '45 mins', type: 'Video' },
    { id: 2, title: 'The Power of Forgiveness', thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58293a469d?q=80&w=200', preacher: 'Bishop Ly', date: '2026-01-24', duration: '32 mins', type: 'Audio' },
]);
</script>
