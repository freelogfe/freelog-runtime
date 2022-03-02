import './public-path';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import routes from './router';
import store from './store';
import { nes_load_url } from './jsnes/nes-embed';

// import  './game/index';
// import './game/index.less'
// import './game/freelog-single-jsnes'
/**
 * 红白机需求
 * 实现一个可以选择加载游戏的通用插件，并支持按键的修改，全屏和静音等功能。
 * 模块化：主要是加载游戏与修改按键
 *     1.加载游戏模块
 *     2.修改按键模块
 *     3.其余功能模块
 *     4.
*/

let router = null;
let instance = null;

function render(props = {}) {
  const { container } = props;
  router = createRouter({
    history: createWebHistory(window.__POWERED_BY_FREELOG__ ? '/vue3' : '/'),
    routes,
  });

  instance = createApp(App);
  // instance.use(router);
  instance.use(store);
  instance.mount(container ? container.querySelector('#app') : '#app');
}

if (!window.__POWERED_BY_FREELOG__) {
  render();
  nes_load_url(document.getElementById("nes-canvas"), "Contra"); // 
}

export async function bootstrap() {
  console.log('%c ', 'color: green;', 'vue3.0 app bootstraped');
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

export async function mount(props) {
  storeTest(props);
  render(props);
  instance.config.globalProperties.$onGlobalStateChange = props.onGlobalStateChange;
  instance.config.globalProperties.$setGlobalState = props.setGlobalState;
}

export async function unmount() {
  instance.unmount();
  instance._container.innerHTML = '';
  instance = null;
  router = null;
}
