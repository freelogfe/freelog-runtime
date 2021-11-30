<template>
  <aside id="f-docs-sidebar-left" :class="[ isOpen ? 'opened' : 'closed' ]">
    <div class="fd-inner-box" v-loading="loadingVisible">
      <ul>
        <li 
          class="fd-aside-item" 
          v-for="item in mdArticles" 
          :key="item.exhibitId">
          <router-link class="fd-aside-link" :to="`/acticles/${item.exhibitId}/${item.exhibitName}`">
            <span :title="item.exhibitName">{{item.exhibitName}}</span>
          </router-link>
        </li>
      </ul>
      <div class="fd-loadmore" v-if="loadMoreVisile">
        正在加载更多...
      </div>
    </div>
    <div class="fd-sb-error" v-if="errMsg !== ''">
      {{errMsg}}
    </div>
    <div class="fd-toggle-icon-wrapper">
      <span class="fd-toggle-icon-trigger" @click="isOpen = !isOpen">
        <span> {{isOpen ? '&lt;' : '&gt;'}}</span>
      </span>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'f-docs-sidebar-left',
  data() {
    return {
      isOpen: true,
      mdArticles: [],
			loadingVisible: false,
      errMsg: '',
      page: 1,
      canLoadMore: false,
      loadMoreVisile: false
    }
  },
  watch: {},
  computed: {
    activePresentableId() {
      return this.$route.params.exhibitId
    }
  },
  methods: {
		async init() {
      this.loadingVisible = true
      this.mdArticles = await this.getMarkdownList()
			if (this.mdArticles.length > 0 && this.activePresentableId == null) {
				const { exhibitId, exhibitName } = this.mdArticles[0]
				this.$router.push(`/acticles/${exhibitId}/${encodeURIComponent(exhibitName)}`)
      }
      this.loadingVisible = false
      this.observeLastNavItem()
		},
		async getMarkdownList() {
			const {data: result} = await window.freelogApp.getPresentables({ articleResourceTypes: 'markdown' })
			if (result.errcode === 0) {
        const { dataList, page, pageSize, totalItem } = result.data
        this.canLoadMore = totalItem > page * pageSize
				return dataList
			} else {
        if (this.page === 0) {
          this.errMsg = '导航数据加载失败！'
        }
				this.$message.error(result.msg)
				return []
			}
    },
    async observeLastNavItem() {
      await new Promise(resolve => this.$nextTick(resolve))
      const oIntersection = new IntersectionObserver(async (entries) => {
        const { target, intersectionRatio } = entries[0]
        if (intersectionRatio > 0) {
          const isSuccess = await this.loadMore()
          if (isSuccess) {
            oIntersection.unobserve(target)
          }
        }
      })
      const lastNavItem = Array.from(document.querySelectorAll('.fd-aside-item')).pop()
      if (lastNavItem != null) {
        oIntersection.observe(lastNavItem)
      }
    },
    async loadMore() {
      this.loadMoreVisile = true
      let page = this.page + 1
      const list = await this.getMarkdownList(page)
      let loadSuccess = true
      if (list.length === 0 && this.canLoadMore) {
        // 加载失败：仍有数据未加载，须重新加载
        loadSuccess = false
        page = page - 1
      }
      this.loadMoreVisile = false
      this.page = page
      this.mdArticles = [ ...this.mdArticles, ...list ]
      if (loadSuccess && this.canLoadMore) {
        this.observeLastNavItem()
      }
      return loadSuccess
    },
  },
	mounted() {
		this.init()
	},
}

</script>

<style lang="less" scoped>

  #f-docs-body.fixed {
    .fd-toggle-icon-wrapper {
      .fd-toggle-icon-trigger { top: 60px; }
    }
  }
  #f-docs-sidebar-left {
    -webkit-transition: all .2s ease; transition: all .2s ease;
    &.closed {
      width: 20px; background-color: #fff;
      .fd-inner-box { 
        overflow: hidden; width: 20px; 
        -webkit-transition: all .2s ease; transition: all .2s ease;
      }
      .fd-toggle-icon-trigger {
        opacity: 1;
      }
    }
    &:hover { 
      .fd-toggle-icon-wrapper {
        .fd-toggle-icon-trigger { opacity: 1; }
      }
    }
    .fd-sb-error {
      transform: translateY(50vh);
      text-align: center;
    }
  }
  .fd-toggle-icon-wrapper {
    position: absolute; top: 0; right: 16px; z-index: 203;
    .fd-toggle-icon-trigger {
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      position: fixed; top: 120px; z-index: 2; 
      width: 32px; height: 32px;
      opacity: 0; will-change: top, opacity;
      -webkit-transition: top .2s ease,opacity .2s ease; transition: top .2s ease,opacity .2s ease;
      & > span {
        display: block;
        width: 24px; height: 24px; border: 1px solid #e8e8e8; border-radius: 50%;
        font-size: 12px; line-height: 24px; text-align: center;
        background-color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.1);
        -webkit-transition: all .1s ease-in-out; transition: all .1s ease-in-out;
        &:hover {
          color: #409EFF; border-color: #409EFF;
        }
      } 
    }
  }
  .fd-inner-box {
    position: relative;
    padding: 30px 0;
    .fd-aside-item {
      padding: 0 10px;
    }
    .fd-aside-link {
      display: block;
      padding: 7px 18px 7px 10px; 
      font-size: 14px; font-weight: 500; color: #000;
      overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
      &.router-link-active { 
        color: #409EFF; font-weight: 600;
        &:hover { color: #66b1ff; }
      }
      &:hover { 
        background-color: rgb(240, 240, 240); color: #959595;
      }
    }
    .fd-loadmore {
      padding: 12px; margin: 5px 20px;
      background-color: rgba(255, 255, 255, .9); text-align: center;
    }
  }
</style>

