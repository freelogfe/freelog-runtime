pnpm install

pnpm dev

移动端ui服务需要映射：http://ui.mobile.com" // "http://localhost:8881"

模块：

## x_core核心模块

   具体作用描述：
       用于管理加载的widget, 沙盒化widget，支持通过插件进行沙盒增强，后面拿qiankun3.0的沙盒模块修改后来替代。
       如果
   核心模块需要注入：
     1.在import-html-entry中需要对fetch进行处理
       可以在loadMicroApp中configuration中传递一个名为fetch的函数来拦截fetch做处理
     2.沙盒方面：可以在loadMicroApp中 configuration 中传递一个对象 proxyHooks = {
         setHooks,
         getHooks,
         saveSandBox
      }
   x_node_enforce 节点运行时 沙盒增强模块，用于将自有业务放入到沙盒当中，比如freelogApi
   需不需要把后端的api在这里分离，这样更好让console也一样使用，毕竟两边的沙盒是不一样的，但api是有通用的，注入 x_common_api
   x_common_api 用于与console通用的后端api
   x_main_app 主app，所有节点的入口应用，通过x_core注入 x_node_enforce，加载授权UI与节点主题