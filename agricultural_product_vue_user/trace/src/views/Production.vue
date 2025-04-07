<template>
  <div class="production-container">
    <!-- 添加浮动导航 -->
    <FloatingNav :productId="route.params.id" :offsetY="170" />
    
    <div class="header">
      <div class="container">
        <h1 class="title">生产环节溯源</h1>
      </div>
    </div>

    <div class="content-container">
      <div class="container">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton style="width: 100%" animated :rows="10" />
        </div>

        <!-- 无数据提示 -->
        <div v-else-if="!productionInfo" class="empty-container">
          <el-empty description="未找到生产信息" />
          <el-button type="primary" @click="goBack">返回首页</el-button>
        </div>

        <!-- 数据内容展示 -->
        <div v-else class="data-container">
          <!-- 生产环节标题 -->
          <div class="section-header">
            <div class="header-icon">
              <el-icon><Crop /></el-icon>
            </div>
            <h2>种植生产信息</h2>
            <el-tag type="success" effect="dark" size="large">农安编号: {{ productionInfo.piId }}</el-tag>
          </div>

          <!-- 生产过程卡片 -->
          <el-card class="info-card production-process">
            <template #header>
              <div class="card-header">
                <span>生产过程</span>
                <el-tag type="info">关键信息</el-tag>
              </div>
            </template>
            <div class="process-info">
              <el-row :gutter="20">
                <el-col :xs="24" :sm="12">
                  <div class="process-details">
                    <el-descriptions :column="1" border size="large">
                      <el-descriptions-item label="种子来源">{{ productionInfo.seed }}</el-descriptions-item>
                      <el-descriptions-item label="播种时间">{{ formatDate(productionInfo.plantingDate) }}</el-descriptions-item>
                      <el-descriptions-item label="收获时间">{{ formatDate(productionInfo.harvestDate) }}</el-descriptions-item>
                      <el-descriptions-item label="生产描述">{{ productionInfo.piDescription }}</el-descriptions-item>
                    </el-descriptions>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <div class="place-details">
                    <h3>生产地信息</h3>
                    <el-descriptions :column="1" border size="large">
                      <el-descriptions-item label="生产地址">{{ productionInfo.ppAddress }}</el-descriptions-item>
                      <el-descriptions-item label="负责人">{{ productionInfo.ppAdministrator }}</el-descriptions-item>
                      <el-descriptions-item label="联系电话">{{ productionInfo.ppPhone }}</el-descriptions-item>
                    </el-descriptions>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>

          <!-- 生产环境卡片 -->
          <el-card class="info-card environment-info">
            <template #header>
              <div class="card-header">
                <span>生产环境</span>
                <el-tag type="success">环境监测</el-tag>
              </div>
            </template>
            <div class="environment-content">
              <el-row :gutter="30">
                <el-col :xs="24" :sm="12" :md="8" v-for="(item, index) in environmentData" :key="index">
                  <div class="environment-item">
                    <el-statistic :title="item.name">
                      <template #value>
                        <div class="env-value">
                          <el-icon :class="item.iconClass"><component :is="item.icon" /></el-icon>
                          <span>{{ item.value }}</span>
                        </div>
                      </template>
                    </el-statistic>
                    <el-progress 
                      :percentage="item.percentage" 
                      :color="item.color"
                      :stroke-width="8"
                      :show-text="false">
                    </el-progress>
                    <div class="env-status" :style="{ color: item.color }">{{ item.status }}</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>

          <!-- 生产工艺流程图 -->
          <el-card class="info-card production-flow">
            <template #header>
              <div class="card-header">
                <span>生产工艺流程</span>
                <el-tag type="warning">标准流程</el-tag>
              </div>
            </template>
            <div class="flow-content">
              <el-steps :active="5" finish-status="success" align-center>
                <el-step v-for="(step, index) in productionSteps" :key="index" :title="step.title" :description="step.description">
                  <template #icon>
                    <el-icon><component :is="step.icon" /></el-icon>
                  </template>
                </el-step>
              </el-steps>
            </div>
          </el-card>

          <!-- 生产周期图表 -->
<!--           <el-card class="info-card production-timeline">
            <template #header>
              <div class="card-header">
                <span>生产周期数据</span>
                <el-tag type="info">数据统计</el-tag>
              </div>
            </template>
            <div class="timeline-content">
              <div ref="timelineChart" class="timeline-chart"></div>
            </div>
          </el-card> -->

          <!-- 种植记录 -->
