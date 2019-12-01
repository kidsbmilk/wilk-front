import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/components/wilk/MainPage'
import RegisterPage from '@/components/wilk/RegisterPage'
import LoginPage from '@/components/wilk/LoginPage'
import AddCmdPage from '@/components/wilk/AddCmdPage'
import TreePage from '@/components/wilk/TreePage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/loginpage'
    },
    {
      path: '/mainpage',
      name: 'MainPage',
      component: MainPage
    },
    {
      path: '/registerpage',
      name: 'RegisterPage',
      component: RegisterPage
    },
    {
      path: '/loginpage',
      name: 'LoginPage',
      component: LoginPage
    },
    {
      path: '/addcmdpage',
      name: 'AddCmdPage',
      component: AddCmdPage
    },
    {
      path: '/treepage',
      name: 'TreePage',
      component: TreePage
    }
  ]
})
