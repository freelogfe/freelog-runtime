import { placeHolder } from "../../base";

// TODO  需要给data或params定义类型

export type Presentable = {
  getPagingPresentables: any;
  getPresentables: any;
  getByPresentableId: any;
  getByResourceIdOrName: any;
  getTestPagingData: any;
  getTestByPresentableId: any;
  getTestByResourceIdOrName: any;
  getPresentableDetail: any
};

const presentable: Presentable = {
  // presentableId, result|info|resourceInfo|fileStream
  getPresentableDetail: {
    url: `presentables/${placeHolder}`,
    method: "GET",
  },
  getPagingPresentables: {
    url: "presentables",
    method: "GET",
    params: {
      nodeId: "string",
      skip: "string",
      limit: "string",
      resourceType: "string",
      omitResourceType: "string",
      onlineStatus: "string",
      tags: "string",
      projection: "string",
      keywords: "string",
      isLoadVersionProperty: "string",
      isLoadPolicyInfo: "string",
    },
  },
  getPresentables: {
    url: "presentables/list",
    method: "GET",
    params: {
      nodeId: "string",
      userId: "string",
      presentableIds: "string",
      resourceIds: "string",
      resourceNames: "string",
      isLoadVersionProperty: "string",
      isLoadPolicyInfo: "string",
      projection: "string",
    },
  },
  // presentableId, result|info|resourceInfo|fileStream
  getByPresentableId: {
    url: `auths/presentables/${placeHolder}/${placeHolder}`,
    method: "GET",
  },
  // nodeId  resourceIdOrName   result|info|resourceInfo|fileStream
  getByResourceIdOrName: {
    url: `auths/presentables/nodes/${placeHolder}/${placeHolder}/${placeHolder}`,
    method: "GET",
  },
  getTestPagingData: {
    url: `testNodes/${placeHolder}/testResources`,
    method: "GET",
    params: {
      nodeId: "string",
      skip: "string",
      limit: "string",
      resourceType: "string",
      onlineStatus: "string",
      tags: "string",
      omitResourceType: "string",
      keywords: "string",
    },
  },
  // testResourceId, result|info|fileStream
  getTestByPresentableId: {
    url: `auths/testResources/${placeHolder}/${placeHolder}`,
    method: "GET",
  },
  // nodeId  entityIdOrName   result|info|fileStream
  getTestByResourceIdOrName: {
    url: `auths/testResources/nodes/${placeHolder}/${placeHolder}/${placeHolder}`,
    method: "GET",
  },
};
export default presentable;
