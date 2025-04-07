<template>
  <div class="product-container">
    <!-- 添加浮动导航 -->
    <FloatingNav :productId="route.params.id" :offsetY="170" />
    
    <div class="header">
      <div class="container">
        <h1 class="title">农产品溯源信息</h1>
      </div>
    </div>

    <div class="content-container">
      <div class="container">
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
          <!-- 产品基本信息卡片 -->
          <el-card class="info-card product-info" :body-style="{ padding: '0px' }">
            <div class="product-header1">
              <div class="card-header" style="color: #333;">
                <h2>产品基本信息</h2>
                <el-tag type="success" effect="dark" size="large" style="color: #606266;">溯源码: {{ traceId }}</el-tag>
              </div>
            </div>
            <div class="product-info-content">
              <div class="product-image">
                <el-image 
                  :src="productData.image" 
                  fit="cover">
                  <template #error>
                    <div class="image-placeholder">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
              </div>
              <div class="product-details">
                <el-descriptions :column="1" border direction="vertical" size="large">
                  <el-descriptions-item label="产品名称">
                    <span class="highlight-text" style="color: #000000;">{{ productData.pdName }}</span>
                  </el-descriptions-item>
                  <el-descriptions-item label="产品类别">{{ productData.type }}</el-descriptions-item>
                  <el-descriptions-item label="产品描述">{{ productData.pdDescription }}</el-descriptions-item>
                </el-descriptions>
                
                <!-- 产品质量认证标签 -->
                <div class="product-certifications">
                  <h3>产品认证</h3>
                  <div class="certification-images">
                    <div class="cert-image">
                      <el-image 
                        :src="certificateImages.greenFood" 
                        fit="contain"
                        :preview-src-list="[certificateImages.greenFood]">
                      </el-image>
                      <div class="cert-name">绿色食品认证</div>
                    </div>
                    <div class="cert-image">
                      <el-image 
                        :src="certificateImages.organic" 
                        fit="contain"
                        :preview-src-list="[certificateImages.organic]">
                      </el-image>
                      <div class="cert-name">有机认证</div>
                    </div>
                    <div class="cert-image">
                      <el-image 
                        :src="certificateImages.noAntibiotic" 
                        fit="contain"
                        :preview-src-list="[certificateImages.noAntibiotic]">
                      </el-image>
                      <div class="cert-name">无抗产品认证</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 产品附加信息 -->
<!--           <el-card class="info-card additional-info">
            <template #header>
              <div class="card-header">
                <span>产品参数</span>
              </div>
            </template>
            <div class="additional-info-content">
              <el-row :gutter="20">
                <el-col :xs="24" :sm="8">
                  <div class="info-item">
                    <el-statistic title="源产地">
                      <template #value>
                        <div class="statistic-value">
                          <el-icon><Location /></el-icon>
                          <span>黑龙江省五常市</span>
                        </div>
                      </template>
                    </el-statistic>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="8">
                  <div class="info-item">
                    <el-statistic title="生产日期">
                      <template #value>
                        <div class="statistic-value">
                          <el-icon><Calendar /></el-icon>
                          <span>{{ productionInfo ? formatDate(productionInfo.harvestDate) : '暂无数据' }}</span>
                        </div>
                      </template>
                    </el-statistic>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="8">
                  <div class="info-item">
                    <el-statistic title="保质期">
                      <template #value>
                        <div class="statistic-value">
                          <el-icon><Timer /></el-icon>
                          <span>24个月</span>
                        </div>
                      </template>
                    </el-statistic>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card> -->

          <!-- 产品附加信息 - 营养成分 -->
          <el-card class="info-card nutrition-info">
            <template #header>
              <div class="card-header">
                <span>营养成分</span>
              </div>
            </template>
            <div class="nutrition-info-content">
              <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :md="8" v-for="(item, index) in nutritionItems" :key="index">
                  <div class="nutrition-item">
                    <el-progress 
                      type="dashboard" 
                      :percentage="item.percentage" 
                      :color="item.color"
                      :stroke-width="8">
                      <template #default>
                        <div class="nutrition-label">
                          <h4>{{ item.name }}</h4>
                          <p>{{ item.value }}</p>
                        </div>
                      </template>
                    </el-progress>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>

          <!-- 溯源全流程 -->
          <el-card class="info-card trace-chain-card">
            <template #header>
              <div class="card-header">
                <span>溯源全过程</span>
                <el-tag type="primary">全程透明</el-tag>
              </div>
            </template>
            <div class="trace-chain-container">
              <div id="particles-js"></div>
              <div class="chain-wrapper">
                <div class="chain-link" v-for="(link, index) in chainLinks" :key="index">
                  <div class="chain-node" @click="navigateTo(link.route)">
                    <div class="node-icon">
                      <el-icon><component :is="link.icon" /></el-icon>
                    </div>
                    <div class="node-label">{{ link.label }}</div>
                  </div>
                  <div class="chain-connector" v-if="index < chainLinks.length - 1">
                    <div class="connector-line"></div>
                  </div>
                </div>
              </div>
              <div class="process-description">
                <div class="desc-item" v-for="(link, index) in chainLinks" :key="index">
                  <p v-if="link.label === '种植生产'"></p>
                  <p v-else-if="link.label === '物流运输'"></p>
                  <p v-else-if="link.label === '销售记录'"></p>
                </div>
              </div>
              <div class="process-summary" >
                <p style="font-size: 16px;">通过对该批次{{ productData ? productData.pdName : '' }}的全程溯源，我们可以确认该产品从种植、物流到销售的每个环节都符合质量标准和安全要求。</p>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Picture, Location, Calendar, Timer, Crop, Van, Shop } from '@element-plus/icons-vue'
