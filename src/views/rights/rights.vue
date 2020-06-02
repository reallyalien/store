<template>
    <el-card class="card">
        <!--面包屑组件-->
        <my-breadcrumb level1="权限管理" level2="权限列表"></my-breadcrumb>
        <!--表格-->
        <el-table
                :data="tableData"
                stripe
                border
                style="width: 100%;margin-top: 10px">
            <el-table-column
                    label="#"
                    type="index"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="authName"
                    label="权限名称"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="path"
                    label="路径"
                    width="180">
            </el-table-column>
            <el-table-column
                    label="层级"
                    width="180">
                <template slot-scope="scope">
                    <span v-if="scope.row.level === '0'">一级</span>
                    <span v-else-if="scope.row.level === '1'">二级</span>
                    <span v-else-if="scope.row.level === '2'">三级</span>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
  export default {
    name: 'rights',
    data () {
      return {
        tableData: []
      }
    },
    created () {
      //组件创建完毕，发送请求
      this.loadData()
    },
    methods: {
      async loadData () {
        const response = await this.$http.get('rights/list')
        const {meta: {status, msg}} = response.data
        if (status === 200) {
          this.tableData = response.data.data
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
        overflow: auto;
    }
</style>
