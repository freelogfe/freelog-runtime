<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HelloWorld3 from '../components/HelloWorld3.vue'
import HelloWorld2 from '../components/HelloWorld2.vue'

defineProps<{ msg: string }>()
const ins = getCurrentInstance()
const $router = useRouter()
const count = ref(0)
 function addRoute(){
  
   $router.addRoute(
     { path: '/about2', component: HelloWorld3 },
   )
   $router.addRoute(
     { path: '/about3', component: HelloWorld2 },
   )
}
</script>

<template>
  <h1>23423423</h1>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
