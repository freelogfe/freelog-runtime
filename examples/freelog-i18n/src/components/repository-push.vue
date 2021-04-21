<template>
  <el-popover placement="bottom" width="480" trigger="hover" :disabled="!repositoryChanges.length" v-model="showUpdatePopover">
    <el-badge  
      class="item"
      slot="reference" 
      v-loading="isPushing"
      element-loading-background="rgba(255, 255, 255, .5)"
      :value="repositoryChanges.length" 
      :hidden="repositoryChanges.length === 0">
      <el-button :disabled="repositoryChanges.length === 0">
        {{isPushing ? '提交中' : '提交变更'}}
        <i class="el-icon-circle-plus-outline" v-show="!isPushing"></i>
      </el-button>
    </el-badge>
    <div class="imc-github-user" v-if="githubUser != null">
      Signed in as <a :href="githubUser.html_url">{{githubUser.login}}</a> 
    </div>
    <div class="imc-repos-commit-box">
      <p>Commit Message: <span style="color: #F56C6C;" v-if="commitMsg === ''">不能为空</span></p>
      <div class="imc-commitMsg">
        <el-tag size="mini" @click="addMsgForUpdateKey">文案更新</el-tag>
        <el-tag size="mini" @click="addMsgForAddModule">模块更新</el-tag>
        <el-tag size="mini" @click="addMsgForTest">测试</el-tag>
      </div>
      <el-input type="textarea" :rows="2" v-model="commitMsg"></el-input>
    </div>
    <div class="imc-repos-changes-box">
      <h4>共{{repositoryChanges.length}}个文件变更：</h4>
      <p class="imc-repos-change-item" v-for="(change, index) in repositoryChanges" :key="'change'+index">
        <span :class="[change.type]">{{change.type}}: </span>
        {{change.path}}<a :href="`//i18n-ts.testfreelog.com/v1/file/download?repositoryName=${repositoryName}&filePath=${change.path}`" target="_blank">下载</a>
      </p>
    </div>
    <div style="text-align: right;">
      <el-button type="text" size="mini" @click="showUpdatePopover = false">取消</el-button>
      <el-button type="primary" size="mini" :disabled="commitMsg === ''" @click="commitAndPushChanges">提交</el-button>
    </div>
  </el-popover>
</template>

