
const domMap = new Map()
export default function scrollHandler(event) {
  const scrollTop = getScrollTop()
  const bodySelector = '#f-docs-body'
  
  if (scrollTop >= 60) {
    addClass(bodySelector, 'fixed')
  } else {
    removeClass(bodySelector, 'fixed')
  }
}

export function getScrollTop() {
  return window.scrollY || document.documentElement.scrollTop
}

function getDom(selector) {
  if (domMap.get(selector) != null) return domMap.get(selector)
  const $target = document.querySelector(selector)
  domMap.set(selector, $target)
  return $target
}

function addClass(selector, className) {
  const $dom = getDom(selector)
  if ($dom != null) {
    $dom.classList.add(className)
  }
}

function removeClass(selector, className) {
  const $dom = getDom(selector)
  if ($dom != null) {
    $dom.classList.remove(className)
  }
}



