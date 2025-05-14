import { placeHolder } from "../../base";
const host = location.host
  .slice(location.host.indexOf("."))
  .replace(".t.", ".");
export type Exhibit = {
  getSignStatistics: any;
  getExhibitDetail: any;
  getExhibitListById: any;
  getExhibitAuthListById: any;
  getExhibitListByPage: any;
  getExhibitListByAuthPage: any;
  getExhibitRecommend: any;
  getExhibitAuthStatus: any;
  getExhibitSignCount: any;
  getExhibitDepInfo: any;
  getExhibitById: any;
  getExhibitInsideById: any;
  getExhibitDepById: any;
  getExhibitDepInsideById: any;
};

const exhibit: Exhibit = {
  getSignStatistics: {
    url: `${placeHolder}/exhibit/sign-statistics`,
    method: "GET",
    // dataModel: {
    //   nodeId: 'string', // subjectType=2&signUserIdentityType=2
    //   signUserIdentityType: 'int',
    //   keywords: "string"
    // },
  },
  // placeHolder: nodeId exhibitId
  getExhibitDetail: {
    url: `${placeHolder}/exhibit/${placeHolder}/detail`,
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
    url: `${placeHolder}/exhibit/list`,
    method: "GET",
    dataModel: {
      exhibitIds: "string",
      isLoadVersionProperty: "int",
      isLoadPolicyInfo: "int",
      isTranslate: "int",
    },
  },
  getExhibitAuthListById: {
    url: `${placeHolder}/exhibit/auth-list`,
    method: "GET",
    dataModel: {
      exhibitIds: "string",
      isLoadVersionProperty: "int",
      isLoadPolicyInfo: "int",
      isTranslate: "int",
    },
  },
  // placeHolder: nodeId
  getExhibitListByPage: {
    url: `${placeHolder}/exhibit/page`,
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
  getExhibitListByAuthPage: {
    url: `${placeHolder}/exhibit/auth-page`,
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

  // nodeId
  getExhibitAuthStatus: {
    url: `${placeHolder}/exhibit/${placeHolder}/auth`,
    method: "GET",
    dataModel: {
      authType: "string", // 授权类型 1:节点侧授权 2:作品侧授权 3:节点+作品侧授权 4:全链路(包含用户,节点与作品)
      exhibitIds: "string", // 展品ID,多个逗号分隔
    },
  },
  // nodeId exhibitId articleNids
  getExhibitDepInfo: {
    url: `${placeHolder}/exhibit/${placeHolder}/dep`,
    method: "GET",
    dataModel: {
      articleNids: "string",
    },
  },
  getExhibitSignCount: {
    url: `${placeHolder}/exhibit/${placeHolder}/sign-count`,
    method: "GET",
    dataModel: {
      subjectIds: "string",
      subjectType: "string",
    },
  },
  getExhibitRecommend: {
    url: `${placeHolder}/exhibit/${placeHolder}/recommend`,
    method: "GET",
  },  

  getExhibitById: {
    url: `exhibits/${placeHolder}`,
    baseURL: location.protocol + `//file${host}/`,
    method: "GET",
  },

  getExhibitInsideById: {
    url: `exhibits/${placeHolder}/packages/${placeHolder}`, // {subFilePath}
    baseURL: location.protocol + `//file${host}/`,
    method: "GET",
  },
  getExhibitDepById: {
    url: `exhibits/${placeHolder}/articles/${placeHolder}`, // {nid}
    baseURL: location.protocol + `//file${host}/`,
    method: "GET",
  },
  getExhibitDepInsideById: {
    url: `exhibits/${placeHolder}/articles/${placeHolder}/packages/${placeHolder}`, // {nid}  {subFilePath}
    baseURL: location.protocol + `//file${host}/`,
    method: "GET",
  }, 
};
export default exhibit;
