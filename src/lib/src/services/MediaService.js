import Vue from 'vue'
import Query from '~~/store/helpers/Query'
import config from '@/config/config'

let apiClient
function apiClientInit() {
  if (!apiClient) {
    apiClient = Query.getters.query().create(config.api.url.media)
  }
}

function getFiles(addParams, queryCache) {
  apiClientInit()
  const params = {
    rel: 'file_default',
    limit: 100
  }
  return apiClient.get(
    '/file/default',
    { ...params, ...addParams },
    true,
    queryCache
  )
}

function getVideo(addParams, queryCache) {
  apiClientInit()
  const params = {
    rel: 'file_out',
    limit: 100
  }
  return apiClient.get(
    '/file/out',
    { ...params, ...addParams },
    true,
    queryCache
  )
}

/**
 * Запросить у сервиса media связанные с Данными(data) медиа файлы и добавить их соответствующй атрибут item-a массива data
 * @param {Array} data - данные, в которые следует добавить медиа файлы
 * @param {Array} attrsData - запрашиваемые атрибуты медиа данных
 * @param {Boolean} isVideo - является ли запрашиваемый медиа ресурс видео
 * @param {Boolean} queryCache - кешировать ли запрос
 */
async function addRelFiles(data, attrsData, queryCache) {
  const ids = data.map(item => item.id)
  // Если пустой массив - запрос не делать
  if (!ids[0]) return data

  let promises = []
  attrsData.forEach(({ attr, isVideo }) => {
    let params = {
      attr: attr,
      rel_id: ids,
      limit: 1000
    }
    if (isVideo) {
      promises.push(getVideo(params, queryCache))
    } else {
      promises.push(getFiles(params, queryCache))
    }
  })

  let mediaRes = await Promise.all(promises)
  return data.map(item => {
    mediaRes.forEach((response, i) => {
      let mediaData = []
      response.data.data.forEach(f => {
        if (f.rel_id === parseInt(item.id)) {
          mediaData.push(f)
        }
      })
      Vue.set(item, attrsData[i].attr, mediaData)
    })
    return item
  })
}

export { getFiles, addRelFiles }
