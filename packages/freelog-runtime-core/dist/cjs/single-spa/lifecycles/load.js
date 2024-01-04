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

// src/single-spa/lifecycles/load.js
var load_exports = {};
__export(load_exports, {
  toLoadPromise: () => toLoadPromise
});
module.exports = __toCommonJS(load_exports);
var import_app_helpers = require("../applications/app.helpers.js");
var import_timeouts = require("../applications/timeouts.js");
var import_app_errors = require("../applications/app-errors.js");
var import_lifecycle_helpers = require("./lifecycle.helpers.js");
var import_prop_helpers = require("./prop.helpers.js");
var import_assign = require("../utils/assign.js");
function toLoadPromise(app) {
  return Promise.resolve().then(() => {
    if (app.loadPromise) {
      return app.loadPromise;
    }
    if (app.status !== import_app_helpers.NOT_LOADED && app.status !== import_app_helpers.LOAD_ERROR) {
      return app;
    }
    app.status = import_app_helpers.LOADING_SOURCE_CODE;
    let appOpts, isUserErr;
    return app.loadPromise = Promise.resolve().then(() => {
      const loadPromise = app.loadApp((0, import_prop_helpers.getProps)(app));
      if (!(0, import_lifecycle_helpers.smellsLikeAPromise)(loadPromise)) {
        isUserErr = true;
        throw Error(
          (0, import_app_errors.formatErrorMessage)(
            33,
            window.__DEV__ && `single-spa loading function did not return a promise. Check the second argument to registerApplication('${(0, import_app_helpers.toName)(
              app
            )}', loadingFunction, activityFunction)`,
            (0, import_app_helpers.toName)(app)
          )
        );
      }
      return loadPromise.then((val) => {
        app.loadErrorTime = null;
        appOpts = val;
        let validationErrMessage, validationErrCode;
        if (typeof appOpts !== "object") {
          validationErrCode = 34;
          if (window.__DEV__) {
            validationErrMessage = `does not export anything`;
          }
        }
        if (
          // ES Modules don't have the Object prototype
          Object.prototype.hasOwnProperty.call(appOpts, "bootstrap") && !(0, import_lifecycle_helpers.validLifecycleFn)(appOpts.bootstrap)
        ) {
          validationErrCode = 35;
          if (window.__DEV__) {
            validationErrMessage = `does not export a valid bootstrap function or array of functions`;
          }
        }
        if (!(0, import_lifecycle_helpers.validLifecycleFn)(appOpts.mount)) {
          validationErrCode = 36;
          if (window.__DEV__) {
            validationErrMessage = `does not export a bootstrap function or array of functions`;
          }
        }
        if (!(0, import_lifecycle_helpers.validLifecycleFn)(appOpts.unmount)) {
          validationErrCode = 37;
          if (window.__DEV__) {
            validationErrMessage = `does not export a bootstrap function or array of functions`;
          }
        }
        const type = (0, import_app_helpers.objectType)(appOpts);
        if (validationErrCode) {
          let appOptsStr;
          try {
            appOptsStr = JSON.stringify(appOpts);
          } catch {
          }
          console.error(
            (0, import_app_errors.formatErrorMessage)(
              validationErrCode,
              window.__DEV__ && `The loading function for single-spa ${type} '${(0, import_app_helpers.toName)(
                app
              )}' resolved with the following, which does not have bootstrap, mount, and unmount functions`,
              type,
              (0, import_app_helpers.toName)(app),
              appOptsStr
            ),
            appOpts
          );
          (0, import_app_errors.handleAppError)(validationErrMessage, app, import_app_helpers.SKIP_BECAUSE_BROKEN);
          return app;
        }
        if (appOpts.devtools && appOpts.devtools.overlays) {
          app.devtools.overlays = (0, import_assign.assign)(
            {},
            app.devtools.overlays,
            appOpts.devtools.overlays
          );
        }
        app.status = import_app_helpers.NOT_BOOTSTRAPPED;
        app.bootstrap = (0, import_lifecycle_helpers.flattenFnArray)(appOpts, "bootstrap");
        app.mount = (0, import_lifecycle_helpers.flattenFnArray)(appOpts, "mount");
        app.unmount = (0, import_lifecycle_helpers.flattenFnArray)(appOpts, "unmount");
        app.unload = (0, import_lifecycle_helpers.flattenFnArray)(appOpts, "unload");
        app.timeouts = (0, import_timeouts.ensureValidAppTimeouts)(appOpts.timeouts);
        delete app.loadPromise;
        return app;
      });
    }).catch((err) => {
      delete app.loadPromise;
      let newStatus;
      if (isUserErr) {
        newStatus = import_app_helpers.SKIP_BECAUSE_BROKEN;
      } else {
        newStatus = import_app_helpers.LOAD_ERROR;
        app.loadErrorTime = (/* @__PURE__ */ new Date()).getTime();
      }
      (0, import_app_errors.handleAppError)(err, app, newStatus);
      return app;
    });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  toLoadPromise
});
