import frequest from "../services/handler";
import exhibit from "../services/api/modules/exhibit";

import { baseInfo } from "../index";
// 展品非授权信息接口
export async function getExhibitById(
  name: string,
  exhibitId: string,
  query?: {
    authInfo?: number;
    isLoadPolicyInfo?: number; // 是否响应展品版本属性
    isLoadVersionProperty?: number; // 是否加载策略信息.测试环境自动忽略此参数
    isTranslate?: number; // 是否同步翻译.测试环境自动忽略此参数
    isLoadContract?: number; // 是否加载合约信息
  },
  config?: any
) {
  query = query || {};
  return frequest(
    exhibit.getExhibitDetail,
    [baseInfo.nodeId, exhibitId],
    query,
    undefined,
    config
  );
}
export async function getExhibitListById(
  name: string,
  query?: {
    exhibitIds?: string; // 展品ID,多个用逗号分隔
    isLoadVersionProperty?: number; // 是否响应展品版本属性
    isLoadPolicyInfo?: number; // 是否加载策略信息.测试环境自动忽略此参数
    isTranslate?: number; // 是否同步翻译.测试环境自动忽略此参数
  },
  config?: any
): Promise<any> {
  query = query || {};
  //@ts-ignore
  return frequest.bind({ name })(
    exhibit.getExhibitListById,
    [baseInfo.nodeId],
    {
      ...query,
    },
    undefined,
    config
  );
}

export async function getExhibiListAuthById(
  name: string,
  query?: {
    exhibitIds?: string; // 展品ID,多个用逗号分隔
    isLoadVersionProperty?: number; // 是否响应展品版本属性
    isLoadPolicyInfo?: number; // 是否加载策略信息.测试环境自动忽略此参数
    isTranslate?: number; // 是否同步翻译.测试环境自动忽略此参数
  },
  config?: any
): Promise<any> {
  query = query || {};
  //@ts-ignore
  return frequest.bind({ name })(
    exhibit.getExhibiListAuthById,
    [baseInfo.nodeId],
    {
      ...query,
    },
    undefined,
    config
  );
}
export async function getExhibitListByPage(
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
  },
  config?: any
): Promise<any> {
  options = options || {};
  return frequest.bind({ name })(
    exhibit.getExhibitListByPage,
    [baseInfo.nodeId],
    {
      ...options,
    },
    undefined,
    config
  );
}

export async function getExhibitListAuthByPage(
  name: string,
  options?: {
    // allInfo?: number; // 0或1，默认0，传1则返回所有信息，否则只有授权信息
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
  },
  config?: any
): Promise<any> {
  options = options || {};
  return frequest.bind({ name })(
    exhibit.getExhibitListAuthByPage,
    [baseInfo.nodeId],
    {
      ...options,
    },
    undefined,
    config
  );
}
export async function getExhibitAuthStatus(
  name: string,
  exhibitIds: string,
  query?: any,
  config?: any
) {
  return frequest(
    exhibit.getExhibitAuthStatus,
    [baseInfo.nodeId],
    {
      authType: baseInfo.isTest ? 3 : 4,
      exhibitIds,
    },
    undefined,
    config
  );
}
// 获取展示是否授权链正常
export async function getExhibitAvailable(
  name: string,
  exhibitIds: string,
  query?: any,
  config?: any
) {
  // @ts-ignore
  return frequest(
    exhibit.getExhibitAuthStatus,
    [baseInfo.nodeId],
    {
      authType: 3,
      exhibitIds,
    },
    undefined,
    config
  );
}

export async function getExhibitRecommend(
  name: string,
  exhibitId: string,
  query?: {
    recommendNorm: string; // 推荐指标多个用逗号分隔,优先级也按照实际顺序来, 具体指标为 resourceType: 相同资源类型 tag:相同标签(部分) latestCreate:最新创建的
    size?: number; // 推荐数量,默认是10, 最大100
  },
  config?: any
) {
  return frequest(
    exhibit.getExhibitRecommend,
    [baseInfo.nodeId, exhibitId],
    query,
    undefined,
    config
  );
}

export async function getExhibitDepInfo(
  name: string,
  exhibitId: string,
  query: {
    articleNids: string; // 展品依赖的作品NID,多个用逗号分隔
  },
  config?: any
) {
  return frequest(
    exhibit.getExhibitDepInfo,
    [baseInfo.nodeId, exhibitId],
    {
      articleNids: query.articleNids,
    },
    undefined,
    config
  );
}

export async function getExhibitSignCount(
  name: string,
  exhibitIds: string,
  query?: any,
  config?: any
) {
  return frequest(
    exhibit.getExhibitSignCount,
    [baseInfo.nodeId],
    {
      subjectIds: exhibitIds,
      subjectType: 2,
    },
    undefined,
    config
  );
}


export async function getExhibitFileStream(
  name: string,
  exhibitId: string | number,
  query: {
    returnUrl?: boolean;
    subFilePath?: string; // 作品内部子文件 路径
    config?: any;
  },
  config: any
) {
  if (!config) {
    config = query?.config || {};
    config = {
      returnUrl: query?.returnUrl,
      ...config,
    };
  }
  return frequest.bind({
    name,
    isAuth: true,
    exhibitId: exhibitId,
  })(
    query?.subFilePath ? exhibit.getExhibitInsideById : exhibit.getExhibitById,
    query?.subFilePath ? [exhibitId, query?.subFilePath] : [exhibitId],
    null,
    config?.returnUrl,
    config
  );
}

export async function getExhibitDepFileStream(
  name: string,
  exhibitId: string | number,
  query: {
    nid: string | number;
    returnUrl?: boolean;
    subFilePath?: string;
    config?: any;
  },
  config?: any
) {
  if (!config) {
    config = query?.config || {};
    config = {
      returnUrl: query?.returnUrl,
      ...config,
    };
  }
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
    config?.returnUrl,
    config
  );
}
