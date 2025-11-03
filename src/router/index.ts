import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import Home from '@/views/HomeView.vue'
import About from '@/views/AboutView.vue'
import Lottery from '@/views/LotteryView.vue'
import Login from '@/views/LoginView.vue'
import User from '@/views/UserView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/lottery',
    name: 'lottery',
    component: Lottery,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/users/:id',
    name: 'user',
    component: User
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('token')

  if (authRequired && !loggedIn) {
    next('/login')
  } else {
    next()
  }
})
export default router
