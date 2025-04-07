<template>
  <div class="register-container">
    <div class="bg-image"></div>
    <div class="register-form">
      <h2>注册</h2>
      <div class="input-group">
        <i class="el-icon-user"></i>
        <input type="text" v-model="name" placeholder="请输入用户名" />
      </div>
      <div class="input-group">
        <i class="el-icon-lock"></i>
        <input type="password" v-model="pwd" placeholder="请输入密码" />
      </div>
      <div class="button-login">
        <button class="primary-button" @click="register">
          <span>注册</span>
        </button>
        <button class="secondary-button" @click="resetForm">
          <span>重置</span>
        </button>
      </div>
      <div class="login-link">
        <a href="#" @click.prevent="goToLogin">已有账号？立即登录</a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const name = ref("");
    const pwd = ref("");
    const router = useRouter();

    const register = async () => {
      const username = name.value;
      const password = pwd.value;
      if (!username || !password) {
        alert('请输入用户名和密码');
        return;
      }
      if (username.length < 2 || username.length > 16) {
        alert('用户名长度需在2到16位之间');
        return;
      }
      if (password.length < 6 || password.length > 16) {
        alert('密码长度需在6到16位之间');
        return;
      }
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{2,16}$/;
      if (!regex.test(password)) {
        alert('密码必须包含至少一个数字、一个大写字母和一个小写字母');
        return;
      }
      try {
        const response = await axios.post('http://localhost:8080/user/register', {
          username: name.value,
          password: pwd.value
        });
        if (response.data.code === 1) {
          alert("注册成功，请重新登录");
          localStorage.setItem("token", response.data.data); // 保存token
          router.push('/');
        } else {
          alert(response.data.msg);
        }
      } catch (error) {
        console.error('注册失败:', error);
        alert('注册失败，请稍后重试');
      }
    };

    const resetForm = () => {
      name.value = '';
      pwd.value = '';
    };

    const goToLogin = () => {
      router.push('/');
    };

    return {
      name,
      pwd,
      register,
      resetForm,
      goToLogin
    };
  }
}
</script>

<style scoped>
.register-container {
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

.register-form {
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

.login-link {
  text-align: center;
  margin-top: 25px;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.login-link a:hover {
  color: #0056b3;
  text-decoration: underline;
}
</style>