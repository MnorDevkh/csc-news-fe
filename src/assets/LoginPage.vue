<template>
  <div class="relative min-h-screen w-full font-sans overflow-hidden flex items-center justify-center">

    <!-- Background: Night Sky Gradient & Mountains -->
    <div class="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950"></div>

    <!-- Stars (Simulated with simple dots) -->
    <div class="absolute top-10 left-10 w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"></div>
    <div class="absolute top-20 right-20 w-1.5 h-1.5 bg-white rounded-full opacity-60 animate-pulse delay-500"></div>
    <div class="absolute top-1/3 left-1/4 w-1 h-1 bg-white rounded-full opacity-50"></div>
    <div class="absolute top-1/4 right-1/3 w-0.5 h-0.5 bg-white rounded-full opacity-80"></div>

    <!-- Shooting Star (CSS Animation) -->
    <div
      class="absolute top-0 right-1/3 w-32 h-0.5 bg-gradient-to-l from-transparent to-white opacity-0 -rotate-45 origin-right"
      style="animation: shooting-star 3s ease-in-out infinite 2s">
    </div>


    <!-- Mountains Silhouette (CSS Shapes) -->
    <div class="absolute bottom-0 left-0 right-0 h-1/3 z-0">
      <!-- Back Mountains -->
      <svg class="absolute bottom-0 w-full h-full text-indigo-800 opacity-60" viewBox="0 0 1440 320"
        preserveAspectRatio="none">
        <path fill="currentColor"
          d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
        </path>
      </svg>
      <!-- Middle Mountains -->
      <svg class="absolute bottom-0 w-full h-3/4 text-indigo-900 opacity-80" viewBox="0 0 1440 320"
        preserveAspectRatio="none">
        <path fill="currentColor"
          d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
        </path>
      </svg>
      <!-- Front Mountains -->
      <svg class="absolute bottom-0 w-full h-1/2 text-indigo-950" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="currentColor"
          d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
        </path>
      </svg>
    </div>

    <!-- Login Card -->
    <div class="relative z-10 bg-white w-full max-w-sm rounded-lg overflow-hidden shadow-2xl" style="animation: fade-in-up 0.8s ease-out forwards">

      <!-- Header Gradient -->
      <div
        class="bg-gradient-to-b from-indigo-900 via-purple-800 to-blue-500 h-48 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
        <!-- Stars in Header -->
        <div class="absolute top-4 left-10 w-0.5 h-0.5 bg-white opacity-80"></div>
        <div class="absolute bottom-10 right-10 w-0.5 h-0.5 bg-white opacity-60"></div>

        <h2 class="text-white text-xl font-light tracking-widest uppercase mb-4">Hello & Welcome</h2>
        <p class="text-blue-100 text-xs px-8 leading-relaxed opacity-80">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet
          dolore.
        </p>
      </div>

      <!-- Form Section -->
      <div class="p-8 pb-10 bg-white">
        <h3 class="text-center text-gray-700 text-lg font-bold tracking-widest uppercase mb-8">User Login</h3>

        <!-- Error Alert -->
        <div v-if="error" class="mb-4 text-xs text-center text-red-500 bg-red-50 p-2 rounded">
          {{ error }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">

          <!-- Username -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserOutlined class="text-gray-400" />
            </div>
            <input v-model="email" type="text" placeholder="Username"
              class="w-full pl-10 pr-4 py-3 bg-gray-200 border-none rounded-full text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-colors outline-none">
          </div>

          <!-- Password -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockOutlined class="text-gray-400" />
            </div>
            <input v-model="password" type="password" placeholder="Password"
              class="w-full pl-10 pr-4 py-3 bg-gray-200 border-none rounded-full text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-colors outline-none">
          </div>

          <!-- Extras -->
          <div class="flex items-center justify-between text-xs text-gray-500 px-1">
            <div class="flex items-center">
              <input type="checkbox" id="remember" class="mr-1 rounded text-purple-600 focus:ring-purple-500">
              <label for="remember">Remember</label>
            </div>
            <a href="#" class="hover:text-purple-600">Forget Password ?</a>
          </div>

          <!-- Button -->
          <button type="submit" :disabled="loading"
            class="w-full mt-6 bg-gradient-to-r from-indigo-900 to-blue-600 text-white font-bold py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transform transition-all duration-200 disabled:opacity-70 text-xs tracking-wider uppercase">
            <span v-if="loading">Logging in...</span>
            <span v-else>Login</span>
          </button>

        </form>
      </div>

    </div>

    <!-- Footer Credit -->
    <div class="absolute bottom-4 text-white/30 text-xs">
      designed by FlexiGen
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { MailOutlined, LockOutlined, UserOutlined, ArrowRightOutlined, WarningOutlined } from '@ant-design/icons-vue';
import { useAuth } from '../composables/useAuth';

const email = ref('admin@gmail.com');
const password = ref('123');
const router = useRouter();

const { login, loading, error } = useAuth(); // 使用 useAuth

const handleSubmit = async () => {
  const success = await login(email.value, password.value);
  if (success) {
    router.push('/admin/dashboard');
  }
};
</script>
