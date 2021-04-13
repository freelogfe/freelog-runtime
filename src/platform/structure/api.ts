/**
 * 1.开始：流程获取主题  
 * 2.准备：获取主题依赖的插件极其依赖   主题里面不能有js   是否请求所有展品名称（相当于id）用于判定根据名称的请求是否需要发起
 * 3.判断：插件和依赖授权与否
 *     3.1存在没有授权的且为必须授权
 *        弹出批量签约 左右滑动滚动方式
 *     3.2存在没有授权的且为非必须授权
 *        此种情况暂不考虑
 * 4.已授权：
 *   4.1 准备插件对象 flatternWidgets childrenWidgets sandBoxs 
 *   4.2 加载主题内的非点击按钮加载的插件
 *   4.3 父插件加载完成后加载插件内的插件（获取插件标签失败后转为提供api给插件自己加载）  
 *   4.3 准备api提供给插件懒加载或插件内的插件加载（前置方法检查容器是否存在，不存在则终止）
 *       考虑问题：插件内部依赖几十个资源，在不同路由里面加载。
 *       解决办法：提供
 * api汇总：
 *   开发者模式：需要与真实节点访问场景相同，因为涉及签约等事件需要开发模式下测试
 *          
 *       1.多插件模式：即主题模式
 *          
 *       2.单插件模式：直接加载一个应用，也可认为就写了一个插件的主题
 *       理应有主入口
 *       提供测试节点，例如snnaenu.devfreelog.com
 * 
 * 展品api：
 * 1.获取单个展品
 *   公共参数：response-type: result (标准授权响应结果)
 *            query参数：
 *                parentNid：依赖树上的父级节点ID,一般获取展品子依赖需要传递
 *                subResourceIdOrName：子依赖的资源ID或者名称
 *            公共http-header：
 *                freelog-entity-nid： string	当前响应的展品的依赖树链路ID
 *                freelog-sub-dependencies：	string	当前展品的子依赖,encodeURIComponent编码的json字符串
 *                freelog-resource-type： string	资源类型
 *                freelog-resource-property： string	资源meta信息,encodeURIComponent编码过的json字符串
 *            响应类型：result|info|resourceInfo|fileStream
 *                result (标准授权响应结果)
 *                info (展品信息)
 *                resourceInfo (资源信息) 
 *                fileStream (文件流)
 * 
 *   url1: https://api.freelog.com/v2/auths/presentables/{presentableId}/{result|info|resourceInfo|fileStream}
 *         presentableId: 展品id
 *         
 *   
 *   url2: https://api.freelog.com/v2/auths/presentables/nodes/{nodeId}/{resourceIdOrName}/{result|info|resourceInfo|fileStream}
 *         presentableId: 展品id
 *         resourceIdOrName： 资源ID或者名称,需要encodeURIComponent编码

 * 2.获取多个展品
 *   url:  https://api.freelog.com/v2/presentables?nodeId={nodeId}
 *        
 *        
 * 
 *      skip	可选	int	跳过的数量.默认为0.
        limit	可选	int	本次请求获取的数据条数.一般不允许超过100
        resourceType	可选	string	资源类型
        omitResourceType	可选	string	忽略的资源类型,与resourceType参数互斥
        onlineStatus	可选	int	上线状态 (0:下线 1:上线 2:全部) 默认1
        tags	可选	string	用户创建presentable时设置的自定义标签,多个用","分割
        projection	可选	string	指定返回的字段,多个用逗号分隔
        keywords	可选	string[1,100]	搜索关键字,目前支持模糊搜索节点资源名称和资源名称
        isLoadVersionProperty	可选	int	是否响应展品版本属性
        isLoadPolicyInfo	可选	int	是否加载策略信息
 *          
 */
