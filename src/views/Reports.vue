<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-form>
        <el-row>
          <el-col :span="16">
            <div id="main2" style="height:400px;width:750px"></div>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "Reports",
  data() {
    return {
      list: null,
    };
  },
  created() {},
  mounted() {
    // this.initCharts();
    this.getList();
  },
  methods: {
    async getList() {
      const { data: res } = await this.$http.get("reports/type/1");
      this.list = res.data;
      this.initLine();
    },

    initLine() {
      var myChart = echarts.init(document.getElementById("main2"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "用户来源",
        },
        tooltip: {
          // trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },

        legend: {
          data: [],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: false,
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "",
            type: "line",
            stack: "",
            data: [],
          },
        ],
      });

      // 发请求获取数据
      myChart.setOption(this.list);
    },
  },
};
</script>

<style lang="less" scoped>
#main2 {
  padding-top: 15px;
}
</style>
