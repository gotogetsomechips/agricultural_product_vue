<template>
  <div class="floating-nav" :style="{ top: `${offsetY}px` }">
    <router-link to="/" class="nav-circle">
      <span class="circle-text">溯源产品</span>
    </router-link>
    <router-link 
      v-if="showProductNav && productId" 
      :to="`/product/${productId}`" 
      class="nav-circle">
      <span class="circle-text">产品信息</span>
    </router-link>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  productId: {
    type: String,
    default: ''
  },
  showProductNav: {
    type: Boolean,
    default: true
  },
  offsetY: {
    type: Number,
    default: 20
  }
});
</script>

<style scoped>
.floating-nav {
  position: fixed;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9999;
}

.nav-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: rgba(200, 230, 201, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(129, 199, 132, 0.4);
  text-align: center;
}

.nav-circle:hover {
  transform: scale(1.05);
  background-color: rgba(200, 230, 201, 0.9);
}

.circle-text {
  padding: 0 5px;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .nav-circle {
    width: 60px;
    height: 60px;
    font-size: 12px;
  }
}
</style> 