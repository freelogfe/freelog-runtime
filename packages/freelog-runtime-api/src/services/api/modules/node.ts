import { placeHolder } from "../../base";

export type Node = {
  getInfoByNameOrDomain: any;
  deleteUserData: any;
  putUserData: any;
  getUserData: any;
  getWechatShare: any;
};

const node: Node = {
  // exhibitId, result|info|articleInfo|fileStream
  getInfoByNameOrDomain: {
    url: `base/nodes/detail`,
    method: "GET",
    dataModel: {
      nodeName: "string",
      nodeDomain: "string",
      isLoadOwnerUserInfo: "int",
    },
  },
  // storages/buckets/.UserNodeData/objects   post
  deleteUserData: {
    url: `${placeHolder}/user-data`,
    method: "DELETE",
    dataModel: {
      nodeId: "int",
      nodeDomain: "string",
      userNodeData: "object",
    },
  },
  // storages/buckets/.UserNodeData/objects/{nodeId}  PUT
  putUserData: {
    url: `${placeHolder}/user-data`,
    method: "PUT",
    dataModel: {
      removeFields: "",
      appendOrReplaceObject: "",
    },
  },
  // storages/buckets/.UserNodeData/objects/{objectIdOrNodeId}/customPick  GET
  getUserData: {
    url: `${placeHolder}/user-data`,
    method: "GET",
    dataModel: {
      fields: "string",
    },
  },
  getWechatShare: {
    url: `users/wechatPublicApis/shareSignature`,
    method: "get",
    dataModel: {
      shareUrl: "string",
    },
  },
};
export default node;
