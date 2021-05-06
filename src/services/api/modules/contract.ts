import { placeHolder } from "../../base";

// TODO  需要给data或params定义类型

export type Contract = {
  getContractInfo: any;
  getContracts: any;
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
};
export default contract;
