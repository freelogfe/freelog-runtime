// 插件对象管理plugins：flatternWidgets childrenWidgets sandBoxs

/**
 * 1.数据结构
 *   flatternWidgets Map<key：plugin id,value: object: 所有插件配置与状态与加载后控制对象> 插件集合 平行 关系 所有插件配置与状态与
 *   childrenWidgets Map<key：father-plugin id,value: Array:[child-plugin id]> 插件对应的子插件集合
 *   sandBoxs Map<key: plugin id, value: sandbox>  所有插件对应沙盒对象
 * 2.设计模式
 *   自顶向下： 加载与卸载权限控制： 注册后通过沙盒提供控制对象给运行时或上层插件沙盒变量进行管控
 *   loadMicroApp({ name: 'vue', entry: '//localhost:7101', container: '#vue' }, { sandbox: { experimentalStyleIsolation: true } }, );
 *   状态管理：
 *      运行状态管理： bootstrap,mounting,mounted,unmounting,unmounted   后期思考：怎样算paused，能否实现？
 *      权限状态？？？
 *   中央集权：沙盒全部在运行时进行管控，一旦有恶意侵入可中断（对沙盒的中断算paused?）， 挂载后控制对象就在全局，故有加载与卸载任何插件权限。
 *
 */

// import { loadMicroApp } from "../../platform";
import { loadMicroApp } from "freelog-runtime-core";
import { freelogApp } from "./freelogApp";

import { freelogFetch, getViewport } from "./utils";
import { setLocation } from "./proxy";
import { DEV_TYPE_REPLACE, DEV_WIDGET, DEV_FALSE } from "./dev";
import { defaultWidgetConfigData } from "./widgetConfigData";
import setHooks from "./proxySet";
import getHooks from "./proxyGet";
import { saveSandBox } from "./proxy";
const proxyHooks = {
  setHooks,
  getHooks,
  saveSandBox,
};
export const FREELOG_DEV = "freelogDev";
export const flatternWidgets = new Map<any, any>();
export const widgetsConfig = new Map<any, any>();
export const activeWidgets = new Map<any, any>();
export const childrenWidgets = new Map<any, any>();
export const sandBoxs = new Map<any, any>(); // 沙盒不交给plugin, 因为plugin是插件可以用的
export const widgetUserData = new Map<any, any>();
export function addWidget(key: string, plugin: any) {
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
  flatternWidgets.has(key) && flatternWidgets.delete(key) && removeSandBox(key);
}
export function deactiveWidget(key: string) {
  activeWidgets.has(key) && activeWidgets.delete(key);
}
export function addChildWidget(key: string, childKey: any) {
  const arr = childrenWidgets.get(key) || [];
  !arr.contains(childKey) && arr.push(childKey);
  childrenWidgets.set(key, arr);
}
export function removeChildWidget(key: string, childKey: string) {
  if (childrenWidgets.has(key)) {
    let arr = childrenWidgets.get(key) || [];
    arr.contains(childKey) && arr.splice(arr.indexOf(childKey), 1);
    childrenWidgets.set(key, arr);
  }
}
// maybe plugin is not exists in flatternWidgets
export function addSandBox(key: string, sandbox: any) {
  if (sandBoxs.has(key)) {
    console.warn(widgetsConfig.get(key).name + " reloaded");
  }
  sandBoxs.set(key, sandbox);
}
export function removeSandBox(key: string) {
  sandBoxs.has(key) && sandBoxs.delete(key);
}

let firstDev = false;
let hbfOnlyToTheme = true; // 保存是否前进后退只给主题
export function mountUI(
  name: string,
  container: any,
  entry: string,
  config?: any
): any {
  const widgetConfig = {
    container,
    name, //id
    entry,
    isUI: true,
    config, // 主题插件配置数据
  };
  addWidgetConfig(name, widgetConfig);
  const app = loadMicroApp(widgetConfig, {
    fetch: freelogFetch,
    proxyHooks,
    sandbox: {
      strictStyleIsolation: config ? !!config.shadowDom : false,
      experimentalStyleIsolation: config ? !!config.scopedCss : true,
    },
  });
  const _app = {
    ...app,
    mount: () => {
      return new Promise((resolve?: any, reject?: any) => {
        app.mount().then(
          () => {
            addWidget(name, _app);
            if (resolve instanceof Function) {
              resolve();
            }
          },
          () => {
            if (reject instanceof Function) {
              reject();
            }
          }
        );
      });
    },
    unmount: () => {
      return new Promise((resolve?: any, reject?: any) => {
        app.unmount().then(
          () => {
            deactiveWidget(name);
            setLocation();
            if (resolve instanceof Function) {
              resolve();
            }
          },
          () => {
            if (reject instanceof Function) {
              reject();
            }
          }
        );
      });
    },
  };
  addWidget(name, _app);
  return _app;
}
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
 */
