/**
 * 需求与问题：
 *    1.首先进来时需要根据路由启动存在的不同插件（主要点是启动）:
 *      1.1 location解析
 *      1.2 路由拦截，存为历史
 *      1.3 整体回退前进
 *      1.4 插件回退前进
 *      1.5 抽象路由的插件 
 *      1.6 懒加载或点击按钮加载插件的问题：
 *          1.6.1 懒加载：提供属性空闲后加载，或指定延迟时间（不精准）
 *          1.6.1 点击再加载：提供属性标明不加载，点击按钮，提供api（mountPlugin(pluginId)） 
 *    2.插件控制插件进入不同路由：
 *      2.1 给插件对象提供api，（例如push(home/about?age=18)）劫持重定向的路由进行unmount后再mount
 *    3.
 * 总结：window.FreelogApp.mountPlugin
 */
var rawDocument = document
var rawHistory = window['history']
var rawLocation = window['location']
var locations = new Map()
if (rawLocation.hash && rawLocation.hash.split('#')) {
  var loc = rawLocation.hash.split('#')
  loc.forEach((item) => {
    var l = item.split('=')
    item && l && locations.set(l[0], { pathname: l[1], href: l[1] })
  })
  console.log(locations)
}
// TODO pathname  search 需要不可变
const locationCenter = {
  set: function (name: string, attr: any) {
    var loc = locations.get(name) || {}
    if (attr.pathname && attr.pathname.indexOf(rawLocation.host) > -1) {
      attr.pathname = attr.pathname.replace(rawLocation.protocol, '').replace(rawLocation.host, '').replace('//', '')
    }
    locations.set(name, {
      ...loc,
      ...attr
    })

    // TODO 只有在线的应用才在url上显示, 只有pathname和query需要
    var hash = ''
    locations.forEach((value, key) => {
      hash += '#' + key + '=' + value.pathname || ''
    })
    rawLocation.hash = hash
  },

  get: function (name: string) {
    locations.get(name)
  }
}