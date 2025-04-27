import { placeHolder } from "../../base";

export type Operation = {
 
  pushMessage4Task: any;
};

const operation: Operation = {
  pushMessage4Task : {
    url: `/activities/facade/pushMessage4Task `,
    method: "POST",
    // dataModel: { // 避免经常改，暂时不限制
    //   taskConfigCode: "string" 
    // },
  },
};
export default operation;
