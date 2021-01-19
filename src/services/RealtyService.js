import Query from '~~/store/helpers/Query'
import config from '@/config/config'

let apiClient
function apiClientInit() {
  if (!apiClient) {
    apiClient = Query.getters.query().create(config.api.url.realty)
  }
}

function getRealty(id, params, isSale = false, queryCache = false) {
  apiClientInit()
  let addParamsName = ['dateEn']
  if (!id) {
    addParamsName.push('list')
  }
  return apiClient.get(
    '/' + (isSale ? 'sale' : 'rent') + '/default/' + (id || ''),
    params,
    true,
    queryCache,
    addParamsName
  )
}

function addRealty(realty, isSale = false, context = null) {
  apiClientInit()
  return apiClient.post(
    '/' + (isSale ? 'sale' : 'rent') + '/default/create',
    realty,
    true,
    ['dateEn'],
    context
  )
}

function getRealtyTotal(params, isSale = false, queryCache = false) {
  apiClientInit()
  return apiClient.get(
    '/' + (isSale ? 'sale' : 'rent') + '/default/count',
    params,
    true,
    queryCache
  )
}

function getRealtyType(queryCache = false) {
  apiClientInit()
  return apiClient.get('/type/default/group-list', {}, true, queryCache)
}

function getRealtySubType(realtyTypeId, queryCache = false) {
  apiClientInit()
  return apiClient.get(
    '/type/default/all-list',
    { groupId: realtyTypeId },
    true,
    queryCache
  )
}

function getRealtyCountTypes(params, isSale, queryCache = false) {
  apiClientInit()
  return apiClient.get(
    '/' + (isSale ? 'sale' : 'rent') + '/default/count-types',
    params,
    true,
    queryCache
  )
}

export {
  getRealty,
  getRealtyType,
  getRealtySubType,
  getRealtyTotal,
  getRealtyCountTypes,
  addRealty
}
