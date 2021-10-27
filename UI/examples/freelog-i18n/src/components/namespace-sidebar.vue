<template>
    <div class="i-m-nem-sidebar" v-if="renderedKeysMap.size !== 0">
      <div v-if="selectedModuleName === nameOfAllModule">
        <el-collapse v-model="activeNames">
          <el-collapse-item v-for="_module of reposModules" v-show="renderedKeysListMap[_module.name] != null && renderedKeysListMap[_module.name].length"
            :key="_module.name" 
            :title="_module.name" 
            :name="_module.name">
            <ul v-if="renderedKeysListMap[_module.name] != null">
              <li
                :class="{'active': item.key === selectedKeyItem.key && selectedKeyItem.moduleName === _module.name}"
                v-for="(item, index) in renderedKeysListMap[_module.name]" 
                :key="item.key + index"
                @click="handleSelectKey(item)">
                <span class="change-badge" v-if="changedKeysMap[item.key] && changedKeysMap[item.key].moduleName === _module.name">
                  {{badgeMap[changedKeysMap[item.key].operation]}}
                </span>
                <span class="empty-value" v-if="item.isExistEmptyValue">空</span>
                {{item.key}}
              </li>
            </ul>
            <!-- <div class="no-keys" v-else>No Kyes...</div> -->
          </el-collapse-item>
        </el-collapse>
      </div>
      <ul v-else>
        <li 
          :class="{'active': item.key === selectedKeyItem.key}"
          v-for="(item, index) in selectedModuleKeysList" 
          :key="item.key + index"
          @click="handleSelectKey(item)">
          <span class="change-badge" v-if="changedKeysMap[item.key]">{{badgeMap[changedKeysMap[item.key].operation]}}</span>
          <span class="empty-value" v-if="item.isExistEmptyValue">空</span>
          {{item.key}}
        </li>
      </ul>
    </div>
</template>

