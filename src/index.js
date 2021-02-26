import { loadMicroApp } from './runtime';
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
/**
 * 业务流程：
 *    runtime:
 *      1.拦截获取二级域名：验证是否属于有效节点。
 *      2.获取登录信息，节点主题信息（节点权限信息下放主题或在节点本身？）：验证是否具有节点访问权限
 *      3.加载主题：
 *        3.1 把主题内容放入body，获取主题内容插件标签集合
 *        3.2 获取主题依赖插件列表，匹配主题内容插件集合，并生成id（考虑有相同插件，所以需要重新生成id，id用于加载配置中的名称）
 *        3.3 批量请求插件资源： 生成加载信息（主要是container），loadMicroApp
 *      4.加载插件内的插件：
 *        3.1 获取插件依赖插件列表
 *        3.2 根据插件列表获取插件内部插件标签，匹配出列表中在插件内存在标签的插件集合
 *        3.3 批量请求插件资源： 生成加载信息（主要是container），loadMicroApp
 *      重点：entry需要后端提供api进行访问 
 *          '/'或'/index'或'/index.html' 根访问 index.html
 *          '/*'访问其它资源
 *      错误处理：
 *      TODO 纯js运行方式： css沙盒，js沙盒运行
 *         
 *     authority事件合约:  
 *       出现事件合约执行界面方式：运行时判定由 
 */
const config = {
    react15: {
        container: '#react15',
        name: 'react15',
        entry: '//localhost:7102'
    },

    vue3: {
        container: '#vue3',
        name: 'vue3',
        entry: '//localhost:7105'
    },
    angular: {
        container: '#angular',
        name: 'angular',
        entry: '//localhost:7103'
    },
    purehtml: {
        container: '#purehtml',
        name: 'purehtml',
        entry: '//localhost:7104'
    }
}
let apps = {

}

function mount(e) {
    console.log(e)
    var id = e.target.id.replace('unmount', '').replace('mount', '')
    apps[id] = loadMicroApp(config[id], { sandbox: { strictStyleIsolation: true, experimentalStyleIsolation: true } }, );
    // app = loadMicroApp({ name: 'react15', entry: '//localhost:7102', container: '#react15' }, { sandbox: { experimentalStyleIsolation: true } }, );
    // app = loadMicroApp({ name: 'vue3', entry: '//localhost:7105', container: '#react15' }, { sandbox: { experimentalStyleIsolation: true } }, );
    // = loadMicroApp({ name: 'angular', entry: '//localhost:7103', container: '#react15' }, { sandbox: { experimentalStyleIsolation: true } }, );

    // app = loadMicroApp({ name: 'purehtml', entry: '//localhost:7104', container: '#react15' });
    console.log(apps)
}
// TODO 如果插件卸载失败，需要中断（沙盒中处理）
function unmount(e) {
    var id = e.target.id.replace('unmount', '').replace('mount', '')
    console.log(id, apps)
    apps[id] && apps[id].unmount();
}


document.querySelector('#mountreact15').addEventListener('click', mount);
document.querySelector('#unmountreact15').addEventListener('click', unmount);

document.querySelector('#mountangular').addEventListener('click', mount);
document.querySelector('#unmountangular').addEventListener('click', unmount);

document.querySelector('#mountvue3').addEventListener('click', mount);
document.querySelector('#unmountvue3').addEventListener('click', unmount);

document.querySelector('#mountpurehtml').addEventListener('click', mount);
document.querySelector('#unmountpurehtml').addEventListener('click', unmount);

loadMicroApp({ name: 'vue', entry: '//localhost:7101', container: '#vue' }, { sandbox: { experimentalStyleIsolation: true } });