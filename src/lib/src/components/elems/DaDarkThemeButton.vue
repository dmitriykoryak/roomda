<template>
  <v-btn icon @click="toggleDark">
    <v-icon>mdi-theme-light-dark</v-icon>
  </v-btn>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  created() {
    this.$vuetify.theme.dark = this.storage.get('is-dark') || false
  },
  methods: {
    toggleDark() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      this.storage.set('is-dark', this.$vuetify.theme.dark)
    }
  },
  computed: mapGetters(['storage'])
}
</script>

<style lang="scss" scoped></style>
