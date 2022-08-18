<template>
  <div class="theme-main flex-row">
    <div class="w-300 container">
      <div v-for="a in gameList" :key="a.exhibitId" class="w-100x flex-column">
        <div
          @click="selectGame(a)"
          :class="[
            'py-30  bb-1 cur-pointer link text-center',
            a.exhibitId === gameId ? 'fc-white checked' : '',
          ]"
        >
          {{ a.exhibitName }}
        </div>
      </div>
    </div>
    <div id="freelog-single" class="mt-40"></div>
  </div>
</template>

<script>
export default {
  name: "freelog-document-app",
  data() {
    return {
      mount: false,
      gameName: "",
      gameId: "",
      gameList: [],
      widgetApp: null,
    };
  },
  computed: {},
  methods: {
    selectGame(item) {
      this.gameId = item.exhibitId;
      this.gameName = item.exhibitName;
      this.widgetApp.unmount(() => {
        this.widgetApp.mount();
      });
    },
    getGame() {
      return {
        gameId: this.gameId,
        gameName: this.gameName,
      };
    },
    async getSub() {
      const subData = await window.freelogApp.getSubDep();
      console.log(subData);
      subData.subDep.some(async (sub, index) => {
        if (index === 2) return true;
        if (index === 2) return true;
        console.log(sub);
        this.widgetApp = await window.freelogApp.mountWidget(
          sub,
          document.getElementById("freelog-single"),
          subData,
          {
            getGame: this.getGame,
          },
          ""
          // 'http://localhost:7107'
        );
        // let count = 0 const widgetApp =
        // const a = setInterval(() => {
        //   count++
        //   widgetApp.unmount()
        //   setTimeout(() => widgetApp.mount(), 2000)
        //   if (count === 4) clearInterval(a)
        // }, 3000);
      });
    },
  },
  async mounted() {
    window.freelogApp.onLogin(() => {
      window.location.reload();
    });
    const res = await window.freelogApp.getExhibitListByPaging({
      skip: 0,
      limit: 20,
      articleResourceTypes: "红白机",
    });
    console.log(res);
    this.gameList = res.data.data.dataList;
    this.gameId = res.data.data.dataList[0].exhibitId;
    this.gameName = res.data.data.dataList[0].exhibitName;
    !this.mount && this.getSub();
    this.mount = true;
  },
};
</script>

<style lang="less">
.link {
  &:hover {
    background-color: #94bff7;
    color: white;
  }

  &:active {
    background-color: #2376e5;
  }
}
.checked {
  background-color: #2784ff;
}
.container{
  border-right: 1px solid lightgray;
  box-shadow: 4px 0 4px 0px  rgb(231, 231, 231);
}
.theme-main {
  height: 100%;
  width: 100%;
}
#freelog-single {
  height: 100%;
  width: 100%;
}
</style>
