import { loadMicroApp } from './runtime';


let config = {
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