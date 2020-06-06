<template>
    <el-card class="card">
        <my-breadcrumb level1="订单管理" level2="订单列表"></my-breadcrumb>
        <el-table
                v-loading="loading"
                :data="tableData"
                stripe
                border
                style="width: 100%;margin-top: 10px;margin-bottom: 10px">
            <el-table-column
                    type="index"
                    label="#"
                    width="60">
            </el-table-column>
            <el-table-column
                    prop="order_number"
                    label="订单编号"
                    width="250">
            </el-table-column>
            <el-table-column
                    prop="order_price"
                    label="订单价格"
                    width="80">
            </el-table-column>
            <!--布尔类型默认不显示，需要额外处理-->
            <el-table-column
                    label="是否付款"
                    width="80">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.order_pay === 1">已付款</el-tag>
                    <el-tag v-else type="danger">未付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    prop="is_send"
                    label="是否发货"
                    width="80">
            </el-table-column>
            <el-table-column
                    label="下单时间"
                    width="180">
                <template slot-scope="scope">
                    {{ scope.row.create_time | fmtDate('YYYY-MM-DD HH:mm:ss')}}
                </template>
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <!--{{scope.row}}：当前行的数据
                    {{scope.$index}}:当前行的索引从0开始
                      -->
                    <el-button type="primary" icon="el-icon-edit" size="mini" plain
                               @click="openDialog">
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
                :page-sizes="[ 10, 20, 50]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count">
        </el-pagination>
        <!--编辑对话框-->
        <el-dialog title="修改订单地址" :visible.sync="editDialogFormVisible">
            <el-form :model="form" label-width="80px" ref="editForm">
                <el-form-item label="省市区/县">
                    {{ form.region }}
                    <el-cascader
                            placeholder="请选择"
                            clearable
                            v-model="form.region"
                            :options="options"
                            :props="{ label:'label',value:'value',children:'children',expandTrigger: 'hover' }"
                            @change="handleChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input v-model="form.address" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogFormVisible = false">取 消</el-button>
                <el-button type="primary">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
  import data from './city_data2017_element'

  export default {
    name: 'orders',
    data () {
      return {
        tableData: [],
        loading: true,
        pagenum: 1,
        pagesize: 10,
        count: 0,
        editDialogFormVisible: false,
        form: {
          address: '',
          region: ''
        },
        options: []
      }
    },
    created () {
      this.loadData()
    },
    methods: {
      async loadData () {
        const response = await this.$http.get(`orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
        const {meta: {status, msg}} = response.data
        if (status === 200) {
          this.tableData = response.data.data.goods
          this.count = response.data.data.total
          this.loading = false
        } else {
          this.$message.error(msg)
        }
      },
      handleSizeChange (size) {
        this.pagesize = size
        this.loadData()
      },
      handleCurrentChange (num) {
        this.pagenum = num
        this.loadData()
      },
      openDialog () {
        //加载省市信息
        this.editDialogFormVisible = true;
        this.options=data;
      },
      //多级下拉框改变时
      handleChange () {

      },
    }
  }
</script>

<style scoped>

</style>
