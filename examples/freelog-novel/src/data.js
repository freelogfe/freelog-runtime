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


function handleErrorResponse(response) {
  window.FreelogApp.trigger('HANDLE_INVALID_RESPONSE', { response })
}

var onloadBookDetail = createLoader(function (callback) {
  window.freelogApp.getPresentables({ tags: 'book-intro', resourceType: 'json', isLoadingResourceInfo: 1 })
    .then(res => {
      console.log(res)
      if (res.data.errcode === 0 && res.data.data.dataList.length) {
        const { presentableId } = res.data.data.dataList[0]
        window.freelogApp.getFileStreamById(presentableId, '', {
          responseType: "blob",
          onDownloadProgress: function (evt) {
            console.log(11111, parseInt((evt.loaded / evt.total) * 100))
          }
        })
          .then(async res => {
            console.log(res)
            const data = await res.data.text()
            console.log(data)
            if (data) {
              callback(JSON.parse(data))
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
  return window.freelogApp.getPresentables({ tags }).then(res => res.json())
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
  window.freelogApp.getPresentables({ tags: 'chapter', isLoadVersionProperty: 1 })
    .then(res => {
      if (res.data.errcode === 0 && res.data.data.dataList.length) {
        var data = resolveChapters(res.data.data.dataList)
        callback(data)
      } else {
        handleErrorResponse(res)
      }
    })
})

function requestPresentableData(presentableId) {
  return window.freelogApp.getFileStreamById(presentableId)
    .then(res => {
      var meta = decodeURIComponent(res.headers['freelog-resource-property'])
      var chapter
      try {
        chapter = JSON.parse(meta)
      } catch (e) {
        chapter = null
        console.error(e)
      }
      console.log(res)
      if (!chapter) {
        return window.freelogApp.getInfoById(presentableId)
          .then(res => {
            chapter = res.data && res.data.versionProperty || {
              "chapterName": "第一章 秦羽",
              "volume": 1,
              "chapter": 1,
              "volumeName": "秦羽"
            }
            chapter.presentableId = presentableId
            chapter.error = 'no chapter'
            return chapter
          }).catch((e) => {
            console.error(e)
          })
      } else {
        let content = res.data
        content = content.split('\n')
          .filter(cont => cont !== '')
          .map(cont => `<p style="text-indent: 2em;">${cont}</p><br/>`)
          .join('')
        chapter.content = `<div>${content}</div>`
        return chapter
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