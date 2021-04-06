import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import './plugins'
import './public-path'

import '@/layouts/export'
/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 生产环境默认都使用mock，如果正式用于生产环境时，记得去掉
 */

if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('@/utils/static')
  mockXHR()
}

Vue.config.productionTip = false

let instance = null

function render(props = {}) {
  const { container } = props
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(
    container
      ? document.querySelector('#vue-admin-beautiful')
      : '#vue-admin-beautiful'
  )
}

if (!window.__POWERED_BY_FREELOG__) {
  render()
}

function storeTest(props) {
  props.onGlobalStateChange &&
    props.onGlobalStateChange(
      (value, prev) =>
        console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev),
      true
    )
  props.setGlobalState &&
    props.setGlobalState({
      ignore: props.name,
      user: {
        name: props.name,
      },
    })
}
export async function bootstrap() {
  console.log('[vue] vue app bootstraped')
}

export async function mount(props) {
  console.log('[vue] props from main framework', props)
  storeTest(props)
  render(props)
}

export async function unmount() {
  instance.$destroy()
  instance.$el.innerHTML = ''
  instance = null
  router = null
}
