<template>
  <div class="login-wrap">
    <el-form class="login-form"
             label-position="top"
             label-width="80px"
             :model="formData">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <!--在输入完密码键盘事件，回车的时候去触发登录的方法
        组件，vue有自己的处理方式,想使用dom中的keyup事件，native是告诉组件，我要使用原生的dom操作-->
        <el-input @keyup.enter.native="handleLogin" type="password" v-model="formData.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      return {
        formData: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      //处理登录
      async handleLogin () {
        let response = await this.$http.post('login', this.formData)
        let {meta: {msg, status}} = response.data
        if (status === 200) {
          //登录成功，
          // 提示
          this.$message.success(msg)
          // 获取token存储起来
          let token = response.data.data.token
          window.sessionStorage.setItem('token', token)
          // 跳转后台首页
          this.$router.push('/')
        } else {
          //登录失败
          this.$message.error(msg)
        }
      }

    }
  }
</script>

<!--scope为html5提供的属性，只给当前组件使用，就算有同名的样式也无所谓data-v-xxxx-->
<style scoped>
  .login-wrap {
    background-color: #324152;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-wrap .login-form {
    background-color: #fff;
    width: 400px;
    padding: 30px;
    border-radius: 5px;
  }

  .login-wrap .login-form .btn {
    width: 100%;
  }
</style>
