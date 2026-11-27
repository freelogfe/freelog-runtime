---
outline: deep
---

# 库的构建与发行约定

前端库通过 UMD 脚本和 `meta.json` 交给运行时。先构建产物并核对命名空间，再把产物发行成 `前端库` 资源。

## 1.配置打包工具

- 配置 UMD 入口和导出命名空间。运行时按 `meta.json` 中的 `nameSpace` 读取该导出。[加载接口](/library/library-usage)
- 确认运行时要使用的 JS 入口是 UMD。使用外置依赖时，消费方需提供对应的全局变量。

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

显式构建 UMD 产物。[Vite 库模式](https://vite.dev/config/build-options.html#build-lib)

```js
// vite.config.js
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'), // 入口文件
      name: 'freelogLibrary.Freelog.localModule',
      formats: ['umd'],
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

- 将 `meta.json` 放在产物根目录。
- `nameSpace` 与构建工具配置的 UMD 导出名称一致。
- `js.entry` 从产物根目录定位。当前运行时从 JS 入口所在的目录拼接 `css.entry`，因此示例中 CSS 与 JS 放在同一目录。无 CSS 入口时将 `css.entry` 填为空字符串，消费方跳过样式加载。
- `js.other`、`css.other`、`other` 记录其他文件在产物中的路径，运行时加载器根据 `entry` 读取入口。

### 2.1 示例1

当你的代码打包的文件目录如下所示时

```text
dist/
├── index.js
├── index.css
└── meta.json
```

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
│   ├── index.css
│   └── innerjs/
│       ├── common.js
│       └── index.js
├── css/
│   ├── big.css
│   └── small.css
└── meta.json
```

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
    "entry": "index.css",
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

1. 按[首次发行](/cli/01-快速上手)在 CLI 或 Console 发行单资源，选择 `前端库` 类型并提交产物。
2. 核对资源类型、版本及公开状态。按所需访问条件设置[资源授权策略](/cli/07-单资源授权策略)。
3. 将库声明为消费方版本的直接依赖。让节点使用包含该依赖的版本，验证实际加载的 JS 导出和 CSS。[线上库加载](/library/library-usage)
