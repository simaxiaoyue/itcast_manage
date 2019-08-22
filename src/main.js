import Vue from 'vue'
import App from './App.vue'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入公共样式
import '@/styles/index.less'
// 引入路由
import router from '@/router/router.js'
// 让Vue使用element-ui
Vue.use(ElementUI)
router.beforeEach((to, from, next) => {
  console.log(to)
  // 1.获取token
  let mytoken = localStorage.getItem('login_token')
  // 2.判断
  if (mytoken || to.path === '/login') {
    // 下一步
    next()
  } else {
    // 重定向
    next({ path: '/login' })
  }
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
