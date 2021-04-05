<template>
  <div id="vue-admin-beautiful">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App',
    mounted() {
      console.log(1111, document.getElementById('freelog-plugin-container'), document
          .getElementsByTagName('body'))
      const styleTag = document.createElement('style')
      styleTag.setAttribute('id', 'f324523232323')
      // document.head.appendChild(styleTag)
      styleTag.innerText = '234233333333333333'
      console.log(
        document.getElementsByClassName('vue-admin-beautiful-theme-glory')
      )
    },
  }
</script>
