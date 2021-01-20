<template>
  <div class="grid">
    <!--Карточка просмотра, редактирования, графика-->
    <da-search-card
      :icon="cardIcon"
      :searchItem.sync="searchItem"
      :parentAttr="parentAttr"
      :parentId="parentId"
      :labels="labels"
      :rules="rules"
      :fastfilter="scenario === 'search' ? fastfilter : null"
      :mapKey="mapKey"
      :filter-toolbar-button="scenario === 'search'"
      :dropdown-toolbar-button="scenario === 'search'"
      wide-toolbar
    >
      <da-fields
        v-if="scenario === 'create' || scenario === 'update'"
        :editedItem.sync="editedItem"
        :labels="labels"
        :rules="rules"
        :struc="struc"
        :coms="coms"
        :tooltips="tooltips"
        :scenario="scenario"
        :parentAttr="parentAttr"
        :parentId="parentId"
        :id="id"
        :mapKey="mapKey"
        :apiUrl="apiUrl"
        :validation-scope="scope"
        :scrollTrigger.sync="scrollTrigger"
        :isFullWidth="localSidebar"
        hideSumValidateErrors
      ></da-fields>

      <da-view-list
        v-else-if="scenario === 'view'"
        :item="viewedItem"
        :coms="coms"
        :tooltips="tooltips"
        :labels="labels"
        :rules="rules"
        :struc="struc"
        :mapKey="mapKey"
      ></da-view-list>

      <da-chart
        v-else-if="scenario === 'chart'"
        :api-url="apiUrl + '/' + mapKeyFull"
        :params="addParentParams"
        :label="title"
        :mapKey="mapKey"
      />
      <!--Карточка просмотра, редактирования, графика конец-->

      <template v-slot:toolbar-items>
        <template v-if="siblings.length">
          <tab-link
            component="v-btn"
            small
            v-for="(path, index) in siblings"
            :key="index"
            :to="'/' + alias + '/' + path"
            :title="map[path].label"
            :level="level"
            color="info"
            text
          >
            <v-icon small class="mr-1">
              swap_vert
            </v-icon>
            {{ map[path].label }}
          </tab-link>
        </template>
        <div class="flex-grow-1"></div>
      </template>

      <template v-if="isSidebarBtn" v-slot:toolbar-items-after>
        <v-btn icon @click="localSidebar = !localSidebar">
          <v-icon small>fa-bars</v-icon>
        </v-btn>
      </template>

      <template v-if="scenario === 'search'" v-slot:toolbar-dropdown>
        <v-list dense>
          <da-subheader icon="mdi-content-paste" title="Действия" dark>
          </da-subheader>

          <v-list-item @click="dialog.import = true">
            <v-list-item-avatar class="mx-0">
              <v-icon class="red--text">fa-file-upload</v-icon>
            </v-list-item-avatar>
            <v-list-item-title class="ml-3">
              Импорт из файла
            </v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="exportExcel">
            <v-list-item-avatar class="mx-0">
              <v-icon class="green--text">fa-file-excel</v-icon>
            </v-list-item-avatar>
            <v-list-item-title class="ml-3">
              Экспорт в Excel
            </v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item
            @click="
              sortHeadersInit()
              dialog.hideColumns = true
            "
          >
            <v-list-item-avatar class="mx-0">
              <v-icon class="info--text">visibility_off</v-icon>
            </v-list-item-avatar>
            <v-list-item-title class="ml-3">
              Видимость колонок
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </template>

      <template v-if="scenario === 'search'" v-slot:search-items>
        <da-search-fields
          :apiUrl="apiUrl"
          :iterable="struc.search"
          :rule="rules.search"
          :searchItem="searchItem"
          :labels="labels"
          :fastfilter="fastfilter"
          :mapKey="mapKey"
        >
        </da-search-fields>
      </template>

      <template
        v-if="isEmptySort && mobBreakpoint && scenario === 'search'"
        v-slot:before-fast-filter
      >
        <v-btn
          v-if="mobBreakpoint && !showMassActionsCheckboxes"
          @click="massActionsPermission = !massActionsPermission"
          icon
        >
          <v-icon>edit</v-icon>
        </v-btn>
      </template>

      <!--Grid-->
      <v-data-table
        class="grid-data-table js-grid"
        v-if="scenario === 'search'"
        :id="'data-table-' + rand"
        :headers="showAllRows ? headersFull : headersVisibleReactive"
        :items.sync="items"
        item-key="id"
        :options.sync="pagination"
        :server-items-length="totalItems"
        :group-by="isGroupsAttrHide ? null : groups"
        v-model="selected"
        v-on:current-items="hideEmptyCols()"
        :dense="dense"
        show-select
        hide-default-footer
        :hide-default-header="
          isEmptySort && fastfilter && !showMassActionsCheckboxes
        "
        :class="{
          'hide-sort': isEmptySort,
          'show-mass-actions-checkbox': showMassActionsCheckboxes,
          'mobile-grid': mobBreakpoint
        }"
        :mobile-breakpoint="mobBreakpoint ? 8000 : 600"
      >
        <!--группировка-->
        <template
          v-slot:group.header="{ group, groupBy, items, isOpen, toggle }"
        >
          <td class="pl-5 light-green lighten-3" :colspan="headers.length">
            <div class="d-flex align-center">
              <v-btn class="mr-1" icon tile @click="toggle()">
                <v-icon>{{ isOpen ? 'remove' : 'add' }}</v-icon>
              </v-btn>
              <div class="overline">
                {{ labels[groupBy[0]] }}
              </div>
              <div class="mr-2">:</div>
              <da-preview-list
                class="font-weight-bold"
                :item="items[0]"
                :attr="groupBy[0]"
                :mapKey="mapKey"
              ></da-preview-list>
            </div>
          </td>
        </template>
        <!--группировка end-->

        <!--mass actions checkbox-->
        <template v-slot:header.data-table-select="{ props, on }">
          <v-btn
            v-if="mobBreakpoint && !showMassActionsCheckboxes"
            @click="massActionsPermission = !massActionsPermission"
            icon
          >
            <v-icon>edit</v-icon>
          </v-btn>
          <v-simple-checkbox
            v-else
            v-on="on"
            :value="props.value"
            :indeterminate="props.indeterminate"
            :ripple="false"
          ></v-simple-checkbox>
        </template>
        <!--mass actions checkbox end-->

        <!--header слот-->
        <template
          v-for="(field, index) in headers"
          v-slot:[`header.${field.attr}`]
        >
          <v-fade-transition v-if="field.attr === 'actions'" hide-on-leave>
            <v-btn
              v-if="headersFull.length !== headersVisibleReactive.length"
              class="float-right"
              icon
              @click="showAllRows = !showAllRows"
            >
              <v-icon>{{
                showAllRows
                  ? 'mdi-chevron-double-left'
                  : 'mdi-chevron-double-right'
              }}</v-icon>
            </v-btn>
          </v-fade-transition>
          <v-fade-transition v-else hide-on-leave>
            <span v-if="!loading.set">{{ labels[field.attr] }}</span>
          </v-fade-transition>
        </template>
        <!--header слот end-->

        <!--columns-->
        <template
          v-for="(field, index) in headers"
          v-slot:[`item.${field.attr}`]="pr"
        >
          <div
            v-if="
              field.attr !== 'actions' && fieldDirective(pr.item[field.attr])
            "
            :class="isFabItem(pr.item.id) ? 'row-actions-opened' : ''"
            @dblclick.stop="updateOrViewItem(pr.item)"
            @contextmenu.prevent="triggerRowActions($event, pr.item)"
          >
            <da-view-value
              :key="index"
              class="grid-table-cell"
              :item="pr.item"
              :attr="field.attr"
              :iterable="struc.index[field.attr].items"
              :mapKey="mapKey"
              :scenario="scenario"
              :coms="coms"
              :tooltips="tooltips"
              :rule="rules.update"
              :heightPreviewFile="30"
              v-highlight="pr.item"
              @item:save="saveToggleSwitch(pr.item, field.attr)"
            >
            </da-view-value>
          </div>

          <!--Действия в строке грида-->
          <div
            v-else-if="itemsHasId"
            :key="index"
            v-highlight="pr.item"
            class="grid-table-cell align-center px-0"
          >
            <!--для двойного клика-->
            <tab-link
              v-if="mapItemUpdate"
              :ref="'updateLink_' + pr.item.id"
              :to="'/' + alias + '/' + mapItemUpdate.path + '/' + pr.item.id"
              :title="mapItemUpdate.label"
              :level="level + 1"
              scenario="update"
            >
            </tab-link>
            <!--для двойного клика конец-->

            <v-btn
              v-if="rowActions"
              :block="mobBreakpoint"
              small
              text
              :fab="!mobBreakpoint"
              :tile="mobBreakpoint"
              color="blue darken-2"
              @click.stop="triggerRowActions($event, pr.item, true)"
            >
              <v-icon v-if="isFabItem(pr.item.id)">fa-ellipsis-h</v-icon>
              <v-icon v-else small>fa-ellipsis-h</v-icon>
            </v-btn>
          </div>
          <!--Действия в строке грида end-->
        </template>
        <!--columns end-->

        <!--Сумма-->
        <template v-slot:body.append="{ items, pagination }">
          <tr
            v-if="sums"
            :class="{ 'v-data-table__mobile-table-row': mobBreakpoint }"
          >
            <th class="text-start">Сумма:</th>
            <th
              v-for="(field, index) in headersVisibleWithoutGroup"
              class="text-start"
            >
              <span>{{ sums[field.attr] }}</span>
            </th>
          </tr>
        </template>
        <!--Сумма end-->

        <!--no data slot-->
        <template v-slot:no-data>
          <template v-if="loading.data">
            <v-skeleton-loader-many
              type="card, card, card, card"
              class="mx-auto skeleton-loader-mob"
            ></v-skeleton-loader-many>
            <v-skeleton-loader
              type="table-tbody"
              class="mx-auto skeleton-loader-desktop"
            ></v-skeleton-loader>
          </template>
          <div v-else>
            <span>Нет данных</span>
            <tab-link
              component="v-btn"
              :to="'/' + alias + '/' + mapKey + '/create/' + (parentId || '')"
              class="ml-3"
              color="success"
              text
              :level="level + 1"
            >
              Добавить запись
            </tab-link>
          </div>
        </template>
        <!--no data slot end-->

        <!--pagination slot-->
        <template v-slot:footer="{ props, on }">
          <div class="d-flex align-center justify-end pagination px-2">
            <div class="d-flex align-center">
              <v-btn
                v-if="items.length < totalItems && pageMore < pageCount"
                class="more mr-2"
                color="info"
                tile
                text
                :loading="loading.data"
                @click="more"
              >
                Ещё
              </v-btn>

              <span
                v-show="totalItems > items.length"
                class="mr-2 pagination-in-page"
                >Записей на странице:</span
              >
              <v-select
                v-show="totalItems > items.length"
                class="mr-5"
                hide-details
                :value="pagination.itemsPerPage"
                @change="updatePagination('itemsPerPage', $event)"
                :items="[3, 10, 20, 30, 40]"
              ></v-select>

              <span class="mr-2 ml-1 pagination-info">
                <span>
                  {{ calculatePageInfo(props.pagination) }}
                </span>
              </span>

              <div v-if="totalItems > items.length" class="d-flex align-center">
                <v-btn
                  small
                  text
                  fab
                  @click="
                    $store.commit('clearItems', { mapKey: mapKey })
                    pagination = { ...pagination, page: --props.options.page }
                  "
                  :disabled="props.options.page === 1"
                >
                  <v-icon small>fa-chevron-left</v-icon>
                </v-btn>
                <v-btn
                  small
                  text
                  fab
                  @click="
                    $store.commit('clearItems', { mapKey: mapKey })
                    pagination = {
                      ...pagination,
                      page: (props.options.page = ++pageMore)
                    }
                  "
                  :disabled="
                    props.pagination.itemsPerPage *
                      (props.pagination.page - 1) +
                      items.length ===
                      totalItems
                  "
                >
                  <v-icon small>fa-chevron-right</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </template>
        <!--pagination slot конец-->
      </v-data-table>
      <!--Grid конец-->
    </da-search-card>

    <!--action-btn pageActions-->
    <action-btn
      v-if="!leftWindow && mergedPageActions.length"
      :leftWindow="leftWindow"
      :title="title"
      :level="level"
      :actions="mergedPageActions"
      right
      bottom
      fixed
    ></action-btn>
    <!--action-btn pageActions end-->

    <!--action-btn mass actions-->
    <action-btn
      v-show="!leftWindow && selected.length"
      :title="title"
      :level="level"
      :actions="massActions"
      left
      bottom
      fixed
      :styleObj="{ left: this.menuWidth + 20 + 'px' }"
    ></action-btn>
    <!--action-btn mass actions end-->

    <!--row-actions-->
    <!-- v-if="mobBreakpoint" - отключено: desktop v-speed-deals-->
    <template v-if="rowActions">
      <row-actions-mob
        v-if="true"
        v-model="rowAction.model"
        class="item-bottom-sheet"
        :rowActions="rowActions"
        :editedItem="editedItem"
        :rules="rules"
        :level="level"
        :alias="alias"
        :map="map"
        @sheet:close="rowAction.model = false"
        @item:delete="deleteItem($event)"
        @notification:send="sendNotification($event.path, $event.id)"
      ></row-actions-mob>

      <row-actions
        v-else
        v-model="rowAction.model"
        :trigger="rowAction.trigger"
        :itemId="editedItem.id"
        :event="rowAction.event"
        :rowActions="rowActions"
        :level="level"
        :mapKey="mapKey"
        :alias="alias"
        :map="map"
        @item:delete="deleteItem(editedItem.id)"
        @notification:send="sendNotification(mapKey, editedItem.id)"
      ></row-actions>
    </template>
    <!--row-actions end-->

    <!--dialog Настройки скрыть / показать колонки-->
    <da-dialog
      v-model="dialog.hideColumns"
      randImg
      title="Настроить видимость колонок"
      icon="visibility_off"
      width="600"
      eager
    >
      <v-card class="grid-headers-sort" tile>
        <v-card-text>
          <v-row>
            <v-col cols="5">
              <v-list dense class="h-100">
                <v-subheader>
                  <v-icon class="info--text" left>visibility</v-icon>
                  Видимые
                </v-subheader>
                <v-divider></v-divider>
                <div
                  id="headers-sort-visible"
                  class="h-100"
                  data-group="visible"
                >
                  <template v-for="(header, i) in headersVisible">
                    <div
                      v-if="header.attr !== 'actions'"
                      class="headers-sort-item"
                    >
                      <v-list-item :key="i" selectable>
                        <v-list-item-content>
                          <span class="d-none">{{ header.attr }}</span>
                          <v-list-item-title>{{
                            header.text
                          }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                    </div>
                  </template>
                </div>
              </v-list>
            </v-col>

            <v-col cols="2" class="text-center headers-sort-dividers">
              <div class="d-flex justify-center align-center flex-column h-100">
                <v-divider vertical></v-divider>
                <v-icon class="my-3">swap_horiz</v-icon>
                <v-divider vertical></v-divider>
              </div>
            </v-col>

            <v-col cols="5">
              <v-list dense class="h-100">
                <v-subheader>
                  <v-icon class="red--text" left>visibility_off</v-icon>
                  Скрытые
                </v-subheader>
                <v-divider></v-divider>
                <div id="headers-sort-hidden" class="h-100" data-group="hidden">
                  <template v-for="(header, i) in headersHidden">
                    <div
                      v-if="header.attr !== 'actions'"
                      class="headers-sort-item"
                    >
                      <v-list-item :key="i" selectable>
                        <v-list-item-content>
                          <span class="d-none">{{ header.attr }}</span>
                          <v-list-item-title>{{
                            header.text
                          }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                    </div>
                  </template>
                </div>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text tile @click="dialog.hideColumns = false">
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </da-dialog>
    <!--dialog Настройки скрыть / показать колонки end-->

    <!--dialog для DialogContent компонентов-->
    <da-dialog
      v-model="dialog.import"
      randImg
      icon="fa-file-import"
      fullscreen
      title="Импорт"
    >
      <import-data
        :attrs="attrs"
        :labels="labels"
        :rules="rules"
        :apiUrl="apiUrl"
        :mapKey="mapKey"
        @save:item="saveImport($event.item, $event.scenario)"
        @close:dialog="dialog.import = false"
      ></import-data>
    </da-dialog>
    <!--dialog для DialogContent компонентов end-->
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import Sortable from 'sortablejs'
import HighlightMixin from '~~/mixins/HighlightMixin'
import SetListMixin from '~~/mixins/SetListMixin'

export default {
  mixins: [SetListMixin, HighlightMixin],

  data: () => ({
    editedIndex: -1,
    editedItem: {},
    defaultItem: {},
    searchItem: {},
    searchPanel: [],
    searchPresets: [],
    searchPresetName: null,
    searchPresetError: null,
    searchPresetModel: null,
    viewedItem: {},
    sortItems: [],
    selected: [],
    pagination: {
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      page: 1
    },
    pageMore: 1,
    searchTimer: null,
    dense: false,
    rowAction: {
      trigger: false,
      model: false,
      event: null
    },
    rand: Math.floor(Math.random() * 100000),
    sortable: null, // instance сортировки строк
    sortableHeaders: {
      // instance сортировки видимых | скрытых колонок
      visible: null,
      hidden: null
    },
    dialog: {
      hideColumns: false,
      import: false
    },
    // триггер для срабатывания computed headersVisible, headersHidden
    updateHeadersTrigger: false,
    massActionsPermission: false,
    // есть ли ID у items
    itemsHasId: false,
    loading: {
      set: true,
      data: true
    },
    scope: null,
    showAllRows: false,
    scrollTrigger: false
  }),

  props: {
    mapKey: String,
    mapKeyFull: String,
    rowActions: Array,
    pageActions: {
      type: Array,
      default: () => []
    },
    parentAttr: String,
    title: String,
    level: Number,
    apiUrl: String,
    siblings: {
      type: Array,
      default: () => []
    },
    map: Object,
    leftWindow: Boolean,
    scenario: String,
    editedItemInit: {
      type: Object,
      default: function() {
        return {}
      }
    },
    reloadSet: Boolean,
    reloadData: Boolean,
    setParams: Object,
    isSidebarBtn: Boolean,
    sidebar: Boolean
  },

  created() {
    this.init()
  },

  inject: {
    windowId: {
      default: 0
    },
    tabsId: {
      default: 0
    },
    pathInit: {
      default: null
    },
    gridEvents: {
      default: null
    },
    $validator: {
      default: null
    }
  },

  methods: {
    test(e) {
      console.log(e)
    },
    /**
     * Сортировка init
     * */
    sortInit() {
      if (this.mobBreakpoint) return

      let wrapper = document.querySelector(
        '#data-table-' + this.rand + ' tbody'
      )
      this.sortable = this.defaultSortInit(
        wrapper,
        this.apiUrl + '/' + this.mapKey,
        this,
        'items'
      )
    },

    /**
     * Сортировка ON
     * */
    sortOn() {
      this.sortable.option('disabled', false)
    },

    /**
     * Сортировка OFF
     * */
    sortOff() {
      this.sortable.option('disabled', true)
    },

    /**
     * drag-drop Сортировка headers
     * в Настройке порядока отображения колонок
     * */
    sortHeadersInit() {
      if (this.sortableHeaders.visible) return

      let visibleWrapper = document.getElementById('headers-sort-visible')
      let hiddenWrapper = document.getElementById('headers-sort-hidden')

      if (!visibleWrapper || !hiddenWrapper) return

      let _context = this

      let config = {
        animation: 150,
        ghostClass: 'sort-drop',
        group: 'headers-group',
        onEnd({ to, from, oldIndex, item }) {
          let attr = item.querySelector('.d-none').innerText
          const fromGroup = from.attributes['data-group'].value
          const toGroup = to.attributes['data-group'].value
          const cookieKey = 'grid-hidden-headers-attrs-' + _context.mapKey

          let hiddenAttrs = _context.storage.get(cookieKey) || ''
          let hiddenAttrsArr = hiddenAttrs.split('|')

          if (toGroup === 'hidden') {
            hiddenAttrsArr.push(attr)
          } else if (toGroup === 'visible') {
            hiddenAttrsArr = hiddenAttrsArr.filter(at => at !== attr)
          }
          hiddenAttrs = hiddenAttrsArr.join('|')
          _context.storage.set(cookieKey, hiddenAttrs)

          setTimeout(() => {
            // задержка чтобы убрать лаги drop колонки при ререндере grid
            _context.updateHeadersTrigger = !_context.updateHeadersTrigger
          }, 200)
        }
      }
      this.sortableHeaders.visible = Sortable.create(visibleWrapper, config)
      this.sortableHeaders.hidden = Sortable.create(hiddenWrapper, config)
    },

    /**
     * Инициализация
     */
    async init() {
      this.scope = 'grid-scope-' + this.mapKey
      this.socketEvents()

      if (this.leftWindow) {
        return
      }

      await this.getSetAndLists()

      if (this.scenario === 'create') {
        this.createItem()
      } else if (this.scenario === 'update') {
        await this.updateItem(this.id)
      } else if (this.scenario === 'view') {
        await this.viewItem(this.id)
      } else {
        this.fetchItems()
      }
    },

    /**
     *  Сокет событие - CHANGE
     * */
    changeSocket(ids, action) {
      if (
        (this.$config.socket && this.$config.socket.off) ||
        !this.$config.socket
      )
        return

      this.socket.emit('update-grid', {
        ids: ids,
        comKey: this.comKey,
        action: action,
        socetId: this.socket.id,
        appAccountId: this.$config.appAccountId
      })
    },

    /**
     *  Сокет события
     * */
    socketEvents() {
      if (
        (this.$config.socket && this.$config.socket.off) ||
        !this.$config.socket
      )
        return

      //Слушатель сокет события - update-grid
      this.socket.on('update-grid', ({ comKey, ids, action, appAccountId }) => {
        // Задержка - API не успевает занести изменения а socket уже требует обновления
        setTimeout(() => {
          if (
            appAccountId !== this.$config.appAccountId ||
            this.comKey !== comKey ||
            this.scenario !== 'search'
          )
            return

          // если совпали appAccountId и comKey, а так же scenario = search - обновить данные по api
          if (action === 'delete') {
            this.delItemsByIds(ids)
          } else {
            ids.forEach(id => {
              this.fetchItem(id)
              const index = this.items.findIndex(item => item.id === id)
              this.highlightItem(this.items[index])
            })
          }
        }, 100)
      })
    },

    async getItem(id) {
      const index = this.items.findIndex(item => item.id === Number(id))
      let item = { ...this.items[index] } // создать новый обьект для отсутствия live редактирования
      if (this._.isEmpty(item) || this.reloadData) {
        item = await this.fetchItem(id)
      }
      return { index, item }
    },

    /**
     * Получить set и list по API
     */
    async getSetAndLists() {
      this.loading.set = true
      let params = { ...this.setParams }
      if (this.reloadSet) {
        params = {
          ...params,
          id: this.id
        }
      }
      if (this.parentAttr) {
        params = { ...params, [this.parentAttr]: this.parentId }
      }

      await this.prepSetList(
        this.apiUrl,
        params,
        this.reloadSet,
        [],
        this.parentAttr
      )
      this.loading.set = false
    },

    /**
     * Получить данные по API
     * и записать в хранилище
     */
    async fetchItems(more = false) {
      this.loading.data = true

      const response = await this.query.get(
        this.apiUrl + '/' + this.mapKey,
        this.getParams(more),
        true,
        false,
        ['dtEn']
      )
      let items = response.data && response.data.data

      if (more) {
        items = [...this.items, ...items]
      }

      // Если есть хотя бы один item и у items нет атрибута id - itemsHasId = false
      if (items.length) {
        this.itemsHasId = !!items[0].id
      } else {
        this.itemsHasId = true
      }

      // Запросить зависимые lists
      for (let item of items) {
        for (let attr in this.set.lists) {
          await this.$store.dispatch('fetchList', {
            mapKey: this.mapKey,
            apiUrl: this.apiUrl,
            attr,
            item
          })
        }
      }

      const data = {
        items: items,
        totalItems: response.data.dataAdd && response.data.dataAdd.count
      }

      this.$store.dispatch('saveItems', { mapKey: this.mapKey, data: data })

      this.hideEmptyRows()

      if (
        this.set &&
        this.set.sort &&
        this.set.sort.defaultOrder &&
        this.set.sort.defaultOrder.sort
      ) {
        this.sortInit()
      }
      this.loading.data = false
    },

    /**
     * Получить 1 запись
     * */
    async fetchItem(id, loading = true) {
      this.loading.data = true
      const response = await this.query.get(
        this.apiUrl + '/' + this.mapKey + '/' + id,
        {},
        loading,
        false,
        ['dtEn']
      )
      this.$store.dispatch('saveItem', {
        mapKey: this.mapKey,
        data: response.data.data
      })
      this.loading.data = false
      return response.data.data
    },

    /**
     * Загрузить еще items from api
     * */
    async more() {
      await this.fetchItems(true)
      this.pageMore++
    },

    /**
     * Скрыть столбцы с пустыми ячейками
     * исключение boolean
     * */
    hideEmptyRows() {
      if (!this.items.length) return

      let notEmptyAttrs = []

      if (this.items.length === 1) {
        // если одна запись reduce не подойдет
        for (let [attr, val] of Object.entries(this.items[0])) {
          if (
            (Array.isArray(val) && val.length) ||
            (!Array.isArray(val) && val)
          ) {
            notEmptyAttrs.push(attr)
          }
        }
      } else {
        notEmptyAttrs = this.items.reduce((prevAttrs, curItem, index) => {
          if (index === 1) {
            const firstItem = { ...prevAttrs }
            prevAttrs = []
            for (let [attr, val] of Object.entries(firstItem)) {
              if (val) {
                prevAttrs.push(attr)
              }
            }
          }

          const curAttrs = []
          for (let [attr, val] of Object.entries(curItem)) {
            if (val) {
              curAttrs.push(attr)
            }
          }

          return [...new Set([...curAttrs, ...prevAttrs])]
        })
      }

      notEmptyAttrs.push('actions')

      let headers = []
      this.headersFull.forEach(field => {
        // для составных полей(type === 'composite') пока не скрывать
        if (
          field.type === 'composite' ||
          notEmptyAttrs.includes(field.attr) ||
          (this.rules.update && /boolean/.test(this.rules.update[field.attr]))
        ) {
          headers.push(field)
        }
      })

      const set = {
        ...this.set,
        headers: headers
      }

      this.$store.commit('saveSet', {
        mapKey: this.mapKey,
        set: set
      })
    },

    /**
     * Получить параметры для запроса
     **/
    getParams(more = false) {
      let addParams = {}
      let searchParams = {}

      addParams = this.addParentParams

      let params = { ...addParams, ...this.$config.api.params.list }
      params.limit = this.pagination.itemsPerPage
      params.page = more ? this.pageMore + 1 : this.pagination.page
      params.sort = this.getSort()

      //добавить в запрос search Filter
      for (let attr in this.searchItem) {
        let value = this.searchItem[attr]
        if (value) {
          searchParams[attr] = value
        }
      }

      return Object.assign({}, params, searchParams)
    },

    /**
     * Получить сортировку
     * @returns {string}
     */
    getSort() {
      if (this.pagination.sortDesc.length && this.pagination.sortBy.length) {
        let prefix = this.pagination.sortDesc[0] ? '' : '-'
        return prefix + this.pagination.sortBy[0]
      }
      return ''
    },

    /**
     * Добавить звездочку в обязательное поле
     * */
    getStar(rule) {
      if (/required/.test(rule)) {
        return ' *'
      } else {
        return ''
      }
    },

    /**
     * Создание элемента
     */
    createItem() {
      this.$validator.reset()
      this.editedItem = {}
      if (this.parentAttr && this.parentId) {
        this.editedItem = {
          ...this.editedItem,
          ...{ [this.parentAttr]: this.parentId }
        }
      }
    },

    /**
     * Редактирование элемента
     * @param id
     */
    async updateItem(id) {
      this.$validator.reset()
      const editedObj = await this.getItem(id)
      this.editedIndex = editedObj.index
      this.editedItem = editedObj.item
    },

    /**
     * Удаление элемента
     * @param id
     */
    async deleteItem(id) {
      if (confirm('Вы уверены что хотите удалить?')) {
        await this.query.delete(this.apiUrl + '/' + this.mapKey + '/' + id)
        const index = this.items.findIndex(item => item.id === id)
        this.$store.commit('delItems', { mapKey: this.mapKey, index: index })
        this.reloadLists()
        this.hideEmptyRows()
        this.changeSocket([id], 'delete')
      }
    },

    /**
     * Массовое удаление элементов
     */
    async deleteItems(ids) {
      if (confirm('Вы уверены что хотите удалить?')) {
        await this.query.delete(this.apiUrl + '/' + this.mapKey + '/delete', {
          ids: ids
        })
        this.delItemsByIds(ids)
        this.reloadLists()
        this.changeSocket(this.selectedIds, 'delete')
        this.fetchItems()
        this.selected = []
      }
    },

    delItemsByIds(ids) {
      let indexes = []
      this.items.forEach((item, i) => {
        if (ids.indexOf(item.id) !== -1) {
          indexes.push(i)
        }
      })
      this.$store.commit('delItems', {
        mapKey: this.mapKey,
        index: indexes
      })
    },

    /**
     * Просмотр элемента
     * @param id
     */
    async viewItem(id) {
      this.viewedItem = (await this.getItem(id)).item
    },

    /**
     * если разрешено - Редактирование или - Просмотр элемента
     */
    updateOrViewItem(item) {
      if (this.mapItemUpdate) {
        this.$refs['updateLink_' + item.id][0].$el.click()
      } else {
        this.viewItem(item.id)
      }
    },

    /**
     * Скрыть ячейки таблицы с пустыми значениями
     * в мобильной версии
     * */
    hideEmptyCols() {
      setTimeout(() => {
        const rows = document.getElementsByClassName('v-data-table__mobile-row')
        for (let i = 0; i < rows.length; i++) {
          const rowWrap = rows[i]
          const row = rowWrap.querySelector('.v-data-table__mobile-row__cell')
          const rowCell = rowWrap.querySelector('.da-view-v-cell')
          if (row && !row.children.length) {
            rowWrap.classList.add('hide-row')
          }
          if (
            rowCell &&
            !rowCell.innerText.length &&
            !rowCell.children.length
          ) {
            rowWrap.classList.add('d-none')
          }
        }
      }, 300)
    },

    /**
     * Установить значения по умолчанию
     **/
    setDefault() {
      Object.assign(this.editedItem, this.defaultItem)
    },

    /**
     * Закрыть окно редактирования
     */
    close() {
      if (this.gridEvents) {
        this.gridEvents().closeEvent()
        return
      }

      this.$store.dispatch('closeCurrentTab', { tabsId: this.tabsId })
      setTimeout(() => {
        this.setDefault()
        this.editedIndex = -1
      }, 1000)
    },

    /**
     * Сохранить
     * @param {Boolean} close - закрыть tab вкладку
     * @param {String} scenario - сценарий
     * @param {Boolean} showMsg - показать ошибки Api валидации всплывающим сообщением (snackbar)
     */
    async save(item, close = true, scenario, showMsg = false) {
      const onValidateError = () => {
        this.$store.commit('DaSnackbar/show', {
          text: 'Исправьте <span class="red--text"> ошибки валидации</span>',
          icon: 'warning',
          iconColor: 'white',
          timeout: 2000
        })
        this.scrollTrigger = true
      }

      if (!scenario) {
        scenario = this.scenario
      }

      // Выполнить метод store.GridState.beforeSave - продолжить выполенние только если он вернул true
      if (this.beforeSave) {
        if (!(await this.beforeSave())) return
      }

      if (!(await this.$validator.validateAll(this.scope))) {
        onValidateError()
        return false
      }

      let response = {}
      if (scenario === 'update') {
        // если update
        response = await this.query
          .put(
            this.apiUrl + '/' + this.mapKey + '/' + item.id,
            item,
            true,
            ['dtEn'],
            this,
            false,
            showMsg
          )
          .catch(error => {
            onValidateError()
          })
      } else {
        // если новая запись
        response = await this.query
          .post(this.apiUrl + '/' + this.mapKeyFull, item, true, ['dtEn'], this)
          .catch(error => {
            onValidateError()
          })

        this.editedItem.id = response.data.data.id
        this.editedIndex = 0 // подсветить (highlight) первую запись(index = 0)

        if (this.gridEvents) {
          this.gridEvents().selectContact(this.editedItem.id)
        }
      }

      if (!response.data.data) return

      this.$store.dispatch('saveItem', {
        mapKey: this.mapKey,
        data: response.data.data
      })

      // Выполнить метод afterSave если задан
      if (!this._.isEmpty(this.afterSave)) {
        Object.values(this.afterSave).forEach(func => func(this.editedItem.id))
        this.$store.commit('afterSaveGridClear')
      }

      this.reloadLists()
      this.changeSocket([this.editedItem.id], this.scenario)
      this.hideEmptyRows()
      close && this.close()
      this.$nextTick(() => this.highlightItem(this.items[this.editedIndex]))
      return true
    },

    /**
     * Сохранить импортируемые записи, если ошибка открыть модальное окно импорта
     * */
    saveImport(item, scenario) {
      if (scenario === 'update') {
        item.id = parseInt(item.id)
        this.editedIndex = this.items.findIndex(itm => itm.id === item.id)
      }
      this.save(item, false, scenario).catch(() => (this.dialog.import = true))
    },

    /**
     * Сохранить при переключении da-toggle
     * */
    saveToggleSwitch(item, attr) {
      this.editedItem = item
      this.save(this.editedItem, false, 'update', true).catch(
        () => (item[attr] = !item[attr])
      )
    },

    updatePagination(attr, val) {
      this.pagination = { ...this.pagination, [attr]: val }
    },

    /**
     * Получить строку для grid footer pagination info
     * */
    calculatePageInfo(pagination) {
      const lastPage =
        pagination.page > pagination.pageCount
          ? pagination.pageCount
          : pagination.page
      let from = pagination.itemsPerPage * (lastPage - 1) + 1
      let to = pagination.itemsPerPage * (lastPage - 1) + this.items.length
      from = from < 0 ? 0 : from
      to = to < 0 ? 0 : to

      return from + ' - ' + to + ' из ' + this.totalItems
    },

    /**
     * Перезагрузить lists которые имеют ключ firstListKey === текущему mapKey ( state.GridState.lists[firstListKey] )
     * */
    reloadLists() {
      this.$store.commit('delListsByFirstListKey', this.mapKey)
      this.$store.dispatch('fetchLists', {
        mapKey: this.mapKey,
        apiUrl: this.apiUrl
      })
    },

    /**
     * Клик по кнопке  fast filter
     * */
    fastFilterClick(attr, id) {
      id = parseInt(id)

      if (/each/.test(this.rules.search[attr])) {
        // если мультивыбор по атрибуту
        if (this.searchItem[attr] && this.searchItem[attr].includes(id)) {
          const index = this.searchItem[attr].findIndex(i => i === id)
          Vue.set(this.searchItem, attr, [])
        } else {
          if (!this.searchItem[attr]) {
            Vue.set(this.searchItem, attr, [])
          }
          this.searchItem[attr].push(id)
        }
      } else {
        // если одиночный выбор
        if (this.searchItem[attr] === id) {
          Vue.set(this.searchItem, attr, null)
        } else {
          Vue.set(this.searchItem, attr, id)
        }
      }
    },

    saveSearchPreset() {
      this.searchPresetError = null
      // Валидация прессета ----------------------------------------
      if (!this.searchPresetName) {
        this.searchPresetError = 'Задайте название поиска'
        return
      }
      // проверка на уникальность имени прессета
      const index = this.searchPresets.findIndex(
        p => p.label === this.searchPresetName
      )
      if (index !== -1) {
        this.searchPresetError = 'Поиск с таким именем уже существует'
        return
      } //--------------------------------------------------------------

      const key = 'grid-search-pressers-' + this.mapKey

      let preset = {
        label: this.searchPresetName,
        searchItem: this.searchItem
      }

      this.searchPresets.push(preset)
      this.storage.set(key, this.searchPresets)

      this.$store.commit('DaSnackbar/show', {
        text: 'Поиск: ' + this.searchPresetName + ' - успешно сохранен'
      })

      this.searchPresetModel = false
      this.searchPresetName = ''
    },

    /**
     * export в Excel
     * */
    async exportExcel() {
      let { json2excel, excel2json } = require('js2excel')

      // заменить id списков и boolean на их значения
      let data = this.items.map(item => {
        let exportedItem = {}
        for (let [attr, val] of Object.entries(item)) {
          const header = this.labels[attr]
          if (this.isList(this.mapKey, attr)) {
            exportedItem = {
              ...exportedItem,
              [header]: this.getListLabel(
                this.mapKey,
                attr,
                item[attr],
                item,
                {}
              )
            }
          } else if (/boolean/.test(this.rules.update[attr])) {
            exportedItem = {
              ...exportedItem,
              [header]: this.$options.filters.formatBoolean(val)
            }
            // композитные поля
          } else if (Array.isArray(val)) {
            val.forEach((v, i) => {
              exportedItem = { ...exportedItem, [header + '--' + i]: v }
            })
          } else {
            exportedItem = { ...exportedItem, [header]: val }
          }
        }
        return exportedItem
      })

      try {
        json2excel({
          data,
          name: 'export-grid-table'
        })
      } catch (e) {
        console.error('export error:' + e)
      }
    },

    /**
     * Отправить уведомление
     * */
    async sendNotification(path, id) {
      const response = await this.query.get(this.apiUrl + '/' + path, {
        id: id
      })
      if (response.data.data.message) {
        this.$store.commit('DaSnackbar/show', {
          text: response.data.data.message
        })
      }
    },

    triggerRowActions(event, item, includeMobile = false) {
      const clickOnToggle = !!event.target.closest('.js-no-row-actions-trigger')
      if (clickOnToggle) return

      this.editedItem = { ...item }
      this.rowAction.model = true

      // отключено: desktop v-speed-deal
      //   if (!this.mobBreakpoint) {
      //     this.rowAction.trigger = !this.rowAction.trigger
      //     this.rowAction.event = event
      //   } else if (includeMobile) {
      //     this.rowAction.model = true
      //   }
    },

    /**
     * Если в searchItem[attr] есть такой id - подсветить btn(selected)
     * */
    isSelectedBtn(attr, id) {
      id = parseInt(id)
      return /each/.test(this.rules.search[attr])
        ? this.searchItem[attr] && this.searchItem[attr].includes(id)
        : this.searchItem[attr] === id
    },

    /**
     * Проверить является ли item тем, для которого сейчас открыто row-actions меню
     */
    isFabItem(itemId) {
      return this.rowAction.model && this.editedItem.id === itemId
    }
  },

  computed: {
    cardIcon() {
      if (this.scenario === 'create' || this.scenario === 'update') {
        return 'edit'
      } else if (this.scenario === 'view') {
        return 'remove_red_eye'
      } else if (this.scenario === 'chart') {
        return 'insert_chart'
      } else {
        return 'mdi-texture'
      }
    },
    /**
     * @return {Array}
     * Реактивным делать нельзя - не работает сортировка
     * */
    headersVisible() {
      const cookieKey = 'grid-hidden-headers-attrs-' + this.mapKey
      const hiddenAttrs = this.storage.get(cookieKey) || ''
      const hiddenAttrsArr = hiddenAttrs.split('|')
      if (hiddenAttrsArr.length) {
        return this.headers.filter(
          header => !hiddenAttrsArr.includes(header.attr)
        )
      } else {
        return this.headers
      }
    },
    /**
     * @return {Array}
     * Обьеденить с headersVisible нельзя - headersVisible не изменяется, поэтому кешируется и не получает даннные с localStorage
     * */
    headersVisibleReactive() {
      this.updateHeadersTrigger //<-для реактивности
      const cookieKey = 'grid-hidden-headers-attrs-' + this.mapKey
      const hiddenAttrs = this.storage.get(cookieKey) || ''
      const hiddenAttrsArr = hiddenAttrs.split('|')
      if (hiddenAttrsArr.length) {
        return this.headers.filter(
          header => !hiddenAttrsArr.includes(header.attr)
        )
      } else {
        return this.headers
      }
    },
    /**
     * @return {Array}
     * */
    headersHidden() {
      const cookieKey = 'grid-hidden-headers-attrs-' + this.mapKey
      const hiddenAttrs = this.storage.get(cookieKey) || ''
      const hiddenAttrsArr = hiddenAttrs.split('|')
      if (hiddenAttrsArr.length) {
        return this.headers.filter(header =>
          hiddenAttrsArr.includes(header.attr)
        )
      } else {
        return this.headers
      }
    },
    headersVisibleWithoutGroup() {
      return this.headersVisibleReactive.filter(
        header => header.attr !== this.groups
      )
    },
    // является ли атрибут в set.groups скрытым
    isGroupsAttrHide() {
      return (
        this.headersVisibleReactive.length ===
        this.headersVisibleWithoutGroup.length
      )
    },
    localData() {
      const gridData = this.$store.state.GridState.data
      return (
        gridData &&
        gridData[this.$config.service] &&
        gridData[this.$config.service][this.mapKey]
      )
    },
    itm() {
      return this.localData && this.localData.itm
    },
    items() {
      return (this.itm && this.itm.items) || []
    },
    totalItems() {
      return (this.itm && this.itm.totalItems) || 0
    },
    pageCount() {
      return Math.ceil(this.totalItems / this.pagination.itemsPerPage)
    },
    /**
     * Получить parent id
     */
    parentId() {
      if (!this.parentAttr) return

      if (this.scenario === 'update') {
        return this.editedItem[this.parentAttr]
      }
      return this.id
    },
    comKey() {
      return this.mapKey + '-' + this.parentAttr + '-' + this.parentId
    },
    /**
     * Получить id  из url
     */
    id() {
      const path = this.pathInit ? this.pathInit : window.location.pathname
      const parts = path.split('/')
      const id = parseInt(parts[parts.length - 1])
      return Number.isInteger(id) ? id : null
    },
    isEmptySearchItem() {
      let isEmpty = true
      for (let [key, item] of Object.entries(this.searchItem)) {
        if (Array.isArray(item)) {
          if (item.length) {
            isEmpty = false
          }
        } else {
          if (item) {
            isEmpty = false
          }
        }
      }
      return isEmpty
    },
    /**
     * Вернуть true если:
     * - моб версия и нет видимых сортируемых полей в grid
     * @return {boolean}
     * */
    isEmptySort() {
      if (!this.mobBreakpoint || !(this.sort && this.sort.attrs)) return false

      let hide = true
      const visibleAttrs = this.headersVisibleReactive.map(h => h.attr)
      visibleAttrs.forEach(attr => {
        if (this.sort.attrs.includes(attr)) {
          hide = false
        }
      })
      return hide
    },
    alias() {
      return this.url().alias
    },
    addParentParams() {
      if (this.parentId && this.parentAttr) {
        return { [this.parentAttr]: this.parentId }
      }
    },
    addActions() {
      let out = []
      this.pageActions.forEach(mapKey => {
        let mapItem = this.map[mapKey]
        if (!mapItem) return

        if (mapItem.scenario === 'create') {
          let act = {
            title: mapItem.label,
            url: '/' + this.alias + '/' + mapKey + '/' + (this.parentId || ''),
            color: 'green',
            icon: 'fa-plus'
          }
          out.push(act)
        } else {
          let act = {
            title: mapItem.label,
            url: '/' + this.alias + '/' + mapKey,
            color: 'blue-grey',
            icon: 'fa-list'
          }
          if (this.parentId) {
            act.url += '/' + this.parentId
          }
          out.push(act)
        }
      })
      return out
    },
    defaultActions() {
      return {
        create: [
          {
            title: 'Сохранить',
            method: () => this.save(this.editedItem),
            color: 'green',
            icon: 'fa-check'
          }
        ],
        update: [
          {
            title: 'Сохранить',
            method: () => this.save(this.editedItem),
            color: 'green',
            icon: 'fa-check'
          }
        ],
        view: [
          {
            title: 'Закрыть',
            method: () => this.close(),
            color: 'info',
            icon: 'fa-arrow-left'
          }
        ]
      }
    },
    mergedPageActions() {
      return [...this.addActions, ...(this.defaultActions[this.scenario] || [])]
    },
    // Действия при массовом выборе
    massActions() {
      let out = []
      const delAction =
        this.rowActions &&
        this.rowActions.includes(this.mapKey + '/' + 'delete')
      if (delAction) {
        out.push({
          title: 'Удалить',
          method: () => this.deleteItems(this.selectedIds),
          color: 'red',
          icon: 'fa-trash'
        })
      }
      return out
    },
    showMassActionsCheckboxes() {
      return (
        this.itemsHasId &&
        ((this.mobBreakpoint && this.massActionsPermission) ||
          !this.mobBreakpoint)
      )
    },
    selectedIds() {
      return this.selected.map(item => item.id)
    },
    mobBreakpoint() {
      return this.localSidebar || this.$vuetify.breakpoint.xs
    },
    // mapItem со сценарием update
    mapItemUpdate() {
      let out
      if (!this.rowActions) return

      this.rowActions.forEach(path => {
        if (this.map[path].scenario === 'update') {
          out = {
            path: path,
            ...this.map[path]
          }
        }
      })
      return out
    },
    localSidebar: {
      get() {
        return this.sidebar
      },
      set(val) {
        this.$emit('update:sidebar', val)
      }
    },
    ...mapState(['socket', 'window', 'prevRoute']),
    ...mapState({
      tabs: state => state.TabState.tabs,
      user: state => state.UserState.user,
      beforeSave: state => state.GridState.beforeSave,
      afterSave: state => state.GridState.afterSave
    }),
    ...mapGetters([
      'insertUrlParam',
      'url',
      'query',
      'fieldDirective',
      'defaultSortInit',
      'storage',
      'scrollToError',
      'menuWidth',
      'isList',
      'getListLabel'
    ]) // проксируем getters
  },

  watch: {
    pagination: {
      handler(newValue, oldValue) {
        ///ПОКА НЕ ПОЛУЧАЕТСЯ
        // let urlPaginationBind = () => {// связать url с pagination
        //   let page = this.$route.query.page;// если есть параметры в url добавить их в pagination
        //   page && this.pagination.page && (this.pagination.page != page) && (this.pagination.page = page);
        //
        //   console.log(page);
        //   console.log(this.pagination);
        //
        //   this.insertUrlParam('page', (newValue.page == 1) ? '' : newValue.page);//Если есть параметры pagination (page и тд) добавить их к url
        // }
        //
        // urlPaginationBind();

        // if (newValue.page === oldValue.page) {
        //   this.pagination.initRowsPerPage = newValue.rowsPerPage;
        //   console.log(this.pagination.initRowsPerPage);
        //   console.log(newValue.page);
        //   console.log(oldValue.page);
        // }

        // console.log(newValue);
        // console.log(newValue.page);
        // console.log(this.pageCount);

        // if (newValue.page > this.pageCount) {
        // 	--this.pagination.page;
        // 	return;
        // }
        this.pageMore = newValue.page

        if (this.sortable) {
          newValue.sortBy[0] ? this.sortOff() : this.sortOn()
        }

        // Нужно ли делать запрос при смене pagination
        if (
          (newValue.sortDesc[0] !== oldValue.sortDesc[0] ||
            newValue.sortBy[0] !== oldValue.sortBy[0] ||
            newValue.page !== oldValue.page ||
            newValue.itemsPerPage !== oldValue.itemsPerPage) &&
          this.scenario === 'search'
        ) {
          this.fetchItems()
        }
      },
      deep: true
    },
    searchItem: {
      handler(val) {
        this.$validator.validateAll(val).then(validate => {
          if (validate) {
            clearTimeout(this.searchTimer)
            // Запрос только спустя 1с после окончания ввода в поле поиска
            this.searchTimer = setTimeout(() => this.fetchItems(), 1000)

            if (this.sortable) {
              this.isEmptySearchItem ? this.sortOn() : this.sortOff()
            }
          }
        })
      },
      deep: true
    },
    editedItemInit: {
      handler(val) {
        this.editedItem = val
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.grid {
  margin-bottom: 80px;

  .grid-toolbar {
    .grid-toolbar-icon {
      margin-left: -6px;
    }
  }

  .radio-group {
    margin-top: -15px;

    .radio-group-label {
      font-size: 13px;
      color: #5b5b5b;
    }
  }

  .v-data-table.grid-data-table {
    .v-data-table__wrapper {
      min-height: 60vh;
    }

    .search-panel {
      max-width: 40px;
    }

    tbody tr {
      td.text-start:first-child {
        text-align: center !important;
      }

      td {
        height: auto;
        padding: 0;
        position: relative;

        .grid-table-cell {
          height: 100%;
          min-height: 40px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .row-actions-opened {
          .grid-table-cell {
            transition: none;
            color: blue;
          }
        }
      }

      &:nth-of-type(odd) {
        background-color: rgba(0, 0, 0, 0.03);
      }
    }

    .pagination {
      font-size: 12px;

      .more {
        font-size: 10px;
        height: 26px;
        min-width: 48px;
        padding: 0 5px;
      }

      & > div {
        max-width: 420px;

        .v-input {
          font-size: 14px;
          transform: translateY(-10px);
          width: 50px;
        }
      }

      .pagination-info {
        min-width: 80px;
      }
    }

    .skeleton-loader-mob {
      display: none;

      .v-skeleton-loader__bone {
        margin-bottom: 10px;
      }
    }

    .skeleton-loader-desktop {
      display: block;
    }
  }

  .sort-drag {
    background-color: #d4e157 !important;
  }
}

.grid-data-table.mobile-grid.v-data-table {
  .v-data-table__wrapper {
    min-height: auto;
  }
  &.hide-sort {
    .v-data-table-header-mobile__wrapper {
      .v-input--hide-details {
        display: none;
      }
    }
  }

  &.show-mass-actions-checkbox {
    td.v-data-table__mobile-row:first-child {
      display: flex;

      .v-data-table__mobile-row__cell {
        width: 100%;

        .v-data-table__checkbox {
          float: left;
        }
      }
    }
  }

  .v-data-table-header-mobile__wrapper {
    .v-data-table-header-mobile__select {
      justify-content: flex-start;
    }
  }

  tbody tr {
    td {
      .grid-table-cell {
        padding: 0;
        min-height: auto;
      }

      .v-data-table__mobile-table-row {
        .v-data-table__mobile-row:last-child {
          width: 100%;
        }
      }
    }

    td.v-data-table__mobile-row {
      padding: 1px 15px;
      min-height: 25px;

      .v-data-table__mobile-row__header {
        font-weight: 400;
      }

      &.hide-row {
        padding: 0;
        min-height: 0;
      }
    }

    td.v-data-table__mobile-row:first-child {
      display: none;
      padding-top: 10px;
    }

    td.v-data-table__mobile-row:last-child {
      width: 100%;
      padding-bottom: 10px;

      .v-data-table__mobile-row__cell {
        width: 100%;
      }
    }
  }

  .skeleton-loader-mob {
    display: block;
  }

  .skeleton-loader-desktop {
    display: none;
  }
}

.grid-headers-sort {
  .headers-sort-item:hover {
    background-color: #f5f5f5;
    cursor: pointer;
  }

  .headers-sort-dividers {
    .v-divider {
      min-height: 40%;
      align-self: center;
    }
  }
}
</style>
