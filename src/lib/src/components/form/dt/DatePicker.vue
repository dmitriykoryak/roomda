<template>
  <div class="data-picker max-v-100 flex-grow-1">
    <v-menu
      :value="show"
      @input="
        show = $event
        setOpenType()
      "
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <slot v-bind="{ on, value }">
          <v-text-field
            :value="localValue | formatDT"
            :label="label"
            :prepend-icon="prependIcon"
            :prepend-inner-icon="prependInnerIcon"
            :append-icon="appendIcon"
            :outlined="outlined"
            :dense="dense"
            :solo-inverted="soloInverted"
            :placeholder="placeholder"
            :hide-details="hideDetails"
            readonly
            v-on="on"
            :clearable="clearable"
            :loading="loading"
            :single-line="singleLine"
            :error-messages="errorMessages"
            data-vv-validate-on="input|click"
            @blur="
              vField($validator, attr, localValue, 150)
              $emit('blur')
            "
            @click:clear="localValue = multiple ? [] : ''"
          ></v-text-field>
        </slot>
      </template>
      <v-container pa-0 class="dp-container">
        <div
          class="dp-wrapper"
          :style="{
            backgroundColor: $vuetify.theme.dark ? '#424242' : '#ffffff'
          }"
        >
          <div class="dp-presets" v-if="multiple">
            <v-btn
              v-if="yesterday"
              tile
              color="info"
              @click="setDate('yesterday')"
              >Вчера</v-btn
            >
            <v-btn v-if="now" tile color="info" @click="setDate('now')"
              >Сегодня</v-btn
            >
            <v-btn
              v-if="tomorrow"
              tile
              color="info"
              @click="setDate('tomorrow')"
              >Завтра</v-btn
            >
            <v-btn
              v-if="thisWeek"
              tile
              color="info"
              @click="setDate('this_week')"
              >Эта неделя</v-btn
            >
            <v-btn
              v-if="prevWeek"
              tile
              color="info"
              @click="setDate('prev_week')"
              >Прошлая неделя</v-btn
            >
            <v-btn
              v-if="thisMonth"
              tile
              color="info"
              @click="setDate('this_month')"
              >Этот месяц</v-btn
            >
            <v-btn
              v-if="prevMonth"
              tile
              color="info"
              @click="setDate('prev_month')"
              >Прошлый месяц</v-btn
            >
          </div>
          <div>
            <v-date-picker
              ref="vDatePicker"
              locale="ru"
              v-model="localValue"
              :range="multiple"
              :max="max"
              :min="min"
              @click:date="multiple ? '' : ((show = false), $emit('blur'))"
              class="elevation-0"
              first-day-of-week="1"
              no-title
              reactive
              color="primary"
            >
            </v-date-picker>
            <div class="dp-buttons" v-if="multiple">
              <v-btn color="primary" tile text @click="clear">Сброс</v-btn>
              <v-btn color="primary" tile text @click="show = false">OK</v-btn>
            </div>
          </div>
        </div>
      </v-container>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DtMixin from './DtMixin'

