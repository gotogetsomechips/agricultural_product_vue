<template>
    <div class="cart-container">
      <!-- 返回按钮 -->
      <div class="top-left-button">
        <el-button @click="goBack">返回</el-button>
      </div>
      
      <h1 class="cart-title">购物车</h1>
      
      <!-- 空购物车提示 -->
      <div v-if="cartItems.length === 0" class="empty-cart">
        <el-empty description="购物车空空如也" />
        <el-button type="primary" @click="goBack">去逛逛</el-button>
      </div>
      
      <!-- 购物车列表 -->
      <div v-else class="cart-content">
        <el-table :data="cartItems" style="width: 100%">
          <el-table-column prop="image" label="图片" width="120">
            <template #default="scope">
              <el-image 
                :src="scope.row.image" 
                fit="cover"
                style="width: 80px; height: 80px">
                <template #error>
                  <div class="image-placeholder">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="pdName" label="商品名称" />
          <el-table-column prop="unitPrice" label="单价" width="120">
            <template #default="scope">
              ￥{{ scope.row.unitPrice.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="150">
            <template #default="scope">
              <el-input-number 
                v-model="scope.row.quantity" 
                :min="1" 
                :max="10"
                @change="updateCart" 
                style="padding-right: 0;">
              </el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="小计" width="120">
            <template #default="scope">
              ￥{{ (scope.row.unitPrice * scope.row.quantity).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="scope">
              <el-button 
                type="danger" 
                size="small" 
                @click="removeItem(scope.row.pdId)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div class="cart-summary">
          <div class="total-amount">
            总计: ￥{{ totalAmount.toFixed(2) }}
          </div>
          <el-button type="primary" size="large" @click="checkout">
            结算
          </el-button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { Picture } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  
  const router = useRouter()
  const cartItems = ref([])
  
  // 计算总金额
  const totalAmount = computed(() => {
    return cartItems.value.reduce((sum, item) => {
      return sum + (item.unitPrice * item.quantity)
    }, 0)
  })
  
  // 返回上一页
  const goBack = () => {
    router.go(-1)
  }
  
  // 加载购物车数据
  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    cartItems.value = cart
  }
  
  // 更新购物车到本地存储
  const updateCart = () => {
    localStorage.setItem('cart', JSON.stringify(cartItems.value))
  }
  
  // 删除商品
  const removeItem = (productId) => {
    ElMessageBox.confirm('确定要从购物车中删除此商品吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      cartItems.value = cartItems.value.filter(item => item.pdId !== productId)
      updateCart()
      ElMessage({
        message: '删除成功',
        type: 'success',
        duration: 3000 // 设置消息显示 3 秒后消失
      })
    }).catch(() => {
      // 用户取消操作
    })
  }
  
  // 结算
  const checkout = () => {
    ElMessageBox.confirm(`确定要结算吗? 总金额: ￥${totalAmount.value.toFixed(2)}`, '确认订单', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }).then(() => {
      // 这里可以添加结算逻辑，比如跳转到结算页面
      // 现在只是清空购物车作为示例
      localStorage.removeItem('cart')
      cartItems.value = []
      ElMessage({
        message: '结算成功',
        type: 'success',
        duration: 3000 // 设置消息显示 3 秒后消失
      })
    }).catch(() => {
      // 用户取消操作
    })
  }
  
  onMounted(() => {
    loadCart()
  })
  </script>
  
  <style scoped>
  .cart-container {
    padding: 20px;
    background-color: #f4f4f4;
    min-height: 100vh;
  }
  
  .top-left-button {
    margin-bottom: 20px;
  }
  
  .cart-title {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .empty-cart {
    text-align: center;
    padding: 50px 0;
  }
  
  .cart-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .cart-summary {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 4px;
  }
  
  .total-amount {
    font-size: 1.2em;
    font-weight: bold;
    margin-right: 30px;
  }
  
  .image-placeholder {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    color: #999;
  }
  </style>    