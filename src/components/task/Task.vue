<template >
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/#/Task">测试项目</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>任务</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-button type="primary" size="mini" class="tianjia" @click="addtable">添加</el-button>
      <!-- 数据列表展示 -->
      <el-table :data="DataList" stripe style="width: 100%" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="taskName" label="任务名称"></el-table-column>
        <el-table-column prop="environment" label="所属环境"></el-table-column>
        <el-table-column prop="taskContentName" label="任务内容" align="center">
          <template slot-scope="scope">
            <el-checkbox-group v-model="scope.row.taskContentName">
              <el-checkbox v-for="(v,i) in scope.row.taskContentName" :key="i" :label="v" disabled></el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
        <el-table-column prop="lastExecutionTime" :formatter="dateFormat" label="最后执行时间"></el-table-column>
        <el-table-column label="操作" width="340">
          <template scope="scope">
            <el-button @click="getDetail(scope.row.id)" size="mini">查看</el-button>
            <el-button type="primary" @click="taskStart(scope.row.id)" size="mini">运行</el-button>
            <el-button
              type="success"
              @click="getResult(scope.row.id)"
              v-if="scope.row.lastExecutionTime !== null"
              size="mini"
            >查看结果</el-button>
            <el-button disabled="" size="mini">定时执行</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加数据 -->
      <el-dialog title="添加" :visible.sync="addDialogVisible" width="70%">
        <el-form ref="addTaskRef" :model="addData" label-width="80px">
          <el-form-item label="任务名称" label-width="100px">
            <el-input v-model="addData.taskName"></el-input>
          </el-form-item>
          <el-form-item label="任务描述" label-width="100px">
            <el-input v-model="addData.taskDescription"></el-input>
          </el-form-item>
          <el-form-item label="所属环境" label-width="100px">
            <el-select v-model="addData.projectid" @change="geturllist()" placeholder="请选择环境">
              <el-option v-for="(v,i) in prijectlist" :key="i" :value="v.id" :label="v.projectname"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请求url" label-width="100px">
            <el-select v-model="addData.urlid" placeholder="请选择url">
              <el-option v-for="(v,i) in urllist" :key="i" :value="v.id" :label="v.url"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择用例" label-width="100px">
            <el-select v-model="addData.caseList" multiple collapse-tags placeholder="请选择用例">
              <el-option v-for="(v,i) in caselist" :key="i" :value="v.id" :label="v.caseName"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createTask">确 定</el-button>
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
      <!-- 查看详情 -->
      <el-dialog title="详情" :visible.sync="getDetailDialogVisible" width="70%">
        <ul>任务名称：{{getDetailData.taskName}}</ul>
        <ul>任务说明：{{getDetailData.taskDescription}}</ul>
        <ul>所属项目：{{getDetailData.urlProject}}</ul>
        <ul>URL：{{getDetailData.environmentalAddress}}</ul>
        <ul>创建时间：{{getDetailData.createDate | showDate}}</ul>
        <ul>最后执行时间：{{getDetailData.lastExecutionTime | showDate}}</ul>
        <el-form :model="getDetailData" label-width="80px">
          <el-form-item label="包含用例">
            <el-checkbox-group v-model="getDetailData.taskContentName">
              <el-checkbox
                v-for="(v,i) in getDetailData.taskContentName"
                :key="i"
                :label="v"
                disabled
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="getDetailDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 查看结果详情 -->
      <el-dialog title="执行结果" :visible.sync="getresultDetailDialogVisible" width="70%">
        <ul>执行时间：{{resultDetail.executionTime | showDate}}</ul>
        <ul>执行结果：{{resultDetail.taskResult}}</ul>
        <ul>所属环境：{{resultDetail.urlProject}}</ul>
        <ul>请求地址: {{resultDetail.environmentAddress}}</ul>
        <el-table :data="resultDetail.caseResult" stripe style="width: 100%" border>
          <el-table-column type="expand">
            <template scope="scope">
              <div v-for="(v,i) in scope.row.caseResultDetail" :key="i">
                <hr />
                <ul>接口名称：{{v.interfacename}}</ul>
                <ul>请求路径：{{v.requestaddress}}</ul>
                <ul>接口参数：{{v.interfaceparam}}</ul>
                <ul>执行结果：{{v.interfaceresult}}</ul>
                <ul>响应结果：查看</ul>
                <ul>正则表达式：{{v.extractParam}}</ul>
                <ul>预期值：{{v.checkvalue}}</ul>
                <ul>实际值：{{v.actualvalue}}</ul>
                <ul>结果说明：{{v.resultDescription}}</ul>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="caseName" label="用例名称"></el-table-column>
          <el-table-column prop="caseResult" label="执行结果"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="getresultDetailDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
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
        taskName: '',
        taskDescription: '',
        projectid: '',
        caseList: [],
        urlid: ''
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      // caselist
      addDialogVisible: false,
      prijectlist: [],
      urllist: [],
      caselist: [],
      // 详情
      getDetailDialogVisible: false,
      getDetailData: {},
      // 结果详情
      resultDetail: {
        executionTime: '',
        taskName: '',
        taskResult: '',
        urlProject: '',
        environmentAddress: '',
        caseResult: [
          {
            caseResultid: '',
            caseName: '',
            caseResult: '',
            caseResultDetail: [
              {
                interfacename: '',
                requestaddress: '',
                interfaceresult: '',
                interfaceparam: '',
                responseparam: '',
                interfaceparamName: '',
                checkvalue: '',
                actualvalue: '',
                resultDescription: '',
                extractParam: ''
              }
            ]
          }
        ]
      },
      getresultDetailDialogVisible: false
    }
  },
  methods: {
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.pageSize = newSize
    },
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.pageNum = newPage
    },
    dateFormat: function(row, column) {
      var date = row[column.property]
      if (date === 'undefined' || date === null) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    getListData() {
      this.$http
        .get('/task/list?tenantid=1')
        .then(response => {
          // console.log(response.data)
          this.DataList = response.data.data.list
          this.total = response.data.data.total
        })
        .catch(error => {
          this.$message.error('获取列表数据失败' + error)
        })
    },
    addtable() {
      this.addDialogVisible = true
      // 获取所属项目
      this.$http
        .get('/project/getlist?tenantid=1&pageNum=1&pageSize=10')
        .then(response => {
          console.log(response.data.data.list)
          this.prijectlist = response.data.data.list
        })
        .catch(error => {
          this.$message.error('获取所属项目数据失败' + error)
        })
      // 获取用例列表
      this.$http
        .get('/casenamelist?tenantid=1')
        .then(response => {
          console.log(response.data.data)
          this.caselist = response.data.data
        })
        .catch(error => {
          this.$message.error('获取用例列表数据失败' + error)
        })
    },
    createTask() {
      this.$http
        .post(
          '/task/create',
          'taskName=' +
            this.addData.taskName +
            '&taskDescription=' +
            this.addData.taskDescription +
            '&projectid=' +
            this.addData.projectid +
            '&caseList=' +
            this.addData.caseList +
            '&urlid=' +
            this.addData.urlid
        )
        .then(response => {
          console.log(response.data)
          this.$message.success('添加成功')
          this.getListData()
          this.addData = {
            taskName: '',
            taskDescription: '',
            projectid: '',
            caseList: [],
            urlid: ''
          }
          this.addDialogVisible = false
        })
        .catch(error => {
          this.$message.error('获取任务列表数据失败' + error)
        })
    },
    geturllist() {
      // console.log("aaa", this.addData.caseList)
      this.$http
        .get('/url/list?projectid=' + this.addData.projectid)
        .then(response => {
          console.log(response.data.data)
          this.urllist = response.data.data
        })
        .catch(error => {
          this.$message.error('获取url列表失败' + error)
        })
    },
    getDetail(id) {
      // this.$message.success('id=' + id)
      this.$http
        .get('/task/detail?taskid=' + id)
        .then(response => {
          // console.log(response.data.data)
          this.getDetailData = response.data.data
          this.getDetailDialogVisible = true
        })
        .catch(error => {
          this.$message.error('查询失败' + error)
        })
    },
    taskStart(id) {
      // this.$message.success('id=' + id)
      this.$http
        .get('/task/start?taskid=' + id)
        .then(response => {
          this.$message.success('执行成功')
          this.getListData()
        })
        .catch(error => {
          this.$message.error('执行失败' + error)
        })
    },
    getResult(id) {
      // this.$message.success('id=' + id)
      this.$http
        .get('/task/result/detail?taskid=' + id)
        .then(response => {
          this.getresultDetailDialogVisible = true
          this.resultDetail = response.data.data
          // console.log(response.data.data)
        })
        .catch(error => {
          this.$message.error('查询失败' + error)
        })
    }
  },
  created() {
    this.getListData()
  },
  filters: {
    showDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="less" scoped>
.tianjia {
  float: right;
  margin-bottom: 10px;
}
</style>
