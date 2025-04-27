import { placeHolder } from "../../base";

export type Event = {
 
  pay: any;
};

const event: Event = {
   
  pay: {
    url: `contracts/${placeHolder}/events/payment`,
    method: "POST",
    dataModel: {
      eventId: "string",
      accountId: "int",
      transactionAmount: "string",
      password: "string" 
    },
  },
};
export default event;
