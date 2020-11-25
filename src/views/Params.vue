<template>
  <div>
    <!-- 面包屑， 组件都从我们已有的项目其他组件复制，不用去看官网了 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片组件 -->
    <el-card>
      <!-- 下面有个警告，要去element查找 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
      >
      </el-alert>
      <!-- 下面是选择商品分类 -->
      <div class="params-margin-15">
        <span>选择商品分类：</span>
        <!-- 等下写级联选择器 -->
        <el-cascader
          v-model="selectedValue"
          :options="goodsCate"
          @change="handleChange"
          clearable
          :props="{
            label: 'cat_name',
            value: 'cat_id',
            children: 'children',
          }"
        ></el-cascader>
      </div>

      <!-- tab标签 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <div class="add-btn">
            <el-button
              type="primary"
              size="mini"
              :disabled="disabled"
              @click="addParamsBtn"
              >添加参数</el-button
            >
          </div>
          <!-- 这里就是动态参数的表格 -->
          <!-- manyCateParams这个是数组， el-table自带for循环， prop就是每个列的下面显示对象的什么属性 -->
          <el-table
            :data="manyCateParams"
            stripe
            border
            empty-text="我是谁，哈哈"
            style="width: 100%"
          >
            <el-table-column width="50" type="expand">
              <template slot-scope="scope">
                <!-- scope.row 就是数组里面 当前某一个对象的数据，是一个对象 -->
                <!-- 不要在v-for的添加里面 将后面的数组通过 动态计算得到，应该在数据的源头去改好了，然后直接拿过来用 -->
                <el-tag
                  v-for="(item, index) in scope.row.new_attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(scope.row, index)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model.trim="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="#" type="index" width="50">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="manyHandleEdit(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="manyHandleDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <div class="add-btn">
            <el-button
              type="primary"
              size="mini"
              :disabled="disabled"
              @click="addParamsBtn"
              >添加属性</el-button
            >
          </div>
          <!-- 这里就是静态的表格 -->
          <el-table
            :data="onlyCateParams"
            stripe
            border
            empty-text="我是谁，哈哈"
            style="width: 100%"
          >
            <el-table-column width="50" type="expand">
              <template slot-scope="scope">
                <div>
                  <pre>{{ scope.row.attr_vals }}</pre>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index" width="50">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="manyHandleEdit(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="manyHandleDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- :title="dialogTile" 这个可以 -->
    <el-dialog
      :title="'添加' + dialogTileComputed"
      :visible.sync="manyDialogVisible"
      width="50%"
      @close="manyDialogVisibleClose"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsFormRules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="dialogTileComputed" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="manyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmitDialog">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 下面这个就是编辑的弹出框 -->
    <el-dialog
      :title="'编辑' + dialogTileComputed"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogVisibleClose"
    >
      <!-- 注意的就是 两个弹出框，不可能同时显示，所以有些变量，比如校验规则可以复用 -->
      <el-form
        :model="editParamsForm"
        :rules="addParamsFormRules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="dialogTileComputed" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmitDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      // 下面两个属性是添加 子属性的变量
      // 这两个变量是新子属性的变量
      // inputVisible: false,
      // inputValue: '',

      selectedValue: [],
      goodsCate: [],
      activeName: 'many',
      disabled: true,
      onlyCateParams: [], //这个是获取的静态属性列表
      manyCateParams: [], //这个是获取的动态参数列表
      manyDialogVisible: false, // 这个变量是 是否显示 添加参数 或者 添加属性的对话框
      editDialogVisible: false, // 这个变量是 是否显示 编辑参数 或者编辑 属性的对象
      dialogTile: '',
      // 下面这个变量，是我们的弹出框 表单绑定的对象
      addParamsForm: {
        attr_name: '',
        attr_sel: 'many',
      },
      editParamsForm: {
        attr_name: '',
        attr_sel: 'many',
      },
      addParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
      // 这个是我们分类的id，因为要在多个函数里面使用，所有把它提升到data上面来
      // 这样任何函数都可以通过 this.cate_id 得到当前分类的id
      // 什么时候给这个赋值呢？ 肯定是我们操作了级联选择器，触发了他的change事件的回调函数才会给合格值赋值
      cate_id: '',
      attr_id: '',
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    async getGoodsCate() {
      // 这个请求的参数type 3 和不写是一样的， 都是获取所有数据
      const { data: res } = await this.$http.get('categories', {
        params: { type: 3 },
      });
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.goodsCate = res.data;
    },
    handleChange(val) {
      // val只是一个参数，不能再视图上面使用
      // 要在视图上面使用 ，必须定义在data上面
      if (val.length !== 3) {
        this.disabled = true;
        this.selectedValue = [];
        return null;
      }
      // 假设代码走到了这里79行，证明我们现在 选择了三级分类，
      this.cate_id = val[2];
      this.disabled = false;
      this.getCateParams();
    },
    handleClick() {
      this.addParamsForm.attr_sel = this.activeName;
      if (this.selectedValue.length === 3) {
        this.getCateParams();
      }
    },
    // 这个发请求的方法写外面， 因为有多个地方需要调用这个函数
    async getCateParams() {
      let id = this.selectedValue[2];
      const { data: res } = await this.$http.get(
        `categories/${id}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      // 在给data上面的数据绑定res.data之前，应该先数据的源头改一改
      // 添加几个新的书写进去
      res.data.forEach((item) => {
        // 视频里面是直接修改的 attr_vals这个属性，而我们这里是添加新属性
        // 这里只有一种情况下是假，就是空字符串
        if (item.attr_vals) {
          this.$set(item, 'new_attr_vals', item.attr_vals.split(' '));
        } else {
          this.$set(item, 'new_attr_vals', []);
        }

        this.$set(item, 'inputVisible', false);
        this.$set(item, 'inputValue', '');
      });
      if (this.activeName == 'only') {
        this.onlyCateParams = res.data;
      } else {
        this.manyCateParams = res.data;
      }
    },
    // 下面是 动态参数 tab标签页里面的 按钮
    manyHandleEdit(scope) {
      // 这句话，就是讲函数的形参(是从页面的模板里面传递过来的作用域插槽的变量，就是当前哪一行的数据) 赋值 给我嗯表单的input
      this.editParamsForm.attr_name = scope.attr_name;
      this.attr_id = scope.attr_id;
      this.editDialogVisible = true;
    },
    manyHandleDelete() {
      this.$confirm('此操作将永久删除属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 在这里写删除的逻辑
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    // 这个是动态参数和静态属性 两个标签页 里面 添加按钮绑定的函数
    addParamsBtn() {
      this.manyDialogVisible = true;
      if (this.activeName === 'only') {
        this.dialogTile = '静态属性';
      } else {
        this.dialogTile = '动态参数';
      }
    },
    // 下面的方法是关闭 新增弹出框，重置表单的固定写法
    manyDialogVisibleClose() {
      this.$refs.ruleForm.resetFields();
    },
    // 下面的方法是关闭 编辑的弹出框，重置表单的固定写法
    editDialogVisibleClose() {
      this.$refs.ruleForm.resetFields();
    },
    // 下面这个方法是 对话框里面的 确定按钮
    addSubmitDialog() {
      this.$refs.ruleForm.validate(async (isok) => {
        if (!isok) return this.$message.error('数据格式错误');

        const { data: res } = await this.$http.post(
          `categories/${this.cate_id}/attributes`,
          this.addParamsForm
        );

        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.getCateParams();
        this.manyDialogVisible = false;
      });
    },
    editSubmitDialog() {
      this.$refs.ruleForm.validate(async (isok) => {
        if (!isok) return this.$message.error('数据格式错误');
        const { data: res } = await this.$http.put(
          `categories/${this.cate_id}/attributes/${this.attr_id}`,
          {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.getCateParams();
        this.editDialogVisible = false;
      });
    },
    async handleInputConfirm(scope) {
      scope.inputVisible = false;
      // 这个代码叫本地添加，页面一刷新数据就没有了，所以要持久化，我们这里采用的是发送个服务器保存
      if (!scope.inputValue) {
        return null;
      }

      // 新增属性，一个是本地的新增，一个是服务器的新增
      scope.new_attr_vals.push(scope.inputValue);
      const { data: res } = await this.$http.put(
        // 这里使用this.attr_id 是找不到的，因为这个值初始化的时候时空，在点击编辑按钮的时候才给他赋值，我们现在没有点击，拿他就没有值。当前函数的形参scopr里面就有
        `categories/${this.cate_id}/attributes/${scope.attr_id}`,
        {
          attr_name: scope.inputValue,
          attr_sel: this.activeName,
          attr_vals: scope.attr_vals
            ? scope.attr_vals + ' ' + scope.inputValue
            : scope.inputValue,
        }
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // this.getCateParams();
      scope.inputValue = '';
    },
    showInput(scope) {
      scope.inputVisible = true;
      // 因为使用了v-if 那么这个input输入框就是动态添加进去的，
      // 下面这句话就相当于，我的dom元素还没有加载完毕，你就去获取，肯定失败
      // 因为dom元素渲染 是一个异步操作
      // this.$refs.saveTagInput.$refs.input.focus(); 写这里的话不生效，因为dom现在还没有，找不到
      // 等下来解释 自动获得焦点
      // this.$nextTick 这个是一个函数，他是等等dom元素加载完毕了以后，在执行他的回调函数
      // this.$nextTick((_) => {
      //   // 这句话就是选中当前input输入框的， focus是通过函数的方法，让他自动获取焦点
      //   this.$refs.saveTagInput.$refs.input.focus();
      // });

      setTimeout(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async handleClose(scope, params) {
      console.log(scope, params);
      scope.new_attr_vals.splice(params, 1);

      const { data: res } = await this.$http.put(
        `categories/${this.cate_id}/attributes/${scope.attr_id}`,
        {
          attr_name: scope.attr_name,
          attr_sel: this.activeName,
          attr_vals: scope.new_attr_vals.join(' '),
        }
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
    },
  },
  computed: {
    dialogTileComputed() {
      return this.activeName === 'only' ? '静态属性' : '动态参数';
    },
  },
};
</script>

<style lang="less" scoped>
.params-margin-15 {
  margin: 15px 0;
}
.el-table {
  margin: 15px 0;
}
.el-tag {
  margin-right: 15px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
