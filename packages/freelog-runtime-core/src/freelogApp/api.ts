import frequest from "./services/handler";
import exhibit from "./services/api/modules/exhibit";
import contract from "./services/api/modules/contract";
import operation from "./services/api/modules/operation";
import { baseInfo } from "../base/baseInfo";
// 展品非授权信息接口
export async function getExhibitListById(
  name: string,
  options?: {
    exhibitIds?: string; // 展品ID,多个用逗号分隔
    isLoadVersionProperty?: number; // 是否响应展品版本属性
    isLoadPolicyInfo?: number; // 是否加载策略信息.测试环境自动忽略此参数
    isTranslate?: number; // 是否同步翻译.测试环境自动忽略此参数
  }
): Promise<any> {
  options = options || {};
  //@ts-ignore
  return frequest.bind({ name })(
    exhibit.getExhibitListById,
    [baseInfo.nodeId],
    {
      ...options,
    }
  );
}
export async function getExhibitListByPaging(
  name: string,
  options?: {
    skip?: number; // 跳过的数量.默认为0.
    limit?: number; // 本次请求获取的数据条数.一般不允许超过100
    sort?: string; // 排序,格式为{排序字段}:{1|-1},1是正序,-1是倒序
    articleResourceTypes?: string; // 作品资源类型,多个用逗号分隔
    omitArticleResourceType?: string; // 忽略的作品资源类型,与resourceType参数互斥
    onlineStatus?: number; // 上线状态 (0:下线 1:上线 2:全部) 默认1
    tags?: string; // 用户创建presentable时设置的自定义标签,多个用","分割
    tagQueryType?: number; // tags的查询方式1:任意匹配一个标签 2:全部匹配所有标签 默认:1
    projection?: string; // 指定返回的字段,多个用逗号分隔
    keywords?: string; // 搜索关键字,目前支持模糊搜索节点资源名称和资源名称
    isLoadVersionProperty?: number; // 是否响应展品版本属性
    isLoadPolicyInfo?: number; // 是否加载策略信息.测试环境自动忽略此参数
    isTranslate?: number; // 是否同步翻译.测试环境自动忽略此参数
  }
): Promise<any> {
  options = options || {};
  return frequest.bind({ name })(
    exhibit.getExhibitListByPaging,
    [baseInfo.nodeId],
    {
      ...options,
    }
  );
}

export async function getExhibitRecommend(
  name: string,
  exhibitId: string,
  query: {
    recommendNorm: string; // 推荐指标多个用逗号分隔,优先级也按照实际顺序来, 具体指标为 resourceType: 相同资源类型 tag:相同标签(部分) latestCreate:最新创建的
    size?: number; // 推荐数量,默认是10, 最大100
  }
) {
  return frequest(
    exhibit.getExhibitRecommend,
    [baseInfo.nodeId, exhibitId],
    query
  );
}
export async function getSignStatistics(name: string, query?: any) {
  return frequest(contract.getSignStatistics, "", {
    signUserIdentityType: 2,
    nodeId: baseInfo.nodeId,
    ...query,
  });
}
export async function getExhibitInfo(
  name: string,
  exhibitId: string,
  options?: {
    isLoadPolicyInfo?: number; // 是否响应展品版本属性
    isLoadVersionProperty?: number; // 是否加载策略信息.测试环境自动忽略此参数
    isTranslate?: number; // 是否同步翻译.测试环境自动忽略此参数
    isLoadContract?: number; // 是否加载合约信息
  }
) {
  options = options || {};
  return frequest(
    exhibit.getExhibitDetail,
    [baseInfo.nodeId, exhibitId],
    options
  );
}
export async function getExhibitDepInfo(
  name: string,
  exhibitId: string,
  query: {
    articleNids: string; // 展品依赖的作品NID,多个用逗号分隔
  }
) {
  return frequest(exhibit.getExhibitDepInfo, [baseInfo.nodeId, exhibitId], {
    articleNids: query.articleNids,
  });
}

