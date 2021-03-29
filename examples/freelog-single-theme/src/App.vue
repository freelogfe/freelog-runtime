<template >
  <div id="freelog-single"></div>
</template>

<script>
export default {
  name: "freelog-document-app",
  data() {
    return {
      aSideMenuVisble: false,
    };
  },
  computed: {},
  methods: {},
  async mounted() {
    setTimeout(async () => {
      const presentableId = window.freelogApp.getSelfId(window);
      const subData = await window.freelogApp.getSubDep(
        "605af02b9e199a03e0fe68f0"
      );
      console.log(subData, document.getElementById("freelog-single"));
      subData.subDeps.forEach((sub, index) => {
        if (index === 1) return;
        window.freelogApp.mountWidget(
          sub,
          document.getElementById("freelog-single"),
          {
            //@ts-ignore
            presentableId: presentableId,
            entityNid: subData.entityNid,
            subDependId: sub.id,
          },
          ""
        );
      });
    }, 3000);
  },
};
</script>

<style lang="less">
@import "./index.less";
</style>