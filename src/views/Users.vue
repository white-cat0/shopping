<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--主题内容区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input
            v-model="query"
            clearable
            @clear="getUsersList"
            class="search-input"
            placeholder="请输入内容"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="userlist" style="width: 100%" stripe border>
        <!-- 设置表格索引 2种方法-->
        <el-table-column type="index" label="#"> </el-table-column>
        <!-- <el-table-column  type="index" :index="0" label="#"> </el-table-column> -->

        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="msg_statue" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.msg_statue"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="toggleStatus(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改用户 -->
            <el-button
              size="mini"
              @click="handleEdit(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <!-- 删除用户 -->
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
              icon="el-icon-delete"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-star-off"
                circle
                @click="handleFenpeiRoles(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[1, 2, 5, 10]"
        :current-page="pagenum"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="Number(total)"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的弹出框 -->
    <el-dialog
      title="添加用户"
      @close="dialogClosed"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="ruleForm.password"
              type="password"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email" clearable></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="ruleForm.mobile" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addBtnUsers">确定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑区域的弹出框 -->
    <el-dialog
      title="修改用户"
      @close="editDialogClosed"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <div>
        <el-form
          :model="editRuleForm"
          :rules="rules"
          ref="editRuleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="editRuleForm.username"
              clearable
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editRuleForm.email" clearable></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="editRuleForm.mobile" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editBtnUsers">确定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色弹出框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="addRolesDialogVisible"
      width="50%"
      @close="rolesDialogClose"
    >
      <div v-if="userInfo">
        <div>用户名称：{{ userInfo.name }}</div>
        <div>用户角色：{{ userInfo.role_name }}</div>
        <div>
          角色列表：
          <el-select v-model="selectedRoles" clearable placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  created() {
    this.getUsersList();
  },
  data() {
    //邮箱验证规则
    var chkEmial = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请正确填写邮箱"));
      } else {
        if (value !== "") {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
          if (!reg.test(value)) {
            callback(new Error("邮箱输入不正确，请重新输入"));
          }
        }
        callback();
      }
    };

    //手机号码验证规则
    var chkMobile = (rule, value, callback) => {
      var mobilePattern = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (!mobilePattern.test(value))
        return callback(new Error("号码输入有误，请重新输入"));
      callback();
    };

    return {
      query: "",
      pagenum: 1,
      pagesize: 3,
      userlist: [],
      total: [],
      disabled: false,
      dialogVisible: false,
      editDialogVisible: false,
      addRolesDialogVisible: false,
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editRuleForm: {},
      userInfo: null,
      selectedRoles: "",
      rolesList: [],

      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
        email: [{ validator: chkEmial, trigger: "blur" }],
        mobile: [{ validator: chkMobile, trigger: "blur" }],
      },
    };
  },
  methods: {
    //获取搜索到的用户列表
    async getUsersList() {
      const { data: res } = await this.$http.get("/users", {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        },
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      //   console.log(res);

      this.userlist = res.data.users;
      this.total = res.data.total;
    },

    //编辑用户按钮
    async handleEdit(id) {
      const { data: res } = await this.$http.get("/users/" + id);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.editRuleForm = res.data;
      this.editDialogVisible = true;
    },
    //删除用户按钮
    handleDelete(id) {
      console.log(id);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("/users/" + id, {});
          if (res.meta.status !== 200) {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          } else {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
          //更新成功以后，自动刷新页面，重新渲染
          this.getUsersList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //每页显示的条数发生改变而触发的函数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.getUsersList();
    },

    // 页码值发生改变而触发的函数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getUsersList();
    },

    //状态按钮函数
    async toggleStatus(val) {
      const { data: res } = await this.$http({
        method: "PUT",
        url: `/users/${val.id}/state/${val.mg_state}`,
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      return this.$message.success(res.meta.msg);
      //   console.log(res);
    },

    //确认添加按钮,表单提交
    addBtnUsers() {
      this.$refs.ruleForm.validate(async (a, b) => {
        if (!a) return this.$message.error("你的输入有误，请重新输入");
        //发送请求，获取列表信息
        const { data: res } = await this.$http.post("/users", {
          username: this.ruleForm.username,
          password: this.ruleForm.password,
          email: this.ruleForm.email,
          mobile: this.ruleForm.mobile,
        });
        //根据状态码判断是否添加成功
        if (res.meta.status !== 201) return this.$message.error("添加用户失败");
        this.$message.success(res.meta.msg);
        //如果添加成功就关闭对话框，自动刷新页面
        this.dialogVisible = false;
        this.getUsersList();
      });
    },

    // 关闭添加用户按钮
    dialogClosed() {
      //重置表单输入框的内容
      this.$refs.ruleForm.resetFields();
    },

    //关闭修改用户按钮
    editDialogClosed() {
      this.$refs.editRuleForm.resetFields();
    },
    //修改用户提交按钮
    editBtnUsers() {
      this.$refs.editRuleForm.validate(async (a) => {
        if (!a) return this.$message.error("你输入的格式不正确，请重新输入");

        //发送请求，获取列表内容，更新列表
        const { data: res } = await this.$http.put(
          "/users/" + this.editRuleForm.id,
          {
            id: this.editRuleForm.id,
            email: this.editRuleForm.email,
            mobile: this.editRuleForm.mobile,
          }
        );
        if (res.meta.status !== 200) return this.$message.error("修改用户失败");
        this.$message.success(res.meta.msg);
        //修改成功以后，关闭对话框
        this.editDialogVisible = false;
        //更新成功以后，自动刷新页面，重新渲染
        this.getUsersList();
        console.log(res);
      });
    },

    // 分配绝色
    async handleFenpeiRoles(scope) {
      console.log(scope);
      this.userInfo = scope;
      const { data: res } = await this.$http.get("/roles");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.rolesList = res.data;
      this.addRolesDialogVisible = true;
    },

    // 分配角色的确认按钮
    async addRoles() {
      // console.log(123);
      if (!this.selectedRoles) {
        return this.$message.error("角色名称必填");
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoles,
        }
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);

      this.getUsersList();
      this.addRolesDialogVisible = false;
    },

    // 关闭分配角色弹出框
    rolesDialogClose() {
      this.selectedRoles = "";
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  margin: 15px 0;
  //   .search-input {
  //       width: 400px;
  //   }
  .el-table {
    margin: 15px 0;
  }
}
</style>
