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
  if (baseInfo.isTest)
    //@ts-ignore
    return frequest.bind({ name })(
      exhibit.getTestExhibitListById,
      [baseInfo.nodeId],
      {
        ...options,
      }
    );
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
  if (baseInfo.isTest)
    return frequest.bind({ name })(
      exhibit.getTestExhibitByPaging,
      [baseInfo.nodeId],
      {
        ...options,
      }
    );
  return frequest.bind({ name })(
    exhibit.getExhibitListByPaging,
    [baseInfo.nodeId],
    {
      ...options,
    }
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
  if (baseInfo.isTest)
    return frequest(
      exhibit.getTestExhibitDetail,
      [baseInfo.nodeId, exhibitId],
      options
    );

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
  if (baseInfo.isTest)
    return frequest(
      exhibit.getTestExhibitDepInfo,
      [baseInfo.nodeId, exhibitId],
      {
        articleNids: query.articleNids,
      }
    );

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
  
  if (baseInfo.isTest) {
    return frequest(exhibit.getTestExhibitAuthStatus, [baseInfo.nodeId], {
      authType: 3,
      exhibitIds,
    });
  }
  // @ts-ignore
  return frequest(exhibit.getExhibitAuthStatus, [baseInfo.nodeId], {
    authType: 3,
    exhibitIds,
  });
}
export async function getExhibitAuthStatus(name: string, exhibitIds: string) {
  if (baseInfo.isTest) {
    return frequest(exhibit.getTestExhibitAuthStatus, [baseInfo.nodeId], {
      authType: baseInfo.isTest ? 3 : 4,
      exhibitIds,
    });
  }

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
  if (baseInfo.isTest)
    return frequest.bind({
      name,
      isAuth: true,
      exhibitId: parentNid ? "" : exhibitId,
    })(
      exhibit.getTestExhibitAuthById,
      [baseInfo.nodeId, exhibitId, type],
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
    [baseInfo.nodeId, exhibitId, type],
    form,
    returnUrl,
    config
  );
}
export async function getExhibitFileStream(
  name: string,
  exhibitId: string | number,
  options?: {
    returnUrl?: boolean;
    config?: any;
    subFilePath?: string; // 主题或插件的压缩包内部子作品,需要带相对路径
  }
) {
  options = options || {};
  return frequest.bind({
    name,
    isAuth: true,
    exhibitId: exhibitId,
  })(
    baseInfo.isTest ? exhibit.getTestExhibitById : exhibit.getExhibitById,
    [exhibitId],
    options?.subFilePath ? { subFilePath: options.subFilePath } : null,
    options?.returnUrl,
    options?.config
  );
}
// 子依赖
export async function getExhibitDepFileStream(
  name: string,
  exhibitId: string | number,
  query: {
    parentNid: string; // 依赖树上的父级节点ID,一般获取展品子依赖需要传递
    subArticleId: string; // 子依赖的作品ID
    returnUrl?: boolean;
    config?: any;
  }
) {
  return frequest.bind({
    name: name,
    isAuth: true,
    exhibitId: exhibitId,
  })(
    baseInfo.isTest ? exhibit.getTestExhibitById : exhibit.getExhibitById,
    [exhibitId],
    { parentNid: query.parentNid, subArticleIdOrName: query.subArticleId },
    query.returnUrl,
    query.config
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
