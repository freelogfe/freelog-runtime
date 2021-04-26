<template>
  <div id="app">
    <div id="nav">
      <el-dropdown>
  <span class="el-dropdown-link">
    下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item>黄金糕</el-dropdown-item>
    <el-dropdown-item>狮子头</el-dropdown-item>
    <el-dropdown-item>螺蛳粉</el-dropdown-item>
    <el-dropdown-item disabled>双皮奶</el-dropdown-item>
    <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>


      |<vue-markdown
        :source="md"
        @toc-rendered="tocAllRight"
        toc-id="toc"
        @rendered="allRight"
        ref="markdomw"
        :watches="['source', 'show', 'toc']"
        :toc="true"
      ></vue-markdown>
      <div id="toc"></div>
    </div>
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
    var response = await window.freelogApp.getFileStreamById('60092dbb10d7e600342b7b43')
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
