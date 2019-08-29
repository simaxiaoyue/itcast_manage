<template>
  <div class="home">
    <!--- menu属性
   unique-opened：是否只保持一个子菜单的展开，默认值为False
   default-active：当前激活菜单的 index
   值必须是字符串
   只能设置子项的index值
   router：是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
    -->
    <el-container>
      <el-aside width="200px">
        <img src="../assets/logo.png" alt="" class="logo">
        <el-menu
          :router="true"
          :unique-opened="true"
          :default-active="'1-1'"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu :index="first.path" v-for="first in menuList" :key="first.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{first.authName}}</span>
            </template>
            <el-menu-item :index="'/home/'+second.path" v-for="second in first.children" :key="second.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{second.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
           <span class="myicon-menu toggle-btn"></span>
          <h2 class="system-title">电商后台管理系统</h2>
          <a href="javascript" class="welcome">退出</a>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getMenuRight } from '@/api/right_index.js'
export default {
  data () {
    return {
      menuList: {

      }
    }
  },
  mounted () {
    getMenuRight()
      .then(res => {
        console.log(res)
        this.menuList = res.data.data
      })
      .catch(err => {
        console.log(err)
      })
  }

}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height:60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: #fff;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292CF;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome{
    color: white;
  }
}
</style>
