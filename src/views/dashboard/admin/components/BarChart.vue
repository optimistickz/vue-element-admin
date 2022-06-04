<template>
  <el-card class="box-card">
    <div class="filter-container">
      <el-input v-model="listQuery.userName" placeholder="用户名" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.ip" placeholder="ip" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left:15px;" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-date-picker v-model="listQuery.startTime" size="mini" style="width: 80%;margin-top:10px;" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="起始日期" default-time="00:00:00" />
      <el-date-picker v-model="listQuery.endTime" size="mini" style="width: 80%;margin-top:10px;" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="结束日期" default-time="23:59:59" />
    </div>
    <div id="bar" v-loading="listLoading" style="width: 100%;height: 500px;" />
    <div id="sector" style="height: 500px;width: 100%" />
  </el-card>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme     <div id="sector" style="width: 50%;height: 200px;"></div>
import resize from './mixins/resize'
// import { fetchList } from '@/api/count'
import axios from 'axios'
import { fetchDescriptionList } from '@/api/callinfo'
const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    }
  },
  data() {
    return {
      chart: null,
      myEchart: null,
      lineChart: null,
      listLoading: true,
      descripOptions: [],
      cntList: undefined,
      descriptions: undefined,
      listQuery: {
        startTime: undefined,
        endTime: undefined,
        userName: undefined,
        ip: undefined,
        unit: undefined
      }
    }
  },
  mounted() {
    this.initBar()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    async initBar() {
      this.listLoading = true
      const response = await axios.get(process.env.VUE_APP_BASE_API + '/apicall/countStatics', { params: this.listQuery })
      const mydata = response.data
      console.log(mydata)
      this.cntList = mydata.data.cntList
      this.descriptions = mydata.data.descriptions
      fetchDescriptionList().then(response => {
        this.descripOptions = response.data
        this.descripOptions.push('ALL')
      })

      this.chart = echarts.init(document.getElementById('bar'))
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '10%',
          right: '1%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.descriptions,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: { // 坐标轴刻度标签的相关设置。
            interval: 0,
            rotate: '60'
          },
          textStyle: {
            color: '#fff',
            fontSize: '3'
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '调用量',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.cntList,
          animationDuration
        }]
      })
      this.myEchart = echarts.init(document.getElementById('sector'))
      const myMap = []
      this.cntList.map((item, index) => {
        myMap.push({ value: item, name: this.descriptions[index] })
      })
      this.myEchart.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '接口调用情况',
            type: 'pie',
            roseType: 'radius',
            radius: '60%',
            center: ['75%', '50%'],
            data: myMap,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },

    handleFilter() {
      this.initBar()
    }
  }
}
</script>
