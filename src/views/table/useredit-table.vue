<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddUser">New User</el-button>

    <el-table :data="usersList" style="width: 100%;margin-top:30px;" border>
      <el-table-column v-if="false" align="center" label="用户id" width="120px">
        <template slot-scope="scope">
          {{ scope.row.userId }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" width="120">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮箱" width="200">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="介绍">
        <template slot-scope="scope">
          {{ scope.row.introduction }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit User':'New User'">
      <el-form :model="User" label-width="80px" label-position="left">
        <el-form-item label="名字">
          <el-input v-model="User.userName" placeholder="名字" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="User.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="介绍">
          <el-input
            v-model="User.introduction"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="User introduction"
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="User.password" show-password placeholder="密码" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="User.status" placeholder="状态" clearable style="width: 120px" class="filter-item">
            <el-option v-for="item in statuspOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmUser">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getUsers, delUser, updateUser, addUser } from '@/api/user'

const defaultUser = {
  userId: undefined,
  email: '',
  userName: '',
  introduction: '',
  status: '',
  password: '123456'
}

export default {
  data() {
    return {
      User: Object.assign({}, defaultUser),
      usersList: [],
      statuspOptions: ['free', 'working'],
      v: true,
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false
    }
  },
  computed: {

  },
  created() {
    this.getUsers()
  },
  methods: {
    async getUsers() {
      const res = await getUsers()
      this.usersList = res.data
      console.log(this.usersList)
    },

    handleAddUser() {
      this.v = false
      this.User = Object.assign({}, defaultUser)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.User = deepClone(scope.row)
      this.$nextTick(() => {
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the User?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await delUser(row.userName)
          this.usersList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmUser() {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        await updateUser(this.User)
        for (let index = 0; index < this.usersList.length; index++) {
          if (this.usersList[index].userId === this.User.userId) {
            this.usersList.splice(index, 1, Object.assign({}, this.User))
            break
          }
        }
      } else {
        const { data } = await addUser(this.User)
        this.User.userName = data.userName
        this.usersList.push(this.User)
      }

      const { introduction, userName, email, status } = this.User
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>User name: ${userName}</div>
            <div>User email: ${email}</div>
            <div>User status: ${status}</div>
            <div>User introduction: ${introduction}</div>
          `,
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .Users-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
