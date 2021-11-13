<template>
  <div class="home">
    <component :is="comp" v-bind="normalProps">{{normalProps.text}}</component>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Home',
  components: {
  },
  props: {
    normalProps: Array,
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
