
import frequest from "../../services/handler";
import presentable from '../../services/api/modules/presentable';
import resource from "../../services/api/modules/resource";
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
export async function getPresentables(query: any): Promise<any> {
  if (query && Object.prototype.toString.call(query) !== "[object Object]") {
    return "query parameter must be object";
  }
  if (isTest)
    //@ts-ignore
    return frequest.bind({ name: this.name })(
      presentable.getTestPagingData,
      [nodeId],
      {
        ...query,
      }
    );
  //@ts-ignore
  return frequest.bind({ name: this.name })(
    presentable.getPagingPresentables,
    "",
    {
      nodeId,
      ...query,
    }
  );
}
export async function getPresentablesPaging(query: any): Promise<any> {
  if (query && Object.prototype.toString.call(query) !== "[object Object]") {
    return "query parameter must be object";
  }
  if (isTest)
    // @ts-ignore
    return frequest.bind({ name: this.name })(
      presentable.getTestPagingData,
      [nodeId],
      {
        ...query,
      }
    );
  // @ts-ignore
  return frequest.bind({ name: this.name })(
    presentable.getPagingPresentables,
    "",
    {
      nodeId,
      ...query,
    }
  );
}
export async function getExhibitsByIds(query: any): Promise<any> {
  if (query && Object.prototype.toString.call(query) !== "[object Object]") {
    return "query parameter must be object";
  }
  if (isTest)
    // @ts-ignore
    return frequest.bind({ name: this.name })(
      presentable.getTestPagingData,
      [nodeId],
      {
        ...query,
      }
    );
  // @ts-ignore
  return frequest.bind({ name: this.name })(presentable.getPresentables, "", {
    nodeId,
    ...query,
  });
}

