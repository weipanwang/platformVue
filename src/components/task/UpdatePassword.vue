<template >
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/#/UpdatePassword">设置</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-steps
        :active="number"
        finish-status="success"
        simple
        style="margin-top: 20px"
      >
        <el-step title="旧密码"></el-step>
        <el-step title="新密码"></el-step>
        <el-step title="修改成功"></el-step>
      </el-steps>
      <!-- 提示语 -->
      <div
        style="
          text-align: center;
          color: #f00;
          font-size: 10px;
          margin-top: 10px;
        "
      >
        1.密码的长度必须在6-15位之间;2.密码支持英文字母大写、小写、数字、特殊字符'@'、'#'、'+'、'.'、'_'
      </div>
      <!-- 老密码校验 -->
      <el-form
        :model="checkPassword"
        :rules="cheeckPasswordFormRules"
        ref="checkPasswordFormRef"
        class="inputWidth oldPassBox"
      >
        <el-form-item prop="password">
          <el-input
            placeholder="请输入旧密码"
            v-model="checkPassword.password"
            show-password
            class="inputWidth"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 新密码输入 -->
      <el-form
        :model="UpdatePassword"
        :rules="updataPasswordFormRules"
        ref="updataPasswordFormRef"
        class="inputWidth newPassBox"
      >
        <el-form-item prop="newword">
          <el-input
            placeholder="请输入新密码"
            class="inputWidth"
            v-model="UpdatePassword.newword"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="newword1">
          <el-input
            placeholder="请再次输入新密码"
            class="inputWidth"
            v-model="UpdatePassword.newword1"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 确认提交 -->
      <el-button
        style="
          display: block;
          margin: 0 auto;
          margin-top: 60px;
          margin-bottom: 100px;
        "
        type="primary"
        class="newPassBox"
        @click="passwordInfo"
        >{{ anniu }}</el-button
      >
      <!-- 修改成功 -->
      <div class="successBox">修改成功</div>
    </el-card>
  </div>
</template>

<script>
import qs from 'qs'
import $ from 'jquery'
export default {
  data() {
    return {
      number: 1,
      anniu: '下一步',
      UpdatePassword: {
        password: '',
        newword: '',
        newword1: '',
      },
      checkPassword: {
        password: '',
      },
      cheeckPasswordFormRules: {
        password: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 6, max: 15, message: '请输入6~15位的密码', trigger: 'blur' },
          {
            pattern: /^[A-Za-z0-9@#+_.]+$/,
            message: '含有非法字符',
          },
        ],
      },
      updataPasswordFormRules: {
        newword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 15, message: '请输入6~15位的密码', trigger: 'blur' },
          {
            pattern: /^[A-Za-z0-9@#+_.]+$/,
            message: '含有非法字符',
          },
        ],
        newword1: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 15, message: '请输入6~15位的密码', trigger: 'blur' },
          {
            pattern: /^[A-Za-z0-9@#+_.]+$/,
            message: '含有非法字符',
          },
        ],
      },
    }
  },
  methods: {
    passwordInfo() {
      if (this.number === 1) {
        this.$refs.checkPasswordFormRef.validate(async (valid) => {
          if (!valid) return false
          const { data: res } = await this.$http.post(
            '/user/checkpassword',
            qs.stringify(this.checkPassword)
          )
          //console.log(res)
          if (res === true) {
            $('.oldPassBox').hide()
            $('.newPassBox').show()
            this.number = this.number + 1
            this.anniu = '确认提交'
          } else {
            this.$message.error('旧密码错误')
          }
        })
      } else if (this.number === 2) {
        this.UpdatePassword.password = this.checkPassword.password
        this.$refs.updataPasswordFormRef.validate(async (valid) => {
          if (!valid) return false
          const { data: res } = await this.$http.post(
            '/user/updatepassword',
            qs.stringify(this.UpdatePassword)
          )
          //console.log(res)
          if (res.status === 200) {
            this.$message.success('修改成功')
            $('.newPassBox').hide()
            $('.successBox').show()
            this.number = 3
          } else if (res.status === 400) {
            this.$message.error(res.msg)
          }
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.inputWidth {
  width: 350px;
  margin-top: 60px;
  margin: 0 auto;
}
.el-form-item {
  margin-top: 60px;
  text-align: center;
}
.newPassBox {
  display: none;
}
.successBox {
  display: none;
  margin-top: 100px;
  margin-bottom: 200px;
  text-align: center;
  color: rgba(30, 235, 166, 0.808);
  font-size: 30px;
  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
</style>
