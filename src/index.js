import { loadMicroApp } from './runtime';
/**
 * 1.数据结构
 *   flatternPlugins Map<key：plugin id,value: object: 所有插件配置与状态与加载后控制对象> 插件集合 平行 关系 所有插件配置与状态与 
 *   childrenPlugins Map<key：father-plugin id,value: Array:[child-plugin id]> 插件对应的子插件集合
 *   sandBoxs Map<key: plugin id, value: sandbox>  所有插件对应沙盒对象 
 * 2.设计模式
 *   自顶向下： 加载与卸载权限控制： 注册后通过沙盒提供控制对象给运行时或上层插件沙盒变量进行管控
 *   loadMicroApp({ name: 'vue', entry: '//localhost:7101', container: '#vue' }, { sandbox: { experimentalStyleIsolation: true } }, );
 *   状态管理： bootstrap,mounting,mounted,unmounting,unmounted   后期思考：怎样算paused，能否实现？
 *   中央集权：沙盒全部在运行时进行管控，一旦有恶意侵入可中断（对沙盒的中断算paused?）， 挂载后控制对象就在全局，故有加载与卸载任何插件权限。
 *     
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
    apps[id] = loadMicroApp(config[id], { sandbox: { experimentalStyleIsolation: true } }, );
    // app = loadMicroApp({ name: 'react15', entry: '//localhost:7102', container: '#react15' }, { sandbox: { experimentalStyleIsolation: true } }, );
    // app = loadMicroApp({ name: 'vue3', entry: '//localhost:7105', container: '#react15' }, { sandbox: { experimentalStyleIsolation: true } }, );
    // = loadMicroApp({ name: 'angular', entry: '//localhost:7103', container: '#react15' }, { sandbox: { experimentalStyleIsolation: true } }, );

    // app = loadMicroApp({ name: 'purehtml', entry: '//localhost:7104', container: '#react15' });
    console.log(apps)
}

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