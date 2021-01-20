<template>
  <v-list two-line subheader :class="listClass">
    <v-subheader class="text-uppercase" :class="subheaderClass" v-if="title">{{
      title
    }}</v-subheader>

    <v-skeleton-loader-many
      :loading="loading"
      class="mx-auto"
      :type="loaderTypeFull"
    >
      <div>
        <slot></slot>
      </div>
    </v-skeleton-loader-many>
  </v-list>
</template>

<script>
/**
 * Список со skeleton-loader
 */
export default {
  name: 'da-list',

  data: () => ({
    loaderType: 'list-item-three-line'
  }),

  props: {
    loading: Boolean,
    title: String,
    subheaderClass: String,
    // Количество повторений строк skeleton-loader
    loaderRepeat: {
      type: Number,
      default: 2
    },
    listClass: {
      type: String,
      default: 'text-left elevation-1'
    }
  },

  computed: {
    loaderTypeFull() {
      let out = ''
      for (let i = 0; i < this.loaderRepeat; i++) {
        if (out.length) {
          out += ', ' + this.loaderType
        } else {
          out += this.loaderType
        }
      }
      return out
    }
  }
}
</script>

<style scoped lang="scss"></style>
