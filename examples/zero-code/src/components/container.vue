<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <component :is="comp" v-bind='compProps'></component>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src
/**
 * 负责循环传递组件配置给子组件，同时路由也在这里写。
 * [
 *   {
 *     type: component,
 *     name: componentName,
 *     props: {
 *       css: {
 *         classNames: [],
 *         styles: [] 
 *       },
 *       normalProps: {
 *         
 *       },
 *       events: {
 *       }
 *     },
 *     children: [
 *       node
 *     ]
 *   },
 *   {
 *     type: routerView, // 路由是一个具有宽高设定（或自适应）的容器
 *     name: [home,about], // 当添加路由时就是划分一块区域，这块区域的高宽应该传递下去，而不应该让routerview包div
 *     children: [
 *       {
 *         type: container, // 此时container根据用户选的自由名称自动生成的容器
 *         name: home,
 *         children: [
 *           {
 *             type: component,
 *             name: componentName
 *           }
 *         ]
 *       },
 *       {
 *         type: container,
 *         name: about 
 *       }
 *     ]
 *   }
 * ]
 */
export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld
  },
  data () {
    return {
      comp: 'HelloWorld',
      compProps: {
        msg: 'Welcome to Your Vue.js + TypeScript App'
      }
    }
  }
})
</script>
