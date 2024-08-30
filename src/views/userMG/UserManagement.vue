<template>
  <v-card flat class="pa-3 mt-2">
    <v-card-title>
      用户管理
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="mdi-magnify" label="搜索" single-line hide-details
        @input="debouncedSearch"></v-text-field>
    </v-card-title>

    <v-data-table :headers="headers" :items="users" :options.sync="options" :server-items-length="totalUsers"
      :loading="loading" class="elevation-1" @update:options="getDataFromApi">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>用户列表</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                新增用户
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.username" label="用户名"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.email" label="邮箱"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.realname" label="昵称"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.phone" label="电话"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.addr" label="地址"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.age" label="年龄" type="number"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">取消</v-btn>
                <v-btn color="blue darken-1" text @click="save">保存</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small class="mr-2" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
        <v-icon small @click="openResetPasswordDialog(item)">
          mdi-lock-reset
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="resetPasswordDialog" max-width="300px">
      <v-card>
        <v-card-title>重置密码</v-card-title>
        <v-card-text>
          确定重置此用户密码为默认密码吗？
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="resetPasswordDialog = false">取消</v-btn>
          <v-btn color="blue darken-1" text @click="resetPassword">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { getUserList, addUser, updateUser, deleteUser, resetPassword } from '@/api/user'

export default {
  data: () => ({
    dialog: false,
    resetPasswordDialog: false,
    resetPasswordUserId: null,
    search: '',
    headers: [
      { text: '用户名', align: 'start', sortable: true, value: 'username' },
      { text: '邮箱', value: 'email' },
      { text: '昵称', value: 'realname' },
      { text: '电话', value: 'phone' },
      { text: '地址', value: 'addr' },
      { text: '年龄', value: 'age' },
      { text: '操作', value: 'actions', sortable: false }
    ],
    users: [],
    editedIndex: -1,
    editedItem: {
      id: '',
      username: '',
      email: '',
      realname: '',
      phone: '',
      addr: '',
      age: '',
    },
    defaultItem: {
      id: '',
      username: '',
      email: '',
      realname: '',
      phone: '',
      addr: '',
      age: '',
    },
    options: {},
    totalUsers: 0,
    loading: true,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? '新增用户' : '编辑用户'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  created() {
    this.debouncedSearch = this.debounce(this.getDataFromApi, 500)
    this.getDataFromApi()
  },

  methods: {
    async getDataFromApi() {
      this.loading = true
      try {
        const { page, itemsPerPage } = this.options
        console.log('Requesting data with options:', this.options)
        console.log('Search keyword:', this.search)
        const response = await getUserList({
          page: page,
          limit: itemsPerPage,
          keyword: this.search,
        })
        console.log('Received response:', response)
        if (response && response.data && response.data.code === 0) {
          this.users = response.data.data.items
          this.totalUsers = response.data.data.total
          console.log('Updated users:', this.users)
          console.log('Total users:', this.totalUsers)
        } else {
          console.error('Invalid response format:', response)
        }
      } catch (error) {
        console.error('获取用户列表失败', error)
      } finally {
        this.loading = false
      }
    },

    editItem(item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    async deleteItem(item) {
      if (confirm('确定要删除这个用户吗?')) {
        try {
          await deleteUser(item.id)
          alert('用户删除成功')
          this.getDataFromApi()
        } catch (error) {
          console.error('删除用户失败', error)
          alert('删除用户失败')
        }
      }
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save() {
      try {
        if (this.editedIndex > -1) {
          await updateUser(this.editedItem)
        } else {
          const newUser = {
            ...this.editedItem,
            password: '123456'
          }
          await addUser(newUser)
        }
        this.close()
        this.getDataFromApi()
        alert(this.editedIndex > -1 ? '用户更新成功' : '用户添加成功')
      } catch (error) {
        console.error('保存用户失败', error)
        alert('保存用户失败')
      }
    },

    debounce(fn, delay) {
      let timeoutId
      return function (...args) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn.apply(this, args), delay)
      }
    },

    openResetPasswordDialog(item) {
      this.resetPasswordUserId = item.id
      this.resetPasswordDialog = true
    },

    async resetPassword() {
      try {
        await resetPassword(this.resetPasswordUserId)
        alert('密码重置成功')
        this.resetPasswordDialog = false
        this.getDataFromApi()
      } catch (error) {
        console.error('重置密码失败', error)
        alert('重置密码失败')
      }
    },
  }
}
</script>