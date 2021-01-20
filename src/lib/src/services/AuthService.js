import Query from '~~/store/helpers/Query'
import config from '@/config/config'

let apiClient
function apiClientInit() {
  if (!apiClient) {
    apiClient = Query.getters.query().create(config.api.url.auth)
  }
}

// Получить ответственного
function getOwners(params) {
  apiClientInit()
  return apiClient.get('/personauth/default', params)
}

export { getOwners }
