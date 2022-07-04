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
      const subData = await window.freelogApp.getSubDep();
      console.log(subData)
      subData.subDep.some(async (sub, index) => {
        if (index === 1) return true;
        await window.freelogApp.mountWidget(
          sub,
          document.getElementById("freelog-single"),
          subData,
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