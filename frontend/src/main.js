
import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import vueCookies from "vue-cookies";


loadFonts()

createApp(App)
  .use(vuetify)
  .use(router)
  .use(vueCookies)
  .mount('#app')
