<template>
  <div class="personal-info-container">
    <h2 class="personal-info-title">个人信息</h2>
    <div v-if="loading" class="loading-spinner">加载中...</div>
    <div v-else class="info-wrapper">
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
          <div v-if="isEditing" class="radio-group">
            <input
                type="radio"
                id="male"
                v-model="personalInfo.gender"
                value="男"
            />
            <label for="male">男</label>
            <input
                type="radio"
                id="female"
                v-model="personalInfo.gender"
                value="女"
            />
            <label for="female">女</label>
          </div>
          <span v-else>{{ personalInfo.gender || '未设置' }}</span>
        </div>
      </div>
      <div class="info-item">
        <label>昵称：</label>
        <div class="info-content">
          <input v-if="isEditing" v-model="personalInfo.name" type="text" />
          <span v-else>{{ personalInfo.name || '未设置' }}</span>
        </div>
      </div>
      <div class="info-item">
        <label>手机号：</label>
        <div class="info-content">
          <input v-if="isEditing" v-model="personalInfo.phone" type="text" />
          <span v-else>{{ personalInfo.phone || '未设置' }}</span>
        </div>
      </div>
    </div>
    <div class="button-group">
      <button v-if="!isEditing" @click="editInfo" class="primary-button">编辑</button>
      <template v-else>
        <button @click="saveInfo" class="success-button">保存</button>
        <button @click="cancelEdit" class="cancel-button">取消</button>
      </template>
      <a
          href="#"
          @click.prevent="showChangePasswordModal = true"
          class="change-password-link"
      >修改密码</a
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
              <small class="password-hint">
                密码长度为6-16位，必须包含至少一个数字、一个大写字母和一个小写字母
              </small>
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

    <!-- 提示窗口 -->
    <div v-if="notification.show" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
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

    const backupInfo = ref({});
    const isEditing = ref(false);
    const loading = ref(true);
    const showChangePasswordModal = ref(false);
    const oldPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");
    const token = localStorage.getItem("token");
    const notification = reactive({
      show: false,
      message: "",
      type: "success"
    });

    // 创建axios实例，设置默认请求头
    const api = axios.create({
      baseURL: "http://localhost:8080",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    // 显示通知
    const showNotification = (message, type = "success") => {
      notification.show = true;
      notification.message = message;
      notification.type = type;

      // 3秒后自动隐藏通知
      setTimeout(() => {
        notification.show = false;
      }, 3000);
    };

    onMounted(() => {
      if (!token) {
        showNotification("未登录，请先登录", "error");
        // 可以在这里添加重定向到登录页面的逻辑
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }
      getUserInfo();
    });

    const getUserInfo = async () => {
      loading.value = true;
      try {
        const response = await api.get("/user/userInfo");
        if (response.data.code === 200) {
          personalInfo.value = {
            id: response.data.data.id,
            username: response.data.data.username,
            gender: response.data.data.sex && response.data.data.sex.Valid ? response.data.data.sex.String : "",
            name: response.data.data.name && response.data.data.name.Valid ? response.data.data.name.String : "",
            phone: response.data.data.phone && response.data.data.phone.Valid ? response.data.data.phone.String : "",
          };
          // 保存原始数据用于取消编辑
          backupInfo.value = {...personalInfo.value};
        } else {
          showNotification(response.data.msg || "获取信息失败", "error");
        }
      } catch (error) {
        console.error("查询失败:", error);
        if (error.response && error.response.status === 401) {
          showNotification("登录已过期，请重新登录", "error");
          setTimeout(() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }, 2000);
        } else {
          showNotification("查询失败，请稍后重试", "error");
        }
      } finally {
        loading.value = false;
      }
    };

    const editInfo = () => {
      isEditing.value = true;
      // 备份当前数据，用于取消编辑时恢复
      backupInfo.value = { ...personalInfo.value };
    };

    const cancelEdit = () => {
      // 恢复原始数据
      personalInfo.value = { ...backupInfo.value };
      isEditing.value = false;
    };

    const saveInfo = async () => {
      if (!personalInfo.value.username) {
        showNotification("用户名不能为空", "error");
        return;
      }

      try {
        const response = await api.put("/user/update", {
          id: personalInfo.value.id,
          username: personalInfo.value.username,
          sex: personalInfo.value.gender,
          name: personalInfo.value.name,
          phone: personalInfo.value.phone,
        });

        if (response.data.code === 200) {
          isEditing.value = false;
          getUserInfo(); // 重新获取最新数据
          showNotification("信息更改成功");
        } else {
          showNotification(response.data.msg || "更新失败", "error");
        }
      } catch (error) {
        console.error("更改失败:", error);
        showNotification("更改失败，请稍后重试", "error");
      }
    };

    const hideChangePasswordModal = () => {
      showChangePasswordModal.value = false;
      // 清空密码字段
      oldPassword.value = "";
      newPassword.value = "";
      confirmPassword.value = "";
    };

    const validatePassword = (password) => {
      // 验证密码是否符合规则：6-16位，包含至少一个数字、一个大写字母和一个小写字母
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,16}$/;
      return regex.test(password);
    };

    const changePassword = async () => {
      // 前端验证
      if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
        showNotification("请填写完整的密码信息", "error");
        return;
      }

      if (newPassword.value.length < 6 || newPassword.value.length > 16) {
        showNotification("新密码长度应为6-16位", "error");
        return;
      }

      if (!validatePassword(newPassword.value)) {
        showNotification("新密码必须包含至少一个数字、一个大写字母和一个小写字母", "error");
        return;
      }

      if (newPassword.value !== confirmPassword.value) {
        showNotification("新密码和确认密码不一致", "error");
        return;
      }

      try {
        const response = await api.put("/user/editPassword", {
          oldPassword: oldPassword.value,
          newPassword: newPassword.value,
          confirmPassword: confirmPassword.value,
        });

        if (response.data.code === 200) {
          showNotification("密码修改成功");
          hideChangePasswordModal();
        } else {
          showNotification(response.data.msg || "密码修改失败", "error");
        }
      } catch (error) {
        console.error("密码修改失败:", error);
        showNotification("密码修改失败，请稍后重试", "error");
      }
    };

    return {
      personalInfo,
      isEditing,
      loading,
      showChangePasswordModal,
      oldPassword,
      newPassword,
      confirmPassword,
      notification,
      editInfo,
      saveInfo,
      cancelEdit,
      hideChangePasswordModal,
      changePassword,
    };
  },
};
</script>

