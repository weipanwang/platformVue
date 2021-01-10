<template>
  <div>
    <!-- 卡片视图区域 -->
    <el-card>
      <div style="display: flex">
        <div style="width: 100px">
          <!-- 下载 -->
          <el-button type="success" size="small" @click="download()"
            >下载模板</el-button
          >
        </div>
        <div>
          <!-- 上传  -->
          <el-upload
            class="upload"
            :limit="1"
            accept=".xlsx,.xls"
            :http-request="modeUpload"
            :before-upload="beforeUpload"
            action="123"
            :file-list="fileList"
          >
            <el-button size="small" type="primary"
              >点击上传<i class="el-icon-upload el-icon--right"></i
            ></el-button>
            <div slot="tip" class="el-upload__tip">(只能上传.xlsx文件)</div>
          </el-upload>
        </div>
      </div>
      <!-- 列表 -->
      <template>
        <el-table :data="DataList" style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="taskname" label="名称"> </el-table-column>
          <el-table-column
            prop="createdate"
            :formatter="dateFormat"
            label="创建时间"
          >
          </el-table-column>
          <el-table-column
            prop="updatedate"
            :formatter="dateFormat"
            label="最后执行时间"
          >
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                :disabled="isDisabled === 1"
                @click="doRequest(scope.row.id)"
                size="mini"
                >执行</el-button
              >
              <el-button
                type="success"
                v-if="scope.row.updatedate !== null"
                @click="getResultInfo(scope.row.id)"
                size="mini"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      fileList: [],
      DataList: [],
      isDisabled: '1',
    }
  },
  methods: {
    download() {
      window.open('/test/download')
    },
    getExcelList() {
      this.$http1
        .get('/getExcelList')
        .then((res) => {
          this.DataList = res.data.data
        })
        .catch((error) => {
          this.$message.error('查询失败' + error)
        })
    },
    dateFormat: function (row, column) {
      var date = row[column.property]
      if (date === 'undefined' || date === null) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    // 通过组件钩子上传文件
    beforeUpload(files) {
      //console.log(files);
      let formdata = new FormData()
      formdata.append('file', files)
      this.$http1
        .post('/upload/', formdata)
        .then((response) => {
          console.log(response.data)
          if (response.data.status === 200) {
            this.$message.success('上传成功')
            this.getExcelList()
            this.fileList = []
          } else if (response.data.status === 400) {
            this.fileList = []
            this.$message.error(response.data.msg)
          }
        })
        .catch((error) => {
          this.$message.error('上传失败' + error)
        })
    },
    //限制上传文件的大小
    modeUpload(item) {
      const file = item.file
      const size = file.size / 1024 / 1024
      if (size > 1) {
        this.$message.error('大小必须小于1M')
        this.fileList = []
        return
      }
    },
    getResultInfo(id) {
      this.$message.success(id + '')
    },
    doRequest(id) {
      this.$message.success(id + '')
      this.isDisabled = 0
    },
  },
  created() {
    this.getExcelList()
  },
  filters: {
    showDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
  },
}
</script>

<style lang="less" scoped></style>
