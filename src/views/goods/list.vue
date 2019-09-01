<template>
  <div class="list">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        v-model="goodsobj.query"
        class="input-with-select"
        style="width:300px;margin-right:10px"
        @input.native="init"
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="success" @click="$router.push({name: 'add'})">添加商品</el-button>
    </div>
    <!-- 表格展示区域 -->
    <el-table :data="goodsList" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="180"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间">
        <template slot-scope="scope">{{scope.row.add_time | timeFormat}}</template>
      </el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="审核" placement="top">
            <el-button type="success" icon="el-icon-circle-plus-outline"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsobj.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="goodsobj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { getAllGoods } from '@/api/good_index'
import { timeFormat } from '@/utils/myfiltes.js'
export default {
  data () {
    return {
      total: 0,
      goodsList: [],
      goodsobj: {
        query: '',
        pagenum: 1,
        pagesize: 3
      }
    }
  },
  mounted () {
    this.init()
  },
  filters: {
    timeFormat
  },
  methods: {
    init () {
      getAllGoods(this.goodsobj).then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.goodsList = res.data.data.goods
          this.total = res.data.data.total
          console.log(this.goodsList)
        }
      })
    },
    handleSizeChange (val) {
      //   console.log(`每页 ${val} 条`)
      this.goodsobj.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      //   console.log(`当前页: ${val}`)
      this.goodsobj.pagenum = val
      this.init()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