export default {
  name: 'date-picker',
  mixins: [DtMixin],
  inject: ['$validator'],
  data: () => ({
    show: false
  }),
  props: {
    label: String,
    value: [Number, String, Array],
    errorMessages: String,
    attr: String,
    clearable: Boolean,
    multiple: Boolean,
    loading: Boolean,
    default: String,
    prependIcon: String,
    prependInnerIcon: String,
    appendIcon: String,
    placeholder: String,
    min: String,
    max: String,
    singleLine: Boolean,
    hideDetails: Boolean,
    outlined: Boolean,
    dense: Boolean,
    soloInverted: Boolean,
    // по дефолту при multiple возвращает дату в формате 2020-01-07 - 2020-01-07
    // если strReturn = false - вернет массив
    strReturn: {
      type: Boolean,
      default: true
    },
    // openTypeYear = true - Задать при открытии v-date-picker тип: Год
    openTypeYear: Boolean,
    yesterday: {
      type: Boolean,
      default: true
    },
    now: {
      type: Boolean,
      default: true
    },
    tomorrow: {
      type: Boolean,
      default: true
    },
    thisWeek: {
      type: Boolean,
      default: true
    },
    prevWeek: {
      type: Boolean,
      default: true
    },
    thisMonth: {
      type: Boolean,
      default: true
    },
    prevMonth: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    prapareDate(dates) {
      if (Array.isArray(dates)) {
        // Если вторая дата меньше первой поменять их местами
        if (this.compareDates(dates[1], dates[0])) {
          dates = [dates[1], dates[0]]
        }
        return this.strReturn ? dates.join(' - ') : dates
      } else {
        return '' + dates
      }
    },

    /**
     * Сравнить даны в формате 2000-00-00
     * вернуть true если первая дата меньше второй
     */
    compareDates(date0, date1) {
      const timestamp0 = new Date(date0).getTime()
      const timestamp1 = new Date(date1).getTime()
      return timestamp0 < timestamp1
    },

    async clear() {
      this.localValue = this.multiple ? [] : ''
    },

    async setDate(set) {
      await this.clear()
      if (set === 'tomorrow') {
        const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
          .toISOString()
          .substr(0, 10)
        this.localValue = this.multiple ? [tomorrow, tomorrow] : tomorrow
      }
      if (set === 'now') {
        this.localValue = this.multiple
          ? [this.nowDate, this.nowDate]
          : this.nowDate
      }
      if (set === 'yesterday') {
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
          .toISOString()
          .substr(0, 10)
        this.localValue = this.multiple ? [yesterday, yesterday] : yesterday
      }
      if (set === 'this_week') {
        const monday = this.getMonday()
          .toISOString()
          .substr(0, 10)
        this.localValue = this.multiple ? [monday, this.nowDate] : monday
      }
      if (set === 'prev_week') {
        const sunday = this.getSunday()
          .toISOString()
          .substr(0, 10)
        const prevMonday = this.getPrevMonday()
          .toISOString()
          .substr(0, 10)
        this.localValue = this.multiple ? [prevMonday, sunday] : prevMonday
      }
      if (set === 'this_month') {
        const firstDay = this.getFirstDayThisMounth()
          .toISOString()
          .substr(0, 10)
        this.localValue = this.multiple ? [firstDay, this.nowDate] : firstDay
      }
      if (set === 'prev_month') {
        const firstPrevDay = this.getFirstDayPrevMounth()
          .toISOString()
          .substr(0, 10)
        const lastPrevDay = this.getLastDayPrevMounth()
          .toISOString()
          .substr(0, 10)
        this.localValue = this.multiple
          ? [firstPrevDay, lastPrevDay]
          : firstPrevDay
      }
    },

    vField() {
      setTimeout(
        () => this.validateField(this.$validator, this.attr, this.localValue),
        150
      )
    },

    /**
     * Задать при открытии v-date-picker его тип: Год / Месяц / Дата
     */
    setOpenType() {
      if (this.openTypeYear) {
        this.$nextTick(() => (this.$refs.vDatePicker.activePicker = 'YEAR'))
      }
    }
  },
  computed: {
    localValue: {
      get() {
        let out = this.multiple ? [] : ''
        if (!this.value && this.default === 'now') {
          return this.nowDate
        }

        if (this.multiple) {
          if (this.value) {
            out = this.strReturn ? this.value.split(' - ') : this.value
          } else {
            out = []
          }
        } else {
          out = this.value
        }

        return out
      },
      set(val) {
        this.$emit('input', this.prapareDate(val))
      }
    },
    nowDate() {
      return new Date().toISOString().substr(0, 10)
    },
    ...mapGetters(['validateField'])
  }
}
</script>

<style scoped lang="scss">
.dp-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  position: relative;

  .dp-presets {
    min-width: 175px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: 10px;

    .v-btn {
      margin-bottom: 5px;
    }
  }

  .dp-buttons {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding-bottom: 10px;
  }
}
</style>
