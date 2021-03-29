<template >
  <div id="freelog-single"></div>
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
      const presentableId = await window.freelogApp.getSelfId(window);
      const subData = await window.freelogApp.getSubDep(
        "605af02b9e199a03e0fe68f0"
      );
      console.log(presentableId, 3243444,subData, document.getElementById("freelog-single"));
      subData.subDeps.some((sub, index) => {
        if (index === 1) return true;
        console.log(sub, 234234234234);
        window.freelogApp.mountWidget(
          sub,
          document.getElementById("freelog-single"),
          {
            //@ts-ignore
            presentableId: "605af02b9e199a03e0fe68f0",
            entityNid: subData.entityNid,
            subDependId: sub.id,
          },
          ""
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
@import "./index.less";
</style>