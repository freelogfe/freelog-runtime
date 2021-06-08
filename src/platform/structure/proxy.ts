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
import { baseUrl } from "../../services/base";
import { DEV_WIDGET } from "./dev";

const rawDocument = document;

// const rawHistory = window["history"];
const rawLocation = window["location"];
const rawLocalStorage = window["localStorage"];
const locations = new Map();
window.addEventListener(
  "popstate",
  function (event) {
    initLocation();
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
export function setFetch() {
  const rawFetch = window.fetch;
  // @ts-ignore
  window.fetch = function (url: string, options: any) {
    options = options || {};
    if (url.indexOf("freelog.com") > -1) {
      return rawFetch(url, { ...options, credentials: "include" });
    } else {
      return rawFetch(url, options);
    }
  };
}
export function initLocation() {
  if (rawLocation.href.includes("$freelog")) {
    var loc = rawLocation.href.split("freelog.com/")[1].split('$');
    if (window.freelogApp.devData.type === DEV_WIDGET) {
      const temp = rawLocation.search.split('$_')[1]
      // @ts-ignore
      loc = temp ? temp.split('$') : []
    }
    loc.forEach((item) => {
      try {
        if (!item) return;
        item = item.replace('_', '?')
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
    let devUrl = rawLocation.search.split("$_")[0]
    if(!devUrl.endsWith('/')){
      devUrl = devUrl + '/' 
    }
    const url = rawLocation.origin + devUrl + "$_" + hash.replace('?', '_') + rawLocation.hash 
    window.history.pushState('', '', url)
  } else {
    const url = rawLocation.origin + '/' + hash.replace('?', '_') + rawLocation.hash + rawLocation.search
    window.history.pushState('', '', url)
  }
  // rawLocation.hash = hash;
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
    clear: function (name: string) { },
    getItem: function (name: string) {
      return rawLocalStorage.getItem(id + name);
    },
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
export const createHistoryProxy = function (name: string, sandbox: any) {
  function patch() {
    let hash = "";
    if (arguments[2] && arguments[2].indexOf("#") > -1) {
      hash = arguments[2];
      // console.warn("hash route is not suggested!");
      // return;
    }
    // TODO 解析query参数  search
    let href = arguments[2];
    let [pathname, search] = href.split("?");
    locationCenter.set(name, { pathname, href, search, hash });
  }
  function pushPatch() {
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
    const history = historyGo(name, count);
    if (history) {
      // @ts-ignore
      patch(...history);
    }
    // else if(count == -1){
    //   window.history.go(-1)
    // }
  }
  function back() {
    const history = historyBack(name);
    if (history) {
      // @ts-ignore
      patch(...history);
    }
  }
  function forward() {
    const history = historyForward(name);
    if (history) {
      // @ts-ignore
      patch(...history);
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
  /*return new Proxy(historyProxy, {
   
    
    get: function get(HisTarget: any, property: string) {
      if (property === "pushState" || property === "replaceState") {
        return function () {
          // if (arguments[2] && arguments[2].indexOf("#") > -1) {
          //   console.warn("hash route is not supported!");
          //   // return;
          // }
          // TODO 解析query参数  search
          let href = arguments[2];
          let [pathname, search] = href.split("?");
          locationCenter.set(name, { pathname, href, search, hash: href });
        };
      } else {
        // @ts-ignore
        return rawHistory[property];
      }
    },
  });
   */
};
export const createLocationProxy = function (name: string, sandbox: any) {
  const locationProxy = {};

  return new Proxy(locationProxy, {
    /* 
        a标签的href需要拦截，// TODO 如果以http开头则不拦截
         TODO reload 是重新加载插件
     */
    set: (target: any, p: PropertyKey, value: any): boolean => {
      return true;
    },
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
          return function () { };
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
// 需要改的几个属性 body  fonts ParentNode cookie domain designMode title
const getElementsByClassName = rawDocument.getElementsByClassName;
const getElementsByTagName = rawDocument.getElementsByTagName;
const getElementsByTagNameNS = rawDocument.getElementsByTagNameNS;
const querySelector = rawDocument.querySelector;
const querySelectorAll = rawDocument.querySelectorAll;
const getElementById = rawDocument.getElementById;
const appendChild = rawDocument.body.appendChild;
const removeChild = rawDocument.body.removeChild;
const addEventListener = rawDocument.addEventListener;
export const createDocumentProxy = function (
  name: string,
  sandbox: any,
  proxy: any
) {
  const documentProxy = {};
  var doc = widgetsConfig.get(name).container.firstChild;
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
    // TODO  判断document与doc的原型是否都有该方法，有则bind
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
    setTimeout(() => {
      rawDocument.getElementsByClassName =
        getElementsByClassName.bind(rawDocument);
      rawDocument.querySelectorAll = querySelectorAll.bind(rawDocument);
      rawDocument.getElementsByTagName = getElementsByTagName.bind(rawDocument);
      rawDocument.getElementsByTagNameNS =
        getElementsByTagNameNS.bind(rawDocument);
      rawDocument.addEventListener = addEventListener.bind(rawDocument);
      rawDocument.body.appendChild = appendChild.bind(
        document.getElementById("runtime-root")
      );
      rawDocument.body.removeChild = removeChild.bind(
        document.getElementById("runtime-root")
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
      // @ts-ignore
      rawDocument.addEventListener = rootDoc.addEventListener.bind(rootDoc);
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
export const createWidgetProxy = function (name: string, sandbox: any) {
  const proxyWidget = {};
  return new Proxy(proxyWidget, {
    /*
     */
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
  if (config.isDev) {
    if (/\/$/.test(config.entry)) {
      return config.entry;
    }
    return config.entry + "/";
  }
  // const route = name.split("-")[1];
  return `${baseUrl}widgets/${config.widgetName}/`;
}
export const createFreelogAppProxy = function (name: string, sandbox: any) {
  const freelogAppProxy = {};
  return new Proxy(freelogAppProxy, {
    /*
     */
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
  document.addEventListener('click', (e) => {
    // @ts-ignore
    if (e.target.nodeName === 'A') {
      return false
    }
  })
}