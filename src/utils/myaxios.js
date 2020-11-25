import Axios from "axios";
import NProgress from "nprogress";

Axios.defaults.baseURL = "http://m.leijiuling.com/api/private/v1/";
// Axios.defaults.headers.common['Authorization'] = window.localStorage.getItem('shopping_token');

//白名单:不需要校验权限的
const whiteList = ["/login", "/register", "/about", "/index", "/list"];

//拦截器：在所有请求发出去之前，会拦截你，进行一些处理以后再发送给服务器
// 添加请求拦截器
Axios.interceptors.request.use(
    function(config) {
        NProgress.start();
        // 在发送请求之前做些什么
        if (!whiteList.includes(config.url)) {
            config.headers.common["Authorization"] = window.localStorage.getItem(
                "shopping_token"
            );
        }
        return config;
    },
    function(error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器：使有请求返回给你页面的请求之前，先经过响应拦截器处理一下数据结构
Axios.interceptors.response.use(
    function(response) {
        NProgress.done();
        // 对响应数据做点什么
        return response;
    },
    function(error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);
export default Axios;