import frequest from '../../services/handler'
import node from '../../services/api/modules/node'
import presentable from '../../services/api/modules/presentable'

export function initNode() {
    /**
     * 1.resolveUrl
     * 2.requestNodeInfo
     * 3.requestTheme
     * TODO  error resolve
     * TODO title 问题
     */
    return new Promise(async (resolve, reject) => {
       const nodeDomain = await resolveUrl(location.href)
       const nodeInfo = await requestNodeInfo(nodeDomain)
       // @ts-ignore
       window.freelogApp.nodeInfo = nodeInfo
       // @ts-ignore
       const theme = await requestTheme(nodeInfo.nodeId, nodeInfo.nodeThemeId)
    })
}

function resolveUrl(url: string) {
    return url.split('.')[0]
}

async function  requestNodeInfo(nodeDomain: string) {
    let info = await frequest(node.getInfoByNameOrDomain, '', { nodeDomain })
    return info.data
}
async function requestTheme(nodeThemeId: string){
    let info = await frequest(presentable.getByPresentableId, [nodeThemeId, 'fileStream'], '')
    const [subDep, entityNid] = findValueByKeyIgnoreUpperLower(info.headers,['freelog-sub-dependencies', 'freelog-entity-nid']) 
    return {subDep, entityNid, data: info.data.toString()}
}
function findValueByKeyIgnoreUpperLower(object: any, keys: string []): string [] {
    const map = new Map()
    for (let [key, value] of Object.entries(object)) {
      map.set(key.toLowerCase(), value)
    }
    const result: string [] = []
    for (let key of keys) {
      result.push(map.get(key))
    }
    return result
  }