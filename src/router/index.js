import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Fund from '../components/task/Fund.vue'
import Bank from '../components/task/Bank.vue'
import Case from '../components/task/Case.vue'
import Info from '../components/task/Info.vue'
import Interface from '../components/task/Interface.vue'
import Project from '../components/task/Project.vue'
import Resoult from '../components/task/Resoult.vue'
import Task from '../components/task/Task.vue'
import UpdatePassword from '../components/task/UpdatePassword.vue'
import Excel from '../components/task/Excel.vue'
import { getCookie, getisLogin } from '../plugins/cookie.js'
Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/login' },
  {
    path: '/home',
    component: Home,
    redirect: '/Welcome',
    children: [{ path: '/Welcome', component: Welcome }, { path: '/Fund', component: Fund },
      { path: '/Bank', component: Bank },{ path: '/Case', component: Case }, { path: '/Info', component: Info },
      { path: '/Interface', component: Interface }, { path: '/Project', component: Project },
      { path: '/Resoult', component: Resoult }, { path: '/Task', component: Task },
      { path: '/UpdatePassword', component: UpdatePassword }]
  },
  { path: '/excel', component: Excel }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  if (to.path === '/excel') return next()
  // const tokenstr = window.sessionStorage.getItem('token')
  // if (!tokenstr) return next('/login')
  getisLogin(getCookie('MY_TOKEN')).then(res => {
    // console.log('islogin=' + res)
    if (!res) {
      return next('/login')
    }
  })
  next()
})
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router
