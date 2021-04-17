import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './public-path';
import './utils/flexible'
 

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export async function bootstrap() {
  console.log('[react17] react app bootstraped');
}
//     </React.StrictMode>,

export async function mount(props = {}) {
  const { container } = props;
  ReactDOM.render(
      <App />,
    document.getElementById('root')
  );
}

export async function unmount(props) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(
    container ? container.querySelector('#root') : document.getElementById('root'),
  );
}

if (!window.__POWERED_BY_FREELOG__) {
  bootstrap().then(mount);
}
