<template>
  <div class="shop-container">
    <!-- 右上角登录、用户信息和购物车按钮 -->
    <div class="top-right-buttons">
      <div v-if="!isLoggedIn">
        <button @click="goToLogin">登录</button>
      </div>
      <div v-else>
        <span>欢迎，{{ userInfo.username }}</span>
        <button @click="handleLogout">退出账号</button>
      </div>
      <button @click="goToCart">购物车</button>
      <!-- 添加返回主页按钮 -->
      <button @click="goToHome">返回主页</button>
    </div>
    <h1 class="shop-title">AgriCareMall</h1>

    <div class="category-buttons">
      <button
        v-for="option in productTypeOptions"
        :key="option"
        @click="filterByType(option)"
        :class="{ 'active': selectedType === option }"
      >
        {{ option }}
      </button>
      <button @click="clearFilter" :class="{ 'active': selectedType === '' }">
        全部商品
      </button>
    </div>

    <div class="product-container">
      <div v-for="product in paginatedProducts" :key="product.pdId" class="product" @click="viewProductDetail(product)">
        <img :src="product.image" :alt="product.pdName" @error="handleImageError">
        <div class="product-info">
          <h3>{{ product.pdName }}</h3>
          <p>￥{{ product.unitPrice.toFixed(2) }}</p>
        </div>
      </div>
    </div>

    <div class="pagination" v-if="filteredProducts.length > pageSize">
      <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
      <span>第 {{ currentPage }} 页 / 共 {{ pageCount }} 页</span>
      <button @click="nextPage" :disabled="currentPage === pageCount">下一页</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const router = useRouter();
    const token = localStorage.getItem("token");
    const isLoggedIn = ref(!!token);
    const userInfo = ref({
      username: localStorage.getItem("username") || ""
    });

    // 商品数据和分页
    const productInfo = ref([]);
    const currentPage = ref(1);
    const pageSize = 12; 
    const selectedType = ref('');

    // 产品类型选项
    const productTypeOptions = ref([
      "水果",
      "蔬菜",
      "鲜花",
      "肉类",
      "奶制品",
      "其他",
    ]);

    // 图片加载失败处理
    const handleImageError = (event) => {
      event.target.src = 'https://via.placeholder.com/200x200?text=Product+Image';
    };

    // 根据类型筛选商品
    const filteredProducts = computed(() => {
      if (!selectedType.value) {
        return productInfo.value;
      }
      return productInfo.value.filter(product => product.type === selectedType.value);
    });

    // 计算总页数
    const pageCount = computed(() => {
      return Math.ceil(filteredProducts.value.length / pageSize);
    });

    // 当前页面显示的商品
    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      const end = start + pageSize;
      return filteredProducts.value.slice(start, end);
    });

    // 加载所有商品
    const loadAllProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/product/list", {
          headers: {
            Authorization: token,
          },
        });

        if (response.data.code === 200) {
          productInfo.value = response.data.data;
        } else {
          console.error("获取产品列表失败:", response.data.msg);
        }
      } catch (error) {
        console.error("获取产品列表失败:", error);
      }
    };

    // 根据类型筛选商品
    const filterByType = (type) => {
      selectedType.value = type;
      currentPage.value = 1; 
    };

    // 清除筛选
    const clearFilter = () => {
      selectedType.value = '';
      currentPage.value = 1; 
    };

    // 上一页
    const prevPage = () => {
      if (currentPage.value > 1) {
      currentPage.value--;
      }
    };

    // 下一页
    const nextPage = () => {
      if (currentPage.value < pageCount.value) {
      currentPage.value++;
      }
    };

    // 查看商品详情
    const viewProductDetail = (product) => {
      router.push(`/productinfo/${product.pdId}`);
    };

    // 跳转到登录页面
    const goToLogin = () => {
      router.push('/login');
    };

    // 跳转到购物车页面
    const goToCart = () => {
      router.push('/cart');
    };

    // 退出账号
    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      isLoggedIn.value = false;
      userInfo.value = {};
      // 重定向到Shop页面
      router.push('/Shop'); 
    };

    // 获取用户信息的方法
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:8080/user/userInfo", {
          headers: {
            Authorization: token,
          },
        });

        if (response.data.code === 200) {
          userInfo.value = response.data.data;
          localStorage.setItem("userInfo", JSON.stringify(response.data.data));
        } else {
          console.error("获取用户信息失败:", response.data.msg);
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    };

    // 跳转到主页的方法
    const goToHome = () => {
      router.push('/');
    };

    // 页面加载时获取所有产品和用户信息
    onMounted(() => {
      loadAllProducts();
      if (isLoggedIn.value) {
        fetchUserInfo();
      }
    });

    // 监听 token 的变化，更新登录状态和用户信息
    watch(() => localStorage.getItem("token"), (newToken) => {
      isLoggedIn.value = !!newToken;
      if (isLoggedIn.value) {
        fetchUserInfo();
      } else {
        userInfo.value = {};
        localStorage.removeItem("username");
      }
    });

    return {
      isLoggedIn,
      userInfo,
      productInfo,
      productTypeOptions,
      currentPage,
      pageSize,
      pageCount,
      selectedType,
      filteredProducts,
      paginatedProducts,
      loadAllProducts,
      filterByType,
      clearFilter,
      prevPage,
      nextPage,
      viewProductDetail,
      handleImageError,
      goToLogin,
      goToCart,
      handleLogout,
      goToHome
    };
  }
};
</script>

<style scoped>
/* 样式部分保持不变 */
.shop-container {
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
  position: relative;
}

.shop-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 28px;
}

.top-right-buttons {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.category-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.category-buttons button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-buttons button:hover {
  background-color: #f0f0f0;
}

.category-buttons button.active {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.product-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
}

.product {
  width: calc(25% - 20px);
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out, opacity 0.5s ease;
  margin-bottom: 20px;
  cursor: pointer;
}

.product:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.product img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
}

.product-info {
  padding: 15px;
  text-align: center;
}

.product-info h3 {
  margin: 0;
  font-size: 1.2em;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-info p {
  margin: 10px 0;
  font-size: 1em;
  color: #e44d26;
  font-weight: bold;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button:not(:disabled):hover {
  background-color: #f0f0f0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
 .product {
    width: calc(33.33% - 20px);
  }
}

@media (max-width: 768px) {
 .product {
    width: calc(50% - 15px);
  }
}

@media (max-width: 480px) {
 .product {
    width: 100%;
  }

 .category-buttons {
    gap: 5px;
  }

 .category-buttons button {
    padding: 6px 12px;
    font-size: 0.9em;
  }

 .product-info h3 {
    font-size: 1em;
  }
}
</style>