<template>
  <div id="f-docs-md-nav">
    <div class="fd-mdNav-inner-box">
      <div class="fd-mdNav-menu">
        <ul>
          <li 
            class="fd-mdNav-item" :class="{ 'active': activeAnchorId === nav.id }"
            v-for="(nav, index) in navItems" 
            :key="'mdnav-item-' + index" 
            @click="activeAnchorId = nav.id">
            <a class="fd-mdNav-link" :class="[ `type-${nav.type}` ]" :href="`#${nav.id}`">
              <span>{{nav.name}}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getScrollTop } from '../scroll-handler'
import throttle from 'lodash/throttle'
export default {
  name: 'f-docs-md-nav',
  props: {
    navItems: Array,
  },
  data() {
    return {
      activeAnchorId: this.$route.hash.replace(/^#/, ''),
      intersectionObserver: null,
      anchorTopArray: []
    }
  },
  methods: {
    refresh() {
      Promise.resolve().then(() => this.observeAnchors())
    },
    observeAnchors() {
      var tmpMap = new Map()
      const intersectionObserver = new IntersectionObserver((entries) => {
        entries = entries.filter(item => item.boundingClientRect.height !== 0)
        for (const item of entries) {
          const { target, boundingClientRect } = item
          const scrollTop = getScrollTop()
          tmpMap.set(target.id,boundingClientRect. top + scrollTop )
        }
        
        const tmpArr = []
        for (const [ id, anchorTop ] of tmpMap.entries()) {
          tmpArr.push({ id, anchorTop })
        }
        this.anchorTopArray = tmpArr.sort((v1, v2) => v1.anchorTop - v2.anchorTop)
      })

      // 开始观察
      this.getAnchors(this.navItems).forEach($anchor => intersectionObserver.observe($anchor))
      this.intersectionObserver = intersectionObserver
    },
    getAnchors(navItems) {
      return navItems
        .map(item => document.querySelector(`#${item.id}`))
        .filter(dom => dom != null)
    },
    inspectAnchors: throttle(function inspectAnchors () {
      const scrollTop = getScrollTop()
      let activeAnchorId = ''
      for (const item of this.anchorTopArray) {
        const { id, anchorTop } = item
        const remainTop = Math.ceil(scrollTop - anchorTop)
        if (remainTop >= 0) {
          activeAnchorId = id
        } else {
          break
        }
      }
      this.activeAnchorId = this.anchorTopArray.length > 0 ? activeAnchorId : this.activeAnchorId
    }, 50)
  },
  watch: {},
  beforeUpdate() {
    this.getAnchors(this.navItems).forEach($anchor => this.intersectionObserver.unobserve($anchor))
  },
  updated() {
    this.refresh()
  },
  mounted() {
    this.refresh()
    window.addEventListener('scroll', this.inspectAnchors)
  },
  destroyed() {
    
  },
}
</script>

<style lang="less">
  .fd-mdNav-inner-box {
    .fd-mdNav-menu {
      background-color: #fff;
    }
    .fd-mdNav-item {
      padding: 0 10px 0 12px; border-left: 2px solid #e8e8e8;
      line-height: 26px; font-size: 13px; 
      &.active { 
        border-left-color: #409EFF;
        .fd-mdNav-link { 
          color: #409EFF; 
          &:hover { color: #66b1ff; }
        }
      }
    }
    .fd-mdNav-link {
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; 
      display: block; box-sizing: border-box;
      width: 100%;
      color: #595959;
      &:hover { color: #8c8c8c; }
      // &.type-h2 { padding-left: 1em; }
      // &.type-h3 { padding-left: 2em; }
      // &.type-h4 { padding-left: 3em; }
      // &.type-h5 { padding-left: 4em; }
      // &.type-h6 { padding-left: 5em; }

      &.type-h2 { padding-left: 1.2em; }
      &.type-h3 { padding-left: 2.4em; }
      &.type-h4 { padding-left: 3.6em; }
      &.type-h5 { padding-left: 4.8em; }
      &.type-h6 { padding-left: 6em; }
    }
  }
  
</style>