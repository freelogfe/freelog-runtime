import frequest from "../services/handler";
import exhibit from "../services/api/modules/exhibit";
import operation from "../services/api/modules/operation";

import { baseInfo } from "../config/env";


export async function getSignStatistics(
  name: string,
  query?: any,
  config?: any
) {
  return frequest(
    exhibit.getSignStatistics,
    [baseInfo.nodeId],
    {
      signUserIdentityType: 2,
      nodeId: baseInfo.nodeId,
      ...query,
    },
    undefined,
    config
  );
}

export async function pushMessage4Task(name: string, query: any, config?: any) {
  operation.pushMessage4Task.baseURL = baseInfo.directURL;
  return frequest(operation.pushMessage4Task, null, query, undefined, config);
}
