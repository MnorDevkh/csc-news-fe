<template>
  <div class="flex h-screen bg-neutral-background text-gray-800">
    <!-- Sidebar -->
    <aside class="flex w-64 flex-col space-y-6 bg-white p-4 shadow-lg">
      <div class="flex items-center gap-3 px-2">
        <div class="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
          A
        </div>
        <h1 class="text-xl font-bold text-gray-800">Admin Corp.</h1>
      </div>

      <nav class="flex-1 space-y-2">
        <router-link :to="{ name: 'dashboard' }" class="flex items-center gap-3 rounded-lg px-4 py-2.5 text-gray-600 hover:bg-gray-100" active-class="bg-primary/10 text-primary font-semibold">
          <i class="fas fa-home w-5 text-center"></i>
          <span>Dashboard</span>
        </router-link>
        <router-link :to="{ name: 'adminPanel' }" class="flex items-center gap-3 rounded-lg px-4 py-2.5 text-gray-600 hover:bg-gray-100" active-class="bg-primary/10 text-primary font-semibold">
          <i class="fas fa-users-cog w-5 text-center"></i>
          <span>Admin</span>
        </router-link>
        <a href="#" class="flex items-center gap-3 rounded-lg px-4 py-2.5 text-gray-600 hover:bg-gray-100">
          <i class="fas fa-chart-bar w-5 text-center"></i>
          <span>Analytics</span>
        </a>
        <a href="#" class="flex items-center gap-3 rounded-lg px-4 py-2.5 text-gray-600 hover:bg-gray-100">
          <i class="fas fa-cog w-5 text-center"></i>
          <span>Settings</span>
        </a>
      </nav>

      <div class="space-y-2">
         <a href="#" class="flex items-center gap-3 rounded-lg px-4 py-2.5 text-gray-600 hover:bg-gray-100">
          <i class="fas fa-question-circle w-5 text-center"></i>
          <span>Help</span>
        </a>
        <a href="#" class="flex items-center gap-3 rounded-lg px-4 py-2.5 text-gray-600 hover:bg-gray-100">
          <i class="fas fa-sign-out-alt w-5 text-center"></i>
          <span>Logout</span>
        </a>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Navigation -->
      <header class="flex items-center justify-between border-b border-gray-200 bg-white p-4 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input type="text" placeholder="Search..." class="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
          </div>
        </div>
        <div class="flex items-center gap-6">
          <button class="text-gray-500 hover:text-primary">
            <i class="fas fa-bell"></i>
          </button>
          <button class="text-gray-500 hover:text-primary">
            <i class="fas fa-envelope"></i>
          </button>
          <div class="flex items-center gap-3">
            <img src="https://i.pravatar.cc/40" alt="User Avatar" class="h-10 w-10 rounded-full">
            <div>
              <p class="font-semibold text-gray-900">John Doe</p>
              <p class="text-sm text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main class="flex-1 overflow-y-auto p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
// For icons, you can use a library like Font Awesome.
// 1. Add it to your project: `npm install @fortawesome/fontawesome-free`
// 2. Import in your main.js: `import '@fortawesome/fontawesome-free/css/all.css';`
</script>