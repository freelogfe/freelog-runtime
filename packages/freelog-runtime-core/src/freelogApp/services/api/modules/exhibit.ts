import { placeHolder } from "../../base";
const host = location.host
  .slice(location.host.indexOf("."))
  .replace(".t.", ".");
export type Exhibit = {
  getExhibitDetail: any;
  getExhibitListById: any;
  getExhibitListByPaging: any;
  getExhibitRecommend: any;
  getCollectionSubListById: any;
  getCollectionSubListByIds: any;
  getCollectionSubListAuthById: any;
  getCollectionSubById: any;
  getCollectionSubInfoById:any;
  getCollectionSubInsideById: any;
  getCollectionSubDepById: any;
  getCollectionSubDepList: any;
  getCollectionSubDepInsideById: any;
  getExhibitAuthById: any;
  getExhibitAuthStatus: any;
  getExhibitSignCount: any;
  getExhibitDepInfo: any;
  getExhibitById: any;
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
  getExhibitRecommend: {
    url: `exhibits/${placeHolder}/${placeHolder}/recommend`,
    method: "GET",
  },
  getCollectionSubListById: {
    url: `exhibits/${placeHolder}/${placeHolder}/items`,
    method: "GET",
    dataModel: {
      nodeId: "string",
      exhibitId: "string",
      sortType: "string",
      skip: "int",
      limit: "int",
      isShowDetailInfo: "int",
    },
  },
  getCollectionSubListByIds: {
    url: `exhibits/${placeHolder}/collections/items/list`,
    method: "GET",
    dataModel: {
      nodeId: "string",
      exhibitIds: "string",
      sortType: "string",
      skip: "int",
      limit: "int",
      isShowDetailInfo: "int",
    },
  },
  getCollectionSubListAuthById: {
    url: `auths/exhibits/${placeHolder}/${placeHolder}/items/batchAuth/results`,
    method: "GET",
    dataModel: {
      nodeId: "string",
      exhibitId: "string",
      itemIds: "string",
    },
  },
  getCollectionSubInfoById: {
    url: `exhibits/${placeHolder}/${placeHolder}/items/${placeHolder}`, // /exhibits/{nodeId}/{exhibitId}/items/{itemId}
    method: "GET",
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
 
  getCollectionSubById: {
    url: `exhibits/${placeHolder}/items/${placeHolder}`,
    baseURL: location.protocol + `//file${host}/`,
    method: "GET",
  },
  
  getCollectionSubInsideById: {
    url: `exhibits/${placeHolder}/items/${placeHolder}/${placeHolder}`, // {subFilePath}
    baseURL: location.protocol + `//file${host}/`,
    method: "GET",
  },
  getCollectionSubDepList: {
    url: `exhibits/${placeHolder}/${placeHolder}/items/${placeHolder}/dependencyTree`, // /exhibits/{nodeId}/{exhibitId}/items/{itemId}/dependencyTree
    baseURL: location.protocol + `//file${host}/`,
    method: "GET",
  },
  getCollectionSubDepById: {
    url: `exhibits/${placeHolder}/items/${placeHolder}/articles/${placeHolder}`, // {nid}
    baseURL: location.protocol + `//file${host}/`,
    method: "GET",
  },
  getCollectionSubDepInsideById: {
    url: `exhibits/${placeHolder}/items/${placeHolder}/articles/${placeHolder}/${placeHolder}`, // {nid}  {subFilePath}
    baseURL: location.protocol + `//file${host}/`,
    method: "GET",
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
};
export default exhibit;
