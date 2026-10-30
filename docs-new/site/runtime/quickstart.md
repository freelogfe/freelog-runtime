# 从真实节点运行第一个主题

目标：在真实节点页面中加载本地主题，修改代码后看到页面更新。本节不要求先发行正在开发的代码，但需要一个已经能够访问并启用主题的真实节点。

## 开始前

准备以下条件：

1. 你有可管理的节点，已在 Console 添加并启用可用主题；没有时先完成[准备节点和基础主题](/runtime/node-setup)。
2. 你有主题前端工程，工具链可以启动 HTTPS 本地开发服务。
3. 浏览器可以打开节点和本地 HTTPS 地址；本地证书已受信任。

可以通过 [CLI 使用文档](/cli/)创建主题工程或接入已有工程。CLI 要求 Node.js **22.14.0 或更高**；主题项目自身的 Node.js 要求由它的工具链决定，两者不要混为一谈。

开发者可以让 Agent 创建工程、安装依赖、构建并检查页面；账号登录、必要的认证和支付由本人在平台页面完成。先明确使用 dev 还是正式环境，节点、CLI 登录和资源应使用同一目标环境，不把开发环境的数据当作正式上线结果。

## 1. 接入 SDK 和生命周期

在主题工程安装：

```sh
npm install freelog-runtime@^5.0.7
```

将应用初始化放在运行时调用的 `mount` 内。例如：

```js
import { initFreelogApp } from 'freelog-runtime';

window.mount = () => {
  const { freelogApp } = initFreelogApp();
  document.querySelector('#app').textContent = '本地主题已挂载';
  console.log('主题依赖', freelogApp.getSelfDepForTheme());
};

window.unmount = () => {
  document.querySelector('#app').replaceChildren();
};
```

`#app` 应为工程 HTML 中实际存在的容器。使用 React、Vue 时，在这两个生命周期中分别创建、卸载应用，并清理监听和定时器。直接打开本地地址只能检查开发服务器和证书；SDK 上下文由节点运行时提供。

## 2. 启动 HTTPS 开发服务

使用项目现有脚本启动服务，记录实际输出的地址，例如 `https://localhost:7101`。服务需要允许节点页面跨域加载脚本和资源。Vite 项目还应使用相对构建路径 `base: './'`，HTTPS 配置按所用插件和当前工具链设置。

先在浏览器直接打开本地地址，处理证书信任问题，再打开节点。不要通过关闭浏览器安全机制解决开发问题。

## 3. 从节点加载本地主题

在真实节点根地址添加 `dev`：

```text
https://你的节点域名/?dev=https://localhost:7101
```

也可用浏览器控制台构造地址，避免手动拼接已有查询参数：

```js
const url = new URL('https://你的节点域名/');
url.searchParams.set('dev', 'https://localhost:7101');
console.log(url.href);
```

文档里的地址按便于阅读的形式展示。`URL.searchParams`生成地址时可能自动编码，运行时解析得到的本地地址相同。如果本地地址本身含有`&`或`#`等特殊字符，请用上面的代码设置参数，不要手工拼接。

成功信号：节点页面显示“本地主题已挂载”，Network 能看到本地入口请求。修改工程代码后，按项目热更新能力或刷新节点确认变化。

如果启用主题与本地工程的打包方式不同，先核对[兼容性与版本](/runtime/compatibility)。`dev` 不会把本地未发行的属性或依赖自动同步到节点。

## 下一步

- 加载和替换插件：[本地开发](/runtime/development)。
- 认识展品、依赖与挂载身份：[架构与对象](/runtime/architecture)。
- 打包、发行并在真实数据下验收：[发行与上线](/runtime/release)。
- 页面未出现或请求失败：[问题排查](/runtime/troubleshooting)。
