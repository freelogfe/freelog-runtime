import presentable from '../../../.history/src/services/api/modules/presentable_20210419152606';
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
        resourceType: "widget",
      });
      const widgets = res.data.data.dataList;
      widgets.some((widget, index) => {
        if (index === 1) return true;
        window.freelogApp.mountWidget(
          {
            id: widget.resourceInfo.resourceId,
            presentableId: widget.presentableId,
            name: widget.presentableName,
            resourceId: widget.resourceInfo.resourceId,
          },
          document.getElementById("freelog-single")
        );
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