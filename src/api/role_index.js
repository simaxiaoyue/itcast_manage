// 引入封装好的axios
import axios from '@/utils/myaxios.js'

// 1.获取所有角色数据
export const getAllRoleList = () => {
  return axios({
    url: 'roles'
  })
}