<script>
import { ALL_MODULES } from '../enum.js'
import iMixins from '../mixins.js'
export default {
  name: 'namespace-sidebar',
  props: {
    refresSidebarCount: Number,
    repositoryName: String,
    selectedModuleName: String,
    searchInputStr: String,
    selectedState: String,
    selectedTag: String,
    reposModules: {
      type: Array,
      default: () => [],
    },
    languages: {
      type: Array,
      default: () => [],
    },
    filteredKeyInfos: {
      type: Array,
      default: () => [],
    },
    selectedKeyItem: Object,
    reposModulesMap: Object,
    changedKeysMap: Object,
    allModuleData: Object,
  },
  mixins: [ iMixins ],
  data() {
    return {
      nameOfAllModule: ALL_MODULES,
      badgeMap: {
        'update': '改',
        'add': '增',
        'delete': '删'
      },
      activeNames: [],
      selectedModuleKeysList: [],
      filteredKeyInfosMap: new Map(),
      renderedKeysListMap: {},
      renderedKeysMap: new Map()
    }
  },
  watch: {
    refresSidebarCount() {
      this.refreshKeysList()
      this.refreshSelectedKeyItem()
      this.activeNames = this.reposModules.map(item => item.name)
    },
    filteredKeyInfos() {
      this.filteredKeyInfosMap = new Map()
      if (this.selectedTag !== '') {
        this.filteredKeyInfos.forEach(item => {
          this.filteredKeyInfosMap.set(item.name, item) 
          return item
        })
      }
      this.$emit('update:refresSidebarCount', this.refresSidebarCount + 1)
    },
  },
  methods: {
    handleSelectKey(item) {
      this.$emit('update:selectedKeyItem', item)
    },
    refreshSelectedKeyItem() {
      let list
      if (this.selectedModuleName !== this.nameOfAllModule) {
        this.selectedModuleKeysList = this.renderedKeysListMap[this.selectedModuleName]
        list = this.selectedModuleKeysList
      } else {
        for (const _module of this.reposModules) {
          const tmpList = this.renderedKeysListMap[_module.name]
          if (tmpList.length > 0) {
            list = tmpList
            break
          }
        }
      }
      if (this.renderedKeysMap.get(this.getUniqueKey(this.selectedKeyItem)) === 1) return 
      if (list != null && list.length) {
        this.handleSelectKey(list[0])
      } else {
        this.handleSelectKey(null)
      }
    },
    refreshKeysList() {
      console.log('[refreshKeysList]')
      if (this.selectedModuleName === ALL_MODULES) {
        this.refreshRenderedKeysListMap(this.reposModules.map(item => item.name))
      } else {
        this.refreshRenderedKeysListMap([ this.selectedModuleName ])
      }
    },
    refreshRenderedKeysListMap(moduleNames) {
      for (const moduleName of moduleNames) {
        const moduleI18nData = this.getModuleI18nData(this.allModuleData, this.repositoryName, moduleName)
        let moduleI18nKyesList = this.getModuleI18nKeysList(moduleName, moduleI18nData)
        moduleI18nKyesList = this.formatKeysList(moduleI18nData, moduleI18nKyesList)
        moduleI18nKyesList = this.filterKeysList(moduleI18nKyesList)
        moduleI18nKyesList = this.rearrangeKeysList(moduleI18nKyesList)
        this.renderedKeysListMap[moduleName] = moduleI18nKyesList
      }
      this.collectRenderedKey(moduleNames)
    },
    // key排列：置顶已修改或存在空值的key
    rearrangeKeysList(keysList) {
      var rearrangedKeyItems = []
      keysList = keysList.filter(item => {
        const changedkeyItem = this.changedKeysMap[item.key]
        if (changedkeyItem != null && changedkeyItem.moduleName === item.moduleName) {
          rearrangedKeyItems.push(changedkeyItem)
          return false
        }
        return true
      })
      keysList = keysList.filter(item => {
        if (item.isExistEmptyValue) {
          rearrangedKeyItems.push(item)
          return false
        }
        return true
      })
      for (const item of rearrangedKeyItems) {
        keysList.unshift(item)
      }
      return keysList
    },
    filterKeysList(moduleI18nKyesList) {
      const str = this.searchInputStr.replace(/^(\s*)|(\s*)$/g, '').toLowerCase()
      return moduleI18nKyesList.map(item => {
        return this.checkLanguageValue(item) 
      }).filter(item => {
        let isFilter = item.key.toLowerCase().indexOf(str) !== -1
        this.languages.forEach(lang => {
          if (item[lang] != null) {
            let value = item[lang]
            if (Array.isArray(item[lang])) {
              value = item[lang].join('')
            } 
            isFilter = isFilter || value.toLowerCase().indexOf(str) !== -1
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
          case 'all': break
          default: break
        }
        return isFilter
      }).filter(item => {
        if (this.filteredKeyInfos.length === 0) {
          return true
        } else {
          const keyInfo = this.filteredKeyInfosMap.get(item.key)
          return keyInfo != null && keyInfo.moduleName === item.moduleName
        }
      })
    },
    collectRenderedKey(moduleNames) {
      const map = new Map()
      for (const moduleName of moduleNames) {
        const keysList = this.renderedKeysListMap[moduleName]
        for (const keyItem of keysList) {
          const tmp = this.getUniqueKey(keyItem)
          map.set(tmp, 1)
        }
      }
      this.renderedKeysMap = map
    },
    getUniqueKey(item) {
      return item != null ? `${item.moduleName}||${item.key}` : ''
    }
  },
  mounted() {
    
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
      margin: 3px 0; padding: 3px 10px 3px 14px;
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

    .el-collapse-item__header{
      padding-left: 10px; border-left: 4px solid #409EFF;
      font-size: 20px;
    } 
    
    .el-collapse-item__content {
      padding-bottom: 10px;
      ul { padding: 0; }
      .no-keys { padding-top: 10px; padding-left: 14px; color: #999; }
    }
  }
    
</style>
