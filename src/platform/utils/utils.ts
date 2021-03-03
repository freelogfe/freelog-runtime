/**
 * 从父容器中获取插件标签并用<div id="插件id"></div> 替代
 * @param {*} container 父容器
 * @param {*} tagName  父容器中的插件标签名
 */
export function getContainer(container: string | HTMLElement): HTMLElement | null {
    return typeof container === 'string' ? document.querySelector(container) : container;
  }