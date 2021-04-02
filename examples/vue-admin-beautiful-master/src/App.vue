<template>
  <div id="vue-admin-beautiful">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App',
    mounted() {
      console.log(document, document.head)
      const styleTag = document.createElement('style')
      styleTag.setAttribute('id', 'f324523232323')
      document.head.appendChild(styleTag)
      styleTag.innerText = '234233333333333333'
    },
  }
</script>
