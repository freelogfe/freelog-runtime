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

// src/single-spa/applications/app-errors.js
var app_errors_exports = {};
__export(app_errors_exports, {
  addErrorHandler: () => addErrorHandler,
  formatErrorMessage: () => formatErrorMessage,
  handleAppError: () => handleAppError,
  removeErrorHandler: () => removeErrorHandler,
  transformErr: () => transformErr
});
module.exports = __toCommonJS(app_errors_exports);
var import_app = require("./app.helpers");
var errorHandlers = [];
function handleAppError(err, app, newStatus) {
  const transformedErr = transformErr(err, app, newStatus);
  if (errorHandlers.length) {
    errorHandlers.forEach((handler) => handler(transformedErr));
  } else {
    setTimeout(() => {
      throw transformedErr;
    });
  }
}
function addErrorHandler(handler) {
  if (typeof handler !== "function") {
    throw Error(
      formatErrorMessage(
        28,
        window.__DEV__ && "a single-spa error handler must be a function"
      )
    );
  }
  errorHandlers.push(handler);
}
function removeErrorHandler(handler) {
  if (typeof handler !== "function") {
    throw Error(
      formatErrorMessage(
        29,
        window.__DEV__ && "a single-spa error handler must be a function"
      )
    );
  }
  let removedSomething = false;
  errorHandlers = errorHandlers.filter((h) => {
    const isHandler = h === handler;
    removedSomething = removedSomething || isHandler;
    return !isHandler;
  });
  return removedSomething;
}
function formatErrorMessage(code, msg, ...args) {
  return `single-spa minified message #${code}: ${msg ? msg + " " : ""}See https://single-spa.js.org/error/?code=${code}${args.length ? `&arg=${args.join("&arg=")}` : ""}`;
}
function transformErr(ogErr, appOrParcel, newStatus) {
  const errPrefix = `${(0, import_app.objectType)(appOrParcel)} '${(0, import_app.toName)(
    appOrParcel
  )}' died in status ${appOrParcel.status}: `;
  let result;
  if (ogErr instanceof Error) {
    try {
      ogErr.message = errPrefix + ogErr.message;
    } catch (err) {
    }
    result = ogErr;
  } else {
    console.warn(
      formatErrorMessage(
        30,
        window.__DEV__ && `While ${appOrParcel.status}, '${(0, import_app.toName)(
          appOrParcel
        )}' rejected its lifecycle function promise with a non-Error. This will cause stack traces to not be accurate.`,
        appOrParcel.status,
        (0, import_app.toName)(appOrParcel)
      )
    );
    try {
      result = Error(errPrefix + JSON.stringify(ogErr));
    } catch (err) {
      result = ogErr;
    }
  }
  result.appOrParcelName = (0, import_app.toName)(appOrParcel);
  appOrParcel.status = newStatus;
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addErrorHandler,
  formatErrorMessage,
  handleAppError,
  removeErrorHandler,
  transformErr
});
