import { placeHolder } from "../../base";
const host = location.host
  .slice(location.host.indexOf("."))
  .replace(".t.", ".");
export type Exhibit = {
  getExhibitDetail: any;
  getTestExhibitDetail: any;
  getExhibitListById: any;
  getTestExhibitListById: any;
  getExhibitListByPaging: any;
  getTestExhibitByPaging: any;
  getExhibitAuthById: any;
  getTestExhibitAuthById: any;
  getExhibitAuthStatus: any;
  getTestExhibitAuthStatus: any;
  getExhibitSignCount: any;
  getExhibitDepInfo: any;
  getTestExhibitDepInfo: any;
  getExhibitById: any;
  getTestExhibitById: any;
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
      isLoadResourceDetailInfo: "int",
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
  getTestExhibitListById: {
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
      tagQueryType: "int",
    },
  },
  getTestExhibitByPaging: {
    url: `exhibits/${placeHolder}/test`,
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
      tagQueryType: "int",
    },
  },
  // exhibitId  {result|info|fileStream}
  getExhibitAuthById: {
    url: `auths/exhibits/${placeHolder}/${placeHolder}/${placeHolder}`,
    method: "GET",
    dataModel: {
      parentNid: "string", // 依赖树上的父级节点ID,一般获取展品子依赖需要传递
      subArticleIdOrName: "string", // 子依赖的作品ID作品名称
      subArticleType: "string", // 子依赖的作品类型 (1:独立作品 2:组合作品 3:节点组合作品 4:存储对象)
      subFilePath: "string", // 主题或插件的压缩包内部子作品,需要带相对路径
    },
  },
  // exhibitId  {result|info|fileStream}
  getTestExhibitAuthById: {
    url: `auths/exhibits/${placeHolder}/test/${placeHolder}/${placeHolder}`,
    method: "GET",
    dataModel: {
      parentNid: "string",
      subArticleIdOrName: "string",
      subArticleType: "string",
      subFilePath: "string",
    },
  },
  // exhibitId  {result|info|fileStream}
  getExhibitById: {
    url: `exhibits/${placeHolder}`,
    baseURL: location.protocol + `//file${host}/`,
    method: "GET",
    dataModel: {
      parentNid: "string", // 依赖树上的父级节点ID,一般获取展品子依赖需要传递
      subArticleIdOrName: "string", // 子依赖的作品ID作品名称
      subArticleType: "string", // 子依赖的作品类型 (1:独立作品 2:组合作品 3:节点组合作品 4:存储对象)
      subFilePath: "string", // 主题或插件的压缩包内部子作品,需要带相对路径
    },
  },
  // exhibitId  {result|info|fileStream}
  getTestExhibitById: {
    url: `exhibits/test/${placeHolder}`,
    baseURL: location.protocol + `//file${host}/`,
    method: "GET",
    dataModel: {
      parentNid: "string",
      subArticleIdOrName: "string",
      subArticleType: "string",
      subFilePath: "string",
    },
  },
  // nodeId
  getExhibitAuthStatus: {
    url: `auths/exhibits/${placeHolder}/batchAuth/results`,
    method: "GET",
    dataModel: {
      authType: "string", // 授权类型 1:节点侧授权 2:作品侧授权 3:节点+作品侧授权 4:全链路(包含用户,节点与作品)
      exhibitIds: "string", // 展品ID,多个逗号分隔
    },
  },
  // nodeId
  getTestExhibitAuthStatus: {
    url: `auths/exhibits/${placeHolder}/test/batchAuth/results`,
    method: "GET",
    dataModel: {
      authType: "string", // 授权类型 1:节点侧授权 2:作品侧授权 3:节点+作品侧授权 4:全链路(包含用户,节点与作品)
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
      articleNids: "string",
    },
  },
  getTestExhibitDepInfo: {
    url: `exhibits/${placeHolder}/test/${placeHolder}/articles/list`,
    method: "GET",
    dataModel: {
      articleNids: "string",
    },
  },
};
export default exhibit;
