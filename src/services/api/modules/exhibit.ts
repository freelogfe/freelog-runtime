import { placeHolder } from "../../base";
export type Exhibit = {
  getExhibitDetail: any;
  getTestExhibitDetail: any;
  getExhibitListById: any;
  getTestExhibitById: any;
  getExhibitListByPaging: any;
  getTestExhibitByPaging: any;
  getExhibitAuthById: any;
  getTestExhibitAuthById: any;
  getExhibitAuthStatus: any;
  getTestExhibitAuthStatus: any;
  getExhibitSignCount: any;
  getExhibitDepInfo: any;
  getTestExhibitDepInfo: any;
};

const exhibit: Exhibit = {
  // placeHolder: nodeId exhibitId
  getExhibitDetail: {
    url: `exhibits/${placeHolder}/${placeHolder}`,
    method: "GET",
    dataModel: {
      isLoadPolicyInfo: "int",
      isLoadVersionProperty: "int",
      isTranslate: "int",
      isLoadContract: "int",
    },
  },
  // placeHolder: nodeId exhibitId
  getTestExhibitDetail: {
    url: `exhibits/${placeHolder}/test/${placeHolder}`,
    method: "GET",
    dataModel: {
      isLoadPolicyInfo: "int",
      isLoadVersionProperty: "int",
      isTranslate: "int",
      isLoadContract: "int",
    },
  },
  getExhibitListById: {
    url: `exhibits/${placeHolder}/list`,
    method: "GET",
    dataModel: {
      exhibitIds: "string",
      isLoadVersionProperty: "int",
      isLoadPolicyInfo: "int",
      isTranslate: "int",
    },
  },
  getTestExhibitById: {
    url: `exhibits/${placeHolder}/test/list`,
    method: "GET",
    dataModel: {
      exhibitIds: "string",
      isLoadVersionProperty: "int",
      isLoadPolicyInfo: "int",
      isTranslate: "int",
    },
  },
  // placeHolder: nodeId
  getExhibitListByPaging: {
    url: `exhibits/${placeHolder}`,
    method: "GET",
    dataModel: {
      skip: "int",
      limit: "int",
      articleResourceTypes: "string",
      omitWorkResourceType: "string",
      onlineStatus: "int",
      tags: "string",
      projection: "string",
      sort: "string",
      keywords: "string",
      isLoadVersionProperty: "int",
      isLoadPolicyInfo: "int",
      isTranslate: "int",
    },
  },
  getTestExhibitByPaging: {
    url: `exhibits/${placeHolder}/test`,
    method: "GET",
    dataModel: {
      skip: "int",
      limit: "int",
      articleResourceTypes: "string",
      omitWorkResourceType: "string",
      onlineStatus: "int",
      sort: "string",
      tags: "string",
      projection: "string",
      keywords: "string",
      isLoadVersionProperty: "int",
      isLoadPolicyInfo: "int",
      isTranslate: "int",
    },
  },
  // exhibitId  {result|info|fileStream}
  getExhibitAuthById: {
    url: `auths/exhibits/${placeHolder}/${placeHolder}/${placeHolder}`,
    method: "GET",
    dataModel: {
      parentNid: "string", // 依赖树上的父级节点ID,一般获取展品子依赖需要传递
      subArticleIdOrName: "string", // 子依赖的作品ID作品名称
      subWorkType: "string", // 子依赖的作品类型 (1:独立资源 2:组合资源 3:节点组合资源 4:存储对象)
      subFilePath: "string", // 主题或插件的压缩包内部子资源,需要带相对路径
    },
  },
  // exhibitId  {result|info|fileStream}
  getTestExhibitAuthById: {
    url: `auths/exhibits/${placeHolder}/test/${placeHolder}/${placeHolder}`,
    method: "GET",
    dataModel: {
      parentNid: "string",
      subArticleIdOrName: "string",
      subWorkType: "string",
      subFilePath: "string",
    },
  },
  // nodeId
  getExhibitAuthStatus: {
    url: `auths/exhibits/${placeHolder}/batchAuth/results`,
    method: "GET",
    dataModel: {
      authType: "string", // 授权类型 1:节点侧授权 2:资源侧授权 3:节点+资源侧授权 4:全链路(包含用户,节点与资源)
      exhibitIds: "string", // 展品ID,多个逗号分隔
    },
  },
  // nodeId
  getTestExhibitAuthStatus: {
    url: `auths/exhibits/${placeHolder}/test/batchAuth/results`,
    method: "GET",
    dataModel: {
      authType: "string", // 授权类型 1:节点侧授权 2:资源侧授权 3:节点+资源侧授权 4:全链路(包含用户,节点与资源)
      exhibitIds: "string", // 展品ID,多个逗号分隔
    },
  },
  getExhibitSignCount: {
    url: `contracts/subjects/signCount`,
    method: "GET",
    dataModel: {
      subjectIds: "string",
      subjectType: "string",
    },
  },
  // nodeId exhibitId articleNids
  getExhibitDepInfo: {
    url: `exhibits/${placeHolder}/${placeHolder}/articles/list`,
    method: "GET",
    dataModel: {
      subjectIds: "string",
      subjectType: "string",
    },
  },
  getTestExhibitDepInfo: {
    url: `exhibits/${placeHolder}/test/${placeHolder}/articles/list`,
    method: "GET",
    dataModel: {
      subjectIds: "string",
      subjectType: "string",
    },
  },
};
export default exhibit;
