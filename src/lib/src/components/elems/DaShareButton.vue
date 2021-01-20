<template>
  <v-menu offset-y nudge-right eager>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon title="Поделиться" :color="color" v-bind="attrs" v-on="on"
        ><v-icon :small="small">share</v-icon></v-btn
      >
    </template>
    <v-card>
      <v-card-text>
        <yandex-share
          :services="[
            'vkontakte',
            'facebook',
            'twitter',
            'odnoklassniki',
            'whatsapp',
            'skype',
            'telegram'
          ]"
          vertical
          counter
          :url="url"
          :title="title"
        />
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import YandexShare from '@cookieseater/vue-yandex-share'

export default {
  components: { YandexShare },
  props: {
    url: String,
    title: String,
    color: String,
    small: Boolean
  }
}
</script>

<style lang="scss" scoped></style>
