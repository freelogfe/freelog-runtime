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
import {
  addSandBox,
  activeWidgets,
  widgetsConfig,
  childrenWidgets,
  flatternWidgets,
} from "./widget";
import {
  historyBack,
  historyForward,
  historyGo,
  setHistory,
  getHistory,
} from "./history";
import { DEV_WIDGET } from "./dev";

const rawDocument = document;
const HISTORY = 'history'
const HASH = 'hash'
const rawHistory = window["history"];
const rawLocation = window["location"];
const rawLocalStorage = window["localStorage"];
// widgetName  {routerType: 'history' || 'hash'}
const locations = new Map();
var freelogPopstate = new PopStateEvent('freelog-popstate');
// for history back and forword 
let state = 0
let moveLock = false
// TODO 问题记录：插件使用后退前进 无法与浏览器同步，因为会影响到其余插件的路由，但可以给主题开放整体前进后退的权限
// 节点只有一个主题作为应用时这个需求是肯定需要的
window.addEventListener(
  "popstate",
  function (event) {
    let estate = event.state
    if (!estate) estate = 0
    if (estate < state) {
      moveLock = true
      // this is back,  make all of locations position++ 
      // @ts-ignore
      locations.forEach((value, key) => {
        historyBack(key)
      });
    } else if (estate > state) {
      moveLock = true
      // this is forword make all of locations position--
      // @ts-ignore
      locations.forEach((value, key) => {
        historyForward(key)
      });
    }
    setTimeout(() => {
      moveLock = false
    }, 0)
    state = estate
    initLocation();
    window.dispatchEvent(freelogPopstate)
  },
  true
);
window.addEventListener(
  "hashchange",
  function () {
    initLocation();
  },
  true
);
export function freelogAddEventListener() {
  if (arguments[0] === 'popstate') {
    window.addEventListener('freelog-popstate', arguments[1])
    return
  }
  // @ts-ignore
  window.addEventListener(...arguments)
}
export function setFetch() {
  const rawFetch = window.fetch;
  // @ts-ignore
  window.fetch = function (url: string, options: any) {
    options = options || {};
    if (url.indexOf("freelog.com") > -1) {
      return rawFetch(url, { ...options, credentials: "include" });
    } else {
      return rawFetch(url, {mode: 'cors',...options});
    }
  };
}
export function getFreelogAuth(name: string) {
  return widgetsConfig.get(name).isUI
}
export function initLocation() {
  if (rawLocation.href.includes("$freelog")) {
    var loc = rawLocation.href.split("freelog.com/")[1].split("$");
    if (window.freelogApp.devData.type === DEV_WIDGET) {
      const temp = rawLocation.search.split("$_")[1];
      // @ts-ignore
      loc = temp ? temp.split("$") : [];
    }
    loc.forEach((item) => {
      try {
        if (!item) return;
        item = item.replace("_", "?");
        if (item.indexOf("?") > -1) {
          let index = item.indexOf("?");
          let [id, pathname] = item.substring(0, index).split("=");
          let search = item.substring(index);
          // TODO 判断id是否存在 isExist(id) &&
          locations.set(id, { pathname, href: pathname + search, search });
          return;
        }
        var l = item.split("=");
        locations.set(l[0], { pathname: l[1], href: l[1], search: "" });
      } catch (e) {
        console.error("url is error" + e);
      }
    });
  }
}
export function setLocation() {
  // TODO 只有在线的应用才在url上显示, 只有pathname和query需要
  var hash = "";
  locations.forEach((value, key) => {
    if (!activeWidgets.get(key)) {
      locations.delete(key);
      return;
    }
    hash += "$" + key + "=" + value.href || "";
  });
  if (window.freelogApp.devData.type === DEV_WIDGET) {
    let devUrl = rawLocation.search.split("$_")[0];
    if (!devUrl.endsWith("/")) {
      devUrl = devUrl + "/";
    }
    const url =
      rawLocation.origin +
      devUrl +
      "$_" +
      hash.replace("?", "_") +
      rawLocation.hash;
    if (url === rawLocation.href) return
    window.history.pushState(state++, "", url);
  } else {
    const url =
      rawLocation.origin +
      "/" +
      hash.replace("?", "_") +
      rawLocation.hash +
      rawLocation.search;
    if (url === rawLocation.href) return
    window.history.pushState(state++, "", url);
  }
  // rawLocation.hash = hash; state++
}
// TODO pathname  search 需要不可变
export const locationCenter: any = {
  set: function (name: string, attr: any) {
    var loc = locations.get(name) || {};
    if (attr.pathname && attr.pathname.indexOf(rawLocation.host) > -1) {
      // for vue3
      attr.pathname = attr.pathname
        .replace(rawLocation.protocol, "")
        .replace(rawLocation.host, "")
        .replace("//", "");
    }
    locations.set(name, {
      ...loc,
      ...attr,
    });
    setLocation();
  },
  get: function (name: string): string {
    return locations.get(name);
  },
};
export function freelogLocalStorage(id: string) {
  return {
    // @ts-ignore
    clear: function (name: string) { },
    getItem: function (name: string) {
      return rawLocalStorage.getItem(id + name);
    },
    // @ts-ignore
    key: function (name: string) { },
    removeItem: function (name: string) {
      rawLocalStorage.removeItem(id + name);
    },
    setItem: function (name: string, value: string) {
      rawLocalStorage.setItem(id + name, value);
    },
    length: 0,
  };
}
export const saveSandBox = function (name: string, sandBox: any) {
  addSandBox(name, sandBox);
};
export const createHistoryProxy = function (name: string) {
  const widgetConfig = widgetsConfig.get(name);

  function patch() {
    let hash = "";
    let routerType = HISTORY
    // TODO 解析query参数  search   vue3会把origin也传过来
    let href = arguments[2].replace(rawLocation.origin,'');
    if (arguments[2] && arguments[2].indexOf("#") > -1) {
      href = href.substring(1)
      routerType = HASH
      hash = arguments[2].replace(rawLocation.origin,'');
      // console.warn("hash route is not suggested!");
      // return;
    }
    let [pathname, search] = href.split("?");
    locationCenter.set(name, { pathname, href, search, hash, routerType });
  }
  function pushPatch() {
    if (moveLock) return
    // @ts-ignore
    patch(...arguments);
    setHistory(name, arguments);
  }
  function replacePatch() {
    // @ts-ignore
    patch(...arguments);
    setHistory(name, arguments, true);
  }
  function go(count: number) {
    if(widgetConfig.config.historyFB){
      return rawHistory.go(count)
    }
    const history = historyGo(name, count);
    if (history) {
      // @ts-ignore
      patch(...history);
      window.dispatchEvent(freelogPopstate)
    }
    // else if(count == -1){
    //   window.history.go(-1)
    // }
  }
  function back() {
    if(widgetConfig.config.historyFB){
      return rawHistory.back()
    }
    const history = historyBack(name);
    if (history) {
      // @ts-ignore
      patch(...history);
      window.dispatchEvent(freelogPopstate)
    }
  }
  function forward() {
    if(widgetConfig.config.historyFB){
      return rawHistory.forward()
    }
    const history = historyForward(name);
    if (history) {
      // @ts-ignore
      patch(...history);
      window.dispatchEvent(freelogPopstate)
    }
  }
  const state = getHistory(name).histories[getHistory(name).position]
    ? [0]
    : {};
  const length = getHistory(name).length;
  const historyProxy = {
    // @ts-ignore
    length: length,
    ...window.history,
    pushState: pushPatch,
    replaceState: replacePatch,
    state,
    go: go, // window.history.go.bind(window.history),
    back: back, // window.history.back.bind(window.history),
    forward: forward, //window.history.forward.bind(window.history)
  };
  return historyProxy;
};
export const createLocationProxy = function (name: string) {
  const locationProxy = {};

  return new Proxy(locationProxy, {
    /* 
        a标签的href需要拦截，// TODO 如果以http开头则不拦截
         TODO reload 是重新加载插件
     */
    // @ts-ignore
    set: (target: any, p: PropertyKey, value: any): boolean => {
      if (p === 'hash') {
        const _history = createHistoryProxy(name)
        // @ts-ignore
        _history.pushState('', '', value)
      }
      return true;
    },
    // @ts-ignore
    get: function get(target: any, property: string) {
      if (["href", "pathname", "hash", "search"].indexOf(property) > -1) {
        if (locationCenter.get(name)) {
          // @ts-ignore
          return locationCenter.get(name)[property] || "";
        }
        // @ts-ignore
        return "";
      } else {
        if (["replace"].indexOf(property) > -1) {
          return function () { };
        }
        if (["reload"].indexOf(property) > -1) {
          // TODO 增加是否保留数据
          return async function (reject:any) { 
            flatternWidgets.get(name).unmount(()=>{
              flatternWidgets.get(name).mount()
            },()=>{
              // 失败了再试一次
              flatternWidgets.get(name).unmount(()=>{
                flatternWidgets.get(name).mount()
              },()=>{
                reject && reject()
              })
            }) 
          };
        }
        if (property === "toString") {
          return () => {
            // @ts-ignore
            return (
              locationCenter.get(name) &&
              (locationCenter.get(name)["pathname"] || "")
            );
          };
        }
        // @ts-ignore
        if (typeof rawLocation[property] === "function") {
          // @ts-ignore
          return rawLocation[property].bind();
        }
        // @ts-ignore
        return rawLocation[property];
      }
    },
  });
};
rawDocument.write = () => {
  console.warn("please be careful");
};
rawDocument.writeln = () => {
  console.warn("please be careful");
};
// TODO 实际是无用的代码，不需要的
const getElementsByClassName = rawDocument.getElementsByClassName;
const getElementsByTagName = rawDocument.getElementsByTagName;
const getElementsByTagNameNS = rawDocument.getElementsByTagNameNS;
const querySelector = rawDocument.querySelector;
const querySelectorAll = rawDocument.querySelectorAll;
const getElementById = rawDocument.getElementById;
const appendChild = rawDocument.body.appendChild;
const removeChild = rawDocument.body.removeChild;
const addEventListener = rawDocument.addEventListener;
const removeEventListener = rawDocument.addEventListener;
// document的代理
export const createDocumentProxy = function (
  name: string,
  // @ts-ignore
  sandbox: any,
  proxy: any
) {
  const documentProxy = {};
  // TODO  firstChild还没创建,这里需要改，加载后才能
  var doc = widgetsConfig.get(name).container.firstChild //  || widgetsConfig.get(name).container;
  // var doc: any = rawDocument.getElementById(name);
  // for shadow dom
  let isShadow = false;
  // @ts-ignore
  if (doc.shadowRoot) {
    isShadow = true;
    doc = doc.shadowRoot;
  }
  if (!doc) return rawDocument;
  let rootDoc: any = doc;
  // // @ts-ignore
  // var a = doc.children || [];
  // for (var i = 0; i < a.length; i++) {
  //   if (a.item(i).tagName === "DIV") rootDoc = a.item(i);
  // }
  // HTMLElement.prototype.parentNode = ()=>{

  // }
  

  if (!isShadow) {
    // @ts-ignore
    rawDocument.getElementsByClassName =
      rootDoc.getElementsByClassName.bind(doc);
    rawDocument.getElementsByTagName = (tag: string) => {
      if (tag === "head") {
        return [rawDocument.head];
      }
      if (tag === "body") {
        return [rootDoc];
      }
      return rootDoc.getElementsByTagName(tag);
    };
    rawDocument.getElementsByTagNameNS =
      rootDoc.getElementsByTagNameNS.bind(rootDoc);
    rawDocument.querySelectorAll = rootDoc.querySelectorAll.bind(rootDoc);
    rawDocument.addEventListener = rootDoc.addEventListener.bind(rootDoc);
    rawDocument.removeEventListener = rootDoc.removeEventListener.bind(rootDoc);

    rawDocument.body.appendChild = rootDoc.appendChild.bind(rootDoc);
    rawDocument.body.removeChild = rootDoc.removeChild.bind(rootDoc);
    rawDocument.querySelector = function () {
      if (["head", "html"].indexOf(arguments[0]) !== -1) {
        if (arguments[0] === "head") return rawDocument.head;
        // @ts-ignore
        if (arguments[0] === "html") {
          // @ts-ignore
          return querySelector.bind(document)(...arguments);
        }
      } else {
        if (["body"].indexOf(arguments[0]) !== -1) {
          return rootDoc;
        }
        // @ts-ignore
        return rootDoc.querySelector(...arguments);
      }
    };
    rawDocument.getElementById = function (id: string) {
      // @ts-ignore
      let children = rootDoc.getElementsByTagName("*");
      if (children) {
        for (let i = 0; i < children.length; i++) {
          if (children.item(i).getAttribute("id") === id) {
            return children.item(i);
          }
        }
      }
      return null;
    };
    // TODO 在主应用里可以每次使用时都bind一下（rawDocument)
    setTimeout(() => {
      rawDocument.getElementsByClassName =
        getElementsByClassName.bind(rawDocument);
      rawDocument.querySelectorAll = querySelectorAll.bind(rawDocument);
      rawDocument.getElementsByTagName = getElementsByTagName.bind(rawDocument);
      rawDocument.getElementsByTagNameNS =
        getElementsByTagNameNS.bind(rawDocument);
      rawDocument.addEventListener = addEventListener.bind(rawDocument);
      rawDocument.removeEventListener = removeEventListener.bind(rawDocument);

      // TODO 这里不应该使用runtime-root， 不需要考虑，直接禁掉
      rawDocument.body.appendChild = appendChild.bind(
        rawDocument.body
      );
      rawDocument.body.removeChild = removeChild.bind(
        rawDocument.body
      );
      rawDocument.querySelector = querySelector.bind(rawDocument);
      rawDocument.querySelector = querySelector.bind(rawDocument);
      rawDocument.getElementById = getElementById.bind(rawDocument);
    }, 0);
    return rawDocument;
  }
  return new Proxy(documentProxy, {
    /* 分类 
         例如 addEventListener
       2.zonejs需要用的全局取值的方法（出问题再解决问题）
         例如 'querySelector', 'getElementsByTagName'
       3.根节点下没有的方法
       4.属性（包括原型）方法：替换this为根节点
    */
   // @ts-ignore
    get: function get(docTarget: any, property: string) {
      let appDiv: any = null;
      // @ts-ignore
      var a = doc.children || [];
      for (var i = 0; i < a.length; i++) {
        if (a.item(i).tagName === "DIV") appDiv = a.item(i);
      }
      if (property === "location") {
        // TODO varify
        return proxy.location;
      }

      if (property === "createElement") {
        return rawDocument.createElement.bind(rawDocument);
      }
      if (property === "addEventListener") {
        return rootDoc.addEventListener.bind(rootDoc);
      }
      if (property === "removeEventListener") {
        return rootDoc.removeEventListener.bind(rootDoc);
      }
      // @ts-ignore
      // rawDocument.addEventListener = rootDoc.addEventListener.bind(rootDoc);
      // @ts-ignore
      // rootDoc.body = appDiv;
      // @ts-ignore
      // rootDoc.body.appendChild = rootDoc.appendChild.bind(rootDoc);
      if (property === "head") {
        // return {
        //   // @ts-ignore
        //   appendChild: function () {
        //     // @ts-ignore
        //     rawDocument[property].appendChild(...arguments);
        //   },
        //   ...rawDocument[property]
        // };
        return rawDocument[property];
      }
      // return rootDoc
      // if (property  === 'addEventListener') debugger
      // @ts-ignore
      if (
        (rootDoc[property] || appDiv[property]) &&
        ["querySelector", "getElementsByTagName"].indexOf(property) === -1
      ) {
        if (property === "nodeType") return rawDocument.nodeType;
        // @ts-ignore
        if (typeof rootDoc[property] === "function")
          return rootDoc[property].bind(rootDoc);
        if (typeof appDiv[property] === "function")
          return appDiv[property].bind(appDiv);
        // @ts-ignore
        return rootDoc[property] || appDiv[property];
      } else {
        if (
          ["querySelector", "getElementsByTagName"].indexOf(property) !== -1
        ) {
          return function () {
            if (["head", "html"].indexOf(arguments[0]) !== -1) {
              // TODOjquery才需要此处放权
              // @ts-ignore
              return rawDocument[property](...arguments);
            } else {
              if (["body"].indexOf(arguments[0]) !== -1) {
                return appDiv;
              }
              // @ts-ignore
              return rootDoc[property]
                ? // @ts-ignore
                rootDoc[property](...arguments)
                : // @ts-ignore
                appDiv[property](...arguments);
            }
          };
        }
        if (property === "getElementById") {
          if (rootDoc.getElementById) {
            return rootDoc.getElementById.bind(rootDoc);
          }
          return function (id: string) {
            // @ts-ignore
            let children = rootDoc.getElementsByTagName("*");
            if (children) {
              for (let i = 0; i < children.length; i++) {
                if (children.item(i).getAttribute("id") === id) {
                  return children.item(i);
                }
              }
            }
            return null;
          };
        }

        // @ts-ignore
        if (typeof rawDocument[property] === "function") {
          // @ts-ignore
          return rawDocument[property].bind(rawDocument);
        }
        // @ts-ignore
        return rawDocument[property];
      }
    },
  });
};
export const createWidgetProxy = function (name: string) {
  const proxyWidget = {};
  return new Proxy(proxyWidget, {
    // @ts-ignore
    get: function get(childWidgets: any, property: string) {
      if (property === "getAll") {
        return function () {
          const children = childrenWidgets.get(name);
          let childrenArray: any = [];
          children &&
            children.forEach((childId: string) => {
              childrenArray.push(flatternWidgets.get(childId));
            });
          return childrenArray;
        };
      }
      if (property === "unmount") {
      }
    },
  });
};
export function getPublicPath(name: string) {
  const config = widgetsConfig.get(name);
  if (/\/$/.test(config.entry)) {
    return config.entry;
  }
  return config.entry + "/";
}
// @ts-ignore
export const createFreelogAppProxy = function (name: string, sandbox: any) {
  const freelogAppProxy = {};
  return new Proxy(freelogAppProxy, {
    // @ts-ignore
    get: function get(app: any, p: string) {
      const pro = window.freelogApp[p];
      if (typeof pro === "function") {
        return function () {
          // @ts-ignore
          return pro.bind(sandbox)(...arguments);
        };
      }
      return pro;
    },
  });
};

export function pathATag() {

  document.addEventListener("click", (e:any) => {
    if (e.target.nodeName === "A") {
      return false;
    }
    return true
  });
}
