<template>
  <div class="roleList">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="success" style="margin-bottom:15px" @click=" addDialogFormVisible=true">添加按钮</el-button>
    <!-- 表格区域 -->
    <el-table :data="roleList" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            v-for="first in scope.row.children"
            :key="first.id"
            style="margin-bottom:15px;border-bottom:1px dashed #eee;"
          >
            <el-col :span="4">
              <el-tag
                closable
                :type="'success'"
                @close="cnt=0;delRight(scope.row,first.id)"
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id" style="margin-bottom:10px">
                <el-col :span="4">
                  <el-tag
                    closable
                    :type="'info'"
                    @close="cnt=0;delRight(scope.row,second.id)"
                  >{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    v-for="third in second.children"
                    :key="third.id"
                    closable
                    :type="'warning'"
                    style="margin-right:5px;margin-bottom:5px;"
                    @close="cnt=0;delRight(scope.row,third.id)"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-show="scope.row.children.length === 0">还没有任何的权限，先分配！！</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="editRole(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top">
            <el-button type="success" icon="el-icon-share" @click="showGrant(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete" @click="delRole(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限对话框 -->
    <el-dialog title="权限分配" :visible.sync="grantDialogTableVisible">
      <el-tree
        :data="rightList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="chkedArr"
        :props="defaultProps"
        ref="tree"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :label-width="'80px'">
        <el-form-item label="角色名称" >
          <el-input v-model="addForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" >
          <el-input v-model="addForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :label-width="'80px'" ref="editForm">
        <el-form-item label="角色名称" prop="roleName ">
          <el-input v-model="editForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc ">
          <el-input v-model="editForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllRoleList,
  delRightByRoleId,
  grantRoleById,
  addRole,
  delRoleById,
  editRoleById
} from '@/api/role_index.js'
import { getAllRightList } from '@/api/right_index.js'
export default {
  data () {
    return {
      editForm: {
        roleName: '',
        roleDesc: '',
        id: ''
      },
      editDialogFormVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addDialogFormVisible: false,
      roleId: '',
      grantDialogTableVisible: false,
      cnt: 0,
      roleList: [],
      rightList: [],
      chkedArr: [],
      defaultProps: {
        label: 'authName', // 设置节点所展示的文本属性--给你看的
        children: 'children' // 设置子节点点来源的属性，你遍历哪个属性去加载子节点
      }
    }
  },
  mounted () {
    this.init()
    getAllRightList('tree')
      .then(res => {
        console.log(res)
        this.rightList = res.data.data
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    edit () {
      console.log(this.editForm)
      editRoleById(this.editForm).then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.editDialogFormVisible = false
          this.init()
        }
      })
    },
    editRole (row) {
      this.editDialogFormVisible = true
      console.log(row)
      this.editForm.roleName = row.roleName
      this.editForm.roleDesc = row.roleDesc
      this.editForm.id = row.id
    },
    delRole (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delRoleById(row.id).then(res => {
          if (res.data.meta.status === 200) {
            this.init()
          }
        })
      })
    },
    add () {
      console.log(this.addForm)
      addRole(this.addForm).then(res => {
        console.log(res)
        if (res.data.meta.status === 201) {
          this.addDialogFormVisible = false
          this.init()
        }
      })
    },
    async grantRole () {
      // 先获取到当前用户所选择所有的权限id,拼接 为以,分隔的字符串
      // console.log(this.$refs.tree.getCheckedKeys())
      let arr = this.$refs.tree.getCheckedNodes()
      // console.log(arr)
      let temp = []
      for (var i = 0; i < arr.length; i++) {
        temp.push(arr[i].id + ',' + arr[i].pid) // ["109,107,102","154,107,102"]
      }
      // console.log(temp)
      temp = temp.join(',').split(',') // [109,107,102,154,107,102]
      // console.log(temp)
      temp = [...new Set(temp)]
      let res = await grantRoleById(this.roleId, temp.join(','))
      console.log(res)
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
        this.grantDialogTableVisible = false
        this.init()
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    showGrant (row) {
      this.grantDialogTableVisible = true
      this.roleId = row.id
      getAllRightList('tree').then(res => {
        console.log(res)
        this.rightList = res.data.data
      })
      // this.rightList = [...this.rightList]
      this.chkedArr.length = 0
      row.children.forEach(first => {
        if (first.children.length > 0) {
          first.children.forEach(second => {
            if (second.children.length > 0) {
              second.children.forEach(third => {
                this.chkedArr.push(third.id)
              })
            }
          })
        }
      })
    },
    delRight (row, rightId) {
      console.log(row, rightId)
      delRightByRoleId(row.id, rightId)
        .then(res => {
          console.log(res)
          if (this.cnt === 0) {
            this.$message.success('删除角色权限成功')
            this.cnt++
          }
          row.children = res.data.data
          row.children.forEach((e1, i1) => {
            if (e1.children.length === 0) {
              this.delRight(row, e1.id)
            } else {
              e1.children.forEach((e2, i2) => {
                if (e2.children.length === 0) {
                  this.delRight(row, e2.id)
                }
              })
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    init () {
      getAllRoleList()
        .then(res => {
          console.log(res)
          this.roleList = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
