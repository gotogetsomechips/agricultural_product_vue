<template>
  <div class="home-container">

    <!-- 第一部分：参考样式代码1.txt中的代码风格 -->
    <section class="home-section kenbarn vegas-container">
      <div class="vegas-overlay"></div>
      <div class="carousel-container">
        <div class="carousel-slide" 
             v-for="(slide, index) in carouselSlides" 
             :key="index"
             :style="{ 
               backgroundImage: `url(${slide.image})`,
               opacity: currentSlide === index ? 1 : 0
             }">
        </div>
      </div>
      <div class="vegas-wrapper">
        <div class="image-wrap">
          <div class="kenburn-overlay">
            <div class="intro-section text-center">
              <!-- 替换成溯源码输入框 -->
              <div class="trace-input-container">
                <h2 class="trace-title">农产品溯源查询</h2>
                <div class="trace-input-box">
                  <el-input 
                    v-model="traceCode" 
                    placeholder="请输入溯源码" 
                    class="trace-input"
                    size="large"
                    clearable
                    @keyup.enter="searchTrace">
                    <template #prefix>
                      <i class="el-icon-search"></i>
                    </template>
                  </el-input>
                  <el-button 
                    type="primary" 
                    @click="searchTrace" 
                    :loading="loading"
                    size="large"
                    class="trace-button">
                    查询
                  </el-button>
                </div>
                <p class="trace-tip">输入溯源码，了解产品生产、物流、销售全过程信息</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 添加代码三：数字统计部分 -->
    <div class="countup_met_36_1_52 met-index-body">
      <div id="particles-js"></div>
      <div class="container text-xs-center">
        <ul class="blocks-xs-2 blocks-md-2 blocks-lg-4 blocks-xxl-4">
          <li>
            <h5>
              <span class="counter" data-numto="15">10</span>
              <span class="span-two">年</span>
            </h5>
            <span>专注农产品一物一码领域</span>
            <p></p>
          </li>
          
          <li>
            <h5>
              <span class="counter" data-numto="16">5</span>
              <span class="span-two">亿</span>
            </h5>
            <span>年生码数量</span>
            <p></p>
          </li>
          
