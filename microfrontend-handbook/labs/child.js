// This is a classic script, deliberately using real MicroApp window/document proxies.
;(function () {
  const name = window.__MICRO_APP_NAME__
  let data
  let root
  let timer = null
  let ticks = 0
  let mounts = 0
  let path = '/'
  let running = false
  let routeButton
  let mergeButton

  function report(kind, payload) {
    data?.onEvidence?.({ kind, name, ...payload })
  }
  function probe() {
    return {
      owner: window.__LAB_OWNER__,
      rootOwner: root?.__MICRO_APP_NAME__,
      queryIsSelf: !!root && document.querySelector('#player-root') === root,
      sameArrayConstructor: Array === window.rawWindow.Array,
      rawHasOwner: Object.prototype.hasOwnProperty.call(window.rawWindow, '__LAB_OWNER__'),
      ticks, mounts, path, running,
      sandbox: window.__MICRO_APP_SANDBOX_TYPE__,
    }
  }
  function startTimer() {
    if (timer !== null) return
    timer = window.setInterval(function () {
      ticks++
      const target = root?.querySelector('.lab-player-timer')
      if (target) target.textContent = '计时：' + ticks + '（本插件主动记账）'
      report('tick', { ticks })
    }, 300)
  }
  function stopTimer() {
    if (timer === null) return
    window.clearInterval(timer)
    timer = null
  }
  function navigate(target) {
    history.pushState({ chapter: 2 }, '', target)
    path = location.pathname + location.search + location.hash
    const label = root?.querySelector('.lab-player-route')
    if (label) label.textContent = '子应用路由：' + path
    report('route', { path, probe: probe() })
  }
  function dispatchPair() {
    window.microApp.dispatch({ first: 1, from: name })
    window.microApp.dispatch({ second: 2, from: name })
    report('dispatch-pair', { expected: '同轮浅合并，宿主应观察最终状态，不是可靠的逐条事件队列' })
  }
  function onData(next) {
    data = next
    report('data', { fields: Object.keys(next).filter(function (key) { return key !== 'onEvidence' }) })
    if (next.command === 'navigate') navigate(next.path || '/chapter/2')
    if (next.command === 'dispatch-pair') dispatchPair()
  }
  function onAppState(event) {
    if (event.detail.appState === 'afterhidden') {
      stopTimer()
      report('pause', { ticks, reason: '子应用主动响应 afterhidden，不是沙箱自动暂停全部任务' })
    } else if (event.detail.appState === 'aftershow') {
      startTimer()
      report('resume', { probe: probe() })
    }
  }
  function onResize() { report('resize', { name }) }
  function onRouteClick() { navigate('/chapter/2') }
  function onMergeClick() { dispatchPair() }

  function unmount() {
    if (!running) return
    running = false
    stopTimer()
    routeButton?.removeEventListener('click', onRouteClick)
    mergeButton?.removeEventListener('click', onMergeClick)
    window.microApp.removeDataListener(onData)
    window.removeEventListener('appstate-change', onAppState)
    window.removeEventListener('resize', onResize)
    report('cleanup', { ticks, mounts, timerCleared: timer === null })
  }
  function mount(incoming) {
    if (running) return
    data = incoming || window.microApp.getData()
    root = document.querySelector('#player-root')
    if (!root) throw new Error('Lab child root is missing')
    running = true
    mounts++
    window.__LAB_OWNER__ = name
    root.dataset.owner = name
    root.querySelector('.lab-player-title').textContent = name + ' · 真实子应用'
    root.querySelector('.lab-player-details').textContent = '沙箱 ' + window.__MICRO_APP_SANDBOX_TYPE__ + '；同一份脚本，不同实例。'
    routeButton = root.querySelector('.lab-route-button')
    mergeButton = root.querySelector('.lab-merge-button')
    routeButton.addEventListener('click', onRouteClick)
    mergeButton.addEventListener('click', onMergeClick)
    window.addEventListener('appstate-change', onAppState)
    window.addEventListener('resize', onResize)
    window.microApp.addDataListener(onData)
    startTimer()
    report('probe', { probe: probe() })
    window.microApp.dispatch({ ready: true, from: name })
  }

  // Define all functions/state before setting hooks: the engine can invoke mount immediately.
  window.unmount = unmount
  window.mount = mount
})()
