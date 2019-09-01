<template>
  <div class="add">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 步骤条 -->
    <el-steps :active="activeName-0" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>
    <!-- 表单 -->
    <el-form label-width="80px">
      <!-- 标签页 -->
      <el-tabs
        v-model="activeName"
        tab-position="left"
        :before-leave="beforeLeave"
        @tab-click="handleClick"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称">
            <el-input v-model="goodsForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="goodsForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="goodsForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="goodsForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="cateList"
              change-on-select
              :props="cascadeProps"
              v-model="goodsForm.goods_cat"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-checkbox-group
            v-model="item.attr_vals"
            v-for="item in attrValues"
            :key="item.attr_id"
          >
            <el-checkbox
              border
              :label="subitem"
              v-for="(subitem,index) in item.attr_vals"
              :key="index"
            ></el-checkbox>
          </el-checkbox-group>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="item in staticValues" :key="item.attr_id">
            <el-input :value="item.attr_vals" readonly></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            class="upload-demo"
            :headers="setToken()"
            action="http://localhost:8888/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quillEditor v-model="goodsForm.goods_introduce"></quillEditor>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <!-- 按钮 -->
    <el-button type="primary" @click="addGoods">主要按钮</el-button>
  </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { getAllCateList } from '@/api/cate_index.js'
import { addCate } from '@/api/good_index.js'
import { getAllParamsList } from '@/api/params_index.js'
export default {
  data () {
    return {
      attrValues: [],
      staticValues: [],
      fileList: [],
      cateList: [],
      cascadeProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      goodsForm: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      activeName: '0'
    }
  },
  mounted () {
    getAllCateList(3).then(res => {
      console.log(res)
      if (res.data.meta.status === 200) {
        this.cateList = res.data.data
      }
    })
  },
  methods: {
    async handleClick () {
      if (this.activeName === '1') {
        let res = await getAllParamsList(this.goodsForm.goods_cat[2], 'many')
        console.log(res)
        this.attrValues = res.data.data
        for (var i = 0; i < this.attrValues.length; i++) {
          this.attrValues[i].attr_vals = this.attrValues[i].attr_vals.split(
            ','
          )
        }
      } else if (this.activeName === '2') {
        let res = await getAllParamsList(this.goodsForm.goods_cat[2], 'only')
        console.log(res)
        this.staticValues = res.data.data
      }
    },
    // 标签页跳转之前触发的钩子
    beforeLeave (activeName, oldActiveName) {
      if (activeName === '1' || activeName === '2') {
        if (this.goodsForm.goods_cat.length !== 3) {
          this.$message.warning('请先选择分类')
          this.activeName = '0'
          return false
        }
      }
    },
    // 获取token
    setToken () {
      // 1.获取token
      var token = localStorage.getItem('login_token')
      // 2.返回对象
      return { Authorization: token }
    },
    // 文件上传删除时
    handleRemove (file, fileList) {
      console.log(file)
      if (!file.response) {
        return
      }
      let temp = file.response.tmp_path
      for (let i = 0; i < this.goodsForm.pics.length; i++) {
        if (this.goodsForm.pics[i].pic === temp) {
          this.goodsForm.pics.silce(i, 1)
        }
      }
    },
    handlePreview (file) {
      console.log(file)
    },
    // 文件上传成功时
    handleSuccess (res) {
      console.log(res)
      this.goodsForm.pics.push({ pic: res.data.tmp_path })
    },
    // 文件上传之前
    beforeUpload (file) {
      // 图片的mime类型都是以image/开头，所以我们可以获取到type数据，进行判断
      if (file.type.indexOf('image/') !== 0) {
        this.$message.warning('请选择满足格式要求的图片，如png,jpg,jpeg')
        // 取消当前上传操作，会触发handleRemove
        return false
      }
    },
    async addGoods () {
      console.log(this.goodsForm)
      // console.log(this.attrValues)
      for (var i = 0; i < this.attrValues.length; i++) {
        let id = this.attrValues[i].attr_id
        for (var j = 0; j < this.attrValues[i].attr_vals.length; j++) {
          // 遍历组中的参数数据
          this.goodsForm.attrs.push({
            attr_id: id,
            attr_value: this.attrValues[i].attr_vals[j]
          })
        }
      }
      this.goodsForm.goods_cat = this.goodsForm.goods_cat.join(',')
      console.log(this.goodsForm)
      let res = await addCate(this.goodsForm)
      console.log(res)
      if (res.data.meta.status === 201) {
        this.$message.success('添加商品成功')
        this.$router.push({ name: 'list' })
      }
    }

  },
  components: {
    quillEditor
  }
}
</script>
<style lang="less" scoped>
</style>
