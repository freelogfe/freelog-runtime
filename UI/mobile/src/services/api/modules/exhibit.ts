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

const exhibit: Presentable = {
  // exhibitId, result|info|articleInfo|fileStream
  getPresentableDetail: {
    url: `exhibits/${placeHolder}`,
    method: "GET",
    dataModel: {
      projection:  "string",
      isLoadVersionProperty: "string",
      isLoadPolicyInfo: "string",
      isLoadCustomPropertyDescriptors: "string",
      isTranslate: "string",
      isLoadResourceDetailInfo: "string",
      isLoadResourceVersionInfo: "string"
    }
  },
  getPagingPresentables: {
    url: "exhibits",
    method: "GET",
    dataModel: {
      nodeId: "string",
      skip: "string",
      limit: "string",
      articleResourceTypes: "string",
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
    url: "exhibits/list",
    method: "GET",
    dataModel: {
      nodeId: "string",
      userId: "string",
      exhibitIds: "string",
      resourceIds: "string",
      resourceNames: "string",
      isLoadVersionProperty: "string",
      isLoadPolicyInfo: "string",
      projection: "string",
    },
  },
  // exhibitId, result|info|articleInfo|fileStream
  getByPresentableId: {
    url: `auths/exhibits/${placeHolder}/${placeHolder}`,
    method: "GET",
  },
  // nodeId  articleIdOrName   result|info|articleInfo|fileStream
  getByResourceIdOrName: {
    url: `auths/exhibits/nodes/${placeHolder}/${placeHolder}/${placeHolder}`,
    method: "GET",
  },
  getTestPagingData: {
    url: `testNodes/${placeHolder}/testResources`,
    method: "GET",
    dataModel: {
      nodeId: "string",
      skip: "string",
      limit: "string",
      articleResourceTypes: "string",
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
export default exhibit;
