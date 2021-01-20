import Query from '~~/store/helpers/Query'
import config from '@/config/config'

let apiClient
function apiClientInit() {
  if (!apiClient) {
    apiClient = Query.getters.query().create(config.api.url.doc)
  }
}

function getDocs(params) {
  apiClientInit()
  return apiClient.get('/doc/default', params, true, false, ['list', 'dateEn'])
}

function getNews(params) {
  apiClientInit()
  return apiClient.get('/news/default', params, true, false, ['list', 'dateEn'])
}

export { getDocs, getNews }
