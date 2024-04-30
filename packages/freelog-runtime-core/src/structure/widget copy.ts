import { freelogApp } from "./freelogApp";
import microApp from "@micro-zoe/micro-app";
import { DEV_TYPE_REPLACE, DEV_THEME, DEV_FALSE } from "./dev";
import { digestMessage } from "./hashc";
import {
  getExhibitDepFileStream,
  getExhibitFileStream,
} from "../freelogApp/api";
import {
  DependArticleInfo,
  ExhibitInfo,
  WidgetController,
} from "freelog-runtime";
export const FREELOG_DEV = "freelogDev";
export const flatternWidgets = new Map<any, any>();
export const widgetsConfig = new Map<any, any>();
export const activeWidgets = new Map<any, any>();
export const childWidgets = new Map<any, any>();
export const widgetUserData = new Map<any, any>();
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

let firstDev = false;

// 可供插件自己加载子插件  widget需要验证格式
/**
 *
 * @param widget      插件数据
 * @param container   挂载容器
 * @param topExhibitData  最外层展品数据（子孙插件都需要用）
 * @param config      配置数据
 * @param seq         一个节点内可以使用多个插件，但需要传递序号，
 * @param widget_entry    用于父插件中去本地调试子插件
 *  如果需要支持不同插件下使用同一个插件，需要将作品id也加在运行时管理的插件id以实现全局唯一
 *      这里就有了一个问题，freelogApp.getSelfId() 与 作品id是不同的，
 *      造成问题：想在url上进行调试时 无法提前知道自身id。
 *      解决方案：1.做一个插件加载树，对于同级（同一个父插件，如果没有传递seq序号区分，直接报错不允许）
 *               2.提供浏览器插件， 打开测试节点时 可以将正在运行的插件加载树信息展示出来，以便开发者找到对应id
 *
 * @returns
 * 情况1.加载展品插件  topExhibitData只能为""或null值
 * 情况2.加载子插件  topPresenbleData必须传
 * 情况3.dev开发模式，
 *
 * 步骤：
 * 一、从展品列表开始
 *  1.请求展品列表
 *  2.加载展品插件
 *     传入widget,如果存在dependencyTree就保存dependencyTree到widgetsConfig中
 *  3.加载子依赖插件
 *    3.1请求展品信息同时请求子依赖
 *    3.2传入要加载的子依赖插件和展品信息本身
 *
 */

