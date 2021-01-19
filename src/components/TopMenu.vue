<template>
  <v-sheet
    class="top-menu"
    color="grey"
    :color="$vuetify.theme.dark ? 'darken-3' : 'lighten-3'"
    width="100%"
  >
    <v-container>
      <div class="d-flex align-center">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-app-bar-nav-icon
              class="d-block d-md-none"
              v-on="on"
            ></v-app-bar-nav-icon>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in items.left"
              :key="index"
              :to="item.to"
              @click="selIndex = index"
              color="primary"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <div class="d-none d-md-block">
          <router-link
            v-for="(item, i) in items.left"
            :key="i"
            :to="item.to"
            class="mr-7"
            :class="{ 'white--text': $vuetify.theme.dark }"
            active-class="red--text"
            >{{ item.title }}</router-link
          >
        </div>

        <v-spacer></v-spacer>
        <div class="ml-3">
          <a
            href="#"
            class="mr-2 info--text"
            :class="$vuetify.breakpoint.smAndDown ? '' : 'd-none'"
            @click.prevent="$emit('click:city')"
          >
            <v-icon class="info--text">location_on</v-icon>
            {{ city }}
          </a>
        </div>
      </div>
    </v-container>
  </v-sheet>
</template>

<script>
export default {
  data() {
    return {
      selIndex: 0,
      items: {
        left: [
          { title: "Продажа", to: { name: "realtysaleList" } },
          { title: "Аренда", to: { name: "realtyList" } },
          { title: "Тарифы", to: { name: "tariff" } },
          { title: "О проекте", to: { name: "about" } },
          //   { title: "Контакты", to: { name: "contacts" } },
        ],
      },
    };
  },
  props: {
    city: String,
  },
};
</script>

<style lang="scss" scoped>
.top-menu {
  a {
    color: black;
    transition: 0.3s;
    &:hover {
      color: red;
    }
  }
}
</style>
