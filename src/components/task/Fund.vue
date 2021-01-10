<template >
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/#/Fund">定时任务</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>基金</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-card>
        <div>
          <div
            style="
              margin-left: 10px;
              margin-top: 5px;
              margin-bottom: 10px;
              float: left;
              font-size: 10px;
            "
          >
            用户名：<el-input
              v-model="usernameQuery"
              validate-event
              style="width: 160px"
              size="mini"
              type="text"
              placeholder="请输用户名"
              maxlength="30"
              show-word-limit
            ></el-input>
          </div>
          <div
            style="
              margin-left: 10px;
              margin-top: 5px;
              margin-bottom: 10px;
              float: left;
              font-size: 10px;
            "
          >
            状态：<el-select
              v-model="isSuccessQuery"
              size="mini"
              style="width: 160px"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div
            style="
              margin-left: 10px;
              margin-top: 5px;
              margin-bottom: 10px;
              float: left;
              font-size: 10px;
            "
          >
            开始时间：<el-date-picker
              type="datetimerange"
              v-model="value1"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              style="width: 200px"
            >
            </el-date-picker>
          </div>
          <div
            style="
              margin-left: 10px;
              margin-top: 5px;
              margin-bottom: 10px;
              float: left;
              font-size: 10px;
            "
          >
            更新时间：<el-date-picker
              type="datetimerange"
              v-model="value2"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              style="width: 200px"
            >
            </el-date-picker>
          </div>
          <div
            style="
              margin-left: 10px;
              margin-top: 5px;
              margin-bottom: 10px;
              float: left;
            "
          >
            <el-button plain size="mini" @click="queryByRecord(pageNumType)"
              >查询</el-button
            >
          </div>
          <div
            style="
              margin-left: 10px;
              margin-top: 5px;
              margin-bottom: 10px;
              float: left;
            "
          >
            <el-button plain size="mini" @click="clickQuery">重置</el-button>
          </div>
          <div
            style="
              margin-left: 10px;
              margin-top: 5px;
              margin-bottom: 10px;
              float: left;
            "
          >
            <el-button
              type="primary"
              size="mini"
              @click="addDialogVisible = true"
              >添加</el-button
            >
          </div>
        </div>
      </el-card>
      <!-- 数据列表区 -->
      <el-table :data="fundlist" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column
          prop="cratedata"
          label="创建时间"
          :formatter="dateFormat"
        ></el-table-column>
        <el-table-column
          prop="updatedate"
          label="更新时间"
          :formatter="dateFormat"
        ></el-table-column>
        <el-table-column
          prop="issuccess"
          :formatter="fundIssuccess"
          label="状态"
        ></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <div
              v-if="scope.row.issuccess == '0'"
              @click="updateInfo(scope.row.username, scope.row.id)"
              style="color: #00f"
            >
              修改
            </div>
            <div
              v-if="scope.row.issuccess == '3'"
              @click="getErrorInfo(scope.row.id)"
              style="color: #00f"
            >
              查看
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
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
    <!-- 添加信息 -->
    <el-dialog title="添加" :visible.sync="addDialogVisible" width="50%">
      <!-- 内容主体区 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看失败原因 -->
    <el-dialog title="查看" :visible.sync="errorDialogVisible" width="30%">
      <span>{{ errorInfo }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errorDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog title="修改" :visible.sync="updateDialogVisible" width="50%">
      <el-form
        :model="updateForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input disabled v-model="updateForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="updateForm.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateInfogo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import qs from 'qs'
export default {
  data() {
    return {
      // 获取list的请求参数
      pageNum: 1,
      pageSize: 10,
      fundlist: [],
      total: 0,
      addDialogVisible: false,
      errorDialogVisible: false,
      updateDialogVisible: false,
      addForm: {
        username: '',
        password: '',
      },
      updateForm: {
        id: '',
        username: '',
        password: '',
      },
      addFormRules: {
        username: [
          { required: true, $message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, $message: '请输入用户名', trigger: 'blur' },
        ],
      },
      caozuo: { chakan: '查看', xiugai: '修改' },
      errorInfo: '加载中...',
      isSuccessQuery: '',
      options: [
        {
          value: '0',
          label: '待执行',
        },
        {
          value: '1',
          label: '执行中',
        },
        {
          value: '2',
          label: '成功',
        },
        {
          value: '3',
          label: '失败',
        },
      ],
      usernameQuery: '',
      startCreateDate: '',
      endCreateDate: '',
      startUpdateDate: '',
      endUpdateDate: '',
      value1: '',
      value2: '',
      queryVo: {
        username: '',
        issuccess: '',
        startCratedate: '',
        endCratedate: '',
        startUpdatedate: '',
        endUpdatedate: '',
        pageNum: 1,
        pageSize: 10,
        type: 1,
      },
      pageNumType: '1',
    }
  },
  created() {
    this.getFundList()
    //this.queryByRecord()
  },
  methods: {
    async getFundList() {
      const { data: res } = await this.$http.get(
        '/record/getfundrecord?pageNum=' +
          this.pageNum +
          '&pageSize=' +
          this.pageSize
      )
      if (res.status !== 200) return this.$message.error('获取列表数据失败')
      this.fundlist = res.data.list
      this.total = res.data.total
      // console.log(res)
    },
    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.pageSize = newSize
      //this.getFundList()
      this.queryByRecord((this.pageNumType = '2'))
    },
    // 监听pageNum改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.pageNum = newPage
      //this.getFundList()
      this.queryByRecord((this.pageNumType = '2'))
    },
    addInfo() {
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return valid
        // 可以添加网络请求
        const { data: res } = await this.$http.post(
          '/record/creatfundinfo?username=' +
            this.addForm.username +
            '&password=' +
            this.addForm.password
        )
        // console.log(res)
        if (res.status !== 200) return this.$message.error('提交失败')
        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.getFundList()
        this.addForm.username = ''
        this.addForm.password = ''
      })
    },
    dateFormat: function (row, column) {
      var date = row[column.property]
      if (date === 'undefined' || date === null) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    fundIssuccess(row, column) {
      if (row.issuccess === 0) return '待执行'
      if (row.issuccess === 1) return '执行中'
      if (row.issuccess === 2) return '成功'
      if (row.issuccess === 3) return '失败'
    },
    async getErrorInfo(fundid) {
      // console.log('111')
      const { data: res } = await this.$http.get(
        '/record/geterrorinfo?id=' + fundid
      )
      if (res.status !== 200) return this.$message.error('获取数据失败')
      this.errorInfo = res.data
      this.errorDialogVisible = true
    },
    updateInfo(username, id) {
      // console.log('222')
      this.updateDialogVisible = true
      this.updateForm.username = username
      this.updateForm.id = id
    },
    updateInfogo() {
      console.log('111')
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return valid
        // 可以添加网络请求
        const { data: res } = await this.$http.post(
          '/record/updatepassword?id=' +
            this.updateForm.id +
            '&password=' +
            this.updateForm.password
        )
        // console.log(res)
        if (res.status !== 200) return this.$message.error('提交失败')
        this.$message.success('修改成功')
        this.updateDialogVisible = false
        this.updateForm.password = ''
      })
    },
    queryByRecord(pageNumType) {
      if (this.isSuccessQuery !== '') {
        this.queryVo.issuccess = this.isSuccessQuery
      }
      if (this.usernameQuery !== '') {
        this.queryVo.username = this.usernameQuery
      }
      if (this.pageNumType === '1') {
        //console.log('这是搜索')
        this.queryVo.pageNum = '1'
      } else if (this.pageNumType === '2') {
        //console.log('这是翻页')
        this.pageNumType = '1'
        this.queryVo.pageNum = this.pageNum
      }
      this.queryVo.pageSize = this.pageSize
      if (this.value1[0] !== null) {
        this.queryVo.startCratedate = this.value1[0]
      }
      if (this.value1[1] !== null) {
        this.queryVo.endCratedate = this.value1[1]
      }
      if (this.value2[0] !== null) {
        this.queryVo.startUpdatedate = this.value2[0]
      }
      if (this.value2[1] !== null) {
        this.queryVo.endUpdatedate = this.value2[1]
      }
      this.$http
        .post('/record/getQueryByRecord', qs.stringify(this.queryVo))
        .then((res) => {
          if (res.data.status !== 200) {
            this.$message.error('查询失败')
          } else {
            //console.log(res.data.data.total)
            if (res.data.data.total === 0) {
              this.$message.error('查询数据为空')
            } else {
              this.$message.success('查询成功')
              this.fundlist = res.data.data.list
              this.total = res.data.data.total
            }
          }
          this.queryVo = {
            username: '',
            issuccess: '',
            startCratedate: '',
            endCratedate: '',
            startUpdatedate: '',
            endUpdatedate: '',
            pageNum: 1,
            pageSize: 10,
            type: 1,
          }
        })
    },
    //清空查询条件
    clickQuery() {
      ;(this.isSuccessQuery = ''),
        (this.usernameQuery = ''),
        (this.value1 = ''),
        (this.value2 = ''),
        (this.queryVo = {
          username: '',
          issuccess: '',
          startCratedate: '',
          endCratedate: '',
          startUpdatedate: '',
          endUpdatedate: '',
          pageNum: 1,
          pageSize: 10,
          type: 1,
        })
    },
  },
}
</script>

<style lang="less" scoped>
.button {
  float: right;
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>
