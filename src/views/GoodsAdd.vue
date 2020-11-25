<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 消息提示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        finish-status="success"
        align-center
        :active="active"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab 标签页 -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          :before-leave="beforeLeave"
          @tab-click="handleTab"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="ruleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="ruleForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="ruleForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="ruleForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" label-width="100%">
              <!-- 级联选择器 -->
              <el-cascader
                v-model="selectedCate"
                :options="goodsCateList"
                :props="{
                  label: 'cat_name',
                  value: 'cat_id',
                  children: 'children',
                }"
                @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数" name="1">
            <div v-for="item in manyGoodsParams" :key="item.attr_id">
              <p v-if="item.new_attr_vals.length > 0">{{ item.attr_name }}</p>
              <el-checkbox-group v-model="item.new_attr_vals">
                <el-checkbox
                  border
                  :label="childItem"
                  v-for="(childItem, index) in item.new_attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </div>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyGoodsParams"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片 -->
            <el-upload
              class="upload-demo"
              action="http://m.leijiuling.com/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="onSuccess"
              :file-list="fileList"
              :headers="headers"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor
              ref="myTextEditor"
              v-model="ruleForm.goods_introduce"
              :options="editorOption"
              style="height:400px;"
            ></quill-editor>
            <el-row>
              <el-button type="primary" @click="addGoods">添加商品</el-button>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img :src="src" style="width:100%" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "GoodsAdd",

  data() {
    return {
      previewDialogVisible: false,
      closable: false,
      active: 0,
      selectedCate: [],
      goodsCateList: [],
      cat_id: "",
      manyGoodsParams: "",
      onlyGoodsParams: "",
      ruleForm: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: 0,
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: [],
      },

      // 富文本编辑器的属性
      editorOption: {
        placeholder: "insert text here……",
      },

      // 上传图片
      src: "",
      fileList: [],
      headers: {
        Authorization: window.localStorage.getItem("shopping_token"),
      },

      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getGoodsCateList();
  },
  methods: {
    async getGoodsCateList() {
      // 发请求获取商品分类的所有数据
      const { data: res } = await this.$http.get("categories");
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.goodsCateList = res.data;
    },

    handleTab(tab) {
      // console.log(tab);
      this.active = parseInt(tab.name);
      if (tab.name == "1") {
        this.getGoodsParams("many");
      } else if (tab.name == "2") {
        this.getGoodsParams("only");
      }
    },

    // 获取商品参数的函数封装
    async getGoodsParams(sel) {
      const { data: res } = await this.$http.get(
        "categories/" + this.cat_id + "/attributes",
        {
          params: {
            sel,
          },
        }
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      res.data.forEach((item) => {
        let temp = item.attr_vals ? item.attr_vals.split(" ") : [];
        this.$set(item, "new_attr_vals", temp);
      });

      if (sel === "many") {
        this.manyGoodsParams = res.data;
      } else {
        this.onlyGoodsParams = res.data;
      }
    },

    // 商品三级分类时才能选择下一步
    beforeLeave(activeName, oldActiveName) {
      if (activeName == 0) {
        return true;
      }
      if (this.selectedCate.length !== 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },

    handleChange(val) {
      console.log(val);
      this.cat_id = val[2];
    },

    // 上传图片
    handlePreview(file) {
      console.log(file);
      this.src = file.url;
      this.previewDialogVisible = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },

    onSuccess(response, file, fileList) {
      this.ruleForm.pics.push({
        pic: response.data.tmp_path,
      });
    },
    addGoods() {
      console.log(this.ruleForm);
      // 我们最终的任务就是来发送添加商品的请求的，只不过商品的属性有点多，需要把我们的对象ruleForm整理清楚才能发送

      // this.$http.post('goods',this.ruleForm)
    },
  },
};
</script>

<style lang="less" scoped>
.el-tabs {
  margin: 15px;
}

.el-steps {
  margin: 15px;
}
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 0;
  margin-bottom: 15px;
}
</style>
