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
import { baseUrl } from "../../services/base";
import { setLocation } from "./proxy";
import { DEV_TYPE_REPLACE, DEV_WIDGET } from "./dev";
import { createScript, createCssLink, resolveUrl, getSubDep } from "./utils";

export const flatternWidgets = new Map<any, any>();
export const widgetsConfig = new Map<any, any>();
export const activeWidgets = new Map<any, any>();
export const childrenWidgets = new Map<any, any>();
export const sandBoxs = new Map<any, any>(); // 沙盒不交给plugin, 因为plugin是插件可以用的

// TODO plugin type
export function addWidget(key: string, plugin: any) {
  if (activeWidgets.has(key)) {
    console.warn(flatternWidgets.get(key).name + "reloaded");
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
const count = 0;
let firstDev = false;
// 可供插件自己加载子插件  sub需要验证格式
export function mountWidget(
  sub: any,
  container: any,
  data: any,
  entry?: string,
  config?: any
): any {
  // @ts-ignore
  const devData = window.freelogApp.devData;
  if (devData && !entry) {
    if (devData.type === DEV_TYPE_REPLACE) {
      entry = devData.params[sub.id] || "";
    }
    if (devData.type === DEV_WIDGET && !firstDev) {
      entry = devData.params.dev;
      firstDev = true;
    }
  }
  let id = !sub ? "freelogDev" : "freelog-" + sub.id;
  if (sub && flatternWidgets.has(sub.id)) {
    id = "freelog-" + sub.id + (count + 1);
  }
  if(!data && sub){
    data = {
      presentableId:sub.id,
      entityNid: '',
      subDependId: sub.id
    }
  }
  // @ts-ignore TODO 用了太多重复判断，要抽取,当entry存在时该行不出现sub data
  const widgetConfig = {
    container,
    name: id, //id
    widgetName: !sub ? "freelogDev" : sub.name,
    id: !sub ? "freelogDev" : sub.id,
    entry:
      entry ||
      `${baseUrl}widgets/${data.subDependId}?entityNid=${data.entityNid}&presentableId=${data.presentableId}`,
    isDev: !!entry,
  };
  addWidgetConfig(id, widgetConfig);
  // TODO 所有插件加载用promise all
  // @ts-ignore
  const app = loadMicroApp(widgetConfig, {
    sandbox: {
      strictStyleIsolation: config ? !!config.shadowDom : false,
      experimentalStyleIsolation: config ? !!config.scopedCss : true,
    },
  });
  // const id2 = createId(sub.id + 1)
  // const app2 = loadMicroApp({
  //     container: widgetContainer2,
  //     name: id2,
  //     entry: '//localhost:7103'
  // }, { sandbox: { strictStyleIsolation: true, experimentalStyleIsolation: true } },);
  // addWidget(id2, app2);
  const _app = {
    ...app,
    mount: () => {
      app.mount();
      addWidget(id, app);
    },
    unmount: () => {
      app.unmount();
      deactiveWidget(id);
      setLocation();
    },
  };
  addWidget(id, _app);
  // TODO 拦截mount做处理
  return _app;
}
// 固定id 的加载子插件，仅支持加载一次
export function mountSubWidgets(parent: any, config?: any, resolve?: any) {
  const parentGlobal = sandBoxs.get("freelog-" + parent.data.presentableId)
    .proxy;
  // @ts-ignore
  // @ts-ignore
  // theme.subDeps.push({id:"60068f63973b31003a4fbf2a",name:"chtes/pubu",type:"resource",resourceType:"widget"})
  const promises: Promise<any>[] = [];
  // @ts-ignore
  parent.subDeps.forEach((sub) => {
    // 检测主题内部有没有这个插件，没有则不走这不
    // const tags = document.getElementsByName(sub.tagName)
    // if(!tags.length){
    //   return
    // }
    // {"id":"60068f63973b31003a4fbf2a","name":"chtes/pubu","type":"resource","resourceType":"image"}
    let url = resolveUrl(
      `${baseUrl}auths/presentables/${parent.entityNid}/fileStream`,
      {
        parentNid: parent.data.presentableId,
        subResourceIdOrName: sub.id,
      }
    );
    let isTest = false;
    if (
      window.location.href
        .replace("http://", "")
        .replace("https://", "")
        .indexOf("t.") === 0
    ) {
      isTest = true;
    }
    if (isTest)
      resolveUrl(
        `${baseUrl}auths/testResources/${parent.entityNid}/fileStream`,
        {
          parentNid: parent.data.presentableId,
          subEntityIdOrName: sub.id,
        }
      );

    switch (sub.resourceType) {
      case "widget":
        const subContainer = parentGlobal.document.getElementById(
          "freelog-" + sub.id
        );
        if (!subContainer) {
          console.error("container is not exists: " + sub.presentableName);
          return;
        }
        console.log("subContainer: ", subContainer);
        // @ts-ignore
        const app = window.freelogApp.mountWidget(
          sub,
          subContainer,
          {
            //@ts-ignore
            presentableId: window.freelogApp.nodeInfo.nodeThemeId,
            entityNid: parent.entityNid,
            subDependId: sub.id,
          },
          "",
          config
        );
        // setTimeout(app.unmount, 2000)
        // setTimeout(app.mount, 5000)
        // TODO 所有插件加载完成后 加载交给运行时子依赖的插件
        break;
      case "js": {
        break;
        promises.push(createScript(url));
      }
      case "css": {
        break;
        promises.push(createCssLink(url));
      }
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
export async function autoMoutSubWdigets(global: any, config?: any) {
  const presenbaleId = widgetsConfig.get(global.widgetName)?.id;
  // @ts-ignore
  const parent = await getSubDep(presenbaleId);
  mountSubWidgets(parent, config);
}
