import { createRouter, createWebHistory } from 'vue-router'
import BaseAuthPage from '@/components/1_BasePage/BaseAuthPage.vue'
import BaseMainPage from '@/components/1_BasePage/BaseMainPage.vue'
import BaseBackendPage from '@/components/1_BasePage/BaseBackendPage.vue'

import AuthLoginCard from '@/components/2_Auth/AuthLoginCard.vue'
import AuthRegiCard from '@/components/2_Auth/AuthRegiCard.vue'

import PageHome from '@/components/4_Home/PageHome.vue'
import PageHealthData from '@/components/5_HealthData/PageHealthData.vue'
import PageSecurity from '@/components/7_Security/PageSecurity.vue'
import PageService from '@/components/6_Service/PageService.vue'
import PageMessage from '@/components/9_Message/PageMessage.vue'
import PageMy from '@/components/8_My/PageMy.vue'
import Bind from '@/components/5_HealthData/Bind.vue'
import PageStaff from '@/components/10_Staff/PageStaff.vue'
import PageServiceArea from '@/components/10_Staff/PageServiceArea.vue'

import ManageUser from '@/components/3_Backend/ManageUser.vue'
import ManageCarousel from '@/components/3_Backend/ManageCarousel.vue'
import ManageService from '@/components/3_Backend/ManageService.vue'
import ManageContentList from '@/components/3_Backend/ManageContentList.vue'

import MyInfo from '@/components/8_My/MyInfo.vue'
import MyAddress from '@/components/8_My/MyAddress.vue'
import MyOrder from '@/components/8_My/MyOrder.vue'

import ServiceDetail from '@/components/6_Service/Common/ServiceDetail.vue'
import ServiceOrder from '@/components/6_Service/ServiceOrder.vue'


const routes = [
  { path: '/:catchAll(.*)', component: BaseMainPage, redirect: "/PageHome", 
    children: [
      { path: '/PageHome', component: PageHome },
      { path: '/PageHealthData', component: PageHealthData },
      { path: '/Bind', component: Bind },
      { path: '/PageSecurity', component: PageSecurity },
      { path: '/PageService', component: PageService },
      { path: '/PageMessage', component: PageMessage },
      { path: '/PageStaff', component: PageStaff },
      { path: '/PageServiceArea', component: PageServiceArea },
      { path: '/PageMy', component: PageMy, redirect: "/MyInfo",
        children: [
          { path: '/MyInfo', component: MyInfo },
          { path: '/MyAddress', component: MyAddress },
          { path: '/MyOrder', component: MyOrder },
        ]
      },

      { path: '/ServiceDetail/:id', name: 'ServiceDetail',
        component: () => import('@/components/6_Service/Common/ServiceDetail.vue'),
      },
      { path: '/ServiceOrder/:id', name: 'ServiceOrder',
        component: () => import('@/components/6_Service/ServiceOrder.vue'),
      },
    ]
  },
  { path: '/auth', component: BaseAuthPage, redirect: "/PageLogin", 
    children: [
      { path: '/PageLogin', component: AuthLoginCard },
      { path: '/PageRegister', component: AuthRegiCard },
    ]
  },
  { path: '/manage', component: BaseBackendPage, redirect: "/ManageUser", 
    children: [
      { path: '/ManageUser', component: ManageUser },
      { path: '/ManageCarousel', component: ManageCarousel },
      { path: '/ManageContentList', component: ManageContentList },
      { path: '/ManageService', component: ManageService },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore()
//   const whiteList = ['/PageLogin', '/PageRegister']

//   if (whiteList.includes(to.path)) {
//     // 如果要去登录页面
//     if (to.path === '/PageLogin') {
//       // 如果已经登录
//       if (authStore.isLogin) {
//         // 跳转到首页
//         next('/')
//       } else {
//         // 允许通过
//         next()
//       }
//     } else {
//       // 允许通过
//       next()
//     }
//   }

//   // 如果要去管理页面
//   if (to.path.startsWith('/Manage')) {
//     // 检查登录状态和是否是管理员
//     if (authStore.isLoggedIn && authStore.userInfo.isAdmin) {
//       next() // 是管理员，放行
//     } else {
//       // ElMessage.error('禁止非法进入管理页面！')
//       next('/PageLogin') // 踢回登录页
//     }
//   } else {
//     next()
//   }
// })

export default router