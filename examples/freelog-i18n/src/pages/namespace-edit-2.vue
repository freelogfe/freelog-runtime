<template>
  <div class="i18n-m-namespace-edit-mode">
    <div class="i-m-nem-head">
      <div class="module-select-box">
        <label for="module-select">模块名称：</label>
        <el-select size="small" id="module-select" :value="selectedModuleName" @change="exchangeModuleName">
          <el-option :label="allModuleLabel" :value="ALL_MODULES"></el-option>
          <el-option v-for="item in reposModules" :key="item.name" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </div>
      <div class="state-select-box">
        <label for="state-select">状态：</label>
        <el-select size="small" id="state-select" :value="selectedState" @change="exchangeState">
          <el-option v-for="item in keyStates" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <el-input size="small"
        class="module-search-input"
        type="text" 
        suffix-icon="el-icon-search"
        placeholder="请输入内容进行Key筛选" 
        v-model="searchInputStr" @keyup.enter.native="refreshSidebar">
      </el-input>
      <div class="selected-tag-box" v-if="selectedTag != ''">
        <label for="tags-select">筛选标签：</label>
        <el-input
          class="selected-tag-input"
          v-if="selectedTagInputVisible"
          v-model="selectedTagInputVal"
          ref="selectedTagInput"
          size="small"
          @keyup.enter.native="handleTagInputConfirm"
          @blur="handleTagInputConfirm"></el-input>
        <el-tag v-else size="small" closable @close="selectedTag = ''" @click="showSelectedTagInput">{{selectedTag}}</el-tag>
      </div>
      <el-badge class="save-key-changes-btn" slot="reference" :value="changedKeys.length" :hidden="changedKeys.length === 0">
        <el-button type="primary" size="small" :disabled="changedKeys.length === 0" @click="saveChanges">
          保存<span>（共{{changedKeys.length}}个Key更改）</span>  
        </el-button>
      </el-badge>
      <el-button class="add-new-namescpace-btn" type="danger" size="small" @click="showNewKeyDialog">新增Key</el-button>
      <el-button class="add-new-module-btn" type="danger" size="small" @click="newModuleDialogVisible = true">新增模块</el-button>
    </div>
    <namespace-sidebar
      :refresSidebarCount.sync="refresSidebarCount"
      :selectedModuleName="selectedModuleName"
      :repositoryName="repositoryName"
      :searchInputStr="searchInputStr"
      :selectedState="selectedState"
      :filteredKeyInfos="filteredKeyInfos"
      :reposModules="reposModules"
      :languages="languages"
      :reposModulesMap="reposModulesMap"
      :changedKeysMap="changedKeysMap"
      :selectedKeyItem.sync="selectedKeyItem"
      :allModuleData="allModuleData"></namespace-sidebar>
    <div class="i-m-nem-body" v-if="selectedKeyItem != null">
      <div class="i-m-nem-breadcrumb-box">
        <el-breadcrumb separator="/" v-if="selectedRepoModule != null">
          <el-breadcrumb-item v-for="(item, index) in selectedRepoModule.keys" :key="'breadcrumb-'+index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <span class="i-m-nem-selected-key">{{selectedKeyItem.key}}</span>
        <clipboard :value="selectedKeyItem.key">
          <el-button class="i-m-nem-key-copy" type="primary" size="mini" plain>copy</el-button>
        </clipboard>
      </div>
      <key-tags 
        :languages="languages"
        :repositoryName="repositoryName"
        :selectedTag.sync="selectedTag"
        :selectedKeyItem="selectedKeyItem"
        :keyInfo.sync="selectedKeyInfo"></key-tags>
      <div class="clearfix">
        <namespace-card 
          v-for="lang in languages" 
          :key="lang"
          :language="lang"
          :languages="languages"
          :title="languagesMap[lang]"
          :selectedKeyItem="selectedKeyItem"
          @value-update="handleChanges"></namespace-card>
      </div>
    </div>
    <div class="i-m-nem-empty" v-else>
      <div class="empty-module-box" v-if="selectedModuleName !== ALL_MODULES && selectedModuleIsEmpty === true">
        <el-button class="add-del-module-btn" type="danger" size="small" @click="delEmptyModule">删除{{selectedModuleName}}模块</el-button>
        <p>当前模块为空（没有任何Key）</p>
      </div>
      <div v-else>暂无符合的Keys...</div>
    </div>

    <el-dialog class="i-m-nem-add-dialog" title="新增Key" width="480px" center 
      :close-on-click-modal="false" 
      :visible.sync="newKeyDialogVisible">
      <div class="module-select-box">
        <label>Key的所属模块：</label>
        <el-select size="small" id="module-select" placeholder="请选择模块" v-model="newKeyOfModuleName">
          <el-option v-for="item in reposModules" :key="item.name" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </div>
      <el-input placeholder="输入key" v-model="newKey" @input="validateNewKey"></el-input>
      <p class="add-key-error">{{newKeyValidtedError}}</p>
      
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="newKeyDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" 
          :disabled="newKeyValidtedError !== '' || newKeyOfModuleName == ''" 
          @click="addNewKey">确 定
        </el-button>
      </span>
    </el-dialog>

    <el-dialog class="i-m-nem-add-dialog" title="新增模块" width="480px" center
      :close-on-click-modal="false" 
      :visible.sync="newModuleDialogVisible">
      
      <el-input placeholder="输入模块名称" v-model="newModule" @input="validateNewModule"></el-input>
      <p class="add-key-error">{{newModuleValidtedError}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="newModuleDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" :disabled="newModuleValidtedError != ''" @click="addNewModule">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import objectPath from 'object-path'
import NamespaceCard from '../components/namespace-card.vue'
import KeyTags from '../components/key-tags.vue'
import Clipboard from '../components/clipboard.vue'
import NamespaceSidebar from '../components/namespace-sidebar.vue'
import { ALL_MODULES, I18n_NOT_PUSH_KEYS, I18n_NOT_PUSH_MODULES } from '../enum.js'
import iMixins from '../mixins.js'

export default {
  name: 'namespace-edit-mode',
  components: { NamespaceCard, KeyTags, Clipboard, NamespaceSidebar },
  mixins: [ iMixins ],
  props: {
    languages: Array,
    repository: Object,
    allModuleData: Object,
  },
  data() {
    return {
      ALL_MODULES,
      allModuleLabel: '全部模块',
      languagesMap: {
        'en': '英文', 
        'en-US': '英文',
        'zh-CN': '中文',
      },
      isRefreshingSidebar: false,
      searchInputStr: '',
      selectedRepoModule: null,
      selectedModuleName: '',
      filteredNamespaceList: [],
      renderedKeysListMap: {},
      selectedKeyItem: null,
      selectedKeyInfo: null,
      newKeyDialogVisible: false,
      newKey: '',
      newKeyOfModuleName: '',
      timer: null,
      newKeyValidtedError: '',

      newModuleDialogVisible: false,
      newModule: '',
      newModuleValidtedError: '',

      changedKeys: [],
      keyStates: [ 
        { label: '全部', value: 'all'}, 
        { label: '已更新', value: 'update'}, 
        { label: '存在空值', value: 'empty'},
      ],
      selectedState: 'all',
      refresSidebarCount: 0,
      selectedModuleIsEmpty: false,
      filteredKeyInfos: [],
      selectedTag: '',
      selectedTagInputVal: '',
      selectedTagInputVisible: false,
    }
  },
  computed: {
    repositoryName() {
      return this.repository.repositoryName
    },
    reposModules() {
      return this.repository.directoryTree 
    },
    reposModulesMap() {
      const map = {}
      this.repository.directoryTree.forEach(item => {
        map[item.name] = item
      })
      return map
    },
    changedKeysMap() {
      const map = {}
      this.changedKeys.forEach(item => {
        map[item.key] = item
      })
      return map
    },
  },
  watch: {
    async selectedModuleName() {
      this.searchInputStr = ''
      // this.changedKeys = []
      this.refreshSidebar()
      this.checkModuleIsEmpty()
    },
    selectedKeyItem() {
      if (this.selectedKeyItem == null) return
      console.log()
      this.selectedRepoModule = this.reposModulesMap[this.selectedKeyItem.moduleName]
      this.getKeyInfo()
    },
    selectedTag() {
      this.filteredKeyInfos = []
      if (this.selectedTag !== '') {
        window.fetch(`//i18n-ts.testfreelog.com/v1/i18nKeyInfos/list?tags=${this.selectedTag}`)
          .then(resp => resp.json())
          .then(res => {
            if (res.errcode === 0) {
              this.filteredKeyInfos = res.data != null ? res.data : []
            }
          })
      } 
    },
    allModuleData() {
      this.refreshSidebar()
      this.exchangeModuleName(this.ALL_MODULES)
    },
  },
  methods: {
    init() {
      if (this.reposModules) {
        this.setTopForLanguage(this.topedLanguage)
        this.exchangeModuleName(this.ALL_MODULES)
      }
    },
    refreshSidebar() {
      this.refresSidebarCount = this.refresSidebarCount + 1
    },
    checkModuleIsEmpty() {
      if (this.selectedModuleName === ALL_MODULES) {
        this.selectedModuleIsEmpty = false
      } else {
        const moduleData = this._getModuleI18nData(this.selectedModuleName)
        const tmpData = Object.values(moduleData)
        const dataKays = Object.keys(tmpData[0] || {})
        this.selectedModuleIsEmpty = dataKays.length === 0
      }
    },
    setTopForLanguage(lang) {
      const index = this.languages.indexOf(lang)
      if (index !== -1) {
        this.languages.splice(index, 1)
        this.languages.unshift(lang)
      }
    },
    exchangeModuleName(moduleName) {
      this.selectedModuleName = moduleName
    },
    _getModuleI18nData(moduleName) {
      return this.getModuleI18nData(this.allModuleData, this.repositoryName, moduleName)
    },
    exchangeState(state) {
      this.selectedState = state
      this.refreshSidebar()
    },
    showNewKeyDialog() {
      this.newKeyDialogVisible = true
      if (this.selectedModuleName === ALL_MODULES) {
        this.newKeyOfModuleName = ''
      } else {
        this.newKeyOfModuleName = this.selectedModuleName
      }
    },
    validateNewKey(key) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        key = key.replace(/^(\s*)|(\s*)$/g, '')
        if (key === '') {
          this.newKeyValidtedError = '命名格式有误; key不能为空'
          return 
        }
        // eslint-disable-next-line
        const isValid = /^[_-\w\d\.]+$/.test(key)
        if (!isValid) {
          this.newKeyValidtedError = '命名格式有误; key由大小字母、数字和字符（_、-、.）组合而成'
          return 
        }
        if (this.isKeyExisted(key)){
          this.newKeyValidtedError = '命名冲突： 输入的key已存在！'
          return 
        } 
        this.newKeyValidtedError = ''
      }, 50)
    },
    isKeyExisted(key) {
      if (this.changedKeysMap[key] != null) return true
      for (const _module of this.reposModules) {
        const i18nData = this._getModuleI18nData(_module.name)
        if (i18nData != null) {
          if (objectPath.get(i18nData['zh-CN'], key) != null) {
            return true
          }
        }
      }
      return false
    },
    addNewKey() {
      if (this.newKeyValidtedError === '') {
        this.handleChanges({
          moduleName: this.newKeyOfModuleName,
          operation: 'add',
          key: this.newKey, 
          valueType: 'string',
          'en': '', 
          'zh-CN': '',
        })
        this.newKeyDialogVisible = false
        this.newKey = ''
        this.checkModuleIsEmpty()
      }
    },
    handleChanges(updateData) {
      const { key, operation, moduleName } = updateData
      const changedKeys = this.changedKeys
      // 当前变更的key是否存在“已变更key的列表”，并获取它的序号
      let targetIndex = -1
      for (let i = 0; i < changedKeys.length; i++) {
        if (changedKeys[i].key === key && changedKeys[i].moduleName === moduleName) {
          targetIndex = i
          break
        }
      }
      switch (operation) {
        case 'update': {
          if (targetIndex !== -1) {
            changedKeys.splice(targetIndex, 1)
          }
          changedKeys.unshift(updateData)
          const i18nData = this._getModuleI18nData(moduleName)
          for (const lang of this.languages) {
            objectPath.set(i18nData, `${lang}.${key}`, updateData[lang])
          }
          break
        }
        case 'delete': {
          if (targetIndex !== -1) {
            changedKeys.splice(targetIndex, 1)
          } 
          changedKeys.unshift(updateData)
          break
        }
        case 'add': {
          changedKeys.unshift(updateData)
          const i18nData = this._getModuleI18nData(moduleName)
          for (const lang of this.languages) {
            objectPath.set(i18nData, `${lang}.${key}`, '')
          }
          this.refreshSidebar()
          break
        }
      }
    },
    validateNewModule(name) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        name = name.replace(/^(\s*)|(\s*)$/g, '')
        if (name === '') {
          this.newModuleValidtedError = '模块名称不能为空'
          return 
        }
        const isValid = /^[-\w]+$/.test(name)
        if (!isValid) {
          this.newModuleValidtedError = '模块名称有误；由大小字母和字符（-）组合而成'
          return 
        }
        if (objectPath.get(this.allModuleData, [ this.selectedReposName, name ]) != null){
          this.newModuleValidtedError = '模块名称冲突： 输入的模块名称已存在！'
          return 
        } 
        this.newModuleValidtedError = ''
      }, 50)
    },
    async addNewModule() {
      const moduleName = this.newModule.replace(/^(\s*)|(\s*)$/g, '')
      if (moduleName !== '') {
        const repositoryName = this.repositoryName
        const res = await window.fetch('//i18n-ts.testfreelog.com/v1/i18nRepository/newModule', {
          method: 'POST',
          body: { 
            moduleName, repositoryName,
            languages: [ 'zh-CN', 'en' ] 
          }
        }).then(res => res.json())
        if (res.errcode === 0) {
          this.$emit('add-module-success', moduleName, res.data)
          this.selectedModuleName = moduleName
          this.saveModuleHandlerRecord(moduleName, repositoryName, 'add')
          this.$message.success(`模块 ${moduleName} 创建成功！`)
        } else {
          this.$message.error(res.msg)
        }
        this.newModuleDialogVisible = false
      }
    },
    async delEmptyModule() {
      try {
        const moduleName = this.selectedModuleName
        await this.$confirm(`当前操作将会删除模块${moduleName}，是否继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const repositoryName = this.repositoryName
        const res = await window.fetch('//i18n-ts.testfreelog.com/v1/i18nRepository/module', {
          method: 'DELETE',
          body: { 
            moduleName, repositoryName,
          }
        }).then(res => res.json())
        if (res.errcode === 0) {
          this.$emit('del-module-success', moduleName,res.data)
          this.saveModuleHandlerRecord(moduleName, repositoryName, 'delete')
          this.exchangeModuleName(this.ALL_MODULES)
          this.$message.success(`模块 ${moduleName} 删除成功！`)
        } else {
          this.$message.error(res.msg)
        }
      } catch(e) {
        console.error(e)
        return
      }
    },
    saveModuleHandlerRecord(moduleName, repositoryName, type) {
      let notPushModules = localStorage.getItem(I18n_NOT_PUSH_MODULES) || '[]'
      notPushModules = JSON.parse(notPushModules)
      if (type === 'add') {
        notPushModules.push({
          moduleName, repositoryName
        })
      } else {
        notPushModules = notPushModules.filter(item => {
          return item.repositoryName !== repositoryName || item.moduleName !== moduleName
        })
      }
      localStorage.setItem(I18n_NOT_PUSH_MODULES, JSON.stringify(notPushModules))
    },
    async saveChanges() {
      const saveData = this.resolveSaveData()
      
      const res = await window.fetch('//i18n-ts.testfreelog.com/v1/i18nRepository/data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(saveData)
      }).then(res => res.json())
      if (res.errcode === 0) {
        this.$message.success(`保存成功！`)
        this.saveChangedKeysRecord(this.repositoryName, this.changedKeys)
        this.changedKeys = []
        this.$emit('update-repository-changes', res.data)
        saveData.changedFiles.forEach(change => {
          this.$emit('update-cache-JSONString', {
            path: change.targetPath, 
            value: JSON.parse(change.targetJSONString)
          })
        })
        
      } else {
        this.$message.error(`保存失败！${ res.msg}`)
      }
    },
    resolveSaveData() {
      const changedFiles = []
      const changedKeys = this.changedKeys
      const changedModulesSet = new Set()
      const changedFilesSet = new Set()
      
      // 更新本地的i18nData
      for (const keyItem of changedKeys) {
        const { key, moduleName } = keyItem
        const tmpI18nData = this._getModuleI18nData(moduleName)
        const isMulti = this.isMultifileStructure(moduleName)
        if (isMulti) {
          const tmpArr = key.split('.')
          changedFilesSet.add(tmpArr[0])
        }
        for (const lang of this.languages) {
          objectPath.set(tmpI18nData[lang], key, keyItem[lang])
        }
        changedModulesSet.add(moduleName)
      }

      // 获取发生变更的文件（路径&内容）
      for (const moduleName of changedModulesSet) {
        const _module = this.reposModulesMap[moduleName]
        const tmpI18nData = this._getModuleI18nData(moduleName)
        const isMulti = this.isMultifileStructure(moduleName)
        if (isMulti) {
          for (const filename of changedFilesSet) {
            for (const lang of this.languages) {
              const data = objectPath.get(tmpI18nData, [ lang, filename ])
              changedFiles.push({
                targetJSONString: JSON.stringify(data, null, '\t'),
                targetPath: [ _module.path, lang, `${filename}.json` ].join('/')
              })
            }
          }
        } else {
          for (const lang of this.languages) {
            changedFiles.push({
              targetJSONString: JSON.stringify(tmpI18nData[lang], null, '\t'),
              targetPath: [ _module.path, lang, 'index.json' ].join('/')
            })
          }
        }
      }
      return {
        repositoryName: this.repositoryName,
        changedFiles
      }
    },
    isMultifileStructure(moduleName) {
      const _module = this.reposModulesMap[moduleName]
      if (_module !== null) {
        if(_module.children[0].children.length > 1) {
          return true
        }
      }
      return false
    },
    saveChangedKeysRecord(repositoryName, changedKeys) {
      let notPushKeys = localStorage.getItem(I18n_NOT_PUSH_KEYS) || '[]'
      notPushKeys = JSON.parse(notPushKeys)
    
      notPushKeys.push({
        changedKeys: changedKeys.map(item => item.key), 
        repositoryName
      })
      localStorage.setItem(I18n_NOT_PUSH_KEYS, JSON.stringify(notPushKeys))
    },
    showSelectedTagInput() {
      // 功能未完全实现， 暂时关闭
      // return 
      
      this.selectedTagInputVisible = true
      this.selectedTagInputVal = this.selectedTag
      this.$nextTick(() => {
        this.$refs.selectedTagInput.$refs.input.focus()
      })
    },
    async handleTagInputConfirm() {
      const newTag = this.selectedTagInputVal.replace(/^(\s*)|(\s*)$/g, '')
      if (newTag !== '') {
        const postData = {
          repositoryName: this.repositoryName,
          selectedTag: this.selectedTag,
          newTag, 
        }
      
        const result = await window.fetch('//i18n-ts.testfreelog.com/v1/i18nKeyInfos/tags', {
          method: 'PUT',
          body: postData
        }).then(res => res.json()).catch(e => e)
        if (result instanceof Error) {
          this.$message.error(result)
        } else {
          if (result.errcode === 0 && result.data != null) {
            this.$message.success('标签修改成功！')
            for (let keyInfo of result.data) {
              if (keyInfo.name === this.selectedKeyItem.key) {
                this.selectedKeyInfo = keyInfo
                // this.selectedItemTags = keyInfo.tags
                break
              }
            }
          } else {
            this.$message.error(`标签修改失败！${result.msg}`)
          } 
        }
      }
      this.selectedTagInputVisible = false
      this.selectedTagInputVal = ''
      this.selectedTag = newTag
    },
    async getKeyInfo() {
      const { key, moduleName} = this.selectedKeyItem
      const { repositoryName } = this
      const url = `//i18n-ts.testfreelog.com/v1/i18nKeyInfos?name=${key}&moduleName=${moduleName}&repositoryName=${repositoryName}`
      const result = await window.fetch(url).then(resp => resp.json())
      if (result.errcode === 0) {
        this.selectedKeyInfo = result.data
      } 
    },
  },
  mounted() {
    this.init()
  },
}
</script>

