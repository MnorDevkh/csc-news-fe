<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>

    <!-- Analytics Cards -->
    <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-2xl bg-white p-6 shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Total Revenue</p>
            <p class="text-2xl font-bold text-gray-900">$45,231.89</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light/30 text-primary">
            <i class="fas fa-dollar-sign text-xl"></i>
          </div>
        </div>
        <p class="mt-2 text-sm text-green-600">+20.1% from last month</p>
      </div>
      <div class="rounded-2xl bg-white p-6 shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Subscriptions</p>
            <p class="text-2xl font-bold text-gray-900">+2350</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
            <i class="fas fa-users text-xl"></i>
          </div>
        </div>
        <p class="mt-2 text-sm text-green-600">+180.1% from last month</p>
      </div>
      <div class="rounded-2xl bg-white p-6 shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Sales</p>
            <p class="text-2xl font-bold text-gray-900">+12,234</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-accent">
            <i class="fas fa-shopping-cart text-xl"></i>
          </div>
        </div>
        <p class="mt-2 text-sm text-green-600">+19% from last month</p>
      </div>
      <div class="rounded-2xl bg-white p-6 shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Active Now</p>
            <p class="text-2xl font-bold text-gray-900">+573</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 text-red-500">
            <i class="fas fa-chart-line text-xl"></i>
          </div>
        </div>
        <p class="mt-2 text-sm text-gray-500">+201 since last hour</p>
      </div>
    </div>

    <!-- Chart and User Activity -->
    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Chart Widget -->
      <div class="rounded-2xl bg-white p-6 shadow-lg lg:col-span-2">
        <h3 class="text-lg font-semibold">Sales Overview</h3>
        <!-- Placeholder for a chart library like Chart.js or ApexCharts -->
        <div class="mt-4 flex h-80 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
          [Chart Component Here]
        </div>
      </div>

      <!-- User Activity Area -->
      <div class="rounded-2xl bg-white p-6 shadow-lg">
        <h3 class="text-lg font-semibold">Recent Activity</h3>
        <ul class="mt-4 space-y-4">
          <li v-for="i in 5" :key="i" class="flex items-start gap-4">
            <img :src="`https://i.pravatar.cc/40?u=${i}`" class="h-10 w-10 rounded-full" />
            <div>
              <p class="text-sm font-medium">
                <span class="font-bold">User {{ i }}</span> purchased a new plan.
              </p>
              <p class="text-xs text-gray-500">{{ i * 3 }} minutes ago</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Table Widget -->
    <div class="mt-8 rounded-2xl bg-white p-6 shadow-lg">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Recent Orders</h3>
        <button class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
          View All
        </button>
      </div>
      <table class="mt-4 w-full text-left">
        <thead>
          <tr class="border-b text-sm text-gray-500">
            <th class="py-3 font-medium">Invoice</th>
            <th class="py-3 font-medium">Customer</th>
            <th class="py-3 font-medium">Status</th>
            <th class="py-3 font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 4" :key="i" class="border-b">
            <td class="py-4 font-medium text-gray-800">INV-00{{ i }}</td>
            <td class="py-4 text-gray-600">Customer {{ i }}</td>
            <td class="py-4">
              <span class="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Paid</span>
            </td>
            <td class="py-4 text-gray-800">$250.00</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
// This component demonstrates the layout for a dashboard.
// For charts, you would integrate a library like Chart.js or ApexCharts.
</script>