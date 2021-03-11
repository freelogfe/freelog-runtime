// 工具utils：获取容器，生成容器，销毁容器，生成id

import {baseUrl} from '../../services/base'
export function getContainer(father: string | HTMLElement, id: string): HTMLElement | null |undefined {
    const fatherContainer =  typeof father === 'string' ? document.querySelector('#' + father) : father;
    // @ts-ignore
    return id ? fatherContainer?.querySelector('#' + id) : fatherContainer
  }

export function createContainer(container: string | HTMLElement, id: string): HTMLElement   {
  const father =  typeof container === 'string' ? document.querySelector('#' + container) : container;
  // @ts-ignore
  if(father?.querySelector('#' + id)) return father?.querySelector('#' + id)
  let child = document.createElement('DIV')
  child.setAttribute('id', id)
  father?.appendChild(child)
  return child
}

// TODO 确定返回类型
export function deleteContainer(father: string | HTMLElement, child: string | HTMLElement): any  {
  const fatherContainer =  typeof father === 'string' ? document.querySelector('#' + father) : father;
  const childContainer =  typeof child === 'string' ? document.querySelector('#' + child) : child;

  return childContainer? fatherContainer?.removeChild(childContainer) : true
}

export function createId(): any  {
  let id = 'freelog-' + new Date().toUTCString()
  return document.querySelector('#' + id) ? createId() : id
}


export function createScript(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const script: HTMLScriptElement = document.createElement('script')
    script.src = url
    script.onload = resolve
    script.onerror = reject
    // script.async = true
    script.defer = true
    // @ts-ignore
    document.getElementsByTagName('head').item(0).appendChild(script)
  })
}

export function createCssLink(href: string, type?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const link: HTMLLinkElement = document.createElement('link')
    link.href = href
    link.rel = 'stylesheet'
    link.type = type || 'text/css'
    link.onload = resolve
    link.onerror = reject
    // @ts-ignore
    document.getElementsByTagName('head').item(0).appendChild(link)
  })
}
//
export function resolveUrl(path: string, params?: any): string {
  // @ts-ignore
  const { nodeType, qiOrigin } = window.freelogApp.nodeInfo
  params = Object.assign({ nodeType }, params)
  var queryStringArr = []
  for (let key in params) {
    if (params[key] != null) {
      queryStringArr.push(`${key}=${params[key]}`)
    }
  }
  return `${baseUrl}${path}?${queryStringArr.join('&')}`
}