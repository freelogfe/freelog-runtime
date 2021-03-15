<template >
  <header id="f-docs-header">
    <div id="f-docs-container">
      <div class="fd-h-menu-btn" @click="toggleMenu">
        <span class="el-icon-menu"></span>
      </div>
      <div class="fd-logo">
        <i class="freelog fl-icon-logo-freelog"></i>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'f-docs-header',
  methods: {
    toggleMenu() {
      this.$emit('toggle-menu')
    }
  },
}
</script>

<style lang="less" scoped>
  #f-docs-header {
    position: relative;
  }
  .fd-logo {
    box-sizing: border-box;
    height: 60px; padding: 0 20px; line-height: 60px;
    .fl-icon-logo-freelog {
      font-size: 36px; font-weight: 500; color: #409EFF;
    }
  }
  .fd-h-menu-btn { 
    display: none;
    position: absolute; top: 50%; left: 30px; transform: translateY(-50%);
    font-size: 1.5rem; cursor: pointer;
  }
  
</style>
