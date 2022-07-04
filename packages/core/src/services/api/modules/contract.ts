import { placeHolder } from "../../base";

export type Contract = {
  getContractInfo: any;
  getContracts: any;
  contract: any;
  contracts: any;
  getTransitionRecords: any;
  getSignStatistics: any;
};

const contract: Contract = {
  // exhibitId, result|info|articleInfo|fileStream
  getContractInfo: {
    url: `contracts/${placeHolder}`,
    method: "GET",
    dataModel: {
      contractIds: "string",
      isLoadPolicyInfo: "int",
      projection: "string",
    },
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
    },
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
    },
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
    },
  },
  getTransitionRecords: {
    url: `contracts/${placeHolder}/transitionRecords`,
    method: "GET",
    dataModel: {
      skip: 'int',
      limit: 'int'
    },
  },
  getSignStatistics: {
    url: `contracts/subjects/presentables/signStatistics`,
    method: "GET",
    // dataModel: {
    //   nodeId: 'string', // subjectType=2&signUserIdentityType=2
    //   signUserIdentityType: 'int',
    //   keywords: "string"
    // },
  }
};
export default contract;
