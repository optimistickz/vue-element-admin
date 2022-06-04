<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.userName" placeholder="用户名" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.description" placeholder="api" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in descripOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 150px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left:15px;" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-date-picker v-model="listQuery.startTime" size="mini" style="width: 80%;margin-top:10px;" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="起始日期" default-time="00:00:00" />
      <el-date-picker v-model="listQuery.endTime" size="mini" style="width: 80%;margin-top:10px;" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="结束日期" default-time="23:59:59" />
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="id" prop="traceId" align="center" width="70">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Api方法名" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.method }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.startTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="告警时间" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.endTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接口描述" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发起人" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="次数" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.times }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/limitevent'
import { fetchDescriptionList } from '@/api/callinfo'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        method: undefined,
        startTime: undefined,
        endTime: undefined,
        sort: '+',
        userName: undefined,
        description: undefined,
        times: undefined
      },
      descripOptions: [],
      sortOptions: [{ label: '时间升序', key: '+' }, { label: '时间降序', key: '-' }],
      pickerOptions: {
        shortcuts: [{
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }]
      },
      showResult: false,
      temp: {
        traceId: undefined,
        userId: '',
        userName: '',
        description: '',
        uri: '',
        ip: '',
        method: '',
        reqTime: '',
        respTime: '',
        param: '',
        result: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      fetchDescriptionList().then(response => {
        this.descripOptions = response.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    dataDetail(row) {
      console.log('/table/datachange-table' + row.traceId)
      this.$router.push('/table/datachange-table/' + row.traceId)
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'traceId') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+traceId'
      } else {
        this.listQuery.sort = '-traceId'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        traceId: undefined,
        userId: '',
        userName: '',
        description: '',
        uri: '',
        ip: '',
        method: '',
        reqTime: '',
        respTime: '',
        param: '',
        result: ''
      }
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', 'userName', 'description', 'method', 'startTime', 'endTime', 'times']
        const filterVal = ['id', 'userName', 'description', 'method', 'startTime', 'endTime', 'times']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '告警记录表'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
