import { createApp } from 'vue'
import App from './App.vue'
import router from './routs/index.js'
import './assets/main.css'


import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue'

const app = createApp(App)

app.use(router)
app.use(CkeditorPlugin)
app.mount('#app')