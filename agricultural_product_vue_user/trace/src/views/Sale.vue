<template>
  <div class="sale-container">
    <!-- 添加浮动导航 -->
    <FloatingNav :productId="route.params.id" :offsetY="170" />
    
    <div class="header">
      <div class="container">
        <h1 class="title">销售环节溯源</h1>
      </div>
    </div>

    <div class="content-container">
      <div class="container">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton style="width: 100%" animated :rows="10" />
        </div>

        <!-- 无数据提示 -->
        <div v-else-if="!saleInfo" class="empty-container">
          <el-empty description="未找到销售信息" />
          <el-button type="primary" @click="goBack">返回产品页</el-button>
        </div>

        <!-- 数据内容展示 -->
        <div v-else class="data-container">
          <!-- 销售环节标题 -->
          <div class="section-header">
            <div class="header-icon">
              <el-icon><Shop /></el-icon>
            </div>
            <h2>销售渠道信息</h2>
            <el-tag type="primary" effect="dark" size="large">销售编号: {{ saleInfo.siId }}</el-tag>
          </div>

          <!-- 销售信息卡片 -->
          <el-card class="info-card sale-info">
            <template #header>
              <div class="card-header">
                <span>销售详情</span>
                <el-tag type="info">基本信息</el-tag>
              </div>
            </template>
            <div class="sale-content">
              <el-row :gutter="20">
                <el-col :xs="24" :sm="24">
                  <div class="info-section">
                <!--    <h3 class="section-title">产品销售信息</h3>  -->
                    <el-descriptions :column="1" border size="large">
                      <el-descriptions-item label="销售描述">{{ saleInfo.siDescription }}</el-descriptions-item>
                      <el-descriptions-item label="销售时间">{{ formatDateTime(saleInfo.saleTime || '2023-10-05 10:30:00') }}</el-descriptions-item>
                      <el-descriptions-item label="销售价格">¥{{ (Math.random() * 10 + 10).toFixed(2) }}/kg</el-descriptions-item>
                    </el-descriptions>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>

          <!-- 销售门店信息 -->
          <el-card class="info-card store-info">
            <template #header>
              <div class="card-header">
                <span>销售门店</span>
                <el-tag type="success">零售终端</el-tag>
              </div>
            </template>
            <div class="store-content">
              <el-row :gutter="30">
                <el-col :xs="24" :sm="12">
                  <div class="store-image">
                    <img src="https://img.freepik.com/free-photo/supermarket-grocery-aisle-with-fresh-products-shelves_342744-1111.jpg" alt="销售门店">
                  </div>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <div class="store-details">
                    <h3>{{ saleInfo.spAddress }}</h3>
                    <div class="store-rating">
                      <span class="rating-label">商店评分:</span>
                      <el-rate v-model="storeRating" disabled show-score text-color="#ff9900"></el-rate>
                    </div>
                    <div class="store-info-list">
                      <div class="info-item">
                        <el-icon><Location /></el-icon>
                        <span>{{ saleInfo.spAddress }}</span>
                      </div>
                      <div class="info-item">
                        <el-icon><User /></el-icon>
                        <span>负责人: {{ saleInfo.spAdministrator }}</span>
                      </div>
                      <div class="info-item">
                        <el-icon><Phone /></el-icon>
                        <span>联系电话: {{ saleInfo.spPhone }}</span>
                      </div>
                      <div class="info-item">
                        <el-icon><Clock /></el-icon>
                        <span>营业时间: 09:00-22:00</span>
                      </div>
                    </div>
                    <div class="store-certifications">
                      <h4>门店认证</h4>
                      <div class="certification-images">
                        <div class="cert-image">
                          <el-image 
                            :src="certificateImages.foodSafety" 
                            fit="contain"
                            :preview-src-list="[certificateImages.foodSafety]">
                          </el-image>
                          <div class="cert-name">食品安全管理体系</div>
                        </div>
                        <div class="cert-image">
                          <el-image 
                            :src="certificateImages.foodQuality" 
                            fit="contain"
                            :preview-src-list="[certificateImages.foodQuality]">
                          </el-image>
                          <div class="cert-name">食品质量认证</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>

          <!-- 销售数据统计 -->