<script>
import { I18n_NOT_PUSH_MODULES, I18n_NOT_PUSH_KEYS } from '../enum.js'
export default {
  name: 'i18n-management-repository-push',
  components: {},
  props: {
    repositoryName: String,
    repositoryChanges: Array,
  },
  data() {
    return {
      showUpdatePopover: false,
      showEmptyCommitError: false,
      commitMsg: '',
      isPushing: false,
      showGithubOAuthBtn: false,
      githubUser: null,
      // githubUser: {
      //   "login":"Wweizhi","id":11386645,"node_id":"MDQ6VXNlcjExMzg2NjQ1",
      //   "avatar_url":"https://avatars3.githubusercontent.com/u/11386645?v=4","gravatar_id":"",
      //   "url":"https://api.github.com/users/Wweizhi","html_url":"https://github.com/Wweizhi","followers_url":"https://api.github.com/users/Wweizhi/followers","following_url":"https://api.github.com/users/Wweizhi/following{/other_user}","gists_url":"https://api.github.com/users/Wweizhi/gists{/gist_id}","starred_url":"https://api.github.com/users/Wweizhi/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/Wweizhi/subscriptions","organizations_url":"https://api.github.com/users/Wweizhi/orgs",
      //   "repos_url":"https://api.github.com/users/Wweizhi/repos","events_url":"https://api.github.com/users/Wweizhi/events{/privacy}","received_events_url":"https://api.github.com/users/Wweizhi/received_events","type":"User","site_admin":false,"name":null,"company":null,"blog":"","location":"Guangzhou","email":"790727372@qq.com","hireable":null,"bio":null,"public_repos":6,"public_gists":0,"followers":5,"following":8,"created_at":"2015-03-09T08:48:48Z","updated_at":"2020-02-27T06:34:44Z"
      // },
    }
  },
  methods: {
    async commitAndPushChanges() {
      const changes = this.repositoryChanges
      if (changes.length === 0) return
      if (this.commitMsg === '') return 
      try {
        this.isPushing = true
        const accessToken = localStorage.getItem('github_access_toekn')
        const result = await window.fetch('//i18n-ts.testfreelog.com/v1/i18nRepository/changes/push', {
          method: 'POST',
          body: {
            repositoryName: this.repositoryName,
            commitMsg: this.commitMsg,
            accessToken: accessToken,
          }
        }).then(res => res.json())
        
        if (result.errcode === 0) {
          this.clearNotPushInfo()
          this.showUpdatePopover = false
          this.$emit('update:repositoryChanges', [])
          this.$message.success('提交成功！')
          this.commitMsg = ''
        } else {
          this.$message.error(result.msg)
        }
      } catch(e) {
        this.$message.error(e.toString())
        console.error('commitAndPushChanges - e', e)
      } finally {
        this.isPushing = false
      }  
    },
    async getGithubUserInfo () {
      const accessToken = localStorage.getItem('github_access_toekn')
      if (accessToken != null) {
        const result = await this.$axios.get(`/v1/i18n/getGithubUserInfo?accessToken=${accessToken}`).then(res => res.data)
        if (result.errcode === 0) {
          this.githubUser = result.data
          return 
        }
      }
      this.showGithubOAuthBtn = true
    },
    async refreshGithubAccessToken() {
      if (this.$route.query.code) {
        const result = await this.$axios.post('/v1/i18n/getGithubAccessToken', {
          client_id: '874c97335a3e4df726af',
          client_secret: '3009d76fc4b7ed4914cfa57019166e8d764625fe',
          code: this.$route.query.code
        }).then(res => res.data)
        if (result.errcode === 0) {
          localStorage.setItem('github_access_toekn', result.data.access_token) 
          return result.data.access_token
        }
      }
    },
    addMsgForUpdateKey() {
      let msg = ''
      const tmp = localStorage.getItem(I18n_NOT_PUSH_KEYS)
      if (tmp != null) {
        try {
          const arr = JSON.parse(tmp)
          const tmpPhangedKeys = new Set()
          for (const item of arr) {
            const { changedKeys, repositoryName } = item
            if (this.repositoryName === repositoryName) {
              for (const key of changedKeys) {
                tmpPhangedKeys.add(key)
              }
            }
          }
          if (tmpPhangedKeys.size > 3) {
            msg = `：${[ ...tmpPhangedKeys ].slice(0, 3).join(', ')}等${tmpPhangedKeys.size}个Key`
          } else {
            msg = `：${[ ...tmpPhangedKeys ].join(', ')}`
          }
        } catch (e) {
          console.error('addMsgForUpdateKey --', e)
        }
      }
      this.setCommmitMsg(`Key更新${msg}\n`)
    },
    addMsgForAddModule() {
      let msg = ''
      const tmp = localStorage.getItem(I18n_NOT_PUSH_MODULES) 
      if (tmp != null) {
        try {
          const modules = JSON.parse(tmp)
          const newModules = new Set()
          for (const m of modules) {
            const { repositoryName, moduleName } = m
            if (this.repositoryName === repositoryName) {
              newModules.add(moduleName)
            }
          }
          msg = `：${[ ...newModules ].join(', ')}`
        } catch (e) {
          console.error('addMsgForAddModule --', this.addMsgForAddModule)
        }
      }
      this.setCommmitMsg(`新增模块${msg};\n`)
    },
    setCommmitMsg(msg) {
      const regE = new RegExp(msg, 'g')
      this.commitMsg = this.commitMsg.replace(regE, '')
      this.commitMsg = msg + this.commitMsg
    },
    clearNotPushInfo() {
      localStorage.setItem(I18n_NOT_PUSH_MODULES, '[]')
      localStorage.setItem(I18n_NOT_PUSH_KEYS, '[]')
    },
    addMsgForTest() {
      this.setCommmitMsg('i18n测试')
    }
  },
  async mounted() {
    await this.refreshGithubAccessToken()
    await this.getGithubUserInfo()
  },
}
</script>

<style lang="less">
.imc-repos-changes-box {
  overflow: auto;
  max-height: 150px; margin-bottom: 15px;
  h4 { line-height: 20px; font-weight: 500; }
  .imc-repos-change-item { 
    line-height: 20px; color: #555;
    span {
      &.modified { color: #E6A23C; }
      &.deleted { color: #F56C6C; }
      &.added { color: #67C23A; }
    }
    a { margin-left: 10px; font-size: 12px; text-decoration: underline; }
  }
}
.imc-github-user {
  margin-bottom: 10px;
  a { text-decoration: underline; }
}
.imc-commitMsg {
  margin-bottom: 8px;
  .el-tag { margin-right: 5px; cursor: pointer; }
}
.imc-repos-commit-box { 
  margin-bottom: 15px;
  p { margin-bottom: 10px; }
}
</style>