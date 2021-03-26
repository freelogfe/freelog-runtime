import frequest from "../../services/handler";
import node from "../../services/api/modules/node";
import { createScript, createCssLink, resolveUrl, getSubDep } from "./utils";
import { baseUrl } from "../../services/base";
import { freelogApp } from "./global";
import { init } from "./api";
import { dev, DEV_FALSE, DEV_TYPE_REPLACE, DEV_WIDGET } from "./dev";
import { mountSubWidgets, sandBoxs, flatternWidgets } from "./widget";
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
    const theme = await getSubDep(nodeInfo.nodeThemeId);
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
      mountSubWidgets(theme, true, resolve)
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

