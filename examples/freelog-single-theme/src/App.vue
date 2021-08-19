<template >
  <div class="theme-main">
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
      console.log(window.freelogApp);
      const presentableId = await window.freelogApp.getSelfId(window);
      const subData = await window.freelogApp.getSubDep(presentableId);
      console.log(122222, subData);
      subData.subDeps.some((sub, index) => {
        if (index === 1) return true;
        window.freelogApp.mountWidget(
          sub,
          document.getElementById("freelog-single"),
          {
            //@ts-ignore
            presentableId: presentableId,
            entityNid: subData.entityNid,
            subDependId: sub.id,
            resourceInfo: { resourceId: sub.id },
          },
          ""
        );
      });
    },
  },
  async mounted() {
    window.freelogApp.onLogin(() => {
      window.location.reload();
    });
    !this.mount && this.getSub();
    this.mount = true;
  },
};
</script>

<style lang="less">
.theme-main {
  height: 100%;
  width: 100%;
}
#freelog-single {
  height: 100%;
  width: 100%;
}
</style>