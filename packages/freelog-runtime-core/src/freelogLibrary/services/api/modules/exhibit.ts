import { placeHolder } from "../../base";
const host = location.host
  .slice(location.host.indexOf("."))
  .replace(".t.", ".");
  
export type Exhibit = {
  getExhibitDepById: any;
  getExhibitDepInsideById: any
};

const exhibit: Exhibit = {
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
