// @ts-ignore
import ReactDOM from "react-dom";
import App from "./App";
import './public-path';
import reportWebVitals from "./reportWebVitals";

export async function bootstrap() {
}
//@ts-ignore
const props = window.$wujie?.props;
console.log(props)
export async function mount(props:any = {}) {
  const { container } = props;
  ReactDOM.render(
      <App />,
      container ? container.querySelector('#root') : document.querySelector('#root')
  );
}

export async function unmount(props:any) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(
    container ? container.querySelector('#root') : document.getElementById('root'),
  );
}
if (!window.__POWERED_BY_FREELOG__) {
  bootstrap().then(mount);
}
// setTimeout(()=>{run();},0)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();