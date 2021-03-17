<template>
  <div class="video-card">
    <!--    @mouseover="mouseover"
          @mouseout="mouseout"-->
    <a
      :style="'background-image: url(' + cover + ')'"
      @click="$emit('play')"
      @mouseenter="mouseover"
      @mouseleave="mouseout"
    >
      <div
        style="display: flex; align-items: center; justify-content: center; overflow: hidden; width: 100%; height: 100%;"
      >
        <video
          :style="videoWidthHeight"
          ref="refVideo"
          loop
          muted
        >
          <source
            v-for="(source,index) in sources"
            :src="source.src"
            :key="index"
            :type="source.type"
          />
        </video>
      </div>

      <div class="video-card__footer">
        <div>
          <div class="video-card__title">{{title}}</div>
          <div class="video-card__description">{{description}}</div>
        </div>
        <div class="video-card__play">立即观看</div>
      </div>
    </a>

    <div
      class="video-wrap"
      v-show="showPlay"
    >
      <a
        class="prev-next"
        :class="{disabled: disabledPrev}"
        @click="prevVideo"
      >&lt;</a>

      <div class="video-box">
        <div class="video-title">
          <span>{{title}}</span>
          <a @click="$emit('stop')">×</a>
        </div>

        <div class="video-player">
          <VideoPlayer
            :options="videoOptions"
            :play="showPlay"
          />
        </div>
      </div>

      <a
        class="prev-next"
        :class="{disabled: disabledNext}"
        @click="nextVideo"
      >&gt;</a>
    </div>
  </div>

</template>

<script>

    import VideoPlayer from "./VideoPlayer";

    export default {
        name: "VideoCard",
        components: {
            VideoPlayer,
        },
        props: {
            title: String,
            // description: String,
            cover: {
                type: String,
                default: '',
            },
            sources: Array,
            showPlay: {
                type: Boolean,
                default: false,
            },
            disabledPrev: {
                type: Boolean,
                default: false,
            },
            disabledNext: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                videoOptions: {
                    autoplay: false,
                    controls: true,
                    sources: this.sources,
                },
                // showPlay: false,
                dataURL: '',
                videoWidthHeight: {
                    // width: 260 / 365 > video.videoWidth / video.videoHeight ? 'auto' : '100%',
                    // height: 260 / 365 <= video.videoWidth / video.videoHeight ? 'auto' : '100%',
                },
                description: '',
            };
        },
        mounted() {
            const video = this.$refs.refVideo;
            video.addEventListener('loadeddata', () => {
                this.description = millisecondsFormatting(video.duration * 1000);
                this.videoWidthHeight = {
                    width: 260 / 365 < video.videoWidth / video.videoHeight ? 'auto' : '100%',
                    height: 260 / 365 >= video.videoWidth / video.videoHeight ? 'auto' : '100%',
                }
            });
        },
        methods: {
            mouseover() {
                // console.log('mouseover');
                const video = this.$refs.refVideo;
                if (video.paused) { //如果已暂停则播放
                    video.play(); //播放控制
                }
            },
            mouseout() {
                // console.log('mouseout');
                const video = this.$refs.refVideo;
                if (!video.paused) {
                    video.pause(); //暂停控制
                }
            },
            prevVideo() {
                if (this.disabledPrev) {
                    return;
                }
                this.$emit('prev');
            },
            nextVideo() {
                if (this.disabledNext) {
                    return;
                }
                this.$emit('next');
            },
        }
    }

    function millisecondsFormatting(ms) {
        let left = Math.floor(ms);
        const hh = Math.floor(left / 3600000);
        left = left % 3600000;
        const mm = Math.floor(left / 60000);
        left = left % 60000;
        const ss = Math.floor(left / 1000);
        left = left % 1000;
        return `${String(hh).padStart(2, '0')} : ${String(mm).padStart(2, '0')} : ${String(ss).padStart(2, '0')}.${String(left).padStart(3, '0')}`;
    }
</script>

<style lang="less" scoped>
  @import "index";
</style>
