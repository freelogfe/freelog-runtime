<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <component :is="comp" v-bind='compProps'></component>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src

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