import frequest from "../../services/handler";
import presentable from "../../services/api/modules/presentable";
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
export async function getPresentables(query: any): Promise<any> {
  if (query && Object.prototype.toString.call(query) !== "[object Object]") {
    return "query parameter must be object";
  }
  if (isTest)
    return frequest(presentable.getTestPagingData, [nodeId], { ...query });
  return frequest(presentable.getPagingData, "", { nodeId, ...query });
}
// TODO return a promise
function getByPresentableId(
  presentableId: string | number,
  type: string,
  parentNid: string,
  subResourceIdOrName: string,
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
    return frequest(
      presentable.getTestByPresentableId,
      [presentableId, type],
      test,
      returnUrl,
      config
    );
  return frequest(
    presentable.getByPresentableId,
    [presentableId, type],
    form,
    returnUrl,
    config
  );
}
export async function getResultById(presentableId: string | number) {
  return getByPresentableId(presentableId, "result", "", "");
}
export async function getInfoById(presentableId: string | number) {
  return getByPresentableId(presentableId, "info", "", "");
}
export async function getResourceInfoById(presentableId: string | number) {
  if (isTest) return "not supported!";
  return getByPresentableId(presentableId, "resourceInfo", "", "");
}
export async function getFileStreamById(
  presentableId: string | number,
  returnUrl?: boolean,
  config?: any
) {
  return getByPresentableId(
    presentableId,
    "fileStream",
    "",
    "",
    returnUrl,
    config
  );
}
// sub
export async function getSubResultById(
  presentableId: string | number,
  parentNid: string,
  subResourceIdOrName: string
) {
  return getByPresentableId(
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
  return getByPresentableId(
    presentableId,
    "info",
    parentNid,
    subResourceIdOrName
  );
}
export async function getSubResourceInfoById(
  presentableId: string | number,
  parentNid: string,
  subResourceIdOrName: string
) {
  if (isTest) return "not supported!";
  return getByPresentableId(
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
  return getByPresentableId(
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
  presentableId: string | number,
  type: string,
  parentNid: string,
  subResourceIdOrName: string,
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
    return frequest(
      presentable.getTestByResourceIdOrName,
      [presentableId, type],
      test,
      returnUrl,
      config
    );
  return frequest(
    presentable.getByResourceIdOrName,
    [nodeId, presentableId, type],
    form,
    returnUrl,
    config
  );
}
export async function getResultByName(presentableId: string | number) {
  return getByResourceIdOrName(presentableId, "result", "", "");
}
export async function getInfoByName(presentableId: string | number) {
  return getByResourceIdOrName(presentableId, "info", "", "");
}
export async function getResourceInfoByName(presentableId: string | number) {
  if (isTest) return "not supported!";
  return getByResourceIdOrName(presentableId, "resourceInfo", "", "");
}
export async function getFileStreamByName(
  presentableId: string | number,
  returnUrl?: boolean,
  config?: any
) {
  return getByResourceIdOrName(
    presentableId,
    "fileStream",
    "",
    "",
    returnUrl,
    config
  );
}
// sub
export async function getSubResultByName(
  presentableId: string | number,
  parentNid: string,
  subResourceIdOrName: string
) {
  return getByResourceIdOrName(
    presentableId,
    "result",
    parentNid,
    subResourceIdOrName
  );
}
export async function getSubInfoByName(
  presentableId: string | number,
  parentNid: string,
  subResourceIdOrName: string
) {
  return getByResourceIdOrName(
    presentableId,
    "info",
    parentNid,
    subResourceIdOrName
  );
}
export async function getSubResourceInfoByName(
  presentableId: string | number,
  parentNid: string,
  subResourceIdOrName: string
) {
  if (isTest) return "not supported!";
  return getByResourceIdOrName(
    presentableId,
    "resourceInfo",
    parentNid,
    subResourceIdOrName
  );
}
export async function getSubFileStreamByName(
  presentableId: string | number,
  parentNid: string,
  subResourceIdOrName: string,
  returnUrl?: boolean,
  config?: any
) {
  return getByResourceIdOrName(
    presentableId,
    "fileStream",
    parentNid,
    subResourceIdOrName,
    returnUrl,
    config
  );
}
