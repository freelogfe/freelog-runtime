<template>
  <video
    ref="videoPlayer"
    class="video-js"
    loop
  ></video>
</template>

<script>
    import videojs from 'video.js';

    export default {
        name: "VideoPlayer",
        props: {
            options: {
                type: Object,
                default() {
                    return {};
                }
            },
            play: Boolean,
        },
        data() {
            return {
                player: null
            }
        },
        mounted() {
            this.player = videojs(this.$refs.videoPlayer, this.options, () => {
                // console.log('onPlayerReady', this.player);
                // this.captureImage();
            });

            // this.test1();
        },

        methods: {
        },


        beforeDestroy() {
            if (this.player) {
                this.player.dispose()
            }
        },
        watch: {
            play(val) {
                if (val) {
                    this.player.play();
                } else {
                    this.player.pause();
                }
            }
        }
    }
</script>

<style>
  @import "~video.js/dist/video-js.css";
</style>
