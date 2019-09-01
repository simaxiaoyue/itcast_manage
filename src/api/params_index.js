import axios from '@/utils/myaxios.js'
// 1.获取参数列表
export const getAllParamsList = (id, sel) => {
  return axios({
    url: `categories/${id}/attributes`,
    params: { sel }
  })
}
