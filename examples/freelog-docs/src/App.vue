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
      md: "# 自然",
    };
  },
  async mounted() {
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
 body {
	line-height: 1;
	width: 100vw;
	height: 100vh;
}
</style>
