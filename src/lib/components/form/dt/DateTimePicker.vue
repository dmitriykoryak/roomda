<template>
  <div class="data-picker max-w-100 flex-grow-1">
    <v-menu
      v-model="show"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          :value="localValue | formatDT"
          :label="label"
          :prepend-icon="prependIcon"
          :append-icon="appendIcon"
          :append-outer-icon="appendOuterIcon"
          :outlined="outlined"
          :dense="dense"
          :hideDetails="hideDetails"
          :disabled="disabled"
          :hint="hint"
          v-on="on"
          @click="mode = 'date'"
          :error-messages="errorMessages"
          data-vv-validate-on="input|click"
          @blur="
            validateField($validator, attr, value, 50)
            $emit('blur')
          "
          :clearable="clearable"
          @click:clear="
            localValue = ''
            $emit('click:clear')
          "
          @click:append="$emit('click:append')"
        ></v-text-field>
      </template>

      <v-container pa-0 class="dp-container">
        <div
          v-if="mode === 'date'"
          class="dp-wrapper"
          :style="{
            backgroundColor: $vuetify.theme.dark ? '#424242' : '#ffffff'
          }"
        >
          <!--<div class="dp-presets">-->
          <!--<v-btn color="info" @click="setDate('now'); mode = 'time'">Сегодня</v-btn>-->
          <!--<v-btn color="info" @click="setDate('yesterday'); mode = 'time'">Вчера</v-btn>-->
          <!--<v-btn color="info" @click="setDate('this_week'); mode = 'time'">Эта неделя</v-btn>-->
          <!--<v-btn color="info" @click="setDate('prev_week'); mode = 'time'">Прошлая неделя</v-btn>-->
          <!--<v-btn color="info" @click="setDate('this_month'); mode = 'time'">Этот месяц</v-btn>-->
          <!--<v-btn color="info" @click="setDate('prev_month'); mode = 'time'">Прошлый месяц</v-btn>-->
          <!--</div>-->
          <div>
            <v-date-picker
              locale="ru"
              v-model="dateModel"
              class="elevation-0"
              first-day-of-week="1"
              no-title
              :min="minDate"
              :max="maxDate"
              @click:date="mode = 'time'"
            >
            </v-date-picker>
            <div class="dp-buttons">
              <v-btn color="primary" text @click="clear">Сброс</v-btn>
              <v-btn color="primary" text @click="show = false">OK</v-btn>
            </div>
          </div>
        </div>

        <v-time-picker
          v-if="mode === 'time'"
          v-model="timeModel"
          @click:minute="
            show = false
            mode = 'date'
          "
          :landscape="$vuetify.breakpoint.smAndUp"
          header-color="info"
          format="24hr"
          :min="minTime"
          :max="maxTime"
        >
          <div class="d-flex flex-grow-1 justify-end">
            <v-btn icon @click="mode = 'date'">
              <v-icon fab small>fa-chevron-left</v-icon>
            </v-btn>
          </div>
        </v-time-picker>
      </v-container>
    </v-menu>
  </div>
</template>

<script>
import DtMixin from './DtMixin'
import { mapGetters } from 'vuex'

//@todo переделать полностью работу timeModel и dateModel сделать computed от localModel
export default {
  name: 'date-time-picker',

  mixins: [DtMixin],

  inject: ['$validator'],

  data: () => ({
    show: false,
    mode: 'date',
    timeModel: '',
    dateModel: '',
    defaultTime: '00:00',
    type: 'date'
  }),

  props: {
    label: String,
    value: [Number, String, Array],
    errorMessages: String,
    attr: String,
    clearable: Boolean,
    default: String,
    outlined: Boolean,
    dense: Boolean,
    hideDetails: Boolean,
    disabled: Boolean,
    //min date(date-time) En-format
    minDate: String,
    maxDate: String,
    minTime: String,
    maxTime: String,
    prependIcon: String,
    appendIcon: String,
    appendOuterIcon: String,
    hint: String
  },

  methods: {
    clear() {
      this.dateModel = ''
      this.timeModel = this.defaultTime
    },

    async setDate(set) {
      if (set === 'now') {
        this.dateModel = this.now
      }
      if (set === 'yesterday') {
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
          .toISOString()
          .substr(0, 10)
        this.dateModel = yesterday
      }
      if (set === 'this_week') {
        const monday = this.getMonday()
          .toISOString()
          .substr(0, 10)
        this.dateModel = monday
      }
      if (set === 'prev_week') {
        const sunday = this.getSunday()
          .toISOString()
          .substr(0, 10)
        const prevMonday = this.getPrevMonday()
          .toISOString()
          .substr(0, 10)
        this.dateModel = prevMonday
      }
      if (set === 'this_month') {
        const firstDay = this.getFirstDayThisMounth()
          .toISOString()
          .substr(0, 10)
        this.dateModel = firstDay
      }
      if (set === 'prev_month') {
        const firstPrevDay = this.getFirstDayPrevMounth()
          .toISOString()
          .substr(0, 10)
        const lastPrevDay = this.getLastDayPrevMounth()
          .toISOString()
          .substr(0, 10)
        this.dateModel = firstPrevDay
      }
      this.timeModel = this.defaultTime
    }
  },

  computed: {
    now() {
      return new Date().toISOString().substr(0, 10)
    },
    localValue: {
      get() {
        if (this.value) {
          const parts = this.value.toString().split(' ')
          this.dateModel = parts[0]
          this.timeModel = parts[1]
        }
        return this.value || ''
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    ...mapGetters(['validateField'])
  },

  watch: {
    dateModel(val) {
      this.localValue = this.dateModel + ' 00:00'
    },
    timeModel(val) {
      this.localValue = this.dateModel + ' ' + val
    }
  }
}
</script>

<style scoped lang="scss">
.dp-container {
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
}
</style>
