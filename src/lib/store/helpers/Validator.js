import store from '@/store/index'
import VeeValidate from 'vee-validate'
import dictionaryRu from 'vee-validate/dist/locale/ru'

export default {
  name: 'Validator',
  getters: {
    /**
     * Получить правила для элементов формы
     * входящие параметры в виде [scenario][attr][]['required', 'max' => 10]
     * выходящие - [scenario][attr][required|max:10]
     * @param state
     * @param getters
     * @returns {function(*=): string}
     */
    convertRules: (state, getters) => apiRules => {
      if (!apiRules || !(apiRules instanceof Object)) {
        return null
      }

      let vueRules = {}
      for (let scenario in apiRules) {
        let scenarioRules = {}
        let apiRuleArray = apiRules[scenario]

        for (let attr in apiRuleArray) {
          let out = []
          let i = 0
          let rules = apiRuleArray[attr]

          rules.forEach(rulesArr => {
            for (let key in rulesArr) {
              let rule = rulesArr[key]

              if (key === 'rule') {
                for (let k in rule) {
                  const r = rule[k]
                  if (getters.rulesMap(r)) {
                    out[i] = getters.rulesMap(r)
                    if (!getters.isNumeric(k) && k !== 'type' && k !== 'rule') {
                      // c type передаются RegularExpression
                      out[i] = k + ':' + r // если ключ например 'max' то надо сделать 'max:10'
                    }
                    i++
                  }
                }
              } else {
                if (getters.rulesMap(rule)) {
                  out[i] = getters.rulesMap(rule)

                  if (!getters.isNumeric(key) && key !== 'type') {
                    // c type передаются RegularExpression
                    out[i] = key + ':' + rule // если ключ например 'max' то надо сделать 'max:10'
                  }
                  i++
                }
              }
            }
          })
          scenarioRules[attr] = out.join('|')
        }
        vueRules[scenario] = scenarioRules
      }

      //console.log(vueRules);

      return vueRules
    },

    /**
     * Карта совпадений для правил валидации API - Vu
     * @returns {Function}
     */
    rulesMap: () => apiRule => {
      if (/^\d*$/.test(apiRule)) {
        // Если число - возвращаем без изменений
        return apiRule
      }

      const map = {
        string: 'string',
        boolean: 'boolean',
        each: 'each',
        many: 'many',
        after: 'after',
        alpha_dash: 'alpha_dash',
        alpha_num: 'alpha_num',
        alpha_spaces: 'alpha_spaces',
        before: 'before',
        between: 'between',
        confirmed: 'confirmed',
        credit_card: 'credit_card',
        date: 'date',
        dt: 'dt',
        dt_range: 'dt_range',
        decimal: 'decimal',
        digits: 'digits',
        dimensions: 'dimensions',
        email: 'email',
        ext: 'ext',
        image: 'image',
        included: 'included',
        integer: 'integer',
        ip: 'ip',
        ip_or_fqdn: 'ip_or_fqdn',
        is: 'is',
        is_not: 'is_not',
        length: 'length',
        max: 'max',
        max_value: 'max_value',
        mimes: 'mimes',
        min: 'min',
        min_value: 'min_value',
        excluded: 'excluded',
        numeric: 'numeric',
        regex: 'regex',
        required: 'required',
        required_if: 'required_if',
        size: 'size',
        url: 'url',
        rule: '',
        color: 'color',
        img: 'img',
        file: 'file',
        video: 'video',
        time: 'time',
        year: 'year',
        phone: 'phone',
        text: 'text',
        html: 'html',
        oneOf: 'oneOf',
        money: 'money'
      }

      return map[apiRule]
    },

    /**
     * Принять ошибки валидации со стороны API и вывести их на экран
     * @param {Object} context - this компонента в котором необходима валидация поля
     * @param {Boolean} showMsg - показать ошибки Api валидации всплывающим сообщением (snackbar)
     */
    validateOnApi: () => (errors, context, showMsg = false) => {
      const response = errors.response

      if (showMsg) {
        let message =
          response.data.data &&
          response.data.data[0] &&
          response.data.data[0].message
        if (message) {
          store.commit('DaSnackbar/show', {
            text: message,
            hideBtn: true,
            pos: 'bottom',
            timeout: 2000
          })
        }
      }

      if (
        context &&
        !response.data.success &&
        Array.isArray(response.data.data)
      ) {
        context.$validator.errors.clear()
        response.data.data.forEach(error => {
          const field = context.$validator._base.fields.items.find(
            item => item.name === error.field
          )

          if (!field) return

          context.$validator.errors.add({
            id: field.id,
            field: field.name,
            msg: error.message,
            scope: context.scope || context.vScope
          })

          field.setFlags({
            invalid: true,
            valid: false,
            validated: true
          })
        })
      }
    },

    /**
     * Провалидировать одно поле с атрибутом attr
     * с задержкой timeout - сек (для компонентов если надо по завершению какого то действия (закрытию модального окна etc.) принудительно выполнить валидацию)
     * @param validator
     * @param attr
     * @param value
     * @param timeout
     */
    validateField: () => (validator, attr, value, timeout = null) => {
      const existingFields = validator._base.fields.items.map(item => item.name)
      if (existingFields.includes(attr)) {
        if (timeout) {
          setTimeout(() => validator.validate(attr, value), timeout)
        } else {
          validator.validate(attr, value)
        }
      }
    },

    /**
     * Проскролить DOM document до ошибки валидации
     * @param {Object} context - в котором необходима прокрутка до ошибки валидации
     * @returns {function(...[*]=)}
     */
    scrollToError: () => context => {
      let els = $('.error--text')
      let elHasError = els.eq(0)
      if (elHasError.is(':visible')) {
        context.$vuetify.goTo(elHasError[0], { offset: 50 })
        return true
      }
      return false
    },

    /**
     * Сбросить валидацию одного поля по атрибуту attr
     * Reset validation on one field has attr
     * @param {string} attr
     * @return {Function}
     */
    resetField: () => (attr, validator) => {
      if (validator.errors.has(attr)) {
        const field = validator.fields.find({ name: attr })
        if (field) {
          validator.errors.remove(attr)
        }
      }
    },

    /**
     * Локализация валидации
     * Выбор языка сообщений валидации и замена руссифицированных labels в сообщение ошибки
     * */
    validationLocalize: () => labels => {
      VeeValidate.Validator.localize('ru', {
        ...dictionaryRu,
        attributes: labels
      })
    }
  }
}
