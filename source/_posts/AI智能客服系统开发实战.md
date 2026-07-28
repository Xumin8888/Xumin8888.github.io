---
title: AI 智能客服系统开发实战
date: 2026-07-16 11:00:00
categories:
  - AI专栏
tags:
  - 项目实战
  - AI
  - RAG
top_img: /img/bj.jpg
cover: /img/4.jpg
---

## 前言

智能客服是 AI 落地最成熟的场景之一。从电商网站的在线客服，到企业官网的咨询窗口，再到 App 里的帮助中心，智能客服几乎无处不在。

你可能会想：「做智能客服不是后端的事吗？跟前端有什么关系？」

其实不然。一个完整的智能客服系统，前端扮演着非常重要的角色：
- 用户直接交互的聊天界面是前端做的
- 流式输出、打字机效果这些体验优化是前端做的
- 富文本消息、卡片消息、快捷选项这些也是前端做的
- 甚至前端也可以直接做「轻量级智能客服」，不需要后端

这篇文章，我会带你从零开发一个完整的 AI 智能客服系统。**前后端都有，前端为主，后端为辅**，最终你会得到一个可以直接部署、写进简历的完整项目。

## 一、项目需求与设计

### 1.1 核心功能

我们要做的智能客服，包含以下核心功能：

| 模块 | 功能说明 |
|------|---------|
| 对话能力 | 支持多轮对话、上下文记忆 |
| 知识库问答 | 基于企业知识库回答问题（RAG） |
| 流式输出 | 打字机效果，提升体验 |
| 常见问题 | 预设常见问题，一键提问 |
| 人工转接 | 复杂问题可转人工客服 |
| 满意度评价 | 对话结束后可评价服务 |
| 历史记录 | 保存用户对话历史 |

### 1.2 技术选型

**前端**：
- 框架：Vue 3 + Vite
- UI 库：Element Plus
- 样式：SCSS
- 状态管理：Pinia

**后端**（可选，前端也可以直接调 API）：
- Node.js + Express
- 向量库：FAISS
- 大模型：通义千问 / 豆包

### 1.3 项目结构

```
ai-customer-service/
├── frontend/                 # 前端项目
│   ├── src/
│   │   ├── components/       # 组件
│   │   │   ├── ChatWindow.vue    # 聊天窗口
│   │   │   ├── MessageList.vue   # 消息列表
│   │   │   ├── MessageInput.vue  # 输入框
│   │   │   └── QuickReply.vue    # 快捷回复
│   │   ├── stores/           # 状态管理
│   │   │   └── chat.js
│   │   ├── utils/            # 工具函数
│   │   │   └── api.js
│   │   └── App.vue
│   └── package.json
└── backend/                  # 后端项目（可选）
    ├── routes/
    ├── utils/
    └── server.js
```

## 二、前端核心实现

### 2.1 聊天窗口组件

先从最核心的聊天窗口开始。新建 `ChatWindow.vue`：

