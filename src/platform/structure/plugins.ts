// 插件对象管理plugins：flatternPlugins childrenPlugins sandBoxs  
/**
 * 1.数据结构
 *   flatternPlugins Map<key：plugin id,value: object: 所有插件配置与状态与加载后控制对象> 插件集合 平行 关系 所有插件配置与状态与 
 *   childrenPlugins Map<key：father-plugin id,value: Array:[child-plugin id]> 插件对应的子插件集合
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
const flatternPlugins = new Map<any,any>()
const childrenPlugins = new Map<any,any>()
const sandBoxs = new Map<any,any>() // 沙盒不交给plugin, 因为plugin是插件可以用的
// TODO plugin type
export function addPlugin(key: string, plugin:any){
    if(flatternPlugins.has(key)){
        console.log(flatternPlugins.get(key).name + 'reloaded')
    }
    flatternPlugins.set(key, plugin)
}
// TODO error
export function removePlugin(key: string){
    flatternPlugins.has(key) &&  flatternPlugins.delete(key) && removeSandBox(key)
}
export function addChildPlugin(key: string, childKey:any){
    const arr = childrenPlugins.get(key) || []
    !arr.contains(childKey) && arr.push(childKey)
    childrenPlugins.set(key, arr)
}
export function removeChildPlugin(key:string, childKey: string){
    if(childrenPlugins.has(key)){
        let arr = childrenPlugins.get(key) || []
        arr.contains(childKey) && arr.splice(arr.indexOf(childKey), 1) 
        childrenPlugins.set(key, arr)
    }
}
// maybe plugin is not exists in flatternPlugins
export function addSandBox(key: string, sandbox:any){
    if(sandBoxs.has(key)){
        console.log(flatternPlugins.get(key).name + 'reloaded')
    }
    sandBoxs.set(key, sandbox)
}
export function removeSandBox(key: string){
    sandBoxs.has(key) &&  sandBoxs.delete(key)
}