export async function getExhibitSignCount(name: string, exhibitIds: string) {
  return frequest(exhibit.getExhibitSignCount, "", {
    subjectIds: exhibitIds,
    subjectType: 2,
  });
}
// 获取展示是否授权链正常
export async function getExhibitAvailable(name: string, exhibitIds: string) {
  // @ts-ignore
  return frequest(exhibit.getExhibitAuthStatus, [baseInfo.nodeId], {
    authType: 3,
    exhibitIds,
  });
}
export async function getExhibitAuthStatus(name: string, exhibitIds: string) {
  return frequest(exhibit.getExhibitAuthStatus, [baseInfo.nodeId], {
    authType: baseInfo.isTest ? 3 : 4,
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

  return frequest.bind({
    name,
    isAuth: true,
    exhibitId: parentNid ? "" : exhibitId,
  })(
    exhibit.getExhibitAuthById,
    [baseInfo.nodeId, exhibitId, type],
    form,
    returnUrl,
    config
  );
}
// export async function getExhibitFileStream(
//   name: string,
//   exhibitId: string | number,
//   options?: {
//     returnUrl?: boolean;
//     config?: any;
//     subFilePath?: string; // 主题或插件的压缩包内部子作品,需要带相对路径
//   }
// ) {
//   options = options || {};
//   return frequest.bind({
//     name,
//     isAuth: true,
//     exhibitId: exhibitId,
//   })(
//     exhibit.getExhibitById,
//     [exhibitId],
//     options?.subFilePath ? { subFilePath: options.subFilePath } : null,
//     options?.returnUrl,
//     options?.config
//   );
// }
// // 子依赖
// export async function getExhibitDepFileStream(
//   name: string,
//   exhibitId: string | number,
//   query: {
//     parentNid: string; // 依赖树上的父级节点ID,一般获取展品子依赖需要传递
//     subArticleId: string; // 子依赖的作品ID
//     returnUrl?: boolean;
//     config?: any;
//   }
// ) {
//   return frequest.bind({
//     name: name,
//     isAuth: true,
//     exhibitId: exhibitId,
//   })(
//     exhibit.getExhibitById,
//     [exhibitId],
//     { parentNid: query.parentNid, subArticleIdOrName: query.subArticleId },
//     query?.returnUrl,
//     query.config
//   );
// }
export async function getExhibitFileStream(
  name: string,
  exhibitId: string | number,
  query: {
    returnUrl?: boolean;
    subFilePath?: string; // 作品内部子文件 路径
  }
) {
  return frequest.bind({
    name,
    isAuth: true,
    exhibitId: exhibitId,
  })(
    query?.subFilePath
      ? exhibit.getExhibitInsideById
      : exhibit.getExhibitById,
    query?.subFilePath ? [exhibitId, query?.subFilePath] : [exhibitId],
    null,
    query?.returnUrl
  );
}
 
export async function getExhibitDepFileStream(
  name: string,
  exhibitId: string | number,
  query: {
    nid: string | number;
    returnUrl?: boolean;
    subFilePath?: string;
  }
) {
  return frequest.bind({
    name,
    isAuth: true,
    exhibitId: exhibitId,
  })(
    query?.subFilePath
      ? exhibit.getExhibitDepInsideById
      : exhibit.getExhibitDepById,
    // @ts-ignore
    [exhibitId, query.nid, query?.subFilePath],
    null,
    query?.returnUrl
  );
}
export async function getExhibitResultByAuth(
  name: string,
  exhibitId: string | number
) {
  return getByExhibitId(name, exhibitId, "result", "", "");
}
export async function getExhibitInfoByAuth(
  name: string,
  exhibitId: string | number
) {
  return getByExhibitId(name, exhibitId, "info", "", "");
}

export async function pushMessage4Task(name: string, query: any) {
  return frequest(operation.pushMessage4Task, null, query);
}

export async function getCollectionSubList(
  name: string,
  exhibitId: string | number,
  query: any
) {
  return frequest.bind({
    name,
    exhibitId: exhibitId,
  })(exhibit.getCollectionSubListById, [baseInfo.nodeId, exhibitId], query);
}
export async function getCollectionsSubList(
  name: string,
  exhibitIds: string,
  query: any
) {
  return frequest.bind({
    name,
  })(exhibit.getCollectionSubListByIds, [baseInfo.nodeId], {
    ...query,
    exhibitIds,
  });
}
export async function getCollectionSubInfo(
  name: string,
  exhibitId: string | number,
  query: any
) {
  return frequest.bind({
    name,
    exhibitId: exhibitId,
  })(
    exhibit.getCollectionSubInfoById,
    [baseInfo.nodeId, exhibitId, query.itemId],
    null
  );
}
export async function getCollectionSubAuth(
  name: string,
  exhibitId: string | number,
  query: any
) {
  return frequest.bind({
    name,
    exhibitId: exhibitId,
  })(exhibit.getCollectionSubListAuthById, [baseInfo.nodeId, exhibitId], query);
}

export async function getCollectionSubFileStream(
  name: string,
  exhibitId: string | number,
  query: {
    itemId: string | number;
    returnUrl?: boolean;
    subFilePath?: string; // 作品内部子文件 路径
  }
) {
  return frequest.bind({
    name,
    isAuth: true,
    exhibitId: exhibitId,
  })(
    query?.subFilePath
      ? exhibit.getCollectionSubInsideById
      : exhibit.getCollectionSubById,
    query?.subFilePath
      ? [exhibitId, query.itemId, query?.subFilePath]
      : [exhibitId, query.itemId],
    null,
    query?.returnUrl
  );
}

export async function getCollectionSubDepList(
  name: string,
  exhibitId: string | number,
  query: {
    itemId: string | number;
    returnUrl?: boolean;
  }
) {
  return frequest.bind({
    name,
    exhibitId: exhibitId,
  })(
    exhibit.getCollectionSubDepById,
    [baseInfo.nodeId, exhibitId, query.itemId],
    null,
    query?.returnUrl
  );
}
export async function getCollectionSubDepFileStream(
  name: string,
  exhibitId: string | number,
  query: {
    itemId: string | number;
    nid: string | number;
    returnUrl?: boolean;
    subFilePath?: string;
  }
) {
  return frequest.bind({
    name,
    isAuth: true,
    exhibitId: exhibitId,
  })(
    query?.subFilePath
      ? exhibit.getCollectionSubDepInsideById
      : exhibit.getCollectionSubDepById,
    // @ts-ignore
    [exhibitId, query.itemId, query.nid, query?.subFilePath],
    null,
    query?.returnUrl
  );
}
