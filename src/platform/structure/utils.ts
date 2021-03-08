// 工具utils：获取容器，生成容器，销毁容器，生成id


export function getContainer(father: string | HTMLElement, id: string): HTMLElement | null |undefined {
    const fatherContainer =  typeof father === 'string' ? document.querySelector(father) : father;
    // @ts-ignore
    return id ? fatherContainer?.querySelector('#' + id) : fatherContainer
  }

export function createContainer(container: string | HTMLElement, id: string): string | void  {
  const father =  typeof container === 'string' ? document.querySelector(container) : container;
  if(father?.querySelector('#' + id)) return 'already exists'
  let child = document.createElement('DIV')
  child.setAttribute('id', id)
  father?.appendChild(child)
}

// TODO 确定返回类型
export function deleteContainer(father: string | HTMLElement, child: string | HTMLElement): any  {
  const fatherContainer =  typeof father === 'string' ? document.querySelector(father) : father;
  const childContainer =  typeof child === 'string' ? document.querySelector(child) : child;

  return childContainer? fatherContainer?.removeChild(childContainer) : true
}

export function createId(): any  {
  let id = new Date().toUTCString()
  if(document.querySelector('#' + id)){
    return id
  }else{
    createId()
  }
}