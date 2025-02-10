---
outline: 'deep'
---
在上面的"主题-react示例"项目的基础上，稍做修改作为示例, 示例如何渲染并在本地开发和调试一个插件项目:

## 1. 在主题中使用插件

"主题-react示例"项目中，App.jsx文件内容如下

> 特别提示：init函数中依据插件的资源标识来查找依赖数据，需要自行修改成要加载的插件的资源标识；

```js
import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { freelogApp } from 'freelog-runtime'
function App() {
  const [list, setList] = useState([])
  const data = {
    articleData: {},
    shareWidget: null
  }
  const init = async () => {
    const container = document.getElementById("myPlugin");
  
    if (data.shareWidget) await data.shareWidget.unmount();
  
    const subDeps = await freelogApp.getSelfDependencyTree();
    console.log("subDeps", subDeps);
  
    // 这里要修改成对应的插件的资源标识
    const widgetData = subDeps.find((item) => item.articleName === "cumins/react-plugin-001");
    if (!widgetData) return;
  
    const { articleId, parentNid, nid, articleName } = widgetData;
  
    const topExhibitId = freelogApp.getTopExhibitId();
    const params = {
      articleId,
      parentNid,
      nid,
      topExhibitId,
      container,
      renderWidgetOptions: {
        data: { exhibit: data.articleData, type: "插件", routerType: "content", articleName },
        iframe: true
      }
    };
    data.shareWidget = await freelogApp.mountArticleWidget(params);
  }
  
  useEffect(() => {
    freelogApp.getExhibitListByPaging().then(res => {
      if (res.data.errCode === 0) {
        setList(res.data.data.dataList)
      }
    })
    init()
  }, [])

  const handlerClick = (item) => {
    alert(item.exhibitName)
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>react</p>
      <ul>
        { list.map(item => (
            <li onClick={ () => handlerClick(item) } key={item.exhibitId}>
              <div className={'r-name'}>展品名称：{ item.exhibitName }</div>
              <div className={'r-type'}>资源类型： { item.articleInfo.resourceType.join('/') }</div>
            </li>
          )) 
        }
      </ul>
      <div>下面是插件加载区域:</div>
      <div id="myPlugin"></div>
    </>
  )
}

export default App


```

> tip1：使用`${节点地址}?dev=${主题本地项目地址}`的方式在本地看主题项目是否正常渲染，正常渲染则可以进行继续往下;
>
> tip2：使用tip1的方式进行本地调试，还需注意一点，节点正在使用的主题与本地的主题的打包工具应为同类型，例如现用主题为webpack而本地项目为vite时则无法本地调试；

## 2. 发布主题项目, 并将插件添加为依赖

step1: 在"我的资源"中找到主题项目, 点击"编辑", 点击"更新", 上传文件后, 点击"更多设置", 点击"添加依赖", 将插件项目添加为主题项目的依赖（[将插件添加为主题项目的依赖, 查看这里](./use-theme.html#如何将插件添加为主题项目的依赖)）;

step2: **先启用**此主题，访问节点地址, 插件项目正常渲染则此步完成;

> 注: 发布主题项目后, 若插件未正常渲染, 需到"节点管理"的"主题管理"中找到主题, 启用主题, 点击"编辑", 点击"更多设置", 切换一次版本;[查看如何切换主题版本](./use-theme#如何切换主题版本)

## 3. 边开发边调试插件项目

> tip: 这一步, 目的是用本地项目替换线上项目;

打开节点, 并进入到使用了插件项目的页面, 在浏览器地址上需添加特定的参数;

完整url为 `${url}?dev=replace&${widgetRenderName}-freelog=${local_entry}`, 其中

`${url}`: 节点地址。

`dev=replace`: 必传。

`${widgetRenderName}-freelog`: 必传, `${widgetRenderName}`为渲染 id。`${widgetRenderName}` 获取方式：

1. url 上找到渲染 id。
2. 如果渲染名称被编码后无法区分, 又或者因为此页面加载了多个插件而无法区分，在插件项目内可以通过 `freelogApp.getSelfWidgetRenderName()`获取自身的渲染 id。

`${local_entry}`: 必传, 本地的插件项目地址。

举例：

```plaintext
https://acarlikecar.testfreelog.com/?dev=replace&wfbd046-freelog=https://localhost:8800
```

现在, 可以修改本地的插件项目代码进行本地开发和调试了;
