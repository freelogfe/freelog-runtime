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

// src/freelogApp/services/api/modules/operation.ts
var operation_exports = {};
__export(operation_exports, {
  default: () => operation_default
});
module.exports = __toCommonJS(operation_exports);
var operation = {
  pushMessage4Task: {
    url: `/activities/facade/pushMessage4Task `,
    method: "POST"
    // dataModel: { // 避免经常改，暂时不限制
    //   taskConfigCode: "string" 
    // },
  }
};
var operation_default = operation;
