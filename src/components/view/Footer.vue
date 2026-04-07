<template>
    <footer class="hidden md:block bg-slate-950 text-stone-100 pt-10 sm:pt-16 pb-6 sm:pb-8 font-sans border-t border-white/5">
        <div class="max-w-[1400px] mx-auto px-[5px] sm:px-5 md:px-6 lg:px-8 xl:px-10">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">

                <!-- Brand Section -->
                <div class="space-y-4">
                    <div class="flex items-center gap-3">
                        <div
                            class="h-10 w-10 rounded-xl bg-primary/90 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                            C</div>
                        <span class="text-2xl font-bold tracking-tight text-white">CSC NEWS</span>
                    </div>
                    <p class="text-stone-400 text-sm leading-relaxed">
                        Leading Catholic news source in Cambodia. Bringing you the latest updates from the community,
                        readings, and spiritual resources.
                    </p>
                    <div class="flex gap-3 pt-2">
                        <a href="#"
                            class="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-stone-400 hover:bg-primary hover:text-white">
                            <FacebookFilled />
                        </a>
                        <a href="#"
                            class="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-stone-400 hover:bg-sky-500 hover:text-white">
                            <TwitterSquareFilled />
                        </a>
                        <a href="#"
                            class="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-stone-400 hover:bg-pink-600 hover:text-white">
                            <InstagramFilled />
                        </a>
                        <a href="#"
                            class="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-stone-400 hover:bg-red-600 hover:text-white">
                            <YoutubeFilled />
                        </a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div>
                    <h3 class="text-lg font-bold mb-6 text-white border-b border-white/10 pb-2 inline-block">Quick Links</h3>
                    <ul class="space-y-3 text-stone-400 text-sm">
                        <li><router-link to="/" class="hover:text-primary transition-colors">Home Page</router-link>
                        </li>
                        <li><router-link to="/news" class="hover:text-primary transition-colors">News</router-link>
                        </li>
                        <li><router-link to="/read" class="hover:text-primary transition-colors">Holy
                                Bible</router-link></li>
                        <li><router-link to="/daily-readings" class="hover:text-primary transition-colors">Daily
                                Readings</router-link></li>
                        <li><router-link to="/gallery"
                                class="hover:text-primary transition-colors">Gallery</router-link></li>
                    </ul>
                </div>

                <!-- Categories -->
                <div>
                    <h3 class="text-lg font-bold mb-6 text-white border-b border-white/10 pb-2 inline-block">Categories</h3>
                    <ul class="space-y-3 text-stone-400 text-sm">
                        <li><a href="#" class="hover:text-primary transition-colors">Phnom Penh</a></li>
                        <li><a href="#" class="hover:text-primary transition-colors">Kampong Cham</a></li>
                        <li><a href="#" class="hover:text-primary transition-colors">Battambang</a></li>
                        <li><a href="#" class="hover:text-primary transition-colors">Vatican News</a></li>
                        <li><a href="#" class="hover:text-primary transition-colors">World Church</a></li>
                    </ul>
                </div>

                <!-- Contact/Newsletter -->
                <div>
                    <h3 class="text-lg font-bold mb-6 text-white border-b border-white/10 pb-2 inline-block">Contact Us</h3>
                    <ul class="space-y-4 text-stone-400 text-sm">
                        <li class="flex items-start gap-3">
                            <EnvironmentFilled class="mt-1 text-primary" />
                            <span>#123, Street 456, Phnom Penh, Cambodia</span>
                        </li>
                        <li class="flex items-center gap-3">
                            <PhoneFilled class="text-primary" />
                            <span>+855 12 345 678</span>
                        </li>
                        <li class="flex items-center gap-3">
                            <MailFilled class="text-primary" />
                            <span>info@cscnews.com</span>
                        </li>
                    </ul>
                </div>

            </div>

            <!-- Bottom Bar -->
            <div
                class="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
                <p>&copy; 2026 CSC News. All rights reserved.</p>
                <div class="flex gap-6">
                    <a href="#" class="hover:text-stone-200 transition-colors">Privacy Policy</a>
                    <a href="#" class="hover:text-stone-200 transition-colors">Terms of Service</a>
                    <a href="#" class="hover:text-stone-200 transition-colors">Cookie Policy</a>
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
