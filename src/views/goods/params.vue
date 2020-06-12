<template>
    <el-card class="card">
        <my-breadcrumb level1="商品管理" level2="分类参数"></my-breadcrumb>
        <el-alert
                title="注意：只允许为第三级分类设置参数！"
                type="warning"
                left
                show-icon
                :closable="false"
                style="margin-top: 10px;margin-bottom: 10px">
        </el-alert>
        <el-row>
            <el-col :span="24">
                请选择商品分类：
                {{ selectOptions }}
                <el-cascader
                        :show-all-levels="false"
                        placeholder="请选择商品分类"
                        clearable
                        v-model="selectOptions"
                        :options="options"
                        :props="{ label:'cat_name',value:'cat_id',children:'children',expandTrigger: 'hover' }"
                        @change="handleChange">
                </el-cascader>
            </el-col>
        </el-row>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="动态参数" name="many">
                <el-button type="primary" :disabled="disabled">添加动态参数</el-button>
                <el-table
                        border
                        stripe
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            type="expand">
                        <template slot-scope="scope">
                            <el-tag
                                    :key="tag"
                                    v-for="tag in scope.row.params"
                                    closable
                                    :disable-transitions="false"
                                    @close="handleClose(scope.row,tag)"
                            style="margin-left: 5px">
                                {{tag}}
                            </el-tag>
                            <el-input
                                    class="input-new-tag"
                                    v-if="inputVisible"
                                    v-model="inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                            type="index"
                            label="#"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="attr_name"
                            label="商品参数"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" plain
                                       @click="openEditDialog(scope.row)">
                            </el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" plain
                                       @click="deleteUser(scope.row.id)">

                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态参数" name="only">
                <el-button type="primary" :disabled="disabled">添加静态参数</el-button>
                <el-table
                        border
                        stripe
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            type="index"
                            label="#"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="attr_name"
                            label="属性名称"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="attr_vals"
                            label="属性值"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" plain>
                            </el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" plain>

                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </el-card>
</template>

<script>
  export default {
    name: 'params',
    data () {
      return {
        selectOptions: [],
        options: [],
        activeName: 'many',
        tableData: [],
        disabled: true,
        inputVisible: false,
        inputValue: '',

      }
    },
    created () {
      this.loadData()
    },
    methods: {
      async loadData () {
        const response = await this.$http.get('categories?type=3')
        this.options = response.data.data
      },
      //多级下拉框改变
      handleChange () {
        //当选中三级下拉框的值之后，添加动态参数和静态参数可用
        if (this.selectOptions.length === 3) {
          this.disabled = false
          //请求参数获取table数据
          this.loadTableData()
        } else if (this.selectOptions.length === 0) {
          //当清空下拉框的值时，按钮不可点,清空表格
          this.disabled = true
          this.tableData = []
        }
      },
      handleClick (tab, event) {
        // console.log(this.activeName);
        // console.log(tab.index)
        //当选项卡切换时，需要再次请求表格数据
        this.loadTableData()

      },
      //加载表格数据
      async loadTableData () {
        this.tableData = []
        if (this.selectOptions.length === 3) {
          const response = await this.$http.get(`categories/${this.selectOptions[2]}/attributes?sel=${this.activeName}`)
          const {meta: {status, msg}} = response.data
          if (status === 200) {
            this.tableData = response.data.data
            //动态参数给数组新增一个属性params
            if (this.activeName === 'many') {
              this.tableData.map((item) => {
                let arr = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
                this.$set(item, 'params', arr)
              })
            }
          } else {
            this.$message.error(msg)
          }
        }
      },
      //点击删除tag时，删除params的数据
      async handleClose (row, tag) {
        let index = row.params.findIndex((item) => {
          return item === tag
        })
        //删除params当中的值
        row.params.splice(index, 1)
        //发送请求，修改数据库当中的属性
        //需要将属性的新attr_vals重新发送
        const response = await this.$http.put(`categories/${this.selectOptions[2]}/attributes/${row.attr_id}`,
          {
            'attr_vals': row.params.join(','),
            'attr_sel': this.activeName,
            'attr_name': row.attr_name
          })
        const {meta: {status, msg}} = response.data
        if (status === 200) {
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
      },
      //添加tags
      async handleInputConfirm (row) {
        let inputValue = this.inputValue;
        if (!inputValue) {
          return;
        }
        //将文本框的值加入到数组
        row.params.push(inputValue);
        //添加到数据库
        const response=await this.$http.put(`categories/${this.selectOptions[2]}/attributes/${row.attr_id}`,
          {
            'attr_vals': row.params.join(','),
            'attr_sel': this.activeName,
            'attr_name': row.attr_name
          })
        const {meta:{status,msg}}=response.data;
        if (status === 200){
          this.$message.success(msg);
        }else {
          this.$message.error(msg);
        }
        //关闭文本框，清空输入的值
        this.inputVisible = false;
        this.inputValue = '';
      },
      showInput () {
        this.inputVisible = true
        this.$nextTick(() => {
          //将此回调函数延迟到下次dom更新时才去执行。
          //等input打开之后然后去更新
          this.$refs.saveTagInput.$refs.input.focus();
        })
      }
    }
  }
</script>

<style scoped>
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>
