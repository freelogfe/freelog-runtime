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

import { loadMicroApp } from "../runtime";
import { setLocation } from "./proxy";
import { DEV_TYPE_REPLACE, DEV_WIDGET } from "./dev";
import { getSubDep, getEntry } from "./utils";
import { defaultWidgetConfigData } from "./widgetConfigData";
export const FREELOG_DEV = "freelogDev";
export const flatternWidgets = new Map<any, any>();
export const widgetsConfig = new Map<any, any>();
export const activeWidgets = new Map<any, any>();
export const childrenWidgets = new Map<any, any>();
export const sandBoxs = new Map<any, any>(); // 沙盒不交给plugin, 因为plugin是插件可以用的
export const widgetUserData = new Map<any, any>();
// TODO plugin type
export function addWidget(key: string, plugin: any) {
  if (activeWidgets.has(key)) {
    console.warn(flatternWidgets.get(key).name + " reloaded");
  }
  flatternWidgets.set(key, plugin);
  activeWidgets.set(key, plugin);
}
export function addWidgetConfig(key: string, config: any) {
  widgetsConfig.set(key, config);
}
// TODO error
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
    console.warn(flatternWidgets.get(key).name + "reloaded");
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
    sandbox: {
      strictStyleIsolation: config ? !!config.shadowDom : false,
      experimentalStyleIsolation: config ? !!config.scopedCss : true,
    },
  });
  // TODO 增加是否保留数据
  const _app = {
    ...app,
    mount: (resolve?: any, reject?: any) => {
      app.mount().then(
        () => {
          addWidget(name, app);
          // TODO 验证是否是函数
          resolve && resolve();
        },
        () => {
          reject();
        }
      );
    },
    unmount: (resolve?: any, reject?: any) => {
      app.unmount().then(
        () => {
          deactiveWidget(name);
          setLocation();
          // TODO 验证是否是函数
          resolve && resolve();
        },
        () => {
          reject();
        }
      );
    },
  };
  addWidget(name, _app);
  // TODO 拦截mount做处理
  return _app;
}
// 可供插件自己加载子插件  widget需要验证格式
/**
 *
 * @param widget      插件数据
 * @param container   挂载容器
 * @param commonData  最外层展品数据（子孙插件都需要用）
 * @param config      配置数据
 * @param seq         一个节点内可以使用多个插件，但需要传递序号，
 * TODO 如果需要支持不同插件下使用同一个插件，需要将展品id也加上
 *
 * @returns
 * 情况1.加载展品插件  topPresentableData只能为""或null值
 * 情况2.加载子插件  topPresenbleData必须传
 * 情况3.dev开发模式，
 */
