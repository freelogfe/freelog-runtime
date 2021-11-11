<script setup lang="ts">
import { ref, getCurrentInstance, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HelloWorld3 from '../components/HelloWorld3.vue'
import HelloWorld2 from '../components/HelloWorld2.vue'
const AsyncPage = defineAsyncComponent(() => import(`../async/${'HelloWorld'}.vue`));
const AsyncPage2 = defineAsyncComponent(() => import(`../async/${'HelloWorld2'}.vue`));

defineProps<{ msg: string }>()
const ins = getCurrentInstance()
const $router = useRouter()
const count = ref(0)
const currentTabComponent = ref<any>('')
const currentTabComponent2 = ref<any>('')
function addRoute() {

    currentTabComponent.value = AsyncPage
    if (count.value === 2) {
        currentTabComponent2.value = AsyncPage2
    }
    count.value = 2
    $router.addRoute(
        { path: '/about2', component: HelloWorld3 },
    )
    $router.addRoute(
        { path: '/about3', component: HelloWorld2 },
    )
}
</script>
 
<template>
    <h1>{{ msg }}</h1>
        <component :is="currentTabComponent"></component>
        <component :is="currentTabComponent2"></component>
    <!-- <AsyncPage/> -->
    <button type="button" @click="addRoute">count is: {{ count }}</button>
</template>

<style scoped>
</style>