<!--           <el-card class="info-card planting-records">
            <template #header>
              <div class="card-header">
                <span>生产活动记录</span>
                <el-tag type="warning">关键活动</el-tag>
              </div>
            </template>
            <div class="records-content">
              <el-timeline>
                <el-timeline-item
                  v-for="(activity, index) in plantingActivities"
                  :key="index"
                  :timestamp="activity.time"
                  :type="activity.type"
                  :color="activity.color"
                  :size="activity.size"
                  :icon="activity.icon"
                  :hollow="activity.hollow"
                >
                  <h4>{{ activity.title }}</h4>
                  <p>{{ activity.content }}</p>
                  <div v-if="activity.operations" class="activity-operations">
                    <span v-for="(op, opIndex) in activity.operations" :key="opIndex">
                      {{ op.name }}: {{ op.value }}
                    </span>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-card> -->


          <!-- 溯源进程卡片组件 -->
          <TraceabilityProcess 
            :productId="route.params.id" 
            :productName="productionInfo.pdName || '产品'" 
            currentStep="production" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, ArrowRight, Crop, Van, WindPower, Sunny, Cloudy, Umbrella, Reading, Check, Calendar } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import FloatingNav from '../components/FloatingNav.vue'
import TraceabilityProcess from '../components/TraceabilityProcess.vue'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const productionInfo = ref(null)
const timelineChart = ref(null)
let chart = null

// 格式化日期函数
const formatDate = (date) => {
  if (!date) return '暂无数据'
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 生产环境数据
const environmentData = [
  { 
    name: '土壤质量', 
    value: '优', 
    percentage: 95, 
    color: '#67C23A',
    status: '非常适合种植',
    icon: 'WindPower',
    iconClass: 'soil-icon'
  },
  { 
    name: '水质情况', 
    value: '优', 
    percentage: 90, 
    color: '#409EFF',
    status: '清洁无污染',
    icon: 'Umbrella',
    iconClass: 'water-icon'
  },
  { 
    name: '空气质量', 
    value: '良', 
    percentage: 85, 
    color: '#67C23A',
    status: '清新自然',
    icon: 'Sunny',
    iconClass: 'air-icon'
  },
  { 
    name: '阳光照射', 
    value: '充足', 
    percentage: 88, 
    color: '#E6A23C',
    status: '有利生长',
    icon: 'Sunny',
    iconClass: 'sun-icon'
  },
  { 
    name: '气候适宜度', 
    value: '高', 
    percentage: 92, 
    color: '#67C23A',
    status: '温湿适宜',
    icon: 'Cloudy',
    iconClass: 'weather-icon'
  },
  { 
    name: '有机质含量', 
    value: '丰富', 
    percentage: 85, 
    color: '#67C23A',
    status: '营养丰富',
    icon: 'Reading',
    iconClass: 'organic-icon'
  }
]

// 生产工艺流程步骤
const productionSteps =ref ([])


// 生产活动记录
const plantingActivities = [
  {
    title: '土地准备',
    content: '进行土壤选择和改良，增施有机肥料，提高土壤肥力',
    time: '2023-03-20',
    type: 'primary',
    size: 'large',
    icon: 'Crop',
    operations: [
      { name: '土壤检测', value: '合格' },
      { name: '有机肥施用量', value: '2吨/亩' }
    ]
  },
  {
    title: '种子处理',
    content: '选用优质有机水稻种子，进行种子处理与消毒',
    time: '2023-04-10',
    type: 'info',
    operations: [
      { name: '种子品种', value: '优质有机水稻' },
      { name: '发芽率', value: '98%' }
    ]
  },
  {
    title: '播种',
    content: '采用机械精准播种技术，确保播种均匀',
    time: '2023-04-15',
    type: 'success',
    operations: [
      { name: '播种密度', value: '标准密度' },
      { name: '播种深度', value: '2-3cm' }
    ]
  },
  {
    title: '田间管理',
    content: '农田水位控制、杂草管理、病虫害生物防治',
    time: '2023-05-20 - 2023-08-10',
    type: 'warning',
    operations: [
      { name: '灌溉次数', value: '12次' },
      { name: '病虫害防治', value: '生物防治' }
    ]
  },
  {
    title: '生长监测',
    content: '定期监测作物生长状况、记录生长数据',
    time: '2023-06-15',
    type: 'info',
    hollow: true,
    operations: [
      { name: '植株高度', value: '55cm' },
      { name: '长势评估', value: '良好' }
    ]
  },
  {
    title: '收获前检查',
    content: '检查水稻成熟度，确定最佳收获时间',
    time: '2023-09-15',
    type: 'warning',
    operations: [
      { name: '成熟度', value: '95%' },
      { name: '品质评估', value: '优质' }
    ]
  },
  {
    title: '收获',
    content: '机械化收获，确保高效率和低损耗',
    time: '2023-09-20',
    type: 'danger',
    size: 'large',
    operations: [
      { name: '收获面积', value: '100亩' },
      { name: '单产', value: '650kg/亩' }
    ]
  },
  {
    title: '质量检测',
    content: '进行产品品质检测，确保符合有机标准',
    time: '2023-09-25',
    type: 'success',
    operations: [
      { name: '重金属含量', value: '合格' },
      { name: '农药残留', value: '未检出' }
    ]
  }
]

// 初始化图表
const initChart = () => {
  if (!timelineChart.value) return
  
  chart = echarts.init(timelineChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['温度', '湿度', '生长高度']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['4月', '5月', '6月', '7月', '8月', '9月']
    },
    yAxis: [
      {
        type: 'value',
        name: '温度/湿度',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        }
      },
      {
        type: 'value',
        name: '高度',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value}cm'
        }
      }
    ],
    series: [
      {
        name: '温度',
        type: 'line',
        smooth: true,
        data: [22, 25, 28, 30, 28, 25],
        itemStyle: {
          color: '#F56C6C'
        }
      },
      {
        name: '湿度',
        type: 'line',
        smooth: true,
        data: [80, 75, 70, 65, 75, 85],
        itemStyle: {
          color: '#409EFF'
        }
      },
      {
        name: '生长高度',
        type: 'bar',
        yAxisIndex: 1,
        data: [5, 20, 45, 70, 90, 95],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83cd66' },
            { offset: 1, color: '#67C23A' }
          ])
        }
      }
    ]
  }
  
  chart.setOption(option)
  
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 返回上一页
const goBack = () => {
  router.push(`/product/${route.params.id}`)
}

