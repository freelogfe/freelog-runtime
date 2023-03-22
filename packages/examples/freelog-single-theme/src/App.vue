<template>
  <div class="theme-main">
    <div id="freelog-single2"></div>
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
      subData.subDep.some(async (sub, index) => {
        if (index === 1) return true;
        const app = await window.freelogApp.mountWidget(
          sub,
          document.getElementById("freelog-single2"),
          subData,
          "",
          "",
        );
        app.mountPromise.then(()=>{
          // console.log(111111, app.getApi())
          // app.unmount.then(()=>{
          //   console.log(3333, app.getApi())
          //   app.mount.then(()=>{
          //     console.log(44444, app.getApi())
          //   })
          // })
        })
      
        // setTimeout(() => {
        //   app.unmount(() => {
        //     console.log(33333);
        //     app.mount();
        //   });
        // }, 1500);
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
