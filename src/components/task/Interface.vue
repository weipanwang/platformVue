<template >
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/#/Interface">测试项目</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>接口</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-button type="primary" @click="addInterface" size="mini" class="tianjia">添加</el-button>
      <!-- 数据列表展示 -->
      <el-table :data="DataList" stripe style="width: 100%" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="interfaceName" label="接口名称"></el-table-column>
        <el-table-column prop="requestMethod" label="请求方式"></el-table-column>
        <el-table-column prop="interfaceDescription" label="接口描述"></el-table-column>
        <el-table-column prop="createDate" :formatter="dateFormat" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="180">
          <template scope="scope">
            <el-button type="primary" size="mini" @click="getDetail(scope.row.id)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 查看详情 -->
      <el-dialog title="详情" :visible.sync="detailDialogVisible" width="70%">
        <ul>接口名称 ：{{interfaceDetail.interfaceName}}</ul>
        <ul>接口说明 ：{{interfaceDetail.interfaceDescription}}</ul>
        <ul>自定义url ：{{interfaceDetail.interfaceUrl}}</ul>
        <ul>请求方式 ：{{interfaceDetail.requestMethod}}</ul>
        <ul>请求路径 ：{{interfaceDetail.requestAddress}}</ul>
        <div v-if=" interfaceDetail.useCookies===0">
          <ul>是否使用cookie: 否</ul>
        </div>
        <div v-if=" interfaceDetail.useCookies===1">
          <ul>是否使用cookie: 是</ul>
        </div>
        <ul>params:{{interfaceDetail.params}}</ul>
        <ul>body ：{{interfaceDetail.body}}</ul>
        <ul>cookies:{{interfaceDetail.cookies}}</ul>
        <ul>header:{{interfaceDetail.header}}</ul>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="detailDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加数据 -->
      <el-dialog title="添加" :visible.sync="addDialogVisible" width="70%">
        <el-form
          :model="addData"
          :rules="addInterfaceRules"
          ref="addInterfaceRef"
          label-width="70px"
        >
          <el-form-item
            label="接口名称"
            label-width="130px"
            prop="interfaceName"
            style="margin-top:-15px"
          >
            <el-input placeholder="请输入接口名称" v-model="addData.interfaceName"></el-input>
          </el-form-item>
          <el-form-item
            label="接口说明"
            label-width="130px"
            prop="interfaceDescription"
            style="margin-top:-15px"
          >
            <el-input placeholder="请输入接口说明" v-model="addData.interfaceDescription"></el-input>
          </el-form-item>
          <el-form-item
            label="自定义url"
            label-width="130px"
            prop="interfaceUrl"
            style="margin-top:-15px"
          >
            <el-input placeholder="请输入url，特殊url才需要在这里输入" v-model="addData.interfaceUrl"></el-input>
          </el-form-item>
          <el-form-item label="请求方法" label-width="130px" style="margin-top:-15px">
            <el-select v-model="addData.requestMethod" placeholder="请选择请求方式">
              <el-option label="GET" value="GET"></el-option>
              <el-option label="POST" value="POST"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="请求路径"
            label-width="130px"
            prop="requestAddress"
            style="margin-top:-15px"
          >
            <el-input placeholder="请输入路径" v-model="addData.requestAddress"></el-input>
          </el-form-item>
          <el-form-item label="body" label-width="130px" prop="body" style="margin-top:-15px">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="只适用于输入json格式"
              :autosize="{ minRows: 2, maxRows: 9}"
              v-model="addData.body"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否使用cookie" label-width="130px" style="margin-top:-15px">
            <el-radio v-model="addData.usecookies" label="1">是</el-radio>
            <el-radio v-model="addData.usecookies" label="0">否</el-radio>
          </el-form-item>
          <el-form-item label="params" label-width="130px" prop="params" style="margin-top:-15px">
            <div v-for="(v,i) in addData.params" :key="i" style="float:left;">
              <el-input placeholder="请输入参数名称" v-model="v.paramName" style="width:200px"></el-input>
              <el-input placeholder="请输入参数说明" v-model="v.paramDescription" style="width:200px"></el-input>
              <el-input placeholder="请输入参数值" v-model="v.realParameter" style="width:200px"></el-input>
            </div>
            <i class="el-icon-circle-plus" style="width:10px;float:left" @click="addparams"></i>
          </el-form-item>
          <el-form-item label="cookies" label-width="130px" prop="cookies" style="margin-top:-15px">
            <div v-for="(v,i) in addData.cookies" :key="i" style="float:left;">
              <el-input placeholder="请输入key" v-model="v.cookieName" style="width:200px"></el-input>
              <el-input placeholder="请输入value" v-model="v.cookieValue" style="width:200px"></el-input>
            </div>
            <i class="el-icon-circle-plus" style="width:10px;float:left" @click="addcookies"></i>
          </el-form-item>
          <el-form-item label="header" label-width="130px" prop="header" style="margin-top:-15px">
            <div v-for="(v,i) in addData.header" :key="i" style="float:left;">
              <el-input placeholder="请输入key" v-model="v.headerName" style="width:200px"></el-input>
              <el-input placeholder="请输入value" v-model="v.headerValue" style="width:200px"></el-input>
            </div>
            <i class="el-icon-circle-plus" style="width:10px;float:left" @click="addheader"></i>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addInterfaceSubmit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 翻页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      DataList: [],
      addData: {
        interfaceName: '',
        interfaceDescription: '',
        requestMethod: '',
        requestAddress: '',
        tenantId: '',
        params: [{ paramName: '', paramDescription: '', realParameter: '' }],
        body: '',
        cookies: [{ cookieName: '', cookieValue: '' }],
        header: [{ headerName: '', headerValue: '' }],
        usecookies: '',
        interfaceUrl: ''
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      // 详情对象
      interfaceDetail: {},
      // 详情
      detailDialogVisible: false,
      // 添加
      addDialogVisible: false,
      addInterfaceRules: {
        interfaceName: [
          { required: true, $message: '请输入接口名称', trigger: 'blur' }
        ],
        requestMethod: [
          { required: true, $message: '请输入请求方式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.pageSize = newSize
      this.getInterfaceList()
    },
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.pageNum = newPage
      this.getInterfaceList()
    },
    dateFormat: function(row, column) {
      var date = row[column.property]
      if (date === 'undefined' || date === null) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    async getInterfaceList() {
      const { data: res } = await this.$http.get(
        '/interface/list?tenantid=1&pageNum=' +
          this.pageNum +
          '&pageSize=' +
          this.pageSize
      )
      if (res.status !== 200) return this.$message.error('查询数据失败')
      this.DataList = res.data.list
      this.total = res.data.total
      // console.log(res.data)
    },
    // 点击查看详情
    async getDetail(id) {
      const { data: res } = await this.$http.get(
        '/interface/list/paraminfo?interfaceid=' + id
      )
      if (res.status !== 200) return this.$message.error('查询数据失败')
      this.detailDialogVisible = true
      this.interfaceDetail = res.data
      // console.log(res.data)
    },
    // 添加接口信息
    async addInterface() {
      this.addDialogVisible = true
    },
    async addInterfaceSubmit() {
      const { data: res } = await this.$http.post(
        '/interface/create',
        this.addData
      )
      if (res.status !== 200) return this.$message.error('添加数据失败')
      this.$message.success('添加成功')
      this.addData = {
        interfaceName: '',
        interfaceDescription: '',
        requestMethod: '',
        requestAddress: '',
        tenantId: '',
        params: [{ paramName: '', paramDescription: '', realParameter: '' }],
        body: '',
        cookies: [{ cookieName: '', cookieValue: '' }],
        header: [{ headerName: '', headerValue: '' }],
        usecookies: ''
      }
      this.getInterfaceList()
      this.addDialogVisible = false
    },
    addparams() {
      this.addData.params.push({
        paramName: '',
        paramDescription: '',
        realParameter: ''
      })
    },
    addcookies() {
      this.addData.cookies.push({
        cookieName: '',
        cookieValue: ''
      })
    },
    addheader() {
      this.addData.header.push({
        headerName: '',
        headerValue: ''
      })
    }
  },
  created() {
    this.getInterfaceList()
  }
}
</script>

<style lang="less" scoped>
.tianjia {
  float: right;
  margin-bottom: 10px;
}
</style>