<!--           <el-card class="info-card sales-statistics">
            <template #header>
              <div class="card-header">
                <span>销售统计</span>
                <el-tag type="warning">数据分析</el-tag>
              </div>
            </template>
            <div class="statistics-content">
              <div class="chart-container">
                <div ref="salesChart" class="sales-chart"></div>
              </div>
              <div class="statistics-summary">
                <el-row :gutter="20">
                  <el-col :xs="12" :sm="6" v-for="(stat, index) in salesStats" :key="index">
                    <div class="summary-card" :class="stat.class">
                      <div class="summary-icon">
                        <el-icon><component :is="stat.icon" /></el-icon>
                      </div>
                      <div class="summary-info">
                        <div class="summary-value">{{ stat.value }}</div>
                        <div class="summary-label">{{ stat.label }}</div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-card> -->

          <!-- 质量检测 -->
          <el-card class="info-card quality-check">
            <template #header>
              <div class="card-header">
                <span>质量检测</span>
                <el-tag type="success">品质保障</el-tag>
              </div>
            </template>
            <div class="quality-content">
              <el-collapse accordion>
                <el-collapse-item v-for="(check, index) in qualityChecks" :key="index" :name="index">
                  <template #title>
                    <div class="check-title">
                      <el-icon :class="{ 'passed': check.passed }">
                        <component :is="check.passed ? 'Check' : 'Warning'" />
                      </el-icon>
                      <span>{{ check.title }}</span>
                      <el-tag size="small" :type="check.passed ? 'success' : 'danger'">
                        {{ check.passed ? '合格' : '不合格' }}
                      </el-tag>
                    </div>
                  </template>
                  <div class="check-details">
                    <p>{{ check.description }}</p>
                    <div class="check-items">
                      <div v-for="(item, itemIndex) in check.items" :key="itemIndex" class="check-item">
                        <span class="item-name">{{ item.name }}:</span>
                        <span class="item-value" :class="{ 'item-passed': item.passed, 'item-failed': !item.passed }">
                          {{ item.value }}
                        </span>
                        <span class="item-standard">
                          (标准: {{ item.standard }})
                        </span>
                      </div>
                    </div>
                    <div class="check-info">
                      <span class="inspector">检测员: {{ check.inspector }}</span>
                      <span class="check-date">检测日期: {{ check.date }}</span>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-card>

          <!-- 溯源进程卡片 -->
           <el-card class="info-card traceability-process">
            <template #header>
              <div class="card-header">
                <span>溯源全过程</span>
                <el-tag type="primary">全程透明</el-tag>
              </div>
            </template>
            <div class="process-content">
              <div class="process-flow">
                <div class="process-node">
                  <div class="node-icon production">
                    <el-icon><Crop /></el-icon>
                  </div>
                  <div class="node-content">
                    <h4>种植生产</h4>
                    <p>从播种到收获的完整记录</p>
                    <el-link type="primary" @click="goToProduction">查看详情</el-link>
                  </div>
                </div>
                <div class="process-connector">
                  <div class="connector-line"></div>
                  <el-icon><ArrowRight /></el-icon>
                </div>
                <div class="process-node">
                  <div class="node-icon logistics">
                    <el-icon><Van /></el-icon>
                  </div>
                  <div class="node-content">
                    <h4>物流运输</h4>
                    <p>从产地到销售地的全程监控</p>
                    <el-link type="warning" @click="goToLogistics">查看详情</el-link>
                  </div>
                </div>
                <div class="process-connector">
                  <div class="connector-line"></div>
                  <el-icon><ArrowRight /></el-icon>
                </div>
                <div class="process-node current">
                  <div class="node-icon sale">
                    <el-icon><Shop /></el-icon>
                  </div>
                  <div class="node-content">
                    <h4>销售记录</h4>
                    <p>规范销售渠道，确保产品品质</p>
                    <span class="current-node-tag">当前环节</span>
                  </div>
                </div>
              </div>
              <div class="process-summary">
                <p>通过对该批次{{ saleInfo.pdName }}的全程溯源，我们可以确认该产品从种植、物流到销售的每个环节都符合质量标准和安全要求。</p>              </div>
            </div>
          </el-card>
 
          <!-- 客户反馈 -->
  <!--         <el-card class="info-card customer-feedback">
            <template #header>
              <div class="card-header">
                <span>客户评价</span>
                <el-tag type="warning">用户体验</el-tag>
              </div>
            </template>
            <div class="feedback-content">
              <div class="feedback-stats">
                <div class="overall-rating">
                  <div class="rating-number">4.8</div>
                  <el-rate v-model="overallRating" disabled show-score text-color="#ff9900"></el-rate>
                  <div class="rating-count">基于 256 个评价</div>
                </div>
                <div class="rating-breakdown">
                  <div v-for="(rating, index) in ratingBreakdown" :key="index" class="rating-bar">
                    <span class="rating-label">{{ rating.label }}</span>
                    <el-progress 
                      :percentage="rating.percentage" 
                      :color="ratingColors[index]"
                      :stroke-width="12"
                      :show-text="false">
                    </el-progress>
                    <span class="rating-value">{{ rating.value }}</span>
                  </div>
                </div>
              </div>
              <div class="feedback-list">
                <div v-for="(feedback, index) in customerFeedbacks" :key="index" class="feedback-item">
                  <div class="feedback-header">
                    <div class="user-info">
                      <div class="user-avatar">
                        <img :src="feedback.avatar" alt="用户头像">
                      </div>
                      <div class="user-name">{{ feedback.name }}</div>
                    </div>
                    <div class="feedback-rating">
                      <el-rate v-model="feedback.rating" disabled></el-rate>
                      <div class="feedback-date">{{ feedback.date }}</div>
                    </div>
                  </div>
                  <div class="feedback-body">
                    <p>{{ feedback.comment }}</p>
                  </div>
                  <div v-if="feedback.reply" class="feedback-reply">
                    <div class="reply-header">商家回复:</div>
                    <div class="reply-content">{{ feedback.reply }}</div>
                  </div>
                </div>
              </div>
            </div>
          </el-card> -->


        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Shop, Location, User, Phone, Clock, Sunrise, Goods, Money, PriceTag, Check, Warning, Crop, Van, ArrowRight } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import FloatingNav from '../components/FloatingNav.vue'

