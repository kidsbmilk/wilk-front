import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/components/wilk/MainPage'
import RegisterPage from '@/components/wilk/RegisterPage'
import LoginPage from '@/components/wilk/LoginPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/loginpage',
      meta: { title: '根目录' , requiresAuth: false}
    },
    {
      path: '/mainpage',
      name: 'MainPage',
      component: MainPage,
      meta: { title: 'wilk主页' , requiresAuth: true}
    },
    {
      path: '/registerpage',
      name: 'RegisterPage',
      component: RegisterPage,
      meta: { title: '注册页' , requiresAuth: false}
    },
    {
      path: '/loginpage',
      name: 'LoginPage',
      component: LoginPage,
      meta: { title: '登录页' , requiresAuth: false}
    }
  ]
})
