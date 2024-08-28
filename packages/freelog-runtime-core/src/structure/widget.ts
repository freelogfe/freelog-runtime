import { freelogApp, devData } from "./freelogApp";
import microApp from "@micro-zoe/micro-app";
import { DEV_TYPE_REPLACE, DEV_THEME, DEV_FALSE } from "./dev";
import { digestMessage } from "./hashc";
import {
  getExhibitDepFileStream,
  getExhibitFileStream,
} from "../freelogApp/api";
import { WidgetController } from "freelog-runtime";
export const FREELOG_DEV = "freelogDev";
export const flatternWidgets = new Map<string, any>();
export const widgetsConfig = new Map<string, any>();
export const activeWidgets = new Map<string, any>();
export const childWidgets = new Map<string, any>();
export const widgetUserData = new Map<string, any>();
export function addWidget(key: string, plugin: WidgetController) {
  if (activeWidgets.has(key)) {
    console.warn(widgetsConfig.get(key).name + " reloaded");
  }
  flatternWidgets.set(key, plugin);
  activeWidgets.set(key, plugin);
}
export function addWidgetConfig(key: string, config: any) {
  widgetsConfig.set(key, config);
}
export function removeWidget(key: string) {
  flatternWidgets.has(key) && flatternWidgets.delete(key);
}
export function deactiveWidget(key: string) {
  activeWidgets.has(key) && activeWidgets.delete(key);
}
export function addChildWidget(key: string, childKey: any) {
  const arr = childWidgets.get(key) || [];
  !arr.includes(childKey) && arr.push(childKey);
  childWidgets.set(key, arr);
}
export function removeChildWidget(key: string, childKey: string) {
  if (childWidgets.has(key)) {
    const arr = childWidgets.get(key) || [];
    arr.includes(childKey) && arr.splice(arr.indexOf(childKey), 1);
    childWidgets.set(key, arr);
  }
}

/**
 * 1.主题或插件加载展品插件
 *     传递 exhibitId
 *     通过config传递展品属性给到插件 exhibitProperty
 * 
 * 2.主题或插件加载展品依赖的插件
 *     传递 articleId,ExhibitId(topExhibitId),parentNid
 *     步骤：
 *         获取展品信息时获取依赖，
 *         如果需要加载配置信息另外请求接口 getExhibitDepInfo
 *         通过config传递作品属性给到插件 articleProperty
 *
 * 3.插件加载自身依赖的插件
 *     传递 articleId,parentNid,topExhibitId
 *     步骤：
 *         上层插件主动传递依赖给它或者通过getSubDep
 *         如果需要加载配置信息另外请求接口 getExhibitDepInfo
 *         通过config传递作品属性给到插件 articleProperty
 *
 * 4.插件加载后需要获取自身的属性 getSelfProperties
 *     4.1 对于展品: exhibitProperty
         getExhibitInfo
 *       
 *     4.2 对于作品: articleProperty
 *       可以拿到topExhibitId, nid  对getExhibitDepInfo封装一下，
 *       getSelfProperties(exhibitId,nid)
 *
 */
let firstDev = false;

export async function mountExhibitWidget(
  name: string,
  options: {
    exhibitId: string;
    container: any;
    property?: any;
    dependencyTree?: any;
    renderWidgetOptions?: any;
    seq?: number | null | undefined;
    widget_entry?: string;
  }
) {
  let {
    exhibitId,
    container,
    property,
    seq,
    dependencyTree,
    widget_entry,
    renderWidgetOptions,
  } = options;
  let isTheme = true;
  if (name) {
    isTheme = false;
  }
  isTheme && (widget_entry = "");

  let entry = "";
  let widgetRenderName = "";
  if (isTheme) {
    widgetRenderName = "theme";
  } else {
    const hash = await digestMessage(exhibitId);
    widgetRenderName = "w" + hash + (seq || "");
  }
  // 不是开发模式禁用
  if (devData.type === DEV_FALSE) widget_entry = "";
  if (devData.type === DEV_TYPE_REPLACE) {
    entry = devData.params[widgetRenderName + "-freelog"] || "";
  } else if (devData.type === DEV_THEME && !firstDev) {
    entry = devData.params.dev;
    firstDev = true;
  }
  entry &&
    console.warn(
      "you are using widget entry " +
        entry +
        " for widget-exhibitId: " +
        exhibitId
    );
  let fentry = "";
  fentry = await getExhibitFileStream(name, exhibitId, {
    returnUrl: true,
    subFilePath: "/"
  });
  console.log(fentry)
  fentry = fentry.replace(/\/$/, '').replace(/\/$/, '') ; // + "/index.html"; // `?subFilePath=`;
  console.log(fentry)
  entry = widget_entry || entry || fentry;
  const widgetConfig = {
    container,
    name: widgetRenderName, //id
    isTheme: !!isTheme,
    exhibitId,
    property,
    dependencyTree,
    renderWidgetOptions: {
      ...renderWidgetOptions,
    },
    entry: entry || fentry,
    isDev: !!entry,
    seq,
    isUI: false,
    props: {},
  };
  console.log(renderWidgetOptions);
  renderWidgetOptions = options.renderWidgetOptions
    ? {
        ...options.renderWidgetOptions,
        "disable-scopecss": false, // 不允许关闭样式隔离
        "disable-sandbox": false, // 不允许关闭沙箱
      }
    : {};
  addWidgetConfig(widgetRenderName, widgetConfig);
  return mountApp(
    name,
    widgetRenderName,
    entry,
    container,
    renderWidgetOptions
  );
}

