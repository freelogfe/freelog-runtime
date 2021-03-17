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
import {createContainer, createId } from './utils'
import { loadMicroApp } from '../runtime';
import {baseUrl} from '../../services/base'
import {setLocation} from './proxy'
export const flatternWidgets = new Map<any,any>()
export const activeWidgets = new Map<any,any>()
export const childrenWidgets = new Map<any,any>()
export const sandBoxs = new Map<any,any>() // 沙盒不交给plugin, 因为plugin是插件可以用的
// TODO plugin type
export function addWidget(key: string, plugin:any){
    if(activeWidgets.has(key)){
        console.log(flatternWidgets.get(key).name + 'reloaded')
    }
    flatternWidgets.set(key, plugin)
    activeWidgets.set(key, plugin)
}
// TODO error
export function removeWidget(key: string){
    flatternWidgets.has(key) &&  flatternWidgets.delete(key) && removeSandBox(key)
}
export function deactiveWidget(key: string){
    activeWidgets.has(key) &&  activeWidgets.delete(key) 
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
// 插件自己加载子插件  sub需要验证格式
export function mountWidget(sub:any, container: any): any{
    // @ts-ignore
    const id = createId(sub.id)
    const widgetContainer = createContainer(container, id)
    const config = {
    container: widgetContainer,
    name: id,//id
    widgetName: sub.name,
    id: sub.id,
    entry: '//localhost:7103/' // `${baseUrl}/widget/${sub.id}`
    }
    // TODO 所有插件加载用promise all
    // @ts-ignore
    console.log(config)
    const app = loadMicroApp(config, { sandbox: { strictStyleIsolation: true, experimentalStyleIsolation: true } },);
    // const id2 = createId(sub.id + 1)
    // const widgetContainer2 = createContainer(container, id2)
    // const app2 = loadMicroApp({
    //     container: widgetContainer2,
    //     name: id2,
    //     entry: '//localhost:7103'
    // }, { sandbox: { strictStyleIsolation: true, experimentalStyleIsolation: true } },);
    // addWidget(id2, app2);
    console.log(app)
    addWidget(id, app);
    
    // TODO 拦截mount做处理
    return {
        mount: ()=>{
            app.mount();
            console.log(app)
            addWidget(id, app);
         },
         unmount: ()=> {
            app.unmount();
            deactiveWidget(id)
            setLocation()
        }
    }
}
