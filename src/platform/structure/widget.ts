// 插件对象管理plugins：flatternWidgets childrenWidgets sandBoxs  

/**
 * 1.数据结构
 *   flatternWidgets Map<key：plugin id,value: object: 所有插件配置与状态与加载后控制对象> 插件集合 平行 关系 所有插件配置与状态与 
 *   childrenWidgets Map<key：father-plugin id,value: Array:[child-plugin id]> 插件对应的子插件集合
 *   sandBoxs Map<key: plugin id, value: sandbox>  所有插件对应沙盒对象 
 * 2.设计模式
 *   自顶向下： 加载与卸载权限控制： 注册后通过沙盒提供控制对象给运行时或上层插件沙盒变量进行管控
 *   loadMicroApp({ name: 'vue', entry: '//localhost:7101', container: '#vue' }, { sandbox: { experimentalStyleIsolation: true } }, );
 *   状态管理：  
 *      运行状态管理： bootstrap,mounting,mounted,unmounting,unmounted   后期思考：怎样算paused，能否实现？
 *      权限状态？？？
 *   中央集权：沙盒全部在运行时进行管控，一旦有恶意侵入可中断（对沙盒的中断算paused?）， 挂载后控制对象就在全局，故有加载与卸载任何插件权限。
 *     
 */
import { createScript, createCssLink, createContainer, createId, resolveUrl } from './utils'
import { loadMicroApp } from '../runtime';

const flatternWidgets = new Map<any,any>()
const childrenWidgets = new Map<any,any>()
const sandBoxs = new Map<any,any>() // 沙盒不交给plugin, 因为plugin是插件可以用的
// TODO plugin type
export function addWidget(key: string, plugin:any){
    if(flatternWidgets.has(key)){
        console.log(flatternWidgets.get(key).name + 'reloaded')
    }
    flatternWidgets.set(key, plugin)
}
// TODO error
export function removeWidget(key: string){
    flatternWidgets.has(key) &&  flatternWidgets.delete(key) && removeSandBox(key)
}
export function addChildWidget(key: string, childKey:any){
    const arr = childrenWidgets.get(key) || []
    !arr.contains(childKey) && arr.push(childKey)
    childrenWidgets.set(key, arr)
}
export function removeChildWidget(key:string, childKey: string){
    if(childrenWidgets.has(key)){
        let arr = childrenWidgets.get(key) || []
        arr.contains(childKey) && arr.splice(arr.indexOf(childKey), 1) 
        childrenWidgets.set(key, arr)
    }
}
// maybe plugin is not exists in flatternWidgets
export function addSandBox(key: string, sandbox:any){
    if(sandBoxs.has(key)){
        console.log(flatternWidgets.get(key).name + 'reloaded')
    }
    sandBoxs.set(key, sandbox)
}
export function removeSandBox(key: string){
    sandBoxs.has(key) &&  sandBoxs.delete(key)
}

export function mountWidget(sub:any){
    const id = createId()
    const widgetContainer = createContainer('freelog-plugin-container', id)
    const config = {
    container: widgetContainer,
    name: id,//id
    widgetName: sub.name,
    id: sub.id,
    entry: '//localhost:7104'
    }
    // TODO 所有插件加载用promise all
    // @ts-ignore
    const app = loadMicroApp(config, { sandbox: { strictStyleIsolation: true, experimentalStyleIsolation: true } },);
    addWidget(id, app);
}
