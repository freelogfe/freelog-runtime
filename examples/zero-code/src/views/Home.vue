<template>
  <div class="home">
    this is home
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Home',
  components: {
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
