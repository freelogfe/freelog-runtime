---
outline: 2
---

# 生成 meta.json

产物包含较多文件时，可以用脚本生成 [库描述文件](./guide.md)。下面的脚本要求 JS 和 CSS 入口在同一目录。

## step1: 新建 js 文件

在项目根目录新建 `genMetaJson.mjs`。

```js
import { readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const dir = 'dist'
const jsEntry = 'vue-helloworld.umd.js'
const cssEntry = 'helloworld-vue.css'
const nameSpace = 'freelogLibrary.Freelog.vueHelloworld'

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((item) => {
    const fullPath = path.join(directory, item.name)
    return item.isDirectory() ? listFiles(fullPath) : [fullPath]
  })
}

const files = listFiles(dir)
  .map((file) => path.relative(dir, file).split(path.sep).join('/'))
  .sort()

if (!files.includes(jsEntry)) throw new Error(`找不到 JS 入口 ${jsEntry}`)
if (cssEntry && !files.includes(cssEntry)) throw new Error(`找不到 CSS 入口 ${cssEntry}`)
if (cssEntry && path.posix.dirname(jsEntry) !== path.posix.dirname(cssEntry)) {
  throw new Error('请将 JS 和 CSS 入口放在同一目录')
}

const meta = {
  nameSpace,
  js: {
    entry: jsEntry,
    other: files.filter((file) => file.endsWith('.js') && file !== jsEntry),
  },
  css: {
    entry: cssEntry ? path.posix.basename(cssEntry) : '',
    other: files.filter((file) => file.endsWith('.css') && file !== cssEntry),
  },
  other: [...new Set([
    ...files.filter((file) => !file.endsWith('.js') && !file.endsWith('.css')),
    'meta.json',
  ])],
}

writeFileSync(path.join(dir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n')
```

## step2: 修改文件变量

按实际构建结果设置 `dir`、`jsEntry`、`cssEntry` 和 `nameSpace`。脚本的 JS 和 CSS 入口路径均相对产物根目录，使用 `/` 分隔。没有 CSS 入口时将 `cssEntry` 设为空字符串。

## step3: 执行命令

构建完成后执行，再检查输出的 `meta.json` 与压缩包内容。

```sh
node ./genMetaJson.mjs
```