// 导入证书图片
import foodSafetyCert from '../statics/食品安全管理体系.jpg'
import foodQualityCert from '../statics/食品质量认证.jpg'

// 证书图片路径
const certificateImages = {
  foodSafety: foodSafetyCert,
  foodQuality: foodQualityCert
}

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const saleInfo = ref(null)
const storeRating = ref(4.7)
const overallRating = ref(4.8)
const salesChart = ref(null)
let chart = null

// 销售统计数据
const salesStats = [
  {
    label: '月销量',
    value: '2,568 kg',
    icon: 'Goods',
    class: 'sales-volume'
  },
  {
    label: '平均售价',
    value: '¥ 15.8/kg',
    icon: 'PriceTag',
    class: 'average-price'
  },
  {
    label: '销售额',
    value: '¥ 40,574',
    icon: 'Money',
    class: 'revenue'
  },
  {
    label: '客户满意度',
    value: '98%',
    icon: 'Sunrise',
    class: 'satisfaction'
  }
]

// 质量检测数据
const qualityChecks = [
  {
    title: '农药残留检测',
    passed: true,
    description: '采用气相色谱-质谱联用法对多种常见农药残留进行检测',
    items: [
      { name: '有机磷农药', value: '未检出', standard: '≤0.05mg/kg', passed: true },
      { name: '拟除虫菊酯类农药', value: '未检出', standard: '≤0.1mg/kg', passed: true },
      { name: '氨基甲酸酯类农药', value: '未检出', standard: '≤0.5mg/kg', passed: true }
    ],
    inspector: '李华',
    date: '2023-09-25'
  },
  {
    title: '重金属检测',
    passed: true,
    description: '采用原子吸收分光光度法检测产品中的重金属含量',
    items: [
      { name: '铅', value: '0.02mg/kg', standard: '≤0.2mg/kg', passed: true },
      { name: '镉', value: '0.01mg/kg', standard: '≤0.1mg/kg', passed: true },
      { name: '汞', value: '未检出', standard: '≤0.02mg/kg', passed: true },
      { name: '砷', value: '0.03mg/kg', standard: '≤0.5mg/kg', passed: true }
    ],
    inspector: '张明',
    date: '2023-09-25'
  },
  {
    title: '微生物检测',
    passed: true,
    description: '按照食品微生物学标准方法检测产品中的微生物指标',
    items: [
      { name: '菌落总数', value: '1.2×10³CFU/g', standard: '≤10⁵CFU/g', passed: true },
      { name: '大肠菌群', value: '未检出', standard: '≤100MPN/g', passed: true },
      { name: '沙门氏菌', value: '未检出', standard: '不得检出/25g', passed: true },
      { name: '金黄色葡萄球菌', value: '未检出', standard: '不得检出/25g', passed: true }
    ],
    inspector: '王丽',
    date: '2023-09-26'
  },
  {
    title: '真菌毒素检测',
    passed: true,
    description: '采用免疫亲和柱-高效液相色谱法检测产品中的黄曲霉毒素',
    items: [
      { name: '黄曲霉毒素B1', value: '未检出', standard: '≤5μg/kg', passed: true },
      { name: '黄曲霉毒素总量', value: '未检出', standard: '≤10μg/kg', passed: true },
      { name: '脱氧雪腐镰刀菌烯醇', value: '未检出', standard: '≤1000μg/kg', passed: true }
    ],
    inspector: '赵刚',
    date: '2023-09-26'
  }
]

