<template>
    <el-card class="card">
        <my-breadcrumb level1="数据统计" level2="数据报表"></my-breadcrumb>
        <div style="height: 800px;width: 600px;margin-top: 10px" ref="charts">

        </div>
    </el-card>
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: 'reports',
    created () {
      // this.init();在vue节点挂载到dom树之前，ref不可用
    },
    mounted () {
      this.init()
    },
    methods: {
      async init () {
        const response = await this.$http.get(`reports/type/1`)
        let options = response.data.data
        const myEcharts = echarts.init(this.$refs.charts)
        const data = {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            },
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
        }
        options = {...options, ...data};
        options.xAxis[0].boundaryGap=false;

        myEcharts.setOption(options)
      }
    }
  }
</script>

<style scoped>

</style>
