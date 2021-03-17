/* esli
<template>
  <div class="water-picture">
    <div class="water-picture-container">
      <div
        v-for="(item, index) in Array(columns)"
        :ref="'ref' + index"
        :key="index"
        class="water-picture-container__column"
      >
        <Card
          v-for="i in dataSource[index]"
          :title="i.title"
          :src="i.src"
          :key="i.index"
          @onload="pushData"
          @preview="openLightBox(i.title)"
        />
      </div>
    </div>

    <LightBox
      v-if="showLightBox"
      :images="images"
      :startAt="startAt"
    ></LightBox>
    <div ref="loadingRef" class="water-picture__loading">
      {{
        loading === 2 && this.bufferList.length === 0
          ? "别扯了，我也是有底线的~"
          : "正在加载中..."
      }}
    </div>
  </div>
</template>

<script>
import Card from "./Card";
import LightBox from "vue-image-lightbox";

export default {
  name: "home-page",
  components: {
    Card,
    LightBox,
  },
  data() {
    return {
      page: 0, // 当前加载到的页面
      bufferList: [], // 数据暂存区
      columns: Math.floor(window.innerWidth / 250), // 瀑布流的列数
      dataSource: [], // 真正会显示在界面的数据
      loading: 0, // 0 正常 1 正在加载 2 没有数据了,

      // 预览图片列表
      images: [
        // {
        //     thumb: i.src,
        //     src: i.src,
        //     caption: i.title, // Optional
        //     srcset: i.src // Optional for displaying responsive images
        // },
      ],
      // 是否显示预览器
      showLightBox: false,
      // 图片预览的索引
      startAt: 0,
    };
  },
  mounted() {
    this.init();

    window.onscroll = () => {
      // console.log(this.$refs.loadingRef, '******');
      if (
        this.$refs.loadingRef.getBoundingClientRect().top <=
        window.innerHeight * 1.5
      ) {
        this.fillBufferList();
      }
    };

    // let timeout = null;
    // window.onresize = () => {
    //     if (timeout) {
    //         clearTimeout(timeout);
    //     }
    //     timeout = setTimeout(() => {
    //         this.init();
    //     }, 500);
    // };
  },
  methods: {
    init() {
      this.dataSource = Array(this.columns)
        .fill(null)
        .map(() => []);
      setTimeout(() => {
        this.fillBufferList();
      });
    },
    // initWindowResize() {
    //     this.bufferList = [
    //         ...this.dataSource,
    //         ...this.bufferList,
    //     ];
    //     this.dataSource = Array(this.columns).fill(null).map(() => []);
    //     this.pushData();
    // },
    /**
     * 数据获取的后的缓存区
     */
    fillBufferList() {
      if (this.loading === 1 || this.loading === 2) {
        return;
      }
      this.page++;
      this.loading = 1;
      getData(this.page).then((result) => {
        console.log("result ---", result);
        this.bufferList = result.dataList;
        this.images = [
          ...this.images,
          ...result.dataList.map((i) => ({
            thumb: i.src,
            src: i.src,
            caption: i.title, // Optional
            srcset: i.src, // Optional for displaying responsive images
          })),
        ];
        console.log(result, this.images);
        if (result.done) {
          this.loading = 2;
        }
        this.pushData();
      });
      // console.log(this.bufferList, 'this.bufferList');
    },
    /**
     * 向屏幕上填充数据
     */
    pushData() {
      // 当缓冲区没有数据时，检查是否还需要继续加载资源
      if (this.bufferList.length === 0) {
        if (this.loading === 2) {
          return;
        }
        this.loading = 0;
        if (
          this.$refs.loadingRef.getBoundingClientRect().top <=
          window.innerHeight * 1.5
        ) {
          this.fillBufferList();
        }
        return;
      }
      const ele = this.bufferList.shift();
      this.dataSource[this.getMinHeightColumnsIndex()].push(ele);
    },

    /**
     * 获取高度最低列的索引
     * @return {number}
     */
    getMinHeightColumnsIndex() {
      const eleHeights = Array(this.columns)
        .fill(-1)
        .map((i, j) => this.$refs["ref" + j][0].getBoundingClientRect().height);
      return eleHeights.indexOf(Math.min.apply(Math, eleHeights));
    },

    openLightBox(title) {
      this.showLightBox = false;
      // console.log(this.images, 'this.images');
      this.startAt = this.images.findIndex((i) => i.caption === title);
      // console.log(this.startAt, 'this.startAt');
      setTimeout(() => (this.showLightBox = true));
    },
    closeLightBox() {
      this.showLightBox = false;
    },
  },
  computed: {
    // images() {
    //     console.log(this.dataSource, 'this.dataSource');
    //     return this.dataSource.map(i => ({
    //         thumb: i.src,
    //         src: i.src,
    //         caption: i.title, // Optional
    //         srcset: i.src // Optional for displaying responsive images
    //     }))
    // }
  },
};

function getData(page = 1) {
  let pageSize = 10;
  return new Promise((resolve) => {
    window.freelogApp
      .getPresentables({
        skip: (page - 1) * pageSize,
        limit: pageSize,
        resourceType: "image",
      })
      .then(async (res) => {
        console.log(res);
        const dataList = []
         res.data.data.dataList.forEach(async (i, index) => {
            const src = await window.freelogApp.getFileStreamById(
              i.presentableId,
              true
            );
            console.log(src,{
              title:  i.presentableName ,
              src,
              index,
              // resourceID: i.resourceId,
            });
            dataList.push( {
              title:  i.presentableName,
              src,
              index,
              // resourceID: i.resourceId,
            });
          });
         
        resolve({
          dataList,
          done: (page - 1) * pageSize + pageSize > res.data.data.totalItem,
        });
      });
  });
}
</script>

<style scoped lang="less">
.water-picture {
  .water-picture-container {
    display: flex;
    align-items: flex-start;
    justify-content: center;

    .water-picture-container__column {
      width: 250px;
    }
  }

  .water-picture__loading {
    height: 60px;
    font-size: 16px;
    color: #888;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
