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
import { rawFetch, nativeOpen, rawHistory, rawDocument, rawLocation, rawLocalStorage } from "./rawObjects";
const HISTORY = "history";
const HASH = "hash"; 
// widgetName  {routerType: 'history' || 'hash'}
const locations = new Map();
var freelogPopstate = new PopStateEvent("freelog-popstate");
// for history back and forword
let state = 0;
let moveLock = false;

window.addEventListener(
  "popstate",
  function (event) {
    let estate = event.state;
    if (!estate) estate = 0;
    if (estate < state) {
      moveLock = true;
      // this is back,  make all of locations position++
      // @ts-ignore
      locations.forEach((value, key) => {
        historyBack(key);
      });
    } else if (estate > state) {
      moveLock = true;
      // this is forword make all of locations position--
      // @ts-ignore
      locations.forEach((value, key) => {
        historyForward(key);
      });
    }
    setTimeout(() => {
      moveLock = false;
    }, 0);
    state = estate;
    initLocation();
    window.dispatchEvent(freelogPopstate);
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
  if (arguments[0] === "popstate") {
    window.addEventListener("freelog-popstate", arguments[1]);
    return;
  }
  // @ts-ignore
  window.addEventListener(...arguments);
}
// TODO 如果授权UI插件想要请求之外的接口，可以通过freelogAuths放进去
const whiteList = [
  "https://image.freelog.com",
  "https://image.testfreelog.com",
];
const forbiddenList = [
  "http://qi.testfreelog.com",
  "http://qi.freelog.com",
  "https://api.freelog.com",
  "https://api.testfreelog.com",
];
const authWhiteList = [
  "http://qi.testfreelog.com",
  "http://qi.freelog.com",
  "https://api.freelog.com",
  "https://api.testfreelog.com",
];
// TODO 将fetch和XMLHttpRequest放到沙盒里处理
export function ajaxProxy(type: string, name: string) {
  // @ts-ignore
  if (type === "fetch") {
    return function (url: string, options: any, widgetWindow: any) {
      options = options || {};
      const base = url.split(".com")[0] + ".com";
      if (
        !forbiddenList.includes(base) ||
        whiteList.includes(base) ||
        (isFreelogAuth(name) && authWhiteList.includes(base))
      ) {
        return rawFetch(url, { ...options });
      } else {
        return Promise.reject(
          "can not request data from freelog.com directly!"
        ); // rawFetch(url, { ...options, credentials: "include" });
      }
    };
  }
  if (type === "XMLHttpRequest") {
    var customizeOpen = function (
      method: any,
      url: any,
      async: any,
      user: any,
      password: any
    ) {
      const base = url.split(".com")[0] + ".com";
      if (
        !forbiddenList.includes(base) ||
        whiteList.includes(base) ||
        (isFreelogAuth(name) && authWhiteList.includes(base))
      ) {
        // @ts-ignore
        nativeOpen.bind(this)(method, url, async, user, password);
      }
      // @ts-ignore
      nativeOpen.bind(this)(method, url, async, user, password);
      // TODO 使用假错误正常返回  暂时无法使用
      // return "can not request data from freelog.com directly!";
    };
    // @ts-ignore
    XMLHttpRequest.prototype.open = customizeOpen;
    return XMLHttpRequest;
  }
}
export function isFreelogAuth(name: string) {
  return widgetsConfig.get(name).isUI;
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
      rawLocation.origin + "/" +
      devUrl +
      "$_" +
      hash.replace("?", "_") +
      rawLocation.hash;
    if (url === rawLocation.href) return;
    window.history.pushState(state++, "", url);
  } else {
    const url =
      rawLocation.origin +
      "/" +
      hash.replace("?", "_") +
      rawLocation.hash +
      rawLocation.search;
    if (url === rawLocation.href) return;
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
    clear: function (name: string) {},
    getItem: function (name: string) {
      return rawLocalStorage.getItem(id + name);
    },
    // @ts-ignore
    key: function (name: string) {},
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
    let routerType = HISTORY;
    // TODO 解析query参数  search   vue3会把origin也传过来
    let href = arguments[2].replace(rawLocation.origin, "");
    if (arguments[2] && arguments[2].indexOf("#") > -1) {
      href = href.substring(1);
      routerType = HASH;
      hash = arguments[2].replace(rawLocation.origin, "");
      // console.warn("hash route is not suggested!");
      // return;
    }
    let [pathname, search] = href.split("?");
    locationCenter.set(name, {
      pathname,
      href,
      search: search ? "?" + search : "",
      hash,
      routerType,
    });
  }
  function pushPatch() {
    if (moveLock) return;
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
    if (widgetConfig.config.historyFB) {
      return rawHistory.go(count);
    }
    const history = historyGo(name, count);
    if (history) {
      // @ts-ignore
      patch(...history);
      window.dispatchEvent(freelogPopstate);
    }
    // else if(count == -1){
    //   window.history.go(-1)
    // }
  }
  function back() {
    if (widgetConfig.config.historyFB) {
      return rawHistory.back();
    }
    const history = historyBack(name);
    if (history) {
      // @ts-ignore
      patch(...history);
      window.dispatchEvent(freelogPopstate);
    }
  }
  function forward() {
    if (widgetConfig.config.historyFB) {
      return rawHistory.forward();
    }
    const history = historyForward(name);
    if (history) {
      // @ts-ignore
      patch(...history);
      window.dispatchEvent(freelogPopstate);
    }
  }
  const state = getHistory(name).histories[getHistory(name).position]
    ? [0]
    : {};
  const length = getHistory(name).length;
  const historyProxy = {
    ...window.history,
    // @ts-ignore
    length: length,
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
  const widgetConfig = widgetsConfig.get(name);
  return new Proxy(locationProxy, {
    /* 
        a标签的href需要拦截，// TODO 如果以http开头则不拦截
         TODO reload 是重新加载插件
     */
    // @ts-ignore
    set: (target: any, p: PropertyKey, value: any): boolean => {
      if (p === "hash") {
        const _history = createHistoryProxy(name);
        // @ts-ignore
        _history.pushState("", "", value);
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
          return function () {};
        }
        if (["currentURL"].indexOf(property) > -1) {
          return rawLocation.href;
        }
        if (["reload"].indexOf(property) > -1) {
          // TODO 增加是否保留数据
          return async function (reject: any) {
            flatternWidgets.get(name).unmount(
              () => {
                flatternWidgets.get(name).mount();
              },
              () => {
                // 失败了再试一次
                flatternWidgets.get(name).unmount(
                  () => {
                    flatternWidgets.get(name).mount();
                  },
                  () => {
                    reject && reject();
                  }
                );
              },
              true
            );
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
        if (property === "protocol") {
            return widgetConfig.entry.indexOf('https') === 0 ? 'https:' : 'http:'  
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
const querySelector = rawDocument.querySelector;

// document的代理
export const createDocumentProxy = function (name: string) {
  // TODO  firstChild还没创建,这里需要改，加载后才能
  var doc = widgetsConfig.get(name).container.firstChild; //  || widgetsConfig.get(name).container;
  let rootDoc: any = doc;
  rawDocument.getElementsByClassName = rootDoc.getElementsByClassName.bind(doc);
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
  // rawDocument.addEventListener = rootDoc.addEventListener.bind(rootDoc);
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
  return rawDocument;
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
  document.addEventListener.bind(document)("click", (e: any) => {
    if (e.target.nodeName === "A") {
      return false;
    }
    return true;
  });
}
