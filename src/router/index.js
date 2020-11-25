import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import Welcome from "../views/Welcome.vue";
import Users from "../views/Users.vue";
import Rights from "../views/Rights.vue";
import Roles from "../views/Roles.vue";
import Goods from "../views/Goods.vue";
import Params from "../views/Params.vue";
import Categories from "../views/Categories.vue";
import Orders from "../views/Orders.vue";
import Reports from "../views/Reports.vue";
import GoodsAdd from "../views/GoodsAdd.vue";

Vue.use(VueRouter);

const routes = [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    {
        path: "/home",
        component: Home,

        //路由重定向，显示welcome界面内容
        redirect: "/welcome",
        children: [
            { path: "/welcome", component: Welcome },
            { path: "/users", component: Users },
            { path: "/rights", component: Rights },
            { path: "/roles", component: Roles },
            { path: "/goods", component: Goods },
            { path: "/params", component: Params },
            { path: "/categories", component: Categories },
            { path: "/orders", component: Orders },
            { path: "/reports", component: Reports },
            { path: "/goods/add", component: GoodsAdd },
        ],
    },
];

const router = new VueRouter({
    routes,
});

//添加路由守卫
//用户在访问任何页面之前，一定要做个判断再让用户跳转，这个是用户路由权限控制
router.beforeEach((to, from, next) => {
    //对于全部页面要做一个校验，只有登录过后才能进入主页，否则不让进去
    const tokenStr = window.localStorage.getItem("shopping_token");

    if (to.path === "/login") return next();
    if (!tokenStr) return next("/login");
    next();
});
export default router;