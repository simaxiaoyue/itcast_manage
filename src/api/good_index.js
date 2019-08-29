// 引入封装好的axios
import axios from '@/utils/myaxios.js'

// 1.获取所有商品数据
export const getAllGoods = (params) => {
  return axios({
    url: 'goods',
    params
  })
}

// 2.添加商品
export const addCate = (data) => {
  return axios({
    url: 'goods',
    method: 'post',
    data
  })
}
