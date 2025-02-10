> 此接入只适用主题与插件；

本文列举了比较流行的vue2、vue3、react前端框架如何进行接入的项目改造

## React

### 注意事项

- **跨域问题**：

  - 使用 `create-react-app` 脚手架时，可以通过修改 `config/webpackDevServer.config.js` 文件的 `headers` 配置来解决跨域问题。如果手动配置 Webpack 或使用自定义配置，请确保 `webpack-dev-server` 中设置了 `"Access-Control-Allow-Origin": "*z"`。
  - 使用`vite`脚手架时, 可以通过修改`vite.config.js`文件的`server.headers`设置`"Access-Control-Allow-Origin"："*"`
- **路由配置**：

  - 对于 React Router，注意在配置路由时需要处理 404 页面和重定向的逻辑。
  - 使用 `<Route path="*">` 捕获所有未匹配的路由并进行跳转：

    ```js
    <Route path="*" element={<Navigate to="/" replace />} />
    ```
- **性能优化**：

  - React 应用的性能优化，尤其是在大型项目中，应该注意懒加载和代码分割。
  - 使用 `React.memo` 和 `useMemo` 来避免不必要的重新渲染，提升性能。

### 常见问题

- **问题**：React 应用在多次重新渲染时性能下降。
  - **解决方案**：优化组件的渲染逻辑，避免不必要的渲染，使用 `React.memo` 和 `useMemo`。

## Vue

### 注意事项

- **Vue 版本选择**：

  - `Vue 2.x` 与 `Vue 3.x` 有一些重要区别，特别是在组件定义、生命周期和 Composition API 上。如果使用 Vue 3.x，建议使用 `Composition API` 进行状态管理和逻辑复用。
- **跨域问题**：

  - 如果在 Vue 项目中遇到跨域问题，可以通过 `vue.config.js` 配置 `devServer.proxy` 来解决：

    ```js
    module.exports = {
      devServer: {
        proxy: {
          '/api': {
            target: 'http://your-api-url',
            changeOrigin: true,
          }
        }
      }
    }
    ```
- **路由配置**：

  - Vue Router 的配置要小心避免重复路由和无限循环跳转。
  - 使用 `beforeEach` 和 `afterEach` 来管理路由守卫，防止不必要的页面跳转。
- **性能优化**：

  - 在 Vue 中，避免在模板中进行复杂计算，尽量使用 `computed` 和 `watcher` 来提高性能。
  - 使用 `Vue Router` 的懒加载来减少初始加载时间：

    ```js
    const Home = () => import('./components/Home.vue');
    ```

### 常见问题

- **问题**：Vue 项目在路由切换时性能问题。
  - **解决方案**：检查 `beforeEnter` 和 `afterEnter` 路由钩子中的异步操作，避免每次切换都进行重复的网络请求。

## Vite

### 注意事项

- **Vite 安装与配置**：

  - Vite 依赖于现代浏览器的支持，在使用时需要确保目标浏览器支持 ES 模块。
  - 如果需要支持 IE11 或旧版浏览器，请使用 Polyfill 或考虑替代工具。
- **构建优化**：

  - Vite 在开发模式下表现优异，但在生产构建时，需要通过配置 `vite.config.js` 中的 `build` 选项来优化打包体积和代码分割。
  - 配置 `splitChunks` 来确保各个模块和依赖的合理拆分，减少首次加载时的体积。
- **热更新问题**：

  - Vite 的热更新（HMR）机制比传统 Webpack 更为高效，但也可能遇到一些兼容性问题。遇到 HMR 无效时，可以通过清空缓存或重启 Vite 服务来解决。
- **插件管理**：

  - Vite 使用插件来扩展功能，插件管理非常灵活。在安装插件时，注意与 Vue 或 React 等框架的兼容性。

### 常见问题

- **问题**：Vite 在生产环境中出现过大 bundle。
  - **解决方案**：检查 Vite 的打包配置，启用 `code splitting` 和 `tree-shaking`，并确保第三方库和模块没有被重复打包。

## 总结

这三种流行的前端框架（React、Vue、Vite）各有特点和注意事项。了解这些注意事项并遵循最佳实践，可以帮助开发者避免常见问题并提升开发效率。在使用时，应根据项目需求和团队技术栈选择合适的框架，并根据每个框架的特性进行优化配置。
