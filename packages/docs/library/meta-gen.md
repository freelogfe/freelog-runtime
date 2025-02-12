---
outline: deep
---
具有复杂文件系统的库，可使用下面的脚本，辅助生成对应的meta.json，简单文件系统推荐手动写meta.json文件；

## step1: 新建js文件

在库的项目根目录下新建一个js文件，如命名为`genMetaJson.js`，将下面的代码拷贝放入文件中：

```js
import fs from 'fs';
import path from 'path';

const dir = "dist"
const jsEntry = "vue-helloworld.umd.js" // 文件路径, 如js/index.js
const cssEntry = "helloworld-vue.css" // 文件路径, 如css/index.css
const nameSpace = "freelogLibrary.Freelog.vueHelloworld"

buildMetaFile({ jsEntry, nameSpace, dir, cssEntry })

function buildMetaFile(options) {
  const { jsEntry, nameSpace, cssEntry, dir } = options

  // 1. 确定数据结构
  const data = {
    nameSpace,
    js: {
      entry: "",
      other: []
    },
    css: {
      entry: "",
      other: []
    },
    other: []
  }

  // 2. 获取所有文件路径
  const allArr = []
  getDirectoryStructure(dir, allArr);

  allArr.forEach(file => {
    if (file.endsWith(".js")) {
      data.js.other.push(file)
    } else if (file.endsWith(".css")) {
      data.css.other.push(file)
    } else {
      data.other.push(file)
    }
  }) 

  // 3. 处理文件路径
  data.js.other = data.js.other.map(file => file.replace(dir + "\\", "").replaceAll("\\", "/")).filter(ele =>ele !== jsEntry);
  data.css.other = data.css.other.map(file => file.replace(dir + "\\", "").replaceAll("\\", "/")).filter(ele => ele !== cssEntry);
  data.other = [... new Set([...data.other.map(file => file.replace(dir + "\\", "").replaceAll("\\", "/")), "meta.json"])]

  // 4. 确定入口文件
  const jsFiles = allArr.filter(file => file.endsWith(".js")).map(file => file.replace(dir + "\\", "").replaceAll("\\", "/"))
  const cssFiles = allArr.filter(file => file.endsWith(".css")).map(file => file.replace(dir + "\\", "").replaceAll("\\", "/"))

  if (jsFiles.length !== 0 && jsFiles.includes(jsEntry)) {
    data.js.entry = jsEntry
  }

  if (cssFiles.length !== 0 && cssFiles.includes(cssEntry)) {
    data.css.entry = cssEntry
  }

  // 5. 写入文件
  fs.writeFileSync(`${dir}/meta.json`, JSON.stringify(data));

}

/* 递归获取文件夹结构 */
function getDirectoryStructure(dir, allArr) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      getDirectoryStructure(fullPath, allArr);
    } else {
      allArr.push(fullPath)
    }

  });
}

```

## step2: 修改文件变量

按实际修改文件中的`dir`、`jsEntry`、`cssEntry`、`nameSpace`四个常量



## step3: 执行命令

后用node环境执行脚本文件，此示例使用的是node.js v18+版本

```bash
node ./genMetaJson.js
```
