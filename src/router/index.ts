
import { createRouter, createWebHashHistory } from 'vue-router';
const routes: Array<any> = [
  {
    title: '首页',
    path: '/',
    redirect: '/home',
    component: () => import('@/views/index.vue'),
    children: [
      {
        title: '首页',
        path: '/home',
        component: () => import('@/views/home/index.vue')
      },
      {
        title: '去水印',
        path: '/clearwater',
        component: () => import('@/views/clearwater/index.vue')
      },
      {
        title: '语音合成',
        path: '/audio',
        component: () => import('@/views/audio/index.vue')
      },
      {
        title: '权重查询',
        path: '/weight',
        component: () => import('@/views/weight/index.vue')
      },
      {
        title: '编辑视频',
        path: '/discern',
        component: () => import('@/views/discern/index.vue')
      },
      {
        title: '登录',
        path: '/login',
        component: () => import('@/views/login/index.vue'),
      },
      {
        title: '终端',
        path: '/terminal',
        component: () => import('@/views/terminal/index.vue')
      },
    ]
  },

  {
    title: '404',
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/404/index.vue'),
  }
]

const router = createRouter({
  scrollBehavior(/* to, from, savedPosition */) {
    return { top: 0 }
  },
  history: createWebHashHistory(process.env.BASE_URL),
  routes: routes as any,
});

export default router;
