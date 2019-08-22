import axios from '@/utils/myaxios.js'
// 实现登陆验证
export const login = (data) => {
  return axios({
    url: 'login',
    method: 'post',
    data
  })
}
