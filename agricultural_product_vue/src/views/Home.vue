<template>
  <div class="home-container">
    <header class="header">
      <div class="header-title">农产品溯源管理系统</div>
      <div class="header-user-info">
        当前用户: {{ currentUser }}
        <a href="#" @click="goToPersonal" class="header-link">个人信息</a>
        <a href="#" @click="logout" class="header-link">退出</a>
      </div>
    </header>
    <div class="main-container">
      <nav class="sidebar">
        <ul class="sidebar-menu">
          <li>
            <router-link
              to="/product"
              class="sidebar-item"
              active-class="active"
            >
              农产品信息
            </router-link>
          </li>
          <li>
            <router-link
              to="/ProductionPlace"
              class="sidebar-item"
              active-class="active"
            >
              产地信息
            </router-link>
          </li>
          <li>
            <router-link
              to="/production"
              class="sidebar-item"
              active-class="active"
            >
              生产信息
            </router-link>
          </li>

          <li>
            <router-link
              to="/company"
              class="sidebar-item"
              active-class="active"
            >
              物流公司
            </router-link>
          </li>

          <li>
            <router-link
              to="/logistics"
              class="sidebar-item"
              active-class="active"
            >
              物流信息
            </router-link>
          </li>
          <li>
            <router-link
              to="/salePlace"
              class="sidebar-item"
              active-class="active"
            >
              销售地信息
            </router-link>
          </li>
          <li>
            <router-link to="/sales" class="sidebar-item" active-class="active">
              销售信息
            </router-link>
          </li>
        </ul>
      </nav>
      <main class="content">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const currentUser = ref("");

    onMounted(() => {
      currentUser.value = localStorage.getItem("username");
    });

    const logout = () => {
      if (confirm("您确定要退出吗？")) {
        localStorage.removeItem("username");
        router.push("/");
      }
    };

    const goToPersonal = () => {
      router.push("/personal");
    };

    return {
      currentUser,
      logout,
      goToPersonal,
    };
  },
};
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #0088cc, #006699);
  color: white;
  padding: 0 20px;
  height: 70px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 1px;
}

.header-user-info {
  display: flex;
  align-items: center;
  font-size: 16px;
}

.header-link {
  color: white;
  margin-left: 20px;
  text-decoration: none;
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.header-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main-container {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 220px;
  background-color: #2c3e50;
  color: white;
  padding: 20px 10px;
  max-height: 100%;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-menu {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar-item {
  display: block;
  padding: 12px 15px;
  margin: 5px 0;
  color: white;
  text-decoration: none;
  font-size: 18px;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
  text-align: center;
}

.sidebar-item:hover {
  background-color: #34495e;
  color: #1abc9c;
}

.sidebar-item.active {
  background-color: #1abc9c;
  color: white;
  font-weight: bold;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #f4f4f4;
  max-height: 100%;
  overflow-y: auto;
}

.console {
  background-color: white;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.console-title {
  font-size: 16px;
  margin-bottom: 5px;
}

.welcome-text {
  font-size: 14px;
  color: #666;
}
</style>