export function mountWidget(
  widget: any,
  container: any,
  topPresentableData: any,
  config: any,
  seq?: number | null | undefined,
  isTheme?: boolean
): any {
  if (!window.isTest) {
    mountNormalWidget(
      widget,
      container,
      topPresentableData,
      config,
      seq,
      isTheme
    );
  } else {
    // @ts-ignore
    const that = this;
    let configData = config;
    // TODO 为了安全，得验证是否是插件使用还是运行时使用mountWidget
    if (that && that.name) {
      isTheme = false;
      defaultWidgetConfigData.historyFB = false;
    }
    config = {
      ...defaultWidgetConfigData,
      ...(widget.versionProperty || {}), // versionProperty 展品里面的，可以freeze widget数据，防止加载时篡改
      ...config,
    };
    if (!isTheme) {
      config.historyFB = hbfOnlyToTheme ? false : config.historyFB;
    } else {
      hbfOnlyToTheme = config.hbfOnlyToTheme;
    }
    let commonData: any;
    let entry = "";
    
    if (!topPresentableData) {
      commonData = {
        id: widget.testResourceId,
        name: widget.testResourceName,
        exhibitId: widget.testResourceId,
        workNid: "",
        resourceInfo: {
          resourceId: widget.testResourceId,
          resourceName: widget.testResourceName,
        },
      };
    } else {
      commonData = {
        id: widget.id,
        name: widget.name,
        exhibitId: topPresentableData.data.testResourceId,
        workNid: topPresentableData.workNid,
        resourceInfo: {
          resourceId: widget.id,
          resourceName: widget.name,
        },
      };
    }
    // TODO freelog-需要用常量
    let widgetId = "freelog-" + commonData.resourceInfo.resourceId;
    // @ts-ignore
    const devData = window.freelogApp.devData;
    if (devData) {
      if (devData.type === DEV_TYPE_REPLACE) {
        entry = devData.params[commonData.id] || "";
      }
      if (devData.type === DEV_WIDGET && !firstDev) {
        entry = devData.params.dev;
        firstDev = true;
      }
    }
    if (seq || seq === 0) {
      widgetId = "freelog-" + commonData.id + seq;
    }
    const widgetConfig = {
      container,
      name: widgetId, //id
      isTheme: !!isTheme,
      exhibitId: commonData.exhibitId, // 展品id为空的都是插件依赖的插件
      widgetName: commonData.resourceInfo.resourceName.replace("/", "-"),
      parentNid: commonData.workNid,
      resourceName: commonData.resourceInfo.resourceName,
      subResourceIdOrName: commonData.resourceInfo.resourceId,
      resourceId: commonData.resourceInfo.resourceId, // id可以重复，name不可以, 这里暂时这样
      entry:
        entry ||
        getEntry({
          exhibitId: commonData.exhibitId,
          parentNid: commonData.workNid,
          subResourceIdOrName: commonData.resourceInfo.resourceId,
        }),
      isDev: !!entry,
      config, // 主题插件配置数据
      isUI: false,
    };
    addWidgetConfig(widgetId, widgetConfig);
    // TODO 所有插件加载用promise all
    // @ts-ignore
    const app = loadMicroApp(widgetConfig, {
      sandbox: {
        strictStyleIsolation: configData ? !!configData.shadowDom : false,
        experimentalStyleIsolation: configData ? !!configData.scopedCss : true,
      },
    });
    // TODO 增加是否保留数据
    const freelog_app = {
      ...app,
      mount: (resolve?: any, reject?: any) => {
        app.mount().then(
          () => {
            addWidget(widgetId, freelog_app);
            // TODO 验证是否是函数
            resolve && resolve();
          },
          () => {
            reject();
          }
        );
      },
      unmount: (resolve?: any, reject?: any) => {
        app.unmount().then(
          () => {
            deactiveWidget(widgetId);
            setLocation();
            // TODO 验证是否是函数
            resolve && resolve();
          },
          () => {
            reject();
          }
        );
      },
    };
    addWidget(widgetId, freelog_app);
    return freelog_app;
  }
}
function mountNormalWidget(
  widget: any,
  container: any,
  topPresentableData: any,
  config: any,
  seq?: number | null | undefined,
  isTheme?: boolean
) {
  // @ts-ignore
  const that = this;
  let configData = config;
  // TODO 为了安全，得验证是否是插件使用还是运行时使用mountWidget
  if (that && that.name) {
    isTheme = false;
    defaultWidgetConfigData.historyFB = false;
  }
  config = {
    ...defaultWidgetConfigData,
    ...(widget.versionProperty || {}), // versionProperty 展品里面的，可以freeze widget数据，防止加载时篡改
    ...config,
  };
  if (!isTheme) {
    config.historyFB = hbfOnlyToTheme ? false : config.historyFB;
  } else {
    hbfOnlyToTheme = config.hbfOnlyToTheme;
  }
  let commonData: any;
  let entry = "";
  if (!topPresentableData) {
    commonData = {
      id: widget.resourceInfo.resourceId,
      name: widget.resourceInfo.name || widget.resourceInfo.resourceName,
      exhibitId: widget.exhibitId || "",
      workNid: "",
      resourceInfo: {
        resourceId: widget.resourceInfo.resourceId,
        resourceName:
          widget.resourceInfo.name || widget.resourceInfo.resourceName,
      },
    };
  } else {
    commonData = {
      id: widget.id,
      name: widget.name,
      exhibitId: topPresentableData.data.exhibitId || "",
      workNid: topPresentableData.workNid,
      resourceInfo: {
        resourceId: widget.id,
        resourceName: widget.name,
      },
    };
  }
  // TODO freelog-需要用常量
  let widgetId = "freelog-" + commonData.resourceInfo.resourceId;
  // @ts-ignore
  const devData = window.freelogApp.devData;
  if (devData) {
    if (devData.type === DEV_TYPE_REPLACE) {
      entry = devData.params[commonData.id] || "";
    }
    if (devData.type === DEV_WIDGET && !firstDev) {
      entry = devData.params.dev;
      firstDev = true;
    }
  }
  if (seq || seq === 0) {
    widgetId = "freelog-" + commonData.id + seq;
  }
  const widgetConfig = {
    container,
    name: widgetId, //id
    isTheme: !!isTheme,
    exhibitId: commonData.exhibitId, // 展品id为空的都是插件依赖的插件
    widgetName: commonData.resourceInfo.resourceName.replace("/", "-"),
    parentNid: commonData.workNid,
    resourceName: commonData.resourceInfo.resourceName,
    subResourceIdOrName: commonData.resourceInfo.resourceId,
    resourceId: commonData.resourceInfo.resourceId, // id可以重复，name不可以, 这里暂时这样
    entry:
      entry ||
      getEntry({
        exhibitId: commonData.exhibitId,
        parentNid: commonData.workNid,
        subResourceIdOrName: commonData.resourceInfo.resourceId,
      }),
    isDev: !!entry,
    config, // 主题插件配置数据
    isUI: false,
  };
  addWidgetConfig(widgetId, widgetConfig);
  // TODO 所有插件加载用promise all
  // @ts-ignore
  const app = loadMicroApp(widgetConfig, {
    sandbox: {
      strictStyleIsolation: configData ? !!configData.shadowDom : false,
      experimentalStyleIsolation: configData ? !!configData.scopedCss : true,
    },
  });
  // TODO 增加是否保留数据
  const freelog_app = {
    ...app,
    mount: (resolve?: any, reject?: any) => {
      app.mount().then(
        () => {
          addWidget(widgetId, freelog_app);
          // TODO 验证是否是函数
          resolve && resolve();
        },
        () => {
          reject();
        }
      );
    },
    unmount: (resolve?: any, reject?: any) => {
      app.unmount().then(
        () => {
          deactiveWidget(widgetId);
          setLocation();
          // TODO 验证是否是函数
          resolve && resolve();
        },
        () => {
          reject();
        }
      );
    },
  };
  addWidget(widgetId, freelog_app);
  return freelog_app;
}
// 固定id 的加载子插件，仅支持加载一次
export function mountSubWidgets(parent: any, config?: any, resolve?: any) {
  const parentGlobal = sandBoxs.get(
    "freelog-" + parent.data.exhibitId
  ).proxy;
  // @ts-ignore
  // theme.subDeps.push({id:"60068f63973b31003a4fbf2a",name:"chtes/pubu",type:"resource",resourceType:"widget"})
  const promises: Promise<any>[] = [];
  // @ts-ignore
  parent.subDeps.forEach((sub) => {
    switch (sub.resourceType) {
      case "widget":
        const subContainer = parentGlobal.document.getElementById(
          "freelog-" + sub.id
        );
        if (!subContainer) {
          console.error("container is not exists: " + sub.presentableName);
          return;
        }
        // @ts-ignore
        window.freelogApp.mountWidget(
          sub,
          subContainer,
          {
            //@ts-ignore
            exhibitId: window.freelogApp.nodeInfo.nodeThemeId,
            workNid: parent.workNid,
            subDependId: sub.id,
          },
          "",
          config
        );
        // setTimeout(app.unmount, 2000)
        // setTimeout(app.mount, 5000)
        // TODO 所有插件加载完成后 加载交给运行时子依赖的插件
        break;
      // case "js": {
      //   promises.push(createScript(url));
      //   break;
      // }
      // case "css": {
      //   promises.push(createCssLink(url));
      //   break;
      // }
      default: {
      }
    }
  });
  let count = promises.length;
  if (count === 0) {
    resolve && resolve();
  } else {
    for (const p of promises) {
      p.finally(() => {
        count--;
        if (count === 0) {
          resolve && resolve();
        }
      });
    }
  }
}
export async function autoMoutSubWdigets(config?: any) {
  // @ts-ignore
  const presenbaleId = widgetsConfig.get(this.widgetName)?.id;
  // @ts-ignore
  const parent = await getSubDep.bind(this)(presenbaleId);
  mountSubWidgets(parent, config);
}
