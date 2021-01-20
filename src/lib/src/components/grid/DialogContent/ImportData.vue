<template>
  <v-card tile class="import-data">
    <v-card-text class="pt-3">
      <v-row>
        <v-col cols="12">
          <div class="ml-10 mb-1">
            {{
              `Поддерживаемый формат файлов: *.xls, *.xlsx ( Размер не более ${fileSizeLimitMb} Mb )`
            }}
          </div>
          <v-file-input
            label="Файл"
            :error-messages="error"
            @change="convertFile($event)"
            @click:clear="clear"
            outlined
          ></v-file-input>
        </v-col>
      </v-row>

      <div
        v-if="loading"
        class="d-flex align-center justify-center mt-12"
        style="height: 57vh"
      >
        <v-progress-circular
          indeterminate
          size="50"
          color="grey darken-2"
        ></v-progress-circular>
      </div>

      <v-slide-x-reverse-transition>
        <v-alert
          v-if="errors.items.length"
          dense
          type="error"
          border="left"
          elevation="2"
          colored-border
          class="error--text"
        >
          <div>Ошибки валидации:</div>
          <div v-for="(error, i) in errors.items" :key="i">
            <strong>{{ error.msg }}</strong>
          </div>
        </v-alert>
      </v-slide-x-reverse-transition>

      <template v-if="dataLength">
        <v-simple-table class="border">
          <template v-slot:default>
            <v-checkbox
              v-model="isUnique"
              :true-value="true"
              :false-value="false"
              label="Сбрасывать повторяющиеся атрибуты при выборе"
              class="caption"
            ></v-checkbox>
            <thead>
              <tr>
                <th class="text-left" v-for="i in attrsLength" :key="i">
                  <v-select
                    v-model="selectedAttrs[i - 1]"
                    placeholder="Не экспортируется"
                    @change="isUnique ? checkUnique(i - 1) : ''"
                    :items="items"
                    label=""
                    :name="selectedAttrs[i - 1]"
                    v-validate="''"
                    color="info"
                    item-color="info"
                    hide-details
                    clearable
                  ></v-select>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in dataNonAttrs"
                v-if="index <= maxViewRows"
                :key="index"
              >
                <td v-for="col in row">{{ col }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-sheet color="lighten-2" class="mt-3 text-right font-weight-bold">{{
          'Показано ' + maxViewRows < dataLength
            ? maxViewRows
            : dataLength + ' из ' + dataLength
        }}</v-sheet>
      </template>
    </v-card-text>

    <v-card-actions v-if="dataLength">
      <v-btn color="success" fixed bottom right fab dark @click="importData">
        <v-icon>fa-check</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default {
  name: 'import-data',

  inject: ['$validator'],

  data: () => ({
    dataNonAttrs: [],
    isUnique: true,
    selectedAttrs: [],
    extensions: ['xls', 'xlsx'],
    // В байтах
    fileSizeLimit: 10000000,
    maxViewRows: 20,
    error: null,
    loading: false
  }),

  props: {
    attrs: Array,
    labels: Object,
    rules: Object,
    apiUrl: String,
    mapKey: String
  },

  methods: {
    /**
     * Очистить все данные
     * */
    clear() {
      this.error = null
      this.dataNonAttrs = []
      this.isUnique = true
      this.selectedAttrs = []
      this.errors.items = []
    },

    /**
     * convert to excel
     * @param file
     */
    convertFile(file) {
      if (!file) return
      this.error = null

      const paths = file.name.split('.')
      const exp = paths[1] || null

      if (!exp || !this.extensions.includes(exp)) {
        this.error =
          'Неверный формат файла, поддерживаемые форматы: ' +
          this.extensions.join(', ')
        return
      }

      if (file.size > this.fileSizeLimit) {
        this.error =
          'Слишком большой размер файла, максимально допустимый размер: ' +
          this.fileSizeLimitMb +
          ' Mb'
        return
      }

      this.dataNonAttrs = []
      this.loading = true
      import('js2excel')
        .then(({ excel2json }) => {
          excel2json(
            [file],
            data => {
              let fileName = Object.keys(data)

              data[fileName].forEach((rowObj, i) => {
                // на первой итерации найти по входящим Labels выбранные атрибуты для селектов
                if (i === 0) {
                  const inputLabels = Object.keys(rowObj)
                  this.selectedAttrs = inputLabels.map(label => {
                    const indexEntry = label.indexOf('--')
                    // если поле композитное -----------
                    if (indexEntry !== -1) {
                      label = label.slice(0, indexEntry)
                      this.isUnique = false
                      //  ------------------------------
                    }
                    let index = Object.values(this.labels).indexOf(label)
                    if (index !== -1) {
                      return Object.keys(this.labels)[index]
                    }
                  })
                } //-------------------------------------------------------------------------

                let row = Object.values(rowObj)

                row = row.map(val => {
                  // библиотека excel2json вместо пустой строки подставляет значение 'excel2json' - заменить на пустую строку
                  return val !== 'excel2json' ? val : ''
                })
                this.dataNonAttrs.push(row)
              })
              this.loading = false
            },
            'excel2json'
          )
        })
        .catch(e => {
          this.loading = false
          console.log('Ошибка преобразования: ' + e)
        })
    },

    /**
     * Проверить на уникальность атрибуты и сбросить дубли в selects
     * index - интекс текущего select накотором произошло событие
     * */
    checkUnique(index) {
      let uniqueSelectedAttrs = []
      uniqueSelectedAttrs = this.selectedAttrs.map((attr, i) => {
        if (
          index !== i &&
          this.selectedAttrs[index] === this.selectedAttrs[i]
        ) {
          return
        }
        return attr
      })
      this.selectedAttrs = uniqueSelectedAttrs
    },

    /**
     * Импортировать данные
     * преобразовать в нужный формат для отправки к api и сохранения
     */
    async importData() {
      this.errors.items = []
      //   let validate = await this.$validator.validateAll()
      //   if (!validate) return

      this.dataNonAttrs.forEach(async row => {
        let item = {}
        for (let [i, val] of Object.entries(row)) {
          const attr = this.selectedAttrs[i]
          if (!attr || !val) continue

          if (this.isList(this.mapKey, attr)) {
            let id = this.getIdByLabel(this.mapKey, attr, val)

            //Если id все еще не найден проверить является ли список зависимым и запросить зависимый список ---------
            if (!id) {
              if (this.isDepList(this.mapKey, attr)) {
                await this.$store.dispatch('fetchIdByLabel', {
                  mapKey: this.mapKey,
                  apiUrl: this.apiUrl,
                  attr,
                  item: item,
                  label: val
                })
                id = this.getIdByLabel(this.mapKey, attr, val)
              }
            } // -------------------------------------------------------------------

            item = { ...item, [attr]: id }
          } else if (/boolean/.test(this.rules.update[attr])) {
            val = val === 'Да' ? 1 : 0
            item = { ...item, [attr]: val }
            // если композитное поле -----------@TODO тут нужно сделать проверку композитное ли поле
          } else if (item[attr]) {
            if (Array.isArray(item[attr])) {
              item[attr].push(val)
            } else {
              Vue.set(item, attr, [item[attr]])
              item[attr].push(val)
            }
            // --------------------------------
          } else {
            item = { ...item, [attr]: val }
          }
        }
        this.$emit('save:item', {
          item,
          scenario: item.id ? 'update' : 'create'
        })
      })

      this.$emit('close:dialog')
    }
  },

  computed: {
    attrsLength() {
      return (this.dataNonAttrs[0] && this.dataNonAttrs[0].length) || 0
    },
    items() {
      return this.attrs.map(attr => {
        return {
          text: this.labels[attr],
          value: attr
        }
      })
    },
    fileSizeLimitMb() {
      return this.fileSizeLimit / 1000000
    },
    dataLength() {
      return this.dataNonAttrs.length
    },
    ...mapGetters([
      'getKeyByValue',
      'isList',
      'isDepList',
      'getIdByLabel',
      'listInSet'
    ])
  }
}
</script>

<style lang="scss">
.import-data {
  .theme--light.v-select .v-select__selection--comma {
    color: #1565c0;
  }
}
</style>
