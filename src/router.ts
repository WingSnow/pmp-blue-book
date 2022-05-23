import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Login from '@/views/LoginLayout.vue'
import RouterLayout from '@/views/RouterLayout.vue'
import BasicLayout from '@/views/BasicLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'Index',
    component: RouterLayout,
    redirect: { name: 'Exam' },
    children: [
      {
        path: '/exam',
        name: 'Exam',
        component: BasicLayout,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const unProtectRoute = ['/login']

router.beforeEach((to, from, next) => {
  const isLogin = !!sessionStorage.getItem('token')
  if (unProtectRoute.includes(to.path)) {
    next()
  } else if (isLogin) {
    next()
  } else {
    router.replace({
      name: 'Login',
      query: { targetUrl: to.fullPath },
    })
  }
})

export default router