export async function mountWidget(
  options: {
    widget: any;
    container: any;
    topExhibitData: any;
    config: any;
    seq?: number | null | undefined;
    widget_entry?: boolean | string; // 因为插件加载者并不使用，所以 可以当成 widget_entry
  },
  ...args: any[]
) {
  let { widget, container, topExhibitData, config, seq, widget_entry } =
    options; // 因为插件加载者并不使用，所以 可以当成 widget_entry}
  if (args?.length) {
    widget = options;
    [container, topExhibitData, config, seq, widget_entry] = args;
  }
  let isTheme = typeof widget_entry === "boolean" ? widget_entry : false;
  // @ts-ignore
  const that = this;
  let configData = config;
  if (that?.name) {
    isTheme = false;
    defaultWidgetConfigData.historyFB = false;
  }
  isTheme && (widget_entry = "");
  config = {
    ...defaultWidgetConfigData,
    ...(widget.versionInfo ? widget.versionInfo.exhibitProperty : {}), // exhibitProperty 展品里面的，可以freeze widget数据，防止加载时篡改
    ...config,
  };
  if (!isTheme) {
    config.historyFB = hbfOnlyToTheme ? false : config.historyFB;
  } else {
    hbfOnlyToTheme = config.hbfOnlyToTheme;
  }
  const devData = freelogApp.devData;
  // 不是开发模式禁用
  if (devData.type === DEV_FALSE) widget_entry = "";
  let commonData: any;
  let entry = "";
  if (!topExhibitData) {
    commonData = {
      id: widget.articleInfo.articleId,
      name: widget.articleInfo.name || widget.articleInfo.articleName,
      exhibitId: widget.exhibitId || "",
      articleNid: "",
      articleInfo: {
        articleId: widget.articleInfo.articleId,
        articleName: widget.articleInfo.name || widget.articleInfo.articleName,
      },
    };
  } else {
    commonData = {
      id: widget.id,
      name: widget.name,
      exhibitId: topExhibitData.exhibitId || "",
      articleNid: topExhibitData.articleNid,
      articleInfo: {
        articleId: widget.id,
        articleName: widget.name,
      },
    };
  }
  let widgetId = commonData.articleInfo.articleId;
  widget_entry &&
    console.warn(
      "you are using widget entry " +
        widget_entry +
        " for widget-articleId: " +
        commonData.articleInfo.articleId
    );
  // @ts-ignore
  if (devData) {
    if (devData.type === DEV_TYPE_REPLACE) {
      entry = devData.params[commonData.id] || "";
    }
    if (devData.type === DEV_WIDGET && !firstDev) {
      entry = devData.params.dev;
      firstDev = true;
    }
  }
  // @ts-ignore
  entry = widget_entry || entry;
  if (seq || seq === 0) {
    widgetId = commonData.id + seq;
  }
  let fentry = "";
  if (commonData.articleNid) {
    fentry = await freelogApp.getExhibitDepFileStream.bind(that || {})(
      commonData.exhibitId,
      commonData.articleNid,
      commonData.articleInfo.articleId,
      true
    );
    fentry = fentry + `&subFilePath=`;
  } else {
    fentry = await freelogApp.getExhibitFileStream.bind(that || {})(
      commonData.exhibitId,
      { returnUrl: true }
    );
    fentry = fentry + "?subFilePath="; // '/package/'
  }
  let once = false;
  let api: any = {};

  const widgetConfig = {
    container,
    name: widgetId, //id
    isTheme: !!isTheme,
    exhibitId: commonData.exhibitId, // 展品id为空的都是插件依赖的插件
    widgetName: commonData.articleInfo.articleName.replace("/", "-"),
    parentNid: commonData.articleNid,
    articleName: commonData.articleInfo.articleName,
    subArticleIdOrName: commonData.articleInfo.articleId,
    articleId: commonData.articleInfo.articleId, // id可以重复，name不可以, 这里暂时这样
    entry: entry || fentry,
    isDev: !!entry,
    config, // 主题插件配置数据
    isUI: false,
    props: {
      registerApi: (apis: any) => {
        if (once) {
          console.error("registerApi 只能在加在时使用一次");
          return "只能使用一次";
        }
        api = apis;
        once = true;
      },
    },
  };
  addWidgetConfig(widgetId, widgetConfig);
  const obj = {
    strictStyleIsolation: false,
    experimentalStyleIsolation: true,
  };
  if (configData.hasOwnProperty("shadowDom")) {
    obj.strictStyleIsolation = configData.shadowDown;
  }
  if (configData.hasOwnProperty("scopedCss")) {
    obj.experimentalStyleIsolation = configData.scopedCss;
  }
  // @ts-ignore
  const app = loadMicroApp(widgetConfig, {
    fetch: freelogFetch,
    proxyHooks,
    sandbox: {
      ...obj,
    },
  });
  const freelog_app = {
    ...app,
    mount: () => {
      return new Promise((resolve?: any, reject?: any) => {
        app.mount();
        app.mountPromise.then(
          () => {
            addWidget(widgetId, freelog_app);
            if (resolve instanceof Function) {
              resolve();
            }
          },
          () => {
            if (reject instanceof Function) {
              reject();
            }
          }
        );
      });
    },
    getApi: () => {
      return api;
    },
    unmount: (keepLocation?: boolean) => {
      return new Promise((resolve?: any, reject?: any) => {
        deactiveWidget(widgetId);
        app.unmount();
        app.unmountPromise.then(
          () => {
            // 卸载后可以重新注册api
            once = false;
            api = {};
            deactiveWidget(widgetId);
            !keepLocation && setLocation(true);
            if (resolve instanceof Function) {
              resolve();
            }
          },
          () => {
            if (reject instanceof Function) {
              reject();
            }
          }
        );
      });
    },
  };
  addWidget(widgetId, freelog_app);
  return freelog_app;
}
