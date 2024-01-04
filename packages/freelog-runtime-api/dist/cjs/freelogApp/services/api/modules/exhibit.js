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

// src/freelogApp/services/api/modules/exhibit.ts
var exhibit_exports = {};
__export(exhibit_exports, {
  default: () => exhibit_default
});
module.exports = __toCommonJS(exhibit_exports);
var import_base = require("../../base");
var host = location.host.slice(location.host.indexOf(".")).replace(".t.", ".");
var exhibit = {
  // placeHolder: nodeId exhibitId
  getExhibitDetail: {
    url: `exhibits/${import_base.placeHolder}/${import_base.placeHolder}`,
    method: "GET",
    dataModel: {
      isLoadPolicyInfo: "int",
      isLoadVersionProperty: "int",
      isTranslate: "int",
      isLoadResourceDetailInfo: "int",
      isLoadContract: "int"
    }
  },
  // placeHolder: nodeId exhibitId
  getTestExhibitDetail: {
    url: `exhibits/${import_base.placeHolder}/test/${import_base.placeHolder}`,
    method: "GET",
    dataModel: {
      isLoadPolicyInfo: "int",
      isLoadVersionProperty: "int",
      isTranslate: "int",
      isLoadContract: "int"
    }
  },
  getExhibitListById: {
    url: `exhibits/${import_base.placeHolder}/list`,
    method: "GET",
    dataModel: {
      exhibitIds: "string",
      isLoadVersionProperty: "int",
      isLoadPolicyInfo: "int",
      isTranslate: "int"
    }
  },
  getTestExhibitListById: {
    url: `exhibits/${import_base.placeHolder}/test/list`,
    method: "GET",
    dataModel: {
      exhibitIds: "string",
      isLoadVersionProperty: "int",
      isLoadPolicyInfo: "int",
      isTranslate: "int"
    }
  },
  // placeHolder: nodeId
  getExhibitListByPaging: {
    url: `exhibits/${import_base.placeHolder}`,
    method: "GET",
    dataModel: {
      skip: "int",
      limit: "int",
      articleResourceTypes: "string",
      omitArticleResourceType: "string",
      onlineStatus: "int",
      tags: "string",
      projection: "string",
      sort: "string",
      keywords: "string",
      isLoadVersionProperty: "int",
      isLoadResourceDetailInfo: "int",
      isLoadPolicyInfo: "int",
      isTranslate: "int",
      tagQueryType: "int"
    }
  },
  getTestExhibitByPaging: {
    url: `exhibits/${import_base.placeHolder}/test`,
    method: "GET",
    dataModel: {
      skip: "int",
      limit: "int",
      articleResourceTypes: "string",
      omitArticleResourceType: "string",
      onlineStatus: "int",
      sort: "string",
      tags: "string",
      projection: "string",
      keywords: "string",
      isLoadVersionProperty: "int",
      isLoadPolicyInfo: "int",
      isTranslate: "int",
      tagQueryType: "int"
    }
  },
  // exhibitId  {result|info|fileStream}
  getExhibitAuthById: {
    url: `auths/exhibits/${import_base.placeHolder}/${import_base.placeHolder}/${import_base.placeHolder}`,
    method: "GET",
    dataModel: {
      parentNid: "string",
      // 依赖树上的父级节点ID,一般获取展品子依赖需要传递
      subArticleIdOrName: "string",
      // 子依赖的作品ID作品名称
      subArticleType: "string",
      // 子依赖的作品类型 (1:独立作品 2:组合作品 3:节点组合作品 4:存储对象)
      subFilePath: "string"
      // 主题或插件的压缩包内部子作品,需要带相对路径
    }
  },
  // exhibitId  {result|info|fileStream}
  getTestExhibitAuthById: {
    url: `auths/exhibits/${import_base.placeHolder}/test/${import_base.placeHolder}/${import_base.placeHolder}`,
    method: "GET",
    dataModel: {
      parentNid: "string",
      subArticleIdOrName: "string",
      subArticleType: "string",
      subFilePath: "string"
    }
  },
  // exhibitId  {result|info|fileStream}
  getExhibitById: {
    url: `exhibits/${import_base.placeHolder}`,
    baseURL: location.protocol + `//file${host}/`,
    method: "GET",
    dataModel: {
      parentNid: "string",
      // 依赖树上的父级节点ID,一般获取展品子依赖需要传递
      subArticleIdOrName: "string",
      // 子依赖的作品ID作品名称
      subArticleType: "string",
      // 子依赖的作品类型 (1:独立作品 2:组合作品 3:节点组合作品 4:存储对象)
      subFilePath: "string"
      // 主题或插件的压缩包内部子作品,需要带相对路径
    }
  },
  // exhibitId  {result|info|fileStream}
  getTestExhibitById: {
    url: `exhibits/test/${import_base.placeHolder}`,
    baseURL: location.protocol + `//file${host}/`,
    method: "GET",
    dataModel: {
      parentNid: "string",
      subArticleIdOrName: "string",
      subArticleType: "string",
      subFilePath: "string"
    }
  },
  // nodeId
  getExhibitAuthStatus: {
    url: `auths/exhibits/${import_base.placeHolder}/batchAuth/results`,
    method: "GET",
    dataModel: {
      authType: "string",
      // 授权类型 1:节点侧授权 2:作品侧授权 3:节点+作品侧授权 4:全链路(包含用户,节点与作品)
      exhibitIds: "string"
      // 展品ID,多个逗号分隔
    }
  },
  // nodeId
  getTestExhibitAuthStatus: {
    url: `auths/exhibits/${import_base.placeHolder}/test/batchAuth/results`,
    method: "GET",
    dataModel: {
      authType: "string",
      // 授权类型 1:节点侧授权 2:作品侧授权 3:节点+作品侧授权 4:全链路(包含用户,节点与作品)
      exhibitIds: "string"
      // 展品ID,多个逗号分隔
    }
  },
  getExhibitSignCount: {
    url: `contracts/subjects/signCount`,
    method: "GET",
    dataModel: {
      subjectIds: "string",
      subjectType: "string"
    }
  },
  // nodeId exhibitId articleNids
  getExhibitDepInfo: {
    url: `exhibits/${import_base.placeHolder}/${import_base.placeHolder}/articles/list`,
    method: "GET",
    dataModel: {
      articleNids: "string"
    }
  },
  getTestExhibitDepInfo: {
    url: `exhibits/${import_base.placeHolder}/test/${import_base.placeHolder}/articles/list`,
    method: "GET",
    dataModel: {
      articleNids: "string"
    }
  },
  getExhibitDepTree: {
    url: `presentables/${import_base.placeHolder}/dependencyTree`,
    method: "GET",
    dataModel: {
      maxDeep: "int",
      // 依赖树最大返回深度
      nid: "string",
      // 叶子节点ID,如果需要从叶子节点开始响应,则传入此参数
      isContainRootNode: "boolean",
      // 是否包含根节点,默认包含
      version: "string"
      // 引用的发行版本号,默认使用锁定的最新版本
    }
  },
  getTestExhibitDepTree: {
    url: `testNodes/testResources/${import_base.placeHolder}/dependencyTree`,
    method: "GET"
  }
};
var exhibit_default = exhibit;
