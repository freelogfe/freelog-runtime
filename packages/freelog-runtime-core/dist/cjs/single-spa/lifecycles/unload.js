var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/single-spa/lifecycles/unload.js
var unload_exports = {};
__export(unload_exports, {
  addAppToUnload: () => addAppToUnload,
  getAppUnloadInfo: () => getAppUnloadInfo,
  toUnloadPromise: () => toUnloadPromise
});
module.exports = __toCommonJS(unload_exports);
var import_app_helpers = require("../applications/app.helpers.js");
var import_app_errors = require("../applications/app-errors.js");
var import_timeouts = require("../applications/timeouts.js");
var appsToUnload = {};
function toUnloadPromise(app) {
  return Promise.resolve().then(() => {
    const unloadInfo = appsToUnload[(0, import_app_helpers.toName)(app)];
    if (!unloadInfo) {
      return app;
    }
    if (app.status === import_app_helpers.NOT_LOADED) {
      finishUnloadingApp(app, unloadInfo);
      return app;
    }
    if (app.status === import_app_helpers.UNLOADING) {
      return unloadInfo.promise.then(() => app);
    }
    if (app.status !== import_app_helpers.NOT_MOUNTED) {
      return app;
    }
    app.status = import_app_helpers.UNLOADING;
    return (0, import_timeouts.reasonableTime)(app, "unload").then(() => {
      finishUnloadingApp(app, unloadInfo);
      return app;
    }).catch((err) => {
      errorUnloadingApp(app, unloadInfo, err);
      return app;
    });
  });
}
function finishUnloadingApp(app, unloadInfo) {
  delete appsToUnload[(0, import_app_helpers.toName)(app)];
  delete app.bootstrap;
  delete app.mount;
  delete app.unmount;
  delete app.unload;
  app.status = import_app_helpers.NOT_LOADED;
  unloadInfo.resolve();
}
function errorUnloadingApp(app, unloadInfo, err) {
  delete appsToUnload[(0, import_app_helpers.toName)(app)];
  delete app.bootstrap;
  delete app.mount;
  delete app.unmount;
  delete app.unload;
  (0, import_app_errors.handleAppError)(err, app, import_app_helpers.SKIP_BECAUSE_BROKEN);
  unloadInfo.reject(err);
}
function addAppToUnload(app, promiseGetter, resolve, reject) {
  appsToUnload[(0, import_app_helpers.toName)(app)] = { app, resolve, reject };
  Object.defineProperty(appsToUnload[(0, import_app_helpers.toName)(app)], "promise", {
    get: promiseGetter
  });
}
function getAppUnloadInfo(appName) {
  return appsToUnload[appName];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addAppToUnload,
  getAppUnloadInfo,
  toUnloadPromise
});
