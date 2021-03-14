import frequest from '../../services/handler'
import node from '../../services/api/modules/node'
import { createScript, createCssLink, resolveUrl } from './utils'
import { getFileStreamInfoById } from './api'
import {baseUrl} from '../../services/base'
import {freelogApp} from './global'
import {init} from './api'
// @ts-ignore  TODO 需要控制不可改变
window.freelogApp = freelogApp
export function initNode() {
  /**
   * 1.resolveUrl
   * 2.requestNodeInfo
   * 3.requestTheme
   * TODO  error resolve
   * TODO title 问题
   */
  let isTest = false
  if (window.location.href.replace('http://', '').replace('https://', '').indexOf('t.') === 0) {
    isTest = true
  }
  return new Promise<void>(async (resolve) => {
    const nodeDomain = await getDomain(window.location.host)
    const nodeData = await requestNodeInfo(nodeDomain)
    const nodeInfo = nodeData.data
    console.log(nodeInfo)
    // @ts-ignore
    freelogApp.nodeInfo = nodeInfo
    init()
    // @ts-ignore
    const theme = await requestTheme(nodeInfo.nodeThemeId)
    console.log(theme)
    const container = document.getElementById('freelog-plugin-container')
    // @ts-ignore
    container.innerHTML = theme.data
    // @ts-ignore
    theme.subDeps.push({id:"60068f63973b31003a4fbf2a",name:"chtes/pubu",type:"resource",resourceType:"widget"})
    const promises: Promise<any>[] = []
    console.log(theme.subDeps)
    // @ts-ignore
    theme.subDeps.forEach(sub => {
      // 检测主题内部有没有这个插件，没有则不走这不
      // const tags = document.getElementsByName(sub.tagName)
      // if(!tags.length){
      //   return
      // }
      // {"id":"60068f63973b31003a4fbf2a","name":"chtes/pubu","type":"resource","resourceType":"image"}
      let url = resolveUrl(`${baseUrl}auths/presentables/${theme.entityNid}/fileStream`, { parentNid: nodeInfo.nodeThemeId, subResourceIdOrName: sub.id }) 
      if(isTest) resolveUrl(`${baseUrl}auths/testResources/${theme.entityNid}/fileStream`, { parentNid: nodeInfo.nodeThemeId, subEntityIdOrName: sub.id })
      
      switch (sub.resourceType) {
        case 'widget':
          /**
           *  {
                container: container,
                name: 'purehtml',//id
                widgetName: sub.name,
                id: sub.id,
                entry: '//localhost:7104'
              }
              step:包装以下三步，子插件加载时需要用
                 
                 1.const id = createId
                 2.const container = createContainer('freelog-plugin-container', id)
                 3.loadMicroApp
           */

          freelogApp.mountWidget(sub, 'freelog-plugin-container')
          // TODO 所有插件加载完成后 加载交给运行时子依赖的插件
          break;
          case 'js': {
          promises.push(createScript(url))
          break
        }
        case 'css': {
          promises.push(createCssLink(url))
          break
        }
        default: { }
      }
    });
    let count = promises.length
    if (count === 0) {
      resolve()
    } else {
      for (const p of promises) {
        p.finally(() => {
          count--
          if (count === 0) {
            resolve()
          }
        })
      }
    }
  })
}

function getDomain(url: string) {
  return url.split('.')[0]
}

async function requestNodeInfo(nodeDomain: string) {
  let info = await frequest(node.getInfoByNameOrDomain, '', { nodeDomain })
  return info.data
}
// TODO if error 
async function requestTheme(nodeThemeId: string) {
  let info = await getFileStreamInfoById(nodeThemeId)
  console.log(info)
  const [subDeps, entityNid] =  [info.headers['freelog-sub-dependencies'], info.headers['freelog-entity-nid']]
  console.log(info.headers)
  return { subDeps: subDeps ? decodeURIComponent(subDeps) : [], entityNid, data: info.data.toString() }
}
 