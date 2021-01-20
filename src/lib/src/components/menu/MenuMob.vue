<template>
  <menu-mob-simple ref="menuSimple" :badges="badges">
    <template v-slot:toolbar-title>
      <div class="d-flex align-center">
        <!-- <v-img
          :max-width="40"
          :src="$conv('assets/' + findService + '/img/logo-mini.jpeg')"
          class="mb-2"
          alt="logo"
        /> -->
        <div class="logo-name text-truncate" v-if="showPageName">
          {{ pageName }}
        </div>
      </div>
      <!-- <div class="logo-name" v-if="companyName" @click="openPromoCheck">
        {{ companyName }}
      </div> -->
    </template>

    <template v-slot:toolbar-right>
      <v-btn v-if="filterToolbarButton" icon @click="openFilter">
        <v-icon small>fa-filter</v-icon>
      </v-btn>
      <DaDarkThemeButton />
      <slot name="toolbar-right"></slot>
    </template>
  </menu-mob-simple>
</template>

<script>
/**
 * Надстройка Меню
 * с запросом на NotReadMessages для пункта меню "support"-(Чат) и socketEvents на новые сообщения
 */
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import ContractMixin from '~~/mixins/ContractMixin'
import MenuMobSimple from './MenuMobSimple'
import DaDarkThemeButton from '~~/components/elems/DaDarkThemeButton.vue'

export default {
  name: 'menu-mob',
  components: { MenuMobSimple, DaDarkThemeButton },
  mixins: [ContractMixin],

  mounted() {
    this.init()
  },

  props: {
    // Показать в тулбаре название компонента из compare.header
    showPageName: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // badges на пунктов меню
      badges: []
    }
  },

  methods: {
    async init() {
      //   this.setBadgeOnChat(await this.getNotReadMessages())
      //   this.socketEvents()
    },

    /**
     *  Сокет Events
     * */
    socketEvents() {
      if (this.$config.socket.off) return
      //Подписатся на Сокет событие: add-chat-message
      this.socket.on('add-chat-message', data => {
        if (data.message.userIdTo === this.user.id) {
          this.getNotReadMessages()
        }
      })
    },

    /**
     * Получить непрочитанные сообщения для чата
     * @return {Promise<void>}
     */
    async getNotReadMessages() {
      // Получить массив outAuthClientUserIds ----------
      const addParams = {
        withClient: 1,
        toMe: 1,
        expand: 'outAuthClientUserId'
      }
      await this.contractMixinInit(addParams)
      let outAuthClientUserIds = this.contracts.map(
        contract => contract.outAuthClientUserId
      )
      // -----------------------------------------------

      let params = {
        read: 0,
        userId: outAuthClientUserIds
      }
      if (this.$config.service === 'lk') {
        params = { ...params, toMe: 1 }
      }
      if (this.$config.service === 'ls') {
        params = { ...params, my: 1 }
      }

      const response = await this.query.get(
        this.$config.api.url.post + '/chat/message/count',
        params
      )
      return response.data.data
    },

    /**
     * добавить Badge на пункт меню - Chat
     * */
    setBadgeOnChat(notReadMessagesCount) {
      const chatIndex = this.$refs.menuSimple.items.findIndex(
        i => i.url === '/support'
      )
      Vue.set(this.badges, chatIndex, notReadMessagesCount)
    },

    openPromoCheck() {
      const el = document.getElementById('for-open-from-menu')
      el.click()
    },

    openFilter() {
      const elems = document.getElementsByClassName(
        'da-search-card-filter-btn-0'
      )
      if (elems.length) {
        elems[0].click()
      }
    }
  },

  computed: {
    pageName() {
      const compare = this.getCompare(this.$route.path)
      return compare && compare.headers && compare.headers.label
    },
    companyName() {
      const forUpdate = this.$route.path
      return this.storage.get('promo-check-name')
    },
    ...mapState(['socket']),
    ...mapState({
      user: state => state.UserState.user,
      filterToolbarButton: state =>
        state.ComState.searchCard.filterToolbarButton
    }),
    ...mapGetters(['query', 'url', 'getCompare', 'storage', 'findService'])
  }
}
</script>
