<template>
  <div id="vue-admin-beautiful">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App',
    mounted() {
      // const el = document.createElement('DIV')
      // el.innerHTML = '23423423423'
      // const append = document.body.appendChild
      // document.body.appendChild = function () {
      //   console.log(arguments[0])
      //   append.bind(document.body)(...arguments)
      // }
      // document.body.appendChild(el)
    },
  }
</script>
