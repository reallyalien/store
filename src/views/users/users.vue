<template>
    <el-card class="card">
        <!--面包屑组件  -->
        <my-breadcrumb level1="用户管理" level2="用户列表"></my-breadcrumb>
        <!--搜索-->
        <el-row class="searchRow">
            <el-col :span="24">
                <el-input placeholder="请输入内容" v-model="searchValue" class="searchInput" clearable>
                    <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                </el-input>
                <el-button type="primary" @click="clearData">添加</el-button>
            </el-col>
        </el-row>
        <!--表格-->
        <el-table
                :data="tableData"
                stripe
                border
                style="width: 100%">
            <el-table-column
                    label="#"
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
                            inactive-color="#ff4949"
                            @change="handleChange(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <!--{{scope.row}}：当前行的数据
                    {{scope.$index}}:当前行的索引从0开始
                      -->
                    <el-button type="primary" icon="el-icon-edit" size="mini" plain
                               @click="openEditDialog(scope.row)">
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" plain
                               @click="deleteUser(scope.row.id)">

                    </el-button>
                    <el-button type="success" icon="el-icon-check" size="mini" plain
                               @click="handleOpenSetRoleDialog(scope.row)">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <!--page-size:每页显示条目个数，支持 .sync修饰符
        -->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagenum"
                :page-sizes="[ 5, 10, 20]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count">
        </el-pagination>
        <!--添加用户的对话框-->
        <el-dialog title="添加用户" :visible.sync="addUserDialogFormVisible">
            <el-form :model="form" label-width="80px" :rules="rules" ref="ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="form.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addUserDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAdd('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!--编辑用户的对话框-->
        <el-dialog title="编辑用户" :visible.sync="editUserDialogFormVisible">
            <el-form :model="form" label-width="80px" ref="editForm">
                <!--prop属性用来校验表单-->
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="form.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editUserDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleEdit(form.id)">确 定</el-button>
            </div>
        </el-dialog>
        <!--分配角色的对话框-->
        <el-dialog title="分配角色" :visible.sync="setRoleDialogFormVisible">
            <el-form label-width="90px">
                <el-form-item label="用户名">
                    {{ currentName }}
                </el-form-item>
                <el-form-item label="请选择角色">
                    <el-select v-model="currentRoleId">
                        <el-option label="请选择" :value="-1" disabled></el-option>
                        <el-option v-for="item in roles"
                                   :key="item.id"
                                   :label="item.roleName"
                                   :value="item.id">

                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSetRole()">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
  export default {
    data () {
      return {
        tableData: [],
        //分页参数
        pagenum: 1,
        pagesize: 5,
        count: 10,
        //搜索框绑定参数
        searchValue: '',
        //添加用户的对话框显示与隐藏
        addUserDialogFormVisible: false,
        //编辑用户对话框的显示已隐藏
        editUserDialogFormVisible: false,
        //分配角色的对话框的显示与隐藏
        setRoleDialogFormVisible: false,
        //分配角色需要的数据
        currentName: '',
        currentUserId: -1,
        //绑定下拉框
        currentRoleId: -1,
        //角色列表
        roles: [],
        //表单数据
        form: {
          id: '',
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        //表单验证规则
        rules: {
          username: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    created () {
      this.loadData(this.pagenum, this.pagesize)
    },
    methods: {
      //发送请求获取用户列表
      //发送请求，需要在请求头当中携带token  Authorization
      async loadData (pagenum, pagesize) {
        let response = await this.$http.get(`users?pagenum=${pagenum}&pagesize=${pagesize}&query=${this.searchValue}`)
        let {meta: {status, msg}} = response.data
        if (status === 200) {
          let {data: {users, total, pagenum}} = response.data
          this.tableData = users
          //填充分页参数
          this.count = total
        } else {
          this.$message.error(msg)
        }
      },
      //分页相关
      handleSizeChange (size) {
        // console.log(size);
        this.loadData(this.pagenum, size)
      },
      handleCurrentChange (num) {
        // console.log(num);
        this.loadData(num, this.pagesize)
      },
      //搜索
      handleSearch () {
        this.loadData(this.pagenum, this.pagesize)
      },
      // handleClose (done) {
      //   this.$confirm('确认关闭？')
      //     .then(_ => {
      //       done()
      //       this.addUserDialogFormVisible = false
      //     })
      //     .catch(_ => {
      //     })
      // },
      //点击添加清空form
      clearData () {
        this.form = {}
        //打开对话框
        this.addUserDialogFormVisible = true
      },
      //添加用户
      async handleAdd (ruleForm) {
        //表单验证
        this.$refs[ruleForm].validate(async (valid) => {
          if (valid) {
            const response = await this.$http.post('users', this.form)
            let {meta: {msg, status}} = response.data
            if (status === 201) {
              this.$message.success(msg)
              //关闭对话框
              this.addUserDialogFormVisible = false
              //重新加载数据
              this.loadData(this.pagenum, this.pagesize)
              //清空文本框
              // this.$refs[ruleForm].resetFields();
            } else {
              this.$message.error(msg)
            }
          } else {
            this.$message.warning('表单验证失败')
            return false
          }
        })
      },
      //打开编辑用户的对话框
      openEditDialog (value) {
        this.form = value
        this.editUserDialogFormVisible = true
      },
      //编辑用户的确定
      async handleEdit (id) {
        const response = await this.$http.put(`users/${id}`,
          {
            email: this.form.email,
            mobile: this.form.mobile
          })
        //判断是否成功
        const {meta: {status, msg}} = response.data
        if (status === 200) {
          this.$message.success(msg)
          this.editUserDialogFormVisible = false
          // //重置表单
          // this.$refs.editForm.resetFields();
        } else {
          this.$message.error(msg)
        }
      },
      //删除用户
      async deleteUser (id) {
        this.$confirm('是否删除该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          //点击确定按钮
          const response = await this.$http.delete(`users/${id}`);
          //判断删除是否成功
          const {meta:{status,msg}}=response.data;
          if (status === 200){
            this.$message.success(msg);
            this.loadData(this.pagenum, this.pagesize)
          }else {
            this.$message.error(msg);
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      //改变用户状态
      async handleChange (obj) {
        let {id, mg_state} = obj
        let response = await this.$http.put(`users/${id}/state/${mg_state}`)
        let {meta: {msg, status}} = response.data
        if (status === 200) {
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
      },
      //打开角色对话框
      async handleOpenSetRoleDialog (value) {
        this.setRoleDialogFormVisible = true
        this.currentName = value.username
        this.currentUserId = value.id
        //显示角色列表
        const response = await this.$http.get('roles')
        this.roles = response.data.data
        //角色id
        const userResponse = await this.$http.get(`users/${value.id}`)
        this.currentRoleId = userResponse.data.data.rid

      },
      //角色确定按钮，给用户添加角色
      async handleSetRole () {
        const response = await this.$http.put(`users/${this.currentUserId}/role`, {rid: this.currentRoleId})
        //判断请求是否成功
        const {meta: {status, msg}} = response.data
        if (status === 200) {
          this.$message.success(msg)
          this.setRoleDialogFormVisible = false
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