<!--           <li>
            <h5>
              <span class="counter" data-numto="27">27</span>
              <span class="span-two">项</span>
            </h5>
            <span>软件著作与专利</span>
            <p></p>
          </li> -->
          
          <li>
            <h5>
              <span class="counter" data-numto="2000">2,000</span>
              <span class="span-two">家</span>
            </h5>
            <span>服务品牌超市</span>
            <p></p>
          </li>
        </ul>
      </div>
    </div>

    <!-- 第二部分：参考样式代码2.txt中的代码风格 -->
    <div class="service_list_met_28_22_57 met-index-body text-xs-center bgcolor">
      <div class="container">
        <h2 class="m-t-0 font-weight-500 animation-slide-top appear-no-repeat">产品优势</h2>
        <p class="desc m-b-0 font-weight-500 animation-fade appear-no-repeat">Product Advantages</p>
        <div class="maintitle">
          <ul class="blocks-xs-4 blocks-md-4 blocks-lg-4 blocks-xxl-4 index-service-list">
            <li class="animation-slide-bottom50 appear-no-repeat" 
                :class="{ cur: activeTab === 0 }" 
                @mouseover="activeTab = 0">
              <i class="el-icon-document" aria-hidden="true"></i>
              <h3 class="font-weight-300">全程溯源</h3>
            </li>
            <li class="animation-slide-bottom50 appear-no-repeat" 
                :class="{ cur: activeTab === 1 }" 
                @mouseover="activeTab = 1">
              <i class="el-icon-box" aria-hidden="true"></i>
              <h3 class="font-weight-300">智链营销</h3>
            </li>
            <li class="animation-slide-bottom50 appear-no-repeat" 
                :class="{ cur: activeTab === 2 }" 
                @mouseover="activeTab = 2">
              <i class="el-icon-setting" aria-hidden="true"></i>
              <h3 class="font-weight-300">产线智造</h3>
            </li>
            <li class="animation-slide-bottom50 appear-no-repeat" 
                :class="{ cur: activeTab === 3 }" 
                @mouseover="activeTab = 3">
              <i class="el-icon-service" aria-hidden="true"></i>
              <h3 class="font-weight-300">码联售后</h3>
            </li>
          </ul>
        </div>
      </div>
      <div class="in01_col_w bgcolor">
        <div class="container">
          <div class="in01_col" v-show="activeTab === 0">
            <div class="am-cf col">
              <div class="txt">

                <div class="des">
                  我们的农产品全程溯源系统确保每一份产品从田间到餐桌的每一个环节都透明可查。通过扫描二维码或输入批次编号，您可以查看农产品的种植地点、使用的肥料和农药种类及用量、收获时间以及运输过程中的温度控制情况等详细信息。这种全程透明化的管理不仅保障了食品的安全性和新鲜度，还让消费者能够放心选择健康绿色的产品。
                </div>
              </div>
              <div class="img">
                <img src="../statics/1.jpg" alt="全程溯源">
              </div>
            </div>
          </div>
          <div class="in01_col" v-show="activeTab === 1">
            <div class="am-cf col">
              <div class="txt">

                <div class="des">
                  借助先进的区块链技术，我们实现了农产品供应链的智能化管理。这意味着所有与产品相关的交易记录都被安全地存储在一个不可篡改的分布式账本上，从而保证了数据的真实性和完整性。对于消费者而言，这不仅意味着更高的信任度，还能享受到基于真实数据推荐的个性化购物体验。此外，通过智链营销平台，消费者可以直接支持他们喜爱的小农户或有机农场，促进可持续农业发展
                </div>
              </div>
              <div class="img">
                <img src="../statics/2.jpg" alt="智链营销">
              </div>
            </div>
          </div>
          <div class="in01_col" v-show="activeTab === 2">
            <div class="am-cf col">
              <div class="txt">

                <div class="des">
                  在生产线上，我们采用国际领先的加工技术和严格的质量控制标准来处理农产品。无论是清洗、分拣还是包装，每个步骤都在无菌环境下进行，以最大限度地保留产品的营养价值。同时，自动化设备的应用提高了工作效率，减少了人为错误的可能性。这些措施共同作用，确保了最终到达消费者手中的每一款农产品都是高品质且安全可靠的。
                </div>
              </div>
              <div class="img">
                <img src="../statics/3.jpg" alt="产线智造">
              </div>
            </div>
          </div>
          <div class="in01_col" v-show="activeTab === 3">
            <div class="am-cf col">
              <div class="txt">

                <div class="des">
                  为了给消费者提供更优质的服务，我们推出了"码联售后"服务。当您购买任何带有专属二维码标识的农产品后，只需扫描该码即可享受快速响应的售后服务。无论是关于产品的使用建议、质量问题反馈还是退换货请求，"码联售后"都能为您提供一站式解决方案。此外，通过参与定期举办的线上线下互动活动，消费者还可以获得更多优惠券和积分奖励，进一步增强购物体验的同时也加深了对品牌的忠诚度。
                </div>
              </div>
              <div class="img">
                <img src="../statics/4.jpg" alt="码联售后">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误提示对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="提示"
      width="30%"
      center>
      <span>{{ errorMessage }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加悬浮可拖拽图标 -->
    <div
        class="floating-icon"
        :style="{ left: position.x + 'px', top: position.y + 'px' }"
        @mousedown="startDrag"
        @touchstart="startDragTouch"
        @click="toggleChatBot"
        ref="floatingIcon"
    >
      <img src="../statics/ai.png" alt="AI助手" />
    </div>

    <ChatBot v-model:visible="showChatBot" :style="chatBotPosition" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import ChatBot from '../components/ChatBot.vue'

const router = useRouter()
const traceCode = ref('')
const loading = ref(false)
const dialogVisible = ref(false)
const errorMessage = ref('')
const activeTab = ref(0) // 默认选中第一个标签
// 添加chatBot状态
const showChatBot = ref(false)

// 计算ChatBot的位置，使其从悬浮图标延伸出来
const chatBotPosition = computed(() => {
  return {
    right: `${window.innerWidth - position.x - 30}px`,
    bottom: `${window.innerHeight - position.y + 60}px`
  }
})

// 切换ChatBot显示状态
const toggleChatBot = () => {
  showChatBot.value = !showChatBot.value
}
// 轮播图数据
const carouselSlides = reactive([
  { image: new URL('../statics/1round.jpg', import.meta.url).href },
  { image: new URL('../statics/2round.jpg', import.meta.url).href },
  { image: new URL('../statics/3round.jpg', import.meta.url).href },
  { image: new URL('../statics/4round.jpg', import.meta.url).href }
])
const currentSlide = ref(0)
let slideInterval = null

// 轮播图自动切换
const startSlideshow = () => {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % carouselSlides.length
  }, 4000) // 每4秒切换一次
}

