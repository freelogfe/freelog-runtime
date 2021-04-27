<template>
  <div id="guide" class="w-100x h-100x flex-row y-auto">
    <div id="toc"></div>
    <div class="flex-1">
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
      md: "# 自然" + "/n ### lsdjlkjl",
    };
  },
  async mounted() {
    this.getdev();
    // console.log(this.$refs.markdomw, this.md, a);
    // this.md = response.data
  },
  methods: {
    getdev() {
      window.fetch("/docs/README.md").then(async (res) => {
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

<style lang='scss' scoped>
</style>
