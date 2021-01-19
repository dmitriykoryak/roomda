<script>
export default {
  mounted() {
    this.setTitle(this.$route)
    this.$router.afterEach((to, from) => this.setTitle(to))
  },
  methods: {
    setTitle(to) {
      const langPrefix = this.$lang && this.$lang._
      document.title =
        (to.meta && to.meta.head && to.meta.head['title' + langPrefix]) ||
        (langPrefix ? 'Site Page' : 'Страница сайта')
    }
  },
  watch: {
    '$lang._'() {
      this.setTitle(this.$route)
    }
  }
}
</script>
