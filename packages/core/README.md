移动端 ui 服务需要映射：http://ui.mobile.com" // "http://localhost:8881"

# qiankun hack
 流程是：
    1.最小改造qiankun发布一个包。
    2.运行时引用freelog-runtime-core, 在加载前进行全局变量拦截适配，主要是fetch与URL两个对象。需要适配原因是为了处理特有的插件加载api（为什么特别？因为根路径是带query的）
    3.加载前沙盒增强，沙盒增强分为freelogApp业务增强、浏览器路由与document沙盒增强。

    以后只需要深入搞懂qiankun的底层原理流程，了解每一个技术点，但不再需要很熟悉 。 就可以依托于qiankun团队来升级我们的运行时，，，如果我们团队强大了，再打造完全属于自己的。

## 修改文件

### proxySandbox.ts

    路径： src/sandbox/proxySandbox.ts
    增加代码：
    ```ts
        // TODO FREELOG START
        // @ts-ignore
        const hook = globalContext.proxyHooks.setHooks.get(p);
        if (hook) {
        if (typeof hook === "function") {
            return hook();
        }
        return hook;
        }
        // FREELOG END
    
       // TODO FREELOG START
       // @ts-ignore
        const hook = globalContext.proxyHooks.getHooks.get(p);
        if (hook) {
          if (typeof hook === "function") {
            return hook(name, _this);
          }
          return hook;
        }
        // FREELOG END
    ```
    可以搜索FREELOG来定位所有增加或修改过的
## 全局使用 freelog 替换 qiankun 字样
   大写 FREELOG 替换大写 QIANKUN，小写freelog替换小写qiankun