```vue
<template>
  <div class="chat-container">
    <!-- 头部 -->
    <div class="chat-header">
      <div class="header-left">
        <div class="avatar">🤖</div>
        <div class="info">
          <div class="title">智能客服小助手</div>
          <div class="status online">在线</div>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="primary" link @click="showFAQ = !showFAQ">
          常见问题
        </el-button>
      </div>
    </div>

    <!-- 常见问题面板 -->
    <div v-if="showFAQ" class="faq-panel">
      <div class="faq-title">常见问题</div>
      <div class="faq-list">
        <div
          v-for="(item, index) in faqList"
          :key="index"
          class="faq-item"
          @click="sendFAQ(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="message-list" ref="messageListRef">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message-item', msg.role]"
      >
        <div class="avatar">{{ msg.role === 'user' ? '👤' : '🤖' }}</div>
        <div class="message-content">
          <div v-if="msg.role === 'assistant' && msg.typing" class="typing">
            <span></span><span></span><span></span>
          </div>
          <div v-else class="message-text" v-html="formatMessage(msg.content)"></div>
        </div>
      </div>
    </div>

    <!-- 快捷操作栏 -->
    <div class="quick-actions">
      <el-button size="small" @click="handleTransferHuman">
        转人工客服
      </el-button>
      <el-button size="small" @click="handleClearChat">
        清空对话
      </el-button>
    </div>

    <!-- 输入框 -->
    <div class="input-area">
      <el-input
        v-model="inputText"
        type="textarea"
        :rows="2"
        placeholder="请输入您的问题，按 Enter 发送..."
        @keydown.enter.exact="handleSend"
        resize="none"
      />
      <div class="input-actions">
        <el-button type="primary" :loading="sending" @click="handleSend">
          发送
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { sendMessageToAI } from '../utils/api'

const messages = ref([])
const inputText = ref('')
const sending = ref(false)
const showFAQ = ref(false)
const messageListRef = ref(null)

const faqList = [
  '如何注册账号？',
  '忘记密码怎么办？',
  '如何联系人工客服？',
  '支持哪些支付方式？',
  '订单如何申请退款？'
]

// 发送消息
async function handleSend() {
  const text = inputText.value.trim()
  if (!text || sending.value) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: text
  })
  inputText.value = ''
  await scrollToBottom()

  // 添加 AI 占位消息（打字中状态）
  const aiMessage = {
    role: 'assistant',
    content: '',
    typing: true
  }
  messages.value.push(aiMessage)
  sending.value = true

  try {
    // 调用 AI 接口（流式输出）
    await sendMessageToAI(text, (chunk) => {
      aiMessage.content += chunk
      scrollToBottom()
    })
  } catch (err) {
    ElMessage.error('消息发送失败，请稍后重试')
    aiMessage.content = '抱歉，服务暂时不可用，请稍后再试。'
  } finally {
    aiMessage.typing = false
    sending.value = false
    scrollToBottom()
  }
}

// 发送常见问题
function sendFAQ(question) {
  inputText.value = question
  handleSend()
  showFAQ.value = false
}

// 转人工客服
function handleTransferHuman() {
  ElMessageBox.confirm(
    '确定要转接人工客服吗？工作时间：9:00-18:00',
    '提示',
    {
      confirmButtonText: '确定转接',
      cancelButtonText: '再想想',
      type: 'info'
    }
  ).then(() => {
    messages.value.push({
      role: 'assistant',
      content: '好的，正在为您转接人工客服，请稍候...'
    })
    scrollToBottom()
  })
}

// 清空对话
function handleClearChat() {
  ElMessageBox.confirm('确定要清空对话记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    messages.value = []
    ElMessage.success('对话已清空')
  })
}

// 格式化消息（简单的 Markdown 转 HTML）
function formatMessage(text) {
  if (!text) return ''
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
}

// 滚动到底部
async function scrollToBottom() {
  await nextTick()
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

// 初始化欢迎语
onMounted(() => {
  messages.value.push({
    role: 'assistant',
    content: '您好！我是智能客服小助手，很高兴为您服务。请问有什么可以帮您的？'
  })
})
</script>

<style lang="scss" scoped>
.chat-container {
  width: 400px;
  height: 600px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chat-header {
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }

  .title {
    font-weight: 600;
    font-size: 15px;
  }

  .status {
    font-size: 12px;
    opacity: 0.8;
    
    &.online::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #67c23a;
      margin-right: 4px;
    }
  }
}

.faq-panel {
  padding: 12px 16px;
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;

  .faq-title {
    font-weight: 600;
    margin-bottom: 8px;
    color: #303133;
  }

  .faq-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .faq-item {
    padding: 6px 12px;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 16px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: #409eff;
      color: #409eff;
    }
  }
}

.message-list {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f5f7fa;
}

.message-item {
  display: flex;
  margin-bottom: 16px;
  gap: 8px;

  &.user {
    flex-direction: row-reverse;

    .message-content {
      background: #409eff;
      color: #fff;
      border-radius: 12px 12px 2px 12px;
    }
  }

  &.assistant {
    .message-content {
      background: #fff;
      border: 1px solid #e4e7ed;
      border-radius: 12px 12px 12px 2px;
    }
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .message-content {
    max-width: 75%;
    padding: 10px 12px;
    font-size: 14px;
    line-height: 1.6;
    word-wrap: break-word;
  }

  .message-text {
    code {
      background: rgba(0, 0, 0, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
  }

  .typing {
    display: flex;
    gap: 4px;

    span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #909399;
      animation: typing 1.4s infinite;

      &:nth-child(2) {
        animation-delay: 0.2s;
      }
      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

.quick-actions {
  padding: 8px 16px;
  border-top: 1px solid #e4e7ed;
  display: flex;
  gap: 8px;
  background: #fff;
}

.input-area {
  padding: 12px 16px;
  border-top: 1px solid #e4e7ed;
  background: #fff;

  .input-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }
}
</style>
```