import { useProductImage } from '../utils/imageService'
import FloatingNav from '../components/FloatingNav.vue'

// 导入证书图片
import greenFoodCert from '../statics/绿色食品22.png'
import organicCert from '../statics/有机认证.jpg'
import noAntibioticCert from '../statics/无抗产品认证.jpeg'

// 修改图片路径
const certificateImages = {
  greenFood: greenFoodCert,
  organic: organicCert,
  noAntibiotic: noAntibioticCert
}

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const isChainAnimating = ref(false)

// 数据模型
const productData = ref(null)
const productionInfo = ref(null)
const logisticsInfo = ref(null)
const saleInfo = ref(null)
const traceId = ref('')

// 营养成分数据
const nutritionItems = [
  { name: '碳水化合物', value: '75g/100g', percentage: 75, color: '#67C23A' },
  { name: '蛋白质', value: '7.5g/100g', percentage: 30, color: '#409EFF' },
  { name: '脂肪', value: '1g/100g', percentage: 10, color: '#E6A23C' },
  { name: '膳食纤维', value: '0.8g/100g', percentage: 12, color: '#F56C6C' },
  { name: '钙', value: '10mg/100g', percentage: 5, color: '#909399' },
  { name: '铁', value: '2mg/100g', percentage: 25, color: '#6F7180' }
]

// 溯源链条节点
const chainLinks = computed(() => [
  { 
    label: '种植生产', 
    icon: 'Crop', 
    class: 'production-node',
    route: `/production/${route.params.id}`
  },
  { 
    label: '物流运输', 
    icon: 'Van', 
    class: 'logistics-node',
    route: `/logistics/${route.params.id}`
  },
  { 
    label: '销售记录', 
    icon: 'Shop', 
    class: 'sale-node',
    route: `/sale/${route.params.id}`
  }
])

