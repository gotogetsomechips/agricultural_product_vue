<template>
  <div class="shop-container">
    <h1 class="shop-title">AgriCareMall</h1>

    <div class="product-container">
      <div v-for="(product, index) in products" :key="index" class="product" @click="viewProductDetail(product)">
        <img :src="product.image" :alt="product.name">
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p>{{ product.price }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 商品数据
const products = ref([
  {
    id: 1,
    name: 'iPhone15',
    price: '￥5999',
    image: new URL('../statics/products/iPhoneblue.jpg', import.meta.url).href,
    link: '/product/iphone15'
  },
  {
    id: 2,
    name: 'iPhone15 Plus',
    price: '￥6999',
    image: new URL('../statics/products/iPhoneblue.jpg', import.meta.url).href,
    link: '/product/iphone15plus'
  },
  {
    id: 3,
    name: 'iPhone15 Pro',
    price: '￥7999',
    image: new URL('../statics/products/iPhone.jpg', import.meta.url).href,
    link: '/product/iphone15pro'
  },
  {
    id: 4,
    name: 'iPhone15 Pro Max',
    price: '￥9999',
    image: new URL('../statics/products/iPhone.jpg', import.meta.url).href,
    link: '/product/iphone15promax'
  },
  {
    id: 5,
    name: 'MacBook Pro 14英寸',
    price: '￥12999',
    image: new URL('../statics/products/gray1.jpg', import.meta.url).href,
    link: '/product/macbook14'
  },
  {
    id: 6,
    name: 'MacBook Pro 16英寸',
    price: '￥19999',
    image: new URL('../statics/products/16gray1.jpg', import.meta.url).href,
    link: '/product/macbook16'
  },
  {
    id: 7,
    name: 'HUAWEI Mate60 Pro',
    price: '￥7999',
    image: new URL('../statics/products/mate60black.png', import.meta.url).href,
    link: '/product/mate60'
  },
  {
    id: 8,
    name: 'Apple Watch Series 9',
    price: '￥2999',
    image: new URL('../statics/products/awpink1.jpg', import.meta.url).href,
    link: '/product/aws9'
  },
  {
    id: 9,
    name: '王硕(狂笑之蝠)',
    price: '￥-5',
    image: new URL('../statics/products/ws.jpg', import.meta.url).href,
    link: '/video/ws.mp4',
    isVideo: true
  },
  {
    id: 10,
    name: '王宇、强子(元歌)',
    price: '￥-10',
    image: new URL('../statics/products/wz.jpg', import.meta.url).href,
    link: '/video/wz.mp4',
    isVideo: true
  },
  {
    id: 11,
    name: '闫海龙(圣枪游侠)',
    price: '￥-5',
    image: new URL('../statics/products/yhl2.jpg', import.meta.url).href,
    link: '/video/yhl.mp4',
    isVideo: true
  },
  {
    id: 12,
    name: '闫海龙(冰雪王子)',
    price: '￥-5',
    image: new URL('../statics/products/yhl3.jpg', import.meta.url).href,
    link: '/video/yhl1.mp4',
    isVideo: true
  }
]);

// 查看商品详情
const viewProductDetail = (product) => {
  if (product.isVideo) {
    // 如果是视频，可以考虑在新窗口打开
    window.open(product.link, '_blank');
  } else {
    // 如果是普通商品，导航到商品详情页
    router.push(product.link);
  }
};

onMounted(() => {
  // 页面挂载后的初始化逻辑
  console.log('商城页面已加载');

  // 可以在这里添加动画效果初始化
  const productElements = document.querySelectorAll('.product');
  productElements.forEach((product, index) => {
    setTimeout(() => {
      product.classList.add('visible');
    }, index * 100);
  });
});
</script>

<style scoped>
.shop-container {
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
}

.shop-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 28px;
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
  opacity: 0;
}

.product.visible {
  opacity: 1;
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
}

.product-info p {
  margin: 10px 0;
  font-size: 1em;
  color: #e44d26;
  font-weight: bold;
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
}
</style>