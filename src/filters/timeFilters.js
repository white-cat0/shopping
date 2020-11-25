import Vue from "vue";

//使用 moment.js 格式化时间
import moment from "moment";
Vue.filter("dataFormat", function(time) {
    //moment函数的参数可以不写，就是当前时间，如果要写就用 new Date()返回的日期对象当作参数
    return moment(new Date(time)).format("YYYY-MM-DD HH:mm:ss");
});

// // 自定义全局时间过滤器
// Vue.filter("dataFormat", function(time) {
//     const dt = new Date(time);
//     const y = dt.getFullYear();
//     const m = dt.getMonth() + 1;
//     const d = dt.getDate();
//     const hh = dt.getHours();
//     const mm = dt.getMinutes();
//     const ss = dt.getSeconds();
//     return `${y}-${m}-${d}-${hh}:${mm}:${ss}`;
// });

// 定义 ￥ 价格过滤器
Vue.filter("moneyFilter", function(money) {
    return "￥" + money.toFixed(2);
});