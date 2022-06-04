<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRule">New Rule</el-button>

    <el-table :data="ruleList" style="width: 100%;margin-top:30px;" border>
      <el-table-column v-if="false" align="center" label="id" width="80px">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="内容" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.word }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="监控级别" width="100">
        <template slot-scope="scope">
          {{ scope.row.level }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit rule':'New rule'">
      <el-form :model="rule" label-width="100px" label-position="left">
        <el-form-item label="内容">
          <el-input v-model="rule.word" placeholder="监控的敏感词" />
        </el-form-item>

        <el-form-item label="监控级别">
          <el-select v-model="rule.level" placeholder="状态" clearable style="width: 100px" class="filter-item">
            <el-option v-for="item in levelOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmRule">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getWords, delRule, updateRule, addRule } from '@/api/rule'

const defaultRule = {
  id: undefined,
  word: '',
  level: 3

}

export default {
  data() {
    return {
      rule: Object.assign({}, defaultRule),
      ruleList: [],
      levelOptions: [1, 2, 3],
      v: true,
      dialogVisible: false,
      dialogType: 'new'
    }
  },
  computed: {

  },
  created() {
    this.getWords()
  },
  methods: {
    async getWords() {
      const res = await getWords()
      this.ruleList = res.data
    },

    handleAddRule() {
      this.v = false
      this.rule = Object.assign({}, defaultRule)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.rule = deepClone(scope.row)
      console.log(this.rule)
      this.$nextTick(() => {
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the Rule?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await delRule(row.id)
          this.ruleList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmRule() {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        await updateRule(this.rule)
        for (let index = 0; index < this.ruleList.length; index++) {
          if (this.ruleList[index].id === this.rule.id) {
            this.ruleList.splice(index, 1, Object.assign({}, this.rule))
            break
          }
        }
      } else {
        const { data } = await addRule(this.rule)
        this.rule.id = data.id
        this.ruleList.push(this.rule)
      }

      const { word, level } = this.rule
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>敏感词: ${word}</div>
            <div>监控级别: ${level}</div>
          `,
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .Rules-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
