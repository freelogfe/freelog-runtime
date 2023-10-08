import { placeHolder } from "../../base";

// TODO  需要给data或params定义类型

export type Node = {
  getInfoById: any;
  getInfoByNameOrDomain: any;
  postUserData: any;
  putUserData: any;
  getUserData: any;
};

const node: Node = {
  getInfoById: {
    url: `nodes/${placeHolder}`,
    method: "GET",
  },
  // exhibitId, result|info|articleInfo|fileStream
  getInfoByNameOrDomain: {
    url: `nodes/detail`,
    method: "GET",
    dataModel: {
      nodeName: "string",
      nodeDomain: "string",
      isLoadOwnerUserInfo: "int",
    },
  },
  // storages/buckets/.UserNodeData/objects   post
  postUserData: {
    url: `storages/buckets/.UserNodeData/objects`,
    method: "POST",
    dataModel: {
      nodeId: "int",
      nodeDomain: "string",
      userNodeData: "object",
    },
  },
  // storages/buckets/.UserNodeData/objects/{nodeId}  PUT
  putUserData: {
    url: `storages/buckets/.UserNodeData/objects/${placeHolder}`,
    method: "PUT",
    dataModel: {
      removeFields: "",
      appendOrReplaceObject: "",
    },
  },
  // storages/buckets/.UserNodeData/objects/{objectIdOrNodeId}/customPick  GET
  getUserData: {
    url: `storages/buckets/.UserNodeData/objects/${placeHolder}/customPick`,
    method: "GET",
    dataModel: {
      fields: "string",
    },
  },
};
export default node;
