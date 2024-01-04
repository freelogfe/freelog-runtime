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

// src/freelogApp/services/api/modules/contract.ts
var contract_exports = {};
__export(contract_exports, {
  default: () => contract_default
});
module.exports = __toCommonJS(contract_exports);
var import_base = require("../../base");
var contract = {
  // exhibitId, result|info|articleInfo|fileStream
  getContractInfo: {
    url: `contracts/${import_base.placeHolder}`,
    method: "GET",
    dataModel: {
      contractIds: "string",
      isLoadPolicyInfo: "int",
      projection: "string"
    }
  },
  getContracts: {
    url: `contracts/list`,
    method: "GET",
    dataModel: {
      contractIds: "string",
      subjectIds: "string",
      subjectType: "int",
      licenseeIdentityType: "int",
      licensorId: "string",
      licenseeId: "string",
      isLoadPolicyInfo: "int",
      projection: "string",
      isTranslate: "int"
    }
  },
  contract: {
    url: `contracts`,
    method: "POST",
    dataModel: {
      subjectId: "string",
      subjectType: "int",
      policyId: "string",
      licenseeId: "string",
      licenseeIdentityType: "int"
    }
  },
  contracts: {
    url: `contracts/batchSign`,
    method: "POST",
    dataModel: {
      subjects: "array",
      subjectId: "string",
      subjectType: "int",
      policyId: "string",
      licenseeId: "string",
      licenseeIdentityType: "int",
      isWaitInitial: "int"
    }
  },
  getTransitionRecords: {
    url: `contracts/${import_base.placeHolder}/transitionRecords`,
    method: "GET",
    dataModel: {
      skip: "int",
      limit: "int"
    }
  },
  getSignStatistics: {
    url: `contracts/subjects/presentables/signStatistics`,
    method: "GET"
    // dataModel: {
    //   nodeId: 'string', // subjectType=2&signUserIdentityType=2
    //   signUserIdentityType: 'int',
    //   keywords: "string"
    // },
  }
};
var contract_default = contract;
