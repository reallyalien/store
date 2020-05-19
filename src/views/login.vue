<template>
  <div class="login-wrap">
    <el-form class="login-form"
             label-position="top"
             :model="formData">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="formData.password"></el-input>
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
      handleLogin () {
        this.$http.post('login', this.formData)
          .then((response) => {
            /*
             *{
                "data": {
                    "id": 500,
                    "rid": 30,
                    "username": "admin",
                    "mobile": "12345678",
                    "email": "adsfad@qq.com",
                    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUwMCwicmlkIjozMCwiaWF0IjoxNTg5ODkzNDkyLCJleHAiOjE1ODk5Nzk4OTJ9.I4QzuG-9msk4rFUam14Qy09JyvCHQNIlz6dkXekTveE"
                },
                "meta": {
                    "msg": "登录成功",
                    "status": 200
                }
              }
             */
            let status = response.data.meta.status;
            let msg = response.data.meta.msg;
            if (status === 200){
              //登录成功，
              // 提示
              this.$message.success(msg);
              // 获取token存储起来
              let token=response.data.data.token;
              window.sessionStorage.setItem("token",token);
              // 跳转后台首页

            }else{
              //登录失败
              this.$message.error(msg);
            }
          })
          .catch((error) => {
            console.log(error)
          })
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
