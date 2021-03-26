<template>
  <div class="card">
    <div>
      <!--      @onload="$emit('onload')"-->
      <img
        :src="src"
        style="min-height: 170px;"
        @load="$emit('onload')"
      />
      <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;font-family: 'freelog';">{{title}}edfgdffgdfg</div>
    </div>
    <img src="@/assets/new.png" />
    <div
      @click="$emit('preview')"
    >

      <div
        v-show="showCopyDone"
        style="line-height: 40px; padding: 0 15px; background-color: rgba(103,194,58,.8); color: #fff; border-radius: 8px;"
      >复制成功
      </div>
      <button
        @click="doCopy"
        style="display: inline-block; line-height: 28px;padding: 0 10px; border-radius: 14px; position: absolute; bottom: 45px; right: 10px; background-color: #4497ec; font-size: 12px; color: #fff; cursor: pointer; border: none; outline: none;"
      >复制发行名称
      </button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Card",
        props: {
            title: {
                type: String,
                default: '',
            },
            src: {
                type: String,
                default: '',
            },
            resourceID: {
                type: String,
                default: '',
            }
        },
        data() {
            return {
                // imgHeight: 0,
                showCopyDone: false,
            };
        },
        mounted() {
            // console.log(Math.round(Math.random() * 500) + 300, 'random')
            // this.imgHeight = Math.round(Math.random() * 300) + 200;
            // setTimeout(() => this.$emit('onload'), 100);
        },
        methods: {
            doCopy: function (evt) {
                evt.stopPropagation();
                this.$copyText(this.title).then(() => {
                    // alert('Copied');
                    // console.log(e)
                    this.showCopyDone = true;
                    setTimeout(() => this.showCopyDone = false, 1000);
                }, function (e) {
                    alert('Can not copy');
                    console.log(e)
                })
            }
        }
    }
</script>

<style scoped lang="less">
  .card {
    width: 250px;
    box-sizing: border-box;
    padding: 7px;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    cursor: zoom-in;

    &:hover {
      & > div:last-child {
        visibility: visible;
      }
    }

    & > div:first-child {
      & > img {
        display: block;
        border-radius: 8px;
        width: 100%;
        box-sizing: border-box;
      }

      & > div {
        font-size: 12px;
        color: #211922;
        line-height: 30px;
        padding: 0 8px 5px;
      }
    }

    & > div:last-child {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(0, 0, 0, .1);
      visibility: hidden;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
