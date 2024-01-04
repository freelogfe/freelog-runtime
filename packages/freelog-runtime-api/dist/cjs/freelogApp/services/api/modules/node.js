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

// src/freelogApp/services/api/modules/node.ts
var node_exports = {};
__export(node_exports, {
  default: () => node_default
});
module.exports = __toCommonJS(node_exports);
var import_base = require("../../base");
var node = {
  getInfoById: {
    url: `nodes/${import_base.placeHolder}`,
    method: "GET"
  },
  // exhibitId, result|info|articleInfo|fileStream
  getInfoByNameOrDomain: {
    url: `nodes/detail`,
    method: "GET",
    dataModel: {
      nodeName: "string",
      nodeDomain: "string",
      isLoadOwnerUserInfo: "int"
    }
  },
  // storages/buckets/.UserNodeData/objects   post
  postUserData: {
    url: `storages/buckets/.UserNodeData/objects`,
    method: "POST",
    dataModel: {
      nodeId: "int",
      nodeDomain: "string",
      userNodeData: "object"
    }
  },
  // storages/buckets/.UserNodeData/objects/{nodeId}  PUT
  putUserData: {
    url: `storages/buckets/.UserNodeData/objects/${import_base.placeHolder}`,
    method: "PUT",
    dataModel: {
      removeFields: "",
      appendOrReplaceObject: ""
    }
  },
  // storages/buckets/.UserNodeData/objects/{objectIdOrNodeId}/customPick  GET
  getUserData: {
    url: `storages/buckets/.UserNodeData/objects/${import_base.placeHolder}/customPick`,
    method: "GET",
    dataModel: {
      fields: "string"
    }
  }
};
var node_default = node;
