import { PlainObject } from "./base";
import { WidgetApp } from "./widget";
import { AxiosResponse, ResponseType } from "axios";
import { IApiDataFormat } from "./base";
import { ExhibitInfo, PresentableDependencyTree } from "./interface";

export interface SetUserDataKeyForDev {
  /**
   * 用于开发模式时，非节点内部主题或插件（外部未签约的资源）开发时设置用户数据保存的 key，等签约后线上用户数据与开发时一致
   *
   * @param key - 资源（作用）名称
   */
  (key: string): void;
}

export interface MountWidget {
  /**
   * 用于开发模式时，非节点内部主题或插件（外部未签约的资源）开发时设置用户数据保存的 key，等签约后线上用户数据与开发时一致
   *
   * @param key - 资源（作用）名称
   */
  (options: MountWidgetOptions): Promise<WidgetApp>;
}

interface MountWidgetOptions {
  /**
   * 插件数据,请参考文档中mountWidget示例
   */
  widget: any;
  /**
   * 挂载的容器
   */
  container: HTMLElement;
  /**
   * 给到子插件的配置数据
   */
  config?: PlainObject;
  /**
   * 插件渲染可选项，包括数据传递，以及渲染时需要的额外数据
   */
  renderWidgetOptions?: RenderWidgetOptions;
  /**
   * 顶层展品的数据，加载孙插件时也要传递
   */
  topExhibitData?: any;
  /**
   * 挂载的序号，当同时家载多次时需要
   */
  seq?: number;
  /**
   * 开发模式下，本地调试地址
   */
  widget_entry?: string;
}
/**
 * @param
 */
interface RenderWidgetOptions {
  /**
   *  是否切换为iframe沙箱，可选
   */
  iframe?: boolean;
  /**
   * 开启内联模式运行js，可选
   */
  inline?: boolean;
  /**
   * 关闭虚拟路由系统，可选
   */
  "disable-memory-router"?: boolean;
  /**
   * 指定默认渲染的页面，可选
   */
  "default-page"?: string;
  /**
   * 保留路由状态，可选
   */
  "keep-router-state"?: boolean;
  /**
   * 关闭子插件请求的自动补全功能，可选
   */
  "disable-patch-request"?: boolean;
  /**
   * 开启keep-alive模式，可选
   */
  "keep-alive"?: boolean;
  /**
   * 卸载时强制删除缓存资源，可选
   */
  destroy?: boolean;
  /**
   * 开启fiber模式，可选
   */
  fiber?: boolean;
  /**
   * 设置子插件的基础路由，可选
   */
  baseroute?: string;
  /**
   * 开启ssr模式，可选
   */
  ssr?: boolean;
  // shadowDOM?: boolean, // 开启shadowDOM，可选
  /**
   * 传递给子插件的数据，可选
   */
  data?: Object;
  /**
   * 获取子插件发送数据的监听函数，可选
   */
  onDataChange?: Function;
  /**
   * 注册子插件的生命周期
   */
  lifeCycles?: {
    /**
     * 加载资源前触发
     */
    created?(e: CustomEvent): void;
    /**
     * 加载资源完成后，开始渲染之前触发
     */
    beforemount?(e: CustomEvent): void;
    /**
     * 子插件渲染结束后触发
     */
    mounted?(e: CustomEvent): void;
    /**
     * 子插件卸载时触发
     */
    unmount?(e: CustomEvent): void;
    /**
     * 子插件渲染出错时触发
     */
    error?(e: CustomEvent): void;
    /**
     * 子插件推入前台之前触发（keep-alive模式特有）
     */
    beforeshow?(e: CustomEvent): void;
    /**
     * 子插件推入前台之后触发（keep-alive模式特有）
     */
    aftershow?(e: CustomEvent): void;
    /**
     * 子插件推入后台时触发（keep-alive模式特有）
     */
    afterhidden?(e: CustomEvent): void;
  };
}
