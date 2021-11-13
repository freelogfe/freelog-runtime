<template>
  <router-view v-if="!!loading" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src
import Container from '@/components/Container.vue' // @ is an alias to /src

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld
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
                  children: [
                    {
                      type: 'component',
                      name: 'van-search'
                    }
                  ]
                },
                {
                  type: 'component',
                  name: 'freelog-about'
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
    const routes:any = []
    data.forEach((item: any) => {
      routes.push({
        path: '/',
        name: 'Home',
        component: Container
      })
      item.children.forEach((el:any) => {
        if(el.type === 'routerView'){
          routes[0].children = [{
            path: '/',
            name: 'Home',
            component: Container,
            meta: {}
          }]
        }
      });
    })

    this.loading = false
  }
})
</script>
