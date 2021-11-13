import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
import Container from './components/container.vue'
import Component from './components/component.vue'
import Home from './views/Home.vue'
import About from './views/About.vue'

const app = createApp(App).use(Vant).use(store).use(router)
app.component('freelog-container', Container)
app.component('freelog-component', Component)
app.component('freelog-home', Home)
app.component('freelog-about', About)
app.config.globalProperties.$app = app
app.mount('#app')
