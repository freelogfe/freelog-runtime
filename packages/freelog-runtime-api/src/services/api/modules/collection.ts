import { placeHolder } from "../../base";
const host = location.host
  .slice(location.host.indexOf("."))
  .replace(".t.", ".");
export type Exhibit = {
  getCollectionSubPageById: any;
  getCollectionSubAuthPageById: any;
  getCollectionSubPageByIds: any;
  getCollectionSubAuthPageByIds: any;
  getCollectionSubListAuthById: any;
  getCollectionSubById: any;
  getCollectionSubInfoById: any;
  getCollectionSubInfoByIds: any;
  getCollectionSubAuth:any;
  getCollectionSubInfoAuthByIds:any;
  getCollectionSubInsideById: any;
  getCollectionSubDepById: any;
  getCollectionSubDepList: any;
  getCollectionSubDepInsideById: any;
};

const exhibit: Exhibit = {
  getCollectionSubPageById: {
    url: `${placeHolder}/collection/${placeHolder}/items/page`,
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
  getCollectionSubAuthPageById: {
    url: `${placeHolder}/collection/${placeHolder}/items/auth-page`,
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
  getCollectionSubPageByIds: {
    url: `${placeHolder}/collection/batch-items/page`,
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
  getCollectionSubAuthPageByIds: {
    url: `${placeHolder}/collection/batch-items/auth-page`,
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
  getCollectionSubAuth: {
    url: `${placeHolder}/collection/${placeHolder}/items/auth`,
    method: "GET",
    dataModel: {
      nodeId: "string",
      exhibitId: "string",
      itemIds: "string",
    },
  },
  getCollectionSubListAuthById: {
    url: `${placeHolder}/collection/${placeHolder}/item/auth-list`,
    method: "GET",
    dataModel: {
      nodeId: "string",
      exhibitId: "string",
      itemIds: "string",
    },
  },
  getCollectionSubInfoById: {
    url: `${placeHolder}/collection/${placeHolder}/item/${placeHolder}`,
    method: "GET",
  },


  getCollectionSubInfoByIds: {
    url: `${placeHolder}/collection/${placeHolder}/item/list`,
    method: "GET",
  },
  getCollectionSubInfoAuthByIds: {
    url: `${placeHolder}/collection/${placeHolder}/item/auth-list`,
    method: "GET",
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
};
export default exhibit;
