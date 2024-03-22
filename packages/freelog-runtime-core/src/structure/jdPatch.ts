// 主应用是授权UI， 需要把api转给主题，以及加载子插件的插件也需要 对其子插件进行操作
//   getAllApps,
//   getActiveApps,
//   removeDomScope,
//   unmountApp,
//   unmountAllApps,
//   reload,
// microApp.setData  microApp.getData  microApp.addDataListener  mciroApp.removeDataListener  microApp.clearDataListener
// microApp.setGlobalData microApp.getGlobalData   mciroApp.addGlobalDataListener  mciroApp.removeGlobalDataListener mciroApp.clearGlobalDataListener
import {
  getAllApps,
  getActiveApps,
  // removeDomScope,
  // unmountApp,
  // unmountAllApps,
  // reload,
} from "@micro-zoe/micro-app";

import microApp from "@micro-zoe/micro-app";
import { childWidgets } from "./widget";

export const getActiveWidget = function(
  name: string,
  options: {
    excludeHiddenApp?: boolean;
    excludePreRender?: boolean;
  }
) {
  const apps = getActiveApps(options);
  const widgets = childWidgets.get(name) || [];
  return apps.filter((id: string) => widgets.some((id2: string) => id === id2));
};
export const getAllWidget = function(name: string, ...rest: any) {
  const apps = getAllApps();
  const widgets = childWidgets.get(name) || [];
  return apps.filter((id: string) => widgets.some((id2: string) => id === id2));
};
/**
 * 当前情况是授权UI作为主应用，但加载子插件的主题或插件 需要作为主应用行权，
 * 1.全局通信 microApp.setGlobalData microApp.getGlobalData   mciroApp.addGlobalDataListener  mciroApp.removeGlobalDataListener mciroApp.clearGlobalDataListener
 * 2.父子数据传递通信  直接传递  子使用 microApp.getData获取
 * 3.父子发布订阅通信 microApp.setData microApp.dispatch microApp.addDataListener  mciroApp.removeDataListener  microApp.clearDataListener
 *
 * 当前情况，主题无法使用 microApp.setData 来发布数据，
 *    发送数据给子应用 my-app，setData第二个参数只接受对象类型
 *    microApp.setData('my-app', {type: '新的数据'})
 *
 * 综上解决办法：
 *     1.运行时提供
 **/
/**
 * 以下API
 * getAllApps,
   getActiveApps,
   unmountApp,
   unmountAllApps,
   reload,
   情况1： 主题可以操作所有
   情况2： 子插件只能由上级父插件来操作
 */
