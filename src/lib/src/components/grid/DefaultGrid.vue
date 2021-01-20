<template>
  <grid-wrapper
    :level="level"
    :apiUrl="apiUrl"
    :pathInit="pathInit"
    :mapKeyInit="mapKeyInit"
    :comName="comName"
  ></grid-wrapper>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'default-grid',

  created() {
    const compare = this.getCompare(this.$route.path)
    const mapKey = compare.content.config.app_api_path
    this.comName = mapKey && mapKey.split('/')[0]
    this.apiUrl = this.$config.api.url[compare.content.config.app_svc]
    this.mapKeyInit = compare.content.config.app_api_path
  },

  data() {
    return {
      comName: null,
      apiUrl: null,
      mapKeyInit: null
    }
  },

  props: {
    pathInit: String,
    level: Number
  },

  computed: mapGetters(['getCompare'])
}
</script>

<style scoped lang="scss"></style>
