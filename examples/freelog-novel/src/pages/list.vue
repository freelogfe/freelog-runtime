<template>
  <div class="book-detail-wrap">
    <div class="book-information">
      <div class="book-img">
        <img :src="bookDetail.bookPoster || '//qidian.qpic.cn/qdbimg/349573/118447/180'">
      </div>
      <div class="book-info ">
        <h1>
          <em>{{bookDetail.name}}</em>
          <span  v-if="bookDetail.authorName">{{bookDetail.authorName}} 著</span>
        </h1>
        <p class="tag">
          <span class="blue" v-for="tag in bookDetail.tags" :key="tag">{{tag}}</span>
        </p>
        <p class="intro">{{bookDetail.intro}}</p>
      </div>
    </div>

    <div class="content-nav-wrap clearfix">
      <div class="nav-wrap">
        <ul>
          <li :class="{'active-tab': activeTab === 'intro'}" @click="switchTabHandler('intro')">
            <a href="javascript:">作品信息</a>
          </li>
          <li :class="{'active-tab': activeTab === 'catalog'}" @click="switchTabHandler('catalog')">
            <a href="javascript:">目录</a>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'intro'" class="book-content-intro-wrap clearfix">
      <div class="left-wrap">
        <div class="book-intro">
          <p>{{bookDetail.desc}}</p>
        </div>
      </div>
      <div class="right-wrap">
        <div class="author-state">
          <div class="author-info">
            <div class="info-wrap">
              <div class="author-photo">
                <img :src="bookDetail.authorImg || '//freelog-image.oss-cn-shenzhen.aliyuncs.com/freelog-novel-avatar.jpg'">
              </div>
              <p class="author-name">{{bookDetail.authorName}}</p>
              <p class="author-intro-desc">{{bookDetail.authorIntro}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'catalog'" class="catalog-content-wrap">
      <div class="volume" v-for="(volume, index) in volumes" :key="index">
        <h3>第{{volume.volumeIndex}}集 {{volume.volumeName}}</h3>
        <ul>
          <li v-for="(chapter, index) in volume.chapters" :key="'chapter'+index">
            <router-link :to="calcChapterLink(volume, chapter)">
              第{{chapter.versionProperty.chapter}}章 {{chapter.versionProperty.chapterName}}
              <i class="lock-chapter" v-if="chapter._detail.error"></i>
            </router-link>
          </li>
        </ul>
      </div>
      <div class="" v-if="volumes.length === 0">暂无数据，敬请期待！</div>
    </div>
  </div>
</template>

<script>
  import { onloadBookDetail, onloadChapters, onloadChapterContent } from '../data'

  export default {
    name: 'chapter-list',
    data: function () {
      return {
        bookDetail: {},
        volumes: [],
        activeTab: 'intro'
      }
    },
    mounted() {
      onloadBookDetail((bookDetail) => {
        this.bookDetail = bookDetail
      });
      onloadChapters((volumes) => {
        var promises = []
        volumes.forEach(v => {
          console.log(v.chapters)
          v.chapters.forEach(c => {
            c._detail = {}
            var promise = onloadChapterContent(c.exhibitId)
              .then((chapterDetail) => {
                c._detail = chapterDetail
              })
            promises.push(promise)
          })
        })

        Promise.all(promises).then(()=>{
          this.$forceUpdate()
        })
        this.volumes = volumes
      })
    },

    methods: {
      switchTabHandler: function (tab) {
        this.activeTab = tab;
      },
      calcChapterLink(volume, chapter) {
        return `volume/${volume.volumeIndex}/chapter/${chapter.versionProperty.chapter}?chapterId=${chapter.exhibitId}`;
      }
    }
  }
</script>


<style lang="less" scoped>
  @import "list.less";
</style>
