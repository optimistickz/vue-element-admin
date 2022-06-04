<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column v-if="false" width="120px" align="center" label="id">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="表名" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.tableName }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="字段名">
        <template slot-scope="{row}">
          <span>{{ row.fieldName }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="150px" align="center" label="字段说明">
        <template slot-scope="{row}">
          <span>{{ row.comment }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="150px" align="center" label="监控级别">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-select v-model="row.status" placeholder="监控级别" clearable style="width: 80px">
              <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
            </el-select>
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
          <span v-else>{{ row.status }}</span>
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
  </div>
</template>

<script>
import { fetchWatches, update } from '@/api/tablewatch'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      statusOptions: [0, 1, 2, 3],
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await fetchWatches()
      const items = data
      this.list = items.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalStatus = v.status //  will be used when user click the cancel botton
        return v
      })
      this.listLoading = false
    },
    cancelEdit(row) {
      row.status = row.originalStatus
      row.edit = false
      this.$message({
        message: '取消修改',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalStatus = row.status //  will be used when user click the cancel botton

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
