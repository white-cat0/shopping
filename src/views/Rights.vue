<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片组件 -->
    <el-card>
      <el-table :data="rights" style="width: 100%">
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column lable="address" label="权限等级">
          <template slot-scope="scope">
            <el-tag size="medium" v-if="scope.row.level == '0'">一级</el-tag>
            <el-tag size="medium" type="success" v-if="scope.row.level == '1'"
              >二级</el-tag
            >
            <el-tag size="medium" type="warning" v-if="scope.row.level == '2'"
              >三级</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data() {
    return {
      rights: [],
    };
  },
  created() {
    //获取所有权限列表
    this.getRightList();
  },
  methods: {
    async getRightList() {
      const { data: res } = await this.$http.get("/rights/list");
      if (res.meta.status !== 200) return this.$messaage.error("获取列表失败");
      this.rights = res.data;
      console.log(res);
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  margin: 15px 0;
}
</style>
