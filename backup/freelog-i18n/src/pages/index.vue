<template>
  <div
    class="i18n-management-container"
    v-loading="loadingVisible"
    element-loading-background="rgba(255, 255, 255, 0.5)"
  >
    <div class="imc-header">
      <h2>Freelog I18n</h2>
      <div class="repos-select-box">
        <el-dropdown @command="selectRepository">
          <span class="el-dropdown-link">
            <span>仓库名称：</span>
            <!-- <a :href="reposCommitsUrl" target="_blank">{{selectedReposName}}</a> -->
            {{ selectedReposName }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item in trackedRepositories"
              :key="item.repositoryName"
              :command="item.repositoryName"
            >
              {{ item.repositoryName }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-button-group>
        <el-button
          :type="item.mode === mode ? 'primary' : 'default'"
          v-for="item in modes"
          :key="item.mode"
          @click="mode = item.mode"
        >
          {{ item.label }}
        </el-button>
      </el-button-group>
      <div class="repos-btns-box">
        <repository-push-btn
          :repositoryName="selectedReposName"
          :repositoryChanges.sync="selectedReposChanges"
        ></repository-push-btn>
        <el-tooltip class="repos-commits" content="查看提交记录">
          <a :href="reposCommitsUrl" target="_blank">
            <el-button icon="el-icon-time" circle></el-button>
          </a>
        </el-tooltip>
      </div>
      <!-- <el-button type="primary" v-if="showGithubOAuthBtn">
        <a :href="githubOAuthUrl">GitHub oAuth</a>
      </el-button> -->
    </div>
    <div
      class="i-m-main-content"
      v-if="selectedRepository != null && allModuleData != null"
    >
      <file-edit-view
        v-show="targetComponentId === modes[0].id"
        :repository="selectedRepository"
        :fetchJSONFileContent="fetchJSONFileContent"
        @update-repository-changes="updateRepositoryChanges"
        @update-cache-JSONString="updateCacheJSONString"
      ></file-edit-view>
      <namespace-edit-view
        v-if="targetComponentId === modes[1].id"
        :repository="selectedRepository"
        :allModuleData="allModuleData"
        :languages="languages"
        @add-module-success="addModuleSuccess"
        @del-module-success="delModuleSuccess"
        @update-repository-changes="updateRepositoryChanges"
        @update-cache-JSONString="updateCacheJSONString"
      ></namespace-edit-view>
      <tags-edit-view
        v-if="targetComponentId === modes[2].id"
        :languages="languages"
        :repository="selectedRepository"
        :allModuleData="allModuleData"
      ></tags-edit-view>
    </div>
  </div>
</template>

<script>
import objectPath from "object-path";
import RepositoryPushBtn from "../components/repository-push.vue";
import FileEditView from "./file-edit.vue";
import NamespaceEditView from "./namespace-edit-2.vue";
import TagsEditView from "./tags-edit.vue";
import iMixins from "../mixins.js";
const cacheJSONString = {};
export default {
  name: "i18n-manament-home",
  components: {
    FileEditView,
    NamespaceEditView,
    TagsEditView,
    RepositoryPushBtn,
  },
  mixins: [iMixins],
  data() {
    return {
      mode: "namespace-edit",
      modes: [
        {
          id: "FileEditView",
          mode: "file-edit",
          label: "文件编辑模式",
          icon: "el-icon-files",
        },
        {
          id: "NamespaceEditView",
          mode: "namespace-edit",
          label: "Key编辑模式",
          icon: "el-icon-edit-outline",
        },
        {
          id: "TagsEditView",
          mode: "key-tags-edit",
          label: "Tags编辑",
          icon: "el-icon-edit",
        },
      ],
      languages: [],
      trackedRepositories: [],
      selectedRepository: null,
      selectedReposName: "freelogfe-web-repos",
      allModuleData: null,
      selectedReposChanges: [],
      showUpdatePopover: false,
      showEmptyCommitError: false,
      commitMsg: "",
      isPushing: false,
      showGithubOAuthBtn: false,
      githubUser: null,
      loadingVisible: false,
    };
  },
  computed: {
    targetComponentId() {
      const leng = this.modes.length;
      for (let i = 0; i < leng; i++) {
        if (this.mode === this.modes[i].mode) {
          return this.modes[i].id;
        }
      }
      return "";
    },
    githubOAuthUrl() {
      return `https://github.com/login/oauth/authorize?client_id=874c97335a3e4df726af&redirect_uri=${encodeURIComponent(
        window.location.href
      )}`;
    },
    reposCommitsUrl() {
      if (this.selectedRepository != null) {
        const { repositoryUrl, repositoryI18nBranch } = this.selectedRepository;
        return `${repositoryUrl}/commits/${repositoryI18nBranch}`;
      }
      return this.selectedRepository != null
        ? this.selectedRepository.repositoryUrl
        : "";
    },
  },
  watch: {
    selectedReposName() {
      this.init();
    },
  },
  methods: {
    async init() {
      this.loadingVisible = true;
      try {
        await this.fetchTrackedRepositories();
      } catch (e) {
        console.log("fetchTrackedRepositories - Error:", e);
      } finally {
        this.loadingVisible = false;
      }
    },
    async fetchTrackedRepositories() {
      const res = await window
        .fetch("http://i18n-ts.testfreelog.com/v1/trackedRepositories/list")
        .then((res) => {
          console.log(res);
          return res.json();
        });
      console.log(res);
      if (res.errcode === 0 && res.data.length) {
        this.resolveTrackedRepositories(res.data);
        await this.fetchAllModuleData(this.selectedReposName);
      }
    },
    resolveTrackedRepositories(data) {
      this.trackedRepositories = data;
      if (this.selectedReposName !== "") {
        for (const repository of this.trackedRepositories) {
          if (repository.repositoryName === this.selectedReposName) {
            this.selectedRepository = repository;
          }
        }
      } else {
        this.selectedRepository = this.trackedRepositories[0];
        this.selectedReposName = this.selectedRepository.repositoryName;
      }
      this.selectedReposChanges = this.selectedRepository.repositoryChanges;
      this.getLanguages();
    },
    async fetchAllModuleData(selectedReposName) {
      return window
        .fetch(
          `//i18n-ts.testfreelog.com/v1/i18nRepository/allData?repositoryName=${selectedReposName}`
        )
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res.errcode === 0) {
            this.allModuleData = res.data;
          } else {
            throw new Error(res.msg);
          }
        })
        .catch((e) => this.$error.showErrorMessage(e));
    },
    getLanguages() {
      if (this.selectedRepository == null) return [];
      var set = new Set();
      for (const item of this.selectedRepository.directoryTree) {
        for (const langItem of item.children) {
          set.add(langItem.name);
        }
      }
      this.languages = [...set];
    },
    async fetchJSONFileContent(path, keys) {
      if (cacheJSONString[path]) {
        return cacheJSONString[path];
      } else {
        const res = await window
          .fetch(
            `//i18n-ts.testfreelog.com/v1/i18nRepository/data?targetPath=${encodeURIComponent(
              path
            )}&pathType=1&repositoryName=${this.selectedReposName}`
          )
          .then((res) => res.json());
        if (res.errcode === 0) {
          const targetData = objectPath.get(res.data, keys);
          cacheJSONString[path] = targetData;
          return targetData;
        } else {
          return null;
        }
      }
    },
    selectRepository(reposName) {
      this.selectedReposName = reposName;
      for (const repository of this.trackedRepositories) {
        if (repository.repositoryName === reposName) {
          this.selectedRepository = repository;
        }
      }
    },
    updateRepositoryChanges(changes) {
      this.selectedReposChanges = changes;
    },
    updateCacheJSONString(data) {
      const { path, value } = data;
      cacheJSONString[path] = value;
    },
    addModuleSuccess(moduleName, data) {
      this.resolveTrackedRepositories(data);
      for (const language of this.languages) {
        objectPath.set(
          this.allModuleData,
          [this.selectedReposName, moduleName, language],
          {}
        );
      }
    },
    delModuleSuccess(moduleName, data) {
      this.resolveTrackedRepositories(data);
      objectPath.del(this.allModuleData, [this.selectedReposName, moduleName]);
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="less" scoped>
.i18n-management-container {
  min-width: 1080px;
  min-height: 100vh;
  .imc-header {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
    z-index: 100;
    min-width: 1040px;
    padding: 15px 20px;
    border-bottom: 1px solid #e6e6e6;
    background-color: #fff;
    box-shadow: 0 2px 4px 0 #d3d3d3;

    h2 {
      position: relative;
      margin-right: 40px;
      color: #606060;
      &::after {
        content: "";
        position: absolute;
        right: -20px;
        top: 4px;
        width: 2px;
        height: 24px;
        background-color: #e8e8e8;
      }
    }
    .repos-select-box {
      margin-right: 25px;
      font-size: 18px;
      font-weight: 500;
      color: #606060;
      .el-dropdown {
        font-size: 16px;
        .el-dropdown-link {
          a {
            text-decoration: underline;
            color: #606266;
          }
        }
      }
    }
    .repos-btns-box {
      flex: 1;
      text-align: right;
      .repos-commits {
        margin-left: 10px;
        .el-button {
          transform: translateY(2px);
          padding: 9px;
          font-size: 20px;
        }
      }
    }
  }
  .i-m-main-content {
    position: relative;
    box-sizing: border-box;
    min-height: 100vh;
    padding-top: 81px;
  }
}
</style>

<style lang="less">
.imc-repos-changes-box {
  overflow: auto;
  max-height: 150px;
  margin-bottom: 15px;
  h4 {
    line-height: 20px;
    font-weight: 500;
  }
  .imc-repos-change-item {
    line-height: 20px;
    color: #555;
    span {
      &.modified {
        color: #e6a23c;
      }
      &.deleted {
        color: #f56c6c;
      }
      &.added {
        color: #67c23a;
      }
    }
  }
}
.imc-github-user {
  margin-bottom: 10px;
  a {
    text-decoration: underline;
  }
}
.imc-repos-commit-box {
  margin-bottom: 15px;
  p {
    margin-bottom: 10px;
  }
}
</style>
