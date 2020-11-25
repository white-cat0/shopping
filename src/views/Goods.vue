<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <!-- gutter 这个是分栏间隔的距离 -->
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input
            v-model="query"
            clearable
            @clear="getGoodsList"
            class="search-input"
            placeholder="请输入内容"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- tab表格区域 -->
      <el-table :data="goodslist" stripe border style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="160">
          <template slot-scope="scope">
            {{ scope.row.goods_price | moneyFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="160">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <!-- 修改用户 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="handleEdit(scope.row)"
            ></el-button>
            <!-- 删除用户 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="handleDelete(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页部分 -->
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

    <!-- 编辑区域的弹出框 -->
    <el-dialog
      title="商品编辑"
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
          <el-form-item label="商品名称" prop="goods_name">
            <el-input
              v-model="editRuleForm.goods_name"
              clearable
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="editRuleForm.goods_price" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="editRuleForm.goods_weight" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="editRuleForm.goods_number" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editBtnUsers">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Goods",
  created() {
    this.getGoodsList();
  },
  data() {
    return {
      query: "", //查询参数
      pagenum: 1, //当前页码
      pagesize: 10, //每页显示数据
      goodslist: [], //商品列表数据
      total: [],
      editRuleForm: {},
      rules: {
        goods_name: [],
        goods_price: [],
        goods_weight: [],
        goods_number: [],
      },
      dialogVisible: false,
      editDialogVisible: false,
    };
  },
  methods: {
    // 根据分页获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("/goods", {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        },
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      console.log(res.data);
      this.goodslist = res.data.goods;
      this.total = res.data.total;
    },

    //每页显示的条数发生改变而触发的函数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.getGoodsList();
    },

    // 页码值发生改变而触发的函数
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getGoodsList();
    },

    // 修改商品信息
    async handleEdit(scope) {
      const { data: res } = await this.$http.put("goods/" + scope.goods_id);
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
      this.editRuleForm = res.data;
      this.editDialogVisible = true;
    },
    //删除商品
    handleDelete(scope) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            "goods/" + scope.goods_id
          );
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getGoodsList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //添加商品
    addGoods() {
      this.$router.push("/goods/add");
    },

    //商品编辑
    editDialogClosed() {},
    //提交商品编辑
    editBtnUsers() {},
  },
};
</script>

<style lang="postcss" scoped></style>
