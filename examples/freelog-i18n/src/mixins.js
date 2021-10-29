
import objectPath from 'object-path'
export default {
  data(){
    return {
      topedLanguage: 'zh-CN',
    }
  },
  methods: {
    getModuleI18nData(allModuleData, repositoryName, moduleName) {
      if (allModuleData != null) {
        return objectPath.get(allModuleData, [ repositoryName, moduleName ])
      } else {
        return null
      }
    },
    getModuleI18nKeysList(moduleName, moduleI18nData) {
      if (moduleI18nData == null) {
        return []
      }
      const language = this.topedLanguage || 'zh-CN'
      return this.getKeysListFromI18nData(moduleI18nData[language], moduleName)
    },
    getKeysListFromI18nData(data, moduleName) {
      const list = []
      if (data == null) return list
      for(const [ key, value ] of Object.entries(data)) {
        if (Array.isArray(value)) {
          list.push({ key, value, moduleName, valueType: 'array' })
        } else if (typeof value === 'string') {
          list.push({ key, value, moduleName, valueType: 'string' })
        } else {
          const arr = this.getKeysListFromI18nData(value, moduleName).map(item => {
            item.key = `${key}.${item.key}`
            return item
          })
          list.push(...arr)
        }
      }
      return list
    },
    formatKeysList(i18nData, keysList) {
      if (i18nData == null || keysList == null || this.languages == null) return 
      const languages = this.languages.filter(lang => lang !== this.topedLanguage)
      keysList = keysList.map(item => {
        item[this.topedLanguage] = item.value
        for (let i = 0; i < languages.length; i++) {
          const lang = languages[i]
          item[lang] = objectPath.get(i18nData, `${lang}.${item.key}`)
        }
        item.tags = []
        return item
      })
      return keysList
    },
    checkLanguageValue(item) {
      let isExistEmptyValue = false
      this.languages.forEach(lang => {
        isExistEmptyValue = isExistEmptyValue || !item[lang]
      })
      item.isExistEmptyValue = isExistEmptyValue
      return item 
    },
  },
}