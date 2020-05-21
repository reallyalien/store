<template>
  <el-card class="card">
    <!--面包屑组件  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--搜索-->
    <el-row class="searchRow">
      <el-col span="24">
        <el-input placeholder="请输入内容" class="searchInput">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success">添加用户</el-button>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="180">
      </el-table-column>
      <el-table-column
        label="时间"
        width="180">
        <template slot-scope="scope">
          {{ scope.row.create_time | fmtDate('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="用户状态"
        width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <!--{{scope.row}}：当前行的数据
          {{scope.$index}}:当前行的索引从0开始
            -->
          <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
          <el-button type="success" icon="el-icon-check" size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
  export default {
    data () {
      return {
        tableData: []
      }
    },
    created () {
      this.loadData()
    },
    methods: {
      //发送请求获取用户列表
      //发送请求，需要在请求头当中携带token  Authorization
      async loadData () {
        let response = await this.$http.get('users?pagenum=1&pagesize=10')
        let {meta: {status, msg}} = response.data
        if (status === 200) {
          let {data: {users, total, pagenum}} = response.data
          this.tableData = users
        } else {
          this.$message.error(msg)
        }
      }
    }
  }
</script>

<style scoped>
  .card {
    height: 100%;
  }

  .searchInput {
    width: 300px;
  }

  .searchRow {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
