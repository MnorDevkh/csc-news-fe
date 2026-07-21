import { createApp } from 'vue'
import App from './App.vue'
import router from './routs/index.js'
import { initPwaInstallListeners } from './composables/pwaInstall.js'
import { ensureSession } from './composables/useAuth.js'
import { vCan } from './directives/can.js'
import i18n from './i18n/index.js'

initPwaInstallListeners()
import './assets/main.css'
import 'ckeditor5/ckeditor5.css'

import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue'

;(async () => {
  await ensureSession()
  const app = createApp(App)
  app.directive('can', vCan)
  app.use(router)
  app.use(i18n)
  app.use(CkeditorPlugin)
  app.mount('#app')
})()