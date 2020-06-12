<template>
    <el-card class="card">
        <!--面包屑-->
        <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
        <!---->
        <el-alert
                title="添加商品信息"
                type="info"
                center
                show-icon
                :closable="false"
                style="margin-top: 10px;margin-bottom: 10px">
        </el-alert>
        <!--步骤条-->
        <el-steps :active="active" finish-status="success" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
        </el-steps>
        <!--选项卡tab-->
        <el-form label-width="100" v-model="form" label-position="top">
            <el-tabs :tab-position="tabPosition" style="margin-top: 20px" @tab-click="handleClick">
                <el-tab-pane label="基本信息">
                    <el-form-item label="商品名称">
                        <el-input v-model="form.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格">
                        <el-input v-model="form.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量">
                        <el-input v-model="form.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <el-input v-model="form.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        {{ selectOptions }}
                        <el-cascader
                                placeholder="请选择商品分类"
                                clearable
                                v-model="selectOptions"
                                :options="options"
                                :props="{ label:'cat_name',value:'cat_id',children:'children',expandTrigger: 'hover' }"
                                @change="handleChange">
                        </el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数">
                    <el-form-item
                            v-for="item in dynamicParams"
                            :key="item.attr_id"
                            :label="item.attr_name">
                        {{ item.params }}
                        <el-checkbox-group v-model="item.params">
                            <el-checkbox v-for="param in item.params"
                                         :key="param"
                                         :label="param"
                                         border>

                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性">
                    <el-form-item
                            v-for="item in staticParams"
                            :key="item.attr_id"
                            :label="item.attr_name"
                    >
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片">
                    <!--action:上传路径-->
                    <el-upload
                            class="upload-demo"
                            action="http://localhost:8888/api/private/v1/upload"
                            :headers="headers"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容">
                    <el-button type="primary" style="margin-bottom: 5px" @click="addGoods">添加商品</el-button>
                    <quill-editor
                            ref="myQuillEditor"
                            v-model="form.goods_introduce"
                    />
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </el-card>
</template>

<script>
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';

  import {  quillEditor } from 'vue-quill-editor';

  export default {
    //局部组件
    components:{
      quillEditor
    },
    name: 'goodsAdd',
    data () {
      return {
        active: 0,
        tabPosition: 'left',
        form: {
          //基本信息
          goods_name: '',
          goods_number: '',
          //1，2，3
          goods_cat: '',
          goods_price: '',
          goods_weight: '',
          pics:[],
          goods_introduce:'',
          attrs:[]
        },
        //多级下拉框绑定的数据
        selectOptions: [],
        options: [],
        //商品参数页面
        checkList: [],
        //动态参数
        dynamicParams: [],
        //静态参数
        staticParams: [],
        //绑定上传图片的请求头
        headers: {
          'Authorization': sessionStorage.getItem('token')
        }
      }
    },
    created () {
      this.loadOptions()
    },
    methods: {
      handleClick (tab, event) {
        //tab是当前点击的组件 index="0"
        // console.log(tab,event);
        this.active = parseInt(tab.index)
        //判断当前点击的tab是否是商品属性或者商品参数
        if (tab.index === '1' || tab.index === '2') {
          if (this.selectOptions.length !== 3) {
            this.$message.error('请先选择分类')
          } else {
            //加载商品分类的列表
            this.loadParams(tab.index)
          }
        }
      },
      //多级下拉框选项改变时,执行
      handleChange () {
        //只能选择3级分类数据
        // console.log(this.selectOptions);
        if (this.selectOptions.length !== 3) {
          this.selectOptions.length = 0
          //清空下拉框的内容
          this.$message.warning('请选择三级分类')
        }
      },
      //加载多级下拉框的数据
      async loadOptions () {
        const response = await this.$http.get('categories?type=3')
        this.options = response.data.data
      },
      //加载动态参数和静态参数
      async loadParams (index) {
        const sel = index === '1' ? 'many' : 'only'
        const response = await this.$http.get(`categories/${this.selectOptions[2]}/attributes?sel=${sel}`)
        /*
        {"data":[{"attr_id":3077,"attr_name":"版式","cat_id":6,"attr_sel":"many","attr_write":"list","attr_vals":"aa,bb,cc,ee","delete_time":null},
                {"attr_id":3803,"attr_name":"内存","cat_id":6,"attr_sel":"many","attr_write":"list","attr_vals":"4G,8G","delete_time":null},
                {"attr_id":3804,"attr_name":"CPU主频","cat_id":6,"attr_sel":"many","attr_write":"list","attr_vals":"1.5G,2.0G,3G","delete_time":null}],
        "meta":{"msg":"获取成功","status":200}}
         */
        if (sel === 'many') {
          this.dynamicParams = response.data.data
          this.dynamicParams.map((item) => {
            //将字符串转变为数组
            //动态给对象增加的成员无法做双向绑定，
            let arr = item.attr_vals.length === 0 ? [] :
              item.attr_vals.split(',');
            this.$set(item,'params',arr);
          })
        } else {
          //静态参数赋值
          this.staticParams = response.data.data
        }
      },
      //图片上传
      //文件列表移除的方法
      handleRemove (file, fileList) {
       //点击移除，删除form的pics,
        let index=this.form.pics.findIndex((item)=>{
          if (item.tmp_path === file.response.data.tmp_path){
            return true;
          }
        });
        //删除
       this.form.pics.splice(index,1);
       console.log(this.form.pics)
      },
      //文件上传成功的方法
      handleSuccess (response, file, fileList) {
        console.log(response)
        //记录临时地址
        if (response.meta.status === 200){
          this.form.pics.push({
            pic:response.data.tmp_path
          })
          console.log(this.form.pics)
        }else{
          this.$message.error("图片上传失败")
        }
      },
      //添加商品
      async addGoods(){
        //设置goods_cat
        this.form.goods_cat=this.selectOptions.join(',');
        //attrs
        //基于动态和静态数组生成新的数组
        const arr1=this.dynamicParams.map((item)=>{
          return {'attr_id':item.attr_id,'attr_value':item.params.join(',')}
        })
        const arr2=this.staticParams.map((item)=>{
          return {'attr_id':item.attr_id,'attr_value':item.attr_vals};
        })
        this.form.attrs=[...arr1,...arr2];

        //发送请求
        const response=await this.$http.post('goods',this.form);

        const {meta:{status,msg}}=response.data;
        if (status === 201){
          this.$message.success(msg);
          await this.$router.push('/goods');
        }else{
          this.$message.error(msg);
        }
      }
    }
  }
</script>

<style scoped>

</style>
