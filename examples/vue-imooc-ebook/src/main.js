import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './lang'
import './public-path';

// import './mock'
import './lazy'
import '@/assets/styles/global.scss'
import '@/assets/styles/icon.css'

Vue.config.productionTip = false


let instance = null;





function render(props = {}) {
  new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
  }).$mount('#app')

}

if (!window.__POWERED_BY_FREELOG__) {
  render();
}

export async function bootstrap() {
  console.log('[vue] vue app bootstraped');
}

export async function mount(props) {
  console.log('[vue] props from main framework', props);
  render(props);
}

export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
  router = null;
}