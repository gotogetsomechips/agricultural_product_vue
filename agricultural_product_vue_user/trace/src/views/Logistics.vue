<template>
  <div class="logistics-container">
    <!-- 添加浮动导航 -->
    <FloatingNav :productId="route.params.id" :offsetY="170" />
    
    <div class="header">
      <div class="container">
        <h1 class="title">物流环节溯源</h1>
      </div>
    </div>

    <div class="content-container">
      <div class="container">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton style="width: 100%" animated :rows="10" />
        </div>

        <!-- 无数据提示 -->
        <div v-else-if="!logisticsInfo" class="empty-container">
          <el-empty description="未找到物流信息" />
          <el-button type="primary" @click="goBack">返回产品页</el-button>
        </div>

        <!-- 数据内容展示 -->
        <div v-else class="data-container">
          <!-- 物流环节标题 -->
          <div class="section-header">
            <div class="header-icon">
              <el-icon><Van /></el-icon>
            </div>
            <h2>运输物流信息</h2>
            <el-tag type="warning" effect="dark" size="large">物流编号: {{ logisticsInfo.logId }}</el-tag>
          </div>

          <!-- 物流状态卡片 -->
 <!--          <el-card class="info-card status-card">
            <template #header>
              <div class="card-header">
                <span>物流状态</span>
                <el-tag type="success">已完成</el-tag>
              </div>
            </template>
            <div class="status-content">
              <div class="status-timeline">
                <el-steps direction="vertical" :active="4" finish-status="success">
                  <el-step v-for="(step, index) in logisticsSteps" :key="index" :title="step.title" :description="step.time">
                    <template #icon>
                      <el-icon><component :is="step.icon" /></el-icon>
                    </template>
                  </el-step>
                </el-steps>
              </div>
              <div class="status-map">
                <div class="map-container">
                  <div class="map-placeholder">
                    <img src="https://img.freepik.com/free-vector/city-map-with-pins-navigator-concept_23-2147627714.jpg" alt="路线图">
                    <div class="route-line"></div>
                    <div class="start-point">
                      <el-icon><Location /></el-icon>
                      <span>{{ logisticsInfo.startLocation }}</span>
                    </div>
                    <div class="end-point">
                      <el-icon><Location /></el-icon>
                      <span>{{ logisticsInfo.destination }}</span>
                    </div>
                  </div>
                </div>
                <div class="route-info">
                  <div class="route-detail">
                    <div class="detail-item">
                      <span class="label">运输距离</span>
                      <span class="value">1,206 公里</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">运输时间</span>
                      <span class="value">{{ calculateDuration(logisticsInfo.startTime, logisticsInfo.endTime) }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">运输方式</span>
                      <span class="value">冷链货运</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
 -->
          <!-- 物流信息卡片 -->
          <el-card class="info-card logistics-info">
            <template #header>
              <div class="card-header">
                <span>物流详情</span>
                <el-tag type="info">基本信息</el-tag>
              </div>
            </template>
            <div class="logistics-content">
              <el-row :gutter="20">
                <el-col :xs="24" :sm="12">
                  <div class="info-section">
                    <h3 class="section-title">运输信息</h3>
                    <el-descriptions :column="1" border size="large">
                      <el-descriptions-item label="起点">{{ logisticsInfo.startLocation }}</el-descriptions-item>
                      <el-descriptions-item label="目的地">{{ logisticsInfo.destination }}</el-descriptions-item>
                      <el-descriptions-item label="出发时间">{{ formatDateTime(logisticsInfo.startTime) }}</el-descriptions-item>
                      <el-descriptions-item label="到达时间">{{ formatDateTime(logisticsInfo.endTime) }}</el-descriptions-item>
                    </el-descriptions>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <div class="info-section">
                    <h3 class="section-title">物流公司</h3>
                    <el-descriptions :column="1" border size="large">
                      <el-descriptions-item label="公司名称">{{ logisticsInfo.comName }}</el-descriptions-item>
                      <el-descriptions-item label="负责人">{{ logisticsInfo.comAdministrator }}</el-descriptions-item>
                      <el-descriptions-item label="联系电话">{{ logisticsInfo.comPhone }}</el-descriptions-item>
                      <el-descriptions-item label="物流评级">
                        <el-rate v-model="companyRating" disabled show-score text-color="#ff9900"></el-rate>
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>

          <!-- 运输条件监控 -->
<!--           <el-card class="info-card monitor-card">
            <template #header>
              <div class="card-header">
                <span>运输条件监控</span>
                <el-tag type="success">全程监控</el-tag>
              </div>
            </template>
            <div class="monitor-content">
              <div class="chart-container">
                <div ref="temperatureChart" class="temperature-chart"></div>
              </div>
              <div class="monitor-statistics">
                <el-row :gutter="20">
                  <el-col :xs="12" :sm="6" v-for="(stat, index) in monitorStats" :key="index">
                    <div class="stat-card" :class="stat.class">
                      <div class="stat-icon">
                        <el-icon><component :is="stat.icon" /></el-icon>
                      </div>
                      <div class="stat-info">
                        <div class="stat-value">{{ stat.value }}</div>
                        <div class="stat-label">{{ stat.label }}</div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-card> -->

          <!-- 运输路线图 -->
          <el-card class="info-card route-card">
            <template #header>
              <div class="card-header">
                <span>运输路线</span>
                <el-tag type="warning">途经站点</el-tag>
              </div>
            </template>
            <div class="route-content">
              <el-steps :active="4" finish-status="success" align-center>
                <el-step v-for="(station, index) in transportStations" :key="index" :title="station.location" :description="station.time">
                  <template #icon>
                    <el-icon><component :is="index === 0 || index === transportStations.length - 1 ? 'Location' : 'Van'" /></el-icon>
                  </template>
                </el-step>
              </el-steps>
            </div>
          </el-card>

          <!-- 运输车辆信息 -->
          <el-card class="info-card vehicle-card">
            <template #header>
              <div class="card-header">
                <span>运输车辆</span>
                <el-tag type="info">车辆信息</el-tag>
              </div>
            </template>
            <div class="vehicle-content">
              <el-row :gutter="30">
                <el-col :xs="24" :sm="12">
                  <div class="vehicle-image">
                    <img src="../statics/擎天柱.jpg" alt="运输车辆">
                  </div>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <div class="vehicle-details">
                    <el-descriptions :column="1" border>
                      <el-descriptions-item label="车辆类型">冷藏物流车</el-descriptions-item>
                      <el-descriptions-item label="车牌号码">黑A·12345</el-descriptions-item>
                      <el-descriptions-item label="驾驶员">王师傅</el-descriptions-item>
                      <el-descriptions-item label="联系电话">139****5678</el-descriptions-item>
                      <el-descriptions-item label="车辆状态">
                        <el-tag type="success">正常</el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item label="安全检查">
                        <el-tag type="success">已通过</el-tag>
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>

          <!-- 溯源进程卡片组件 -->
          <TraceabilityProcess 
            :productId="route.params.id" 
            :productName="logisticsInfo.pdName || '产品'" 
            currentStep="logistics" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, ArrowRight, Van, Shop, Location, Box, TakeawayBox, Timer, Odometer, Refrigerator } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import FloatingNav from '../components/FloatingNav.vue'
