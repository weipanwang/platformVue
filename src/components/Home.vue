<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src alt />
        <span>后台管理</span>
      </div>
      <el-button type="info" size="mini" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 左侧边栏 -->
      <el-aside width="200px">
        <!-- :default-active="activePath" 这个是个bug以后再修复 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :router="true"
          unique-opened
          :default-openeds="openeds"
        >
          <!-- 一级菜单 -->
          <el-submenu  
            v-for="item in menulist"
            :index="item.id+''"
            :key="item.id"
            @click.native="getMenu(item.id)"
          >
            <!-- 一级菜单的模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.text}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+item.path"
              v-for="item in menu"
              :key="item.id"
              @click="saveNavState('/'+item.path)"
            >
              <!-- 二级菜单的模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{item.text}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      menu: [],
      iconsObj: {
        2: 'iconfont iconshouye',
        3: 'iconfont iconshijian',
        10: 'iconfont iconshoucang',
        30: 'iconfont iconshezhi'
      },
      activePath: 'Welcome',
      openeds: ['3'],
      temp: '',
      temp1: '',
    }
  },
  created() {
    this.temp1 = window.sessionStorage.getItem('activePath')
    if (this.temp1 !== null) {
      // console.log('temp1=' + this.temp1)
      this.activePath = this.temp1
    }
    this.temp = window.sessionStorage.getItem('itemid')
    if (this.temp !== null) {
      // console.log('temp=' + this.temp)
      this.openeds = []
      this.openeds.push(this.temp)
    }
    this.getMenuList()
    this.getMenu(this.openeds)
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get(
        '/menu/category/get?parentId=1'
      )
      // console.log(res.data)
      if (res.status !== 200) return this.$message.error(res.msg)
      this.menulist = res.data 
      // this.getMenu(res.data[2].id)
      // console.log(this.menulist)
      // console.log(this.menulist[0].path, typeof this.menulist[0].path)
    },
    async getMenu(id) {
      window.sessionStorage.setItem('itemid', id)
      const { data: res } = await this.$http.get(
        '/menu/category/get?parentId=' + id
      )
      // console.log(res.data)
      if (res.status !== 200) return this.$message.error(res.msg)
      this.menu = res.data
      // console.log(this.menu)
    },
    // 保存连接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 16px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 25px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
</style>
