<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <!-- <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div> -->
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :rules="loginFormRules"
        :model="loginForm"
        label-width="0"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont iconmima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 验证码输入框 -->
        <el-form-item class="verification" prop="captcha">
          <el-input
            style="width: 65%; float: left"
            prefix-icon="el-icon-copy-document"
            v-model="loginForm.captcha"
          ></el-input>
          <img
            style="float: right"
            :src="imgCode"
            title="点击图片切换验证码"
            @click="getVerification"
          />
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="restLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单
      loginForm: {
        username: '',
        password: '',
        captcha: '',
      },
      // 验证规则
      loginFormRules: {
        username: [
          { min: 3, max: 11, message: '请输入手机号码', trigger: 'blur' },
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '请输入6~15位的密码', trigger: 'blur' },
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '请输入4位的密码', trigger: 'blur' },
        ],
      },
      imgCode: '/api/user/verification', // 验证码图片
    }
  },
  methods: {
    restLoginForm() {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.post(
          '/user/login?username=' +
            this.loginForm.username +
            '&password=' +
            this.loginForm.password +
            '&captcha=' +
            this.loginForm.captcha
        )
        // const { data: res } = await this.$http.post('/user/login', formData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: '*/*' } })
        // console.log(res)
        if (res.status !== 200) this.getVerification()
        if (res.status !== 200) return this.$message.error(res.msg)
        this.$message.success('登录成功')
        // window.sessionStorage.setItem('token', res.data)
        this.$router.push('/home')
      })
    },
    getVerification() {
      this.imgCode = '/api/user/verification?t=' + new Date().getTime()
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  // background-color: #2b4b6b;
  background: url('../assets/loginbanner.jpg') no-repeat 100%;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 68%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.verification {
  width: 100%;
}
</style>