import TraceabilityProcess from '../components/TraceabilityProcess.vue'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const logisticsInfo = ref(null)
const companyRating = ref(4.8)
const temperatureChart = ref(null)
let chart = null

// 物流步骤信息
const logisticsSteps = [
  {
    title: '已发货',
    time: '2023-10-01 08:00',
    icon: 'Box'
  },
  {
    title: '运输中',
    time: '2023-10-01 12:30',
    icon: 'Van'
  },
  {
    title: '途经中转站',
    time: '2023-10-02 15:00',
    icon: 'TakeawayBox'
  },
  {
    title: '已送达',
    time: '2023-10-03 15:30',
    icon: 'Location'
  }
]

// 监控数据
const monitorStats = [
  {
    label: '平均温度',
    value: '4.2℃',
    icon: 'Refrigerator',
    class: 'temperature'
  },
  {
    label: '湿度范围',
    value: '45-60%',
    icon: 'Umbrella',
    class: 'humidity'
  },
  {
    label: '运输时长',
    value: '2天7小时',
    icon: 'Timer',
    class: 'duration'
  },
  {
    label: '行驶里程',
    value: '1,206公里',
    icon: 'Odometer',
    class: 'distance'
  }
]

// 运输路线站点
const transportStations = ref ([])

// 计算运输时长
const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '暂无数据'
  
  const start = new Date(startTime)
  const end = new Date(endTime)
  
  const diffInMs = end - start
  const diffInHours = diffInMs / (1000 * 60 * 60)
  
  const days = Math.floor(diffInHours / 24)
  const hours = Math.floor(diffInHours % 24)
  
  return `${days}天${hours}小时`
}

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

// 前往下一环节
const goToNextSection = () => {
  router.push(`/sale/${route.params.id}`)
}