### 2.2 流式输出实现

流式输出（打字机效果）是智能客服的标配，能大幅提升用户体验。

新建 `utils/api.js`：

```javascript
// 调用 AI 接口（支持流式输出）
export async function sendMessageToAI(message, onChunk) {
  // 这里用 SSE（Server-Sent Events）实现流式输出
  // 如果后端还没做好，可以先模拟流式效果

  return new Promise((resolve, reject) => {
    // 模拟后端响应
    const mockReply = `您好，关于您的问题，我来为您解答：

**答案要点：**
1. 首先，您可以在登录页面点击「忘记密码」
2. 输入您注册时使用的手机号或邮箱
3. 按照提示接收验证码并设置新密码

如果操作过程中遇到问题，可以随时联系人工客服。

还有什么可以帮您的吗？`

    let index = 0
    const timer = setInterval(() => {
      if (index < mockReply.length) {
        const chunk = mockReply.slice(index, index + 3)
        onChunk && onChunk(chunk)
        index += 3
      } else {
        clearInterval(timer)
        resolve()
      }
    }, 30)
  })
}
```

> 实际项目中，流式输出一般用 SSE 或 WebSocket 实现。大模型 API 基本都支持 stream 模式，后端把流转给前端就行。

### 2.3 对话历史持久化

用 localStorage 保存对话历史，刷新页面不丢失。

在 `chat.js` store 中添加：

```javascript
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useChatStore = defineStore('chat', () => {
  const messages = ref([])
  const STORAGE_KEY = 'ai_chat_history'

  // 从 localStorage 加载历史
  function loadHistory() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        messages.value = JSON.parse(saved)
      }
    } catch (e) {
      console.error('加载对话历史失败', e)
    }
  }

  // 保存历史到 localStorage
  function saveHistory() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value))
    } catch (e) {
      console.error('保存对话历史失败', e)
    }
  }

  // 清空历史
  function clearHistory() {
    messages.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  // 监听消息变化，自动保存
  watch(
    messages,
    () => {
      saveHistory()
    },
    { deep: true }
  )

  return {
    messages,
    loadHistory,
    clearHistory
  }
})
```

## 三、后端 RAG 知识库实现（可选）

如果要做「基于知识库的问答」，需要后端配合。这里给一个简化版的 Node.js 实现。

### 3.1 后端接口

新建 `backend/server.js`：

```javascript
const express = require('express')
const cors = require('cors')
const { ChatOpenAI, OpenAIEmbeddings } = require('@langchain/openai')
const { FAISS } = require('@langchain/community/vectorstores/faiss')
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter')
const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf')

const app = express()
app.use(cors())
app.use(express.json())

// 初始化模型
const model = new ChatOpenAI({
  modelName: 'qwen-plus',
  openAIApiKey: process.env.OPENAI_API_KEY,
  configuration: { baseURL: process.env.OPENAI_BASE_URL },
  streaming: true
})

const embeddings = new OpenAIEmbeddings({
  modelName: 'text-embedding-v1',
  openAIApiKey: process.env.OPENAI_API_KEY,
  configuration: { baseURL: process.env.OPENAI_BASE_URL }
})

let vectorStore = null

// 加载知识库（启动时执行）
async function loadKnowledgeBase() {
  try {
    vectorStore = await FAISS.load('./faiss_index', embeddings)
    console.log('知识库加载成功')
  } catch (e) {
    console.log('知识库不存在，请先构建')
  }
}
loadKnowledge()

// 流式对话接口
app.post('/api/chat/stream', async (req, res) => {
  const { message, history = [] } = req.body

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    let context = ''

    // 如果有知识库，先检索相关文档
    if (vectorStore) {
      const docs = await vectorStore.similaritySearch(message, 3)
      context = docs.map((d, i) => `[资料${i + 1}] ${d.pageContent}`).join('\n\n')
    }

    // 构建提示词
    const systemPrompt = `你是一个专业的客服助手。请根据以下参考资料回答用户问题。
