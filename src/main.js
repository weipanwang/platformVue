import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import 'default-passive-events'
// cookie
import { setCookie, getCookie, delCookie } from './plugins/cookie.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字图标
import './assets/fonts/iconfont.css'
// 发包工具
import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: '/test/', 
  timeout: 10000
});
Vue.prototype.$http1 = service

// 设置请求的根路径
axios.defaults.baseURL = '/api/'
//让ajax携带cookie
axios.defaults.withCredentials = true
//request拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.prototype.$cookieStore = {
  setCookie, getCookie, delCookie
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
