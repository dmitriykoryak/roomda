/**
 * Импорт всех необходимых компонентов для работы Grid
 */
import Vue from 'vue'
import Grid from './Grid.vue'
import GridWrapper from './GridWrapper.vue'
import DefaultGrid from './DefaultGrid.vue'
import ActionBtn from './ActionBtn.vue'
import ImportData from './DialogContent/ImportData'
import RowActions from './DialogContent/RowActions'
import RowActionsMob from './DialogContent/RowActionsMob'

import DaFastFilter from '../search/DaFastFilter.vue'
import DaSearchButton from '../search/DaSearchButton.vue'
import DaSearchCard from '../search/DaSearchCard.vue'
import DaSearchFields from '../search/DaSearchFields.vue'
import DaSearchPresets from '../search/DaSearchPresets.vue'
import DaSearchTag from '../search/DaSearchTag.vue'
import DaSearchTagList from '../search/DaSearchTagList.vue'

import TabLink from '../elems/TabLink.vue'
import DaTabs from '../elems/DaTabs.vue'
import '../elems/VSkeletionLoaderMany.js'
import DaDialog from '../elems/DaDialog.vue'

import DaViewValue from '../form/view/DaViewValue.vue'
import DaViewList from '../form/view/DaViewList.vue'
import DaFields from '../form/field/DaFields.vue'
import DaField from '../form/field/DaField.vue'
import DaManyField from '../form/DaManyField.vue'

import DaSubheader from '../bar/DaSubheader.vue'

Vue.component('Grid', Grid)
Vue.component('GridWrapper', GridWrapper)
Vue.component('DefaultGrid', DefaultGrid)
Vue.component('ActionBtn', ActionBtn)
Vue.component('ImportData', ImportData)
Vue.component('RowActions', RowActions)
Vue.component('RowActionsMob', RowActionsMob)

Vue.component('DaFastFilter', DaFastFilter)
Vue.component('DaSearchButton', DaSearchButton)
Vue.component('DaSearchCard', DaSearchCard)
Vue.component('DaSearchFields', DaSearchFields)
Vue.component('DaSearchPresets', DaSearchPresets)
Vue.component('DaSearchTag', DaSearchTag)
Vue.component('DaSearchTagList', DaSearchTagList)

Vue.component('TabLink', TabLink)
Vue.component('DaTabs', DaTabs)
Vue.component('DaDialog', DaDialog)

Vue.component('DaViewValue', DaViewValue)
Vue.component('DaViewList', DaViewList)
Vue.component('DaFields', DaFields)
Vue.component('DaField', DaField)
Vue.component('DaManyField', DaManyField)

Vue.component('DaSubheader', DaSubheader)
