/* eslint-disable */

import Marked from 'marked'
import codeHighlight from './code-highlight'
import styleString from './styles/index.less'
console.log(require('./styles/index.less'))

const styleFragment = document.createElement('style')
styleFragment.innerHTML = styleString
document.head.append(styleFragment)

const	markdownTextCache = new Map()
const promiseMap = new Map()
const LAZY_LOAD_SPEC = 'js-md-lazy-load'

export default class MarkdownParser extends HTMLElement {
	markdownText = ''
	workNid = ''
	subDependencies = []
	_tocs = []
	$container = this 

	constructor(options) {
		super()
		this.mountPromise = new Promise((resolve, reject) => {
			promiseMap.set(this, [ resolve, reject ])
		})
	}	


	async connectedCallback() {
		this.init()
		const [ resolve, reject ] = promiseMap.get(this)
		try {
			await this.mount()
			resolve(this)
		} catch(e) {
			reject(e)
		}
	}

	init() {
		this.exhibitId = this.getAttribute('exhibitId') || ''
	}

	async mount() {
		if (this.exhibitId === '') {
			throw new Error(`PresentableId不能为空`)
			return 
		}
		await this.getMarkdownData(this.exhibitId)
		if (this.authError == null) {
			this.renderMarkdown()
			this.createlazyLoader()
		} else {
			// 授权出错
		}
	}

	async getMarkdownData(exhibitId) {
		let tmpMD = markdownTextCache.get(exhibitId)
		if (tmpMD == null) {
			var response = await window.freelogApp.getFileStreamById(exhibitId)
			
			if (response.headers['freelog-resource-type'] != null) {
				const subDependenciesString = decodeURIComponent(response.headers['freelog-sub-dependencies'])
				const subDependencies = JSON.parse(subDependenciesString)
				const workNid = response.headers['freelog-work-nid']
				const markdownText = await response.data
				tmpMD = { markdownText, workNid, subDependencies, authError: null }
			} else {
				const authError = await response.json()
				tmpMD = { markdownText: '', workNid: '', subDependencies: [], authError }
			}
			markdownTextCache.set(exhibitId, tmpMD)
		}
		const { markdownText = '', workNid = '',  subDependencies = [], authError } = tmpMD
		this.workNid = workNid
		this.subDependencies = subDependencies
		this.authError = authError
		this.markdownText = markdownText
	}

	renderMarkdown() {
		const markdownHTML = this.resolveMarkdown(this.markdownText)
		this.$container.innerHTML = `
			<div class="">
				<div class="md-main-content markdown-body">${markdownHTML}</div>
			</div>`
	}

	resolveMarkdown(markdownText) {
		
		const renderer = new Marked.Renderer()

    Marked.setOptions({
      renderer: this.resetRenderer(renderer),
      highlight: function (code, type) {
        return codeHighlight(code)
      },
      pedantic: false,
      gfm: true,
      tables: true,
      breaks: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      xhtml: false
    })
		return Marked(this.markdownText)
	}

	resetRenderer(renderer) {
		renderer.heading = this.resetHeading()
		renderer.image = this.resetImageRenderer(renderer)
		return renderer
	}

	resetHeading() {
		var index = 0
		return (text, level) => {
			const anchor = `nav_anchor_${level}_${index++}`
			if (level <= 4) {
				this._tocs.push({ level, anchor, text })
			}
			return `<h${level} id="${anchor}"><a href="#${anchor}" class="anchor"></a></a>${text}</h${level}>`
		}
	}

	resetImageRenderer(renderer) {
		const rawRendererImage = renderer.image
		let resIndex = 0
		return (href, title, text) => {
			if (text.replace(/^(\s*)|(\s*)$/g, '') === 'freelog-resource') {
				const [ name, queryString ] = href.split('?')
				const size = this.getImgSizeByQueryStr(queryString) 
				const workId = this.getResourceIdByName(name)
				if (workId) {
					var img = new Image()
          var imgId = `resource_img_${resIndex++}`
          img.id = imgId
          img.src = "//visuals.oss-cn-shenzhen.aliyuncs.com/loading.gif"
          img.alt = text
          if (size.width) {
            img.width = size.width
          }
          if (size.height) {
            img.height = size.height
          }
          img.dataset.workId = workId
          img.classList.add(LAZY_LOAD_SPEC)
          title && (img.title = title)
          return img.outerHTML
				}
			} else {
				return rawRendererImage.apply(renderer, [href, title, text])
			}
		}
	}

	getImgSizeByQueryStr(queryString = '') {
    const size = {}
    if (queryString !== '') {
      const tmpArr = queryString.split('&')
      for (const item of tmpArr) {
        const [ key, val] = item.split('=')
        size[key] = val
      }
    }
    return size
	}
	
	getResourceIdByName(name) {
		for (let item of this.subDependencies) {
			if (item.name === name) {
				return item.id
			}
		}
		return ''
	}

  createlazyLoader() {
    var observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio <= 0) {
            return
					}
          var $target = entry.target
          var workId = $target.dataset.workId
					Reflect.deleteProperty($target.dataset, workId)
					this.loadFreelogResource(workId, $target)
          observer.unobserve($target)
        })
      }
		)
		
		window.addEventListener('scroll', () => {
			window.requestAnimationFrame(() => {
				const $lazyDoms = this.querySelectorAll(`.${LAZY_LOAD_SPEC}`)
				for (const $dom of $lazyDoms) {
					$dom.classList.remove(LAZY_LOAD_SPEC)
					observer.observe($dom)
				}
			})
		})
		
  }

  async loadFreelogResource(subResourceId, $target) {
		try {
			const _response =  await window.freelogApp.getSubInfoById(this.exhibitId, this.workNid, subResourceId )
			const type = _response.headers['freelog-resource-type']
			const url = await window.freelogApp.getSubFileStreamById(this.exhibitId, this.workNid, subResourceId, true )
			console.log(url, 234234)
			if (type) {
				const blob =  _response.data // .blob()
				console.log(_response)
				switch (type) {
					case 'video':
						this.renderVideo($target, blob, url)
						break
					case 'meme':
						this.renderMeme($target, blob, url)
						break
					case 'image':
					default:
						this.renderImage($target, blob, url)
				}
			}
		} catch(e) {
			console.error('LoadFreelogResource:', e)
		}
  }

  renderImage($el, blob, $src){
    var src = $src || URL.createObjectURL(blob)
    if ($el.nodeName !== 'IMG') {
      var $image = document.createElement('img')
      $image.src = src
      $el.replaceWith($image)
    } else {
      $el.src = src
    }
	}
	
  renderMeme($el, blob){}

  renderVideo($el, blob, $src){
    var id = 'js-video-'+Math.random().toString().slice(3,8)
    var $video = document.createElement('video')
    $video.style.cssText = 'width: 100%;height: 100%;'
    $video.controls = 'controls'
    // $video.autoplay = 'false'
    $video.id= id
    $el.replaceWith($video)
    setTimeout(()=>{
      $video.src = $src || URL.createObjectURL(blob)
    })
  }
}

customElements.define('freelog-markdown-parser', MarkdownParser)
