<template>
  <img alt="Vue logo" src="../assets/logo.png" id="img"/>
  <button @click="reload">reload</button>
  <button @click="show">show window</button>

  <button @click="clip">剪切图片</button>
  <HelloWorld msg="Vue.js Demo" @close="close" > </HelloWorld>
  <table id="table">
    <th>2222</th>
    <tr><td>232323</td> <td>232323</td><td>232323</td><td>232323</td><td>232323</td><td>232323</td></tr>
     <tr><td>232323</td> <td>232323</td><td>232323</td><td>232323</td><td>232323</td><td>232323</td></tr>

    <tr><td>232323</td> <td>232323</td><td>232323</td><td>232323</td><td>232323</td><td>232323</td></tr>

    <tr><td>232323</td> <td>232323</td><td>232323</td><td>232323</td><td>232323</td><td>232323</td></tr>

    <tr><td>232323</td> <td>232323</td><td>232323</td><td>232323</td><td>232323</td><td>232323</td></tr>

  </table>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";
import html2canvas from "html2canvas";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
  created() {
    console.log("vue2.0写法 created");
  },
  mounted() {
    console.log(this.$route);
  },
  methods: {
    clip() {
      html2canvas(document.getElementById('table')).then(function (canvas) {
        document.body.appendChild(canvas);
      });
    },
    reload() {
      window.data = "23223232323";
      window.location.reload();
    },
    show() {
      console.log(window.data);
    },

    close() {
      console.log("close");
    },
  },
};
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
