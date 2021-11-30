 <template >
  <div id="theme-main">
    <div id="freelog-single"></div>
  </div>
</template>

<script>
export default {
  name: "freelog-document-app",
  data() {
    return {
      mount: false,
    };
  },
  computed: {},
  methods: {
    async getSub() {
      const res = await window.freelogApp.getPresentables({
        articleResourceTypes: "widget",
        isLoadVersionProperty: 1
      });
      console.log(res)
      const widgets = res.data.data.dataList;
      widgets.some((widget, index) => {
        if (index === 1) return true;
        window.freelogApp.mountWidget(
          widget,
          document.getElementById("freelog-single"),
        );
        // window.freelogApp.mountWidget(
        //   {
        //     exhibitId: widget.exhibitId,
        //     name: widget.exhibitName,
        //     articleId: widget.articleInfo.articleId,
        //     articleName:  widget.articleInfo.name,
        //     // articleId: widget.articleInfo.articleId,
        //   },
        //   document.getElementById("freelog-single")
        // );
      });
    },
  },
  async mounted() {
    !this.mount && this.getSub();
    this.mount = true;
  },
};
</script>

<style lang="less">
#theme-main {
  width: 100%;
  height: 100%;
}
#freelog-single {
  width: 100%;
  height: 100%;
}
</style>