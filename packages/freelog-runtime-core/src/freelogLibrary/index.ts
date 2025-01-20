import { getExhibitDepFileStream } from './api'

interface LibraryInfo { version: string, baseUrl: string, metaJson: any, userName: any, format: string }

const resourceType = ["软件库"]
const freelogLibraryNameSpace = "freelogLibrary"

class FreelogLibrary {
  /* 资源标识resourceName为key, 值以version降序排列(每次添加完成后都进行一次排序) */
  #libraryCache: Record<string, Array<LibraryInfo>> = {}

  /* 以`${resourceName}?${version}`为key */
  #metaJson: any = {} 
  metaJsonKeyToBaseUrl: any = {}

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
  #init() {
    (window as any)[freelogLibraryNameSpace] = {}
    this.#setLibraryAuthorNameSpace()
  }

  /* 加载js和css; (不支持es格式的库) */
  async getLibraryEntryUrls (resourceName: string, consumerResourceName: string) {
    let metaJsonKey, metaJson, baseUrl, jsEntryUrl, cssEntryUrl

    // 1. 获取主题的依赖树, 在树中找到此资源标识resourceName的nid
    const environment = this.dependencyTree.find((item: any) => item.articleName === consumerResourceName)
    const target = this.dependencyTree.find((item: any) => item.articleName ===  resourceName && item.parentNid === environment.nid)
    if (!target) {
      console.warn("请传递正确的资源标识, 并在console声明为依赖!")
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
    if (_cache) {
      baseUrl = _cache.baseUrl
      jsEntryUrl = `${baseUrl}/${jsEntry}`
      cssEntryUrl = `${baseUrl}/${cssEntry}`
    } else {
      jsEntryUrl = await getExhibitDepFileStream(this.themeInfo.exhibitId, { nid, returnUrl: true, subFilePath: jsEntry }) 
      baseUrl = jsEntryUrl.slice(0, jsEntryUrl.lastIndexOf('/'))
      this.metaJsonKeyToBaseUrl[metaJsonKey] = baseUrl
      cssEntryUrl = `${baseUrl}/${cssEntry}`
    }
    
    // 3. 缓存
    this.#addlibraryCache(resourceName, {
      version,
      baseUrl,
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


  /* 为库作者预设命名空间 */
  #setLibraryAuthorNameSpace() {
    const arr = this.dependencyTree.filter((ele: any) => {
      return resourceType.includes(ele.resourceType[0])
    })

    arr.forEach((ele: any) => {
      const userName = ele.articleName.split('/')[0]
      if (!(window as any).freelogLibrary[userName]) {
        (window as any).freelogLibrary[userName] = {}
      }
    })
  }

  loadLibraryJs(url: string, metaJson: any, env: any) {
    return new Promise(async (resolve) => {
      // 添加到子应用
      const tag = env.document.createElement("script");
      tag.setAttribute('src', url)
      env.document.body.appendChild(tag)
      tag.onload = async () => {
        let value = this.#parsePropertyPath(metaJson.nameSpace)
        if (value && (Object.keys(value).length || typeof value === 'function')) {
          resolve(value)
          // 置空
          this.#clearPropertyValue(metaJson.nameSpace)
        }
      }
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
  #parsePropertyPath(nameSpace: string) {
    return nameSpace.split('.').reduce((pre: any, cur: any) => {
      if (!pre) return
      return pre[cur]
    }, window)
  }

  #clearPropertyValue(nameSpace: string) {
    let result = `window`
    const arr = nameSpace.split('.')
    for (let i = 0; i < arr.length; i++) {
      const ele = arr[i]
      result += `['${ele}']`
    }
    result += `= undefined`
    eval(result)
  }

  /* 获取js入口文件 format => 'es' | 'umd' */
  #getJsEntry(metaJsonKey: string, format?: string) {
    if (Array.isArray(this.#metaJson[metaJsonKey].js)) {
      if (!format) {
        console.warn("检测到有多个js入口文件, 当前已默认加载umd格式, 也可以通过指定来加载格式(如es)")
      }
      let _format ='umd'
      if (format) {
        _format = format
      }
      const item = this.#metaJson[metaJsonKey].js.find((ele: any) => ele.entry.includes(`.${_format}.`))
      return item?.entry
    } else {
      return  this.#metaJson[metaJsonKey].js.entry
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