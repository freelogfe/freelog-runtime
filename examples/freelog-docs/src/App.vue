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
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding-bottom: 20px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
