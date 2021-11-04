
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
export async function getPresentablesSearch(query: any): Promise<any> {
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
  presentableId: string | number,
  type: string,
  parentNid?: string,
  subResourceIdOrName?: string,
  returnUrl?: boolean,
  config?: any
): Promise<any> | string {
  if (!presentableId) {
    return "presentableId is required";
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
    return frequest.bind({ name, presentableId })(
      presentable.getTestByPresentableId,
      [presentableId, type],
      test,
      returnUrl,
      config
    );
  return frequest.bind({ name, presentableId: parentNid ? "" : presentableId })(
    presentable.getByPresentableId,
    [presentableId, type],
    form,
    returnUrl,
    config
  );
}
export async function getResultById(presentableId: string | number) {
  // @ts-ignore
  return getByPresentableId(this.name, presentableId, "result", "", "");
}
export async function getInfoById(presentableId: string | number) {
  // @ts-ignore
  return getByPresentableId(this.name, presentableId, "info", "", "");
}
export async function getResourceInfoById(presentableId: string | number) {
  if (isTest) return "not supported!";
  // @ts-ignore
  return getByPresentableId(this.name, presentableId, "resourceInfo", "", "");
}
export async function getFileStreamById(
  presentableId: string | number,
  returnUrl?: boolean,
  config?: any
) {
  // @ts-ignore
  return getByPresentableId(
    // @ts-ignore
    this.name,
    presentableId,
    "fileStream",
    "",
    "",
    returnUrl,
    config
  );
}
// 子依赖
export async function getSubResultById(
  presentableId: string | number,
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
    presentableId,
    "result",
    parentNid,
    subResourceIdOrName
  );
}
export async function getSubInfoById(
  presentableId: string | number,
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
    presentableId,
    "info",
    parentNid,
    subResourceIdOrName
  );
}
export async function getSubResourceInfoById(
  presentableId: string | number, // 主题请求自己的依赖，传自己的presentableId 和 自己的parentNid
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
    presentableId,
    "resourceInfo",
    parentNid,
    subResourceIdOrName
  );
}
export async function getSubFileStreamById(
  presentableId: string | number,
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
    presentableId,
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
  resourceIdOrName: string | number,
  type: string,
  parentNid?: string,
  subResourceIdOrName?: string,
  returnUrl?: boolean,
  config?: any
): Promise<any> | string {
  if (!resourceIdOrName) {
    return "resourceIdOrName is required";
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
      resourceIdOrName: parentNid ? "" : resourceIdOrName,
    })(
      presentable.getTestByResourceIdOrName,
      [resourceIdOrName, type],
      test,
      returnUrl,
      config
    );
  return frequest.bind({
    name,
    resourceIdOrName: parentNid ? "" : resourceIdOrName,
  })(
    presentable.getByResourceIdOrName,
    [nodeId, resourceIdOrName, type],
    form,
    returnUrl,
    config
  );
}
export async function getResultByName(resourceIdOrName: string | number) {
  // @ts-ignore
  return getByResourceIdOrName(this.name, resourceIdOrName, "result", "", "");
}
export async function getInfoByName(resourceIdOrName: string | number) {
  // @ts-ignore
  return getByResourceIdOrName(this.name, resourceIdOrName, "info", "", "");
}
export async function getResourceInfoByName(resourceIdOrName: string | number) {
  if (isTest) return "not supported!";
  // @ts-ignore
  return getByResourceIdOrName(
    // @ts-ignore
    this.name,
    resourceIdOrName,
    "resourceInfo",
    "",
    ""
  );
}
export async function getFileStreamByName(
  resourceIdOrName: string | number,
  returnUrl?: boolean,
  config?: any
) {
  // @ts-ignore
  return getByResourceIdOrName(
    // @ts-ignore
    this.name,
    resourceIdOrName,
    "fileStream",
    "",
    "",
    returnUrl,
    config
  );
}
// sub
export async function getSubResultByName(
  resourceIdOrName: string | number,
  parentNid: string,
  subResourceIdOrName: string
) {
  if (!parentNid || !subResourceIdOrName) {
    return "parentNid and subResourceIdOrName is required!";
  }
  return getByResourceIdOrName(
    // @ts-ignore
    this.name,
    resourceIdOrName,
    "result",
    parentNid,
    subResourceIdOrName
  );
}
export async function getSubInfoByName(
  resourceIdOrName: string | number,
  parentNid: string,
  subResourceIdOrName: string
) {
  if (!parentNid || !subResourceIdOrName) {
    return "parentNid and subResourceIdOrName is required!";
  }
  return getByResourceIdOrName(
    // @ts-ignore
    this.name,
    resourceIdOrName,
    "info",
    parentNid,
    subResourceIdOrName
  );
}
export async function getSubResourceInfoByName(
  resourceIdOrName: string | number,
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
    resourceIdOrName,
    "resourceInfo",
    parentNid,
    subResourceIdOrName
  );
}
export async function getSubFileStreamByName(
  resourceIdOrName: string | number,
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
    resourceIdOrName,
    "fileStream",
    parentNid,
    subResourceIdOrName,
    returnUrl,
    config
  );
}

export async function getResourceInfoByVersion(
  resourceId: string,
  version: string,
  projection: string = ""
) {
  // @ts-ignore
  return frequest(
    resource.getResourceInfoByVersion,
    [resourceId, version, projection],
    ''
  );
}
export async function getPresentableDetailById(
  presentableId: string, query: any
) {
  // @ts-ignore
  return frequest(
    presentable.getPresentableDetail,
    [presentableId],
    query
  );
}

export async function getPresentableSignCount(
  presentableId: string 
) {
  // @ts-ignore
  return frequest(
    presentable.getPresentableSignCount,
    "",
    {
      subjectId: presentableId,
      subjectType: 2
    }
  );
}
export async function getPresentablesAuth(
   presentableIds: string 
) {
  // @ts-ignore
  return frequest(
    presentable.getPresentablesAuth,
    [nodeId],
    {
      authType: 4,
      presentableIds
    }
  );
}
