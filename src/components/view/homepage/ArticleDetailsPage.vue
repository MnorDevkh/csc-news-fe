<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ShareAltOutlined, CalendarOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue';

const route = useRoute();
const router = useRouter();
const articleId = ref(null);
const article = ref({
  title: 'Loading...',
  content: 'Loading article content...',
  image: '',
  date: 'Jan 31, 2026',
  author: 'Admin'
});

onMounted(() => {
  articleId.value = route.params.id;
  // Mock data simulation
  setTimeout(() => {
    article.value = {
      title: `Article Title Mock for ID: ${articleId.value}`,
      content: `This is the full content for Article ID: ${articleId.value}. It would seamlessly integrate images and videos for an immersive reading experience. Sharing options and a threaded comments section would also be available here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop', // Placeholder image
      date: new Date().toLocaleDateString(),
      author: 'Catholic News Team'
    };
  }, 500);
});
</script>

<template>
  <div class="w-full min-h-screen flex justify-center items-start p-4 sm:p-6 lg:p-8 box-border bg-gray-50">
    <div class="w-full max-w-4xl mx-auto py-8 px-4 sm:py-8 sm:px-6 lg:py-10 lg:px-8">

      <!-- Back Button -->
      <button @click="router.back()"
        class="flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-6 group">
        <ArrowLeftOutlined class="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to News
      </button>

      <article class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <!-- Article Image -->
        <div class="h-[300px] sm:h-[400px] w-full relative">
          <img v-if="article.image" :src="article.image" :alt="article.title" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-6 sm:p-8 text-white">
            <div class="flex items-center gap-4 mb-3 text-sm sm:text-base opacity-90">
              <span class="flex items-center gap-1">
                <CalendarOutlined /> {{ article.date }}
              </span>
              <span class="flex items-center gap-1">
                <UserOutlined /> {{ article.author }}
              </span>
            </div>
            <h1 class="text-2xl sm:text-4xl font-bold leading-tight drop-shadow-md">{{ article.title }}</h1>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 sm:p-10 text-gray-800 leading-relaxed text-lg">
          <div class="prose prose-lg prose-blue max-w-none" v-html="article.content" />

          <!-- Share and Actions -->
          <div class="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
            <div class="text-gray-500 font-medium">Share this article:</div>
            <div class="flex gap-3">
              <button
                class="h-10 w-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors">
                <ShareAltOutlined class="text-lg" />
              </button>
              <!-- Add more social icons here -->
            </div>
          </div>
        </div>
      </article>

    </div>
  </div>
</template>