// 初始化粒子效果和计数器
const initParticlesAndCounters = () => {
  // 如果已经加载了 particles.js 库
  if (window.particlesJS) {
    window.particlesJS('particles-js', {
      particles: {
        number: {
          value: 50,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: '#056e4c'
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 0,
            color: '#000000'
          }
        },
        opacity: {
          value: 0.6,
          random: false,
          anim: {
            enable: false
          }
        },
        size: {
          value: 4,
          random: true,
          anim: {
            enable: false
          }
        },
        line_linked: {
          enable: true,
          distance: 200,
          color: '#056e4c',
          opacity: 0.7,
          width: 2
        },
        move: {
          enable: true,
          speed: 2.5,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'grab'
          },
          onclick: {
            enable: true,
            mode: 'push'
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 180,
            line_linked: {
              opacity: 0.8
            }
          },
          push: {
            particles_nb: 6
          }
        }
      },
      retina_detect: true
    });
  }

  // 初始化计数器
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-numto'), 10);
    const duration = 2000; // 2秒内完成计数
    const start = 0;
    const increment = Math.ceil(target / (duration / 20)); // 每20ms增加的数值
    let current = start;
    
    const updateCounter = () => {
      current += increment;
      if (current >= target) {
        counter.textContent = target === 2000 ? '2,000' : target; // 格式化显示
        clearInterval(timer);
      } else {
        counter.textContent = current;
      }
    };
    
    const timer = setInterval(updateCounter, 20);
  });
};

// 组件挂载时启动轮播和初始化粒子效果
onMounted(() => {
  startSlideshow();

  // 动态加载 particles.js
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
  script.onload = () => {
    initParticlesAndCounters();
  };
  document.head.appendChild(script);

  // 初始化悬浮图标位置
  setInitialPosition();

  // 添加全局事件监听器
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchmove', onDragTouch);
  document.addEventListener('touchend', stopDrag);
})

// 组件卸载前清除定时器和事件监听器
onBeforeUnmount(() => {
  if (slideInterval) clearInterval(slideInterval);

  // 移除拖拽相关的事件监听器
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchmove', onDragTouch);
  document.removeEventListener('touchend', stopDrag);
})

// 组件卸载前清除定时器
onBeforeUnmount(() => {
  if (slideInterval) clearInterval(slideInterval);
})

