<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="API方法" width="120px">
        <template slot-scope="{row}">
          <span>{{ row.method }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="接口描述">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="180px" align="center" label="接口策略">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.type" class="edit-input" size="medium" />
            <el-button
              class="cancel-btn"
              size="mini"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancel
            </el-button>
          </template>
          <span v-else>{{ row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="150px" label="警告访问量" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.limitNum" class="edit-input" size="medium" />
            <el-button
              class="cancel-btn"
              size="mini"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancel
            </el-button>
          </template>
          <span v-else>{{ row.limitNum }}</span>
        </template>
      </el-table-column>

      <el-table-column label="限制时间(s)" min-width="180px" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.expire" class="edit-input" size="medium" />
            <el-button
              class="cancel-btn"
              size="mini"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancel
            </el-button>
          </template>
          <span v-else>{{ row.expire }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            Ok
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.edit=!row.edit"
          >
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList, update } from '@/api/limitedit'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'InlineEditTable',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        limitNum: undefined,
        expire: undefined,
        method: undefined,
        type: undefined,
        sort: '+',
        description: undefined,
        times: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await fetchList(this.listQuery)
      const items = data.items
      this.total = data.total
      this.list = items.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalType = v.type //  will be used when user click the cancel botton
        v.originalLimitNum = v.limitNum
        v.originalExpire = v.expire
        return v
      })
      this.listLoading = false
    },
    cancelEdit(row) {
      row.type = row.originalType
      row.limitNum = row.originalLimitNum
      row.expire = row.originalExpire
      row.edit = false
      this.$message({
        message: '修改失败，请重试',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalType = row.type //  will be used when user click the cancel botton
      row.originalLimitNum = row.limitNum
      row.originalExpire = row.expire
      update(row).then(response => {
        this.$message({
          message: '修改配置成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
