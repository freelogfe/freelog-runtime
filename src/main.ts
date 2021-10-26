import './style.css'
import {run} from './platform/index'
const app = document.querySelector<HTMLDivElement>('#app')!
window.global = window
app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`
run()