<template>
    <div class="bg-white p-6 rounded-md shadow-sm border border-gray-200">
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">Sermons & Homilies</h2>
                <p class="text-gray-500 text-sm">Upload and manage audio/video sermons</p>
            </div>
            <button
                @click="goToCreate"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors">
                <PlusOutlined />
                <span>New Sermon</span>
            </button>
        </div>

        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="relative flex-1">
                <SearchOutlined class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    v-model="searchText"
                    type="text"
                    placeholder="Search sermons..."
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                >
            </div>
            <select
                v-model="selectedPreacher"
                class="border border-gray-300 rounded-md px-4 py-2 bg-white outline-none cursor-pointer"
            >
                <option value="">All Preachers</option>
                <option
                    v-for="preacher in preacherOptions"
                    :key="preacher"
                    :value="preacher"
                >
                    {{ preacher }}
                </option>
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
                    <tr v-if="loading">
                        <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                            Loading sermons...
                        </td>
                    </tr>
                    <tr v-else-if="!filteredSermons.length">
                        <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                            No sermons found.
                        </td>
                    </tr>
                    <tr
                        v-for="sermon in filteredSermons"
                        :key="sermon.id"
                        class="hover:bg-gray-50 transition-colors"
                    >
                        <td class="px-6 py-4 whitespace-nowrap">
                            <img
                                v-if="sermon.thumbnail"
                                :src="sermon.thumbnail"
                                alt="Thumb"
                                class="h-12 w-20 object-cover rounded shadow-sm border border-gray-200"
                            >
                            <div
                                v-else
                                class="h-12 w-20 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs"
                            >
                                No Img
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm font-medium text-gray-900">{{ sermon.title }}</div>
                            <div class="text-xs text-gray-500 line-clamp-1">
                                {{ sermon.snippet }}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ sermon.preacher }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ formatDate(sermon.sermon_date) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span
                                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-purple-100 text-purple-800">
                                {{ sermon.media_type || 'N/A' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div class="flex justify-end gap-2">
                                <button
                                    @click="editSermon(sermon.id)"
                                    class="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                                >
                                    <EditOutlined />
                                </button>
                                <button
                                    @click="deleteSermonItem(sermon.id)"
                                    class="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                                >
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { SermonService } from '@/services/SermonService';

const router = useRouter();

const sermons = ref([]);
const loading = ref(false);
const searchText = ref('');
const selectedPreacher = ref('');

const preacherOptions = computed(() => {
    const names = new Set(
        sermons.value
            .map(s => s.preacher)
            .filter(Boolean)
    );
    return Array.from(names).sort();
});

const filteredSermons = computed(() => {
    const search = searchText.value.trim().toLowerCase();
    return sermons.value.filter(s => {
        const matchesPreacher = !selectedPreacher.value || s.preacher === selectedPreacher.value;
        const matchesSearch =
            !search ||
            (s.title && s.title.toLowerCase().includes(search)) ||
            (s.snippet && s.snippet.toLowerCase().includes(search));
        return matchesPreacher && matchesSearch;
    });
});

function formatDate(value) {
    if (!value) return '';
    try {
        const d = new Date(value);
        return d.toLocaleDateString();
    } catch {
        return value;
    }
}

async function loadSermons() {
    loading.value = true;
    try {
        const data = await SermonService.getAllSermons();
        sermons.value = data;
    } catch (error) {
        console.error('Failed to load sermons', error);
        alert('Failed to load sermons');
    } finally {
        loading.value = false;
    }
}

function goToCreate() {
    router.push({ name: 'createSermon' });
}

function editSermon(id) {
    router.push({ name: 'editSermon', params: { id } });
}

async function deleteSermonItem(id) {
    if (!confirm('Are you sure you want to delete this sermon?')) return;
    try {
        await SermonService.deleteSermon(id);
        await loadSermons();
    } catch (error) {
        console.error('Failed to delete sermon', error);
        alert('Failed to delete sermon');
    }
}

onMounted(() => {
    loadSermons();
});
</script>
