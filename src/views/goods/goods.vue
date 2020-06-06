<template>
    <el-card class="card">
        <!--面包屑-->
        <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
        <!--搜索-->
        <el-row class="searchRow">
            <el-col :span="24">
                <el-input placeholder="请输入内容" v-model="searchInput" class="searchInput" clearable style="width: 300px">
                    <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                </el-input>
                <el-button type="primary" @click="$router.push('goods/add')">添加商品</el-button>
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
                    prop="goods_name"
                    label="商品名称"
                    width="400">
            </el-table-column>
            <el-table-column
                    prop="goods_price"
                    label="商品价格(元)"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="goods_weight"
                    label="商品重量"
                    width="150">
            </el-table-column>
            <el-table-column
                    label="创建时间"
                    width="180">
                <template slot-scope="scope">
                    {{ scope.row.add_time | fmtDate('YYYY-MM-DD') }}
                </template>
            </el-table-column>

            <el-table-column
                    label="操作"
            >
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
    </el-card>
</template>

<script>
  export default {
    name: 'goods',
    data(){
      return {
        tableData:[],
        pagenum:1,
        pagesize:10,
        count:0,
        //搜索
        searchInput:''

      }
    },
    created () {
      this.loadData();
    },
    methods:{
      async loadData(){
        const response=await this.$http.get(`goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchInput}`);
        const {meta:{status,msg}}=response.data;
        if (status === 200){
         this.tableData=response.data.data.goods;
         this.count=response.data.data.total;
        }else {
          this.$message.error(msg);
        }
      },
      //搜索
      async handleSearch(){
        this.loadData();
      },
      //分页方法
      handleSizeChange(size){
        this.pagesize=size;
        this.loadData();
      },
      handleCurrentChange(num){
        this.pagenum=num;
        this.loadData();
      }

    }
  }
</script>

<style scoped>
    .searchRow {
        margin-top: 10px;
        margin-bottom: 10px;
    }
</style>
