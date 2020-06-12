<template>
    <el-card class="card">
        <!--面包屑-->
        <my-breadcrumb level1="商品管理" level2="分类列表"></my-breadcrumb>
        <!--添加按钮-->
        <el-row class="row">
            <el-col>
                <el-button type="primary" @click="handleOpenAddDialog">添加分类</el-button>
            </el-col>
        </el-row>
        <!--表格-->
        <!--使用element-ui的表格属性也可以实现-->
        <el-table
                v-loading="loading"
                :data="tableData"
                stripe
                border
                style="width: 100%"
        row-key="cat_id"
        :tree-props="{children: 'children',hasChildren: 'hasChildren'}">
            <!--标签名与组件名称一致-->
<!--            <el-table-tree-column-->
<!--                    file-icon="icon icon-file"-->
<!--                    folder-icon="icon icon-folder"-->
<!--                    prop="cat_name"-->
<!--                    label="分类名称"-->
<!--                    width="400"-->
<!--                    treeKey="cat_id"-->
<!--                    parentKey="cat_pid"-->
<!--                    levelKey="cat_level"-->
<!--                    childKey="children">-->

<!--            </el-table-tree-column>-->
            <el-table-column
                label="分类名称"
            prop="cat_name"
            width="300px">

            </el-table-column>
            <el-table-column
                    label="级别"
                    width="150">
                <template slot-scope="scope">
                    <span v-if="scope.row.cat_level =='0'">一级</span>
                    <span v-else-if="scope.row.cat_level =='1'">二级</span>
                    <span v-else-if="scope.row.cat_level =='2'">三级</span>
                </template>
            </el-table-column>
            <!--布尔类型默认不显示，需要额外处理-->
            <el-table-column
                    prop="cat_deleted"
                    label="是否有效"
                    width="180">
                <template slot-scope="scope">
                    {{ scope.row.cat_deleted ? '无效':'有效' }}
                </template>
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <!--{{scope.row}}：当前行的数据
                    {{scope.$index}}:当前行的索引从0开始
                      -->
                    <el-button type="primary" icon="el-icon-edit" size="mini" plain
                               @click="handleEditDialog(scope.row)">
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" plain
                               @click="handleDelete(scope.row.cat_id)">

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
        <!--商品分类的弹出框展示-->
        <el-dialog title="添加商品分类" :visible.sync="setCategoriedDialogFormVisible">
            <el-form :model="form" label-width="100px">
                <el-form-item label="分类名称">
                    <el-input v-model="form.cat_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="分类列表">
                    <!--change-on-select允许选择任意一级选项
                        props:设置下拉框中显示数据源的哪个属性的值-->
                    {{ catIds }}
                    <el-cascader
                            placeholder="默认选择一级分类"
                            clearable
                            change-on-select
                            v-model="catIds"
                            expand-trigger="hover"
                            :options="options"
                            :props="defaultProps"
                    >

                    </el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setCategoriedDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAdd">确 定</el-button>
            </div>
        </el-dialog>
        <!--编辑商品分类的弹出框展示-->
        <el-dialog title="编辑商品分类" :visible.sync="editCategoriedDialogFormVisible">
            <el-form :model="form" label-width="100px">
                <el-form-item label="分类名称">
                    <el-input v-model="form.cat_name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editCategoriedDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleEdit">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
  //导入 element-tree-grid
  import ElementTreeGrid from 'element-tree-grid'
  //局部组件

  export default {
    name: 'categories',
    components: {
      'el-table-tree-column': ElementTreeGrid
    },
    data () {
      return {
        tableData: [],
        //分页数据
        pagesize: 5,
        pagenum: 1,
        count: 0,
        loading: true,
        //添加商品分类的弹出框
        setCategoriedDialogFormVisible: false,
        form: {
          cat_name: '',
          cat_pid: '-1',
          cat_level: '-1',
          cat_id: '-1'
        },
        //绑定多级下拉选项框
        options: [],
        defaultProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        //级联下拉框绑定的多级下拉选项
        catIds: [],
        //编辑商品分类弹框的显示与隐藏
        editCategoriedDialogFormVisible: false
      }
    },
    created () {
      this.loadData()
    },
    methods: {
      async loadData () {
        //点击分页之前先去加载
        this.loading = true
        const response = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
        const {meta: {status, msg}} = response.data
        if (status === 200) {
          this.tableData = response.data.data.result
          this.count = response.data.data.total
          this.loading = false//加载结束
        } else {
          this.$message.error(msg)
        }
      },
      //  分页方法
      handleSizeChange (size) {
        this.pagesize = size
        this.loadData()
      },
      handleCurrentChange (num) {
        this.pagenum = num
        this.loadData()
      },
      //点击添加分类的时候
      async handleOpenAddDialog () {
        this.setCategoriedDialogFormVisible = true
        const response = await this.$http.get('categories?type=2')
        this.options = response.data.data
      },
      //添加分类
      async handleAdd () {
        //cat_name
        //cat_pid    一级分类 0  二级分类 一级分类的id
        //cat_level  一级分类 0  二级分类 1  三级分类 2
        //this.catIds绑定的多级数据
        //this.catIds.length === 0  要添加的是一级分类
        //this.catIds.length === 1  要添加的是二级分类
        //this.catIds.length === 2  要添加的是三级分类
        //设置级别level，三级分类level是2
        this.form.cat_level = this.catIds.length
        //设置所要添加分类的父id
        if (this.catIds.length === 0) {
          this.form.cat_pid = 0
        } else if (this.catIds.length === 1) {
          this.form.cat_pid = this.catIds[0]
        } else {
          this.form.cat_pid = this.catIds[1]
        }
        const response = await this.$http.post('categories', this.form)
        const {meta: {status, msg}} = response.data
        if (status === 201) {
          this.setCategoriedDialogFormVisible = false
          this.$message.success(msg)
          this.loadData()
        } else {
          this.$message.error(msg)
        }
      },
      //点击删除分类
      handleDelete (id) {
        this.$confirm('是否删除该分类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          //点击确定按钮
          const response = await this.$http.delete(`categories/${id}`)
          const {meta: {status, msg}} = response.data
          if (status === 200) {
            this.$message.success(msg)
            this.loadData()
          } else {
            this.$message.error(msg)
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      //点击编辑按钮
      handleEditDialog (category) {
        this.editCategoriedDialogFormVisible = true
        this.form = category//记录名称和id
      },
      //点击确定按钮，更新数据
      async handleEdit () {
        const response = await this.$http.put(`categories/${this.form.cat_id}`, {
          cat_name: this.form.cat_name
        })
        const {meta: {status, msg}} = response.data
        if (status === 200) {
          this.$message.success(msg)
          this.editCategoriedDialogFormVisible = false
          this.loadData()
        } else {
          this.$message.error(msg)
        }

      },
      adddd();
    }
  }
</script>

<style scoped>
    .row {
        margin-bottom: 10px;
        margin-top: 10px;
    }
</style>
