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
import { initGlobalState } from "freelog-runtime-core";
// import { initGlobalState } from "../../platform//index";
import { freelogApp } from "./freelogApp";
import { getUISatus } from "../bridge";
import { URL_WIDGET_PREFIX, URL_WIDGET_QUERY_PREFIX } from "./const";
import {
  historyBack,
  historyForward,
  historyGo,
  setHistory,
  getHistory,
  widgetHistories,
} from "./history";
import { DEV_WIDGET } from "./dev";
import { getThemeId } from "./init";
const rawDocument = document;
const HISTORY = "history";
const HASH = "hash";
const rawHistory = window["history"];
const rawLocation = window["location"];
const rawLocalStorage = window["localStorage"];
const rawWindow = window;
// widgetName  {routerType: 'history' || 'hash'}
export const locations = new Map();
export const locationsForBrower = new Map();
var freelogPopstate = new PopStateEvent("freelog-popstate");
// for history back and forword
export let state = 0;
let moveLock = false;
let shuttleLock = false;
let themePrefixAndId = "";
/**
 * 应对浏览器 historyback的问题，
 * 主题插件有自己的history.back history.forward  history.go
 * 当浏览器back或farward，需要回退或前进最近一次
 * 当回退或前进 当前插件没有了路由后，需要卸载插件
 * 卸载插件会造成问题，当前插件在浏览器上前进了很多次，此时state却没有变化
 * 此时需要使用主题插件中最大的state来replace一个url上去
 */
