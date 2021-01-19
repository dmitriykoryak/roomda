<script>
/**
 * Миксин для VeeValidate 3.0+
 * - подключение ValidationProvider, ValidationObserver и языковых пакетов
 * - локализация VeeValidate
 * - слежение за за мультиязычностью и переключение локализации между RU/EN
 */
import { Validator } from 'vee-validate'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import ru from 'vee-validate/dist/locale/ru'
import en from 'vee-validate/dist/locale/en'

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  mounted() {
    this.setLocalize(this.$lang._)
    this.$watch('$lang._', langPrefix => this.setLocalize(langPrefix))
  },
  methods: {
    setLocalize(langPrefix) {
      this.$refs.form.reset()
      if (langPrefix === '_en') {
        Validator.localize('en', en)
      } else {
        Validator.localize('ru', ru)
      }
    }
  }
}
</script>
