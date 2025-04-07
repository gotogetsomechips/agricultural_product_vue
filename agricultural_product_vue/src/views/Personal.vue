<template>
  <div class="personal-info-container">
    <h2 class="personal-info-title">个人信息</h2>
    <div class="info-wrapper">
      <div class="info-item">
        <label>用户名:</label>
        <div class="info-content">
          <input v-if="isEditing" v-model="personalInfo.username" type="text" />
          <span v-else>{{ personalInfo.username }}</span>
        </div>
      </div>
      <div class="info-item">
        <label>性别：</label>
        <div class="info-content">
          <div v-if="isEditing">
            <input
              type="radio"
              id="male"
              v-model="personalInfo.gender"
              value="男"
            />男
            <input
              type="radio"
              id="female"
              v-model="personalInfo.gender"
              value="女"
            />女
          </div>
          <span v-else>{{ personalInfo.gender }}</span>
        </div>
      </div>
      <div class="info-item">
        <label>昵称：</label>
        <div class="info-content">
          <input v-if="isEditing" v-model="personalInfo.name" type="text" />
          <span v-else>{{ personalInfo.name }}</span>
        </div>
      </div>
      <div class="info-item">
        <label>手机号：</label>
        <div class="info-content">
          <input v-if="isEditing" v-model="personalInfo.phone" type="text" />
          <span v-else>{{ personalInfo.phone }}</span>
        </div>
      </div>
    </div>
    <div class="button-group">
      <button @click="editInfo" class="primary-button">编辑</button>
      <button @click="saveInfo" class="success-button" v-if="isEditing">
        保存
      </button>
      <a
        href="#"
        @click="showChangePasswordModal = true"
        class="change-password-link"
        >修改密码?</a
      >
    </div>

    <!-- 修改密码模态框 -->
    <div
      v-if="showChangePasswordModal"
      class="modal-overlay"
      @click="hideChangePasswordModal"
    >
      <div class="modal" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h2>修改密码</h2>
            <button class="close-button" @click="hideChangePasswordModal">
              ×
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="oldPassword">旧密码:</label>
              <input type="password" id="oldPassword" v-model="oldPassword" />
            </div>
            <div class="form-group">
              <label for="newPassword">新密码:</label>
              <input type="password" id="newPassword" v-model="newPassword" />
            </div>
            <div class="form-group">
              <label for="confirmPassword">确认新密码:</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="save-button" @click="changePassword">保存</button>
            <button class="back-button" @click="hideChangePasswordModal">
              返回
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const personalInfo = ref({
      id: "",
      username: "",
      gender: "",
      name: "",
      phone: "",
    });
    const isEditing = ref(false);
    const showChangePasswordModal = ref(false);
    const oldPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");
    const token = localStorage.getItem("token");

    onMounted(() => {
      getUserInfo();
    });

    const getUserInfo = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/user/userInfo",
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.data.code === 1) {
          personalInfo.value = {
            id: response.data.data.id,
            username: response.data.data.username,
            gender: response.data.data.sex,
            name: response.data.data.name,
            phone: response.data.data.phone,
          };
        } else {
          alert(response.data.msg);
        }
      } catch (error) {
        console.error("查询失败:", error);
        alert("查询失败，请稍后重试");
      }
    };

    const editInfo = () => {
      isEditing.value = true;
    };

    const saveInfo = async () => {
      if (!personalInfo.value.username) {
        alert("用户名不能为空");
        return;
      }
      try {
        const response = await axios.put(
          "http://localhost:8080/user/update",
          {
            id: personalInfo.value.id,
            username: personalInfo.value.username,
            sex: personalInfo.value.gender,
            name: personalInfo.value.name,
            phone: personalInfo.value.phone,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.data.code === 1) {
          isEditing.value = false;
          getUserInfo();
          alert("信息更改成功");
        } else {
          alert(response.data.msg);
        }
      } catch (error) {
        console.error("更改失败:", error);
        alert("更改失败，请稍后重试");
      }
    };

    const hideChangePasswordModal = () => {
      showChangePasswordModal.value = false;
    };

    const changePassword = async () => {
      if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
        alert("请填写完整的信息！");
        return;
      }
      if (newPassword.value.length < 6|| newPassword.value.length > 16||confirmPassword.value.length < 6||confirmPassword.value.length > 16) {
        alert("新密码长度应为6-16位！");
        return;
      }
      const regex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{2,16}$/;
      if (!regex.test(newPassword.value)||!regex.test(confirmPassword.value)) {
        alert("新密码必须包含至少一个数字、一个大写字母和一个小写字母");
        return;
      }
      if (newPassword.value !== confirmPassword.value) {
        alert("新密码和确认密码不一致");
        return;
      }
      try {
        const response = await axios.put(
          "http://localhost:8080/user/editPassword",
          {
            oldPassword: oldPassword.value,
            newPassword: newPassword.value,
            confirmPassword: confirmPassword.value,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.data.code === 1) {
          alert("密码修改成功");
          hideChangePasswordModal();
        } else {
          alert(response.data.msg);
        }
      } catch (error) {
        console.error("更改失败:", error);
      }
    };

    return {
      personalInfo,
      isEditing,
      showChangePasswordModal,
      oldPassword,
      newPassword,
      confirmPassword,
      editInfo,
      saveInfo,
      hideChangePasswordModal,
      changePassword,
    };
  },
};
</script>

