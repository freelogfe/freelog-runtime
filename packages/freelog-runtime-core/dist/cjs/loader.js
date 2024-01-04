var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/loader.ts
var loader_exports = {};
__export(loader_exports, {
  loadApp: () => loadApp
});
module.exports = __toCommonJS(loader_exports);
var import_import_html_entry = require("./import-html-entry");
var import_lodash_es = require("lodash-es");
var import_addons = __toESM(require("./addons"));
var import_globalState = require("./globalState");
var import_sandbox = require("./sandbox");
var import_utils = require("./utils");
function assertElementExist(element, msg) {
  if (!element) {
    if (msg) {
      throw new Error(msg);
    }
    throw new Error("[freelog] element not existed!");
  }
}
function execHooksChain(hooks, app, global = window) {
  if (hooks.length) {
    return hooks.reduce((chain, hook) => chain.then(() => hook(app, global)), Promise.resolve());
  }
  return Promise.resolve();
}
async function validateSingularMode(validate, app) {
  return typeof validate === "function" ? validate(app) : !!validate;
}
var supportShadowDOM = document.head.attachShadow || document.head.createShadowRoot;
function createElement(appContent, strictStyleIsolation, scopedCSS, appName) {
  const containerElement = document.createElement("div");
  containerElement.innerHTML = appContent;
  const appElement = containerElement.firstChild;
  if (strictStyleIsolation) {
    if (!supportShadowDOM) {
      console.warn(
        "[freelog]: As current browser not support shadow dom, your strictStyleIsolation configuration will be ignored!"
      );
    } else {
      const { innerHTML } = appElement;
      appElement.innerHTML = "";
      let shadow;
      if (appElement.attachShadow) {
        shadow = appElement.attachShadow({ mode: "open" });
      } else {
        shadow = appElement.createShadowRoot();
      }
      shadow.innerHTML = innerHTML;
    }
  }
  appElement.setAttribute("style", "width: 100%; height: 100%; position: relative;z-index:1;");
  if (scopedCSS) {
    const attr = appElement.getAttribute(import_sandbox.css.FreelogCSSRewriteAttr);
    if (!attr) {
      appElement.setAttribute(import_sandbox.css.FreelogCSSRewriteAttr, appName);
    }
    const styleNodes = appElement.querySelectorAll("style") || [];
    (0, import_lodash_es.forEach)(styleNodes, (stylesheetElement) => {
      import_sandbox.css.process(appElement, stylesheetElement, appName);
    });
  }
  return appElement;
}
function getAppWrapperGetter(appName, appInstanceId, useLegacyRender, strictStyleIsolation, scopedCSS, elementGetter) {
  return () => {
    if (useLegacyRender) {
      if (strictStyleIsolation)
        throw new Error("[freelog]: strictStyleIsolation can not be used with legacy render!");
      if (scopedCSS)
        throw new Error("[freelog]: experimentalStyleIsolation can not be used with legacy render!");
      const appWrapper = document.getElementById.bind(document)((0, import_utils.getWrapperId)(appInstanceId));
      assertElementExist(
        appWrapper,
        `[freelog] Wrapper element for ${appName} with instance ${appInstanceId} is not existed!`
      );
      return appWrapper;
    }
    const element = elementGetter();
    assertElementExist(
      element,
      `[freelog] Wrapper element for ${appName} with instance ${appInstanceId} is not existed!`
    );
    if (strictStyleIsolation) {
      return element.shadowRoot;
    }
    return element;
  };
}
var rawAppendChild = HTMLElement.prototype.appendChild;
var rawRemoveChild = HTMLElement.prototype.removeChild;
function getRender(appName, appContent, legacyRender) {
  const render = ({ element, loading, container }, phase) => {
    if (legacyRender) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[freelog] Custom rendering function is deprecated, you can use the container element setting instead!"
        );
      }
      return legacyRender({ loading, appContent: element ? appContent : "" });
    }
    const containerElement = (0, import_utils.getContainer)(container);
    if (phase !== "unmounted") {
      const errorMsg = (() => {
        switch (phase) {
          case "loading":
          case "mounting":
            return `[freelog] Target container with ${container} not existed while ${appName} ${phase}!`;
          case "mounted":
            return `[freelog] Target container with ${container} not existed after ${appName} ${phase}!`;
          default:
            return `[freelog] Target container with ${container} not existed while ${appName} rendering!`;
        }
      })();
      assertElementExist(containerElement, errorMsg);
    }
    if (containerElement && !containerElement.contains(element)) {
      while (containerElement.firstChild) {
        rawRemoveChild.call(containerElement, containerElement.firstChild);
      }
      if (element) {
        rawAppendChild.call(containerElement, element);
      }
    }
    return void 0;
  };
  return render;
}
function getLifecyclesFromExports(scriptExports, appName, global, globalLatestSetProp) {
  if ((0, import_utils.validateExportLifecycle)(scriptExports)) {
    return scriptExports;
  }
  if (globalLatestSetProp) {
    const lifecycles = global[globalLatestSetProp];
    if ((0, import_utils.validateExportLifecycle)(lifecycles)) {
      return lifecycles;
    }
  }
  if (process.env.NODE_ENV === "development") {
    console.warn(
      `[freelog] lifecycle not found from ${appName} entry exports, fallback to get from window['${appName}']`
    );
  }
  const globalVariableExports = global[appName];
  if ((0, import_utils.validateExportLifecycle)(globalVariableExports)) {
    return globalVariableExports;
  }
  throw new Error(`[freelog] You need to export lifecycle functions in ${appName} entry`);
}
var prevAppUnmountedDeferred;
async function loadApp(app, configuration = {}, lifeCycles) {
  var _a;
  const { entry, name: appName } = app;
  const appInstanceId = `${appName}_${+/* @__PURE__ */ new Date()}_${Math.floor(Math.random() * 1e3)}`;
  const markName = `[freelog] App ${appInstanceId} Loading`;
  if (process.env.NODE_ENV === "development") {
    (0, import_utils.performanceMark)(markName);
  }
  const { singular = false, sandbox = true, excludeAssetFilter, proxyHooks, ...importEntryOpts } = configuration;
  const { template, execScripts, assetPublicPath } = await (0, import_import_html_entry.importEntry)(entry, importEntryOpts);
  if (await validateSingularMode(singular, app)) {
    await (prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise);
  }
  const appContent = (0, import_utils.getDefaultTplWrapper)(appInstanceId, appName)(template);
  const strictStyleIsolation = typeof sandbox === "object" && !!sandbox.strictStyleIsolation;
  const scopedCSS = (0, import_utils.isEnableScopedCSS)(sandbox);
  let initialAppWrapperElement = createElement(
    appContent,
    strictStyleIsolation,
    scopedCSS,
    appName
  );
  const initialContainer = "container" in app ? app.container : void 0;
  const legacyRender = "render" in app ? app.render : void 0;
  const render = getRender(appName, appContent, legacyRender);
  render({ element: initialAppWrapperElement, loading: true, container: initialContainer }, "loading");
  const initialAppWrapperGetter = getAppWrapperGetter(
    appName,
    appInstanceId,
    !!legacyRender,
    strictStyleIsolation,
    scopedCSS,
    () => initialAppWrapperElement
  );
  let global = window;
  let mountSandbox = () => Promise.resolve();
  let unmountSandbox = () => Promise.resolve();
  const useLooseSandbox = typeof sandbox === "object" && !!sandbox.loose;
  let sandboxContainer;
  if (sandbox) {
    sandboxContainer = (0, import_sandbox.createSandboxContainer)(
      appName,
      // FIXME should use a strict sandbox logic while remount, see https://github.com/umijs/freelog/issues/518
      initialAppWrapperGetter,
      scopedCSS,
      useLooseSandbox,
      excludeAssetFilter,
      proxyHooks
    );
    global = sandboxContainer.instance.proxy;
    mountSandbox = sandboxContainer.mount;
    unmountSandbox = sandboxContainer.unmount;
  }
  const { beforeUnmount = [], afterUnmount = [], afterMount = [], beforeMount = [], beforeLoad = [] } = (0, import_lodash_es.mergeWith)(
    {},
    (0, import_addons.default)(global, assetPublicPath),
    lifeCycles,
    (v1, v2) => (0, import_lodash_es.concat)(v1 ?? [], v2 ?? [])
  );
  await execHooksChain((0, import_utils.toArray)(beforeLoad), app, global);
  const scriptExports = await execScripts(global, !useLooseSandbox);
  const { bootstrap, mount, unmount, update } = getLifecyclesFromExports(
    scriptExports,
    appName,
    global,
    (_a = sandboxContainer == null ? void 0 : sandboxContainer.instance) == null ? void 0 : _a.latestSetProp
  );
  const {
    onGlobalStateChange,
    setGlobalState,
    offGlobalStateChange
  } = (0, import_globalState.getMicroAppStateActions)(appInstanceId);
  const syncAppWrapperElement2Sandbox = (element) => initialAppWrapperElement = element;
  const parcelConfigGetter = (remountContainer = initialContainer) => {
    let appWrapperElement = initialAppWrapperElement;
    const appWrapperGetter = getAppWrapperGetter(
      appName,
      appInstanceId,
      !!legacyRender,
      strictStyleIsolation,
      scopedCSS,
      () => appWrapperElement
    );
    const parcelConfig = {
      name: appInstanceId,
      bootstrap,
      mount: [
        async () => {
          if (process.env.NODE_ENV === "development") {
            const marks = (0, import_utils.performanceGetEntriesByName)(markName, "mark");
            if (marks && !marks.length) {
              (0, import_utils.performanceMark)(markName);
            }
          }
        },
        async () => {
          if (await validateSingularMode(singular, app) && prevAppUnmountedDeferred) {
            return prevAppUnmountedDeferred.promise;
          }
          return void 0;
        },
        // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
        async () => {
          const useNewContainer = remountContainer !== initialContainer;
          if (useNewContainer || !appWrapperElement) {
            appWrapperElement = createElement(appContent, strictStyleIsolation, scopedCSS, appName);
            syncAppWrapperElement2Sandbox(appWrapperElement);
          }
          render({ element: appWrapperElement, loading: true, container: remountContainer }, "mounting");
        },
        mountSandbox,
        // exec the chain after rendering to keep the behavior with beforeLoad
        async () => execHooksChain((0, import_utils.toArray)(beforeMount), app, global),
        async (props) => mount({ ...props, container: appWrapperGetter(), setGlobalState, onGlobalStateChange }),
        // finish loading after app mounted
        async () => render({ element: appWrapperElement, loading: false, container: remountContainer }, "mounted"),
        async () => execHooksChain((0, import_utils.toArray)(afterMount), app, global),
        // initialize the unmount defer after app mounted and resolve the defer after it unmounted
        async () => {
          if (await validateSingularMode(singular, app)) {
            prevAppUnmountedDeferred = new import_utils.Deferred();
          }
        },
        async () => {
          if (process.env.NODE_ENV === "development") {
            const measureName = `[freelog] App ${appInstanceId} Loading Consuming`;
            (0, import_utils.performanceMeasure)(measureName, markName);
          }
        }
      ],
      unmount: [
        async () => execHooksChain((0, import_utils.toArray)(beforeUnmount), app, global),
        async (props) => unmount({ ...props, container: appWrapperGetter() }),
        unmountSandbox,
        async () => execHooksChain((0, import_utils.toArray)(afterUnmount), app, global),
        async () => {
          render({ element: null, loading: false, container: remountContainer }, "unmounted");
          offGlobalStateChange(appInstanceId);
          appWrapperElement = null;
          syncAppWrapperElement2Sandbox(appWrapperElement);
        },
        async () => {
          if (await validateSingularMode(singular, app) && prevAppUnmountedDeferred) {
            prevAppUnmountedDeferred.resolve();
          }
        }
      ]
    };
    if (typeof update === "function") {
      parcelConfig.update = update;
    }
    return parcelConfig;
  };
  return parcelConfigGetter;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  loadApp
});
