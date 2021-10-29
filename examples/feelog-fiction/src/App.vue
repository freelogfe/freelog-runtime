<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {
    // setTimeout(()=>{
    //   console.log('234234234')
    //   history.forward()
    // }, 5000)
  },
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  justify-content: center;
  display: flex;
}
div,
a,
span,
nav,
article,
section,
header,
footer {
  box-sizing: border-box;
}
</style>