<style scoped>
/* 新增背景渐变 */
body {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.personal-info-container {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  min-width: 800px;
  min-height: 550px;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -55%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.personal-info-title {
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 30px;
  text-align: center;
  color: #2c3e50;
  padding-bottom: 15px;
  position: relative;
}

.personal-info-title::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #f39c12, #00a65a);
  border-radius: 2px;
}

.info-wrapper {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px;
  background-color: rgba(245, 247, 250, 0.8);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.info-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.info-item label {
  width: 150px;
  font-weight: 600;
  text-align: right;
  font-size: 18px;
  color: #4a5568;
}

.info-content {
  flex: 1;
  font-size: 20px;
  color: #2d3748;
}

.info-content input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.info-content input:focus {
  outline: none;
  border-color: #f39c12;
  box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.1);
}

/* 新增单选框样式 */
.info-content input[type="radio"] {
  width: 16px;
  height: 16px;
  margin: 0 8px 0 0;
  cursor: pointer;
}

.info-content input[type="radio"] + label {
  margin-right: 20px;
  font-size: 16px;
  color: #4a5568;
  cursor: pointer;
}

.info-content input[type="radio"]:checked + label {
  color: #f39c12;
}

.button-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
}

.primary-button, .success-button {
  border: none;
  padding: 15px 30px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.primary-button {
  background: linear-gradient(135deg, #f39c12, #e08e0b);
  color: white;
}

.success-button {
  background: linear-gradient(135deg, #00a65a, #008d4c);
  color: white;
}

.primary-button:hover, .success-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 确保模态框位于最顶层 */
  backdrop-filter: blur(5px); /* 新增模糊效果 */
}

.modal {
  background-color: white;
  border-radius: 20px;
  padding: 30px;
  width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
  z-index: 1001; /* 确保模态框内容位于最顶层 */
  border: 1px solid rgba(255, 255, 255, 0.3); /* 新增边框 */
  backdrop-filter: blur(10px); /* 新增模糊效果 */
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #f39c12;
}

.modal-body .form-group {
  margin-bottom: 20px;
}

.modal-body .form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #4a5568;
}

.modal-body .form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.modal-body .form-group input:focus {
  outline: none;
  border-color: #00a65a;
  box-shadow: 0 0 0 3px rgba(0, 166, 90, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.save-button, .back-button {
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.save-button {
  background: linear-gradient(135deg, #00a65a, #008d4c);
  color: white;
}

.back-button {
  background: linear-gradient(135deg, #f39c12, #e08e0b);
  color: white;
}

.save-button:hover, .back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
</style>