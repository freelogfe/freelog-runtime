import frequest from '../../services/handler'
import node from '../../services/api/modules/node'
import presentable from '../../services/api/modules/presentable'
import { createScript, createCssLink, createContainer, createId, resolveUrl } from './utils'
import { loadMicroApp } from '../runtime';
import { addWidget } from './widget'
import { getFileStreamInfoById, getSubFileStreamInfoById } from './api'
export function initNode() {
  /**
   * 1.resolveUrl
   * 2.requestNodeInfo
   * 3.requestTheme
   * TODO  error resolve
   * TODO title 问题
   */
  let isTest = false
  if (location.href.replace('http://', '').replace('https://', '').indexOf('t.') === 0) {
    isTest = true
  }
  return new Promise<void>(async (resolve) => {
    const nodeDomain = await getDomain(location.href)
    const nodeInfo = await requestNodeInfo(nodeDomain)
    // @ts-ignore
    window.freelogApp.nodeInfo = nodeInfo
    // @ts-ignore
    const theme = await requestTheme(nodeInfo.nodeId, nodeInfo.nodeThemeId)
    const container = document.getElementById('freelog-plugin-container')
    // @ts-ignore
    container.innerHTML = theme.data
    container
    const promises: Promise<any>[] = []
    // @ts-ignore
    theme.subDeps.forEach(sub => {
      // 检测主题内部有没有这个插件，没有则不走这不
      // {"id":"60068f63973b31003a4fbf2a","name":"chtes/pubu","type":"resource","resourceType":"image"}
      let url = resolveUrl(`auths/presentables/${theme.entityNid}/fileStream`, { parentNid: nodeInfo.nodeThemeId, subResourceIdOrName: sub.id }) 
      if(isTest) resolveUrl(`auths/testResources/${theme.entityNid}/fileStream`, { parentNid: nodeInfo.nodeThemeId, subEntityIdOrName: sub.id })
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
          const id = createId()
          const widgetContainer = createContainer('freelog-plugin-container', id)
          const config = {
            container: widgetContainer,
            name: id,//id
            widgetName: sub.name,
            id: sub.id,
            entry: '//localhost:7104'
          }
          // TODO 所有插件加载用promise all
          // @ts-ignore
          const app = loadMicroApp(config, { sandbox: { strictStyleIsolation: true, experimentalStyleIsolation: true } },);
          addWidget(id, app);
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
  const [subDeps, entityNid] = findValueByKeyIgnoreUpperLower(info.headers, ['freelog-sub-dependencies', 'freelog-entity-nid'])
  return { subDeps: subDeps ? decodeURIComponent(subDeps) : [], entityNid, data: info.data.toString() }
}
function findValueByKeyIgnoreUpperLower(object: any, keys: string[]): string[] {
  const map = new Map()
  for (let [key, value] of Object.entries(object)) {
    map.set(key.toLowerCase(), value)
  }
  const result: string[] = []
  for (let key of keys) {
    result.push(map.get(key))
  }
  return result
}