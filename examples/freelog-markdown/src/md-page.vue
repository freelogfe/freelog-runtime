<template >
  <div style="display: flex; flex: 1;" >
    <div id="f-docs-main-content">
      <div class="fd-md-page-content" v-loading="loadingVisibble">
        <div ref="mdContainer"></div>
      </div>
    </div>
    <fd-markdown-nav :navItems="navItems"></fd-markdown-nav>
  </div>
</template>

<script>
import fdSidebarLeft from './components/sidebar-left.vue'
import fdMarkdownNav from './components/md-nav.vue'
/* eslint-disable */
import MarkdownParser from './markdown/index.js'

const mdParserMap = new Map()
export default {
	name: 'freelog-document-md-page',
	components: { fdSidebarLeft, fdMarkdownNav },
	data() {
		return {
      navItems: [],
      $mdParser: null,
      loadingVisibble: true,
		}
  },
  computed: {
  },
  watch: {
    '$route.params': {
      deep: true,
      handler(val, oldVal) {
        if (val.presentableId !== oldVal.presentableId) {
          this.refresh(val.presentableId)
        }
      },
    }
  },
	methods: {
		async init() {
      const { presentableId } = this.$route.params
      if (presentableId == null) return 
      await this.mountMarkdownArticle(presentableId)
      const hash = this.$route.hash
      const $dom = hash === '' ? null : document.querySelector(hash)
      if ($dom != null) {
        window.scrollTo(0, $dom.offsetTop + 60)
      }
    },
    async refresh(presentableId) {
      this.navItems = []
      await this.mountMarkdownArticle(presentableId)
    },
    async mountMarkdownArticle(presentableId) {
      this.loadingVisibble = true
      this.$refs['mdContainer'].innerHTML = `<freelog-markdown-parser presentableId="${presentableId}"></freelog-markdown-parser>`
      await new Promise(resolve => this.$nextTick(resolve))
      const $mdParser = document.querySelector('#f-docs-main-content freelog-markdown-parser')
      try {
        await $mdParser.mountPromise
        this.navItems = $mdParser._tocs.map(item => {
          const { text: name, level, anchor: id } = item
          return {
            name, id, 
            type: `h${level}`
          }
        })
      } catch(e) {
        this.$message.error('文章加载失败！！！')
      }
      this.loadingVisibble = false
    },
    createMarkdownParser(presentableId) {
      if (mdParserMap.get(presentableId) != null) {
        return mdParserMap.get(presentableId)
      }
      var count = 0
      const timer = setInterval(() => {
        count++
        if (count >= 5) clearInterval(timer)
      }, 1000)
      return 
    },
	},
	mounted() {
    this.init()
	},
	destroyed() {
	},
}

</script>

<style lang="less">
</style>