如果参考资料中没有答案，请用通用知识礼貌回答。
回答要简洁、友好、专业。

参考资料：
${context || '（无）'}
`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10), // 只保留最近 10 轮，节省 token
      { role: 'user', content: message }
    ]

    // 流式调用
    const stream = await model.stream(messages)
    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ content: chunk.content })}\n\n`)
    }

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (err) {
    console.error(err)
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    res.end()
  }
})

// 上传文档构建知识库接口（管理后台用）
app.post('/api/admin/upload-doc', async (req, res) => {
  // 这里实现文档上传和向量库构建
  // 省略具体实现...
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
})
```

### 3.2 前端对接 SSE

前端改成对接真实的 SSE 流式接口：

```javascript
// 修改 utils/api.js
export async function sendMessageToAI(message, history = [], onChunk) {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSourcePolyfill('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        history
      })
    })

    eventSource.onmessage = (e) => {
      if (e.data === '[DONE]') {
        eventSource.close()
        resolve()
        return
      }

      try {
        const data = JSON.parse(e.data)
        if (data.error) {
          reject(new Error(data.error))
        } else if (data.content) {
          onChunk && onChunk(data.content)
        }
      } catch (err) {
        console.error('解析 SSE 消息失败', err)
      }
    }

    eventSource.onerror = (err) => {
      eventSource.close()
      reject(err)
    }
  })
}
```

> 注意：原生 EventSource 不支持 POST 请求，需要用 `eventsource-polyfill` 或自己用 fetch + ReadableStream 实现。

## 四、进阶功能

### 4.1 满意度评价

对话结束后，可以让用户评价服务质量。

```vue
<template>
  <!-- 满意度评价弹窗 -->
  <el-dialog v-model="showRating" title="服务评价" width="360px">
    <div class="rating-content">
      <p>请问您对本次服务满意吗？</p>
      <div class="rating-stars">
        <span
          v-for="i in 5"
          :key="i"
          class="star"
          :class="{ active: i <= rating }"
          @click="rating = i"
        >
          ⭐
        </span>
      </div>
      <el-input
        v-model="ratingComment"
        type="textarea"
        :rows="3"
        placeholder="请留下您的宝贵意见（选填）"
      />
    </div>
    <template #footer>
      <el-button @click="showRating = false">取消</el-button>
      <el-button type="primary" @click="submitRating">提交评价</el-button>
    </template>
  </el-dialog>
</template>
```

### 4.2 消息类型扩展

除了纯文本，还可以支持更多消息类型：
- 图片消息
- 卡片消息（商品卡片、订单卡片）
- 快捷选项按钮
- 富文本消息

设计一个统一的消息格式：

```javascript
const message = {
  type: 'text', // text / image / card / quick_replies
  content: '...',
  data: {
    // 额外数据，比如图片 URL、卡片信息等
  }
}
```

## 五、项目亮点与优化建议

### 5.1 可以写进简历的亮点

1. **完整的智能客服系统**：前后端全栈实现，包含聊天界面、流式输出、知识库问答
2. **RAG 知识库检索**：基于 FAISS 向量数据库实现文档检索增强生成
3. **良好的用户体验**：打字机效果、常见问题快捷提问、对话历史持久化
4. **模块化设计**：组件化开发，易于扩展和维护
5. **工程化规范**：Vue 3 + Vite + Pinia，遵循最佳实践

### 5.2 后续优化方向

1. **接入真实大模型**：对接通义千问、豆包、智谱等主流大模型
2. **多轮对话优化**：更好的上下文管理，支持对话打断
3. **知识库管理后台**：可视化上传、管理文档
4. **数据分析**：统计常见问题、满意度、转化率
5. **多渠道接入**：网页、微信公众号、小程序等
6. **人工客服工作台**：坐席端界面，实时接待用户

## 结语

智能客服是 AI 应用中最接地气、最容易看到效果的场景之一。通过这个项目，你可以：
- 掌握 AI 应用开发的完整流程
- 学会 RAG 知识库问答的实现方式
- 提升前端交互和用户体验设计能力
- 得到一个可以直接写进简历的实战项目

当然，这只是一个入门级的实现。真正的企业级智能客服系统要复杂得多，但核心原理是相通的。先把这个基础版做出来，再慢慢迭代优化，你会在这个过程中学到很多。

赶紧动手试试吧！
