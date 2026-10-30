---
outline: deep
---

::: info 进阶参考的适用范围
本页从已有文档迁移，保留框架或库的具体示例。先阅读[运行时接入](/runtime/quickstart)及[兼容边界](/runtime/compatibility)。框架示例有各自版本前提，不构成平台统一 Node.js 限制；不能直接组合不同框架或不同年代的配置。
:::
本指南介绍了库开发者在本地开发时，如何开启https的web服务，并加载调试

## 1. 开启https的web服务

### 1.1 生成证书

#### step1: [安装库](https://www.npmjs.com/package/mkcert)

```bash
npm install -g mkcert
```

#### step2: 生成文件

新建文件夹，如pems，并进入此文件夹中执行命令，生成的文件会在此文件夹中

```bash
mkcert create-ca
```

```bash
mkcert create-cert
```

### 1.2 静态HTTPS服务

#### step1: [安装库](https://www.npmjs.com/package/http-server)

```bash
npm install --global http-server
```

#### step2: 启动https服务

进入要启动https服务的文件夹中，执行以下命令启动一个https服务

```bash
# http-server -p 要开启服务的端口 -S -C 上一步生成的证书的文件地址 -K 上一步生成的key文件的地址 --cors
http-server -p 8894 -S -C C:\project\pems\cert.crt -K C:\project\pems\cert.key --cors
```

当如下图所示时，表示https服务开启成功，并在浏览器上尝试访问文件，如`https://192.168.2.184:8894/vue-helloworld.umd.js`，**此时若提示不安全则需要信任且继续前往即可**

![1739343012564](/media/legacy/library/images/local-dev/1739343012564.png)

## 2. 加载库

主题开发场景为例，加载一个本地的vue库，如下所示:

```js
// 在main.js中加载一个本地的vue库
const getUrlsk = {
  jsEntryUrl: "https://192.168.2.184:8894/vue-helloworld.umd.js",
  metaJson: {
    nameSpace: "freelogLibrary.Freelog.vueHelloworld"
  },
  cssEntryUrl: "https://192.168.2.184:8894/helloworld-vue.css"
};
const resk = await instance.loadLibraryJs(getUrlsk.jsEntryUrl, getUrlsk.metaJson);
instance.loadLibraryCss(getUrlsk.cssEntryUrl);
app.config.globalProperties.VueComTest3 = `本地vue库开发`;
app?.component("Little", resk.default);
```

```
<template>
  <Little msg="cumins/vue-component-002 => 1.0.0"></Little>
</template>
```