// 查询溯源信息
const searchTrace = async () => {
  if (!traceCode.value) {
    errorMessage.value = '请输入溯源码'
    dialogVisible.value = true
    return
  }

  loading.value = true
  try {
    // 查询销售信息
     const saleRes = await axios.get(`/traceability/saleinfo/${traceCode.value}`)
    
    // 开发测试阶段，自定义一个res数据，方便测试
/*     const saleRes = {
      data: {
        data: {
          siId: 100255549849,
          logisticsId: 301,
          salePlaceId: 601,
          siDescription: '产品已通过严格质量检验，包装完好，适合销售',
          saleTime: '2023-10-05 10:30:00',
          pdName: '有机大米',
          spAddress: '北京市朝阳区永辉超市旗舰店',
          spAdministrator: '王丽',
          spPhone: '13567890123'
        }
      }
    } */
    
    if (saleRes.data && saleRes.data.data) {
      // 将销售信息存储到localStorage
      localStorage.setItem('saleInfo', JSON.stringify(saleRes.data.data))
      
      // 获取物流信息
       const logisticsRes = await axios.get(`/traceability/logistics/${saleRes.data.data.logisticsId}`)
      
      // 测试数据 - 物流信息
/*       const logisticsRes = {
        data: {
          data: {
            logId: 301,
            productInfoId: 101,
            companyId: 401,
            startLocation: '黑龙江省五常市',
            destination: '北京市朝阳区',
            startTime: '2023-10-01 08:00:00',
            endTime: '2023-10-03 15:30:00',
            pdName: '有机大米',
            comName: '安达物流有限公司',
            comAdministrator: '李明',
            comPhone: '13987654321'
          }
        }
      }
       */
      if (logisticsRes.data && logisticsRes.data.data) {
        // 将物流信息存储到localStorage
        localStorage.setItem('logisticsInfo', JSON.stringify(logisticsRes.data.data))
        
        // 获取生产信息
         const productionRes = await axios.get(`/traceability/productinfo/${logisticsRes.data.data.productInfoId}`)
        
        // 测试数据 - 生产信息
/*         const productionRes = {
          data: {
            data: {
              piId: 101,
              productId: 201,
              productPlaceId: 301,
              seed: '优质有机水稻种子',
              piDescription: '采用有机种植方式，全程不使用化学农药和化肥，确保产品品质',
              plantingDate: '2023-04-15 08:00:00',
              harvestDate: '2023-09-20 16:30:00',
              pdName: '有机大米',
              ppAddress: '黑龙江省五常市稻花香大米种植基地',
              ppAdministrator: '张大明',
              ppPhone: '13812345678'
            }
          }
        } */
        
        if (productionRes.data && productionRes.data.data) {
          // 将生产信息存储到localStorage
          localStorage.setItem('productionInfo', JSON.stringify(productionRes.data.data))
          
          // 获取产品信息
           const productRes = await axios.get(`/traceability/product/${productionRes.data.data.productId}`)
          
          // 测试数据 - 产品信息
/*           const productRes = {
            data: {
              data: {
                pdId: 201,
                pdName: '有机大米',
                type: '粮食',
                image: '/src/statics/orange.jpg',
                pdDescription: '优质有机大米，采用传统种植方法，无农药残留'
              }
            }
          } */
          
          if (productRes.data && productRes.data.data) {
            // 将产品信息存储到localStorage
            localStorage.setItem('productInfo', JSON.stringify(productRes.data.data))
            
            // 跳转到产品页面
            router.push(`/product/${productRes.data.data.pdId}`)
          } else {
            errorMessage.value = '未找到产品信息'
            dialogVisible.value = true
          }
        } else {
          errorMessage.value = '未找到生产信息'
          dialogVisible.value = true
        }
      } else {
        errorMessage.value = '未找到物流信息'
        dialogVisible.value = true
      }
    } else {
      errorMessage.value = '溯源码不存在，请检查输入是否正确'
      dialogVisible.value = true
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = '查询失败，请稍后再试'
    dialogVisible.value = true
  } finally {
    loading.value = false
  }
}
// 悬浮图标位置
const position = reactive({
  x: 50,
  y: 100
});

// 拖拽状态
const isDragging = ref(false);
const floatingIcon = ref(null);
const dragOffset = reactive({ x: 0, y: 0 });

// 设置初始位置
const setInitialPosition = () => {
  // 默认位置在右下角
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  position.x = windowWidth - 100;
  position.y = windowHeight - 50;

  // 如果有本地存储的位置，则使用之前保存的位置
  const savedPosition = localStorage.getItem('floatingIconPosition');
  if (savedPosition) {
    try {
      const pos = JSON.parse(savedPosition);

      // 确保图标不会超出屏幕边界
      if (pos.x >= 0 && pos.x <= windowWidth - 60 &&
          pos.y >= 0 && pos.y <= windowHeight - 60) {
        position.x = pos.x;
        position.y = pos.y;
      }
    } catch (e) {
      console.error('无法解析保存的位置数据', e);
    }
  }
};

// 开始拖拽（鼠标）
const startDrag = (e) => {
  isDragging.value = true;
  // 记录鼠标点击位置与图标位置的偏移量
  dragOffset.x = e.clientX - position.x;
  dragOffset.y = e.clientY - position.y;

  // 阻止默认行为，防止文本选择等
  e.preventDefault();
};

// 开始拖拽（触摸）
const startDragTouch = (e) => {
  isDragging.value = true;
  const touch = e.touches[0];
  dragOffset.x = touch.clientX - position.x;
  dragOffset.y = touch.clientY - position.y;

  // 阻止默认行为，防止页面滚动
  e.preventDefault();
};

// 拖拽中（鼠标）
const onDrag = (e) => {
  if (!isDragging.value) return;

  // 计算新位置
  const newX = e.clientX - dragOffset.x;
  const newY = e.clientY - dragOffset.y;

  // 更新位置，限制在视口范围内
  updatePosition(newX, newY);
};

// 拖拽中（触摸）
const onDragTouch = (e) => {
  if (!isDragging.value) return;

  const touch = e.touches[0];
  const newX = touch.clientX - dragOffset.x;
  const newY = touch.clientY - dragOffset.y;

  // 更新位置，限制在视口范围内
  updatePosition(newX, newY);

  // 阻止默认行为
  e.preventDefault();
};

// 更新位置，限制在视口范围内
const updatePosition = (x, y) => {
  const maxX = window.innerWidth - (floatingIcon.value ? floatingIcon.value.offsetWidth : 60);
  const maxY = window.innerHeight - (floatingIcon.value ? floatingIcon.value.offsetHeight : 60);

  position.x = Math.max(0, Math.min(x, maxX));
  position.y = Math.max(0, Math.min(y, maxY));

  // 保存位置到本地存储
  localStorage.setItem('floatingIconPosition', JSON.stringify(position));
};

// 停止拖拽
const stopDrag = () => {
  isDragging.value = false;
};
</script>

<style scoped>
.home-container {
  width: 100vw;
  overflow-x: hidden;
}

/* 第一部分样式 */
.home-section {
  position: relative;
  height: 600px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 悬浮图标样式 */
.floating-icon {
  position: fixed;
  width: 60px;
  height: 60px;
  z-index: 9999;
  cursor: move;
  user-select: none;
  border-radius: 50%;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
  animation: bounce 1s ease-in-out;
  transition: transform 0.2s, box-shadow 0.2s;
  z-index: 10000; /* 确保在ChatBot上方 */
}

.floating-icon:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.floating-icon:active {
  transform: scale(0.9);
}
/* 添加连接线动画 */
.floating-icon::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 0;
  background-color: #42b983;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  transition: height 0.3s ease;
  z-index: 9998;
}
.floating-icon.active::after {
  height: 60px;
}
.floating-icon img {
  width: 80%;
  height: 80%;
  object-fit: contain;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}
.carousel-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: opacity 1s ease-in-out;
}

