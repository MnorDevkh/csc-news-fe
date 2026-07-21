<template>
    <footer class="hidden md:block bg-gradient-to-b from-[#0f1d32] to-[#0a1628] text-white/80 pt-12 sm:pt-16 pb-6 sm:pb-8 font-sans border-t border-white/5">
        <!-- Top Gold Accent Line -->
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a853]/30 to-transparent"></div>

        <div class="max-w-[1400px] mx-auto px-[5px] sm:px-5 md:px-6 lg:px-8 xl:px-10">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-14">

                <!-- Brand Section -->
                <div class="space-y-5">
                    <div class="flex items-center gap-3">
                        <div
                            class="h-10 w-10 rounded-full bg-gradient-to-br from-[#d4a853] to-[#c49843] flex items-center justify-center text-[#0f1d32] font-extrabold text-xl shadow-lg shadow-[#d4a853]/15">
                            C</div>
                        <span class="text-2xl font-bold tracking-tight text-white">CSC NEWS</span>
                    </div>
                    <p class="text-white/40 text-sm leading-relaxed">
                        {{ t('footer.tagline') }}
                    </p>
                    <div class="flex gap-2.5 pt-1">
                        <a href="#"
                            class="h-10 w-10 rounded-md bg-white/5 flex items-center justify-center text-white/40 hover:bg-[#d4a853]/20 hover:text-[#d4a853] transition-all duration-200">
                            <FacebookFilled />
                        </a>
                        <a href="#"
                            class="h-10 w-10 rounded-md bg-white/5 flex items-center justify-center text-white/40 hover:bg-[#d4a853]/20 hover:text-[#d4a853] transition-all duration-200">
                            <TwitterSquareFilled />
                        </a>
                        <a href="#"
                            class="h-10 w-10 rounded-md bg-white/5 flex items-center justify-center text-white/40 hover:bg-[#d4a853]/20 hover:text-[#d4a853] transition-all duration-200">
                            <InstagramFilled />
                        </a>
                        <a href="#"
                            class="h-10 w-10 rounded-md bg-white/5 flex items-center justify-center text-white/40 hover:bg-[#d4a853]/20 hover:text-[#d4a853] transition-all duration-200">
                            <YoutubeFilled />
                        </a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div>
                    <h3 class="text-sm font-bold mb-6 text-white uppercase tracking-wider relative inline-block">
                        {{ t('footer.quickLinks') }}
                        <span class="absolute bottom-[-6px] left-0 w-8 h-0.5 bg-gradient-to-r from-[#d4a853] to-transparent rounded-full"></span>
                    </h3>
                    <ul class="space-y-3 text-white/40 text-sm">
                        <li><router-link to="/" class="hover:text-[#d4a853] transition-colors">{{ t('footer.homePage') }}</router-link>
                        </li>
                        <li><router-link to="/news" class="hover:text-[#d4a853] transition-colors">{{ t('footer.news') }}</router-link>
                        </li>
                        <li><router-link to="/read" class="hover:text-[#d4a853] transition-colors">{{ t('footer.holyBible') }}</router-link></li>
                        <li><router-link to="/daily-readings" class="hover:text-[#d4a853] transition-colors">{{ t('footer.dailyReadings') }}</router-link></li>
                        <li><router-link to="/gallery"
                                class="hover:text-[#d4a853] transition-colors">{{ t('footer.gallery') }}</router-link></li>
                    </ul>
                </div>

                <!-- Categories -->
                <div>
                    <h3 class="text-sm font-bold mb-6 text-white uppercase tracking-wider relative inline-block">
                        {{ t('footer.categories') }}
                        <span class="absolute bottom-[-6px] left-0 w-8 h-0.5 bg-gradient-to-r from-[#d4a853] to-transparent rounded-full"></span>
                    </h3>
                    <ul class="space-y-3 text-white/40 text-sm">
                        <li><a href="#" class="hover:text-[#d4a853] transition-colors">Phnom Penh</a></li>
                        <li><a href="#" class="hover:text-[#d4a853] transition-colors">Kampong Cham</a></li>
                        <li><a href="#" class="hover:text-[#d4a853] transition-colors">Battambang</a></li>
                        <li><a href="#" class="hover:text-[#d4a853] transition-colors">Vatican News</a></li>
                        <li><a href="#" class="hover:text-[#d4a853] transition-colors">World Church</a></li>
                    </ul>
                </div>

                <!-- Contact -->
                <div>
                    <h3 class="text-sm font-bold mb-6 text-white uppercase tracking-wider relative inline-block">
                        {{ t('footer.contactUs') }}
                        <span class="absolute bottom-[-6px] left-0 w-8 h-0.5 bg-gradient-to-r from-[#d4a853] to-transparent rounded-full"></span>
                    </h3>
                    <ul class="space-y-4 text-white/40 text-sm">
                        <li class="flex items-start gap-3">
                            <EnvironmentFilled class="mt-1 text-[#d4a853]/70" />
                            <span>#123, Street 456, Phnom Penh, Cambodia</span>
                        </li>
                        <li class="flex items-center gap-3">
                            <PhoneFilled class="text-[#d4a853]/70" />
                            <span>+855 12 345 678</span>
                        </li>
                        <li class="flex items-center gap-3">
                            <MailFilled class="text-[#d4a853]/70" />
                            <span>info@cscnews.com</span>
                        </li>
                    </ul>
                </div>

            </div>

            <!-- Bottom Bar -->
            <div class="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-xs text-white/25">{{ t('menu.copyright') }}</p>
                <div class="flex gap-6 text-xs text-white/25">
                    <a href="#" class="hover:text-[#d4a853]/60 transition-colors">{{ t('menu.privacy') }}</a>
                    <a href="#" class="hover:text-[#d4a853]/60 transition-colors">Terms of Service</a>
                    <a href="#" class="hover:text-[#d4a853]/60 transition-colors">Cookie Policy</a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import {
    FacebookFilled,
    TwitterSquareFilled,
    InstagramFilled,
    YoutubeFilled,
    EnvironmentFilled,
    PhoneFilled,
    MailFilled
} from '@ant-design/icons-vue';

const { t } = useI18n();
</script>
