
import hljs from 'highlight.js/lib/core'

hljs.registerLanguage('vbscript-html', require('highlight.js/lib/languages/vbscript-html'))
hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'))
hljs.registerLanguage('css', require('highlight.js/lib/languages/css'))
hljs.registerLanguage('scss', require('highlight.js/lib/languages/scss'))
hljs.registerLanguage('less', require('highlight.js/lib/languages/less'))
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
hljs.registerLanguage('vbscript', require('highlight.js/lib/languages/vbscript'))
hljs.registerLanguage('typescript', require('highlight.js/lib/languages/typescript'))
hljs.registerLanguage('markdown', require('highlight.js/lib/languages/markdown'))
hljs.registerLanguage('php', require('highlight.js/lib/languages/php'))
hljs.registerLanguage('json', require('highlight.js/lib/languages/json'))

export default function codeHighlight(code) {
  return hljs.highlightAuto(code).value
}