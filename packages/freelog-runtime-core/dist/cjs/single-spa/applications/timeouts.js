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

// src/single-spa/applications/timeouts.js
var timeouts_exports = {};
__export(timeouts_exports, {
  ensureValidAppTimeouts: () => ensureValidAppTimeouts,
  reasonableTime: () => reasonableTime,
  setBootstrapMaxTime: () => setBootstrapMaxTime,
  setMountMaxTime: () => setMountMaxTime,
  setUnloadMaxTime: () => setUnloadMaxTime,
  setUnmountMaxTime: () => setUnmountMaxTime
});
module.exports = __toCommonJS(timeouts_exports);
var import_assign = require("../utils/assign");
var import_prop = require("../lifecycles/prop.helpers");
var import_app = require("./app.helpers");
var import_app_errors = require("./app-errors");
var defaultWarningMillis = 1e3;
var globalTimeoutConfig = {
  bootstrap: {
    millis: 4e3,
    dieOnTimeout: false,
    warningMillis: defaultWarningMillis
  },
  mount: {
    millis: 3e3,
    dieOnTimeout: false,
    warningMillis: defaultWarningMillis
  },
  unmount: {
    millis: 3e3,
    dieOnTimeout: false,
    warningMillis: defaultWarningMillis
  },
  unload: {
    millis: 3e3,
    dieOnTimeout: false,
    warningMillis: defaultWarningMillis
  },
  update: {
    millis: 3e3,
    dieOnTimeout: false,
    warningMillis: defaultWarningMillis
  }
};
function setBootstrapMaxTime(time, dieOnTimeout, warningMillis) {
  if (typeof time !== "number" || time <= 0) {
    throw Error(
      (0, import_app_errors.formatErrorMessage)(
        16,
        window.__DEV__ && `bootstrap max time must be a positive integer number of milliseconds`
      )
    );
  }
  globalTimeoutConfig.bootstrap = {
    millis: time,
    dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis
  };
}
function setMountMaxTime(time, dieOnTimeout, warningMillis) {
  if (typeof time !== "number" || time <= 0) {
    throw Error(
      (0, import_app_errors.formatErrorMessage)(
        17,
        window.__DEV__ && `mount max time must be a positive integer number of milliseconds`
      )
    );
  }
  globalTimeoutConfig.mount = {
    millis: time,
    dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis
  };
}
function setUnmountMaxTime(time, dieOnTimeout, warningMillis) {
  if (typeof time !== "number" || time <= 0) {
    throw Error(
      (0, import_app_errors.formatErrorMessage)(
        18,
        window.__DEV__ && `unmount max time must be a positive integer number of milliseconds`
      )
    );
  }
  globalTimeoutConfig.unmount = {
    millis: time,
    dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis
  };
}
function setUnloadMaxTime(time, dieOnTimeout, warningMillis) {
  if (typeof time !== "number" || time <= 0) {
    throw Error(
      (0, import_app_errors.formatErrorMessage)(
        19,
        window.__DEV__ && `unload max time must be a positive integer number of milliseconds`
      )
    );
  }
  globalTimeoutConfig.unload = {
    millis: time,
    dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis
  };
}
function reasonableTime(appOrParcel, lifecycle) {
  const timeoutConfig = appOrParcel.timeouts[lifecycle];
  const warningPeriod = timeoutConfig.warningMillis;
  const type = (0, import_app.objectType)(appOrParcel);
  return new Promise((resolve, reject) => {
    let finished = false;
    let errored = false;
    appOrParcel[lifecycle]((0, import_prop.getProps)(appOrParcel)).then((val) => {
      finished = true;
      resolve(val);
    }).catch((val) => {
      finished = true;
      reject(val);
    });
    setTimeout(() => maybeTimingOut(1), warningPeriod);
    setTimeout(() => maybeTimingOut(true), timeoutConfig.millis);
    const errMsg = (0, import_app_errors.formatErrorMessage)(
      31,
      window.__DEV__ && `Lifecycle function ${lifecycle} for ${type} ${(0, import_app.toName)(
        appOrParcel
      )} lifecycle did not resolve or reject for ${timeoutConfig.millis} ms.`,
      lifecycle,
      type,
      (0, import_app.toName)(appOrParcel),
      timeoutConfig.millis
    );
    function maybeTimingOut(shouldError) {
      if (!finished) {
        if (shouldError === true) {
          errored = true;
          if (timeoutConfig.dieOnTimeout) {
            reject(Error(errMsg));
          } else {
            console.error(errMsg);
          }
        } else if (!errored) {
          const numWarnings = shouldError;
          const numMillis = numWarnings * warningPeriod;
          console.warn(errMsg);
          if (numMillis + warningPeriod < timeoutConfig.millis) {
            setTimeout(() => maybeTimingOut(numWarnings + 1), warningPeriod);
          }
        }
      }
    }
  });
}
function ensureValidAppTimeouts(timeouts) {
  const result = {};
  for (let key in globalTimeoutConfig) {
    result[key] = (0, import_assign.assign)(
      {},
      globalTimeoutConfig[key],
      timeouts && timeouts[key] || {}
    );
  }
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ensureValidAppTimeouts,
  reasonableTime,
  setBootstrapMaxTime,
  setMountMaxTime,
  setUnloadMaxTime,
  setUnmountMaxTime
});
