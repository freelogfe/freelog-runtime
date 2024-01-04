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

// src/globalState.ts
var globalState_exports = {};
__export(globalState_exports, {
  getMicroAppStateActions: () => getMicroAppStateActions,
  initGlobalState: () => initGlobalState
});
module.exports = __toCommonJS(globalState_exports);
var import_lodash_es = require("lodash-es");
var globalState = {};
var deps = {};
function emitGlobal(state, prevState) {
  Object.keys(deps).forEach((id) => {
    if (deps[id] instanceof Function) {
      deps[id]((0, import_lodash_es.cloneDeep)(state), (0, import_lodash_es.cloneDeep)(prevState));
    }
  });
}
function initGlobalState(state = {}) {
  if (state === globalState) {
    console.warn("[freelog] state has not changed！");
  } else {
    const prevGlobalState = (0, import_lodash_es.cloneDeep)(globalState);
    globalState = (0, import_lodash_es.cloneDeep)(state);
    emitGlobal(globalState, prevGlobalState);
  }
  return getMicroAppStateActions(`global-${+/* @__PURE__ */ new Date()}`, true);
}
function getMicroAppStateActions(id, isMaster) {
  return {
    /**
     * onGlobalStateChange 全局依赖监听
     *
     * 收集 setState 时所需要触发的依赖
     *
     * 限制条件：每个子应用只有一个激活状态的全局监听，新监听覆盖旧监听，若只是监听部分属性，请使用 onGlobalStateChange
     *
     * 这么设计是为了减少全局监听滥用导致的内存爆炸
     *
     * 依赖数据结构为：
     * {
     *   {id}: callback
     * }
     *
     * @param callback
     * @param fireImmediately
     */
    onGlobalStateChange(callback, fireImmediately) {
      if (!(callback instanceof Function)) {
        console.error("[freelog] callback must be function!");
        return;
      }
      if (deps[id]) {
        console.warn(`[freelog] '${id}' global listener already exists before this, new listener will overwrite it.`);
      }
      deps[id] = callback;
      const cloneState = (0, import_lodash_es.cloneDeep)(globalState);
      if (fireImmediately) {
        callback(cloneState, cloneState);
      }
    },
    /**
     * setGlobalState 更新 store 数据
     *
     * 1. 对输入 state 的第一层属性做校验，只有初始化时声明过的第一层（bucket）属性才会被更改
     * 2. 修改 store 并触发全局监听
     *
     * @param state
     */
    setGlobalState(state = {}) {
      if (state === globalState) {
        console.warn("[freelog] state has not changed！");
        return false;
      }
      const changeKeys = [];
      const prevGlobalState = (0, import_lodash_es.cloneDeep)(globalState);
      globalState = (0, import_lodash_es.cloneDeep)(
        Object.keys(state).reduce((_globalState, changeKey) => {
          if (isMaster || _globalState.hasOwnProperty(changeKey)) {
            changeKeys.push(changeKey);
            return Object.assign(_globalState, { [changeKey]: state[changeKey] });
          }
          console.warn(`[freelog] '${changeKey}' not declared when init state！`);
          return _globalState;
        }, globalState)
      );
      if (changeKeys.length === 0) {
        console.warn("[freelog] state has not changed！");
        return false;
      }
      emitGlobal(globalState, prevGlobalState);
      return true;
    },
    // 注销该应用下的依赖
    offGlobalStateChange() {
      delete deps[id];
      return true;
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getMicroAppStateActions,
  initGlobalState
});
