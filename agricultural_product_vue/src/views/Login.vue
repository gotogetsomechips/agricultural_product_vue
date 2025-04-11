<template>
  <div class="login-container">
    <div class="bg-image"></div>
    <div class="login-form">
      <h2>农产品溯源管理系统</h2>
      <div class="input-group">
        <i class="el-icon-user"></i>
        <input type="text" v-model="name" placeholder="请输入用户名" />
      </div>
      <div class="input-group">
        <i class="el-icon-lock"></i>
        <input type="password" v-model="pwd" placeholder="请输入密码" />
      </div>
      <div class="button-login">
        <button class="primary-button" @click="login">
          <span>登录</span>
        </button>
        <button class="secondary-button" @click="resetForm">
          <span>重置</span>
        </button>
      </div>
      <div class="register-link">
        <a href="#" @click.prevent="goToRegister">立即注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref, reactive } from "vue";
import axios from "axios";

export default {
  setup() {
    const name = ref("");
    const pwd = ref("");
    const router = useRouter();
    const login = async () => {
      const username = name.value;
      const password = pwd.value;
      if (!username || !password) {
        alert("请输入用户名和密码");
        return;
      }
      try {
        const response = await axios.post("http://localhost:8080/user/login", {
          username: name.value,
          password: pwd.value,
        });

        console.log("登录响应:", response.data); // 添加这行查看响应结构
        if (response.data.code === 200) {
          alert("登录成功");
          localStorage.setItem("username", name.value);
          localStorage.setItem("token", response.data.data); // 保存token
          router.push({
            path: "/home",
            query: { username: name.value },
          });
        } else {
          alert(response.data.msg);
        }
      } catch (error) {
        console.error("登录失败:", error);
        alert("登录失败，请稍后重试");
      }
    };
    const resetForm = () => {
      name.value = "";
      pwd.value = "";
    };
    const goToRegister = () => {
      router.push("/reg");
    };
    return {
      name,
      pwd,
      login,
      resetForm,
      goToRegister,
    };
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  position: relative;
}

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../assets/login.png');
  background-size: cover;
  background-position: center;
  filter: blur(2px);
  z-index: 0;
}

.login-form {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  z-index: 1;
  text-align: center;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  color: #333;
  position: relative;
  padding-bottom: 10px;
}

h2::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #28a745, #218838);
  border-radius: 2px;
}

.input-group {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.input-group i {
  margin-right: 10px;
  color: #28a745;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.3s ease;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
  outline: none;
}

.button-login {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.primary-button,
.secondary-button {
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.primary-button {
  background: linear-gradient(135deg, #28a745, #218838);
  color: white;
}

.secondary-button {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  margin-left: 20px;
}

.primary-button:hover,
.secondary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.register-link {
  text-align: center;
  margin-top: 25px;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.register-link a:hover {
  color: #0056b3;
  text-decoration: underline;
}
</style>