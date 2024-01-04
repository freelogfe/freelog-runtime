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

// src/sandbox/patchers/historyListener.ts
var historyListener_exports = {};
__export(historyListener_exports, {
  default: () => patch
});
module.exports = __toCommonJS(historyListener_exports);
var import_lodash_es = require("lodash-es");
function patch() {
  let rawHistoryListen = (_) => import_lodash_es.noop;
  const historyListeners = [];
  const historyUnListens = [];
  if (window.g_history && (0, import_lodash_es.isFunction)(window.g_history.listen)) {
    rawHistoryListen = window.g_history.listen.bind(window.g_history);
    window.g_history.listen = (listener) => {
      historyListeners.push(listener);
      const unListen = rawHistoryListen(listener);
      historyUnListens.push(unListen);
      return () => {
        unListen();
        historyUnListens.splice(historyUnListens.indexOf(unListen), 1);
        historyListeners.splice(historyListeners.indexOf(listener), 1);
      };
    };
  }
  return function free() {
    let rebuild = import_lodash_es.noop;
    if (historyListeners.length) {
      rebuild = () => {
        historyListeners.forEach((listener) => window.g_history.listen(listener));
      };
    }
    historyUnListens.forEach((unListen) => unListen());
    if (window.g_history && (0, import_lodash_es.isFunction)(window.g_history.listen)) {
      window.g_history.listen = rawHistoryListen;
    }
    return rebuild;
  };
}
