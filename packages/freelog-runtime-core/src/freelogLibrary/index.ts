import { getExhibitDepFileStream } from './api'

interface LibraryInfo { version: string, metaJson: any, userName: any, format: string }

const resourceType = ["软件库"]

class FreelogLibrary {
  /* 资源标识resourceName为key, 值以version降序排列(每次添加完成后都进行一次排序) */
  #libraryCache: Record<string, Array<LibraryInfo>> = {}

  /* 以`${resourceName}?${version}`为key */
  #metaJson: any = {} 

  /* 节点信息 */
  nodeInfo: any

  constructor(nodeInfo: any) {
    this.nodeInfo = nodeInfo
    this.#init()
  }

  get dependencyTree() {
    return this.nodeInfo.themeInfo.versionInfo.dependencyTree
  }

  get themeInfo() {
    return this.nodeInfo.themeInfo
  }

  /* 初始化 */
  #init() {  }

  /* 加载js和css; (不支持es格式的库) */
  async getLibraryEntryUrls (resourceName: string, consumerResourceName: string, env: any) {
    if (!env) {
      const docUrl = window.location.host.replace(/(.+)(\..*)(\.com)/, `https://widget-docs$2$3`)
      console.warn(`调用函数 getLibraryEntryUrls 失败, 缺乏第三个参数, 请传入window对象, 详细请查阅开发者文档${docUrl}`)
      return 
    }
    
    const dependencyTree = await env.microApp.getData().freelogApp.getSelfDependencyTree(true)

    let metaJsonKey, metaJson, baseUrl, jsEntryUrl, cssEntryUrl

    // 1. 获取主题的依赖树, 在树中找到此资源标识resourceName的nid
    const environment = dependencyTree.find((item: any) => item.articleName === consumerResourceName)
    const target = dependencyTree.find((item: any) => item.articleName ===  resourceName && 
      item.resourceType[0] === resourceType[0] && item.parentNid === environment.nid)
    if (!target) {
      console.warn("请传递正确的资源标识, 并在freelog平台中声明为依赖!")
      return undefined
    }
    const { nid, version } = target
    metaJsonKey = `${resourceName}?${version}`

    // 2. 获取meta.json并存储
    const _cache = this.#getLibraryFromCache(resourceName, version)
    if (_cache) {
      metaJson = _cache.metaJson
    } else {
      const res = await getExhibitDepFileStream(this.themeInfo.exhibitId, { nid, returnUrl: false, subFilePath: "meta.json" })  
      if (res.status !== 200) {
        console.warn("获取meta.json失败!", res)
        return undefined
      } else {
        metaJson = res.data
        this.#metaJson[metaJsonKey] = res.data
      }
    }

    // 3. 根据meta.json中的内容，设置引入库的映射, 并开始加载js和css的入口文件
    const jsEntry = this.#getJsEntry(metaJsonKey)
    const cssEntry = this.#getCssEntry(metaJsonKey)
    jsEntryUrl = await getExhibitDepFileStream(this.themeInfo.exhibitId, { nid, returnUrl: true, subFilePath: jsEntry }) 
    baseUrl = jsEntryUrl.slice(0, jsEntryUrl.lastIndexOf('/'))
    if (_cache) {
      cssEntryUrl = `${baseUrl}/${cssEntry}`
    } else {
      cssEntryUrl = `${baseUrl}/${cssEntry}`
    }
    
    // 4. 缓存meta.json
    this.#addlibraryCache(resourceName, {
      version,
      metaJson,
      userName: target.articleName.split('/')[0],
      format: 'umd'
    })

    return {
      jsEntryUrl,
      cssEntryUrl,
      metaJson,
      baseUrl,
      version
    }
  }

  loadLibraryJs(url: string, metaJson: any, env: any) {
    let count = 0
    return new Promise(async (resolve) => {
      const handleLoaded = () => {
        let value = this.#parsePropertyPath(metaJson.nameSpace, env)
        if (value && (Object.keys(value).length || typeof value === 'function')) {
          resolve(value)
          // 置空
          this.#clearPropertyValue(metaJson.nameSpace, env)
        } else {
          setTimeout(() => {
            if (count > 0) {
              console.warn("库获取失败!")
              resolve(undefined)
              return
            }
            count++
            handleLoaded()
          }, 18)
        }
      }

      // 添加到子应用
      const tag = env.document.createElement("script");
      tag.addEventListener('load', handleLoaded)
      tag.setAttribute('src', url)
      env.document.body.appendChild(tag)
    })
  }

  loadLibraryCss(url: string, env: any) {
    if (!url || !env) return
    // 添加样式
    const cssLink = env.document.createElement('link')
    cssLink.setAttribute('rel', 'stylesheet')
    cssLink.setAttribute('href', url)
    env.document.body.appendChild(cssLink)
  }

  /* 根据指定的嵌套属性获取值 */
  #parsePropertyPath(nameSpace: string, env: any) {
    return nameSpace.split('.').reduce((pre: any, cur: any) => {
      if (!pre) return
      return pre[cur]
    }, env)
  }

  #clearPropertyValue(nameSpace: string, env: any) {
    const arr = nameSpace.split('.')
    const length = arr.length
    const lastKey = arr[length - 1]
    arr.reduce((pre: any, cur: any, index: number) => {
      if (!pre) return
      if (lastKey === cur) {
        pre[cur] = undefined
      }
      return pre[cur]
    }, env)
  }

  /* 获取js入口文件 format => 'umd' */
  #getJsEntry(metaJsonKey: string) {
    if (Array.isArray(this.#metaJson[metaJsonKey].js)) {
      console.warn("检测到有多个js入口文件, 默认加载第一个且不为空字符串")
      const item = this.#metaJson[metaJsonKey].js.find((ele: any) => !!ele.entry)
      return item?.entry
    } else {
      return this.#metaJson[metaJsonKey].js.entry
    }
  }

  /* 获取css入口文件 */
  #getCssEntry(metaJsonKey: string) {
    return this.#metaJson[metaJsonKey].css?.entry
  }

  /* 获取所有的meta.json */
  getMetaJson() {
    return this.#metaJson
  }

  /* 根据资源标识和版本号获取meta.json */
  getMetaJsonByNameAndVersion(resourceName: string, version: string) {
    return this.#metaJson[`${resourceName}?${version}`]
  }

  /* 从缓存中获取一个软件库的信息 */
  #getLibraryFromCache(resourceName: string, version?: string) {

    if (!this.#libraryCache[resourceName]) {
      return undefined
    }
    if (version) {
      return this.#libraryCache[resourceName].find(item => item.version === version)
    }
    return this.#libraryCache[resourceName] && this.#libraryCache[resourceName][0]
  }

  /* 添加一个软件库的信息 */
  #addlibraryCache(resourceName: string, value: LibraryInfo) {
    if (this.#libraryCache[resourceName]) {
      // 若存在相同的版本, 则不添加
      if (this.#libraryCache[resourceName].find(item => item.version === value.version)) {
        return
      }
      this.#libraryCache[resourceName].push(value)
    } else {
      this.#libraryCache[resourceName] = [value]
    }

    // 版本倒排序
    this.#libraryCache[resourceName] = this.#libraryCache[resourceName].sort((a, b) => {
      const aVersion = a.version
      const bVersion = b.version

      const versionA = aVersion.split('.').map(Number);
      const versionB = bVersion.split('.').map(Number);
      const maxLength = Math.max(versionA.length, versionB.length);
  
      for (let i = 0; i < maxLength; i++) {
        const numA = versionA[i] || 0;
        const numB = versionB[i] || 0;

        if (numA !== numB) {
          return numB - numA;
        }
      }
  
      if (versionA.length !== versionB.length) {
        return versionB.length - versionA.length;
      }

      return 0;
    })
  }
}

export { FreelogLibrary }