import { createApp } from 'vue'
import App from './App.vue'
import router from './routs/index.js'
import { initPwaInstallListeners } from './composables/pwaInstall.js'

initPwaInstallListeners()
import 'ant-design-vue/dist/reset.css'
import './assets/main.css'
import 'ckeditor5/ckeditor5.css'

import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue'

const app = createApp(App)

app.use(router)
app.use(CkeditorPlugin)
app.mount('#app')