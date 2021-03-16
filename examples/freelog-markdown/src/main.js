 
import store from "./store";

Vue.config.productionTip = false;
import './public-path';

 
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import MdPage from './md-page.vue'
import { Message, MessageBox, Loading } from 'element-ui'

/**
 * 期望功能：
 * 1. 响应式布局
 * 2. 左侧栏-文件目录
 * 3. markdown(.md格式)文件渲染
 * 4. 右侧栏-markdown文件标题定位
 * 5. 向后滚动一段距离，头部隐藏
 * 6. 左右侧栏滚动悬浮
 */
Vue.use(VueRouter)
Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox
let router = null;
let instance = null;
const scrollBehavior = (to, from, savedPosition) => {
	if (savedPosition) {
		return savedPosition
	}
	const position = {}
	if (to.hash) {
		position.selector = to.hash
	}

	if (to.meta.scrollToTop !== false) {
		position.x = 0
		position.y = 0
	}
	return position
}




function render(props = {}) {
    const { container } = props;
    router = new VueRouter({
		mode: 'history',
		base: window.__POWERED_BY_FREELOG__ ? '/vue' : '/',
		scrollBehavior,
		routes: [
			{
				path: '/',
				component: MdPage
			},
			{
				path: '/acticles/:presentableId/:presentableName',
				component: MdPage
			}
		]
	})
    instance = new Vue({
        router,
        store,
        render: h => h(App),
    }).$mount(container ? container.querySelector('#app') : '#app');
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