// exhibitId  exhibitProperty
export async function mountExhibitWidget(
  name: string,
  options: {
    exhibitId: string;
    container: any;
    config?: any;
    renderWidgetOptions?: any;
    seq?: number | null | undefined;
    widget_entry?: string;
  }
) {
  let { exhibitId, container, config, seq, widget_entry, renderWidgetOptions } =
    options;
  let isTheme = true;
  if (name) {
    isTheme = false;
  }
  isTheme && (widget_entry = "");

  const devData = freelogApp.devData;
  // 不是开发模式禁用
  if (devData.type === DEV_FALSE) widget_entry = "";
  let entry = "";
  let widgetRenderName = "";
  if (isTheme) {
    widgetRenderName = "theme";
  } else {
    const hash = await digestMessage(exhibitId);
    widgetRenderName = "w" + hash + (seq || "");
  }
  widget_entry &&
    console.warn(
      "you are using widget entry " +
        widget_entry +
        " for widget-exhibitId: " +
        exhibitId
    );
  if (devData) {
    if (devData.type === DEV_TYPE_REPLACE) {
      entry = devData.params[exhibitId] || "";
    }
    if (devData.type === DEV_THEME && !firstDev) {
      entry = devData.params.dev;
      firstDev = true;
    }
  }
  entry = widget_entry || entry;

  let fentry = "";
  fentry = await getExhibitFileStream(name, exhibitId, {
    returnUrl: true,
  });
  fentry = fentry + `&subFilePath=`;
  const widgetConfig = {
    container,
    name: widgetRenderName, //id
    isTheme: !!isTheme,
    exhibitId,
    renderWidgetOptions: {
      ...renderWidgetOptions,
    },
    entry: entry || fentry,
    isDev: !!entry,
    seq,
    config, // 主题插件配置数据
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

// parentNid  articleId articleProperty
export async function mountArticleWidget(
  name: string,
  options: {
    articleId: string;
    parentNid: string;
    topExhibitId: string;
    container: any;
    config?: any;
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
    config,
    seq,
    widget_entry,
    renderWidgetOptions,
  } = options;
  const devData = freelogApp.devData;
  let entry = "";
  let widgetRenderName = "";
  const hash = await digestMessage(articleId);
  widgetRenderName = "w" + hash + (seq || "");
  if (
    devData &&
    devData.type === DEV_TYPE_REPLACE &&
    devData.params[articleId]
  ) {
    entry = devData.params[articleId] || "";
  } else {
    // 不是开发模式禁用
    widget_entry = "";
  }
  entry = widget_entry || entry;
  let fentry = "";
  fentry = await getExhibitDepFileStream(name, topExhibitId, {
    parentNid: parentNid,
    subArticleId: articleId,
    returnUrl: true,
  });
  fentry = fentry + `&subFilePath=`;
  const widgetConfig = {
    container,
    name: widgetRenderName, //id
    isTheme: false,
    articleId,
    parentNid,
    topExhibitId,
    renderWidgetOptions: {
      ...renderWidgetOptions,
    },
    entry: entry || fentry,
    isDev: !!entry,
    seq,
    config, // 主题插件配置数据
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
  const flag = await microApp.renderApp({
    "router-mode": "search",
    renderWidgetOptions,
    name: widgetRenderName,
    // TODO "https://file.freelog.com" 要定义一个常量来替换
    url: entry || "https://file.freelog.com", // widgetConfig.entry,
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
  };
  addWidget(widgetRenderName, widgetControl);
  name && addChildWidget(name, widgetControl);
  return widgetControl;
}
export async function mountWidget(
  name: string,
  options: {
    container: any;
    config: any;
    exhibit?: ExhibitInfo;
    dependency?: DependArticleInfo;
    topExhibitId?: any;
    renderWidgetOptions?: any;
    seq?: number | null | undefined;
    widget_entry?: string;
  }
) {
  let {
    exhibit,
    dependency,
    container,
    config,
    seq,
    widget_entry,
    topExhibitId,
  } = options;
  let isTheme = true;
  // @ts-ignore
  if (name) {
    isTheme = false;
  }
  isTheme && (widget_entry = "");
  config = {
    ...(exhibitOrDependency.versionInfo
      ? exhibitOrDependency.versionInfo.exhibitProperty
      : {}), // exhibitProperty 展品里面的，可以freeze widget数据，防止加载时篡改
    ...config,
  };

  const devData = freelogApp.devData;
  // 不是开发模式禁用
  if (devData.type === DEV_FALSE) widget_entry = "";
  let commonData: {
    articleId: string;
    articleName: string;
    parentNid: string;
    exhibitId: string;
    nid: string;
    property: {
      bundleTool?: string;
      [key: string]: any;
    };
  };
  let entry = "";
  let widgetRenderName = "";
  if (exhibit) {
    commonData = {
      articleId: exhibit.articleInfo.articleId,
      articleName: exhibit.articleInfo.articleName,
      parentNid: "",
      exhibitId: exhibit.exhibitId,
      nid: "",
      property: exhibit?.versionInfo?.exhibitProperty as any,
    };
    if (isTheme) {
      widgetRenderName = "theme";
    } else {
      const hash = await digestMessage(exhibit.articleInfo.articleId);
      widgetRenderName = "w" + hash + (seq || "");
    }
  } else {
    commonData = {
      articleId: dependency.articleId,
      articleName: dependency.articleName,
      parentNid: dependency.parentNid,
      exhibitId: topExhibitId,
      nid: dependency.nid,
      property: dependency.articleProperty,
    };
    if (isTheme) {
      widgetRenderName = "theme";
    } else {
      const hash = await digestMessage(topExhibitId + commonData.articleId);
      widgetRenderName = "w" + hash + (seq || "");
    }
  }
  widget_entry &&
    console.warn(
      "you are using widget entry " +
        widget_entry +
        " for widget-articleId: " +
        commonData.articleId
    );
  if (devData) {
    if (devData.type === DEV_TYPE_REPLACE) {
      entry = devData.params[commonData.articleId] || "";
    }
    if (devData.type === DEV_THEME && !firstDev) {
      entry = devData.params.dev;
      firstDev = true;
    }
  }
  entry = widget_entry || entry;

  let fentry = "";
  if (commonData.nid) {
    fentry = await getExhibitDepFileStream(name, topExhibitId, {
      parentNid: commonData.parentNid,
      subArticleId: commonData.articleId,
      returnUrl: true,
    });
    fentry = fentry + `&subFilePath=`;
  } else {
    fentry = await getExhibitFileStream(name, commonData.exhibitId, {
      returnUrl: true,
    });
    fentry = fentry + "/?subFilePath="; // '/package/'
  }
  let once = false;

  const widgetConfig = {
    container,
    name: widgetRenderName, //id
    isTheme: !!isTheme,
    ...commonData,
    entry: entry || fentry,
    isDev: !!entry,
    seq,
    config, // 主题插件配置数据
    isUI: false,
    props: {},
  };
  const renderWidgetOptions = options.renderWidgetOptions
    ? {
        ...options.renderWidgetOptions,
        "disable-scopecss": false, // 不允许关闭样式隔离
        "disable-sandbox": false, // 不允许关闭沙箱
      }
    : {};
  addWidgetConfig(widgetRenderName, widgetConfig);
  let api: any = { apis: {} };
  const registerApi = function (apis: any) {
    if (once) {
      console.error("registerApi 只能在加在时使用一次");
      return "只能使用一次";
    }
    api.apis = apis;
    once = true;
  };
  // TODO 十分重要
  /**
   *   <micro-app name='my-app' url='xxx' disable-scopecss></micro-app>
   *   支持自定义元素的方案
   *   提供获取插件widgetRenderName和url的方法
   *      // name：必传参数，必须以字母开头，且不可以带特殊符号(中划线、下划线除外)
   *      1.widgetRenderName获取： 多个相同id的插件需要传递不同seq
   *
   *      // url：必传参数，必须指向子应用的index.html，如：http://localhost:3000/ 或 http://localhost:3000/index.html
   *      // const widgetFakeDomain = "widgetfiles"
   *      2.url获取：定义一个过度的url: https://${widgetFakeDomain}.${widgetRenderName}.com
   *        同样通过fretch拦截，
   *
   *      3.数据传递问题呢？需要拦截一层自定义元素
   *
   */
  // TODO 更新文档说明bundleTool
  const bundleTool = commonData.property ? commonData.property.bundleTool : "";
  const flag = await microApp.renderApp({
    // "router-mode": isTheme ? "native" : "search",
    "router-mode": "search",
    iframe: bundleTool === "vite" ? true : false,
    ...options.renderWidgetOptions,
    name: widgetRenderName,
    // TODO "https://file.freelog.com" 要定义一个常量来替换
    url: entry || "https://file.freelog.com", // widgetConfig.entry,
    container: widgetConfig.container,
    data: {
      ...(renderWidgetOptions.data ? renderWidgetOptions.data : {}),
      freelogApp: bindName(widgetRenderName, registerApi),
    },
    "disable-scopecss": false, // 是否关闭样式隔离，可选
    "disable-sandbox": false, // 是否关闭沙盒，可选
  });
  // TODO 加载失败问题
  const unmount = (options?: {
    destroy?: boolean;
    clearAliveState?: boolean;
  }) => {
    once = false;
    return microApp.unmountApp(widgetRenderName, options);
  };
  const reload = (destroy?: boolean) => {
    once = false;
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
    getApi: () => {
      return api.apis;
    },
    unmount,
    reload,
    setData,
    getData,
    clearData,
    addDataListener,
    removeDataListener,
    clearDataListener,
  };
  addWidget(widgetRenderName, widgetControl);
  name && addChildWidget(name, widgetControl);
  return widgetControl;
}

const obj = {};
export const bindName = (name: string, registerApi?: any) => {
  return new Proxy(obj, {
    // @ts-ignore
    get: function (target, propKey) {
      if (propKey === "registerApi") {
        return registerApi;
      }
      // @ts-ignore
      if (typeof freelogApp[propKey] == "function") {
        return (...rest: any) => {
          // eslint-disable-next-line prefer-rest-params
          return freelogApp[propKey].apply(null, [name, ...rest]);
        };
      } else {
        return freelogApp[propKey];
      }
    },
  });
};
