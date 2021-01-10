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
      <!-- 内容主体区 -->
      <el-form
        :model="UpdatePassword"
        :rules="passwordFormRules"
        ref="passwordFormRef"
      >
        <el-form-item>
          <el-input
            placeholder="请输入旧密码"
            v-model="UpdatePassword.jiupassword"
            show-password
            class="inputWidth"
          ></el-input>
          <el-input
            placeholder="请输入新密码"
            v-model="UpdatePassword.xinpassword"
            show-password
            class="inputWidth"
          ></el-input>
          <el-input
            placeholder="请再次输入新密码"
            v-model="UpdatePassword.xinpassword1"
            show-password
            class="inputWidth"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="passwordInfo">{{ anniu }}</el-button>
      <!-- 底部区 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      number: 2,
      anniu: '提交',
      UpdatePassword: {
        jiupassword: '',
        xinpassword: '',
        xinpassword1: '',
      },
      passwordFormRules: {
        jiupassword: [
          { required: true, $message: '请输入旧密码', trigger: 'blur' },
        ],
        xinpassword: [
          { required: true, $message: '请输入新密码', trigger: 'blur' },
        ],
        xinpassword1: [
          { required: true, $message: '请再次输入新密码', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    passwordInfo() {
      this.number = this.number + 1
    },
  },
}
</script>

<style lang="less" scoped>
.inputWidth {
  width: 350px;
  margin-top: 60px;
}
</style>