<style scoped>
/* 背景渐变 */
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
  position: relative;
  top: 50px;
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
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
  width: 100%;
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

/* 单选框样式 */
.radio-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.info-content input[type="radio"] {
  width: 16px;
  height: 16px;
  margin: 0;
  cursor: pointer;
}

.info-content input[type="radio"] + label {
  font-size: 16px;
  color: #4a5568;
  cursor: pointer;
  margin-right: 20px;
  width: auto;
  text-align: left;
}

.button-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  padding: 0 20px;
}

.primary-button, .success-button, .cancel-button {
  border: none;
  padding: 12px 28px;
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

.cancel-button {
  background: linear-gradient(135deg, #95a5a6, #7f8c8d);
  color: white;
  margin-left: 10px;
}

.primary-button:hover, .success-button:hover, .cancel-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.change-password-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-left: auto;
}

.change-password-link:hover {
  color: #2980b9;
  text-decoration: underline;
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
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal {
  background-color: white;
  border-radius: 20px;
  padding: 30px;
  width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
  z-index: 1001;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
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

.password-hint {
  display: block;
  color: #718096;
  font-size: 12px;
  margin-top: 5px;
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

/* 加载动画 */
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 20px;
  color: #f39c12;
}

/* 通知样式 */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 2000;
  animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-in 2.7s forwards;
}

.notification.success {
  background-color: #00a65a;
}

.notification.error {
  background-color: #e74c3c;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>