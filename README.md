pnpm install

pnpm dev

移动端ui服务需要映射：http://ui.mobile.com" // "http://localhost:8881"

模块：
   x_core 核心模块，用于管理加载的widget, 沙盒化widget，支持通过插件进行沙盒增强，后面拿qianku
   x_node_enforce 节点运行时 沙盒增强模块，用于将自有业务放入到沙盒当中，比如freelogApi
   需不需要把后端的api在这里分离，这样更好让console也一样使用，毕竟两边的沙盒是不一样的，但api是有通用的，注入 x_common_api
   x_common_api 用于后端api，
   x_main_app 主app，所有节点的入口应用，通过x_core注入 