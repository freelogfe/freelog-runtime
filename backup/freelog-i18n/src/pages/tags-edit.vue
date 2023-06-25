<template>
  <div class="i-m-nem-tags-view">
    <div class="i-m-nem__header clearfix">
      <div class="module-select-box">
        <label for="module-select">模块名称：</label>
        <el-select size="small" id="module-select" :value="selectedModuleName" @change="exchangeModuleName">
          <el-option :label="allModuleLabel" :value="ALL_MODULES"></el-option>
          <el-option v-for="item in reposModules" :key="item.name" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </div>
      <el-input class="filter-search-input" type="text" size="small" suffix-icon="el-icon-search" placeholder="请输入内容进行Key筛选"
      v-model="searchInputStr" @keyup.enter.native="refreshRenderedKeysListMap"></el-input>
      <div class="tag-input-box">
        <el-input class="tag-input" type="text" size="small" placeholder="请输入tag" v-model="tagStr">
          <el-button type="primary" slot="append" icon="el-icon-plus" @click="batchAddTag">添加tag</el-button>
        </el-input>
      </div>
    </div>
    <div v-if="selectedModuleName === ALL_MODULES">
      <el-collapse v-model="activeNames" v-if="renderedKeysListMap != null">
        <el-collapse-item 
          v-show="renderedKeysListMap[_module.name] != null && renderedKeysListMap[_module.name].length"
          v-for="(_module, i) of reposModules" 
          :key="_module.name" 
          :title="_module.name" 
          :name="_module.name">
          <el-checkbox-group class="i-m-nem-tags-checkbox-group clearfix" v-model="checkedKeyListArr[i]" v-if="renderedKeysListMap != null" @change="onCheckedKeyListChange">
            <el-col :span="12" v-for="(item, j) in renderedKeysListMap[_module.name]" :key="item.key + j">
              <el-checkbox :label="item.key"></el-checkbox>
              <div class="i-m-nem-tag-group">
                <key-tags 
                  size="mini"
                  :addBtnVisible="false"
                  :languages="languages"
                  :repositoryName="repositoryName"
                  :selectedTag.sync="selectedTag"
                  :selectedKeyItem="item"
                  :keyInfo.sync="keyInfosMap[item.key]"></key-tags>
              </div>
            </el-col>
          </el-checkbox-group>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div style="margin-top: 20px;" v-else>
      <el-checkbox-group class="i-m-nem-tags-checkbox-group clearfix" v-model="checkedKeyListArr[0]" v-if="renderedKeysListMap != null" @change="onCheckedKeyListChange">
        <el-col :span="12" v-for="(item, j) in renderedKeysListMap[selectedModuleName]" :key="item.key + j">
          <el-checkbox :label="item.key"></el-checkbox>
          <div class="i-m-nem-tag-group" >
            <key-tags 
                  size="mini"
                  :addBtnVisible="false"
                  :languages="languages"
                  :repositoryName="repositoryName"
                  :selectedTag.sync="selectedTag"
                  :selectedKeyItem="item"
                  :keyInfo.sync="keyInfosMap[item.key]"></key-tags>
          </div>
        </el-col>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
