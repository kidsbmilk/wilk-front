// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import qs from 'qs'
import VueContextMenu from 'vue-contextmenu'
import 'vue-contextmenu/style/css/font-awesome.min.css'


var axios = require('axios')

axios.defaults.withCredentials=true;
axios.defaults.baseURL = 'http://localhost/wilk'

var AU = require('ansi_up')
var ansi_up = new AU.default

var a2h = require('ansi2html-extended');

var cookies = require('vue-cookies')

Vue.use(VueContextMenu)
Vue.use($cookies)
Vue.prototype.$qs = qs
Vue.prototype.$cookies = cookies
Vue.prototype.$a2h = a2h
Vue.prototype.$ansi_up = ansi_up
Vue.prototype.$axios = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (router.app.$cookies.get("status") !== "logined") {
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 把要跳转的地址作为参数传到下一步
      })
    } else {
      next()
    }
  } else {
    if (to.query && to.query.redirect) {
      if (router.app.$cookies.get("status") === "logined") {
        next({path: to.query.redirect})
      } else {
        next()
      }
    } else {
      next() // 确保一定要调用 next()
    }
  }
})