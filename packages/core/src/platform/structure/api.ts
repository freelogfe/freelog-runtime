import frequest from "../../services/handler";
import exhibit from "../../services/api/modules/exhibit";
import contract from "../../services/api/modules/contract";
const isTest =  window.isTest;
// @ts-ignore
let nodeId = "";
export function init() {
  //@ts-ignore
  nodeId = window.freelogApp.nodeInfo.nodeId;
}
// 展品非授权信息接口
export async function getExhibitListById(query: any): Promise<any> {
  if (query && Object.prototype.toString.call(query) !== "[object Object]") {
    return "query parameter must be object";
  }
  if (isTest)
    //@ts-ignore
    return frequest.bind({ name: this.name })(
      exhibit.getTestExhibitById,
      [nodeId],
      {
        ...query,
      }
    );
  //@ts-ignore
  return frequest.bind({ name: this.name })(
    exhibit.getExhibitListById,
    [nodeId],
    {
      ...query,
    }
  );
}
export async function getExhibitListByPaging(query: any): Promise<any> {
  if (query && Object.prototype.toString.call(query) !== "[object Object]") {
    return Promise.reject("query parameter must be object");
  }
  if (isTest)
    // @ts-ignore
    return frequest.bind({ name: this.name })(
      exhibit.getTestExhibitByPaging,
      [nodeId],
      {
        ...query,
      }
    );
  // @ts-ignore
  return frequest.bind({ name: this.name })(
    exhibit.getExhibitListByPaging,
    [nodeId],
    {
      ...query,
    }
  );
}
export async function getSignStatistics(keywords:string) {
  // @ts-ignore
  return frequest(contract.getSignStatistics, "", {
    signUserIdentityType: 2,
    nodeId,
    keywords
  });
}
export async function getExhibitInfo(exhibitId: string, query: any) {
  if (isTest)
    // @ts-ignore
    return frequest(exhibit.getTestExhibitDetail, [nodeId, exhibitId], query);
  // @ts-ignore
  return frequest(exhibit.getExhibitDetail, [nodeId, exhibitId], query);
}
export async function getExhibitDepInfo(
  exhibitId: string,
  articleNids: string
) {
  if (isTest)
    // @ts-ignore
    return frequest(exhibit.getExhibitDepInfo, [nodeId, exhibitId], {
      articleNids,
    });
  // @ts-ignore
  return frequest(exhibit.getTestExhibitDepInfo, [nodeId, exhibitId], {
    articleNids,
  });
}

export async function getExhibitSignCount(exhibitId: string) {
  // @ts-ignore
  return frequest(exhibit.getExhibitSignCount, "", {
    subjectIds: exhibitId,
    subjectType: 2,
  });
}
export async function getExhibitAvailalbe(exhibitIds: string) {
  if (isTest) {
    return frequest(exhibit.getTestExhibitAuthStatus, [nodeId], {
      authType: 3 ,
      exhibitIds,
    });
  }
  // @ts-ignore
  return frequest(exhibit.getExhibitAuthStatus, [nodeId], {
    authType: 3,
    exhibitIds,
  });
}
export async function getExhibitAuthStatus(exhibitIds: string) {
  if (isTest) {
    return frequest(exhibit.getTestExhibitAuthStatus, [nodeId], {
      authType: window.isTest ? 3 : 4,
      exhibitIds,
    });
  }
  // @ts-ignore
  return frequest(exhibit.getExhibitAuthStatus, [nodeId], {
    authType: window.isTest ? 3 : 4,
    exhibitIds,
  });
}
// 展品授权信息接口
function getByExhibitId(
  name: string,
  exhibitId: string | number,
  type: string,
  parentNid?: string,
  subArticleIdOrName?: string,
  returnUrl?: boolean,
  config?: any
): Promise<any> | string {
  if (!exhibitId) {
    return "exhibitId is required";
  }
  let form: any = {};
  if (parentNid) {
    form.parentNid = parentNid;
  }
  if (subArticleIdOrName) {
    form.subArticleIdOrName = subArticleIdOrName;
  }
  if (isTest)
    return frequest.bind({
      name,
      isAuth: true,
      exhibitId: parentNid ? "" : exhibitId,
    })(
      exhibit.getTestExhibitAuthById,
      [nodeId, exhibitId, type],
      form,
      returnUrl,
      config
    );
  return frequest.bind({
    name,
    isAuth: true,
    exhibitId: parentNid ? "" : exhibitId,
  })(
    exhibit.getExhibitAuthById,
    [nodeId, exhibitId, type],
    form,
    returnUrl,
    config
  );
}
export async function getExhibitFileStream(
  exhibitId: string | number,
  returnUrl?: boolean,
  config?: any
) {
  // @ts-ignore
  return getByExhibitId(
    // @ts-ignore
    this.name,
    exhibitId,
    "fileStream",
    "",
    "",
    returnUrl,
    config
  );
}
export async function getExhibitResultByAuth(exhibitId: string | number) {
  // @ts-ignore
  return getByExhibitId(this.name, exhibitId, "result", "", "");
}
export async function getExhibitInfoByAuth(exhibitId: string | number) {
  // @ts-ignore
  return getByExhibitId(this.name, exhibitId, "info", "", "");
}
// 子依赖
export async function getExhibitDepFileStream(
  exhibitId: string | number,
  parentNid: string,
  subArticleId: string,
  returnUrl?: boolean,
  config?: any
) {
  if (!parentNid || !subArticleId) {
    return Promise.reject("parentNid and subArticleId is required!");
  }
  // @ts-ignore
  return getByExhibitId(
    // @ts-ignore
    this.name,
    exhibitId,
    "fileStream",
    parentNid,
    subArticleId,
    returnUrl,
    config
  );
}