// 评分细分
const ratingBreakdown = [
  { label: '5星', percentage: 85, value: '217' },
  { label: '4星', percentage: 10, value: '26' },
  { label: '3星', percentage: 3, value: '8' },
  { label: '2星', percentage: 1, value: '3' },
  { label: '1星', percentage: 1, value: '2' }
]

// 评分颜色
const ratingColors = ['#67C23A', '#95de7d', '#E6A23C', '#F56C6C', '#909399']



// 格式化日期时间
const formatDateTime = (dateTime) => {
  if (!dateTime) return '暂无数据'
  const date = new Date(dateTime)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 返回上一页
const goBack = () => {
  router.push(`/product/${route.params.id}`)
}

// 前往生产页面
const goToProduction = () => {
  router.push(`/production/${route.params.id}`)
}

// 前往物流页面
const goToLogistics = () => {
  router.push(`/logistics/${route.params.id}`)
}

// 返回产品页面
const returnToProduct = () => {
  router.push(`/product/${route.params.id}`)
}

// 初始化销售图表
const initChart = () => {
  if (!salesChart.value) return
  
  chart = echarts.init(salesChart.value)
  
  // 模拟销售数据
  const option = {
    title: {
      text: '本季度销售趋势',
      left: 'center',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['销售量(kg)', '销售额(¥)'],
      bottom: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['7月', '8月', '9月', '10月']
    },
    yAxis: [
      {
        type: 'value',
        name: '销售量(kg)',
        min: 0,
        max: 3000,
        position: 'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#5470C6'
          }
        },
        axisLabel: {
          formatter: '{value} kg'
        }
      },
      {
        type: 'value',
        name: '销售额(¥)',
        min: 0,
        max: 50000,
        position: 'right',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#91CC75'
          }
        },
        axisLabel: {
          formatter: '{value} ¥'
        }
      }
    ],
    series: [
      {
        name: '销售量(kg)',
        type: 'bar',
        yAxisIndex: 0,
        data: [1850, 2100, 2568, 2300],
        itemStyle: {
          color: '#5470C6'
        }
      },
      {
        name: '销售额(¥)',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: [28500, 33200, 40574, 36800],
        itemStyle: {
          color: '#91CC75'
        }
      }
    ]
  }
  
  chart.setOption(option)
  
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 从localStorage获取销售信息
const fetchSaleData = () => {
  try {
    loading.value = true

    // 从localStorage获取数据
    const storedSaleInfo = localStorage.getItem('saleInfo')

    if (storedSaleInfo) {
      saleInfo.value = JSON.parse(storedSaleInfo)
    }
  } catch (error) {
    console.error('获取销售数据失败', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSaleData()
  // 给图表渲染一点时间
  setTimeout(() => {
    initChart()
  }, 300)
})

onBeforeUnmount(() => {
  if (chart) {
    chart.dispose()
    window.removeEventListener('resize', () => {
      chart.resize()
    })
  }
})
</script>

<style scoped>
.sale-container {
  min-height: 100vh;
  width: 100vw;
  background-color: #f0f9eb;
  overflow-x: hidden;
}

.header {
  background: linear-gradient(135deg, #a0cfff, #409eff);
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
  letter-spacing: 1px;
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

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a0cfff, #409eff);
  color: white;
  font-size: 30px;
  margin-right: 20px;
}

.section-header h2 {
  margin: 0;
  flex: 1;
  font-size: 24px;
  color: #303133;
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

.sale-content, .store-content, .statistics-content, .quality-content, .feedback-content, .summary-content {
  padding: 20px;
}

.info-section {
  margin-bottom: 20px;
}

/* 添加销售详情卡片的特殊样式 */
.sale-info .info-section {
  width: 100%;
}

.sale-info .section-title {
  font-size: 18px;
  position: relative;
  padding-left: 12px;
  margin-bottom: 20px;
}

.sale-info .section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  background: linear-gradient(to bottom, #409eff, #79bbff);
  border-radius: 2px;
}

.sale-info .el-descriptions {
  margin-bottom: 0;
}

.sale-info .el-descriptions-item__label {
  font-weight: 500;
  color: #606266;
  background-color: #f5f7fa;
}

.sale-info .highlight-text {
  font-size: 20px;
  font-weight: 600;
  color: #409eff;
  display: inline-block;
  padding: 0 5px;
}

.section-title {
  font-size: 18px;
  color: #409eff;
  margin-bottom: 15px;
  font-weight: 500;
}

.highlight-text {
  font-size: 18px;
  font-weight: 600;
  color: #409eff;
}

.store-image {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.store-image img {
  width: 100%;
  height: auto;
  display: block;
}

.store-details h3 {
  font-size: 20px;
  color: #303133;
  margin-top: 0;
  margin-bottom: 15px;
}

.store-rating {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.rating-label {
  margin-right: 10px;
  font-size: 14px;
  color: #606266;
}

.store-info-list {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}

.info-item .el-icon {
  color: #409eff;
  margin-right: 10px;
  font-size: 16px;
}

.store-certifications h4 {
  font-size: 16px;
  color: #606266;
  margin-bottom: 10px;
}

.certification-images {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
}

.cert-image {
  width: 100px;
  text-align: center;
  margin-bottom: 10px;
  cursor: pointer;
}

.cert-image .el-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  cursor: pointer;
}

.cert-name {
  margin-top: 5px;
  font-size: 12px;
  color: #606266;
}

.chart-container {
  margin-bottom: 30px;
}

.sales-chart {
  width: 100%;
  height: 300px;
}

.statistics-summary {
  margin-top: 20px;
}

.summary-card {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  background-color: #f8f8f8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.summary-card:hover {
  /* 移除悬浮上移效果 */
  /* transform: translateY(-5px); */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.summary-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
  color: white;
  font-size: 20px;
}

.summary-info {
  flex: 1;
}

.summary-value {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
}

.summary-label {
  font-size: 14px;
  color: #606266;
  margin-top: 5px;
}

.summary-card.sales-volume .summary-icon {
  background-color: #409eff;
}

.summary-card.average-price .summary-icon {
  background-color: #e6a23c;
}

.summary-card.revenue .summary-icon {
  background-color: #67c23a;
}

.summary-card.satisfaction .summary-icon {
  background-color: #f56c6c;
}

.quality-content, .feedback-content, .summary-content {
  padding: 20px;
}

.check-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.check-title .el-icon.passed {
  color: #67c23a;
}

.check-details {
  padding: 15px 0;
  color: #606266;
}

.check-details p {
  margin-top: 0;
  margin-bottom: 15px;
}

.check-items {
  margin-bottom: 15px;
}

.check-item {
  margin-bottom: 8px;
  font-size: 14px;
}

.item-name {
  font-weight: 500;
  margin-right: 5px;
}

.item-value {
  margin-right: 5px;
}

.item-passed {
  color: #67c23a;
}

.item-failed {
  color: #f56c6c;
}

.item-standard {
  color: #909399;
  font-size: 13px;
}

.check-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #909399;
}

.feedback-stats {
  display: flex;
  margin-bottom: 30px;
  gap: 40px;
}

.overall-rating {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.rating-number {
  font-size: 48px;
  font-weight: 600;
  color: #ff9900;
  line-height: 1;
  margin-bottom: 10px;
}

.rating-count {
  margin-top: 10px;
  font-size: 14px;
  color: #909399;
}

.rating-breakdown {
  flex: 2;
}

.rating-bar {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.rating-label, .rating-value {
  flex: 0 0 40px;
  font-size: 14px;
  color: #606266;
}

.rating-label {
  text-align: right;
  margin-right: 15px;
}

.rating-value {
  margin-left: 15px;
}

.el-progress {
  flex: 1;
}

.feedback-list {
  margin-top: 30px;
}

.feedback-item {
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin-bottom: 20px;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-weight: 500;
  color: #303133;
}

.feedback-rating {
  text-align: right;
}

.feedback-date {
  font-size: 13px;
  color: #909399;
  margin-top: 5px;
}

.feedback-body {
  margin-bottom: 15px;
}

.feedback-body p {
  margin: 0;
  line-height: 1.6;
}

.feedback-reply {
  background-color: #fff;
  padding: 15px;
  border-radius: 6px;
  border-left: 3px solid #409eff;
}

.reply-header {
  font-weight: 500;
  color: #409eff;
  margin-bottom: 5px;
}

.reply-content {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

.summary-timeline {
  margin-bottom: 30px;
}

.current-step {
  display: inline-block;
  background-color: #67c23a;
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 13px;
  margin-top: 5px;
}

.summary-conclusion {
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.summary-conclusion h3 {
  color: #303133;
  margin-top: 0;
  margin-bottom: 15px;
}

.summary-conclusion p {
  color: #606266;
  margin-bottom: 20px;
  line-height: 1.6;
  text-align: left;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    text-align: center;
  }
  
  .header-icon {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .store-details {
    text-align: center;
  }
  
  .store-rating {
    justify-content: center;
  }
  
  .info-item {
    justify-content: center;
  }
  
  .store-certifications {
    text-align: center;
  }
  
  .certification-tags {
    justify-content: center;
  }
  
  .summary-card {
    margin-bottom: 20px;
  }
  
  .feedback-stats {
    flex-direction: column;
    gap: 20px;
  }
  
  .overall-rating {
    margin-bottom: 20px;
  }
  
  .feedback-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .feedback-rating {
    margin-top: 10px;
    text-align: left;
  }
  
  .check-info {
    flex-direction: column;
  }
  
  .inspector {
    margin-bottom: 5px;
  }
}

/* 溯源进程卡片样式 */
.process-content {
  padding: 30px 20px;
}

.process-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}

.process-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 180px;
  text-align: center;
  position: relative;
}

.process-node.current {
  transform: scale(1.05);
}

.node-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  font-size: 24px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.node-icon.production {
  background: linear-gradient(135deg, #67C23A, #85CE61);
}

.node-icon.logistics {
  background: linear-gradient(135deg, #E6A23C, #F3B95F);
}

.node-icon.sale {
  background: linear-gradient(135deg, #409EFF, #79BBFF);
}

.node-content h4 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 16px;
}

.node-content p {
  margin: 0 0 8px 0;
  color: #606266;
  font-size: 14px;
}

.current-node-tag {
  display: inline-block;
  background-color: #67C23A;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.process-connector {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 2px;
  max-width: 100px;
}

.connector-line {
  height: 2px;
  background-color: #DCDFE6;
  flex-grow: 1;
}

.process-connector .el-icon {
  position: absolute;
  right: -8px;
  color: #DCDFE6;
  font-size: 20px;
}

.process-summary {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.process-summary p {
  margin: 0 0 20px 0;
  color: #606266;
  line-height: 1.6;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .process-flow {
    flex-direction: column;
    gap: 20px;
  }
  
  .process-node {
    width: 100%;
  }
  
  .process-connector {
    transform: rotate(90deg);
    width: 50px;
    margin: 10px 0;
  }
}
</style>