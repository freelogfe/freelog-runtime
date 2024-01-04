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

// src/freelogApp/api.ts
var api_exports = {};
__export(api_exports, {
  getExhibitAuthStatus: () => getExhibitAuthStatus,
  getExhibitAvailalbe: () => getExhibitAvailalbe,
  getExhibitDepFileStream: () => getExhibitDepFileStream,
  getExhibitDepInfo: () => getExhibitDepInfo,
  getExhibitDepTree: () => getExhibitDepTree,
  getExhibitFileStream: () => getExhibitFileStream,
  getExhibitInfo: () => getExhibitInfo,
  getExhibitInfoByAuth: () => getExhibitInfoByAuth,
  getExhibitListById: () => getExhibitListById,
  getExhibitListByPaging: () => getExhibitListByPaging,
  getExhibitResultByAuth: () => getExhibitResultByAuth,
  getExhibitSignCount: () => getExhibitSignCount,
  getSignStatistics: () => getSignStatistics,
  pushMessage4Task: () => pushMessage4Task
});
module.exports = __toCommonJS(api_exports);
var import_handler = __toESM(require("./services/handler"));
var import_exhibit = __toESM(require("./services/api/modules/exhibit"));
var import_contract = __toESM(require("./services/api/modules/contract"));
var import_operation = __toESM(require("./services/api/modules/operation"));
var import_baseInfo = require("../base/baseInfo");
async function getExhibitListById(query) {
  if (query && Object.prototype.toString.call(query) !== "[object Object]") {
    return "query parameter must be object";
  }
  if (import_baseInfo.baseInfo.isTest)
    return import_handler.default.bind({ name: this.name })(
      import_exhibit.default.getTestExhibitListById,
      [import_baseInfo.baseInfo.nodeId],
      {
        ...query
      }
    );
  return import_handler.default.bind({ name: this.name })(
    import_exhibit.default.getExhibitListById,
    [import_baseInfo.baseInfo.nodeId],
    {
      ...query
    }
  );
}
async function getExhibitListByPaging(query) {
  if (query && Object.prototype.toString.call(query) !== "[object Object]") {
    return Promise.reject("query parameter must be object");
  }
  if (import_baseInfo.baseInfo.isTest)
    return import_handler.default.bind({ name: this.name })(
      import_exhibit.default.getTestExhibitByPaging,
      [import_baseInfo.baseInfo.nodeId],
      {
        ...query
      }
    );
  return import_handler.default.bind({ name: this.name })(
    import_exhibit.default.getExhibitListByPaging,
    [import_baseInfo.baseInfo.nodeId],
    {
      ...query
    }
  );
}
async function getSignStatistics(query) {
  return (0, import_handler.default)(import_contract.default.getSignStatistics, "", {
    signUserIdentityType: 2,
    nodeId: import_baseInfo.baseInfo.nodeId,
    ...query
  });
}
async function getExhibitInfo(exhibitId, query) {
  if (import_baseInfo.baseInfo.isTest)
    return (0, import_handler.default)(import_exhibit.default.getTestExhibitDetail, [import_baseInfo.baseInfo.nodeId, exhibitId], query);
  return (0, import_handler.default)(import_exhibit.default.getExhibitDetail, [import_baseInfo.baseInfo.nodeId, exhibitId], query);
}
async function getExhibitDepInfo(exhibitId, articleNids) {
  if (import_baseInfo.baseInfo.isTest)
    return (0, import_handler.default)(import_exhibit.default.getTestExhibitDepInfo, [import_baseInfo.baseInfo.nodeId, exhibitId], {
      articleNids
    });
  return (0, import_handler.default)(import_exhibit.default.getExhibitDepInfo, [import_baseInfo.baseInfo.nodeId, exhibitId], {
    articleNids
  });
}
async function getExhibitSignCount(exhibitId) {
  return (0, import_handler.default)(import_exhibit.default.getExhibitSignCount, "", {
    subjectIds: exhibitId,
    subjectType: 2
  });
}
async function getExhibitAvailalbe(exhibitIds) {
  if (import_baseInfo.baseInfo.isTest) {
    return (0, import_handler.default)(import_exhibit.default.getTestExhibitAuthStatus, [import_baseInfo.baseInfo.nodeId], {
      authType: 3,
      exhibitIds
    });
  }
  return (0, import_handler.default)(import_exhibit.default.getExhibitAuthStatus, [import_baseInfo.baseInfo.nodeId], {
    authType: 3,
    exhibitIds
  });
}
async function getExhibitAuthStatus(exhibitIds) {
  if (import_baseInfo.baseInfo.isTest) {
    return (0, import_handler.default)(import_exhibit.default.getTestExhibitAuthStatus, [import_baseInfo.baseInfo.nodeId], {
      authType: import_baseInfo.baseInfo.isTest ? 3 : 4,
      exhibitIds
    });
  }
  return (0, import_handler.default)(import_exhibit.default.getExhibitAuthStatus, [import_baseInfo.baseInfo.nodeId], {
    authType: import_baseInfo.baseInfo.isTest ? 3 : 4,
    exhibitIds
  });
}
function getByExhibitId(name, exhibitId, type, parentNid, subArticleIdOrName, returnUrl, config) {
  if (!exhibitId) {
    return "exhibitId is required";
  }
  let form = {};
  if (parentNid) {
    form.parentNid = parentNid;
  }
  if (subArticleIdOrName) {
    form.subArticleIdOrName = subArticleIdOrName;
  }
  if (import_baseInfo.baseInfo.isTest)
    return import_handler.default.bind({
      name,
      isAuth: true,
      exhibitId: parentNid ? "" : exhibitId
    })(
      import_exhibit.default.getTestExhibitAuthById,
      [import_baseInfo.baseInfo.nodeId, exhibitId, type],
      form,
      returnUrl,
      config
    );
  return import_handler.default.bind({
    name,
    isAuth: true,
    exhibitId: parentNid ? "" : exhibitId
  })(
    import_exhibit.default.getExhibitAuthById,
    [import_baseInfo.baseInfo.nodeId, exhibitId, type],
    form,
    returnUrl,
    config
  );
}
async function getExhibitFileStream(exhibitId, options, config) {
  return import_handler.default.bind({
    // @ts-ignore
    name: this.name,
    isAuth: true,
    exhibitId
  })(
    import_baseInfo.baseInfo.isTest ? import_exhibit.default.getTestExhibitById : import_exhibit.default.getExhibitById,
    [exhibitId],
    (options == null ? void 0 : options.subFilePath) ? { subFilePath: options.subFilePath } : null,
    typeof options === "boolean" ? options : options == null ? void 0 : options.returnUrl,
    config || (options == null ? void 0 : options.config)
  );
}
async function getExhibitResultByAuth(exhibitId) {
  return getByExhibitId(this.name, exhibitId, "result", "", "");
}
async function getExhibitInfoByAuth(exhibitId) {
  return getByExhibitId(this.name, exhibitId, "info", "", "");
}
async function getExhibitDepTree(exhibitId, options) {
  return import_handler.default.bind({
    // @ts-ignore
    name: this.name,
    exhibitId
  })(
    import_baseInfo.baseInfo.isTest ? import_exhibit.default.getTestExhibitDepTree : import_exhibit.default.getExhibitDepTree,
    [exhibitId],
    options ? {
      nid: options.nid,
      maxDeep: options.maxDeep,
      version: options.version,
      isContainRootNode: options.isContainRootNode
    } : null
  );
}
async function getExhibitDepFileStream(exhibitId, parentNid, subArticleId, returnUrl, config) {
  if (!parentNid || !subArticleId) {
    return Promise.reject("parentNid and subArticleId is required!");
  }
  return import_handler.default.bind({
    // @ts-ignore
    name: this.name,
    isAuth: true,
    exhibitId
  })(
    import_baseInfo.baseInfo.isTest ? import_exhibit.default.getTestExhibitById : import_exhibit.default.getExhibitById,
    [exhibitId],
    { parentNid, subArticleIdOrName: subArticleId },
    returnUrl,
    config
  );
}
async function pushMessage4Task(query) {
  return (0, import_handler.default)(import_operation.default.pushMessage4Task, null, query);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getExhibitAuthStatus,
  getExhibitAvailalbe,
  getExhibitDepFileStream,
  getExhibitDepInfo,
  getExhibitDepTree,
  getExhibitFileStream,
  getExhibitInfo,
  getExhibitInfoByAuth,
  getExhibitListById,
  getExhibitListByPaging,
  getExhibitResultByAuth,
  getExhibitSignCount,
  getSignStatistics,
  pushMessage4Task
});
