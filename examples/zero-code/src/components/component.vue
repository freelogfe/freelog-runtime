<template>
  <div class="home">
    <component :is="comp" v-bind="compProps"></component>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
/**
 * 组件是最低级别，不再有子组件，接收传递过来的props
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
 *       events: {// 事件应该支持例如容器内数据变化，按钮禁用
 *       }
 *     }
 *   },
 */
export default defineComponent({
  name: 'Home',
  components: {
  },
  data() {
    return {
      comp: '',
      compProps: {
        msg: 'Welcome to Your Vue.js + TypeScript App'
      }
    }
  },
  mounted() {
    // eslint-disable-next-line
    const configData:any = this.$route.meta.configData
    this.comp = configData.name 
  }
})
</script>
