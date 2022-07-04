import { placeHolder } from "../../base";

export type Transaction = {
    getRecord: any;
};

const transaction: Transaction = {
  getRecord: {
    url: `transactions/records/${placeHolder}`,
    method: "get"
  },
};
export default transaction;
