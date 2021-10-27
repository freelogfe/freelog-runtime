import './index.less'
import 'element-ui/lib/theme-chalk/index.css'

import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import App from './pages/app'
import Home from './pages/index'


Vue.use(ElementUI)
Vue.use(VueRouter)
let router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  },
  routes: [{
    path: '/',
    component: Home,
  }]
})

 


 

 
  
let instance = null;

function render(props = {}) {
    const { container } = props;
    instance = new Vue({
        router,
        render: h => h(App),
    }).$mount(container ? container.querySelector('#app') : '#app');
}

if (!window.__POWERED_BY_FREELOG__) {
    render();
}

function storeTest(props) {
    props.onGlobalStateChange &&
        props.onGlobalStateChange(
            (value, prev) => console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev),
            true,
        );
    props.setGlobalState &&
        props.setGlobalState({
            ignore: props.name,
            user: {
                name: props.name,
            },
        });
}
export async function bootstrap() {
    console.log('[vue] vue app bootstraped');
}

export async function mount(props) {
    console.log('[vue] props from main framework', props);
    storeTest(props);
    render(props);
}

export async function unmount() {
    instance.$destroy();
    instance.$el.innerHTML = '';
    instance = null;
    router = null;
}