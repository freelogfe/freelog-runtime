import frequest from "../../services/handler";
import node from "../../services/api/modules/node";
import { createScript, createCssLink, resolveUrl } from "./utils";
import { getInfoById } from "./api";
import { baseUrl } from "../../services/base";
import { freelogApp } from "./global";
import { init } from "./api";
import { dev, DEV_FALSE, DEV_TYPE_REPLACE, DEV_WIDGET } from "./dev";
import { sandBoxs, flatternWidgets } from "./widget";
// @ts-ignore  TODO 需要控制不可改变
window.freelogApp = freelogApp;
export function initNode() {
  /**
   * 1.resolveUrl
   * 2.requestNodeInfo
   * 3.requestTheme
   * TODO  error resolve
   * TODO title 问题
   */
  let isTest = false;
  if (
    window.location.href
      .replace("http://", "")
      .replace("https://", "")
      .indexOf("t.") === 0
  ) {
    isTest = true;
  }
  console.log(234234234234)
  return new Promise<void>(async (resolve) => {
    const nodeDomain = await getDomain(window.location.host);
    const nodeData = await requestNodeInfo(nodeDomain);
    const nodeInfo = nodeData.data;
    // @ts-ignore
    freelogApp.nodeInfo = nodeInfo;
    init();
    const devData = dev();
    freelogApp.devData = devData;
    const container = document.getElementById("freelog-plugin-container");
    if (devData.type === DEV_WIDGET) {
      freelogApp.mountWidget("", container, "");
      return;
    }
    // @ts-ignore
    const theme = await requestTheme(nodeInfo.nodeThemeId);
    const themeApp = freelogApp.mountWidget(
      { id: theme.data.presentableId, name: theme.data.presentableName },
      container,
      {
        presentableId: theme.data.presentableId,
        entityNid: "",
        subDependId: theme.data.presentableId,
        isTheme: true,
      }
    );
    new Promise<void>((resolve) => {
      const inter = setInterval(() => {
        console.log(themeApp)
        if (themeApp.getStatus() === "MOUNTED") {
          clearInterval(inter)
          resolve && resolve();

        }
      }, 200);
    }).then(() => {
      const themeGlobal = sandBoxs.get('freelog-' + theme.data.presentableId).proxy
      // @ts-ignore
      // @ts-ignore
      // theme.subDeps.push({id:"60068f63973b31003a4fbf2a",name:"chtes/pubu",type:"resource",resourceType:"widget"})
      const promises: Promise<any>[] = [];
      // @ts-ignore
      theme.subDeps.forEach((sub) => {
        // 检测主题内部有没有这个插件，没有则不走这不
        // const tags = document.getElementsByName(sub.tagName)
        // if(!tags.length){
        //   return
        // }
        // {"id":"60068f63973b31003a4fbf2a","name":"chtes/pubu","type":"resource","resourceType":"image"}
        let url = resolveUrl(
          `${baseUrl}auths/presentables/${theme.entityNid}/fileStream`,
          { parentNid: nodeInfo.nodeThemeId, subResourceIdOrName: sub.id }
        );
        if (isTest)
          resolveUrl(
            `${baseUrl}auths/testResources/${theme.entityNid}/fileStream`,
            { parentNid: nodeInfo.nodeThemeId, subEntityIdOrName: sub.id }
          );

        switch (sub.resourceType) {
          case "widget":
            /**
          / *  {
                container: container,
                name: 'purehtml',//id
                widgetName: sub.name,
                id: sub.id,
                entry: '//localhost:7104'
              }
              step:包装以下三步，子插件加载时需要用
                 
                 1.const id = createId
                 3.loadMicroApp
           */
            // let entry = ''
            // if(devData.type === DEV_TYPE_REPLACE){
            //   entry = devData.params[sub.id] || ''
            // }
            const subContainer = themeGlobal.document.getElementById('freelog-' + sub.id);
            console.log(234234234234, subContainer)
            const app = freelogApp.mountWidget(sub, subContainer, {
              presentableId: nodeInfo.nodeThemeId,
              entityNid: theme.entityNid,
              subDependId: sub.id,
            });
            console.log(app)
            // setTimeout(app.unmount, 2000)
            // setTimeout(app.mount, 5000)
            // TODO 所有插件加载完成后 加载交给运行时子依赖的插件
            break;
          case "js": {
            promises.push(createScript(url));
            break;
          }
          case "css": {
            promises.push(createCssLink(url));
            break;
          }
          default: {
          }
        }
      });
      let count = promises.length;
      if (count === 0) {
        resolve();
      } else {
        for (const p of promises) {
          p.finally(() => {
            count--;
            if (count === 0) {
              resolve();
            }
          });
        }
      }
    });
  });
}

function getDomain(url: string) {
  return url.split(".")[0];
}

async function requestNodeInfo(nodeDomain: string) {
  let info = await frequest(node.getInfoByNameOrDomain, "", { nodeDomain });
  return info.data;
}
// TODO if error
async function requestTheme(nodeThemeId: string) {
  let info = await getInfoById(nodeThemeId);
  const [subDeps, entityNid] = [
    info.headers["freelog-sub-dependencies"],
    info.headers["freelog-entity-nid"],
  ];
  console.log(info);
  return {
    subDeps: subDeps ? JSON.parse(decodeURIComponent(subDeps)) : [],
    entityNid,
    data: info.data.data,
  };
}
