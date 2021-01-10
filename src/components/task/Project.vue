<template >
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/#/Project">测试项目</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>环境</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-button type="primary" size="mini" @click="createProject" class="tianjia">添加</el-button>
      <!-- 数据列表展示 -->
      <el-table
        :data="DataList"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        @expand-change="getUrlList"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template>
            <el-table :data="projectInfoChild" align="center" border style="width: 100%">
              <el-table-column type="index"></el-table-column>
              <el-table-column align="center" prop="url" label="请求地址"></el-table-column>
              <el-table-column align="center" prop="urlport" label="端口"></el-table-column>
              <el-table-column
                align="center"
                prop="createdate"
                :formatter="dateFormat"
                label="创建时间"
              ></el-table-column>
              <el-table-column align="center" prop="urldescription" label="说明"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="projectname" align="center" label="项目名称"></el-table-column>
        <el-table-column prop="projectdescription" align="center" label="项目说明"></el-table-column>
        <el-table-column prop="createdate" :formatter="dateFormat" align="center" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="primary" @click="createUrl(scope.row.id)" size="mini">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 翻页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNumber"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 添加项目 -->
      <el-dialog title="添加项目" :visible.sync="createProjectDialogVisible" width="50%">
        <el-form
          :model="projectInfo"
          :rules="createProjectRules"
          ref="createProjectRef"
          label-width="70px"
        >
          <el-form-item label="项目名称" prop="projectname">
            <el-input v-model="projectInfo.projectname"></el-input>
          </el-form-item>
          <el-form-item label="说明" prop="projectdescription">
            <el-input v-model="projectInfo.projectdescription"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createInfogo">添加</el-button>
        </span>
      </el-dialog>
      <!-- 添加接口信息 -->
      <el-dialog title="添加接口信息" :visible.sync="createUrlDialogVisible" width="50%">
        <el-form :model="UrlInfo" :rules="createUrlRules" ref="createUrlRef" label-width="70px">
          <el-form-item label="url" prop="url">
            <el-input v-model="UrlInfo.url">
              <template slot="prepend">Http://</template>
            </el-input>
          </el-form-item>
          <el-form-item label="端口" prop="urlport">
            <el-input v-model="UrlInfo.urlport"></el-input>
          </el-form-item>
          <el-form-item label="说明" prop="urldescription">
            <el-input v-model="UrlInfo.urldescription"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createUrlInfogo">添加</el-button>
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
      projectInfoChild: [],
      projectList: {
        id: '',
        projectname: '',
        projectdescription: '',
        createdate: ''
      },
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      expands: [],
      createProjectDialogVisible: false,
      projectInfo: {
        projectname: '',
        projectdescription: ''
      },
      createProjectRules: {
        projectname: [
          { required: true, $message: '请输入项目名称', trigger: 'blur' }
        ],
        projectdescription: [
          { required: true, $message: '请输入说明', trigger: 'blur' }
        ]
      },
      createUrlDialogVisible: false,
      UrlInfo: {
        url: '',
        urlport: '',
        projectid: '',
        urldescription: ''
      },
      createUrlRules: {
        url: [{ required: true, $message: '请输入访问地址', trigger: 'blur' }],
        urlport: [{ required: true, $message: '请输入端口', trigger: 'blur' }],
        urldescription: [
          { required: true, $message: '请输入说明', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    dateFormat: function(row, column) {
      var date = row[column.property]
      if (date === 'undefined' || date === null) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    async getList() {
      const { data: res } = await this.$http.get(
        '/project/getlist?tenantid=1&pageNum=' +
          this.pageNumber +
          '&pageSize=' +
          this.pageSize
      )
      console.log(res)
      if (res.status !== 200) return this.$message.error('查询数据失败')
      this.DataList = res.data.list
      this.total = res.data.total
      // console.log(res.data)
    },
    async getUrlList(row, expandedRows) {
      // console.log(row)
      const { data: res } = await this.$http.get(
        '/url/list?projectid=' + row.id
      )
      // console.log(res)
      if (res.status !== 200) return this.$message.error('查询数据失败')
      this.projectInfoChild = res.data
      var that = this
      if (expandedRows.length) {
        that.expands = []
        if (row) {
          that.expands.push(row.id)
        }
      } else {
        that.expands = []
      }
    },
    getRowKeys: function(row) {
      return row.id
    },
    createProject() {
      // console.log('1')
      this.createProjectDialogVisible = true
    },
    // 添加信息
    createInfogo() {
      this.$refs.createProjectRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return valid
        // 可以添加网络请求
        const { data: res } = await this.$http.post(
          '/project/create?projectname=' +
            this.projectInfo.projectname +
            '&projectdescription=' +
            this.projectInfo.projectdescription
        )
        // console.log(res)
        if (res.status !== 200) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.createProjectDialogVisible = false
        this.projectInfo.projectname = ''
        this.projectInfo.projectdescription = ''
        this.getList()
      })
    },
    createUrl(id) {
      this.createUrlDialogVisible = true
      this.UrlInfo.projectid = id
    },
    createUrlInfogo() {
      this.$refs.createUrlRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return valid
        // 可以添加网络请求

        const { data: res } = await this.$http.post(
          '/url/create?url=' +
            this.UrlInfo.url +
            '&urlport=' +
            this.UrlInfo.urlport +
            '&urldescription=' +
            this.UrlInfo.urldescription +
            '&projectid=' +
            this.UrlInfo.projectid
        )
        // console.log(res)
        if (res.status !== 200) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.createUrlDialogVisible = false
        this.UrlInfo.projectid = ''
        this.UrlInfo.url = ''
        this.UrlInfo.urlport = ''
        this.UrlInfo.urldescription = ''
      })
    },
    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.pageSize = newSize
      this.getList()
    },
    // 监听pageNum改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.pageNumber = newPage
      this.getList()
    }
  },
  created() {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
.tianjia {
  float: right;
  margin-bottom: 10px;
}
</style>
