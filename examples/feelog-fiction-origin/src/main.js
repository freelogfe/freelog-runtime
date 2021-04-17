import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vant from "vant";
import VueLazyload from "vue-lazyload";
import VuePageStack from "vue-page-stack";
import "normalize.css/normalize.css";
// import "./utils/vw.css";
import "vant/lib/index.css";
import "./assets/css/reset.scss";
import "./public-path";
import './utils/flexible.js'

Vue.use(Vant);
Vue.use(VuePageStack, { router });
Vue.config.productionTip = false;
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: "//qidian.gtimg.com/qdm/img/book-cover.c977e.svg",
  attempt: 1,
});
 
let instance = null;

function render(props = {}) {
  const { container } = props;

  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector("#app") : "#app");
}

if (!window.__POWERED_BY_FREELOG__) {
  render();
}

function storeTest(props) {
  props.onGlobalStateChange &&
    props.onGlobalStateChange(
      (value, prev) =>
        console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev),
      true
    );
  props.setGlobalState &&
    props.setGlobalState({
      ignore: props.name,
      user: {
        name: props.name,
      },
    });
}
export async function bootstrap() {
  console.log("[vue] vue app bootstraped");
}

export async function mount(props) {
  console.log("[vue] props from main framework", props);
  storeTest(props);
  render(props);
}

export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = "";
  instance = null;
  router = null;
}
