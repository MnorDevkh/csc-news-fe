<template>
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">Daily Bible Readings</h2>
                <p class="text-gray-500 text-sm">Manage daily scripture entries</p>
            </div>
            <button
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
                <PlusOutlined />
                <span>Add Reading</span>
            </button>
        </div>

        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="relative flex-1">
                <SearchOutlined class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search by book or verse..."
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all">
            </div>
            <input type="date" class="border border-gray-300 rounded-lg px-4 py-2 bg-white outline-none cursor-pointer">
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title/Theme</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Readings (1st, 2nd, Gospel)</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="reading in readings" :key="reading.id" class="hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {{ reading.date }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ reading.title }}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500">
                            <div class="flex flex-col gap-1">
                                <span><span class="font-bold text-xs text-blue-600">1st:</span> {{ reading.first
                                    }}</span>
                                <span v-if="reading.second"><span class="font-bold text-xs text-indigo-600">2nd:</span>
                                    {{ reading.second }}</span>
                                <span><span class="font-bold text-xs text-red-600">G:</span> {{ reading.gospel }}</span>
                            </div>
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

const readings = ref([
    { id: 1, date: '2026-01-31', title: '4th Sunday in Ordinary Time', first: 'Jeremiah 1:4-5, 17-19', second: '1 Corinthians 12:31-13:13', gospel: 'Luke 4:21-30' },
    { id: 2, date: '2026-02-01', title: 'Monday Week 4', first: '2 Samuel 15:13-14', gospel: 'Mark 5:1-20' },
]);
</script>
