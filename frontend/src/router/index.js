import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '项目导航' }
  },
  {
    path: '/what-to-eat',
    name: 'WhatToEat',
    component: () => import('@/views/WhatToEat.vue'),
    meta: { title: '晚上吃什么' }
  },
  {
    path: '/main',
    component: () => import('@/views/main/Layout.vue'),
    meta: { title: '管理后台' },
    children: [
      {
        path: '',
        redirect: '/main/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/main/Dashboard.vue'),
        meta: { title: '控制台' }
      },
      {
        path: 'projects',
        name: 'ProjectManage',
        component: () => import('@/views/main/ProjectManage.vue'),
        meta: { title: '项目管理' }
      },
      // 预留工具路由插槽 - 在此处添加更多工具
      {
        path: ':tool',
        name: 'Tool',
        component: () => import('@/views/main/ToolPlaceholder.vue'),
        meta: { title: '工具' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · Project Hub` : 'Project Hub'
})

export default router
