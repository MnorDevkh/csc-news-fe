<template>
  <div class="min-h-screen bg-gray-50 py-12 font-sans">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Back Button -->
      <button @click="$router.back()"
        class="flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-8 group">
        <ArrowLeftOutlined class="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Daily Readings
      </button>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 md:p-12">

        <div class="text-center mb-10">
          <span class="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4">
            Daily Reading
          </span>
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Genesis 1:1-31
          </h1>
          <div class="text-gray-500 font-medium text-lg">
            Jan 31, 2026
          </div>
        </div>

        <div class="prose prose-lg prose-blue max-w-none mx-auto text-gray-800 leading-relaxed font-serif">
          <p>
            <span class="text-4xl float-left font-black text-blue-500 mr-2 mt-[-10px] leading-none">I</span>n the
            beginning God created the heavens and the earth.
            Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was
            hovering over the waters.
          </p>
          <p>
            And God said, "Let there be light," and there was light. God saw that the light was good, and he separated
            the light from the darkness.
            God called the light "day," and the darkness he called "night." And there was evening, and there was
            morning—the first day.
          </p>
          <p>
            And God said, "Let there be a vault between the waters to separate water from water." So God made the vault
            and separated the water under the vault from the water above it. And it was so.
            God called the vault "sky." And there was evening, and there was morning—the second day.
          </p>
          <p class="italic text-gray-500 border-l-4 border-blue-100 pl-4 py-2 mt-8">
            "So God created mankind in his own image, in the image of God he created them; male and female he created
            them." (Genesis 1:27)
          </p>
        </div>

        <div class="mt-12 pt-8 border-t border-gray-100 flex justify-center gap-6">
          <button class="flex flex-col items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
            <div
              class="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center text-xl group-hover:bg-blue-50">
              <ShareAltOutlined />
            </div>
            <span class="text-xs font-medium">Share</span>
          </button>
          <button class="flex flex-col items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
            <div
              class="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center text-xl group-hover:bg-blue-50">
              <BookOutlined />
            </div>
            <span class="text-xs font-medium">Bookmark</span>
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ArrowLeftOutlined, ShareAltOutlined, BookOutlined } from '@ant-design/icons-vue';
</script>
