<template>
    <div class="bg-white p-6 rounded-md shadow-sm border border-gray-200">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">Categories</h2>
                <p class="text-gray-500 text-sm">Manage news and content categories</p>
            </div>
                <button @click="router.push({ name: 'createCategory' })"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors">
                <PlusOutlined />
                <span>Create Category</span>
            </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4">
                            <img v-if="category.thumbnail" :src="category.thumbnail" alt="Thumb" class="h-10 w-10 rounded object-cover border border-gray-200" />
                            <div v-else class="h-10 w-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Img</div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
                            <div class="text-xs text-gray-500 max-w-xs truncate" :title="stripHtml(category.description)">{{ stripHtml(category.description) }}</div>
                        </td>
                         <td class="px-6 py-4 text-sm text-gray-500">
                            {{ category.slug }}
                        </td>
                        <td class="px-6 py-4 text-center text-sm text-gray-500">
                            {{ category.order_no }}
                        </td>
                        <td class="px-6 py-4 text-center">
                            <StarFilled v-if="category.is_featured" class="text-yellow-400 text-lg" />
                            <StarOutlined v-else class="text-gray-300 text-lg" />
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-center">
                            <span v-if="category.status === 'active'"
                                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-100 text-green-800">
                                Active
                            </span>
                             <span v-else
                                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-gray-100 text-gray-800">
                                {{ category.status }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div class="flex justify-end gap-2">
                                <button @click="router.push({ name: 'editCategory', params: { id: category.id } })" class="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                                    <EditOutlined />
                                </button>
                                <button @click="deleteCategory(category.id)" class="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined, EditOutlined, DeleteOutlined, StarOutlined, StarFilled } from '@ant-design/icons-vue';
import { CategoryService } from '@/services/CategoryService';

const categories = ref([]);
const router = useRouter();

const loadCategories = async () => {
    try {
        const data = await CategoryService.getAllCategories();
        categories.value = data;
    } catch (error) {
        console.error("Failed to load categories", error);
    }
};

const stripHtml = (html) => {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
};

const deleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
        await CategoryService.deleteCategory(id);
        await loadCategories();
    } catch (error) {
        console.error("Failed to delete category", error);
        alert("Failed to delete category");
    }
};

onMounted(() => {
    loadCategories();
});
</script>
