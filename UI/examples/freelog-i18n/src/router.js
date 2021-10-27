import VueRouter from 'vue-router'
import Home from './pages/index'


const routes = [{
  path: '/',
  component: Home,
}]

const router = new VueRouter({
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
});


export default router

