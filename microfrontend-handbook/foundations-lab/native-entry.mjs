export function createApplication() {
  let root
  let button
  let count = 0
  let timer
  let click
  let ticks = 0
  let cleaned = false
  let report
  return {
    mount(container, props, capabilities) {
      report = capabilities.report
      root = document.createElement('section')
      button = document.createElement('button')
      click = () => { button.textContent = `${props.label}: ${++count}`; report({ count, ticks }) }
      button.textContent = `${props.label}: ${count}`
      button.addEventListener('click', click)
      root.appendChild(button)
      container.appendChild(root)
      timer = setInterval(() => { ticks++; report({ count, ticks }) }, 200)
      report({ count, ticks })
    },
    unmount() {
      if (cleaned) return
      cleaned = true
      clearInterval(timer)
      button?.removeEventListener('click', click)
      root?.remove()
      report?.({ cleaned: true, count, ticks })
    },
  }
}
