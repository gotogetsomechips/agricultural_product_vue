<template>
  <div class="chatbot-container" :class="{ 'chatbot-visible': visible }" ref="chatbotContainer">
    <div class="chat-header">
      <h3>小农</h3>
      <button class="close-btn" @click="closeChat">×</button>
    </div>
    <div class="chat-box" ref="chatBox">
      <div
          v-for="(message, index) in currentConversation"
          :key="index"
          class="chat-message"
          :class="message.sender === 'user' ? 'user-msg' : 'bot-msg'"
      >
        <div v-if="message.sender === 'bot'" class="avatar">
          <img src="../statics/ai.png" alt="Bot Avatar">
        </div>
        <div class="message-content" v-html="renderMessage(message.displayContent || message.content)"></div>
      </div>
      <div v-if="isLoading && !hasBotResponded" class="chat-message bot-msg">
        <div class="avatar">
          <img src="../statics/ai.png" alt="Bot Avatar">
        </div>
        <div class="message-content">正在思考...</div>
      </div>
    </div>
    <div class="input-box">
      <input
          type="text"
          v-model="userInput"
          placeholder="输入你的问题..."
          @keyup.enter="sendMessage"
          :disabled="isLoading"
          autofocus
      >
      <button @click="sendMessage" :disabled="isLoading">
        <img src="../statics/submit.png">
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { marked } from 'marked'
import axios from 'axios'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['close'])

// 聊天相关状态
const userInput = ref('')
const currentConversation = ref([])
const isLoading = ref(false)
const hasBotResponded = ref(false)
const typingInterval = ref(null)
const typingIndex = ref(0)
const typingMessage = ref(null)
const chatBox = ref(null)

// API相关状态 - 直接使用默认配置
const apiKey = ref('pat_DDWRPU7wHwyEloWpArpjMvR6B4em0e0kSa3oANWnkEc31MqxuuZ5UjQFDdeAyAAg')
const apiEndpoint = ref('https://api.coze.cn/open_api/v2/chat')
const botId = ref('7490580461640056872')
const userId = ref('')

// 初始化
onMounted(() => {
  // 加载或生成用户ID
  userId.value = localStorage.getItem('userId') || 'user_' + Date.now()
  if (!localStorage.getItem('userId')) {
    localStorage.setItem('userId', userId.value)
  }
})

// 渲染消息（转换Markdown和处理图片）
const renderMessage = (message) => {
  const imageRegex = /!\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g
  let processed = message.replace(imageRegex, '<img src="$2" alt="$1" class="message-image">')
  return marked.parse(processed)
}

// 发送消息
const sendMessage = () => {
  if (!userInput.value.trim() || isLoading.value) return

  hasBotResponded.value = false
  currentConversation.value.push({
    sender: 'user',
    content: userInput.value
  })

  const userMessage = userInput.value
  userInput.value = ''
  isLoading.value = true

  // 调用API获取回复
  setTimeout(() => {
    callAPI(userMessage)
  }, 100)

  scrollToBottom()
}

// 调用API获取回复
const callAPI = (message) => {
  // 构建Coze API请求
  const apiRequest = {
    bot_id: botId.value,
    user: userId.value,
    query: message,
    stream: false
  }

  // 向Coze发送API请求
  axios.post(apiEndpoint.value, apiRequest, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.value}`
    }
  })
      .then(response => {
        // 标记机器人已开始响应
        hasBotResponded.value = true

        const messages = response.data.messages || []
        let botMessage = "机器人没有回应"

        for (const message of messages) {
          const messageContent = message.content
          if (messageContent && !messageContent.startsWith("{") && !messageContent.startsWith("RPCError")) {
            botMessage = messageContent
            break
          }
        }

        startTypingEffect(botMessage)
      })
      .catch(error => {
        // 标记机器人已开始响应（即使是错误响应）
        hasBotResponded.value = true
        startTypingEffect("请求API时出错: " + (error.response?.data?.message || error.message))
      })
}

// 开始打字效果
const startTypingEffect = (message) => {
  hasBotResponded.value = true
  const botMessage = {
    sender: 'bot',
    content: message,
    displayContent: ''
  }

  currentConversation.value.push(botMessage)
  if (typingInterval.value) clearInterval(typingInterval.value)

  typingIndex.value = 0
  typingMessage.value = botMessage

  typingInterval.value = setInterval(() => {
    if (typingIndex.value < message.length) {
      typingMessage.value.displayContent = message.substring(0, typingIndex.value + 1)
      typingIndex.value++
      scrollToBottom()
    } else {
      clearInterval(typingInterval.value)
      typingInterval.value = null
      isLoading.value = false
    }
  }, 30)
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (chatBox.value) {
      chatBox.value.scrollTop = chatBox.value.scrollHeight
    }
  })
}

// 关闭聊天
const closeChat = () => {
  // 直接修改可见性属性
  // 如果使用v-model:visible可以这样写
  emit('update:visible', false)

  // 同时保留原有的close事件
  emit('close')
}
// 监听visible变化，当聊天框出现时滚动到底部
watch(() => props.visible, (newVal) => {
  if (newVal) {
    nextTick(() => {
      scrollToBottom()
    })
  }
})
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  right: 20px;
  bottom: 80px;
  width: 350px;
  height: 500px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  transform: scale(0.1);
  transform-origin: bottom right;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 9999;
  overflow: hidden;
}

.chatbot-visible {
  transform: scale(1);
  opacity: 1;
}

.chat-header {
  padding: 15px;
  background-color: #42b983;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0 5px;
}

.chat-box {
  flex-grow: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: #f9f9f9;
}

.input-box {
  display: flex;
  padding: 10px;
  background-color: white;
  border-top: 1px solid #eee;
}

.input-box input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
}

.input-box button {
  background: none;
  border: none;
  padding: 0 10px;
  cursor: pointer;
}

.input-box button img {
  width: 24px;
  height: 24px;
}

.chat-message {
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
}

.bot-msg {
  justify-content: flex-start;
}

.user-msg {
  justify-content: flex-end;
}

.avatar {
  margin-right: 10px;
}

.avatar img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.message-content {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  word-break: break-word;
}

.bot-msg .message-content {
  background-color: #42b983;
  color: white;
}

.user-msg .message-content {
  background-color: #e5f5ee;
  color: #333;
}

/* 动画效果 */
@keyframes scaleIn {
  from {
    transform: scale(0.1);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes scaleOut {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.1);
    opacity: 0;
  }
}

/* 为消息内容添加的样式 */
.message-content :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 5px 0;
}

.message-content :deep(pre) {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 10px;
  border-radius: 5px;
  overflow-x: auto;
  margin: 5px 0;
}

.message-content :deep(code) {
  font-family: monospace;
}
</style>