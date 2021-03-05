/**
 * 1.开始：流程获取主题
 * 2.准备：获取主题依赖的插件极其依赖    是否请求所有展品名称（相当于id）用于判定根据名称的请求是否需要发起
 * 3.判断：插件和依赖授权与否
 *     3.1存在没有授权的且为必须授权
 *        弹出批量签约 左右滑动滚动方式
 *     3.2存在没有授权的且为非必须授权
 *        此种情况暂不考虑
 * 4.已授权：
 *   4.1 准备插件对象 flatternPlugins childrenPlugins sandBoxs 
 *   4.2 加载主题内的非点击按钮加载的插件
 *   4.3 父插件加载完成后加载插件内的插件（获取插件标签失败后转为提供api给插件自己加载）  
 *   4.3 准备api提供给插件懒加载或插件内的插件加载（前置方法检查容器是否存在，不存在则终止）
 *       考虑问题：插件内部依赖几十个资源，在不同路由里面加载。
 *       解决办法：提供
 * 展品api：
 * url1: https://api.freelog.com/v2/auths/presentables/{presentableId}/{result|info|resourceInfo|fileStream}
 * url2: https://api.freelog.com/v2/auths/presentables/nodes/{nodeId}/{resourceIdOrName}/{result|info|resourceInfo|fileStream}
 *     获取展品信息：
 *         1.直接根据id获取一个或多个 
 *         2.直接分页获取
 *     获取展品内容：
 */