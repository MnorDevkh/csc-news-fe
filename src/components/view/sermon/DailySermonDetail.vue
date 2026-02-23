<template>
  <div class="min-h-screen bg-gray-50 py-12 font-sans bg-gray-500 mx-auto">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Back Button -->
      <button @click="$router.back()"
        class="flex items-center text-gray-500 hover:text-purple-600 transition-colors mb-8 group">
        <ArrowLeftOutlined class="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Sermons
      </button>

      <article class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full max-w-4xl mx-auto">

        <!-- Video/Hero Section -->
        <div class="aspect-video bg-black relative flex items-center justify-center group cursor-pointer">
          <img src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop"
            class="w-full h-full object-cover opacity-80" />
          <div class="absolute inset-0 flex items-center justify-center">
            <div
              class="h-20 w-20 bg-purple-600/90 rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
              <CaretRightOutlined class="text-4xl text-white" />
            </div>
          </div>
        </div>

        <div class="p-6 sm:p-10">
          <div class="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
            <span class="flex items-center gap-1">
              <UserOutlined /> Fr. Sok Na
            </span>
            <span class="flex items-center gap-1">
              <CalendarOutlined /> Jan 31, 2026
            </span>
            <span class="flex items-center gap-1">
              <ClockCircleOutlined /> 45 mins
            </span>
          </div>

          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">Walking in Faith: Trusting God in
            Uncertain Times</h1>

          <div class="prose prose-lg prose-purple max-w-none text-gray-700 leading-relaxed">
            <p>
              Faith is often tested not when things are going well, but when the path ahead seems shrouded in mist.
              In today's sermon, we explore the life of Abraham, who was called to leave his home for a land he did not
              know.
            </p>
            <h3>Key Takeaways</h3>
            <ul>
              <li>God's definition of blessings often differs from ours.</li>
              <li>Obedience often precedes understanding.</li>
              <li>Trust is a daily decision, not a one-time event.</li>
            </ul>
            <p>
              Join us as we dive deep into the scriptures and uncover the timeless truths that can guide us through our
              own modern-day wildernesses.
            </p>
          </div>

          <div class="mt-10 p-6 bg-purple-50 rounded-xl border border-purple-100">
            <h3 class="font-bold text-purple-900 mb-2">Reflection Questions</h3>
            <ul class="list-disc list-inside text-purple-800 space-y-2">
              <li>Where is God asking you to step out in faith today?</li>
              <li>What fears are holding you back from full obedience?</li>
            </ul>
          </div>

          <!-- Actions -->
          <div class="mt-10 pt-8 border-t border-gray-100 flex justify-between items-center">
            <div class="flex gap-4">
              <button
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors">
                <DownloadOutlined class="mr-2" /> Audio MP3
              </button>
              <button
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors">
                <FileTextOutlined class="mr-2" /> Transcript
              </button>
            </div>
            <button class="text-purple-600 font-medium hover:text-purple-800 transition-colors">
              <ShareAltOutlined class="mr-1" /> Share
            </button>
          </div>

        </div>
      </article>

    </div>
  </div>
</template>

<script setup>
import { ArrowLeftOutlined, CaretRightOutlined, UserOutlined, CalendarOutlined, ClockCircleOutlined, DownloadOutlined, FileTextOutlined, ShareAltOutlined } from '@ant-design/icons-vue';

defineProps({
  id: { type: [String, Number], required: true }
});
</script>
