import frequest from "../../services/handler";
import node from "../../services/api/modules/node";
import presentable from '../../services/api/modules/presentable';

import { getSubDep, getUserInfo } from "./utils";
import { freelogApp } from "./global";
import { init } from "./api";
import { dev, DEV_WIDGET } from "./dev";
import { LOGIN } from '../../bridge/event'
import { addAuth } from '../../bridge/index'
import { pathATag, initLocation } from './proxy'
import { ConsoleSqlOutlined } from "@ant-design/icons";
// @ts-ignore  TODO 需要控制不可改变
window.freelogApp = freelogApp;

export function initNode() {
  pathATag()
  /**
   * 1.resolveUrl
   * 2.requestNodeInfo
   * 3.requestTheme
   * TODO  error resolve
   * TODO title 问题
   */

  return new Promise<void>(async (resolve) => {
    const nodeDomain = await getDomain(window.location.host);
    let nodeData = await requestNodeInfo(nodeDomain);
    if (nodeData.errCode === 30) {
      await new Promise((resolve, reject) => {
        addAuth.bind({ name: 'node', event: LOGIN })('', resolve, reject, { immediate: true })
      })
      nodeData = await requestNodeInfo(nodeDomain);
    }
    const nodeInfo = nodeData.data;
    // @ts-ignore
    freelogApp.nodeInfo = nodeInfo;
    document.title = nodeInfo.nodeName
    init();
    const devData = dev();
    // TODO 深度克隆
    freelogApp.devData = { ...devData };
    Object.freeze(freelogApp)
    initLocation();
    await getUserInfo()
    // TODO 如果没有主题，需要提醒先签约主题才行，意味着开发主题需要先建一个节点和主题并签约
    // @ts-ignore
    const container = document.getElementById("freelog-plugin-container");
    // if (devData.type === DEV_WIDGET) {
    //   freelogApp.mountWidget("", container, {presentableId: nodeInfo.nodeThemeId, isTheme: true,}, "", {shadowDom: false,scopedCss: true});
    //   return;
    // frequest(
    //   presentable.getPresentableDetail,
    //   [presentableId],
    //   query
    // ) 
    // }  
    // @ts-ignore
    const theme = await getSubDep.bind({ name: "freelog-" + nodeInfo.nodeThemeId, presentableId: nodeInfo.nodeThemeId })(nodeInfo.nodeThemeId);
    // @ts-ignore
    console.log(theme.headers)
    freelogApp.mountWidget(
      theme.data,
      container,
      "",
      { shadowDom: false, scopedCss: true, ...theme.properties },
      0,
      true
    );
    // new Promise<void>((resolve) => {
    //   let count = 0
    //   const inter = setInterval(() => {
    //     count++
    //     if (themeApp.getStatus() === "MOUNTED" || count === 25) {
    //       clearInterval(inter)
    //       resolve && resolve();
    //     }
    //   }, 200);
    // }).then(() => {
    //   mountSubWidgets(theme, true, resolve)
    // });
  });
}

function getDomain(url: string) {
  if (url.split(".")[0] === 't') {
    return url.split(".")[1]
  }
  return url.split(".")[0];
}

async function requestNodeInfo(nodeDomain: string) {
  let info = await frequest.bind({ name: 'node' })(node.getInfoByNameOrDomain, "", { nodeDomain });
  return info.data;
}

