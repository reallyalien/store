<template>
  <el-container class="container">
    <!--    header-->
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <img src="../assets/logo.png" alt="" id="img">
        </el-col>
        <el-col :span="19">
          <div class="title">电商后台管理系统</div>
        </el-col>
        <el-col :span="1">
          <div class="logout">
            <a href="#" @click.prevent="handleLogout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <!--      侧边栏-->
      <!-- default-active 可以让某一项高亮选中，但必须是menu-item的index的属性值
      unique-opened :默认之展开一项
      router:开启路由模式，以index作为路由地址
        -->
      <el-aside width="200px" class="aside">
        <el-menu
          style="height: 100%"
          unique-opened
          router
          default-active="/users"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/users">
              <i class="el-icon-menu"></i>
              用户列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="/roles">
              <i class="el-icon-menu"></i>
              角色列表
            </el-menu-item>
            <el-menu-item index="/rights">
              <i class="el-icon-menu"></i>
              权限列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-menu"></i>
              商品列表
            </el-menu-item>
            <el-menu-item index="3-2">
              <i class="el-icon-menu"></i>
              分类参数
            </el-menu-item>
            <el-menu-item index="3-3">
              <i class="el-icon-menu"></i>
              商品分类
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="4-1">
              <i class="el-icon-menu"></i>
              订单列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="5-1">
              <i class="el-icon-menu"></i>
              数据报表
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    beforeCreate() {
      let token = window.sessionStorage.getItem('token');
      if (!token){
        //没有token，需要登录
        this.$message.warning('请先登录');
        this.$router.push('/login');
      }
    },
    methods:{
      //退出
      handleLogout(){
        this.$message.success('退出成功');
        window.sessionStorage.removeItem("token");
        // window.sessionStorage.clear();
        this.$router.push('/login');
      }
    }
  }
</script>

<style scoped>
  .container {
    height: 100%;
  }

  .header {
    background-color: #b3c0d1;
    padding: 0;
  }

  .aside {
    background-color: #d3dce6;
  }

  .main {
    background-color: #e9eef3;
  }

  #img {
    position: relative;
    left: 0px;
    bottom: 2px;
  }

  .header .title {
    text-align: center;
    font-size: 24px;
    color: #e9eef3;
    line-height: 60px;
  }

  .header .logout {
    line-height: 60px;
  }

  .header .logout a {
    color: coral;
    text-decoration: none;
  }
</style>
