// 引入封装好的axios
import axios from '@/utils/myaxios.js'

// 1.获取所有角色数据
export const getAllRoleList = () => {
  return axios({
    url: 'roles'
  })
}
// 2.删除角色指定的权限
export const delRightByRoleId = (roleId, rightId) => {
  return axios({
    method: 'delete',
    url: `roles/${roleId}/rights/${rightId}`
  })
}
// 3.为指定角色授权
export const grantRoleById = (roleId, rids) => {
  return axios({
    method: 'post',
    url: `roles/${roleId}/rights`,
    data: { rids }
  })
}
// 4.添加角色
export const addRole = (data) => {
  return axios({
    method: 'post',
    url: `roles`,
    data
  })
}
// 4.删除角色
export const delRoleById = (id) => {
  return axios({
    method: 'delete',
    url: `roles/${id}`
  })
}
// 5.编辑角色
export const editRoleById = (data) => {
  return axios({
    method: 'put',
    url: `roles/${data.id}`,
    data
  })
}
