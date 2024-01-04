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

// src/single-spa/parcels/mount-parcel.js
var mount_parcel_exports = {};
__export(mount_parcel_exports, {
  mountParcel: () => mountParcel,
  mountRootParcel: () => mountRootParcel
});
module.exports = __toCommonJS(mount_parcel_exports);
var import_lifecycle_helpers = require("../lifecycles/lifecycle.helpers.js");
var import_app_helpers = require("../applications/app.helpers.js");
var import_bootstrap = require("../lifecycles/bootstrap.js");
var import_mount = require("../lifecycles/mount.js");
var import_update = require("../lifecycles/update.js");
var import_unmount = require("../lifecycles/unmount.js");
var import_timeouts = require("../applications/timeouts.js");
var import_app_errors = require("../applications/app-errors.js");
var parcelCount = 0;
var rootParcels = { parcels: {} };
function mountRootParcel() {
  return mountParcel.apply(rootParcels, arguments);
}
function mountParcel(config, customProps) {
  const owningAppOrParcel = this;
  var name = config.name || "";
  if (!config || typeof config !== "object" && typeof config !== "function") {
    throw Error(
      (0, import_app_errors.formatErrorMessage)(
        2,
        window.__DEV__ && "Cannot mount parcel without a config object or config loading function"
      )
    );
  }
  if (config.name && typeof config.name !== "string") {
    throw Error(
      (0, import_app_errors.formatErrorMessage)(
        3,
        window.__DEV__ && `Parcel name must be a string, if provided. Was given ${typeof config.name}`,
        typeof config.name
      )
    );
  }
  if (typeof customProps !== "object") {
    throw Error(
      (0, import_app_errors.formatErrorMessage)(
        4,
        window.__DEV__ && `Parcel ${name} has invalid customProps -- must be an object but was given ${typeof customProps}`,
        name,
        typeof customProps
      )
    );
  }
  if (!customProps.domElement) {
    throw Error(
      (0, import_app_errors.formatErrorMessage)(
        5,
        window.__DEV__ && `Parcel ${name} cannot be mounted without a domElement provided as a prop`,
        name
      )
    );
  }
  const id = parcelCount++;
  const passedConfigLoadingFunction = typeof config === "function";
  const configLoadingFunction = passedConfigLoadingFunction ? config : () => Promise.resolve(config);
  const parcel = {
    id,
    parcels: {},
    status: passedConfigLoadingFunction ? import_app_helpers.LOADING_SOURCE_CODE : import_app_helpers.NOT_BOOTSTRAPPED,
    customProps,
    parentName: (0, import_app_helpers.toName)(owningAppOrParcel),
    unmountThisParcel() {
      if (parcel.status !== import_app_helpers.MOUNTED) {
        throw Error(
          (0, import_app_errors.formatErrorMessage)(
            6,
            window.__DEV__ && `Cannot unmount parcel '${name}' -- it is in a ${parcel.status} status`,
            name,
            parcel.status
          )
        );
      }
      return (0, import_unmount.toUnmountPromise)(parcel, true).then((value) => {
        if (parcel.parentName) {
          delete owningAppOrParcel.parcels[parcel.id];
        }
        return value;
      }).then((value) => {
        resolveUnmount(value);
        return value;
      }).catch((err) => {
        parcel.status = import_app_helpers.SKIP_BECAUSE_BROKEN;
        rejectUnmount(err);
        throw err;
      });
    }
  };
  let externalRepresentation;
  owningAppOrParcel.parcels[id] = parcel;
  let loadPromise = configLoadingFunction();
  if (!loadPromise || typeof loadPromise.then !== "function") {
    throw Error(
      (0, import_app_errors.formatErrorMessage)(
        7,
        window.__DEV__ && `When mounting a parcel, the config loading function must return a promise that resolves with the parcel config`
      )
    );
  }
  loadPromise = loadPromise.then((config2) => {
    if (!config2) {
      throw Error(
        (0, import_app_errors.formatErrorMessage)(
          8,
          window.__DEV__ && `When mounting a parcel, the config loading function returned a promise that did not resolve with a parcel config`
        )
      );
    }
    const name2 = config2.name || `parcel-${id}`;
    if (
      // ES Module objects don't have the object prototype
      Object.prototype.hasOwnProperty.call(config2, "bootstrap") && !(0, import_lifecycle_helpers.validLifecycleFn)(config2.bootstrap)
    ) {
      throw Error(
        (0, import_app_errors.formatErrorMessage)(
          9,
          window.__DEV__ && `Parcel ${name2} provided an invalid bootstrap function`,
          name2
        )
      );
    }
    if (!(0, import_lifecycle_helpers.validLifecycleFn)(config2.mount)) {
      throw Error(
        (0, import_app_errors.formatErrorMessage)(
          10,
          window.__DEV__ && `Parcel ${name2} must have a valid mount function`,
          name2
        )
      );
    }
    if (!(0, import_lifecycle_helpers.validLifecycleFn)(config2.unmount)) {
      throw Error(
        (0, import_app_errors.formatErrorMessage)(
          11,
          window.__DEV__ && `Parcel ${name2} must have a valid unmount function`,
          name2
        )
      );
    }
    if (config2.update && !(0, import_lifecycle_helpers.validLifecycleFn)(config2.update)) {
      throw Error(
        (0, import_app_errors.formatErrorMessage)(
          12,
          window.__DEV__ && `Parcel ${name2} provided an invalid update function`,
          name2
        )
      );
    }
    const bootstrap = (0, import_lifecycle_helpers.flattenFnArray)(config2, "bootstrap");
    const mount = (0, import_lifecycle_helpers.flattenFnArray)(config2, "mount");
    const unmount = (0, import_lifecycle_helpers.flattenFnArray)(config2, "unmount");
    parcel.status = import_app_helpers.NOT_BOOTSTRAPPED;
    parcel.name = name2;
    parcel.bootstrap = bootstrap;
    parcel.mount = mount;
    parcel.unmount = unmount;
    parcel.timeouts = (0, import_timeouts.ensureValidAppTimeouts)(config2.timeouts);
    if (config2.update) {
      parcel.update = (0, import_lifecycle_helpers.flattenFnArray)(config2, "update");
      externalRepresentation.update = function(customProps2) {
        parcel.customProps = customProps2;
        return promiseWithoutReturnValue((0, import_update.toUpdatePromise)(parcel));
      };
    }
  });
  const bootstrapPromise = loadPromise.then(
    () => (0, import_bootstrap.toBootstrapPromise)(parcel, true)
  );
  const mountPromise = bootstrapPromise.then(
    () => (0, import_mount.toMountPromise)(parcel, true)
  );
  let resolveUnmount, rejectUnmount;
  const unmountPromise = new Promise((resolve, reject) => {
    resolveUnmount = resolve;
    rejectUnmount = reject;
  });
  externalRepresentation = {
    mount() {
      return promiseWithoutReturnValue(
        Promise.resolve().then(() => {
          if (parcel.status !== import_app_helpers.NOT_MOUNTED) {
            throw Error(
              (0, import_app_errors.formatErrorMessage)(
                13,
                window.__DEV__ && `Cannot mount parcel '${name}' -- it is in a ${parcel.status} status`,
                name,
                parcel.status
              )
            );
          }
          owningAppOrParcel.parcels[id] = parcel;
          return (0, import_mount.toMountPromise)(parcel);
        })
      );
    },
    unmount() {
      return promiseWithoutReturnValue(parcel.unmountThisParcel());
    },
    getStatus() {
      return parcel.status;
    },
    loadPromise: promiseWithoutReturnValue(loadPromise),
    bootstrapPromise: promiseWithoutReturnValue(bootstrapPromise),
    mountPromise: promiseWithoutReturnValue(mountPromise),
    unmountPromise: promiseWithoutReturnValue(unmountPromise)
  };
  return externalRepresentation;
}
function promiseWithoutReturnValue(promise) {
  return promise.then(() => null);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mountParcel,
  mountRootParcel
});
