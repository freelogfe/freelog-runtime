<template>
  <div>
    <div class="freelog-video-player">
      <div class="freelog-video-player__container">
        <VideoCard
          v-for="(video, index) in videos"
          :title="video.title"
          description="戚薇征服年下男金瀚"
          :sources="video.sources"
          :showPlay="index === activeIndex"
          @play="activeIndex = index"
          @stop="activeIndex = -1"
          :key="index"
          @prev="activeIndex--"
          @next="activeIndex++"
          :disabledPrev="index === 0"
          :disabledNext="index === videos.length - 1"
        />

        <div style="width: 268px"></div>
        <div style="width: 268px"></div>
        <div style="width: 268px"></div>
        <div style="width: 268px"></div>
        <div style="width: 268px"></div>
        <div style="width: 268px"></div>
        <div style="width: 268px"></div>
        <div style="width: 268px"></div>
        <div style="width: 268px"></div>
        <div style="width: 268px"></div>
        <div style="width: 268px"></div>
        <div style="width: 268px"></div>
        <div style="width: 268px"></div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoCard from "./VideoCard/index.vue";
// import VideoPlayer from "./VideoPlayer";

export default {
  name: "home-page",
  components: {
    VideoCard,
    // VideoPlayer,
  },
  data() {
    return { 
      videos: [],
      activeIndex: -1,
    };
  },
  mounted() {
    this.handleData();
  },
  methods: {
    async handleData() {
      getData().then((result) => {
        console.log(result, "$$$$$$");
        this.videos = result.dataList.map((i) => {
          return {
            controls: true,
            title: i.title,
            sources: [
              {
                src: i.src,
                type: "video/mp4"
              },
            ],
          };
        });
      });
    },
  },
};

function getData() {
  return new Promise((resolve) => {
    const params = {
      resourceType: "video",
    };
    window.freelogApp.getPresentables(params).then((res) => {
      const dataList = [];
      res.data.data.dataList.forEach(async (i) => {
        const src = await window.freelogApp.getFileStreamById(
            i.presentableId,
            true
        );
        dataList.push({
          title: i.presentableName,
          src,
          // resourceID: i.resourceId,
        });
      });
      resolve({
        dataList,
        done: true
      });
    });
  });
}
</script>

<style lang="less" scoped>
.freelog-video-player {
  background-color: #2e373b;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow-y: auto;

  .freelog-video-player__container {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
    padding: 50px;
    box-sizing: border-box;
  }
}
</style>
