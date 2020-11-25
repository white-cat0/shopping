<template>
  <el-container>
    <el-header>
      <!-- 头部区域 -->
      <!-- 头部logo区域 -->
      <div class="logo-left">
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>

      <!-- 退出按钮 -->
      <div class="logo-right">
        <el-button type="info" @click="loginOut">退出</el-button>
      </div>
    </el-header>

    <el-container>
      <!-- aside 侧边栏区域 -->
      <el-aside :width="collapse ? '64px' : '200px'">
        <el-menu
          :default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="#373d41"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="collapse"
          :collapse-transition="false"
          router
        >
          <div class="toggle-menu" @click="collapse = !collapse">|||</div>
          <!--三个方法：1.item.id.toString() 2.item.id +'' 3.String(item.id)  -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + childItem.path"
              v-for="childItem in item.children"
              :key="childItem.id"
              @click="goNewPage('/' + childItem.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{ childItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- main主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");

    //初始化进入页面的默认高亮
    if (this.$route.redriectedFrom === "/home") {
      this.activePath = "";
    } else {
      this.activePath = window.sessionStorage.getItem("activePath") || "/users";
    }
  },
  data() {
    return {
      menuList: [], //侧边栏数据
      collapse: false,
      activePath: "",
      iconList: {
        "125": "el-icon-user-solid",
        "103": "el-icon-lock",
        "101": "el-icon-s-shop",
        "102": "el-icon-tickets",
        "145": "el-icon-s-data",
      },
    };
  },
  methods: {
    async getMenuList() {
      const { data: res } = await this.$http.get("/menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      //   this.$message.success(res.meta.msg)
      //渲染导航栏
      this.menuList = res.data;
    },
    goNewPage(val) {
      this.activePath = val;
      window.sessionStorage.setItem("activePath", val);
    },

    loginOut() {
      //这个退出就是删除token值
      window.localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo-left {
    margin-left: -20px;
    font-size: 20px;
    display: flex;
    align-items: center;
    img {
      height: 60px;
    }
    span {
      color: #fff;
      margin-left: 10px;
    }
  }
}
.el-menu {
  border-right: none;
  .toggle-menu {
    padding: 5px 0;
    text-align: center;
    cursor: pointer;
    // 字符间距
    letter-spacing: 0.1em;
    font-size: 10px;
    background-color: rgb(84, 83, 83);
  }
}
.el-aside {
  color: #fff;
  background-color: #373d41;
}
</style>
