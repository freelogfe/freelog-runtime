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
  window.freelogApp.getPresentables({ tags: 'book-intro', articleResourceTypes: 'json', isLoadingResourceInfo: 1 })
    .then(res => {
      console.log(res)
      if (res.data.errcode === 0 && res.data.data.dataList.length) {
        const { exhibitId } = res.data.data.dataList[0]
        window.freelogApp.getExhibitFileStream(exhibitId, '', {
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
    var volume = chapter.versionInfo.exhibitProperty.volume
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
      return a.versionInfo.exhibitProperty.chapter > b.versionInfo.exhibitProperty.chapter
    })

    bookVolumes.push({
      volumeName: chapterList[0].versionInfo.exhibitProperty.volumeName,
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

function requestExhibitData(exhibitId) {
  return window.freelogApp.getExhibitFileStream(exhibitId)
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
        return window.freelogApp.getInfoById(exhibitId)
          .then(res => {
            chapter = res.data && res.data.versionInfo.exhibitProperty || {
              "chapterName": "第一章 秦羽",
              "volume": 1,
              "chapter": 1,
              "volumeName": "秦羽"
            }
            chapter.exhibitId = exhibitId
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

var exhibitsMap = {}

function onloadExhibitData(exhibitId, disabledCache) {

  if (!disabledCache && exhibitsMap[exhibitId]) {
    return Promise.resolve(exhibitsMap[exhibitId])
  } else {
    return requestExhibitData(exhibitId).then((chapter) => {
      exhibitsMap[exhibitId] = chapter
      return chapter
    })
  }
}
//alias
var onloadChapterContent = onloadExhibitData

export {
  onloadBookDetail,
  onloadChapters,
  loadPresentablesByTags,
  onloadExhibitData,
  onloadChapterContent
}
