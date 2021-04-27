<template>
  <div class="flex-row w-100x h-61 space-between bb-1">
    <div class="w-200 text-center ml-20">
      <a
        aria-current="page"
        class="freelog fl-icon-logo-freelog fc-regular fs-34 td-none"
        href="/home"
      ></a>
    </div>
    <div class="flex-row align-end flex-1 justify-end">
      <el-input
        class="w-200 mb-10 mr-60 h-35"
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
      >
      </el-input>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo fs-36"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">简介</el-menu-item>
        <el-menu-item index="2">概念</el-menu-item>
        <el-menu-item index="3">常见问题</el-menu-item>
        <el-submenu index="4">
          <template slot="title">插件开发者</template>
          <el-menu-item index="4-1">开发指南</el-menu-item>
          <el-menu-item index="4-2">API</el-menu-item>
          <el-menu-item index="4-3">FAQ</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "1",
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      if (key == 1) {
        this.$router.push("home");
      }
      if (key == 2) {
        this.$router.push("concept");
      }
      if (key == 3) {
        this.$router.push("faq");
      }
      if (key == 4) {
        this.$router.push("dev");

        this.$router.push("guide");
      }
      if (key == "4-1") {
        // this.$router.push("dev");
        this.$router.push({name: "guide"});
      }
      if (key == "4-2") {
        // this.$router.push("dev");
        this.$router.push({name:"api"});
      }
      if (key == "4-3") {
        // this.$router.push("dev");
        this.$router.push({name:"faqDev"});
      }
    },
  },
  mounted() {
    console.log(this.$route);
    switch (this.$route.name) {
      case "home":
        this.activeIndex = "1";
        break;
      case "concept":
        this.activeIndex = "2";
        break;
      case "faq":
        this.activeIndex = "3";
        break;
      case "guide":
        this.activeIndex = "4-1";
        break;
      case "api":
        this.activeIndex = "4-2";
        break;
      case "faqDev":
        this.activeIndex = "4-3";
        break;
      default:
        this.activeIndex = "1";
        break;
    }
  },
};
</script>
<style>
.el-menu.el-menu--horizontal {
  border-bottom: none !important;
}
.el-menu-item {
  font-size: 14px;
}
.el-input__inner {
  line-height: 35px;
  height: 35px;
}
.el-input__icon {
  line-height: 35px;
}
</style>