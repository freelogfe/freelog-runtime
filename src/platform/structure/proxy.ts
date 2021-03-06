/**
 * 需求与问题：
 *    1.首先进来时需要根据路由启动存在的不同插件（主要点是启动）:
 *      1.1 location解析
 *      1.2 路由拦截，存为历史
 *      1.3 整体回退前进
 *      1.4 插件回退前进
 *      1.5 抽象路由的插件 
 *      1.6 懒加载或点击按钮加载插件的问题：
 *          1.6.1 懒加载：提供属性空闲后加载，或指定延迟时间（不精准）
 *          1.6.1 点击再加载：提供属性标明不加载，点击按钮，提供api（mountWidget(pluginId)） 
 *    2.插件控制插件进入不同路由：
 *      2.1 给插件对象提供api，（例如push(home/about?age=18)）劫持重定向的路由进行unmount后再mount
 *    3.
 * 总结：window.FreelogApp.mountWidget
 */
import {addSandBox, activeWidgets} from './widget'
const rawDocument = document
const rawHistory = window['history']
const rawLocation = window['location']
const locations = new Map()
export function initLocation(){
  if (rawLocation.hash && rawLocation.hash.split('#')) {
    var loc = rawLocation.hash.split('#')
    loc.forEach((item) => {
      try {
        if(!item) return
        if (item.indexOf('?') > -1) {
          let index = item.indexOf('?')
          let [id, pathname] = item.substring(0, index - 1).split('=')
          let search = item.substring(index)
          // TODO 判断id是否存在 isExist(id) &&
          locations.set(id, { pathname, href: pathname + search, search })
          return 
        }
        var l = item.split('=')
        locations.set(l[0], { pathname: l[1], href: l[1], search: '' })
      } catch (e) {
        console.error('url is error' + e)
      }
    })
  }
}
initLocation()
export function setLocation(){
 // TODO 只有在线的应用才在url上显示, 只有pathname和query需要
 var hash = ''
 locations.forEach((value, key) => {
   if(!activeWidgets.get(key)) {
    locations.delete(key)
    return
   }
   hash += '#' + key + '=' + value.pathname || ''
 })
 console.log(hash)
 rawLocation.hash = hash
}
// TODO pathname  search 需要不可变
export const locationCenter = {
  set: function (name: string, attr: any) {
    var loc = locations.get(name) || {}
    if (attr.pathname && attr.pathname.indexOf(rawLocation.host) > -1) {
      attr.pathname = attr.pathname.replace(rawLocation.protocol, '').replace(rawLocation.host, '').replace('//', '')
    }
    locations.set(name, {
      ...loc,
      ...attr
    })
    setLocation()    
  },

  get: function (name: string): string {
    return locations.get(name)
  }
}
export const freelogLocalStorage = {
  clear: function (name: string) {

  },
  getItem: function (name: string) {

  },
  key: function (name: string) {

  },
  removeItem: function (name: string) {

  },
  setItem: function (name: string) {

  },
  length: 0
}
export const saveSandBox = function (name: string, sandBox: any) {
  addSandBox(name, sandBox)
}
export const createHistoryProxy = function (name: string, sandbox: any) {
  const historyProxy = {}
  return new Proxy(historyProxy, {
    /* 
     */
    get: function get(HisTarget: any, property: string) {
      if (property === 'pushState' || property === 'replaceState') {
        return function () {
          if (arguments[2] && arguments[2].indexOf('#') > -1) {
            console.error('hash route is not supported!')
            return 
          }
          // TODO 解析query参数  search
          let href = arguments[2]
          let [pathname, serach] = href.split('?')
          locationCenter.set(name, { pathname, href, serach })
        };
      } else {
        // @ts-ignore
        return rawHistory[property]
      }
    }
  })
}
export const createLocationProxy = function (name: string, sandbox: any) {
  const locationProxy = {}

  return new Proxy(locationProxy, {
    /* 
        a标签的href需要拦截，// TODO 如果以http开头则不拦截
         TODO reload 是重新加载插件
     */
    get: function get(docTarget: any, property: string) {
      if (['href', 'pathname', 'hash'].indexOf(property) > -1) {
        if(locationCenter.get(name)){
          // @ts-ignore
          return locationCenter.get(name)[property] || ''
        }
        // @ts-ignore
        return ''
      } else {
        if (['replace'].indexOf(property) > -1) {
          return function () {

          }
        }
        if (property === 'toString') {
          return () => {
            // @ts-ignore
            return locationCenter.get(name) && (locationCenter.get(name)['pathname'] || '')
          }
        }
        // @ts-ignore
        if (typeof rawLocation[property] === 'function') {
          // @ts-ignore
          return rawLocation[property].bind(

          )
        }
        // @ts-ignore
        return rawLocation[property]
      }
    }
  })
}
export const createDocumentProxy = function (name: string, sandbox: any, proxy: any) {
  // TODO 为了保证id唯一性，必须每访问一次都取不同的值作为id
  const documentProxy = {}
  var doc = rawDocument.getElementById(name)
  // for shadow dom
  // @ts-ignore
  if (doc.firstChild.shadowRoot) {
    // @ts-ignore
    var a = doc.firstChild.shadowRoot.children || []
    for (var i = 0; i < a.length; i++) {
      if (a.item(i).tagName === 'DIV') doc = a.item(i);
    }
  }
  if (!doc) return rawDocument
  return new Proxy(documentProxy, {
    /* 分类 
       1.通过caller来确定this的非属性方法
         例如 addEventListener
       2.zonejs需要用的全局取值的方法（出问题再解决问题）
         例如 'querySelector', 'getElementsByTagName'
       3.根节点下没有的方法
       4.属性（包括原型）方法：替换this为根节点
    */
    get: function get(docTarget: any, property: string) {
       if (property === 'location') {
        // TODO varify
        return proxy.location
      }
      if (property === 'createElement') {
        return rawDocument.createElement.bind(rawDocument)
      }
      // @ts-ignore
      rawDocument.addEventListener = doc.addEventListener.bind(doc)
      // @ts-ignore
      doc.body = doc;
      // @ts-ignore
      doc.body.appendChild = doc.appendChild.bind(doc)
      // if (property === 'addEventListener') debugger
      // @ts-ignore
      if (doc[property] && ['querySelector', 'getElementsByTagName'].indexOf(property) === -1) {
        if (property === 'nodeType') return rawDocument.nodeType
        // @ts-ignore
        if (typeof doc[property] === 'function') return doc[property].bind(doc)
        // @ts-ignore
        return doc[property]
      } else {
        if (['querySelector', 'getElementsByTagName'].indexOf(property) !== -1) {
          return function () {
            if (['head', 'html'].indexOf(arguments[0]) !== -1) {
              // @ts-ignore
              return rawDocument[property](...arguments)
            } else {
              // @ts-ignore
              return doc[property](...arguments)
            }
          }
        }
        if (property === 'getElementById') return function (id: string) {
          // @ts-ignore
          let children = doc.getElementsByTagName('*').children
          if (children) {
            for (let i = 0; i < children.length; i++) {
              if (children[i].getAttribute('id') === id) {
                return children[i]
              }
            }
          }
          return null
        }
        // @ts-ignore
        if (typeof rawDocument[property] === 'function') return rawDocument[property].bind(rawDocument)
        // @ts-ignore
        return rawDocument[property]
      }
    }
  })
}
export const createWidgetProxy = function (name: string, sandbox: any) {
  const proxyWidget = {}
  return new Proxy(proxyWidget, {
    /* 
     */
    get: function get(childWidget: any, property: string) {
      if (property === 'mount') {
        
      }
      if(property === 'unmount') {
        
      } 
    }
  })
}