import frequest from "../../services/handler";
import exhibit from "../../services/api/modules/exhibit";
let isTest = false;
if (
  window.location.href
    .replace("http://", "")
    .replace("https://", "")
    .indexOf("t.") === 0
) {
  isTest = true;
}
// @ts-ignore
let nodeId = "";
export function init() {
  //@ts-ignore
  nodeId = window.freelogApp.nodeInfo.nodeId;
}
// 展品非授权信息接口
export async function getExhibitsByIds(query: any): Promise<any> {
  if (query && Object.prototype.toString.call(query) !== "[object Object]") {
    return "query parameter must be object";
  }
  if (isTest)
    //@ts-ignore
    return frequest.bind({ name: this.name })(
      exhibit.getTestExhibitsByIds,
      [nodeId],
      {
        ...query,
      }
    );
  //@ts-ignore
  return frequest.bind({ name: this.name })(
    exhibit.getExhibitsByIds,
    [nodeId],
    {
      ...query,
    }
  );
}
export async function getExhibitsByPaging(query: any): Promise<any> {
  if (query && Object.prototype.toString.call(query) !== "[object Object]") {
    return "query parameter must be object";
  }
  if (isTest)
    // @ts-ignore
    return frequest.bind({ name: this.name })(
      exhibit.getTestExhibitsByPaging,
      [nodeId],
      {
        ...query,
      }
    );
  // @ts-ignore
  return frequest.bind({ name: this.name })(exhibit.getExhibitsByPaging, "", {
    nodeId,
    ...query,
  });
}
export async function getExhibitsDetail(exhibitId: string, query: any) {
  if (isTest)
    // @ts-ignore
    return frequest(exhibit.getTestExhibitsDetail, [nodeId, exhibitId], query);
  // @ts-ignore
  return frequest(exhibit.getExhibitsDetail, [nodeId, exhibitId], query);
}