import KeyTags from '../components/key-tags.vue'
import iMixins from '../mixins.js'
import { ALL_MODULES } from '../enum.js'
export default {
  name: 'tag-edit-mode',
  components: { KeyTags },
  props: {
    languages: Array,
    repository: Object,
    allModuleData: Object,
  },
  mixins: [ iMixins ],
  data() {
    return {
      ALL_MODULES,
      allModuleLabel: '全部模块',
      selectedModuleName: ALL_MODULES,
      selectedTag: '',
      searchInputStr: '',
      tagStr: '',
      renderedKeysMap: null,
      renderedKeysListMap: null,
      activeNames: [],
      checkedKeyListArr: [],
      targetCheckedKeyList: [],
      keyInfosMap: {}
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
  },
  methods: {
    async init() {
      const moduleNames = this.reposModules.map(item => item.name)
      this.activeNames = moduleNames
      this.clearCheckedKeyList()
      this.refreshRenderedKeysListMap()
      await this.fetchAllKeyInfos()
    },
    clearCheckedKeyList() {
      const leng = this.reposModules.length
      this.checkedKeyListArr = new Array(leng).fill([])
      this.targetCheckedKeyList = []
    },
    refreshRenderedKeysListMap() {
      const moduleNames = this.reposModules.map(item => item.name)
      this.renderedKeysListMap = {}
      this.renderedKeysMap = {}
      for (const moduleName of moduleNames) {
        const moduleI18nData = this.getModuleI18nData(this.allModuleData, this.repositoryName, moduleName)
        let moduleI18nKeysList = this.getModuleI18nKeysList(moduleName, moduleI18nData)
        moduleI18nKeysList = this.formatKeysList(moduleI18nData, moduleI18nKeysList)
        moduleI18nKeysList = this.filterKeysList(moduleI18nKeysList)
        this.renderedKeysListMap[moduleName] = moduleI18nKeysList
        this.renderedKeysMap[moduleName] = this.getKeysMap(moduleI18nKeysList)
      }
    },
    filterKeysList(moduleI18nKeysList) {
      const filterStr = this.searchInputStr
      return moduleI18nKeysList.filter(item => {
        let isFilter = item.key.toLowerCase().indexOf(filterStr) !== -1
        this.languages.forEach(lang => {
          if (item[lang] != null) {
            let value = item[lang]
            if (Array.isArray(item[lang])) {
              value = item[lang].join('')
            } 
            isFilter = isFilter || value.toLowerCase().indexOf(filterStr) !== -1
          }
        })
        return isFilter
      })
    },
    getKeysMap(list) {
      const map = {}
      for (let item of list) {
        map[item.key] = item
      }
      return map
    },
    async fetchAllKeyInfos() {
      const result = await window.fetch('//i18n-ts.testfreelog.com/v1/i18nKeyInfos/all').then(resp => resp.json())
      this.keyInfosMap = {}
      if (result.errcode === 0) {
        const keyInfosList = result.data
        for (const item of keyInfosList) {
          const {  name } = item
          this.keyInfosMap[name] = item
        }
      }
    },
    exchangeModuleName(moduleName) {
      if (ALL_MODULES === moduleName) {
        this.checkedKeyListArr = new Array(this.reposModules.length).fill([])
      } else {
        this.checkedKeyListArr = new Array(1).fill([])
      }
      this.targetCheckedKeyList = []
      this.selectedModuleName = moduleName
    },
    onCheckedKeyListChange() {
      const targetArr = []
      const tmpListArr = this.checkedKeyListArr
      const leng = tmpListArr.length
      for(let i = 0; i < leng; i++) {
        const keyList = tmpListArr[i]
        const moduleName = this.getModuleName(i)
        console.log('moduleName -', moduleName)
        const keysMap = this.renderedKeysMap[moduleName]
        for (let key of keyList) {
          if (keysMap[key]) {
            const tmp = this.resolveKeyInfo(keysMap[key])
            targetArr.push(tmp)
          }
        }
      }
      this.targetCheckedKeyList = targetArr
    },
    getModuleName(index) {
      if (this.selectedModuleName === ALL_MODULES) {
        return this.activeNames[index]
      } else {
        return this.selectedModuleName
      }
    },
    resolveKeyInfo(item) {
      const repositoryName = this.repositoryName
      const { moduleName } = item
      const values = this.languages.map(lang => {
        return { lang, value: item[lang] }
      })
      return {
        repositoryName, moduleName, 
        name: item.key,
        description: '',
        values,
      }
    },
    refreshRenderedKeysList() {
    },
    async batchAddTag() {
      const tag = this.tagStr.replace(/^(\s*)|(\s*)$/g, '')
      if (tag === '') {
        this.$message.warning('tag不能为空！')
        return
      }
      const list = this.targetCheckedKeyList
      if (list.length === 0) {
        this.$message.warning('您未选择key')
        return 
      }
      const postData = {
        repositoryName: this.repositoryName,
        newTag: tag,
        checkedKeyList: list
      }
      const result = await window.fetch('//i18n-ts.testfreelog.com/v1/i18nKeyInfos/tags', {
        method: 'POST',
        body: postData
      }).then(res => res.json())
      if (result.errcode === 0) {
        this.$message.success('tag添加成功！')
        this.clearCheckedKeyList()
        this.tagStr = ''
        await this.fetchAllKeyInfos()
      }
      console.log('[targetArr]:', JSON.parse(JSON.stringify(list)))
    },
  },
  mounted() {
    this.init()
  },
}
</script>

<style lang="less" >
.i-m-nem-tags-view {
  margin: 10px 20px; padding: 20px; border-radius: 2px;
  background: #fff; box-shadow: 0 4px 6px 0 rgba(31, 31, 31, 0.05), 0 0 2px 0 rgba(31, 31, 31, 0.2);

  .i-m-nem__header {
    margin-bottom: 10px;
    .module-select-box, .filter-search-input, .tag-input-box {
      display: inline-block;
    }
    .module-select-box { margin-right: 20px; }
    .el-input-group__append {
      border-color: #f56c6c;
      background-color: #f56c6c; color: #fff;
    }
    
    .filter-search-input { width: 200px; margin-right: 20px; }
    .tag-input-box { width: 300px; }
  }
  .el-collapse-item__header {
    font-size: 20px;
  }
  .i-m-nem-tag-group {
    display: inline-block; margin-left: 25px;
    .i-nem-edit-key-tags { margin: 0; }
    .el-tag { margin-right: 8px; }
  }
}
.i-m-nem-tags-checkbox-group {
  .el-col {
    margin-bottom: 5px; padding: 8px 0; border-bottom: 1px solid #EBEEF5;
  }
}
</style>