// 展品授权信息接口
function getByPresentableId(
  name: string,
  exhibitId: string | number,
  type: string,
  parentNid?: string,
  subResourceIdOrName?: string,
  returnUrl?: boolean,
  config?: any
): Promise<any> | string {
  if (!exhibitId) {
    return "exhibitId is required";
  }
  let test: any = {};
  let form: any = {};
  if (parentNid) {
    test.parentNid = parentNid;
    form.parentNid = parentNid;
  }
  if (subResourceIdOrName) {
    test.subEntityIdOrName = subResourceIdOrName;
    form.subResourceIdOrName = subResourceIdOrName;
  }
  if (isTest)
    return frequest.bind({ name, exhibitId })(
      presentable.getTestByPresentableId,
      [exhibitId, type],
      test,
      returnUrl,
      config
    );
  return frequest.bind({ name, exhibitId: parentNid ? "" : exhibitId })(
    presentable.getByPresentableId,
    [exhibitId, type],
    form,
    returnUrl,
    config
  );
}
export async function getResultById(exhibitId: string | number) {
  // @ts-ignore
  return getByPresentableId(this.name, exhibitId, "result", "", "");
}
export async function getInfoById(exhibitId: string | number) {
  // @ts-ignore
  return getByPresentableId(this.name, exhibitId, "info", "", "");
}
export async function getResourceInfoById(exhibitId: string | number) {
  if (isTest) return "not supported!";
  // @ts-ignore
  return getByPresentableId(this.name, exhibitId, "articleInfo", "", "");
}
export async function getFileStreamById(
  exhibitId: string | number,
  returnUrl?: boolean,
  config?: any
) {
  // @ts-ignore
  return getByPresentableId(
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
export async function getSubResultById(
  exhibitId: string | number,
  parentNid: string,
  subResourceIdOrName: string
) {
  if (!parentNid || !subResourceIdOrName) {
    return "parentNid and subResourceIdOrName is required!";
  }
  // @ts-ignore
  return getByPresentableId(
    // @ts-ignore
    this.name,
    exhibitId,
    "result",
    parentNid,
    subResourceIdOrName
  );
}
export async function getSubInfoById(
  exhibitId: string | number,
  parentNid: string,
  subResourceIdOrName: string
) {
  if (!parentNid || !subResourceIdOrName) {
    return "parentNid and subResourceIdOrName is required!";
  }
  // @ts-ignore
  return getByPresentableId(
    // @ts-ignore
    this.name,
    exhibitId,
    "info",
    parentNid,
    subResourceIdOrName
  );
}
export async function getSubResourceInfoById(
  exhibitId: string | number, // 主题请求自己的依赖，传自己的presentableId 和 自己的parentNid
  parentNid: string, // 主题的依赖请求自己的依赖，传主题的presentableId 和 自己的parentNid
  subResourceIdOrName: string
) {
  if (!parentNid || !subResourceIdOrName) {
    return "parentNid and subResourceIdOrName is required!";
  }
  if (isTest) return "not supported!";
  // @ts-ignore
  return getByPresentableId(
    // @ts-ignore
    this.name,
    exhibitId,
    "articleInfo",
    parentNid,
    subResourceIdOrName
  );
}
export async function getSubFileStreamById(
  exhibitId: string | number,
  parentNid: string,
  subResourceIdOrName: string,
  returnUrl?: boolean,
  config?: any
) {
  if (!parentNid || !subResourceIdOrName) {
    return "parentNid and subResourceIdOrName is required!";
  }
  // @ts-ignore
  return getByPresentableId(
    // @ts-ignore
    this.name,
    exhibitId,
    "fileStream",
    parentNid,
    subResourceIdOrName,
    returnUrl,
    config
  );
}

// TODO return a promise
function getByResourceIdOrName(
  name: string,
  articleIdOrName: string | number,
  type: string,
  parentNid?: string,
  subResourceIdOrName?: string,
  returnUrl?: boolean,
  config?: any
): Promise<any> | string {
  if (!articleIdOrName) {
    return "articleIdOrName is required";
  }
  let test: any = {};
  let form: any = {};
  if (parentNid) {
    test.parentNid = parentNid;
    form.parentNid = parentNid;
  }
  if (subResourceIdOrName) {
    test.subEntityIdOrName = subResourceIdOrName;
    form.subResourceIdOrName = subResourceIdOrName;
  }
  if (isTest)
    return frequest.bind({
      name,
      articleIdOrName: parentNid ? "" : articleIdOrName,
    })(
      presentable.getTestByResourceIdOrName,
      [articleIdOrName, type],
      test,
      returnUrl,
      config
    );
  return frequest.bind({
    name,
    articleIdOrName: parentNid ? "" : articleIdOrName,
  })(
    presentable.getByResourceIdOrName,
    [nodeId, articleIdOrName, type],
    form,
    returnUrl,
    config
  );
}
export async function getResultByName(articleIdOrName: string | number) {
  // @ts-ignore
  return getByResourceIdOrName(this.name, articleIdOrName, "result", "", "");
}
export async function getInfoByName(articleIdOrName: string | number) {
  // @ts-ignore
  return getByResourceIdOrName(this.name, articleIdOrName, "info", "", "");
}
export async function getResourceInfoByName(articleIdOrName: string | number) {
  if (isTest) return "not supported!";
  // @ts-ignore
  return getByResourceIdOrName(
    // @ts-ignore
    this.name,
    articleIdOrName,
    "articleInfo",
    "",
    ""
  );
}
export async function getFileStreamByName(
  articleIdOrName: string | number,
  returnUrl?: boolean,
  config?: any
) {
  // @ts-ignore
  return getByResourceIdOrName(
    // @ts-ignore
    this.name,
    articleIdOrName,
    "fileStream",
    "",
    "",
    returnUrl,
    config
  );
}
// sub
export async function getSubResultByName(
  articleIdOrName: string | number,
  parentNid: string,
  subResourceIdOrName: string
) {
  if (!parentNid || !subResourceIdOrName) {
    return "parentNid and subResourceIdOrName is required!";
  }
  return getByResourceIdOrName(
    // @ts-ignore
    this.name,
    articleIdOrName,
    "result",
    parentNid,
    subResourceIdOrName
  );
}
export async function getSubInfoByName(
  articleIdOrName: string | number,
  parentNid: string,
  subResourceIdOrName: string
) {
  if (!parentNid || !subResourceIdOrName) {
    return "parentNid and subResourceIdOrName is required!";
  }
  return getByResourceIdOrName(
    // @ts-ignore
    this.name,
    articleIdOrName,
    "info",
    parentNid,
    subResourceIdOrName
  );
}
export async function getSubResourceInfoByName(
  articleIdOrName: string | number,
  parentNid: string,
  subResourceIdOrName: string
) {
  if (!parentNid || !subResourceIdOrName) {
    return "parentNid and subResourceIdOrName is required!";
  }
  if (isTest) return "not supported!";
  return getByResourceIdOrName(
    // @ts-ignore
    this.name,
    articleIdOrName,
    "articleInfo",
    parentNid,
    subResourceIdOrName
  );
}
export async function getSubFileStreamByName(
  articleIdOrName: string | number,
  parentNid: string,
  subResourceIdOrName: string,
  returnUrl?: boolean,
  config?: any
) {
  if (!parentNid || !subResourceIdOrName) {
    return "parentNid and subResourceIdOrName is required!";
  }
  return getByResourceIdOrName(
    // @ts-ignore
    this.name,
    articleIdOrName,
    "fileStream",
    parentNid,
    subResourceIdOrName,
    returnUrl,
    config
  );
}

export async function getResourceInfoByVersion(
  articleId: string,
  version: string,
  projection: string = ""
) {
  // @ts-ignore
  return frequest(
    resource.getResourceInfoByVersion,
    [articleId, version, projection],
    ''
  );
}
export async function getPresentableDetailById(
  exhibitId: string, query: any
) {
  // @ts-ignore
  return frequest(
    presentable.getPresentableDetail,
    [exhibitId],
    query
  );
}

export async function getPresentableSignCount(
  exhibitId: string 
) {
  // @ts-ignore
  return frequest(
    presentable.getPresentableSignCount,
    "",
    {
      subjectIds: exhibitId,
      subjectType: 2
    }
  );
}
export async function getPresentablesAuth(
   exhibitIds: string 
) {
  // @ts-ignore
  return frequest(
    presentable.getPresentablesAuth,
    [nodeId],
    {
      authType: 4,
      exhibitIds
    }
  );
}
