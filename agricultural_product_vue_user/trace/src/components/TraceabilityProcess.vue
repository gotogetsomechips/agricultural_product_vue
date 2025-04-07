<template>
  <el-card class="info-card traceability-process">
    <template #header>
      <div class="card-header">
        <span>溯源全过程</span>
        <el-tag type="primary">全程透明</el-tag>
      </div>
    </template>
    <div class="process-content">
      <div class="process-flow">
        <div class="process-node" :class="{ current: currentStep === 'production' }">
          <div class="node-icon production">
            <el-icon><Crop /></el-icon>
          </div>
          <div class="node-content">
            <h4>种植生产</h4>
            <p>从播种到收获的完整记录</p>
            <el-link v-if="currentStep !== 'production'" type="primary" @click="goToProduction">查看详情</el-link>
            <span v-else class="current-node-tag">当前环节</span>
          </div>
        </div>
        <div class="process-connector">
          <div class="connector-line"></div>
          <el-icon><ArrowRight /></el-icon>
        </div>
        <div class="process-node" :class="{ current: currentStep === 'logistics' }">
          <div class="node-icon logistics">
            <el-icon><Van /></el-icon>
          </div>
          <div class="node-content">
            <h4>物流运输</h4>
            <p>从产地到销售地的全程监控</p>
            <el-link v-if="currentStep !== 'logistics'" type="warning" @click="goToLogistics">查看详情</el-link>
            <span v-else class="current-node-tag">当前环节</span>
          </div>
        </div>
        <div class="process-connector">
          <div class="connector-line"></div>
          <el-icon><ArrowRight /></el-icon>
        </div>
        <div class="process-node" :class="{ current: currentStep === 'sale' }">
          <div class="node-icon sale">
            <el-icon><Shop /></el-icon>
          </div>
          <div class="node-content">
            <h4>销售记录</h4>
            <p>规范销售渠道，确保产品品质</p>
            <el-link v-if="currentStep !== 'sale'" type="success" @click="goToSale">查看详情</el-link>
            <span v-else class="current-node-tag">当前环节</span>
          </div>
        </div>
      </div>

    </div>
  </el-card>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { Crop, Van, Shop, ArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  productId: {
    type: [String, Number],
    required: true
  },
  productName: {
    type: String,
    default: '产品'
  },
  currentStep: {
    type: String,
    default: ''
  }
})

const router = useRouter()

// 前往生产页面
const goToProduction = () => {
  router.push(`/production/${props.productId}`)
}

// 前往物流页面
const goToLogistics = () => {
  router.push(`/logistics/${props.productId}`)
}

// 前往销售页面
const goToSale = () => {
  router.push(`/sale/${props.productId}`)
}
</script>

<style scoped>
.info-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-top: 30px;
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
  margin: 0;
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