<template>
  <div class="users">
    <!-- 面包屑 -->

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
<!-- 搜索区域 -->
<div style="margin-top: 15px;">
  <el-input
  placeholder="请输入内容"
   v-model="userobj.query" class="input-with-select"
   style="width:300px;margin-right:10px"
    @input.native="init">
    <el-button slot="append" icon="el-icon-search"  @click='init'></el-button>
  </el-input>
  <el-button type="success">添加用户</el-button>
</div>
  <!-- 表格展示区域 -->
    <el-table :data="userList" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column label="用户状态">
        <template slot-scope='scope'>
  <!-- 自定义模板列,获取相应的数据  scope.row -->
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
         <el-table-column label="操作"  width="400">
        <template slot-scope="">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
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
      :current-page="userobj.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="userobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
  </div>
</template>
<script>
import { getAllUsers } from '@/api/user_index.js'

export default {
  data () {
    return {
      total: 0,
      userKey: '',
      userList: [],
      userobj: {
        query: '',
        pagenum: 1,
        pagesize: 2
      }
    }
  },
  methods: {
    handleSizeChange (val) {
    //   console.log(`每页 ${val} 条`)
      this.userobj.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
    //   console.log(`当前页: ${val}`)
      this.userobj.pagenum = val
      this.init()
    },
    init () {
      // this.userobj中已经包含了搜索关键字
      getAllUsers(this.userobj)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users
            this.total = res.data.data.total
          } else if (res.data.meta.status === 400) {
            this.$message.error(res.data.meta.msg)
            this.$router.push({ name: 'login' })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
