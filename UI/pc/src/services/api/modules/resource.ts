import { placeHolder } from "../../base";

export type Resource = {
  getResourceInfoByVersion: any;
};

const resource: Resource = {
  getResourceInfoByVersion: {
    url: `resources/${placeHolder}/versions/${placeHolder}?projection=${placeHolder}`,
    method: "get",
    dataModel: {
      version: "string",
      workId: "string",
      projection: "string",
    },
  },
};

export default resource;
