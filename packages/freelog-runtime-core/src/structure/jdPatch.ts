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
  removeDomScope,
  unmountApp,
  unmountAllApps,
  reload,
} from "@micro-zoe/micro-app";

import microApp from "@micro-zoe/micro-app";
export function dev(): any {}


/**
 * 1.通信支持传递data
 * window.microApp.getData()
 * 
 * 
 **/ 
