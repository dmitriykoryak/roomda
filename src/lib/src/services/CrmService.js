import Query from '~~/store/helpers/Query'
import config from '@/config/config'

let apiClient
function apiClientInit() {
  if (!apiClient) {
    apiClient = Query.getters.query().create(config.api.url.crm)
  }
}

function getServices(params) {
  apiClientInit()
  return apiClient.get('/custom/default', params, true, false, ['list'])
}

function getContracts(params) {
  apiClientInit()
  return apiClient.get('/contract/default', params, true, false, [
    'list',
    'dateEn'
  ])
}

function getSubContracts(pId, params = {}) {
  apiClientInit()
  return apiClient.get('/contract/sub', { ...params, p_id: pId }, true, false, [
    'list',
    'dateEn'
  ])
}

function addSubContract(contract) {
  apiClientInit()
  return apiClient.post('/contract/sub', contract)
}

// Получить данные пользователя
function getPersoncrm() {
  apiClientInit()
  return apiClient.get('/personcrm/default/i')
}

/**
 * Получить список компаний пользователя
 * @param {Array} personCrmIds
 */
function getEntities(personCrmIds) {
  apiClientInit()
  return apiClient.get('/personcrm/entity', { personCrmIds: personCrmIds })
}

function createEntity(entity, context) {
  apiClientInit()
  return apiClient.post(
    '/personcrm/entity/create',
    entity,
    true,
    ['dateEn'],
    context
  )
}

// Получить группы (категории)
function getGroups(params) {
  apiClientInit()
  return apiClient.get('/catalog/group/all-group-list', params)
}

// Получить группу (категорию) по id
function getGroup(id, params) {
  apiClientInit()
  return apiClient.get('/catalog/group/' + id, params)
}

// Получить каталог items(товаров) для группы(категории) с groupId
function getCatalog(groupId, params) {
  apiClientInit()
  return apiClient.get(
    '/catalog/default',
    { ...params, groupIds: [groupId] },
    true,
    false,
    ['list']
  )
}

export {
  getServices,
  getContracts,
  getSubContracts,
  addSubContract,
  getPersoncrm,
  getEntities,
  createEntity,
  getGroups,
  getGroup,
  getCatalog
}
