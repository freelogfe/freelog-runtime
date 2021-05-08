import { placeHolder } from "../../base";

export type Contract = {
  getContractInfo: any;
  getContracts: any;
  contract: any;
};

const contract: Contract = {
  // presentableId, result|info|resourceInfo|fileStream
  getContractInfo: {
    url: `contracts/${placeHolder}`,
    method: "GET",
    params: {
      contractIds: "string",
      isLoadPolicyInfo: "int",
      projection: "string",
    },
  },
  getContracts: {
    url: `contracts/list`,
    method: "GET",
    params: {
      contractIds: "string",
      subjectIds: "string",
      subjectType: "int",
      licenseeIdentityType: "int",
      licensorId: "string",
      licenseeId: "string",
      isLoadPolicyInfo: "int",
      projection: "string",
    },
  },
  contract: {
    url: `contracts`,
    method: "POST",
    params: {
      subjectId: "string",
      subjectType: "int",
      policyId: "string",
      licenseeId: "string",
      licenseeIdentityType: "int"
    },
  },
};
export default contract;
