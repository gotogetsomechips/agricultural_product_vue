<template>
  <div class="home">
    <!-- 导航栏 -->
    <nav>
      <ul>
        <li><router-link to="/home/product">产品管理</router-link></li>
        <li><router-link to="/home/logistics">物流管理</router-link></li>
        <!-- 其他导航项 -->
      </ul>
    </nav>

    <!-- 子路由内容区域 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
}

nav {
  background-color: #f8f9fa;
  padding: 10px;
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}

nav ul li {
  margin-right: 10px;
}

nav ul li a {
  text-decoration: none;
  color: #333;
}

nav ul li a:hover {
  color: #007bff;
}
</style>