// 前往下一环节
const goToNextSection = () => {
  router.push(`/logistics/${route.params.id}`)
}

// 从localStorage获取生产信息
const fetchProductionData = () => {
  try {
    loading.value = true
    
    // 从localStorage获取数据
    const storedProductionInfo = localStorage.getItem('productionInfo')
    
    if (storedProductionInfo) {
      productionInfo.value = JSON.parse(storedProductionInfo)

      productionSteps.value = [
        { title: '土地准备', description: '土壤改良与施肥', icon: 'Crop' },
        { title: '播种', description: formatDate(productionInfo.value.plantingDate), icon: 'Calendar' },
        { title: '生长管理', description: '水肥管理与病虫害防治', icon: 'WindPower' },
        { title: '成熟监测', description: '品质监测与成熟度评估', icon: 'Check' },
        { title: '收获', description: formatDate(productionInfo.value.harvestDate), icon: 'Sunny' }
      ]
    }
  } catch (error) {
    console.error('获取生产数据失败', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProductionData()
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
.production-container {
  min-height: 100vh;
  width: 100vw;
  background-color: #f0f9eb;
  overflow-x: hidden;
}

.header {
  background: linear-gradient(135deg, #7ecc5d, #3aa773);
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
  background: linear-gradient(135deg, #95de7d, #67c23a);
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
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.process-info, .environment-content, .flow-content, .timeline-content, .records-content {
  padding: 20px;
}

.process-details, .place-details {
  margin-bottom: 20px;
}

.place-details h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #67c23a;
}

.highlight-text {
  font-size: 18px;
  font-weight: 600;
  color: #67c23a;
}

.environment-item {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.environment-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.env-value {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
}

.env-status {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 500;
}

.soil-icon {
  color: #67C23A;
}

.water-icon {
  color: #409EFF;
}

.air-icon {
  color: #67C23A;
}

.sun-icon {
  color: #E6A23C;
}

.weather-icon {
  color: #67C23A;
}

.organic-icon {
  color: #67C23A;
}

.flow-content {
  padding: 20px 0;
}

.timeline-chart {
  width: 100%;
  height: 400px;
}

.activity-operations {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
  font-size: 13px;
  color: #606266;
}

.activity-operations span {
  background-color: #f0f9eb;
  padding: 3px 8px;
  border-radius: 4px;
}

.next-section {
  margin-top: 20px;
}

.next-section-content {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #ffd04b, #e6a23c);
  color: white;
  padding: 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.next-section-content:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.next-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  margin-right: 20px;
  font-size: 24px;
}

.next-info {
  flex: 1;
}

.next-info h3 {
  margin: 0 0 5px;
  font-size: 18px;
}

.next-info p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.next-arrow {
  font-size: 24px;
  animation: bounce 1s infinite alternate;
}

@keyframes bounce {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(10px);
  }
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
  
  .environment-item {
    margin-bottom: 20px;
  }
  
  .next-section-content {
    flex-direction: column;
    text-align: center;
  }
  
  .next-icon {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .next-arrow {
    margin-top: 10px;
    transform: rotate(90deg);
  }
  
  @keyframes bounce {
    from {
      transform: translateY(0) rotate(90deg);
    }
    to {
      transform: translateY(10px) rotate(90deg);
    }
  }
}
</style>