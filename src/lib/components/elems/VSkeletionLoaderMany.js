/**
 * Надстройка над v-skeleton-loader (Множественный v-skeleton-loader)
 * принимает параметр type, в котором можно указать множество v-skeleton-loader
 * Пример: type="list-item-three-line, list-item-three-line, list-item-three-line"
 */
import Vue from 'vue'
import { VSkeletonLoader } from 'vuetify/lib'
Vue.component('v-skeleton-loader', VSkeletonLoader)
Vue.component('v-skeleton-loader-many', {
  functional: true,
  render(createElement, { data, props, children }) {
    return createElement(
      'v-skeleton-loader',
      {
        ...data,
        props: {
          boilerplate: false,
          elevation: 0,
          ...props
        }
      },
      children
    )
  }
})
