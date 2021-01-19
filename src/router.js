import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/pages/MainPage.vue'
import RealtyListPage from '@/pages/RealtyListPage.vue'
import RealtyViewPage from '@/pages/RealtyViewPage.vue'
import ContactsPage from '@/pages/ContactsPage.vue'
import TariffPage from '@/pages/TariffPage.vue'
import AboutPage from '@/pages/AboutPage.vue'
import MapPage from '@/pages/MapPage.vue'
import NewAdPage from '@/pages/NewAdPage.vue'
import SuccessAddPage from '@/pages/SuccessAddPage.vue'
import FavoritesPage from '@/pages/FavoritesPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import SmsPage from '@/pages/SmsPage.vue'
import PayPage from '@/pages/PayPage.vue'
import SuccessPayPage from '@/pages/SuccessPayPage.vue'
import FailPayPage from '@/pages/FailPayPage.vue'
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage.vue'

Vue.use(Router)

export default new Router({
  mode: process.env.CORDOVA_PLATFORM ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainPage
    },
    {
      path: '/realty',
      name: 'realtyList',
      component: RealtyListPage,
      meta: { isSale: false }
    },
    {
      path: '/realtysale',
      name: 'realtysaleList',
      component: RealtyListPage,
      meta: { isSale: true }
    },
    {
      path: '/realty/:id',
      name: 'realty',
      component: RealtyViewPage,
      meta: { isSale: false }
    },
    {
      path: '/realtysale/:id',
      name: 'realtysale',
      component: RealtyViewPage,
      meta: { isSale: true }
    },
    {
      path: '/tariff',
      name: 'tariff',
      component: TariffPage
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: ContactsPage
    },
    {
      path: '/map-rent',
      name: 'mapRent',
      component: MapPage
    },
    {
      path: '/map-sale',
      name: 'mapSale',
      component: MapPage,
      meta: { isSale: true }
    },
    {
      path: '/new-ad',
      name: 'newAd',
      component: NewAdPage
    },
    {
      path: '/success-add',
      name: 'successAdd',
      component: SuccessAddPage
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/sms',
      name: 'sms',
      component: SmsPage
    },
    {
      path: '/pay',
      name: 'pay',
      component: PayPage
    },
    {
      path: '/success-pay',
      name: 'successPay',
      component: SuccessPayPage
    },
    {
      path: '/fail-pay',
      name: 'failPay',
      component: FailPayPage
    },
    {
      path: '/privacy-policy',
      name: 'policy',
      component: PrivacyPolicyPage
    },
    {
      path: '/page-not-found',
      alias: '*',
      component: { render: h => h('div', ['404! Страница не найдена']) }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // Если в конце path `#` - модальное окно - прукрутку документа не делать
    if (to.fullPath.endsWith('#') || from.fullPath.endsWith('#')) return

    return { x: 0, y: 0 }
  }
})