<style lang="less">

.i-m-nem-sidebar {
  overflow: auto;
  position: absolute; top: 73px; bottom: 0; z-index: 10;
  width: 300px; border-right: 1px solid #e6e6e6;
  background-color: #fff;
  ul { box-sizing: border-box; height: 100%; padding: 5px 0; overflow: auto; }
  li { 
    margin: 3px 0; padding: 3px 10px;
    word-break: break-all; font-size: 14px; cursor: pointer;
    &:hover, &.active {
      background-color: #409EFF; color: #fff;
    }
    .change-badge, .empty-value {
      display: inline-block;
      margin: 0 -2px; padding: 2px 5px; border-radius: 50%;
      font-size: 12px; background-color: #F56C6C;color: #fff;
      transform: scale(.8);
    }
  }
}

.i-m-nem-head {
  padding: 20px 15px; border-bottom: 1px solid #e6e6e6;
  background-color: #fff;
  .module-select-box, .module-search-input, .state-select-box, .selected-tag-box {
    display: inline-block; margin-right: 15px; font-size: 14px;
  }
  .el-select {
    .el-input__inner { padding-left: 8px; }
  }
  .selected-tag-box {
    .selected-tag-input { width: 60px; }
  }
  .state-select-box {
    .el-select {
      width: 120px;
    }
  }
  .module-select-box {
    .el-select {
      width: 140px;
    }
  }
  .module-search-input { 
    width: 200px; 
    label { position: absolute; line-height: 40px; }
    .el-input { box-sizing: border-box; padding-left: 57px; }
  }
  .add-new-namescpace-btn, .add-new-module-btn, 
  .save-key-changes-btn {
    float: right; margin-left: 15px;
  }
}

.i-m-nem-body {
  overflow: hidden;
  min-height: 420px; margin-left: 300px; padding: 20px;
  .i-m-nem-breadcrumb-box {
    display: flex; margin-bottom: 15px; line-height: 32px;
    .el-breadcrumb {line-height: 32px; }
    .i-m-nem-selected-key { margin-left: 30px; color: #409EFF; }
    .i-m-nem-key-copy { padding: 3px 6px; }
  }
  .i-nem-edit-key-tags {
    .el-tag { cursor: pointer; }
  }
  .i-m-nem-edit-item { 
    float: left; width: 48%;
    &:not(:last-child) {
      margin-right: 3%; 
    }
  }
}

.i-m-nem-empty {
  display: flex; justify-content: center; align-items: center;
  height: 70%;
  .empty-module-box {
    text-align: center;
    p { margin-top: 10px; }
  }
}

.i-m-nem-add-dialog {
  .module-select-box {
    margin-bottom: 20px; text-align: center;
  }
  .key-input-box {
    display: flex;
    .el-input { width: 300px; }
  }
}
</style>

