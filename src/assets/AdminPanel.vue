<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
        <p class="text-sm text-gray-500 mt-1">Manage system users, roles, and permissions</p>
      </div>
      <button
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#1a365d] to-[#2a4a7f] text-white text-sm font-medium rounded-xl shadow-md shadow-[#1a365d]/15 hover:shadow-lg hover:-translate-y-0.5 transition-all">
        <i class="fas fa-plus"></i>
        <span>Add User</span>
      </button>
    </div>

    <!-- Tabs -->
    <div class="mb-6">
      <nav class="flex gap-1 bg-gray-100/80 p-1 rounded-xl w-fit" aria-label="Tabs">
        <button v-for="tab in tabs" :key="tab.name"
          @click="tabs.forEach(t => t.current = false); tab.current = true"
          :class="[
            tab.current
              ? 'bg-white text-[#1a365d] shadow-sm font-semibold'
              : 'text-gray-500 hover:text-gray-700',
            'px-4 py-2 rounded-lg text-sm transition-all duration-200'
          ]">
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Filters and Actions -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      <div class="relative">
        <SearchOutlined class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search users..."
          class="w-full rounded-xl border border-gray-200 bg-gray-50/80 py-2.5 pl-11 pr-4 focus:border-[#1a365d] focus:outline-none focus:ring-2 focus:ring-[#1a365d]/10 focus:bg-white md:w-80 text-sm transition-all">
      </div>
      <div class="flex items-center gap-2">
        <button
          class="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
          <FilterOutlined />
          <span>Filters</span>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead>
            <tr class="bg-gray-50/80">
              <th class="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              <th class="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th class="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th class="relative py-3.5 pl-3 pr-6">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="person in people" :key="person.email" class="hover:bg-gray-50/60 transition-colors">
              <td class="whitespace-nowrap py-4 pl-6 pr-3 text-sm">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-xl overflow-hidden ring-1 ring-gray-100 flex-shrink-0">
                    <img class="h-10 w-10 object-cover" :src="person.image" alt="" />
                  </div>
                  <div>
                    <div class="font-semibold text-gray-900">{{ person.name }}</div>
                    <div class="text-gray-400 text-xs">{{ person.email }}</div>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <div class="text-gray-800">{{ person.title }}</div>
                <div class="text-gray-400 text-xs">{{ person.department }}</div>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <span
                  class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active
                </span>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <span class="text-gray-600 font-medium">{{ person.role }}</span>
              </td>
              <td class="whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm">
                <div class="flex justify-end gap-1">
                  <button class="p-2 text-gray-400 hover:text-[#1a365d] hover:bg-[#1a365d]/5 rounded-lg transition-all">
                    <EditOutlined />
                  </button>
                  <button class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <DeleteOutlined />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { SearchOutlined, EditOutlined, DeleteOutlined, FilterOutlined } from '@ant-design/icons-vue';

const tabs = ref([
  { name: 'All Users', current: true },
  { name: 'Admins', current: false },
  { name: 'Members', current: false },
  { name: 'Suspended', current: false },
]);

const people = ref([
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    department: 'Optimization',
    email: 'lindsay.walton@example.com',
    role: 'Member',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
]);
</script>