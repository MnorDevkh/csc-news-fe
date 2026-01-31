<template>
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">Media Gallery</h2>
                <p class="text-gray-500 text-sm">Manage photo albums and galleries</p>
            </div>
            <button
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
                <PlusOutlined />
                <span>Create Album</span>
            </button>
        </div>

        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="relative flex-1">
                <SearchOutlined class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search albums..."
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all">
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="album in albums" :key="album.id"
                class="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all relative">

                <div class="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    <img :src="album.cover"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    <div
                        class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button
                            class="bg-white text-gray-800 p-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            title="Edit">
                            <EditOutlined />
                        </button>
                        <button class="bg-white text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                            title="Delete">
                            <DeleteOutlined />
                        </button>
                    </div>
                </div>

                <div class="p-4">
                    <h3 class="font-bold text-gray-800 mb-1 truncate">{{ album.title }}</h3>
                    <div class="flex justify-between items-center text-xs text-gray-500">
                        <span>{{ album.date }}</span>
                        <span class="bg-gray-100 px-2 py-1 rounded-md text-gray-600 font-medium">{{ album.count }}
                            items</span>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';

const albums = ref([
    { id: 1, title: 'Christmas Celebration 2025', date: '2025-12-25', count: 42, cover: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=2069&auto=format&fit=crop' },
    { id: 2, title: 'Youth Camp 2025', date: '2025-11-10', count: 120, cover: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop' },
    { id: 3, title: 'Charity Work in Kampong Cham', date: '2025-10-05', count: 15, cover: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop' },
]);
</script>
