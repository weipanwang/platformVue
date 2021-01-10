<template >
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/#/Resoult">测试项目</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>结果</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加按钮 -->
      <!-- <el-button type="primary" size="mini" class="tianjia">添加</el-button> -->
      <!-- 数据列表展示 -->
      <el-table :data="DataList" stripe style="width: 100%" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="taskName" label="任务名称"></el-table-column>
        <el-table-column prop="urlProject" label="所属项目"></el-table-column>
        <el-table-column prop="taskResult" label="任务结果"></el-table-column>
        <el-table-column prop="executionTime" :formatter="dateFormat" label="执行时间"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="success" @click="getResultDetail(scope.row.id)" size="mini">查看</el-button>
            <el-button disabled="" size="mini">发送到邮箱</el-button>
          </template>
        </el-table-column>
      </el-table>
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
      <!-- 详情 -->
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
                <ul>响应结果：<el-button type="success" size="mini">查看</el-button></ul>
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
        id: '',
        projectname: '',
        projectdescription: '',
        createdate: ''
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      getresultDetailDialogVisible: false,
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
      }
    }
  },
  methods: {
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.pageSize = newSize
      this.getTaskResultList()
    },
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.pageNum = newPage
      this.getTaskResultList()
    },
    dateFormat: function(row, column) {
      var date = row[column.property]
      if (date === 'undefined' || date === null) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    getTaskResultList() {
      this.$http
        .get(
          '/task/result/list?tenantid=1&pageNum=' +
            this.pageNum +
            '&pageSize=' +
            this.pageSize
        )
        .then(res => {
          this.DataList = res.data.data.list
          this.total = res.data.data.total
          // console.log(res.data.data.list)
        })
        .catch(error => {
          this.$message.error('查询失败' + error)
        })
    },
    getResultDetail(id) {
      this.$http
        .get('/task/result/list/detail?taskresultid=' + id)
        .then(response => {
          this.resultDetail = response.data.data
          this.getresultDetailDialogVisible = true
        })
        .catch(error => {
          this.$message.error('查询失败' + error)
        })
    }
  },
  created() {
    this.getTaskResultList()
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
