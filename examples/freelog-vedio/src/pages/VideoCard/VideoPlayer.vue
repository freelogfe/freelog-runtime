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

            // captureImage() {
            //     const scale = 0.8;
            //     const video = document.querySelector('video');
            //     console.log(video, 'videovideo');
            //     video.addEventListener('loadeddata', captureImage);
            //
            //     var captureImage = function () {
            //         console.log('######');
            //         setTimeout(() => {
            //             var canvas = document.createElement("canvas");
            //             canvas.width = video.videoWidth * scale;
            //             canvas.height = video.videoHeight * scale;
            //             canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            //
            //             const src = canvas.toDataURL("image/png");
            //             console.log(src, 'src');
            //         }, 1000);
            //
            //     };
            // },
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
