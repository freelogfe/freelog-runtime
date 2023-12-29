import { startApp } from "wujie";
import { freelogApp } from "./freelogApp";
import { freelogAuth } from "./freelogAuth";
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

  const app = startApp({
    name,
    el: container,
    url: entry,
    props: {
      freelogApp,
      freelogAuth,
    },
  });
  console.log(app);
  addWidget(name, app);
  return app;
}
