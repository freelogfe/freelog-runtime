<template>
  <div class="home">
    <component :is="comp" v-bind="normalProps">{{normalProps.text}}</component>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
interface ObjectAny {
  text: string;
  [str: string]: any;
}
export default defineComponent({
  name: 'Home',
  components: {
  },
  props: {
    normalProps: {
      type: Object as PropType<ObjectAny>,
      // 请务必使用箭头函数
      default: () => ({
        text: 'Arrow Function Expression'
      })
    },
    name: String
  },
  data() {
    return {
      comp: ''
    }
  },
  mounted() {
    this.comp = this.name || ''
  }
})
</script>
