const resourceType = ["前端库"]

class FreelogLibrary {
  /* 以`${resourceName}?${version}`为key */
  #metaJson: any = {} 

  /* 以展品id为key */
  dependencyTrees: any = {}

  /* 加载js和css; (不支持es格式的库) */
  async getLibraryEntryUrls (resourceName: string, nidOfConsumer: any, env: any) {
    let freelogApp
    if (typeof nidOfConsumer === "string") {
      freelogApp = env.microApp.getData().freelogApp
    } else {
      freelogApp = nidOfConsumer.microApp.getData().freelogApp
    }

    const depRes = await freelogApp.getSelfDep()
    const dependencyTree = depRes.data.data;
    const topExhibitId = freelogApp.getTopExhibitId()
    
    this.dependencyTrees[topExhibitId] = dependencyTree
    
    let metaJsonKey, metaJson, baseUrl, jsEntryUrl, cssEntryUrl, target
    
    // 1. 获取主题的依赖树, 在树中找到此资源标识resourceName的nid
    if (nidOfConsumer && typeof nidOfConsumer === "string") {
      target = dependencyTree.find((item: any) => item.articleName === resourceName && item.resourceType[0] === resourceType[0] && item.parentNid === nidOfConsumer)
    } else {
      // 当前为应用层, 即主题/插件
      const nid = freelogApp.getSelfNid()
      target = dependencyTree.find((item: any) => item.articleName === resourceName && item.resourceType[0] === resourceType[0] && item.parentNid ===  nid)
      console.warn("当前为应用层, nid:", nid)
    }
    
    if (!target) {
      console.warn("请传递正确的资源标识, 并在freelog平台中声明为依赖!")
      return undefined
    }
    const { nid, version } = target
    metaJsonKey = `${resourceName}?${version}`

    // 2. 获取meta.json并存储
    const res = await freelogApp.getExhibitDepFileStream(topExhibitId, { nid, returnUrl: false, subFilePath: "meta.json" })  
    if (res.status !== 200) {
      console.warn("获取meta.json失败!", res)
      return undefined
    } else {
      metaJson = res.data
      this.#metaJson[metaJsonKey] = res.data
    }

    // 3. 根据meta.json中的内容，设置引入库的映射, 并开始加载js和css的入口文件
    const jsEntry = this.#getJsEntry(metaJsonKey)
    const cssEntry = this.#getCssEntry(metaJsonKey)
    jsEntryUrl = await freelogApp.getExhibitDepFileStream(topExhibitId, { nid, returnUrl: true, subFilePath: jsEntry }) 
    baseUrl = jsEntryUrl.slice(0, jsEntryUrl.lastIndexOf('/'))
    cssEntryUrl = `${baseUrl}/${cssEntry}`


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
}

export { FreelogLibrary }