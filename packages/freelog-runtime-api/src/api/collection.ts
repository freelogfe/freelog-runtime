import frequest from "../services/handler";
import collection from "../services/api/modules/collection";
import { baseInfo } from "../index";
export async function getCollectionSubListByPage(
  name: string,
  exhibitId: string | number,
  query: any,
  config?: any 
) {
  return frequest.bind({
    name,
    exhibitId: exhibitId,
  })(
    collection.getCollectionSubPageById,
    [baseInfo.nodeId, exhibitId],
    query,
    undefined,
    config
  );
}
export async function getCollectionSubListAuthByPage(
  name: string,
  exhibitId: string | number,
  query: any,
  config?: any 
) {
  return frequest.bind({
    name,
    exhibitId: exhibitId,
  })(
    collection.getCollectionSubAuthPageById,
    [baseInfo.nodeId, exhibitId],
    query,
    undefined,
    config
  );
}
export async function getCollectionsSubListByPage(
  name: string,
  exhibitIds: string,
  query: any,
  config?: any
) {
  return frequest.bind({
    name,
  })(
    collection.getCollectionSubPageByIds,
    [baseInfo.nodeId],
    {
      ...query,
      exhibitIds,
    },
    undefined,
    config
  );
}
// 通过参数 authInfo 可以获取授权信息
export async function getCollectionSubById(
  name: string,
  exhibitId: string | number,
  query: any,
  config?: any
) {
  return frequest.bind({
    name,
    exhibitId: exhibitId,
  })(
    collection.getCollectionSubInfoById,
    [baseInfo.nodeId, exhibitId, query.itemId],
    query,
    undefined,
    config
  );
}
export async function getCollectionSubListById(
  name: string,
  exhibitId: string | number,
  query: any,
  config?: any
) {
  return frequest.bind({
    name,
    exhibitId: exhibitId,
  })(
    collection.getCollectionSubInfoByIds,
    [baseInfo.nodeId, exhibitId],
    query,
    undefined,
    config
  );
}
export async function getCollectionSubListAuthById(
  name: string,
  exhibitId: string | number,
  query: any,
  config?: any
) {
  return frequest.bind({
    name,
    exhibitId: exhibitId,
  })(
    collection.getCollectionSubInfoAuthByIds,
    [baseInfo.nodeId, exhibitId, query.itemId],
    null,
    undefined,
    config
  );
}
export async function getCollectionSubAuthStatus(
  name: string,
  exhibitId: string | number,
  query: any,
  config?: any
) {
  return frequest.bind({
    name,
    exhibitId: exhibitId,
  })(
    collection.getCollectionSubAuth,
    [baseInfo.nodeId, exhibitId],
    query,
    undefined,
    config
  );
}

export async function getCollectionSubFileStream(
  name: string,
  exhibitId: string | number,
  query: {
    itemId: string | number;
    returnUrl?: boolean;
    subFilePath?: string; // 作品内部子文件 路径
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
      ? collection.getCollectionSubInsideById
      : collection.getCollectionSubById,
    query?.subFilePath
      ? [exhibitId, query.itemId, query?.subFilePath]
      : [exhibitId, query.itemId],
    null,
    config?.returnUrl,
    config
  );
}

export async function getCollectionSubDepList(
  name: string,
  exhibitId: string | number,
  query: {
    itemId: string | number;
    // returnUrl?: boolean;
  },
  config?: any
) {
  return frequest.bind({
    name,
    exhibitId: exhibitId,
  })(
    collection.getCollectionSubDepById,
    [baseInfo.nodeId, exhibitId, query.itemId],
    null,
    undefined,
    config
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
    config?: any;
  },
  config?: any
) {
  return frequest.bind({
    name,
    isAuth: true,
    exhibitId: exhibitId,
  })(
    query?.subFilePath
      ? collection.getCollectionSubDepInsideById
      : collection.getCollectionSubDepById,
    // @ts-ignore
    [exhibitId, query.itemId, query.nid, query?.subFilePath],
    null,
    config?.returnUrl,
    config
  );
}