// 初始化温度图表
const initChart = () => {
  if (!temperatureChart.value) return
  
  chart = echarts.init(temperatureChart.value)
  
  // 模拟温度数据
  const hours = []
  const temperatures = []
  
  // 3天的每4小时采样一次
  for (let i = 0; i < 18; i++) {
    const time = new Date('2023-10-01 08:00')
    time.setHours(time.getHours() + i * 4)
    hours.push(formatDateTime(time).substring(5, 16))
    
    // 模拟温度波动 (2-6℃之间)
    const baseTemp = 4
    const fluctuation = Math.random() * 2 - 1 // -1到1之间的随机数
    temperatures.push((baseTemp + fluctuation).toFixed(1))
  }
  
  const option = {
    title: {
      text: '运输过程温度监控',
      left: 'center',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const temp = params[0].value
        const time = params[0].name
        return `${time}<br/>温度: ${temp}℃`
      }
    },
    xAxis: {
      type: 'category',
      data: hours,
      axisLabel: {
        rotate: 45,
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      name: '温度(℃)',
      min: 0,
      max: 8,
      axisLine: {
        show: true
      },
      axisLabel: {
        formatter: '{value}℃'
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    visualMap: {
      show: false,
      pieces: [
        {
          gt: 6,
          lte: 8,
          color: '#FF4500'
        },
        {
          gt: 0,
          lt: 2,
          color: '#00BFFF'
        },
        {
          gt: 2,
          lte: 6,
          color: '#67C23A'
        }
      ]
    },
    series: [
      {
        name: '温度',
        type: 'line',
        smooth: true,
        data: temperatures,
        markArea: {
          itemStyle: {
            color: 'rgba(103, 194, 58, 0.1)'
          },
          data: [
            [{
              yAxis: 2
            }, {
              yAxis: 6
            }]
          ]
        }
      }
    ]
  }
  
  chart.setOption(option)
  
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 从localStorage获取物流信息
const fetchLogisticsData = () => {
  try {
    loading.value = true
    
    // 从localStorage获取数据
    const storedLogisticsInfo = localStorage.getItem('logisticsInfo')
    
    if (storedLogisticsInfo) {
      logisticsInfo.value = JSON.parse(storedLogisticsInfo)

      transportStations.value = [
        {
          location: logisticsInfo.value.startLocation,
          time: formatDateTime(logisticsInfo.value.startTime)
        },
        {
          location: '长春市',
          time: formatDateTime(new Date(new Date(logisticsInfo.value.startTime).setDate(new Date(logisticsInfo.value.startTime).getDate() + 1)))
        },
        {
          location: '沈阳市',
          time: formatDateTime(new Date(new Date(logisticsInfo.value.endTime).setDate(new Date(logisticsInfo.value.endTime).getDate() - 1)))
        },
        {
          location: logisticsInfo.value.destination,
          time: formatDateTime(logisticsInfo.value.endTime)
        }
      ]
    }
  } catch (error) {
    console.error('获取物流数据失败', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLogisticsData()
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
.logistics-container {
  min-height: 100vh;
  width: 100vw;
  background-color: #f0f9eb;
  overflow-x: hidden;
}

.header {
  background: linear-gradient(135deg, #ffd04b, #e6a23c);
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
  background: linear-gradient(135deg, #ffd04b, #e6a23c);
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

.status-content, .logistics-content, .monitor-content, .route-content, .vehicle-content {
  padding: 20px;
}

.status-timeline {
  margin-bottom: 20px;
}

.status-map {
  margin-top: 30px;
}

.map-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.map-placeholder {
  width: 100%;
  height: 300px;
  position: relative;
}

.map-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.route-line {
  position: absolute;
  top: 50%;
  left: 10%;
  width: 80%;
  height: 6px;
  background: linear-gradient(to right, #67c23a, #e6a23c);
  border-radius: 3px;
  transform: translateY(-50%);
}

.start-point, .end-point {
  position: absolute;
  background-color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.start-point {
  top: 40%;
  left: 5%;
  color: #67c23a;
}

.end-point {
  top: 40%;
  right: 5%;
  color: #e6a23c;
}

.start-point .el-icon, .end-point .el-icon {
  margin-right: 5px;
}

.route-info {
  padding: 15px;
  background-color: #f8f8f8;
  border-radius: 8px;
}

.route-detail {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
}

.detail-item .label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.detail-item .value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.info-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  color: #e6a23c;
  margin-bottom: 15px;
  font-weight: 500;
}

.highlight-text {
  font-size: 18px;
  font-weight: 600;
  color: #e6a23c;
}

.chart-container {
  margin-bottom: 30px;
}

.temperature-chart {
  width: 100%;
  height: 300px;
}

.monitor-statistics {
  margin-top: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  background-color: #f8f8f8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
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

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #606266;
  margin-top: 5px;
}

.stat-card.temperature .stat-icon {
  background-color: #f56c6c;
}

.stat-card.humidity .stat-icon {
  background-color: #409eff;
}

.stat-card.duration .stat-icon {
  background-color: #e6a23c;
}

.stat-card.distance .stat-icon {
  background-color: #67c23a;
}

.vehicle-image {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.vehicle-image img {
  width: 100%;
  height: auto;
  display: block;
}

.next-section {
  margin-top: 20px;
}

.next-section-content {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #a0cfff, #409eff);
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
  
  .stat-card {
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