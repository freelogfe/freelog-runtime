<template>
  <div class="container">
    <img alt="Vue logo" src="../assets/logo.png" />
    <template v-for="(item,index) in children">
      <freelog-component
        v-if="item.type === 'component'"
        :key="index"
        :name="item.name"
        v-bind="item.config"
      ></freelog-component>
      <router-view v-if="item.type === 'routerView'" :key="item"></router-view>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

/**
 * container要分两个，一个影子容器，一个真的容器，或者说模式
 * 步骤：不考虑拖拽，直接选择组件，在容器内对组件进行调整
 *    选择容器，容器具有排版定义，
 *    在容器中添加组件，组件顺序可以调整，position可以改变
 *    对组件功能进行配置，例如控制某个其余组件
 * 负责循环传递组件配置给子组件，同时路由也在这里写。
 {
          type: 'container',
          name: 'freelog-container',
          config: {
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
                  routeName: 'freelog-home',
                  key: 'home',
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
                  routeName: 'freelog-about',
                  key: 'about'
                }
              ]
            }
          ]
        }
 */
export default defineComponent({
  name: 'Home',
  components: {
  },
  props: {
    configData: new Array<any>()
  },
  data() {
    return {
      children: new Array<any>()
    }
  },
  mounted() {
    console.log(this.$route, this.configData)
    const configData: any = this.configData
    // const routes: any = []
    this.children = this.configData
    // console.log(configData.children, 222)
    // configData.children.forEach((el: any) => {
    //   if (el.type === 'routerView') {
    //     el.children.forEach((r: any) => {
    //       this.$router.addRoute(this.$route.name || '', {
    //         path: '/freelog/' + r.routePath,
    //         name: r.routeName,
    //         component: Component,
    //         meta: {
    //           configData: r
    //         }
    //       })
    //     })
    //   }
    // })
    console.log(this.children)
  }
})
</script>
