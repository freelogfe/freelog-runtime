function createLoader(loader) {
  var loading = false;
  var handles = [];
  var value;

  return function (callback) {
    if (value) {
      callback(value)
    } else if (loading) {
      handles.push(callback)
    } else {
      loading = true;
      handles.push(callback)
      loader(function (v) {
        value = v;
        let h;
        while ((h = handles.shift())) {
          h(v)
        }
      })
    }
  }
}

var nodeId = window.__auth_info__.__auth_node_id__

function handleErrorResponse(response) {
  window.FreelogApp.trigger('HANDLE_INVALID_RESPONSE', { response })
}

var onloadBookDetail = createLoader(function (callback) {
  window.FreelogApp.QI.pagingGetPresentables({ tags: 'book-intro', resourceType: 'json', isLoadingResourceInfo: 1 })
    .then(res => {
      if (res.errcode === 0 && res.data.dataList.length) {
        const { presentableId } = res.data.dataList[0]
        window.FreelogApp.QI.getPresentableData(presentableId)
          .then(resp => resp.json())
          .then(data => {
            if (data && !data.errcode) {
              callback(data)
            } else {
              handleErrorResponse(res)
            }
          })
      } else {
        handleErrorResponse(res)
      }
    })
})

function loadPresentablesByTags(tags) {
  return window.FreelogApp.QI.pagingGetPresentables({ tags }).then(res => res.json())
}

function resolveChapters(chapters) {
  var bookVolumesMap = {};
  var bookVolumes = []

  chapters.forEach(chapter => {
    var volume = chapter.versionProperty.volume
    if (volume) {
      if (!bookVolumesMap[volume]) {
        bookVolumesMap[volume] = []
      }
      bookVolumesMap[volume].push(chapter)
    }
  });

  Object.keys(bookVolumesMap).forEach(volume => {
    var chapterList = bookVolumesMap[volume];
    chapterList.sort(function (a, b) {
      return a.versionProperty.chapter > b.versionProperty.chapter
    })

    bookVolumes.push({
      volumeName: chapterList[0].versionProperty.volumeName,
      volumeIndex: volume,
      chapters: chapterList
    })
  })

  return bookVolumes
}

var onloadChapters = createLoader(function (callback) {
  window.FreelogApp.QI.pagingGetPresentables({ tags: 'chapter', isLoadVersionProperty: 1 })
    .then(res => {
      if (res.errcode === 0 && res.data.dataList.length) {
        var data = resolveChapters(res.data.dataList)
        callback(data)
      } else {
        handleErrorResponse(res)
      }
    })
})

function requestPresentableData(presentableId) {
  var nodeId = window.__auth_info__.__auth_node_id__
  return window.FreelogApp.QI.getPresentableData(presentableId)
    .then(res => {
      var meta = decodeURIComponent(res.headers.get('freelog-resource-property'))
      var chapter
      try {
        chapter = JSON.parse(meta)
      } catch (e) {
        chapter = null
        console.error(e)
      }
      if (!chapter) {
        return res.blob().then(errResponse => {
          let a = window.FreelogApp.QI.getPresentable(presentableId)
          return window.FreelogApp.QI.getPresentable(presentableId)
            .then(res => {
              chapter = res.data && res.data.versionProperty || {
                "chapterName": "第一章 秦羽",
                "volume": 1,
                "chapter": 1,
                "volumeName": "秦羽"
              }
              chapter.presentableId = presentableId
              chapter.error = errResponse
              return chapter
            }).catch((e)=>{
              console.error(e)
            })
        })
      } else {
        return res.text().then(content => {
          content = content.split('\n')
            .filter(cont => cont !== '')
            .map(cont => `<p style="text-indent: 2em;">${cont}</p><br/>`)
            .join('')
          chapter.content = `<div>${content}</div>`
          return chapter
        })
      }
    })
}

var presentablesMap = {}

function onloadPresentableData(presentableId, disabledCache) {

  if (!disabledCache && presentablesMap[presentableId]) {
    return Promise.resolve(presentablesMap[presentableId])
  } else {
    return requestPresentableData(presentableId).then((chapter) => {
      presentablesMap[presentableId] = chapter
      return chapter
    })
  }
}
//alias
var onloadChapterContent = onloadPresentableData

export {
  onloadBookDetail,
  onloadChapters,
  loadPresentablesByTags,
  onloadPresentableData,
  onloadChapterContent
}
