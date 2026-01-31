<template>
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">Saints</h2>
                <p class="text-gray-500 text-sm">Manage stories and histories of Saints</p>
            </div>
            <button
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
                <PlusOutlined />
                <span>Add Saint</span>
            </button>
        </div>

        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="relative flex-1">
                <SearchOutlined class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search saints..."
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all">
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feast
                            Day</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Patron Saint Of</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="saint in saints" :key="saint.id" class="hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <img :src="saint.image" class="h-10 w-10 rounded-full object-cover border border-gray-200">
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {{ saint.name }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ saint.feastDate }}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {{ saint.patronOf }}
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

const saints = ref([
    { id: 1, name: 'St. Teresa of Calcutta', feastDate: 'September 5', patronOf: 'World Youth Day, Missionaries of Charity', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Mother_Teresa_1.jpg/220px-Mother_Teresa_1.jpg' },
    { id: 2, name: 'St. Francis of Assisi', feastDate: 'October 4', patronOf: 'Animals, Merchants, Ecology', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Saint_Francis_of_Assisi_by_Cigoli.jpg/220px-Saint_Francis_of_Assisi_by_Cigoli.jpg' },
]);
</script>