// 格式化日期
const formatDate = (dateTime) => {
  if (!dateTime) return '暂无数据'
  const date = new Date(dateTime)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 格式化日期时间
const formatDateTime = (dateTime) => {
  if (!dateTime) return '暂无数据'
  const date = new Date(dateTime)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 返回首页
const goBack = () => {
  router.push('/')
}

// 导航到其他页面
const navigateTo = (path) => {
  router.push(path)
}

// 从localStorage获取产品信息
const fetchProductData = () => {
  try {
    loading.value = true
    
    // 获取路径中的产品ID
    //traceId.value = route.params.id
    
    // 从localStorage获取数据
    const storedProductInfo = localStorage.getItem('productInfo')
    const storedProductionInfo = localStorage.getItem('productionInfo')
    const storedLogisticsInfo = localStorage.getItem('logisticsInfo')
    const storedSaleInfo = localStorage.getItem('saleInfo')
    // 设置traceId为销售信息中的ID
    if (storedSaleInfo) {
      const saleData = JSON.parse(storedSaleInfo)
      traceId.value = saleData.siId
    }
    
    if (storedProductInfo) {
      productData.value = JSON.parse(storedProductInfo)
    }
    
    if (storedProductionInfo) {
      productionInfo.value = JSON.parse(storedProductionInfo)
    }
    
    if (storedLogisticsInfo) {
      logisticsInfo.value = JSON.parse(storedLogisticsInfo)
    }
    
    if (storedSaleInfo) {
      saleInfo.value = JSON.parse(storedSaleInfo)
    }
  } catch (error) {
    console.error('获取产品数据失败', error)
  } finally {
    loading.value = false
  }
}

// 初始化粒子系统
const initParticles = () => {
  // 粒子效果配置
  const particlesConfig = {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#67c23a"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        }
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 5,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#67c23a",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 3,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": false,
          "mode": "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  };

  // 使用内联脚本动态加载和初始化粒子效果
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
  script.onload = () => {
    if (window.particlesJS) {
      window.particlesJS('particles-js', particlesConfig);
    }
  };
  document.head.appendChild(script);
};

onMounted(() => {
  fetchProductData();
  // 初始化粒子效果
  initParticles();
})
</script>

<style scoped>
.product-container {
  min-height: 100vh;
  width: 100vw;
  background-color: #f0f9eb;
  overflow-x: hidden;
}

.header {
  background-color: #67c23a;
  color: #fff;
  padding: 20px 0;
  margin-bottom: 30px;
  width: 100%;
}

.container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 15px;
  box-sizing: border-box;
}

.back-button {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;
  font-size: 16px;
  transition: all 0.3s;
}

.back-button:hover {
  opacity: 0.8;
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: 500;
}

.content-container {
  padding-bottom: 50px;
  width: 100%;
}

.loading-container, .empty-container {
  padding: 30px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.empty-container {
  padding: 50px;
  text-align: center;
}

.data-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.info-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.info-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  /* 移除悬浮上移效果 */
  /* transform: translateY(-5px); */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.product-header {
  background: linear-gradient(135deg, #7ecc5d, #3aa773);
  color: white;
  padding: 20px;
}

.product-header .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}

.product-header1 {
  background: linear-gradient(135deg, #f5f7fa, #f5f7fa);
  color: white;
  padding: 20px;
}

.product-header1 .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-header1 h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}



.product-info-content {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  background-color: #fff;
}

.product-image {
  flex: 1;
  min-width: 300px;
  max-width: 400px;
  margin-right: 30px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image .el-image {
  height: 491.87px;
  width: 100%;
  object-fit: cover;
}

.product-details {
  flex: 2;
  min-width: 300px;
}

.highlight-text {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 300px;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 30px;
}

.product-certifications {
  margin-top: 20px;
}

.product-certifications h3 {
  font-size: 16px;
  margin-bottom: 15px;
  color: #606266;
}

.certification-images {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-around;
}

.cert-image {
  width: 120px;
  text-align: center;
  margin-bottom: 10px;
  cursor: pointer;
}

.cert-image .el-image {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
}

.cert-name {
  margin-top: 8px;
  font-size: 14px;
  color: #303133;
}

.additional-info-content {
  padding: 20px 0;
}

.info-item {
  text-align: center;
  padding: 15px;
  border-radius: 8px;
  background-color: #f8f8f8;
  height: 100%;
}

.statistic-value {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.statistic-value .el-icon {
  color: #67c23a;
  font-size: 20px;
}

.nutrition-info-content {
  padding: 20px 0;
}

.nutrition-item {
  text-align: center;
  margin-bottom: 25px;
}

.nutrition-label h4 {
  margin: 5px 0 0;
  font-size: 14px;
  color: #606266;
}

.nutrition-label p {
  margin: 5px 0 0;
  font-size: 12px;
  color: #909399;
}

.trace-chain-container {
  padding: 40px 0;
  position: relative;
  overflow: hidden;
  height: 400px;
}

#particles-js {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.particle {
  display: none;
}

.chain-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  position: relative;
  z-index: 2;
  height: 120px;
  max-width: 800px;
  margin: 0 auto;
}

.chain-link {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
}

.chain-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 100px;
  height: 100px;
  background-color: rgba(240, 249, 235, 0.8);
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 3;
}

.chain-node:hover {
  /* 移除悬浮放大效果 */
  /* transform: scale(1.1); */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  background-color: #f0f9eb;
}

.node-icon {
  font-size: 28px;
  margin-bottom: 10px;
  color: #67c23a;
  height: 0px;
}

.node-label {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.chain-connector {
  flex: 1;
  display: flex;
  align-items: center;
  height: 2px;
  padding: 0;
  margin: 0 -10px;
}

.connector-line {
  width: 300px;
  height: 2px;
  background-color: rgba(103, 194, 58, 0.8);
  position: relative;
}

.connector-line::before,
.connector-line::after {
  content: "";
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #67c23a;
  top: -3px;
}

.connector-line::before {
  left: -2px;
}

.connector-line::after {
  right: -2px;
}

.process-description {
  display: flex;
  justify-content: space-around;
  padding: 10px 20px;
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 20px auto 0;
  text-align: center;
}

.desc-item {
  flex: 1;
  padding: 0 10px;
}

.desc-item p {
  margin: 0;
  font-size: 14px;
  color: #606266;
}

.process-summary {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 30px auto 0;
  text-align: center;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
}

.process-summary p {
  margin: 0;
  font-size: 14px;
  color: #303133;
}

@media (max-width: 768px) {
  .product-info-content {
    flex-direction: column;
  }
  
  .product-image {
    max-width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .certification-images {
    justify-content: center;
  }
  
  .chain-wrapper {
    flex-direction: column;
    gap: 40px;
  }
  
  .chain-link {
    flex-direction: column;
    align-items: center;
  }
  
  .chain-connector {
    width: 2px;
    height: 40px;
    margin: 0;
  }
  
  .connector-line {
    width: 2px;
    height: 100%;
    background-color: rgba(103, 194, 58, 0.6);
  }
  
  .connector-line::before,
  .connector-line::after {
    left: -2px;
  }
  
  .connector-line::before {
    top: 25%;
  }
  
  .connector-line::after {
    top: 75%;
  }
}
</style>