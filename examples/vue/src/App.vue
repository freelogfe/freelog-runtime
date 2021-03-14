<template >
	<div>
		<fd-header @toggle-menu="toggleAsideMenu"></fd-header>
		<div id="f-docs-body" :class="[ aSideMenuVisble ? 'aside-menu-opened' : 'aside-menu-closed' ]">
			<div id="f-docs-container" style="min-height: 100vh;" @click="hideAsideMenu">
				<fd-sidebar-left ></fd-sidebar-left>
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>

<script>
import fdHeader from './components/header.vue'
import fdSidebarLeft from './components/sidebar-left.vue'
import scrollHandler from './scroll-handler'

export default {
	name: 'freelog-document-app',
	components: { fdHeader, fdSidebarLeft },
	data() {
		return {
			aSideMenuVisble: false,
		}
	},
	computed: {
	
	},
	methods: {
		toggleAsideMenu() {
			this.aSideMenuVisble = !this.aSideMenuVisble
		},
		hideAsideMenu() {
			this.aSideMenuVisble = false
		}
	},
	mounted() {
		window.addEventListener('resize', this.hideAsideMenu)
		window.addEventListener('scroll', scrollHandler)
	},
	destroyed() {
		window.removeEventListener('resize', this.hideAsideMenu)
		window.removeEventListener('scroll', scrollHandler)
	},
}

</script>

<style lang="less">
	@import './index.less';
</style>