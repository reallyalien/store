<template>
    <el-card class="card">
        <!-- 面包屑 -->
        <my-breadcrumb level1="权限管理" level2="角色管理"></my-breadcrumb>
        <!-- 添加按钮-->
        <el-row class="add-row">
            <el-col :span="24">
                <el-button>添加角色</el-button>
            </el-col>
        </el-row>
        <!--表格-->
        <el-table
                v-loading="loading"
                :data="tableData"
                stripe
                border
                style="width: 100%;margin-top: 10px">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <!--一级权限-->
                    <el-row v-for="level1 in scope.row.children" :key="level1.id" class="level1">
                        <el-col :span="4">
                            <!--显示一级权限的名称-->
                            <el-tag closable @close="handleClose(scope.row,level1.id)">
                                {{level1.authName}}
                            </el-tag>
                        </el-col>
                        <el-col :span="20">
                            <!--二级权限-->
                            <el-row v-for="level2 in level1.children" :key="level2.id">
                                <el-col :span="4">
                                    <!--显示二级权限的名称-->
                                    <el-tag closable type="success" @close="handleClose(scope.row,level2.id)">
                                        {{ level2.authName }}
                                    </el-tag>
                                </el-col>
                                <el-col :span="20">
                                    <!--三级权限-->
                                    <el-tag v-for="level3  in level2.children" :key="level3.id" closable type="warning"
                                            class="level3"
                                            @close="handleClose(scope.row,level3.id)">
                                        {{ level3.authName }}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row v-if="scope.row.children.length === 0">
                        <el-col :span="24">没有权限</el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column
                    label="#"
                    type="index"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="roleName"
                    label="角色名称"
                    width="220">
            </el-table-column>
            <el-table-column
                    prop="roleDesc"
                    label="角色描述"
                    width="220">
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <!--{{scope.row}}：当前行的数据
                    {{scope.$index}}:当前行的索引从0开始
                      -->
                    <el-button type="primary" icon="el-icon-edit" size="mini" plain>
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" plain>
                    </el-button>
                    <el-button type="success" icon="el-icon-check" size="mini" plain
                               @click="handleOpenSetRightsDialog(scope.row)">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--点击分配权限，展开-->
        <el-dialog title="权限分配" :visible.sync="setRightsDialogFormVisible">
            <!--树形权限菜单-->
            <el-tree :data="treeData"
                     :props="defaultProps"
                     ref="tree"
                     node-key="id"
                     :default-checked-keys="checkList"
                     show-checkbox default-expand-all>

            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setRightsDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSetRights">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
  export default {
    name: 'roles',
    data () {
      return {
        tableData: [],
        loading: true,
        //分配权限页面的展示与隐藏
        setRightsDialogFormVisible: false,
        //绑tree的数据
        treeData: [],
        defaultProps: {
          //设置树节点显示属性
          label: 'authName',
          //设置树的子节点的属性
          children: 'children'
        },
        //树中默认选中的节点的key
        checkList: [],
        //点击分配权限按钮，记录id
        currentRoleId:'-1'
      }
    },
    created () {
      this.loadData()
    },
    methods: {
      async loadData () {
        const response = await this.$http.get('roles')
        const {meta: {status, msg}} = response.data
        if (status === 200) {
          this.tableData = response.data.data
          this.loading = false
        } else {
          this.$message.error(msg)
        }
      },
      //点击tag的删除按钮，删除当前角色的权限
      async handleClose (role, levelId) {
        const response = await this.$http.delete(`roles/${role.id}/rights/${levelId}`)
        const {meta: {status, msg}} = response.data
        if (status === 200) {
          this.$message.success(msg)
          //重新加载当前角色对应的权限
          role.children = response.data.data
        } else {
          this.$message.error(msg)
        }
      },
      //点击分配选项的按钮，打开对话框
      async handleOpenSetRightsDialog (role) {
        //打开对话框
        this.setRightsDialogFormVisible = true
        this.currentRoleId=role.id;
        //发送请求
        const response = await this.$http.get('rights/tree ')
        this.treeData = response.data.data
        //设置当前角色的权限id存储
        //先清空结束
        this.checkList = []
        role.children.forEach((level1) => {
          level1.children.forEach((level2) => {
            level2.children.forEach((level3) => {
              this.checkList.push(level3.id)
            })
          })
        })
      },
      //点击确定按钮，分配权限
      async handleSetRights(){
        //点击分配权限按钮，获取roleId
        //权限的id列表
        let checkedKeys = this.$refs.tree.getCheckedKeys();
        let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
        // let ks = checkedKeys.concat(halfCheckedKeys);
        let arr=[...checkedKeys,...halfCheckedKeys];
        const response=await this.$http.post(`roles/${this.currentRoleId}/rights`,
          {rids:arr.join(',')});
        const {meta:{status,msg}}=response.data;
        if (status === 200){
          this.$message.success(msg);
          this.setRightsDialogFormVisible=false;
          //更新表格数据
          this.loadData();
        }else {
          this.$message.error(msg);
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

    .add-row {
        margin-bottom: 10px;
        margin-top: 10px;
    }

    .level3 {
        margin-right: 5px;
        margin-bottom: 5px;
    }

    .level1 {
        margin-bottom: 10px;
    }
</style>
