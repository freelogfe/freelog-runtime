---
outline: deep
---

# 库的构建与发行约定

::: info 进阶参考的适用范围
本页从已有文档迁移，保留框架或库的具体示例。先阅读[运行时接入](/runtime/quickstart)及[兼容边界](/runtime/compatibility)。框架示例有各自版本前提，不构成平台统一 Node.js 限制；不能直接组合不同框架或不同年代的配置。
:::
制作库的几个关键点

## 1.配置打包工具

* 配置命名空间;(即此库存到window的哪个属性下, 获取库时只能使用api获取, [点此查看api](/library/library-usage))
* 配置打包格式为umd;(不支持esm格式)

### 1.1 rollup配置示例

```js
// rollup.config.mjs
export default {
	input: 'src/main.js', // 库的入口文件
	output: {
		file: 'dist/index.freelog-library.umd.js',
		format: 'umd', // 配置为umd的打包格式
		name: 'freelogLibrary.Freelog.localModule', // 配置命名空间
	}
};

```

### 1.2 vite配置示例

vite会自动打包umd和esm两种格式, 所以这里不需要配置打包格式为umd; 打完包后, 可选择删去esm格式的文件;

```js
// vite.config.js
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'), // 入口文件
      name: 'freelogLibrary.Freelog.Kittle', // 配置命名空间
      fileName: (format) => `index.freelog-library.${format}.js`,
    },
  }
})

```

### 1.3 webpack5配置示例

```js
// webpack.config.js
const path = require('path');

const isProduction = process.env.NODE_ENV == 'production';

const config = {
  entry: './src/index.js', // 入口文件
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'freelogLibrary.Freelog.moduleTest', // 命名空间
    libraryTarget: 'umd' // 打包格式
  }
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
```

## 2.用meta.json描述打包产物的文件系统

* meta.json必须在根目录;
* meta.json的nameSpace与"配置打包工具"的"1. 配置命名空间"的命名空间一致;
* meta.json的字段是固定的, 不能随意修改;

下面是几个打包后的文件结构示例, 以及其对应的meta.json示例, 帮助理解如何写meta.json;

### 2.1 示例1

当你的代码打包的文件目录如下所示时

```text
dist/
├── index.js
├── index.css
└── meta.json
```

![1736479034455](/media/legacy/library/images/guide/1736479034455.png)

其对应的meta.json如下

```json
{
  "nameSpace": "freelogLibrary.Freelog.localModule",
  "js": {
    "entry": "index.js",
    "other": []
  },
  "css": {
    "entry": "index.css",
    "other": []
  },
  "other": [
    "meta.json"
  ]
}
```

### 2.2 示例2

当你的代码打包的文件目录如下所示时

```text
dist/
├── js/
│   ├── index.js
│   └── innerjs/
│       ├── common.js
│       └── index.js
├── css/
│   ├── index.css
│   ├── big.css
│   └── small.css
└── meta.json
```

![1736478857977](/media/legacy/library/images/guide/1736478857977.png)

其对应的meta.json如下

```json
{
  "nameSpace": "freelogLibrary.Freelog.localModule",
  "js": {
    "entry": "js/index.js",
    "other": [
      "js/innerjs/common.js",
      "js/innerjs/index.js"
    ]
  },
  "css": {
    "entry": "css/index.css",
    "other": [
      "css/big.css",
      "css/small.css"
    ]
  },
  "other": [
    "meta.json"
  ]
}
```

## 3.压缩打包并发布

### 3.1 打压缩包

进入打包后产物的文件夹根目录, 如dist, 选中所有文件并压缩成一个.zip文件, 如asset.zip;

### 3.2 发布库

新开发优先按[CLI 手册](/cli/)完成资源创建、版本填写、策略和上架。下方保留的 Console 截图是旧界面参考，不作为当前页面布局或按钮位置的保证；不能只按截图判断完成发行。

打开平台, 注册并登录账号, 开始发布资源: [去发布](https://console.freelog.cn/), 关键步骤如下:

- step1: 点击右上角按钮"进入工作台"
- step2: 点击右上角的按钮"+"并选择下拉选项"创建资源"
- step3: 点击"发行单个资源"

![1736392458957](/media/legacy/library/images/guide/1736392458957.png)

- step4: 选择"前端库"资源类型

![1741944222160](/media/legacy/library/images/guide/1741944222160.png)

* step5: 创建

![1741944392512](/media/legacy/library/images/guide/1741944392512.png)

- step6: 上传我们写的helloworld库的压缩包

![1736393690957](/media/legacy/library/images/guide/1736393690957.png)

- 后续填写版本、添加启用策略并上架，按[CLI 手册](/cli/)完成；压缩包结构和 meta.json 仍按本文要求核对。

走完此流程后, 在"资源管理"页面可看到刚创建的库资源, 当资源是"已上架"的状态时(如下图), 其他人则可以检索并看到你发布的资源, 至此, 库就成功发布到了线上, 处于他人可用的状态下了;

![1736394046987](/media/legacy/library/images/guide/1736394046987.png)