.vegas-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.vegas-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-wrap {
  width: 100%;
}

.kenburn-overlay {
  width: 100%;
}

.intro-section {
  width: 100%;
  padding: 0 20px;
  animation: fadeInUp 1s ease-out;
}

.trace-input-container {
  max-width: 650px;
  margin: 0 auto;
  padding: 0;
  animation: fadeIn 0.8s ease-out;
}

.trace-title {
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 35px;
  color: #fff;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
}

.trace-input-box {
  display: flex;
  margin-bottom: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
}

.trace-input {
  flex: 1;
}

.trace-input :deep(.el-input__wrapper) {
  border-radius: 8px 0 0 8px;
  box-shadow: none;
  height: 54px;
  padding-left: 15px;
  background-color: rgba(255, 255, 255, 0.95);
}

.trace-input :deep(.el-input__inner) {
  font-size: 16px;
  color: #333;
}

.trace-button {
  width: 120px;
  height: 54px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  border: none;
  border-radius: 0 8px 8px 0;
  background-image: linear-gradient(135deg, #42b983 0%, #3aa773 100%);
  transition: all 0.3s ease;
}

.trace-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(66, 185, 131, 0.4);
  background-image: linear-gradient(135deg, #3aa773 0%, #42b983 100%);
}

.trace-tip {
  font-size: 15px;
  color: #fff;
  text-align: center;
  margin-top: 5px;
  font-weight: 300;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 第二部分样式 */
.bgcolor {
  background-color: #f8f8f8;
}

.met-index-body {
  padding: 50px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.m-t-0 {
  margin-top: 0;
}

.font-weight-500 {
  font-weight: 500;
}

.font-weight-300 {
  font-weight: 300;
}

.animation-slide-top {
  animation-duration: 1s;
  animation-name: slideTop;
}

.animation-fade {
  animation-duration: 1s;
  animation-name: fade;
}

.desc {
  color: #999;
  margin-bottom: 30px !important;
}

.maintitle {
  margin-top: 40px;
}

.index-service-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
}

.index-service-list li {
  flex: 1;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.index-service-list li:hover {
  background-color: #e9f7ef;
}

.index-service-list li.cur {
  background-color: #e9f7ef;
}

.index-service-list i {
  font-size: 40px;
  margin-bottom: 15px;
  color: #42b983;
}

.in01_col_w {
  margin-top: 40px;
  padding: 30px 0;
  background-color: #e9f7ef;
}

.in01_col {
  padding: 20px;
  transition: opacity 0.3s ease;
}

.in01_col[v-show="false"] {
  opacity: 0;
  pointer-events: none;
}

.in01_col[v-show="true"] {
  opacity: 1;
}

.am-cf:after {
  content: "";
  display: table;
  clear: both;
}

.col {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.txt {
  flex: 1;
  padding-right: 30px;
}

.img {
  flex: 1;
  text-align: center;
}

.img img {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.t {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.des {
  line-height: 1.7;
  color: #666;
}

.animation-slide-bottom50 {
  animation-duration: 1s;
  animation-name: slideBottom;
}

.leftfadeInUp {
  animation-duration: 1s;
  animation-name: fadeInUp;
}

.rightfadeInUp {
  animation-duration: 1s;
  animation-name: fadeInUp;
  animation-delay: 0.3s;
}

@keyframes slideTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideBottom {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .col {
    flex-direction: column;
  }
  .txt {
    padding-right: 0;
    margin-bottom: 20px;
  }
  .trace-input-box {
    flex-direction: column;
  }
  .trace-input {
    margin-right: 0;
    margin-bottom: 10px;
  }
  .trace-button {
    width: 100%;
  }
  .blocks-xs-4 {
    flex-wrap: wrap;
  }
  .blocks-xs-4 li {
    flex: 0 0 50%;
  }
}

/* 数字统计部分样式 */
.countup_met_36_1_52 {
  position: relative;
  background-color: #e9f7ef;
  color: #333;
  padding: 40px 0;
  overflow: hidden;
}

#particles-js {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.countup_met_36_1_52 .container {
  position: relative;
  z-index: 2;
  max-width: 1000px;
}

.countup_met_36_1_52 ul {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
  justify-content: space-around;
}

.countup_met_36_1_52 li {
  flex: 0 0 22%;
  padding: 15px 10px;
  text-align: center;
  margin: 0 5px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.countup_met_36_1_52 li:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.countup_met_36_1_52 h5 {
  font-size: 16px;
  margin-bottom: 15px;
}

.countup_met_36_1_52 .counter {
  font-size: 48px;
  font-weight: 700;
  display: inline-block;
  margin-right: 5px;
  color: #0a5b47;
  background: linear-gradient(135deg, #0a5b47, #42b983);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.countup_met_36_1_52 .span-two {
  font-size: 24px;
  font-weight: normal;
  display: inline-block;
  vertical-align: top;
  margin-top: 10px;
  color: #0a5b47;
}

.countup_met_36_1_52 li > span {
  display: block;
  font-size: 16px;
  color: #555;
  margin-top: 10px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .countup_met_36_1_52 li {
    flex: 0 0 45%;
    margin-bottom: 20px;
  }
  
  .countup_met_36_1_52 .counter {
    font-size: 40px;
  }
  
  .countup_met_36_1_52 .span-two {
    font-size: 20px;
  }
}
</style>

<style scoped>
.fade-transition {
  transition: opacity 0.3s ease;
  opacity: 0;
}
.fade-transition.loaded {
  opacity: 1;
}
</style>
