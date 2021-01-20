<template>
  <div
    class="menu-wrapper"
    v-touch="{
      down: () => onSwipe('Down'),
      move: () => onTouchMoved(),
      end: () => onEnd()
    }"
  >
    <v-slide-y-transition>
      <div v-if="showReloadMark" class="reload-mark elevation-4">
        <v-icon dark large>autorenew</v-icon>
      </div>
    </v-slide-y-transition>

    <slot></slot>
  </div>
</template>

<script>
import { Touch } from 'vuetify/lib'

export default {
  name: 'menu-wrapper',

  directives: {
    Touch
  },

  data: () => ({
    showReloadMark: false
  }),

  methods: {
    //РЕАКЦИИ НА СОБЫТИЯ ----------------------------------
    /**
     * @todo пока не используется - не работает
     * Рейкция на скролл в layout
     * */
    onScroll() {
      this.offsetTop = this.getScrollTop()
    },
    /**
     * Обработка Swipe (для моб устройств)
     * */
    onSwipe(direction) {
      // Если swipe вниз - reRenderApp только если отсутствует прокрутка по оси Y
      if (direction === 'Down') {
        this.$store.dispatch('reRenderApp')
      }
    },
    /**
     * Обработка Touch Moving
     * */
    onTouchMoved() {
      // показать reload-mark
      if (!this.showReloadMark) {
        this.showReloadMark = true
      }
    },

    /**
     * Обработка Touch End
     * */
    onEnd() {
      // скрыть reload-mark
      this.showReloadMark = false
    }
    //РЕАКЦИИ НА СОБЫТИЯ END ----------------------------------
  }
}
</script>

<style scoped lang="scss">
.menu-wrapper {
  .reload-mark {
    z-index: 6;
    background-color: #ff3500;
    width: 44px;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    position: absolute;
    left: calc(50% - 22px);
    top: 70px;
  }
}
</style>
