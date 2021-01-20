<template>
  <div class="da-lang-switcher">
    <slot
      name="ru"
      v-bind="{
        bind: { class: { active: $lang._ === '' } },
        on: { click: () => switchLang('ru') }
      }"
    ></slot>

    <slot name="delimiter"></slot>

    <slot
      name="en"
      v-bind="{
        bind: { class: { active: $lang._ === '_en' } },
        on: { click: () => switchLang('en') }
      }"
    ></slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DaLangSwitcher',

  data: () => ({}),

  props: {
    switchDomain: Boolean
  },

  methods: {
    /**
     * Переключить на выбранный язык lang
     * @param {String} lang
     */
    switchLang(lang) {
      if (!this.switchDomain || this.isMobileApp) {
        this.$setLang(lang)
      } else {
        const protocol = window.location.protocol
        const domain = window.location.hostname
        const curLang = domain === this.$config.siteDomain.ru ? 'ru' : 'en'

        if (lang === 'en' && curLang === 'ru') {
          window.location.href = protocol + '//' + this.$config.siteDomain.en
        } else if (lang === 'ru' && curLang === 'en') {
          window.location.href = protocol + '//' + this.$config.siteDomain.ru
        }
      }
    }
  },

  computed: {
    ...mapGetters(['isMobileApp'])
  }
}
</script>

<style scoped></style>
