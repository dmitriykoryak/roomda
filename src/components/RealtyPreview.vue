<template>
  <v-row class="realty-prev">
    <v-col cols="12" md="3" class="pt-2 pb-1">
      <v-carousel height="200" hide-delimiters show-arrows-on-hover>
        <v-carousel-item v-for="(img, i) in realty.images" :key="i" :src="img.url" @click="$router.push({name: isSale ? 'realtysale' : 'realty', params: { id: realty.id }})">
        </v-carousel-item>
      </v-carousel-item>
      </v-carousel>
    </v-col>

    <v-col cols="12" md="9" class="pt-2 pb-1">
              <v-row dense>
                  <v-col cols="12" md="9">
                      <div class="font-weight-bold title r-title" @click="$router.push({name: isSale ? 'realtysale' : 'realty', params: { id: realty.id }})">{{getListLabel(mapKey, 'type_id', realty.type_id)}}, {{realty.area}} <sup>2</sup>, этаж {{realty.floor}}/{{realty.floors}}</div>
                      <div class="d-md-none d-flex title font-weight-bold justify-self-start text-right flex-grow-1">
                        {{realty.cost | currency}}
                      </div>
                    <div class="grey--text caption">id {{realty.id}}</div>
                    <div class="caption"><v-icon small>room</v-icon> {{address}}</div>
                    <div class="mt-2 mb-4 description">
                        <span v-if="realty.description" v-html="realty.description.substr(0, 130) + '...'"></span>
                        <template v-else>
                            <v-row no-gutters :style="{maxWidth: $vuetify.breakpoint.mdAndUp ? '540px' : '700px'}">
                                <v-col v-if="realty.area" cols="12" sm="5">
                                <span class="font-weight-bold">{{ realty.area }}&nbsp;м²</span
                                ><span class="grey--text">&nbsp;—&nbsp;общая&nbsp;площадь</span>
                                </v-col>

                                <v-col v-if="realty.area_living" cols="12" sm="4">
                                <span class="font-weight-bold">{{ realty.area_living }} м²</span
                                ><span class="grey--text"> — жилая</span>
                                </v-col>

                                <v-col v-if="realty.area_kitchen" cols="12" sm="3">
                                <span class="font-weight-bold">{{ realty.area_kitchen }} м²</span
                                ><span class="grey--text"> — кухня</span>
                                </v-col>

                                <v-col v-if="realty.rooms" cols="12" sm="5">
                                <span class="font-weight-bold">{{ realty.rooms }} комната</span>
                                </v-col>

                                <v-col v-if="realty.floor" cols="12" sm="4">
                                <span class="font-weight-bold">{{ realty.floor }} этаж</span
                                ><span class="grey--text"> из {{ realty.floors }}</span>
                                </v-col>
                            </v-row>
                        </template>
                    </div>
                    <v-row dense>
                        <v-col cols="6" md="4" class="py-0">
                          <da-phone-button v-model="phone" :apiUrl="$config.api.url.realty + '/personrealty/client/phone'" :params="{ id: realty.id }" :beforeBindAttrs="{class: $vuetify.theme.dark ? ' lime darken-4' : 'yellow', small: true, text: true}" :afterBindAttrs="{ small: true, text: true, class: $vuetify.theme.dark ? 'black--text' : '' }" />  
                        </v-col>
                        <v-col cols="6" md="4" class="py-0">
                          <fav-button :isSale="isSale" :realtyId="realty.id || -1"></fav-button>  
                        </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="3" class="d-flex flex-column justify-end align-end">
                      <div class="d-none d-md-flex title font-weight-bold justify-self-start text-right flex-grow-1">
                        {{realty.cost | currency}}
                      </div>
                      <div class="grey--text caption mb-3 d-none d-md-flex">
                        {{realty.dt | formatDT}}
                      </div>
                  </v-col>
              </v-row>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            phone: null,
            mapKey: null,
        }
    },

    created () {
        this.mapKey = this.isSale ? 'sale/default' : 'rent/default'
    },

  props: {
      realty: {
          type: Object,
          default: function() {
              return {}
          }
      },
      isSale: Boolean
  },
  computed: {
      address() {
          const district = this.getListLabel(this.mapKey, 'district_id', this.realty.district_id, this.realty, {})
          return (district ? `${district}, ` : '') + (this.realty.street ? `${this.realty.street}, ` : ' ') + (this.realty.home ? 'д.' + this.realty.home : '')
      },
      ...mapGetters(['getListLabel'])
  }
}
</script>

<style lang="scss">
.realty-prev{
    cursor: pointer;
    .r-title{
        transition: color .3s;
        color: #3F51B5;
        } 
    &:hover {
       .r-title{
        color: red;
        } 
    }
    .description{
        min-height: 66px;
    }
    .da-phone-button{
        width: 100%
    }
}
</style>
