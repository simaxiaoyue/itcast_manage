// 引入封装好的axios
import axios from '@/utils/myaxios.js'

// 1.获取所有权限数据
export const getAllRightList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}

// 2.获取左侧菜单权限
export const getMenuRight = () => {
  return axios({
    url: 'menus'
  })
}
