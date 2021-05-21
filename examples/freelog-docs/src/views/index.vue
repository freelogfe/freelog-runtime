<template>
  <div class="w-100x h-100x flex-column over-h">
    <Header/>
    <div class="w-100x flex-1 over-h">
        <router-view class="w-100x h-100x over-h"></router-view>
    </div>
  </div>
</template>
<script>
import Header from "./_components/header";

// var a = require('@/assets/test.txt')
// @ is an alias to /src
export default {
  name: "App",
  components: {
    Header,
  },
  data() {
    return {
      md: "# 自然" + "/n ### lsdjlkjl",
    };
  },
  async mounted() {
    // console.log(this.$refs.markdomw, this.md, a);
    // this.md = response.data
  },
  methods: {
     
    allRight: function (htmlStr) {
      console.log("markdown is parsed !");
    },
    tocAllRight: function (tocHtmlStr) {
      console.log("toc is parsed :", tocHtmlStr);
    },
  },
};
</script>

<style>
 
</style>