export async function getExhibitsSignCount(exhibitId: string) {
  // @ts-ignore
  return frequest(exhibit.getExhibitsSignCount, "", {
    subjectIds: exhibitId,
    subjectType: 2,
  });
}
export async function getExhibitsAuth(exhibitIds: string) {
  if (isTest) {
    return frequest(exhibit.getTestExhibitsAuth, [nodeId], {
      authType: 4,
      exhibitIds,
    });
  }
  // @ts-ignore
  return frequest(exhibit.getExhibitsAuth, [nodeId], {
    authType: 4,
    exhibitIds,
  });
}
// 展品授权信息接口
function getByExhibitId(
  name: string,
  exhibitId: string | number,
  type: string,
  parentNid?: string,
  subWorkIdOrName?: string,
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
  if (subWorkIdOrName) {
    form.subWorkIdOrName = subWorkIdOrName;
  }
  if (isTest)
    return frequest.bind({ name, exhibitId })(
      exhibit.getTestExhibitAuthById,
      [nodeId, exhibitId, type],
      form,
      returnUrl,
      config
    );
  return frequest.bind({ name, exhibitId: parentNid ? "" : exhibitId })(
    exhibit.getExhibitAuthById,
    [nodeId, exhibitId, type],
    form,
    returnUrl,
    config
  );
}
export async function getExhibitResultById(exhibitId: string | number) {
  // @ts-ignore
  return getByExhibitId(this.name, exhibitId, "result", "", "");
}
export async function getExhibitInfoById(exhibitId: string | number) {
  // @ts-ignore
  return getByExhibitId(this.name, exhibitId, "info", "", "");
}
export async function getExhibitFileStreamById(
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
// 子依赖
export async function getExhibitSubResultById(
  exhibitId: string | number,
  parentNid: string,
  subWorkId: string
) {
  if (!parentNid || !subWorkId) {
    return "parentNid and subWorkId is required!";
  }
  // @ts-ignore
  return getByExhibitId(
    // @ts-ignore
    this.name,
    exhibitId,
    "result",
    parentNid,
    subWorkId
  );
}
export async function getExhibitSubInfoById(
  exhibitId: string | number,
  parentNid: string,
  subWorkId: string
) {
  if (!parentNid || !subWorkId) {
    return "parentNid and subWorkId is required!";
  }
  // @ts-ignore
  return getByExhibitId(
    // @ts-ignore
    this.name,
    exhibitId,
    "info",
    parentNid,
    subWorkId
  );
}
export async function getExhibitSubFileStreamById(
  exhibitId: string | number,
  parentNid: string,
  subWorkId: string,
  returnUrl?: boolean,
  config?: any
) {
  if (!parentNid || !subWorkId) {
    return "parentNid and subWorkId is required!";
  }
  // @ts-ignore
  return getByExhibitId(
    // @ts-ignore
    this.name,
    exhibitId,
    "fileStream",
    parentNid,
    subWorkId,
    returnUrl,
    config
  );
}

// TODO return a promise
function getExhibitAuthByWorkIdOrName(
  name: string,
  articleIdOrName: string | number,
  type: string,
  parentNid?: string,
  subWorkIdOrName?: string,
  returnUrl?: boolean,
  config?: any
): Promise<any> | string {
  if (!articleIdOrName) {
    return Promise.reject("articleIdOrName is required");
  }
  let form: any = {};
  if (parentNid) {
    form.parentNid = parentNid;
  }
  if (subWorkIdOrName) {
    form.subWorkIdOrName = subWorkIdOrName;
  }
  if (isTest)
    return frequest.bind({
      name,
      articleIdOrName: parentNid ? "" : subWorkIdOrName,
    })(
      exhibit.getTestExhibitAuthByWorkIdOrName,
      [nodeId, articleIdOrName, type],
      form,
      returnUrl,
      config
    );
  return frequest.bind({
    name,
    articleIdOrName: parentNid ? "" : articleIdOrName,
  })(
    exhibit.getExhibitAuthByWorkIdOrName,
    [nodeId, articleIdOrName, type],
    form,
    returnUrl,
    config
  );
}
export async function getExhibitResultByWorkId(articleId: string | number) {
  // @ts-ignore
  return getExhibitAuthByWorkIdOrName(this.name, articleId, "result", "", "");
}
export async function getExhibitInfoByWorkId(articleId: string | number) {
  // @ts-ignore
  return getExhibitAuthByWorkIdOrName(this.name, articleId, "info", "", "");
}

export async function getExhibitFileStreamByWorkId(
  articleId: string | number,
  returnUrl?: boolean,
  config?: any
) {
  // @ts-ignore
  return getExhibitAuthByWorkIdOrName(
    // @ts-ignore
    this.name,
    articleId,
    "fileStream",
    "",
    "",
    returnUrl,
    config
  );
}
// sub
export async function getExhibitSubResultByWorkId(
  articleId: string | number,
  parentNid: string,
  subWorkId: string
) {
  if (!parentNid || !subWorkId) {
    return Promise.resolve("parentNid and subWorkId are required!");
  }
  return getExhibitAuthByWorkIdOrName(
    // @ts-ignore
    this.name,
    articleId,
    "result",
    parentNid,
    subWorkId
  );
}
export async function getExhibitSubInfoByWorkId(
  articleId: string | number,
  parentNid: string,
  subWorkId: string
) {
  if (!parentNid || !subWorkId) {
    return Promise.resolve("parentNid and subWorkId are required!");
  }
  return getExhibitAuthByWorkIdOrName(
    // @ts-ignore
    this.name,
    articleId,
    "info",
    parentNid,
    subWorkId
  );
}
export async function getExhibitSubFileStreamByWorkId(
  articleIdOrName: string | number,
  parentNid: string,
  subWorkId: string,
  returnUrl?: boolean,
  config?: any
) {
  if (!parentNid || !subWorkId) {
    return Promise.resolve("parentNid and subWorkId are required!");
  }
  return getExhibitAuthByWorkIdOrName(
    // @ts-ignore
    this.name,
    articleIdOrName,
    "fileStream",
    parentNid,
    subWorkId,
    returnUrl,
    config
  );
}
