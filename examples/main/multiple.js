import { loadMicroApp } from '../../es';

let app;

function mount() {
    app = app || loadMicroApp({ name: 'react15', entry: '//localhost:7102', container: '#react15' }, { sandbox: { experimentalStyleIsolation: true } }, );
    app.mount()
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