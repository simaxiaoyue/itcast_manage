// 1。引入封装好的axios
import axios from '@/utils/myaxios.js'

// 1.获取所有用户数据
export const getAllUsers = (params) => {
  return axios({
    url: 'users',
    params
  })
}

// 2.添加用户数据

export const addUser = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}
