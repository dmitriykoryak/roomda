<template>
  <div class="h-100">
    <div v-if="isMobileApp" class="da-swipe-refresh pull-to-refresh-material">
      <div class="pull-to-refresh-material__control">
        <svg
          class="pull-to-refresh-material__icon"
          fill="#4285f4"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
          />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>

        <svg
          class="pull-to-refresh-material__spinner"
          width="24"
          height="24"
          viewBox="25 25 50 50"
        >
          <circle
            class="pull-to-refresh-material__path"
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke="#4285f4"
            stroke-width="4"
            stroke-miterlimit="10"
          />
        </svg>
      </div>
    </div>

    <div ref="mainContent" class="h-100" :key="rerenderAppTrigger">
      <slot></slot
      ><!-- слот для основного контента сайта / приложения -->
    </div>
  </div>
</template>

<script>
/**
 * Компонент с функционалом refresh моб. приложения при свайпе сверху-вниз:
 */
// Динамическая регистрация модуля `DaSwipeRefresh`
import store from '@/store/index'
import DaSwipeRefresh from '~~/store/modules/DaSwipeRefresh.js'
if (!store.hasModule('DaSwipeRefresh')) {
  store.registerModule('DaSwipeRefresh', DaSwipeRefresh)
}

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import pullToRefresh from 'mobile-pull-to-refresh'
// Material
import ptrAnimatesMaterial from 'mobile-pull-to-refresh/dist/styles/material/animates'
import 'mobile-pull-to-refresh/dist/styles/material/style.css'

export default {
  created() {
    this.cloneState()
  },

  mounted() {
    if (this.isMobileApp) {
      this.refreshInit()
      this.findDOMExept()
    }
  },

  props: {
    // исключения (массив html тегов, классов, id) при наличии на странице которых, при свайпе не будет происходить refresh приложеиня
    except: {
      type: Array,
      default: function() {
        return []
      }
    }
  },

  data: () => ({
    allowRefresh: true
  }),

  methods: {
    refreshInit() {
      const context = this
      pullToRefresh({
        container: document.querySelector('.v-application'),
        animates: ptrAnimatesMaterial,
        //доп. анимации
        //animates: ptrAnimatesMaterial2,
        //animates: ptrAnimatesIos,
        refresh() {
          return new Promise(resolve => {
            if (context.allowRefresh) {
              context.refreshApp()
              setTimeout(resolve, 2000)
            } else {
              resolve()
            }
          })
        }
      })
    },
    findDOMExept() {
      setTimeout(() => {
        this.except.forEach(selector => {
          // если нет исключения - разрешить refresh
          this.allowRefresh = !document.querySelector(selector)
        })
      }, 600)
    },
    ...mapMutations('DaSwipeRefresh', ['cloneState']),
    ...mapActions('DaSwipeRefresh', ['refreshApp'])
  },
  computed: {
    ...mapState({
      rerenderAppTrigger: state => state.DaSwipeRefresh.rerenderAppTrigger
    }),
    ...mapGetters(['isMobileApp'])
  },
  watch: {
    $route: 'findDOMExept'
  }
}
</script>

<style scoped lang="scss">
.da-swipe-refresh {
  z-index: 1000;
  .pull-to-refresh-material__control {
    top: 0;
  }
}
</style>
