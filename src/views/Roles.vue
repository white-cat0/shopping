<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片组件 -->
    <el-card>
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              class="row-1 vertical-moddle"
              v-for="(item_1, index_1) in scope.row.children"
              :key="item_1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag>{{ item_1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row
                  class="row-2 vertical-moddle"
                  v-for="(item_2, index_2) in item_1.children"
                  :key="item_2.id"
                >
                  <el-col :span="8">
                    <el-tag type="success">{{ item_2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <!-- 因为三级分类下面已经没有四级分类了，到底了，所以就不需要在写el-row在分列了，如果有四级分类这里就还是要写el-row -->
                    <el-tag
                      type="warning"
                      v-for="item_3 in item_2.children"
                      :key="item_3.id"
                      closable
                      @close="deleteTags(scope.row, item_2.id)"
                      >{{ item_3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" width="300">
          <!-- 下面要写其他的组件，必须写插槽，而且是作用域插槽 -->
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showRightsDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加角色弹出框区域 -->
      <el-dialog title="添加角色" :visible.sync="dialogVisible" width="50%">
        <div>
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
          >
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="ruleForm.roleName" clearable></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="ruleForm.roleDesc" clearable></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoleDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 放置分配权限的弹出框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRigthDialogVisible"
        width="50%"
        @close="rightssDiolagClose"
      >
        <!--  -->
        <el-tree
          :data="rightsList"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          ref="distributeRef"
          default-expand-all
          :default-checked-keys="defaultKey"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRigthDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="fenpeiRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      rolesList: [],
      rightsList: [],
      // 这个属性就是默认勾选上的 节点
      defaultKey: [],
      roleId: null,
      dialogVisible: false,
      setRigthDialogVisible: false,
      defaultProps: {
        children: "children",
        label: "authName",
      },
      ruleForm: {
        roleName: "",
        roleDesc: "",
      },

      rules: {
        roleName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("/roles");

      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.rolesList = res.data;
    },

    deleteTags(scope, id) {
      this.$confirm("是否删除当前权限?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 如果请求参数没有： 1. 在data里面去找有没有 2. 在props里面找 3. 通过函数传参
          const { data: res } = await this.$http.delete(
            `roles/${scope.id}/rights/${id}`
          );

          if (res.meta.status !== 200) this.$message.error("删除失败，请重试");

          // 这里不能调用 this.getRolesList() 会让table收起来，因为是更新的所有数据； 我们为了让他不收起来，只能更新局部的数据
          scope.children = res.data;
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    async showRightsDialog(val) {
      this.roleId = val.id;
      this.setRigthDialogVisible = true;
      const { data: res } = await this.$http.get("rights/tree");

      if (res.meta.status !== 200)
        return this.$message.error("获取权限列表数据失败");
      this.$message.success(res.meta.msg);
      this.rightsList = res.data;

      // console.log(val); // 外界传递进来的参数， 就是当前角色自带的权限
      // 现在就是要从这个val里面拿出来我们的 所有的id组成的数组
      // 因为这个数据的格式 是每个对象都有children， 只要到了一个对象没有children，那么证明这个层级就结束了，就可以当做递归的结束条件
      this.getAllIds(val, this.defaultKey);
    },

    getAllIds(source, arr) {
      if (!source.children) {
        return arr.push(source.id);
      }

      source.children.forEach((item) => {
        // 如果直接这样写，就会导致，只会遍历一层children结构
        // 如果要遍历多层数组结构，必须采用递归的方法
        // 在最后的结束条件里面，在添加我们的 push方法 5!  5*4*3*2*1
        // arr.push(item.id)
        this.getAllIds(item, arr);
      });
    },

    rightssDiolagClose() {
      this.defaultKey = [];
    },

    async fenpeiRights() {
      console.log(this.$refs.distributeRef.getCheckedKeys());
      console.log(this.$refs.distributeRef.getHalfCheckedKeys());
      let keys = [
        ...this.$refs.distributeRef.getHalfCheckedKeys(),
        ...this.$refs.distributeRef.getCheckedKeys(),
      ];
      let rightsStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: rightsStr,
        }
      );
      if (res.meta.status !== 200)
        return this.$message.error("分配权限失败，请重试");
      this.$message.success(res.meta.msg);

      this.getRolesList();
      this.setRigthDialogVisible = false;
    },

    // 添加角色弹出框
    addRoleDialogVisible() {
      this.$refs.ruleForm.validate(async (a, b) => {
        if (!a) return this.$message.error("你输入的有误，请重新输入");

        const { data: res } = await this.$http.post("/roles", {
          roleName: this.ruleForm.roleName,
          roleDosc: this.ruleForm.roleDesc,
        });
        if (res.meta.status !== 201) return this.$message.error("添加用户失败");
        this.dialogVisible = false;
        this.getRolesList();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.el-row.row-1 {
  // border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}
.el-row.row-1:first-child {
  border-top: 1px solid #eee;
}
.el-row.row-2 {
  // border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}
.el-row.row-2:first-child {
  border-top: 1px solid #eee;
}
.el-row.row-2:last-child {
  border-bottom: none;
}

.colr-red {
  color: #000;
}
</style>
