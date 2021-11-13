<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue'
export default defineComponent({
  name: 'Home',
  components: {
  },
  data() {
    return {
      loading: true
    }
  },
  methods: {
    getData() {
      return [
        {
          type: 'container',
          name: 'freelog-container',
          props: {
            css: {
              classNames: [],
              styles: []
            },
            normalProps: {

            },
            events: {
            }
          },
          children: [
            {
              type: 'routerView', // 路由是一个具有宽高设定（或自适应）的容器
              name: ['home', 'about'], // 当添加路由时就是划分一块区域，这块区域的高宽应该传递下去，而不应该让routerview包div
              children: [
                {
                  type: 'component', // 此时container根据用户选的自由名称自动生成的容器
                  name: 'freelog-home',
                  routePath: 'home',
                  routeName: 'freelog-home',
                  children: [
                    {
                      type: 'component',
                      name: 'van-search'
                    }
                  ]
                },
                {
                  type: 'component',
                  name: 'freelog-about',
                  routePath: 'about',
                  routeName: 'freelog-about'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  mounted() {
    const data = this.getData()
    const routes: any = []
    const vue: any = getCurrentInstance()?.proxy
    console.log(vue)
    data.forEach((item: any) => {
      routes.push({
        path: '/freelog',
        name: 'freelog',
        component: vue.$app.component('freelog-container'),
        meta: {
          configData: item
        }
      })
    })
    this.$router.addRoute(routes[0])
    this.loading = false
    this.$router.push('/freelog')
  }
})
</script>
