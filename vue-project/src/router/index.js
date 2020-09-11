import Vue from 'vue'
import Router from 'vue-router'
// import { LOGIN_PATH, REFRESH } from 'src/config'
// import { routerBeforeEachFunc, routerAfterEachFunc } from './router-interceptors'

Vue.use(Router)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


const CONST_ROUTER = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/index'),
    children: [
      {
        path: '/map/a-map',
        component: () => import('@/modules/test-components/map/a-map.vue'),
      },
      {
        path: '/map/baidu-map',
        component: () => import('src/modules/test-components/map/baidu-map.vue'),
      },
      {
        path: '/table/table01',
        component: () => import('src/modules/test-components/table/table01.vue'),
      },
      {
        path: '/table/table02',
        component: () => import('src/modules/test-components/table/table02.vue'),
      },
      {
        path: '/table/table03',
        component: () => import('src/modules/test-components/table/table03.vue'),
      },
      {
        path: '/file/file01',
        component: () => import('src/modules/test-components/file/file01.vue'),
      },
      {
        path: '/file/file02',
        component: () => import('src/modules/test-components/file/file02.vue'),
      },
      {
        path: '/file/file03',
        component: () => import('src/modules/test-components/file/file03.vue'),
      },
      {
        path: '/excel/excel01',
        component: () => import('src/modules/test-components/excel/index01.vue')
      },
      {
        path: '/excel/excel02',
        component: () => import('src/modules/test-components/excel/index02.vue')
      },
      {
        path: '/xhr/axios',
        component: () => import('src/modules/test-components/axios/index.vue')
      },
      {
        path: '/xhr/axios02',
        component: () => import('src/modules/test-components/axios/index02.vue')
      },
      {
        path: '/icon',
        component: () => import('src/modules/test-components/icon/index.vue')
      },
      {
        path: '/flowChart',
        component: () => import('src/modules/test-components/flow-chart/index.vue')
      },
      {
        path: '/menu',
        component: () => import('src/modules/test-components/menu/index.vue')
      },
      {
        path: '/router',
        component: () => import('src/modules/test-components/menu/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('src/views/login/hms-login')
  }
]

const ROUTER = new Router({
//   mode: 'hash',
  routes: CONST_ROUTER
})
// ROUTER.beforeEach(routerBeforeEachFunc)
// ROUTER.afterEach(routerAfterEachFunc)
export default ROUTER
