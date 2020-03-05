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

function setDocumentTitle(titleStr) {
  document.title = titleStr;
}

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
  console.log(router.app.$cookies.get("status"));
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title}`))
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!router.app.$cookies.isKey('status') || router.app.$cookies.get("status") !== "logined") { // 注意：是!==，写成别的不行
      next({
        path: '/loginpage',
        query: { redirect: to.fullPath }
      })
    } else {
      next() // 确保一定要调用 next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})