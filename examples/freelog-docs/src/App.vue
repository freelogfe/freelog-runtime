<template>
  <div id="app" class="w-100x h-100x over-h">
    <router-view></router-view>
  </div>
</template>
<script>
import VueMarkdown from "vue-markdown";
// var a = require('@/assets/test.txt')
// @ is an alias to /src
export default {
  name: "App",
  components: {
    VueMarkdown,
  },
  data() {
    return {
      md: "# 自然" + "/n ### lsdjlkjl",
    };
  },
  async mounted() {
    this.getdev()
    // console.log(this.$refs.markdomw, this.md, a);
    // this.md = response.data
  },
  methods: {
        
    getdev() {
      window.fetch('/docs/README.md').then(async res=>{
        const data = await res.text()
        this.md = data
      })
    },
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
 body {
	line-height: 1;
	width: 100vw;
	height: 100vh;
}
</style>
