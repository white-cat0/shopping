<template>
  <div class="login-container">
    <div class="login-box">
      <!-- logo区域 -->
      <div class="login-logo">
        <img src="../assets/logo.png" alt />
      </div>

      <!-- logo表单区域 -->
      <div>
        <el-form
          ref="LoginForm"
          :model="form"
          :rules="rules"
          class="login-form"
        >
          <!-- 登录区域 -->
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              prefix-icon="el-icon-user"
              clearable
            ></el-input>
          </el-form-item>

          <!-- 密码区域 -->
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              prefix-icon="el-icon-lock"
              clearable
            ></el-input>
          </el-form-item>

          <!-- 登录重置区域 -->
          <el-form-item class="login-form-btn">
            <el-button type="primary" @click="submitLogin">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "admin",
        password: "123456",
      },
      //表单验证规则
      rules: {
        username: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //表单登录
    //登录请求方法一
    submitLogin() {
      this.$refs.LoginForm.validate(async (success, error) => {
        if (!success) return this.$message.error("格式不正确，请重新输入");
        const { data: res } = await this.$http.post("/login", {
          username: this.form.username,
          password: this.form.password,
        });

        //判断是否登录成功
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        //登陆成功以后，把服务器返回的token值保存起来，供后面使用
        window.localStorage.setItem("shopping_token", res.data.token);
        this.$message.success(res.meta.msg);

        this.$router.push("/home");

        // console.log(res);
      });
    },

    // //登录请求方法二
    //  submitLogin(){
    //   this.$refs.LoginForm.validate( (success,error) => {
    //     if(!success) return this.$message.error('格式不正确，请重新输入');
    //     this.$http.post('/login',{
    //       username:this.form.username,
    //       password:this.form.password,
    //     })
    //     .then((res)=>{
    //       console.log('请求成功',res);
    //     },
    //     (err)=>{
    //       console.log('请求失败',err);
    //     })
    //   })
    // },

    //表单重置
    resetLoginForm() {
      //resetFields() 是elementUI的方法
      this.$refs.LoginForm.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
// lang=less表示我们这里的css，使用的是less
//scoped这个单词加上了就表示当前我们的样式不影响外面的样式，如果不加上，就会影响外面的样式
.login-container {
  height: 100%;
  background-color: #2b4b6b;
  // display: flex;
  // justify-content: center;
  // align-items: center;
}
.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 4px;
  .login-logo {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
    width: 130px;
    height: 130px;
    border-radius: 50%;
    padding: 10px;
    border: 1px solid #eee;
    box-shadow: 0 0 10px #ccc;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login-form {
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    .login-form-btn {
      text-align: right;
    }
  }
}
</style>
