<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
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
            @clear="getOrdersList"
            class="search-input"
            placeholder="请输入内容"
            @keyup.enter.native="getOrdersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrdersList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="ordersList" stripe border style="width: 100%">
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>

        <el-table-column prop="order_price" label="订单价格">
          <template slot-scope="scope">
            {{ scope.row.order_price | moneyFilter }}
          </template>
        </el-table-column>

        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status == 0" type="danger"
              >未付款</el-tag
            >
            <el-tag v-else>已付款</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <div>
              <el-button
                size="small"
                type="primary"
                @click="addresDialogVisible = true"
                >编辑地址</el-button
              >
              <el-button
                size="small"
                type="danger"
                @click="checkDialogVisible = true"
                >查看物流</el-button
              >
            </div>
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

      <!-- 编辑地址区域 -->
      <el-dialog title="提示" :visible.sync="addresDialogVisible" width="30%">
        <el-cascader
          v-model="value"
          :options="options"
          @change="handleChange"
          :props="{ label: 'label', value: 'value', children: 'children' }"
        ></el-cascader>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addresDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addresDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 物流信息区域 -->
      <el-dialog title="提示" :visible.sync="checkDialogVisible" width="30%">
        <el-timeline>
          <el-timeline-item timestamp="2018/4/12" placement="top">
            <el-card>
              <h4>更新 Github 模板</h4>
              <p>王小虎 提交于 2018/4/12 20:46</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <span slot="footer" class="dialog-footer">
          <el-button @click="checkDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="checkDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import citydata from "../assets/citydata.js";
export default {
  name: "Orders",
  data() {
    return {
      addresDialogVisible: false,
      checkDialogVisible: false,
      query: "", //查询参数
      pagenum: 1, //当前页码
      pagesize: 10, //每页显示数据
      ordersList: [], //商品列表数据
      total: [],
      options: citydata,
      value: [],
    };
  },
  created() {
    this.getOrdersList();
  },
  methods: {
    async getOrdersList() {
      const { data: res } = await this.$http.get("orders", {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        },
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      console.log(res.data);
      this.ordersList = res.data.goods;
      this.total = res.data.total;
    },

    //每页显示的条数发生改变而触发的函数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.getOrdersList();
    },

    // 页码值发生改变而触发的函数
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getOrdersList();
    },

    handleChange() {},
  },
};
</script>

<style lang="less" scoped>
.el-table {
  font-size: 12px;
}
</style>