// parentNid  articleId articleProperty
export async function mountArticleWidget(
  name: string,
  options: {
    articleId: string;
    parentNid: string;
    nid: string;
    topExhibitId: string;
    container: any;
    dependencyTree?: any;
    property?: any;
    renderWidgetOptions?: any;
    seq?: number | null | undefined;
    widget_entry?: string;
  }
) {
  let {
    articleId,
    parentNid,
    topExhibitId,
    container,
    nid,
    dependencyTree,
    property,
    seq,
    widget_entry,
    renderWidgetOptions,
  } = options;
  let entry = "";
  let widgetRenderName = "";
  const hash = await digestMessage(topExhibitId + articleId);
  widgetRenderName = "w" + hash + (seq || "");
  // 不是开发模式禁用
  if (devData.type === DEV_FALSE) widget_entry = "";
  if (devData.type === DEV_TYPE_REPLACE) {
    entry = devData.params[widgetRenderName + "-freelog"] || "";
  }
  let fentry = "";
  fentry = await getExhibitDepFileStream(name, topExhibitId, {
    nid: nid,
    returnUrl: true,
    subFilePath: "/"
  });
  fentry = fentry.replace(/\/\/$/, '/').replace(/\/$/, '') ; //  + "/index.html"; // `&subFilePath=`;
  entry = widget_entry || entry || fentry;
  const widgetConfig = {
    container,
    name: widgetRenderName, //id
    isTheme: false,
    articleId,
    parentNid,
    nid,
    dependencyTree,
    property,
    topExhibitId,
    renderWidgetOptions: {
      ...renderWidgetOptions,
    },
    entry: entry || fentry,
    isDev: !!entry,
    seq,
    isUI: false,
    props: {},
  };
  renderWidgetOptions = options.renderWidgetOptions
    ? {
        ...options.renderWidgetOptions,
        "disable-scopecss": false, // 不允许关闭样式隔离
        "disable-sandbox": false, // 不允许关闭沙箱
      }
    : {};
  addWidgetConfig(widgetRenderName, widgetConfig);
  return mountApp(
    name,
    widgetRenderName,
    entry,
    container,
    renderWidgetOptions
  );
}
async function mountApp(
  name: string | null,
  widgetRenderName: string,
  entry: string,
  container: any,
  renderWidgetOptions: any
) {
  // microApp.preFetch([
  //   { name: widgetRenderName, url: entry, level: 3 }, // 加载资源并解析
  // ])
  // if(typeof renderWidgetOptions.data != "object"){
  //   consol
  //   return 
  // }
  const flag = await microApp.renderApp({
    "router-mode": "search",
    ...renderWidgetOptions,
    name: widgetRenderName,
    // TODO "https://file.freelog.com" 要定义一个常量来替换
    url: entry , // widgetConfig.entry,
    container: container,
    data: {
      ...(renderWidgetOptions.data ? renderWidgetOptions.data : {}),
      freelogApp: bindName(widgetRenderName),
    },
    "disable-scopecss": false, // 是否关闭样式隔离，可选
    "disable-sandbox": false, // 是否关闭沙盒，可选
  });
  // TODO 加载失败问题
  const unmount = (options?: {
    destroy?: boolean;
    clearAliveState?: boolean;
  }) => {
    return microApp.unmountApp(widgetRenderName, options);
  };
  const reload = (destroy?: boolean) => {
    return microApp.reload(widgetRenderName, destroy);
  };
  const getData = () => {
    return microApp.getData(widgetRenderName);
  };
  const clearData = () => {
    return microApp.clearData(widgetRenderName);
  };
  const setData = (data: Record<PropertyKey, unknown>) => {
    return microApp.setData(widgetRenderName, data);
  };
  const forceSetData = (data: Record<PropertyKey, unknown>) => {
    return microApp.forceSetData(widgetRenderName, data);
  };
  const addDataListener = (dataListener: Function, autoTrigger?: boolean) => {
    return microApp.addDataListener(
      widgetRenderName,
      dataListener,
      autoTrigger
    );
  };
  const removeDataListener = (dataListener: Function) => {
    return microApp.removeDataListener(widgetRenderName, dataListener);
  };
  const clearDataListener = () => {
    return microApp.clearDataListener(widgetRenderName);
  };
  const widgetControl = {
    success: flag,
    name: widgetRenderName,
    unmount,
    reload,
    setData,
    getData,
    clearData,
    addDataListener,
    removeDataListener,
    clearDataListener,
    forceSetData,
  };
  addWidget(widgetRenderName, widgetControl);
  name && addChildWidget(name, widgetControl);
  return widgetControl;
}

export const bindName = (name: string) => {
  const obj = {};
  return new Proxy(obj, {
    get: function (target, propKey) {
      if (typeof freelogApp[propKey] == "function") {
        return (...rest: any) => {
          return freelogApp[propKey].apply(null, [name, ...rest]);
        };
      } else {
        return freelogApp[propKey];
      }
    },
  });
};
