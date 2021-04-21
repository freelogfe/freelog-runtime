<template>
  <div class="i18n-m-namespace-edit-mode">
    <div class="i-m-nem-head">
      <div class="module-select-box">
        <label for="module-select">模块名称：</label>
        <el-select size="small" id="module-select" :value="selectedModuleName" @change="exchangeModule">
          <!-- <el-option label="全部模块" :value="ALL_MODULES"></el-option> -->
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
        v-model="searchInputStr" @keyup.enter.native="filterNamespaceListByInput">
      </el-input>
      <el-badge class="save-key-changes-btn" slot="reference" :value="changedKeys.length" :hidden="changedKeys.length === 0">
        <el-button type="primary" size="small" :disabled="changedKeys.length === 0" @click="saveChanges">
          保存<span>（共{{changedKeys.length}}个Key更改）</span>  
        </el-button>
      </el-badge>
      <el-button class="add-new-namescpace-btn" type="danger" size="small" @click="showNewKeyDialog = true">新增Key</el-button>
    </div>
    <div class="i-m-nem-sidebar" v-loading="isRefreshingSidebar" v-if="filteredNamespaceList.length">
      <ul>
        <li 
          :class="{'active': item.key === selectedNamespace.key}"
          v-for="(item, index) in filteredNamespaceList" 
          :key="item.key + 'index'"
          @click="handleSelectNamespace(index)">
          <span class="change-badge" v-if="changedKeysMap[item.key]">{{badgeMap[changedKeysMap[item.key].operation]}}</span>
          <span class="empty-value" v-if="item.isExistEmptyValue">空</span>
          {{item.key}}
        </li>
      </ul>
    </div>
    <div class="i-m-nem-body" v-if="filteredNamespaceList.length">
      <div class="i-m-nem-breadcrumb-box">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item, index) in selectedModule.keys" :key="'breadcrumb-'+index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <span class="i-m-nem-selected-key">{{selectedNamespace.key}}</span>
        <clipboard :value="selectedNamespace.key">
          <el-button class="i-m-nem-key-copy" type="primary" size="mini" plain>copy</el-button>
        </clipboard>
      </div>
      <namespace-card 
        v-for="lang in languages" 
        :key="lang"
        :language="lang"
        :title="languagesMap[lang]"
        :selectedNamespace="selectedNamespace"
        :checkLanguageValue="checkLanguageValue"
        @value-update="handleChanges"></namespace-card>
    </div>
    <div class="i-m-nem-empty" v-if="filteredNamespaceList.length === 0">
      暂无相关的Key...
    </div>
    <el-dialog class="i-m-nem-add-dialog" title="新增Key" width="480px" center :visible.sync="showNewKeyDialog">
      <el-input placeholder="输入key" v-model="newKey" @input="validateNewKey"></el-input>
      <p class="add-key-error">{{newKeyValidtedError}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showNewKeyDialog = false">取 消</el-button>
        <el-button type="primary" size="small" :disabled="newKeyValidtedError != ''" @click="addNewKey">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import objectPath from 'object-path'
import NamespaceCard from '../components/namespace-card.vue'
import Clipboard from '../components/clipboard.vue'

const ALL_MODULES = '__ALL_MODULES__' + new Date().getTime()
export default {
  name: 'namespace-edit-mode',
  components: { NamespaceCard, Clipboard },
  props: {
    repository: Object,
    allModuleData: Object,
    selectedModuleName: String,
  },
  data() {
    return {
      ALL_MODULES,
      badgeMap: {
        'update': '改',
        'add': '增',
        'delete': '删'
      },
      languages: [],
      languagesMap: {
        'en': '英文', 
        'zh-CN': '中文',
      },
      isRefreshingSidebar: true,
      searchInputStr: '',
      selectedModule: null,
      targetModuleI18nData: null,
      targetNamespaceList: [],
      filteredNamespaceList: [],
      selectedNamespace: null,
      showNewKeyDialog: false,
      newModule: '',
      newKey: '',
      timer: null,
      newKeyValidtedError: '',
      changedKeys: [],
      keyStates: [ 
        { label: '全部', value: 'all'}, 
        { label: '已更新', value: 'update'}, 
        { label: '存在空值', value: 'empty'},
      ],
      selectedState: 'all'
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
    isMultifileStructure() {
      if (this.selectedModule !== null) {
        if(this.selectedModule.children[0].children.length > 1) {
          return true
        }
      }
      return false
    },
  },
  watch: {
    targetNamespaceList() {
      this.filterNamespaceListByInput()
    },
    async selectedModuleName() {
      this.searchInputStr = ''
      this.changedKeys = []
      this.selectedModule = this.reposModulesMap[this.selectedModuleName]
      try {
        this.isRefreshingSidebar = true
        if (this.selectedModuleName === ALL_MODULES) {
          this.targetModuleI18nData = objectPath.get(this.allModuleData, [ this.repositoryName ])
        } else {
          this.targetModuleI18nData = objectPath.get(this.allModuleData, [ this.repositoryName, this.selectedModuleName ])
        }
        this.isRefreshingSidebar = false
        this.resolveI18nData([ this.selectedModuleName ])
        this.handleSelectNamespace(0)
      } catch(e) {
        this.isRefreshingSidebar = false
        this.targetModuleI18nData = null
        this.targetNamespaceList = []
        console.error(e)
      }
    }
  },
  methods: {
    init() {
      console.log('init ---')
      if (this.reposModules) {
        this.exchangeModule(this.reposModules[0].name)
      }
    },
    fetchModuleI18nDataByModuleName(module) {
      return window.fetch(`//i18n-ts.testfreelog.com/v1/i18nRepository/data?targetPath=${encodeURIComponent(module.path)}&pathType=2&repositoryName=${this.repositoryName}`)
        .then(res => res.json())
        .then(res => {
          if (res.errcode === 0) {
            return objectPath.get(res.data, module.keys)
          } else {
            throw new Error(res.msg)
          }
        })
        .catch(e => this.$error.showErrorMessage(e))
    },
    getModuleI18nDataByModuleName(name) {
      return objectPath.get(this.allModuleData, [ this.repositoryName, moduleName ])
    },
    resolveI18nData(modules) {
      let targetNamespaceList = []
      for (const moduleName of modules) {
        const moduleI18nData = objectPath.get(this.allModuleData, [ this.repositoryName, moduleName ])
        // targetNamespaceList = this.getNamespaceListFromI18nData(moduleI18nData['zh-CN'])
      }
      this.targetNamespaceList = this.getNamespaceListFromI18nData(this.targetModuleI18nData['zh-CN'])
      this.languages = this.targetModuleI18nData != null ? Object.keys(this.targetModuleI18nData) : []
      this.setTopForLanguage('zh-CN')
      this.checkSpaceListByLang()
    },
    getNamespaceListFromI18nData(data) {
      const list = []
      if (data == null) return list
      for(const [ key, value ] of Object.entries(data)) {
        if (Array.isArray(value)) {
          list.push({ key, value, valueType: 'array' })
        } else if (typeof value === 'string') {
          list.push({ key, value, valueType: 'string' })
        } else {
          const arr = this.getNamespaceListFromI18nData(value).map(item => {
            item.key = `${key}.${item.key}`
            return item
          })
          list.push(...arr)
        }
      }
      return list
    },
    checkSpaceListByLang() {
      const tmpI18nData = this.targetModuleI18nData
      const languages = this.languages.filter(lang => lang !== 'zh-CN')
      this.targetNamespaceList.forEach(item => {
        item['zh-CN'] = item.value
        for (let i = 0; i < languages.length; i++) {
          const lang = languages[i]
          item[lang] = objectPath.get(tmpI18nData, `${lang}.${item.key}`)
        }
      })
    },
    filterNamespaceListByInput() {
      const str = this.searchInputStr.replace(/^(\s*)|(\s*)$/g, '')
      this.filteredNamespaceList = this.targetNamespaceList.map(item => {
        return this.checkLanguageValue(item) 
      }).filter(item => {
        let isFilter = item.key.indexOf(str) !== -1
        this.languages.forEach(lang => {
          if (item[lang] != null) {
            isFilter = isFilter || item[lang].indexOf(str) !== -1
          }
        })
        switch(this.selectedState) {
          case 'update': {
            isFilter = isFilter && !!this.changedKeysMap[item.key]
            break
          }
          case 'empty': {
            isFilter = isFilter && item.isExistEmptyValue
            break
          }
          case 'all': {}
          default: {}
        }
        return isFilter
      })
      this.handleSelectNamespace(0)
    },
    checkLanguageValue(item) {
      let isExistEmptyValue = false
      this.languages.forEach(lang => {
        isExistEmptyValue = isExistEmptyValue || !item[lang]
      })
      item.isExistEmptyValue = isExistEmptyValue
      return item 
    },
    async exchangeModule(moduleName) {
      if (this.changedKeys.length > 0) {
        try {
          await this.$confirm(`当前操作将会清空模块${this.selectedModuleName}的${this.changedKeys.length}个key更改，是否继续？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          this.$message({ type: 'success',  message: `已切换至名称为${moduleName}的模块（或项目）!`})
        } catch(e) {
          this.$message({ type: 'info', message: '已取消切换模块（或项目）'}) 
          return
        }
      } 
      this.$emit('update:selectedModuleName', moduleName)
    },
    exchangeState(state) {
      this.selectedState = state
      this.filterNamespaceListByInput()
    },
    handleSelectNamespace(index) {
      this.selectedNamespace = this.filteredNamespaceList[index]
    },
    validateNewKey(key) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        let error = ''
        key = key.replace(/^(\s*)|(\s*)$/g, '')
        if (key === '') {
          this.newKeyValidtedError = '命名格式有误; key不能为空'
          return 
        }
        const isValid = /^[_-\w\d\.]+$/.test(key)
        if (!isValid) {
          this.newKeyValidtedError = '命名格式有误; key由大小字母、数字和字符（_、-、.）组合而成'
          return 
        }
        if (objectPath.get(this.targetModuleI18nData['zh-CN'], key) != null || this.changedKeysMap[key] != null){
          this.newKeyValidtedError = '命名冲突： 输入的key已存在！'
          return 
        } 
        this.newKeyValidtedError = ''
      }, 50)
    },
    addNewKey() {
      if (this.newKeyValidtedError === '') {
        this.handleChanges({
          operation: 'add',
          key: this.newKey, 
          valueType: 'string',
          'en': '', 
          'zh-CN': '',
        })
        this.showNewKeyDialog = false
        this.newKey = ''
        this.handleSelectNamespace(0)
      }
    },
    handleChanges(updateData) {
      const { key, operation } = updateData
      const changedKeys = this.changedKeys
      // 当前变更的key是否存在“已变更key的列表”，并获取它的序号
      let targetIndex = -1
      for (let i = 0; i < changedKeys.length; i++) {
        if (changedKeys[i].key === key) {
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
          for (let i = 0; i < this.targetNamespaceList.length; i++) {
            const item = this.targetNamespaceList[i]
            if (item.key === updateData.key) {
              this.targetNamespaceList.splice(i, 1)
              this.targetNamespaceList.unshift(item)
              break
            }
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
          if (targetIndex === -1) {
            changedKeys.unshift(updateData)
            this.targetNamespaceList.unshift(updateData)
          }
          break
        }
      }
    },
    async saveChanges() {
      const saveData = this.resolveSaveData()
      const res = await window.fetch('//i18n-ts.testfreelog.com/v1/i18nRepository/data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: saveData
      }).then(res => res.json())
      if (res.errcode === 0) {
        this.$message.success(`保存成功！`)
        this.changedKeys = []
        this.$emit('update-repository-changes', res.data)
        saveData.changedFiles.forEach(change => {
          this.$emit('update-cache-JSONString', {
            path: change.targetPath, 
            value: JSON.parse(change.targetJSONString)
          })
        })
        
      } else {
        this.$message.error(`保存失败！`)
      }
    },
    resolveSaveData() {
      const changedFiles = []
      const changedKeys = this.changedKeys
      const modulePath = this.selectedModule.path
      if (this.isMultifileStructure) {
        this.languages.forEach(lang => {
          const tmpI18nData = this.targetModuleI18nData[lang]
          const fileNameSet = new Set()
          for (let j = 0; j < changedKeys.length; j++) {
            const tmpArr = changedKeys[j].key.split('.')
            fileNameSet.add(tmpArr[0])
            objectPath.set(tmpI18nData, changedKeys[j].key, changedKeys[j][lang])
          }
          for (const filename of fileNameSet) {
            changedFiles.push({
              targetJSONString: JSON.stringify(objectPath.get(tmpI18nData, filename), null, '\t'),
              targetPath: [ modulePath, lang, `${filename}.json` ].join('/')
            })
          }
        })
      } else {
        this.languages.forEach(lang => {
          const tmpI18nData = this.targetModuleI18nData[lang]
          for (let j = 0; j < changedKeys.length; j++) {
            objectPath.set(tmpI18nData, changedKeys[j].key, changedKeys[j][lang])
          }
          changedFiles.push({
            targetJSONString: JSON.stringify(tmpI18nData, null, '\t'),
            targetPath: [ modulePath, lang, 'index.json' ].join('/')
          })
        })   
      }
      return {
        repositoryName: this.repositoryName,
        changedFiles
      }
    },
    setTopForLanguage(lang) {
      const index = this.languages.indexOf(lang)
      if (index !== -1) {
        this.languages.splice(index, 1)
        this.languages.unshift(lang)
      }
    }
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
    word-break: break-word; font-size: 14px; cursor: pointer;
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
  .module-select-box, .module-search-input, .state-select-box {
    display: inline-block; margin-right: 15px; font-size: 14px;
  }
  .el-select {
    .el-input__inner { padding-left: 8px; }
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
  .add-new-namescpace-btn, .save-key-changes-btn {
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
}
</style>

