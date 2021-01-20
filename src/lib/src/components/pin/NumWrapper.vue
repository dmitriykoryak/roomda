<template>
  <div class="num-wrapper">
    <v-slide-y-transition>
      <div v-if="localError" class="show-error">
        <v-alert type="error" min-width="90%" dense text>
          {{ localError }}
        </v-alert>
      </div>
    </v-slide-y-transition>

    <div class="d-flex num-wrapper-inner">
      <div class="inner-slot">
        <slot></slot>
      </div>

      <div class="mb-2 num-btns">
        <v-row>
          <v-col
            cols="4 py-2 px-3"
            @click="$emit('num:enter', 1)"
            v-touch="onTouch(1)"
          >
            <v-btn class="num-btn" v-blur text fab large>1</v-btn>
          </v-col>
          <v-col
            cols="4 py-2 px-3"
            @click="$emit('num:enter', 2)"
            v-touch="onTouch(2)"
          >
            <v-btn class="num-btn" v-blur text fab large>2</v-btn>
          </v-col>
          <v-col
            cols="4 py-2 px-3"
            @click="$emit('num:enter', 3)"
            v-touch="onTouch(3)"
          >
            <v-btn class="num-btn" v-blur text fab large>3</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="4 py-2 px-3"
            @click="$emit('num:enter', 4)"
            v-touch="onTouch(4)"
          >
            <v-btn class="num-btn" v-blur text fab large>4</v-btn>
          </v-col>
          <v-col
            cols="4 py-2 px-3"
            @click="$emit('num:enter', 5)"
            v-touch="onTouch(5)"
          >
            <v-btn class="num-btn" v-blur text fab large>5</v-btn>
          </v-col>
          <v-col
            cols="4 py-2 px-3"
            @click="$emit('num:enter', 6)"
            v-touch="onTouch(6)"
          >
            <v-btn class="num-btn" v-blur text fab large>6</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="4 py-2 px-3"
            @click="$emit('num:enter', 7)"
            v-touch="onTouch(7)"
          >
            <v-btn class="num-btn" v-blur text fab large>7</v-btn>
          </v-col>
          <v-col
            cols="4 py-2 px-3"
            @click="$emit('num:enter', 8)"
            v-touch="onTouch(8)"
          >
            <v-btn class="num-btn" v-blur text fab large>8</v-btn>
          </v-col>
          <v-col
            cols="4 py-2 px-3"
            @click="$emit('num:enter', 9)"
            v-touch="onTouch(9)"
          >
            <v-btn class="num-btn" v-blur text fab large>9</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4 py-2 px-3">
            <slot name="exit"></slot>
          </v-col>
          <v-col
            cols="4 py-2 px-3"
            @click="$emit('num:enter', 0)"
            v-touch="onTouch(0)"
          >
            <v-btn class="num-btn" v-blur text fab>0</v-btn>
          </v-col>
          <v-col cols="4 py-2 px-3" @click="$emit('backspace:click')">
            <v-btn class="num-btn" v-blur text fab>
              <v-icon small>fa-backspace</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
/**
 *Обертка для создания layout для кнопочного ввода
 * исп.: для мобильных устройств
 */
import { Touch } from 'vuetify/lib'

export default {
  name: 'num-wrapper',

  directives: {
    Touch
  },

  data: () => ({
    lockInput: false
  }),

  props: {
    error: String
  },

  methods: {
    onTouch(num) {
      return {
        move: () => {
          if (!this.lockInput) {
            this.$emit('num:enter', num)
            this.lockInput = true
          }
        },
        end: () => (this.lockInput = false)
      }
    }
  },

  computed: {
    localError() {
      //Обнулить error-сообщение через 3 сек
      if (this.error) {
        setTimeout(() => {
          this.$emit('update:error', null)
        }, 3000)
      }

      return this.error
    }
  }
}
</script>

<style lang="scss">
.num-wrapper {
  margin: -4px 0 -4px 0;
  overflow: hidden;
  position: relative;
  z-index: 4;
  height: 100%;

  .num-btn {
    .v-btn__content {
      font-size: 24px;
    }
  }

  .show-error {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    top: 60px;
    margin-left: auto;
    margin-right: auto;
  }

  .num-wrapper-inner {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;

    .inner-slot {
      margin-top: 30px;
      flex-grow: 1;
    }
  }

  .num-btns {
    .v-btn:not(.grey--text) {
      font-size: 20px;
    }
  }
}
</style>
