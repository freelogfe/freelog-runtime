import {
  createHistoryProxy,
  createFreelogAppProxy,
  createLocationProxy,
  createDocumentProxy,
  createWidgetProxy,
  freelogLocalStorage,
  getPublicPath,
  freelogAddEventListener,
  isFreelogAuth,
  ajaxProxy,
} from "./proxy";
const rawWindow = window;
const getHooks: Map<string, any> = new Map();
getHooks.set("fetch", (name: any) => ajaxProxy("fetch", name));
getHooks.set("XMLHttpRequest", (name: any) =>
  ajaxProxy("XMLHttpRequest", name)
);
getHooks.set("freelogAuth", (name: any) => {
  if (isFreelogAuth(name)) {
    return rawWindow.freelogAuth;
  }
  return false;
});

getHooks.set("__INJECTED_PUBLIC_PATH_BY_FREELOG__", getPublicPath);

getHooks.set("addEventListener", () => freelogAddEventListener);
getHooks.set("freelogApp", createFreelogAppProxy);
getHooks.set("widgetName", (name: any) => name);
getHooks.set("history", createHistoryProxy);
getHooks.set("childWidgets", createWidgetProxy);
getHooks.set("location", createLocationProxy);
getHooks.set("localStorage", freelogLocalStorage);
getHooks.set("document", createDocumentProxy);

export default getHooks;
