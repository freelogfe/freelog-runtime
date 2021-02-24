import { loadMicroApp } from '../../es';
import 'zone.js'; // for angular subapp

let app;

function mount() {
    // app = loadMicroApp({ name: 'react15', entry: '//localhost:7102', container: '#react15' }, { sandbox: { experimentalStyleIsolation: true } }, );
    // app = loadMicroApp({ name: 'vue3', entry: '//localhost:7105', container: '#react15' }, { sandbox: { experimentalStyleIsolation: true } }, );
    app = loadMicroApp({ name: 'angular', entry: '//localhost:7103', container: '#react15' }, { sandbox: { experimentalStyleIsolation: true } }, );

    // app = loadMicroApp({ name: 'purehtml', entry: '//localhost:7104', container: '#react15' });
    console.log(app)
}

function unmount() {
    // let a = app.unmountPromise.then(() => {})
    app.unmount();
    console.log(app)
}

document.querySelector('#mount').addEventListener('click', mount);
document.querySelector('#unmount').addEventListener('click', unmount);

loadMicroApp({ name: 'vue', entry: '//localhost:7101', container: '#vue' });