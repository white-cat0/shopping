<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片组件 -->
    <el-card>
      <el-row>
        <el-button type="primary" @click="addCategoryBtn">添加分类</el-button>
      </el-row>

      <!-- 表格 -->
      <!-- data 属性放置我们数据表格的地方 -->
      <tree-table
        class="treeTable"
        :data="categoryList"
        :columns="column"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        :show-row-hover="false"
        border
      >
        <!-- 是否有效 -->
        <template slot="Ok" slot-scope="scope">
          <div>
            <i
              class="el-icon-success"
              v-if="scope.row.cat_deleted === false"
              style="color:lightgreen"
            ></i>
            <i class="el-icon-error" v-else style="color:red"></i>
          </div>
        </template>

        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <div>
            <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
            <el-tag
              type="success"
              size="mini"
              v-else-if="scope.row.cat_level == 1"
              >二级</el-tag
            >
            <el-tag type="warning" size="mini" v-else>三级</el-tag>
          </div>
        </template>

        <!-- 操作 -->
        <template slot="handle">
          <div>
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
          </div>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[1, 2, 5, 10]"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="Number(total)"
      >
      </el-pagination>

      <!-- 添加分类对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClose"
      >
        <el-form
          :model="addCategoryModel"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCategoryModel.cat_name" clearable></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              v-model="selectedValue"
              :options="parentCate"
              @change="handleChange"
              clearable
              :props="{
                label: 'cat_name',
                value: 'cat_id',
                children: 'children',
              }"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCateSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Category",
  data() {
    return {
      queryInfo: {
        type: 3, // 这个是传递给后端，所我们要几级分类的数据
        pagenum: 1, //这个是分页必须要用的 当前页码值
        pagesize: 5, // 这个是分页插件 每页显示的数据条数
      },
      categoryList: [], // 所有分类数据
      total: 0, // 总的数据条数
      column: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          // 表示当前使用的模板的名称
          template: "Ok",
        },
        {
          label: "排序",
          type: "template",
          // 表示当前使用的模板的名称
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          // 表示当前使用的模板的名称
          template: "handle",
        },
      ],

      //添加分类弹出框
      addDialogVisible: false,
      addCategoryModel: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      rules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },

      //父级分类弹出框数据
      parentCate: [],
      selectedValue: [],
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    //获取商品分类数据
    async getCategoryList() {
      // 因为需要三个参数，所以我们定义data上面数据的时候，就直接将数据定义为一个对象，方便我们后面传参
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      console.log(res);

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.categoryList = res.data.result;
      this.total = res.data.total;
    },

    //每页显示的条数发生改变而触发的函数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getCategoryList();
    },

    // 页码值发生改变而触发的函数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getCategoryList();
    },

    // 弹出添加分类对话框
    async addCategoryBtn() {
      const { data: res } = await this.$http.get("categories", {
        params: {
          type: 2,
        },
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.parentCate = res.data;
      // 添加分类对话框显示
      this.addDialogVisible = true;
    },

    handleChange(val) {
      //  val.length 为0 就是一级分类 1 就是二级分类 2 就是三级分类
      // console.log(val);

      this.addCategoryModel.cat_level = val.length;

      //获取子分类数据
      if (val.length === 0) {
        this.addCategoryModel.cat_id = 0;
      } else {
        this.addCategoryModel.cat_id = val[val.length - 1];
      }
    },

    addDialogClose() {
      this.$refs.ruleForm.resetFields();
      // 下面的因为没有绑定到表单的校验上面去，所以需要手动重置
      // 但是对象因为地址的原因，最后不要直接复制为新的空对象，改变了地址的操作不好
      // 再就是重置 级联选择器的是， 是上面定义的变量selectedValue
      this.addCategoryModel.cat_pid = 0;
      this.addCategoryModel.cat_level = 0;
      this.addCategoryModel.cat_name = "";
      this.selectedValue = [];
    },

    // 确认添加按钮
    addCateSubmit() {
      // console.log(this.addCategoryModel);

      this.$refs.ruleForm.validate(async (isok) => {
        if (!isok) return this.$message.error("参数格式错误，请重新输入");

        const { data: res } = await this.$http.post("categories", {
          cat_pid: this.addCategoryModel.cat_pid,
          cat_name: this.addCategoryModel.cat_name,
          cat_level: this.addCategoryModel.cat_level,
        });
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);

        this.addDialogVisible = false;
        this.getCategoryList();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