rawWindow.addEventListener(
  "popstate",
  async function (event) {
    let estate = event.state;
    if (!estate) estate = 0;
    if (getUISatus() && !shuttleLock) {
      shuttleLock = true;
      if (estate > state) {
        rawHistory.back();
      } else {
        rawHistory.forward();
      }
      return;
    }
    shuttleLock = false;
    initLocation(true);
    // 卸载后最大的 maxState
    let maxState = 0;
    let maxStateWidget = null;
    // 如果卸载了插件，需要重新setLocation
    // 卸载没有了路由的插件 （如果是点击按钮加载插件，但父插件没有跳转路由的情况咋整，这种情况）
    locations.forEach(async (value, key) => {
      if (!locationsForBrower.has(key)) {
        // await activeWidgets.get(key).unmount();
      } else if (widgetHistories.get(key)) {
        const widgetState = widgetHistories.get(key).state;
        if (maxState < widgetState) {
          maxState = widgetState;
          maxStateWidget = widgetHistories.get(key);
        }
      }
    });
    initLocation();
    if (estate < state) {
      // 如果最大的 maxState 已经小于当前state了，证明是state值最大的插件卸载了，此时无需进行回退。
      if (maxState < state) {
        state = maxState;
        // @ts-ignore
        // maxStateWidget.state = state
        setLocation(true);
        return;
      }
      moveLock = true;
      // this is back,  make all of locations position++
      // @ts-ignore
      locationsForBrower.forEach((value, key) => {
        const back = historyBack(key, estate);
        // @ts-ignore
        // back && patchCommon(key, false)(...back);
      });
    } else if (estate > state) {
      moveLock = true;
      // this is forword make all of locations position--
      // @ts-ignore
      locationsForBrower.forEach((value, key) => {
        historyForward(key, estate);
        const forward = historyForward(key, estate);
        // @ts-ignore
        // forward && patchCommon(key, false)(...forward);
      });
    }
    setTimeout(() => {
      moveLock = false;
    }, 0);
    state = estate;
    rawWindow.dispatchEvent(freelogPopstate);
  },
  false
);
rawWindow.addEventListener(
  "hashchange",
  function () {
    initLocation();
  },
  true
);
// name, sandbox,proxy, target
export function freelogAddEventListener(
  name: any,
  sandbox: any,
  proxy: any,
  target: any
) {
  return function () {
    // @ts-ignore
    const arr = Array.prototype.slice.apply(arguments);

    // TODO 是否给每个插件都一个事件，这样可以提升性能，路由没有变化的就不需要执行事件了
    if (arguments[0] === "popstate") {
      rawWindow.addEventListener("freelog-popstate", arr[1]);
      return;
    }
    // TODO onmessage需要处理, 此方法只能支持window.addEventListener
    if (arguments[0] === "message") {
      const func = arr[1];
      rawWindow.addEventListener(
        "message",
        (event: any) => {
          if (typeof func === "function") {
            func(
              new Proxy(
                {},
                {
                  get(target, p, receiver) {
                    if (p === "source") {
                      return proxy;
                    }
                    return event[p];
                  },
                }
              )
            );
          }
        },
        ...arr.slice(2)
      );
      return;
    }
    // @ts-ignore
    rawWindow.addEventListener(...arguments);
  };
}
// TODO 如果授权UI插件想要请求之外的接口，可以通过freelogAuths放进去
export const rawFetch = rawWindow.fetch;
export const nativeOpen = XMLHttpRequest.prototype.open;
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
export function isTheme(name: string) {
  return widgetsConfig.get(name).isTheme;
}
let isStart = false;
export function initLocation(isBrowser?: boolean, isFist?: boolean) {
  if (isFist) {
    isStart = true;
    // 防止新浪微博等跳转链接带了search
    if (rawLocation.search && freelogApp.devData.type !== DEV_WIDGET) {
      rawWindow.history.replaceState(
        state,
        "",
        rawLocation.href.replace(rawLocation.search, "")
      );
    }
  }
  if (!isStart) return;
  if (!themePrefixAndId) {
    if (getThemeId()) {
      themePrefixAndId = URL_WIDGET_PREFIX + getThemeId();
    }
  }
  if (isBrowser) {
    locationsForBrower.clear();
  } else {
    locations.clear();
  }
  const href = rawLocation.href;
  const search = rawLocation.search;
  // if (href.includes(URL_WIDGET_PREFIX)) {
  let loc = href.split("freelog.com/")[1].split(URL_WIDGET_PREFIX);
  if (freelogApp.devData.type === DEV_WIDGET) {
    // const temp = search.split(URL_WIDGET_QUERY_PREFIX)[1];
    // @ts-ignore
    // 如果是开发环境，主题也需要加上URL_WIDGET_PREFIX，并且这里需要去除掉dev的
    loc = search.split(URL_WIDGET_PREFIX).slice(1);
  }
  loc.forEach((item, index) => {
    try {
      if (!item) return;
      // if (!item.includes(URL_WIDGET_PREFIX) && themePrefixAndId) {
      //   // if (item.indexOf("/") !== 0) item = "/" + item;
      //   item = getThemeId() + "=" + item;
      // }
      // if (item.indexOf("/") == 0) item = item.replace("/", "");
      item = item.replace(URL_WIDGET_QUERY_PREFIX, "?");
      // 主题必须有路由，如果这里的item主题路由没有id
      if (index === 0 && item.indexOf(getThemeId()) !== 0) {
        item = getThemeId() + "=" + item;
      }
      if (item.indexOf("?") > -1) {
        let index = item.indexOf("?");
        let [id] = item.substring(0, index).split("=");
        let pathname = item.split(id + "=")[1].split("?")[0];
        // id = id.replace(URL_WIDGET_PREFIX, "");
        if (pathname.indexOf("/") !== 0) pathname = "/" + pathname;
        let search = item.substring(index);
        // TODO 判断id是否存在 isExist(id) &&
        if (isBrowser) {
          locationsForBrower.set(id, {
            pathname,
            href: pathname + search,
            search,
          });
          return;
        }
        locations.set(id, { pathname, href: pathname + search, search });
        return;
      }
      let l = item.split("=");
      let id = l[0];
      let pathname = item.split(id + "=")[1];
      if (pathname.indexOf("/") !== 0) pathname = "/" + pathname;
      if (isBrowser) {
        locationsForBrower.set(id, {
          pathname: pathname,
          href: pathname,
          search: "",
        });
        return;
      }
      // console.log(id, { pathname: pathname, href: pathname, search: "" })
      locations.set(id, { pathname: pathname, href: pathname, search: "" });
    } catch (e) {
      console.error("url is error" + e);
    }
  });
  // }
}
export function setLocation(isReplace?: boolean) {
  if (!isReplace) {
    state++;
  }
  // TODO 只有在线的应用才在url上显示, 只有pathname和query需要
  let hash = "";
  locations.forEach((value, key) => {
    if (!activeWidgets.get(key)) {
      locations.delete(key);
      return;
    }
    hash += URL_WIDGET_PREFIX + key + "=" + value.href || "";
  });
  if (freelogApp.devData.type === DEV_WIDGET) {
    let devUrl = rawLocation.search.split(URL_WIDGET_PREFIX)[0];
    if (!devUrl.endsWith("/")) {
      devUrl = devUrl + "/";
    }
    let url =
      rawLocation.origin +
      "/" +
      devUrl +
      //  +
      hash.replace("?", URL_WIDGET_QUERY_PREFIX) +
      rawLocation.hash;
    if (freelogApp.devData.type !== DEV_WIDGET) {
      url = url.replace("/" + themePrefixAndId + "=", "");
    }
    if (url === rawLocation.href) return;

    if (isReplace) {
      rawWindow.history.replaceState(state, "", url);
    } else {
      rawWindow.history.pushState(state, "", url);
    }
  } else {
    let url =
      rawLocation.origin +
      "/" +
      hash.replace("?", URL_WIDGET_QUERY_PREFIX) +
      rawLocation.hash;
    // + rawLocation.search;
    if (freelogApp.devData.type !== DEV_WIDGET) {
      url = url.replace("/" + themePrefixAndId + "=", "");
    }
    if (url === rawLocation.href) return;
    if (isReplace) {
      rawWindow.history.replaceState(state, "", url);
    } else {
      rawWindow.history.pushState(state, "", url);
    }
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
  },
  get: function (name: string): string {
    return locations.get(name);
  },
};
export function freelogLocalStorage(
  id: any,
  sandbox: any,
  proxy: any,
  target: any
) {
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
/**
 *
 * @param name
 * @param flag 是否需要 setLocation
 * @returns
 */
function patchCommon(
  name: string,
  isSetLocation?: boolean,
  isReplace?: boolean
) {
  return function () {
    let hash = "";
    let routerType = HISTORY;
    // TODO 解析query参数  search vue3会把origin也传过来
    let href = arguments[2]
      .replace(rawLocation.origin, "")
      .replace(rawLocation.origin.replace("http:", "https:"), "");
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
    isSetLocation && setLocation(isReplace);
  };
}
export const saveSandBox = function (name: string, sandBox: any) {
  addSandBox(name, sandBox);
};
export const createHistoryProxy = function (
  name: any,
  sandbox: any,
  proxy: any,
  target: any
) {
  const widgetConfig = widgetsConfig.get(name);

  function patch() {
    // @ts-ignore
    patchCommon(name)(...arguments);
  }
  function pushPatch() {
    if (moveLock) return;
    // @ts-ignore
    patchCommon(name, true, false)(...arguments);
    setHistory(name, arguments);
  }
  function replacePatch() {
    // @ts-ignore
    patchCommon(name, true, true)(...arguments);
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
      rawWindow.dispatchEvent(freelogPopstate);
    }
    // else if(count == -1){
    //   rawWindow.history.go(-1)
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
      rawWindow.dispatchEvent(freelogPopstate);
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
      rawWindow.dispatchEvent(freelogPopstate);
    }
  }
  const state = getHistory(name).histories[getHistory(name).position]
    ? [0]
    : {};
  const length = getHistory(name).length;
  const historyProxy = {
    ...rawWindow.history,
    // @ts-ignore
    length: length,
    pushState: pushPatch,
    replaceState: replacePatch,
    state,
    go: go, // rawWindow.history.go.bind(rawWindow.history),
    back: back, // rawWindow.history.back.bind(rawWindow.history),
    forward: forward, //rawWindow.history.forward.bind(rawWindow.history)
  };
  return historyProxy;
};
// TODO 如果是单应用模式（提升性能）则不用代理, 可以设置location.href的使用权限
// TODO reload相当于重载应用，想办法把主应用的对应操控函数弄过来，发布订阅模式
// TODO replace与reload、toString方法无法访问
export const createLocationProxy = function (
  name: any,
  sandbox: any,
  proxy: any,
  target: any
) {
  const locationProxy = {};
  const widgetConfig = widgetsConfig.get(name);
  return new Proxy(locationProxy, {
    /* 
        a标签的href需要拦截，// TODO 如果以http开头则不拦截
     */
    // @ts-ignore
    set: (target: any, p: PropertyKey, value: any): boolean => {
      if (p === "hash") {
        const _history = createHistoryProxy(name, sandbox, proxy, target);
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
            flatternWidgets.get(name).unmount();
            flatternWidgets.get(name).unmountPromise.then(() => {
              flatternWidgets.get(name).mount();
            }, reject);
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
          return widgetConfig.entry.indexOf("https") === 0 ? "https:" : "http:";
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
export const createDocumentProxy = function (
  name: any,
  sandbox: any,
  proxy: any,
  target: any
) {
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
  // react 兼容问题， 按道理应该绑定rootDoc，但react不兼容，需要记录不兼容的地方
  // rawDocument.addEventListener = rootDoc.addEventListener.bind(rootDoc);
  // rawDocument.removeEventListener = rootDoc.removeEventListener.bind(rootDoc);
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
export const createWidgetProxy = function (
  name: any,
  sandbox: any,
  proxy: any,
  target: any
) {
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
export const createFreelogAppProxy = function (
  name: any,
  sandbox: any,
  proxy: any,
  target: any
) {
  const freelogAppProxy = {};
  return new Proxy(freelogAppProxy, {
    // @ts-ignore
    get: function get(app: any, p: string) {
      const pro = freelogApp[p];
      if (typeof pro === "function") {
        if (p === "initGlobalState") {
          if (isTheme(name)) {
            return initGlobalState;
          }
          return () => {};
        }
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
