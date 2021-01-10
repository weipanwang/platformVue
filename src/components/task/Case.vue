<template >
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/#/Case">测试项目</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>用例</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-button type="primary" size="mini" @click="addcaseinfo" class="tianjia">添加</el-button>
      <!-- 数据列表展示 -->
      <el-table :data="DataList" stripe style="width: 100%" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="caseName" label="用例名称"></el-table-column>
        <el-table-column prop="caseDescription" label="用例说明"></el-table-column>
        <el-table-column prop="createDate" :formatter="dateFormat" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="180">
          <template scope="scope">
            <el-button type="primary" size="mini" @click="getDetail(scope.row.id)">详情</el-button>
            <el-button type="primary" size="mini" @click="createDetail(scope.row.id)">关联参数</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 详情数据 -->
      <el-dialog title="详情" :visible.sync="detailDialogVisible" width="70%">
        <el-table
          :data="caseDetail"
          stripe
          style="width: 100%"
          border
        >
          <el-table-column type="expand">
            <template scope="scope">
              <el-table :data="scope.row.caseParamExeract" align="center" border style="width: 100%">
                <el-table-column type="index"></el-table-column>
                <el-table-column align="center" prop="interfaceParamName" label="接口名称"></el-table-column>
                <el-table-column align="center" prop="parametricExtraction" label="正则表达式"></el-table-column>
                <el-table-column align="center" prop="caseparamName" label="参数化名称"></el-table-column>
                <el-table-column align="center" prop="targetCaseparamName" label="目标接口"></el-table-column>
                <el-table-column
                  align="center"
                  prop="createDate"
                  :formatter="dateFormat"
                  label="创建时间"
                ></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="interfaceName" label="接口名称"></el-table-column>
          <el-table-column prop="requestAddress" label="请求路径"></el-table-column>
          <el-table-column prop="interfaceParam" label="请求参数"></el-table-column>
          <el-table-column prop="extractParam" label="正则表达式"></el-table-column>
          <el-table-column prop="checkValue" label="匹配的值"></el-table-column>
          <el-table-column prop="createDate" :formatter="dateFormat" label="创建时间"></el-table-column>
          <el-table-column prop="interfaceLevel" label="优先级"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="detailDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加数据 -->
      <el-dialog title="详情" :visible.sync="addDialogVisible" width="70%">
        <el-form ref="addCaseRef" :model="addData" label-width="80px">
          <el-form-item label="用例名称" label-width="100px" style="margin-top:-10px">
            <el-input v-model="addData.caseName"></el-input>
          </el-form-item>
          <el-form-item label="用例描述" label-width="100px" style="margin-top:-10px">
            <el-input v-model="addData.caseDescription"></el-input>
          </el-form-item>
          <el-form-item label="用例优先级" label-width="100px" style="margin-top:-10px">
            <el-input v-model="addData.level"></el-input>
          </el-form-item>
          <el-form-item label="选择接口" label-width="100px" prop="params" style="margin-top:-10px">
            <div v-for="(v,i) in addData.list" :key="i" style="float:left;">
              <el-select v-model="v.interfaceId" placeholder="请选择接口" style="width:200px">
                <el-option
                  v-for="(v,i) in casenamelist"
                  :key="i"
                  :value="v.id"
                  :label="v.interfaceName"
                ></el-option>
              </el-select>
              <el-input placeholder="请输入正则表达式" v-model="v.extractParam" style="width:200px"></el-input>
              <el-input placeholder="请输入校验的值" v-model="v.checkValue" style="width:200px"></el-input>
              <el-input placeholder="请输入执行优先级" v-model="v.interfaceLevel" style="width:150px"></el-input>
            </div>
            <i class="el-icon-circle-plus" style="width:10px;float:left" @click="addparams"></i>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createcaseinfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 关联参数 -->
      <el-dialog title="关联参数" :visible.sync="createExtractDialogVisible" width="70%">
        <el-form ref="createCaseExtractRef" :model="createExtractData" label-width="80px">
          <el-form-item label="选择接口" label-width="100px" prop="params" style="margin-top:-10px">
            <el-select v-model="createExtractData.caseparamid" placeholder="请选择接口">
              <el-option
                v-for="(v,i) in caseDetail"
                :key="i"
                :value="v.id"
                :label="v.interfaceName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="正则表达式" label-width="100px" style="margin-top:-10px">
            <el-input v-model="createExtractData.exeract" placeholder="请输入正则表达式"></el-input>
          </el-form-item>
          <el-form-item label="参数名称" label-width="100px" style="margin-top:-10px">
            <el-input v-model="createExtractData.paramName" placeholder="请输入要关联的参数名称"></el-input>
          </el-form-item>
          <el-form-item label="目标接口" label-width="100px" prop="params" style="margin-top:-10px">
            <el-select
              label="目标接口"
              v-model="createExtractData.targetCaseParamId"
              placeholder="请选择目标接口"
            >
              <el-option
                v-for="(v,i) in caseDetail"
                :key="i"
                :value="v.id"
                :label="v.interfaceName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createcaseExtract">确 定</el-button>
        </span>
      </el-dialog>
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
        caseName: '',
        caseDescription: '',
        level: '',
        list: [
          {
            interfaceName: '',
            extractParam: '',
            checkValue: '',
            interfaceId: '',
            interfaceLevel: ''
          }
        ]
      },
      casenamelist: [],
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      // 详情弹窗
      detailDialogVisible: false,
      // 详情
      caseDetail: [],
      // 添加弹窗
      addDialogVisible: false,
      caseParamExtractChild: [],
      createExtractDialogVisible: false,
      createExtractData: {
        caseparamid: '',
        exeract: '',
        paramName: '',
        targetCaseParamId: ''
      },
      caseParamExeractData: []
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.pageSize = newSize
      this.getListData()
    },
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.pageNumber = newPage
      this.getListData()
    },
    dateFormat: function(row, column) {
      var date = row[column.property]
      if (date === 'undefined' || date === null) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    // 获取列表数据
    getListData() {
      this.$http
        .get(
          '/case/list?tenant_id=1&pageSize=' +
            this.pageSize +
            '&pageNum=' +
            this.pageNumber
        )
        .then(response => {
          // console.log(response.data.data.list)
          this.DataList = response.data.data.list
          this.total = response.data.data.total
        })
        .catch(function(error) {
          // console.log(error)
          this.$message.error('获取列表数据失败' + error)
        })
    },
    // 查看详情
    getDetail(id) {
      this.$http
        .get('/case/paraminfo?caseid=' + id)
        .then(response => {
          // console.log(response.data)
          this.detailDialogVisible = true
          this.caseDetail = response.data.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 添加数据按钮
    addcaseinfo() {
      this.addDialogVisible = true
      // 获取接口名称下拉列表
      this.$http
        .get('/interface/namelist?tenantid=1')
        .then(response => {
          // console.log(response.data.data)
          this.casenamelist = response.data.data
        })
        .catch(error => {
          // console.log('获取接口名称列表失败' + error)
          this.$message.error('获取接口名称列表失败' + error)
        })
    },
    // 提交添加信息
    createcaseinfo() {
      this.$http
        .post('/case/create', this.addData)
        .then(response => {
          // console.log(response.data)
          this.$message.success('添加成功')
          this.addData = {
            caseName: '',
            caseDescription: '',
            level: '',
            list: [
              {
                interfaceName: '',
                extractParam: '',
                checkValue: '',
                interfaceId: '',
                interfaceLevel: ''
              }
            ]
          }
          this.getListData()
          this.addDialogVisible = false
        })
        .catch(error => {
          this.$message.error('添加失败' + error)
        })
    },
    // 增加接口list
    addparams() {
      this.addData.list.push({
        interfaceName: '',
        extractParam: '',
        checkValue: '',
        interfaceId: '',
        interfaceLevel: ''
      })
    },
    // 打开关联参数的新增页面
    createDetail(id) {
      this.createExtractDialogVisible = true
      this.$http
        .get('/case/paraminfo?caseid=' + id)
        .then(response => {
          // console.log(response.data)
          this.caseDetail = response.data.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 添加关联参数
    createcaseExtract() {
      this.$http
        .post(
          '/create/caseparam/extract',
          'caseparamid=' +
            this.createExtractData.caseparamid +
            '&exeract=' +
            this.createExtractData.exeract +
            '&paramName=' +
            this.createExtractData.paramName +
            '&targetCaseParamId=' +
            this.createExtractData.targetCaseParamId
        )
        .then(response => {
          // console.log(response.data)
          this.$message.success('添加成功')
          this.createExtractDialogVisible = false
          this.createExtractData = {
            caseparamid: '',
            exeract: '',
            paramName: '',
            targetCaseParamId: ''
          }
        })
        .catch(error => {
          this.$message.error('添加失败' + error)
          console.log(error)
        })
    },
    // 获取关联参数
    getCaseParamExeract(row, expandedRows) {
      if (expandedRows.length > 0) {
        this.$http
          .get('/case/get/paramExeract?caseParamid=' + row.id)
          .then(response => {
            this.caseParamExeractData = response.data.data
          })
          .catch(error => {
            this.$$message.error('获取关联参数失败' + error)
          })
      }
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
