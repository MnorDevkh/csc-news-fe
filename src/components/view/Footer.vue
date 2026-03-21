<template>
    <footer class="bg-gray-900 text-white pt-10 sm:pt-16 pb-6 sm:pb-8 font-sans">
        <div class="max-w-[1400px] mx-auto px-0 sm:px-5 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">

                <!-- Brand Section -->
                <div class="space-y-4">
                    <div class="flex items-center gap-3">
                        <div
                            class="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                            C</div>
                        <span class="text-2xl font-bold tracking-tight">CSC NEWS</span>
                    </div>
                    <p class="text-gray-400 text-sm leading-relaxed">
                        Leading Catholic news source in Cambodia. Bringing you the latest updates from the community,
                        readings, and spiritual resources.
                    </p>
                    <div class="flex gap-4 pt-2">
                        <a href="#"
                            class="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                            <FacebookFilled />
                        </a>
                        <a href="#"
                            class="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-sky-500 transition-colors">
                            <TwitterSquareFilled />
                        </a>
                        <a href="#"
                            class="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors">
                            <InstagramFilled />
                        </a>
                        <a href="#"
                            class="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors">
                            <YoutubeFilled />
                        </a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div>
                    <h3 class="text-lg font-bold mb-6 border-b border-gray-800 pb-2 inline-block">Quick Links</h3>
                    <ul class="space-y-3 text-gray-400 text-sm">
                        <li><router-link to="/" class="hover:text-blue-500 transition-colors">Home Page</router-link>
                        </li>
                        <li><router-link to="/news" class="hover:text-blue-500 transition-colors">News</router-link>
                        </li>
                        <li><router-link to="/read" class="hover:text-blue-500 transition-colors">Holy
                                Bible</router-link></li>
                        <li><router-link to="/daily-readings" class="hover:text-blue-500 transition-colors">Daily
                                Readings</router-link></li>
                        <li><router-link to="/gallery"
                                class="hover:text-blue-500 transition-colors">Gallery</router-link></li>
                    </ul>
                </div>

                <!-- Categories -->
                <div>
                    <h3 class="text-lg font-bold mb-6 border-b border-gray-800 pb-2 inline-block">Categories</h3>
                    <ul class="space-y-3 text-gray-400 text-sm">
                        <li><a href="#" class="hover:text-blue-500 transition-colors">Phnom Penh</a></li>
                        <li><a href="#" class="hover:text-blue-500 transition-colors">Kampong Cham</a></li>
                        <li><a href="#" class="hover:text-blue-500 transition-colors">Battambang</a></li>
                        <li><a href="#" class="hover:text-blue-500 transition-colors">Vatican News</a></li>
                        <li><a href="#" class="hover:text-blue-500 transition-colors">World Church</a></li>
                    </ul>
                </div>

                <!-- Contact/Newsletter -->
                <div>
                    <h3 class="text-lg font-bold mb-6 border-b border-gray-800 pb-2 inline-block">Contact Us</h3>
                    <ul class="space-y-4 text-gray-400 text-sm">
                        <li class="flex items-start gap-3">
                            <EnvironmentFilled class="mt-1 text-blue-500" />
                            <span>#123, Street 456, Phnom Penh, Cambodia</span>
                        </li>
                        <li class="flex items-center gap-3">
                            <PhoneFilled class="text-blue-500" />
                            <span>+855 12 345 678</span>
                        </li>
                        <li class="flex items-center gap-3">
                            <MailFilled class="text-blue-500" />
                            <span>info@cscnews.com</span>
                        </li>
                    </ul>
                </div>

            </div>

            <!-- Bottom Bar -->
            <div
                class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                <p>&copy; 2026 CSC News. All rights reserved.</p>
                <div class="flex gap-6">
                    <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
                    <a href="#" class="hover:text-white transition-colors">Cookie Policy</a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import {
    FacebookFilled,
    TwitterSquareFilled,
    InstagramFilled,
    YoutubeFilled,
    EnvironmentFilled,
    PhoneFilled,
    MailFilled
} from '@ant-design/icons-vue';
</script>
