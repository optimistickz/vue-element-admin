<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.caller" placeholder="用户名" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.traceId" placeholder="调用号" style="width: 80px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.tableName" placeholder="表名" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.pkId" placeholder="主键" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="变化类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 120px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left:15px;" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-checkbox v-model="showSql" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        sql语句
      </el-checkbox>
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
      <el-table-column label="调用号" prop="traceId" align="center" width="70px">
        <template slot-scope="{row}">
          <span>{{ row.traceId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="变化时间" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.es | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前数据值" min-width="200px" align="center">
        <template slot-scope="{row}">
          <json-viewer
            :value="JSON.parse(row.data)"
            :expand-depth="5"
            copyable
            boxed
            sort
          />
        </template>
      </el-table-column>
      <el-table-column label="变化前数据" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.old }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表名" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.tableName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="变化类型" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主键字段" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.pkName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主键值" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.pkId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调用者" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.caller }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showSql" label="sql语句" show-overflow-tooltip="true" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.sqlContent }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/datachange'
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
      i: 'i',
      list: null,
      total: 0,
      jsonData: '',
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        traceId: undefined,
        type: undefined,
        pkId: undefined,
        startTime: undefined,
        endTime: undefined,
        sort: '+',
        tableName: undefined,
        caller: undefined
      },
      typeOptions: ['UPDATE', 'DELETE', 'INSERT'],
      sortOptions: [{ label: 'traceID升序', key: '+' }, { label: 'traceId降序', key: '-' }],
      pickerOptions: {
        shortcuts: [{
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }]
      },
      showSql: false,
      temp: {
        traceId: undefined,
        type: undefined,
        pkId: undefined,
        startTime: undefined,
        endTime: undefined,
        sort: '+',
        tableName: undefined,
        caller: undefined,
        data: undefined,
        old: undefined,
        pkName: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      downloadLoading: false
    }
  },
  created() {
    this.i = this.$route.params.traceId
    if (this.i % 1 === 0) {
      this.listQuery.traceId = this.$route.params.traceId
    }
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
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
        const tHeader = ['traceId', 'userId', 'userName', 'description', 'uri', 'ip', 'method', 'reqTime', 'respTime', 'param', 'result']
        const filterVal = ['traceId', 'userId', 'userName', 'description', 'uri', 'ip', 'method', 'reqTime', 'respTime', 'param', 'result']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '数据变化表'
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
