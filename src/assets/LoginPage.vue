<template>
  <div class="relative min-h-screen w-full font-sans overflow-hidden flex items-center justify-center">

    <!-- Background: Deep Navy Gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#4165d1] to-[#0f2447]"></div>

    <!-- Decorative Pattern Overlay -->
    <div class="absolute inset-0 opacity-[0.03]"
      style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;)">
    </div>

    <!-- Ambient light blobs -->
    <div class="absolute top-1/4 -left-32 w-96 h-96 bg-[#e02838]/10 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-1/4 -right-32 w-80 h-80 bg-[#3554b8]/20 rounded-full blur-[100px]"></div>
    <div class="absolute top-0 right-1/3 w-64 h-64 bg-[#e02838]/5 rounded-full blur-[80px]"></div>

    <!-- Floating star dots -->
    <div class="absolute top-16 left-20 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
    <div class="absolute top-32 right-32 w-1.5 h-1.5 bg-[#e02838]/50 rounded-full animate-pulse"
      style="animation-delay: 0.7s"></div>
    <div class="absolute top-1/3 left-1/4 w-1 h-1 bg-white/30 rounded-full"></div>
    <div class="absolute bottom-1/3 right-1/4 w-0.5 h-0.5 bg-[#e02838]/40 rounded-full animate-pulse"
      style="animation-delay: 1.2s"></div>
    <div class="absolute top-1/2 left-10 w-0.5 h-0.5 bg-white/50 rounded-full"></div>

    <!-- Login Card -->
    <div class="relative z-10 w-full max-w-[420px] mx-4" style="animation: fade-in-up 0.7s ease-out forwards">

      <!-- Card Container -->
      <div
        class="bg-white/[0.97] backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl shadow-black/20 ring-1 ring-white/10">

        <!-- Header Section -->
        <div
          class="relative bg-gradient-to-br from-[#4165d1] via-[#1e3f6e] to-[#3554b8] px-8 pt-10 pb-12 text-center overflow-hidden">
          <!-- Decorative gold line -->
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#e02838] to-transparent">
          </div>

          <!-- Logo area -->
          <div
            class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-5 ring-1 ring-white/20">
            <img src="/image/cropped-logo-1.jpg" alt="CSC Logo" class="w-10 h-10 rounded-md object-contain" />
          </div>

          <h2 class="text-white text-2xl font-bold tracking-wide mb-2">CSC News</h2>
          <p class="text-blue-200/70 text-sm leading-relaxed max-w-xs mx-auto">
            Catholic Cambodia Administration Portal
          </p>

          <!-- Decorative gold accent -->
          <div
            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-[#e02838] to-transparent">
          </div>
        </div>

        <!-- Form Section -->
        <div class="px-8 py-8">
          <h3 class="text-center text-white text-sm font-bold tracking-widest uppercase mb-7">Sign In</h3>

          <!-- Error Alert -->
          <div v-if="error"
            class="mb-5 text-sm text-center text-red-600 bg-red-50 p-3 rounded-md ring-1 ring-red-100 flex items-center justify-center gap-2">
            <WarningOutlined />
            {{ error }}
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">

            <!-- Username -->
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2">Username</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ">
                  <UserOutlined class="text-gray-400" />
                </div>
                <input v-model="email" type="text" placeholder="Enter your username"
                  class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#4165d1]/20 focus:border-[#4165d1] focus:bg-white transition-all outline-none">
              </div>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider py-2">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockOutlined class="text-gray-400" />
                </div>
                <input v-model="password" type="password" placeholder="Enter your password"
                  class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#4165d1]/20 focus:border-[#4165d1] focus:bg-white transition-all outline-none">
              </div>
            </div>

            <!-- Extras -->
            <div class="flex items-center justify-between text-xs text-gray-500 px-0.5 py-2">
              <label class="flex items-center gap-2 cursor-pointer hover:text-gray-700 transition-colors">
                <input type="checkbox" id="remember"
                  class="w-3.5 h-3.5 rounded text-[#4165d1] border-gray-300 focus:ring-[#4165d1]/30">
                <span>Remember me</span>
              </label>
              <a href="#" class="text-[#4165d1] hover:text-[#4165d1] font-medium transition-colors">Forgot password?</a>
            </div>

            <!-- Button -->
            <button type="submit" :disabled="loading"
              class="w-full mt-2 bg-blue-600 text-white font-bold py-3.5 rounded-md shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:transform-none text-sm tracking-wide uppercase flex items-center justify-center gap-2">
              <span v-if="loading"
                class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              <span v-if="loading">Signing in...</span>
              <span v-else>Sign In</span>
              <ArrowRightOutlined v-if="!loading" class="text-xs" />
            </button>

          </form>
        </div>

        <!-- Bottom accent -->
        <div class="h-1 bg-gradient-to-r from-[#4165d1] via-[#e02838] to-[#4165d1]"></div>
      </div>

      <!-- Footer Credit -->
      <div class="text-center mt-6 text-white/25 text-xs">
        © 2026 CSC News · Catholic Cambodia
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { LockOutlined, UserOutlined, ArrowRightOutlined, WarningOutlined } from '@ant-design/icons-vue';
import { useAuth } from '../composables/useAuth';

const email = ref('');
const password = ref('');
const router = useRouter();
const route = useRoute();

const { login, loading, error } = useAuth();

const handleSubmit = async () => {
  const success = await login(email.value, password.value);
  if (success) {
    const dest = typeof route.query.redirect === 'string' ? route.query.redirect : '/admin/dashboard';
    router.push(dest || '/admin/dashboard');
  }
};
</script>
