<template>
    <footer class="relative hidden md:block mt-auto border-t border-line bg-navy text-cream">
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>

        <div class="container-site mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-12 sm:pt-14 pb-6 sm:pb-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-10 md:mb-12">

                <div class="space-y-5">
                    <div class="flex items-center gap-3">
                        <img
                            src="/image/cropped-logo-1.jpg"
                            alt="CSC News"
                            class="h-10 w-auto object-contain bg-ivory p-0.5"
                        />
                        <div>
                            <span class="font-display block text-xl font-semibold tracking-wide text-gold-pale">CSC News</span>
                            <span class="text-[10px] tracking-[0.18em] uppercase text-cream/50">Catholic Cambodia</span>
                        </div>
                    </div>
                    <p class="text-cream/65 text-sm leading-relaxed max-w-sm">
                        {{ t('footer.tagline') }}
                    </p>
                    <div class="flex gap-2 pt-1">
                        <a href="#"
                            class="h-10 w-10 border border-white/10 flex items-center justify-center text-cream/45 hover:border-gold hover:text-gold-soft transition-all"
                            aria-label="Facebook">
                            <FacebookFilled />
                        </a>
                        <a href="#"
                            class="h-10 w-10 border border-white/10 flex items-center justify-center text-cream/45 hover:border-gold hover:text-gold-soft transition-all"
                            aria-label="YouTube">
                            <YoutubeFilled />
                        </a>
                    </div>
                </div>

                <div>
                    <h3 class="text-xs font-semibold mb-5 text-gold tracking-[0.2em] uppercase">
                        {{ t('footer.quickLinks') }}
                    </h3>
                    <ul class="space-y-2.5 text-cream/70 text-sm list-none p-0 m-0">
                        <li><router-link to="/" class="hover:text-gold-soft transition-colors">{{ t('footer.homePage') }}</router-link></li>
                        <li><router-link to="/news" class="hover:text-gold-soft transition-colors">{{ t('footer.news') }}</router-link></li>
                        <li><router-link to="/read" class="hover:text-gold-soft transition-colors">{{ t('footer.holyBible') }}</router-link></li>
                        <li><router-link to="/daily-readings" class="hover:text-gold-soft transition-colors">{{ t('footer.dailyReadings') }}</router-link></li>
                        <li><router-link to="/gallery" class="hover:text-gold-soft transition-colors">{{ t('footer.gallery') }}</router-link></li>
                    </ul>
                </div>

                <div>
                    <h3 class="text-xs font-semibold mb-5 text-gold tracking-[0.2em] uppercase">
                        {{ t('footer.categories') }}
                    </h3>
                    <ul class="space-y-2.5 text-cream/70 text-sm list-none p-0 m-0">
                        <li><router-link to="/the-messenger" class="hover:text-gold-soft transition-colors">The Messenger</router-link></li>
                        <li><router-link to="/the-sermon" class="hover:text-gold-soft transition-colors">The Sermon</router-link></li>
                        <li><router-link :to="{ name: 'saintList' }" class="hover:text-gold-soft transition-colors">សន្តសន្តី</router-link></li>
                        <li><router-link to="/structure" class="hover:text-gold-soft transition-colors">រចនាសម្ព័ន្ធ</router-link></li>
                        <li><router-link to="/church-history" class="hover:text-gold-soft transition-colors">ប្រវត្តិសាសនាចក្រ</router-link></li>
                    </ul>
                </div>

                <div>
                    <h3 class="text-xs font-semibold mb-5 text-gold tracking-[0.2em] uppercase">
                        {{ t('footer.contactUs') }}
                    </h3>
                    <ul class="space-y-4 text-cream/70 text-sm list-none p-0 m-0">
                        <li class="flex items-start gap-3">
                            <EnvironmentFilled class="mt-1 text-gold/80" />
                            <span>Catholic Bishops' Conference of Cambodia</span>
                        </li>
                        <li class="flex items-center gap-3">
                            <MailFilled class="text-gold/80" />
                            <span>info@cscnews.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-xs text-cream/40 m-0">{{ t('menu.copyright') }}</p>
                <div class="flex gap-6 text-xs text-cream/40">
                    <a href="#" class="hover:text-gold-soft transition-colors">{{ t('menu.privacy') }}</a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import {
    FacebookFilled,
    YoutubeFilled,
    EnvironmentFilled,
    MailFilled
} from '@ant-design/icons-vue';

const { t } = useI18n();
</script>
