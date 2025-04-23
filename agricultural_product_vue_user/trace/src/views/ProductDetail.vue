<template>
  <div class="product-detail-container">
    <!-- 右上角返回和购物车按钮 -->
    <div class="top-right-buttons">
      <button @click="goBack" class="custom-button">返回</button>
      <button @click="goToCart" class="custom-button">购物车</button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton style="width: 100%" animated :rows="10" />
    </div>

    <!-- 无数据提示 -->
    <div v-else-if="!productData" class="empty-container">
      <el-empty description="未找到产品信息" />
      <el-button type="primary" @click="goBack">返回首页</el-button>
    </div>

    <!-- 数据内容展示 -->
    <div v-else class="data-container">
      <div class="product-header">
        <h1 class="product-title">{{ productData.pdName }}</h1>
        <p class="product-type">类别: {{ productData.type }}</p>
        <p class="product-price">价格: ￥{{ productData.unitPrice.Float64.toFixed(2) }}</p>
        <!-- <p class="product-trace-code">溯源码: {{ saleInfoId }}</p> -->
      </div>
      <div class="product-content">
        <div class="product-image">
          <el-image
            :src="productData.image"
            fit="cover"
            class="product-image-element">
            <template #error>
              <div class="image-placeholder">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
        </div>
        <div class="product-description">
          <h2>产品描述</h2>
          <p>{{ productData.pdDescription }}</p>
        </div>
      </div>
      <div class="quantity-and-add">
        <el-input-number v-model="quantity" :min="1" :max="10" />
        <el-button type="primary" @click="addToCart" class="add-to-cart-button">添加到购物车</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Picture } from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const productData = ref(null)
const saleInfoId = ref('')
const quantity = ref(1)

// 返回首页
const goBack = () => {
  router.go(-1)
}

// 跳转到购物车页面
const goToCart = () => {
  router.push('/cart')
}

// 添加到购物车
const addToCart = () => {
  if (productData.value) {
    try {
      // 从localStorage获取购物车数据
      const cart = JSON.parse(localStorage.getItem('cart')) || []

      // 检查是否已存在相同商品
      const existingItemIndex = cart.findIndex(item => item.pdId === productData.value.pdId)

      if (existingItemIndex >= 0) {
        // 如果已存在，更新数量
        cart[existingItemIndex].quantity += quantity.value
      } else {
        // 如果不存在，添加新商品
        cart.push({
          pdId: productData.value.pdId,
          pdName: productData.value.pdName,
          image: productData.value.image,
          unitPrice: productData.value.unitPrice.Float64,
          quantity: quantity.value,
          type: productData.value.type,
          saleInfoId: saleInfoId.value
        })
      }

      // 保存回localStorage
      localStorage.setItem('cart', JSON.stringify(cart))
      ElMessage.success('已添加到购物车')
    } catch (error) {
      console.error('添加到购物车失败:', error)
      ElMessage.error('添加到购物车失败')
    }
  }
}

// 获取商品详细信息
const fetchProductDetail = async () => {
  try {
    loading.value = true
    const productId = route.params.id
    const token = localStorage.getItem("token")
    // 获取商品详情
    const productResponse = await axios.get(`http://localhost:8080/product/${productId}`, {
      headers: {
        Authorization: token
      }
    })

    if (productResponse.data.code === 200) {
      productData.value = productResponse.data.data
      // 假设销售信息和商品通过productId关联，通过销售信息接口获取saleInfoId
      const saleInfoResponse = await axios.get(`http://localhost:8080/saleinfo/${productId}`, {
        headers: {
          Authorization: token
        }
      })
      if (saleInfoResponse.data.code === 200) {
        saleInfoId.value = saleInfoResponse.data.data.saleInfoId
      } else {
        console.error('获取溯源码失败:', saleInfoResponse.data.msg)
      }
    } else {
      console.error("获取产品详情失败:", productResponse.data.msg)
    }
  } catch (error) {
    console.error("获取产品详情失败:", error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProductDetail()
})
</script>

<style scoped>
.product-detail-container {
  padding: 40px;
  background: linear-gradient(135deg, #f4f4f4, #eaeaea);
  min-height: 100vh;
  position: relative;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.top-right-buttons {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

.custom-button {
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.custom-button:hover {
  background-color: #0056b3;
}

.loading-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.empty-container {
  padding: 20px;
  text-align: center;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.data-container {
  padding: 40px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.product-header {
  text-align: center;
  margin-bottom: 40px;
}

.product-title {
  font-size: 36px;
  color: #333;
  margin-bottom: 10px;
}

.product-type {
  color: #666;
  margin-bottom: 5px;
}

.product-price {
  color: #e44d26;
  font-weight: bold;
  font-size: 24px;
}

.product-trace-code {
  color: #333;
  margin-top: 5px;
}

.product-content {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: center;
  align-items: center;
}

.product-image {
  flex: 1;
  min-width: 300px;
  max-width: 500px;
}

.product-image-element {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.product-image-element:hover {
  transform: scale(1.05);
}

.product-description {
  flex: 1;
  min-width: 300px;
  max-width: 500px;
}

.product-description h2 {
  margin-top: 0;
  font-size: 24px;
  color: #333;
}

.quantity-and-add {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  justify-content: center; /* 新增样式，使内容水平居中 */
}

.add-to-cart-button {
  padding: 12px 24px;
  font-size: 18px;
}
</style>