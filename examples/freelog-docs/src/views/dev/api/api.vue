<template>
  <div id="guide" class="w-100x h-100x flex-row y-auto">
    <div id="toc" class="h-100x y-auto w-260 br-1 fs-18 px-10"></div>
    <div class="h-100x y-auto flex-1 px-40">
      <vue-markdown
        :source="md"
        @toc-rendered="tocAllRight"
        toc-id="toc"
        @rendered="allRight"
        ref="markdomw"
        :watches="['source', 'show', 'toc']"
        :toc="true"
      ></vue-markdown>
    </div>
  </div>
</template>
<script>
import VueMarkdown from "vue-markdown";

export default {
  name: "markdown",
  components: {
    VueMarkdown,
  },
  data() {
    return {
      md: "# 自然" + "/n ### ",
    };
  },
  async mounted() {
    this.getdev();
    // console.log(this.$refs.markdomw, this.md, a);
    // this.md = response.data
  },
  methods: {
    getdev() {
      const url =  'freelog.com/docs/api/freelog-api.md'
      window.fetch(url,{
        method: 'GET',
        mode: 'cors'}).then(async (res) => {
        const data = await res.text();
        this.md = data;
      });
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

<style lang='scss'>
#toc {
  li {
    line-height: 1.5;
    margin: 3px 0 3px 0;
  }
}
</style>
