# 开发说明
  ## core模块

    运行时主模块，通过charles将节点域名指向本模块的启动地址：localhost:3000
  ## 授权ui模块 mobile  pc
    访问节点前，需要先启动pc或mobile或根据需要两个都启动

  ## 移动端真机调试
    移动端ui服务需要映射：http://ui.mobile.com" // "http://localhost:8881"
    同时修改 core/src/platform/init.ts 中的uiPath 
