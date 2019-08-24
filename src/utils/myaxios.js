import axios from 'axios'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  //   console.log(config)
  // 在发送请求之前做些什么:获取token，设置请求头
  //   1.获取token
  let mytoken = localStorage.getItem('login_token')
  if (mytoken) {
    // 2.设置请求头:config.headers是一个对象，里面就包含着当前的请求头的设置
    config.headers.Authorization = mytoken
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
export default axios
