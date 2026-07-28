---
title: AI 图片生成项目：Stable Diffusion API 接入实战
date: 2026-07-19 20:00:00
categories:
  - AI专栏
tags:
  - 项目实战
  - AI
top_img: /img/bj.jpg
cover: /img/1.jpg
---

## 前言

AI 绘图是这两年最火的 AI 应用方向之一。从 Midjourney 到 Stable Diffusion，从 DALL-E 到文心一格，各种 AI 绘图工具层出不穷。

作为前端开发者，你可能也想过：「能不能把 AI 绘图能力集成到自己的项目里？」答案当然是可以的。

这篇文章，我会带你从零开发一个 **AI 图片生成工具**——输入文字描述，AI 自动生成图片。我们会用 Stable Diffusion 的 API 来实现，同时也会介绍其他主流的 AI 绘图 API。

不管是做一个独立的 AI 绘图工具，还是把 AI 绘图能力集成到现有项目中，这篇文章都能帮到你。

## 一、AI 绘图 API 选型

### 1.1 主流 AI 绘图 API 对比

| 平台 | 模型 | 优势 | 劣势 | 价格 |
|------|------|------|------|------|
| 通义万相 | 通义万相 | 国内访问快、中文理解好、价格便宜 | 风格相对较少 | 约 ¥0.04-0.1/张 |
| 文心一格 | 文心一格 | 百度出品、中文支持好 | 价格稍高 | 约 ¥0.1-0.5/张 |
| 豆包 AI 绘图 | 豆包 | 字节出品、效果不错 | 功能相对简单 | 约 ¥0.05-0.2/张 |
| Replicate | Stable Diffusion 系列 | 模型多、可定制性强 | 国外服务、速度慢 | 约 $0.02-0.1/张 |
| OpenAI DALL-E | DALL-E 3 | 效果好、理解能力强 | 价格贵、不能调参数 | 约 $0.04-0.12/张 |
| Stability AI | Stable Diffusion | 官方 API、模型多 | 国内访问慢 | 价格不等 |

### 1.2 推荐方案

对于国内开发者，我推荐优先考虑：

1. **通义万相**：阿里云出品，API 文档完善，中文理解好，价格便宜，适合快速上手
2. **文心一格**：百度出品，效果不错，适合对质量要求较高的场景
3. **Replicate**：如果你想玩 Stable Diffusion 的各种模型，Replicate 是最方便的选择

这篇文章我们以**通义万相**为例来讲解，因为它对国内开发者最友好。其他平台的接入方式也类似。

## 二、项目设计

### 2.1 核心功能

| 功能模块 | 说明 |
|---------|------|
| 文字生图 | 输入提示词，生成图片 |
| 参数调节 | 尺寸、风格、数量、步数等参数 |
| 风格预设 | 提供常用风格一键选择 |
| 图片展示 | 生成结果展示、放大、下载 |
| 历史记录 | 保存生成历史 |
| 图片墙 | 展示所有生成的图片 |

### 2.2 技术选型

- 前端：Vue 3 + Vite + Element Plus
- 图片懒加载：v-lazy（或原生）
- 图片下载：js-file-download
- 后端（可选）：Node.js + Express（做代理，避免密钥暴露）

## 三、前端实现

### 3.1 主页面布局

新建 `App.vue`：

```vue
<template>
  <div class="app">
    <!-- 头部 -->
    <header class="header">
      <div class="header-content">
        <h1>🎨 AI 图片生成器</h1>
        <p>用文字描述你想要的画面，AI 帮你画出来</p>
      </div>
    </header>

    <div class="main">
      <!-- 左侧：设置面板 -->
      <aside class="sidebar">
        <div class="panel">
          <h3>图片描述</h3>
          <el-input
            v-model="prompt"
            type="textarea"
            :rows="4"
            placeholder="描述你想要生成的图片，例如：一只可爱的猫咪，坐在窗边，阳光洒进来，油画风格"
            maxlength="500"
            show-word-limit
          />
          
          <div class="negative-prompt">
            <div class="label">负面描述（可选）</div>
            <el-input
              v-model="negativePrompt"
              type="textarea"
              :rows="2"
              placeholder="描述你不想要的内容，例如：模糊、低质量、变形"
            />
          </div>
        </div>

        <div class="panel">
          <h3>风格预设</h3>
          <div class="style-grid">
            <div
              v-for="style in stylePresets"
              :key="style.id"
              class="style-item"
              :class="{ active: selectedStyle === style.id }"
              @click="selectStyle(style)"
            >
              <div class="style-icon">{{ style.icon }}</div>
              <div class="style-name">{{ style.name }}</div>
            </div>
          </div>
        </div>

        <div class="panel">
          <h3>参数设置</h3>
          
          <div class="form-item">
            <label>图片尺寸</label>
            <el-select v-model="size">
              <el-option label="512 x 512（方形）" value="512*512" />
              <el-option label="768 x 768（高清方形）" value="768*768" />
              <el-option label="1024 x 1024（超清方形）" value="1024*1024" />
              <el-option label="768 x 512（横版）" value="768*512" />
              <el-option label="512 x 768（竖版）" value="512*768" />
              <el-option label="1024 x 768（横版高清）" value="1024*768" />
              <el-option label="768 x 1024（竖版高清）" value="768*1024" />
            </el-select>
          </div>

          <div class="form-item">
            <label>生成数量：{{ count }} 张</label>
            <el-slider v-model="count" :min="1" :max="4" :step="1" show-stops />
          </div>

          <div class="form-item">
            <label>生成步数：{{ steps }} 步</label>
            <el-slider v-model="steps" :min="20" :max="50" :step="5" show-stops />
          </div>

          <div class="form-item">
            <label>相似度（CFG Scale）：{{ cfgScale }}</label>
            <el-slider v-model="cfgScale" :min="1" :max="10" :step="0.5" />
          </div>

          <div class="form-item">
            <label>随机种子</label>
            <div class="seed-input">
              <el-input v-model="seed" placeholder="-1 表示随机" />
              <el-button @click="seed = '-1'">随机</el-button>
            </div>
          </div>
        </div>

        <el-button
          type="primary"
          size="large"
          class="generate-btn"
          :loading="generating"
          :disabled="!prompt.trim()"
          @click="handleGenerate"
        >
          {{ generating ? '生成中...' : '🚀 开始生成' }}
        </el-button>
      </aside>

      <!-- 右侧：结果展示 -->
      <main class="content">
        <!-- 生成中的加载状态 -->
        <div v-if="generating" class="generating-state">
          <div class="loading-animation">
            <div class="loading-spinner"></div>
          </div>
          <h3>AI 正在创作中...</h3>
          <p>请稍候，大约需要 10-30 秒</p>
          <div class="progress-tip">
            <el-progress :percentage="progress" :show-text="false" />
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="generatedImages.length === 0" class="empty-state">
          <div class="empty-icon">🖼️</div>
          <h3>还没有生成图片</h3>
          <p>在左侧输入描述，点击「开始生成」试试吧</p>
          <div class="quick-prompts">
            <div class="quick-title">快速试试：</div>
            <div class="quick-list">
              <el-tag
                v-for="(p, i) in quickPrompts"
                :key="i"
                class="quick-tag"
                @click="useQuickPrompt(p)"
              >
                {{ p }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 生成结果 -->
        <div v-else class="result-section">
          <div class="result-header">
            <h3>生成结果</h3>
            <div class="result-actions">
              <el-button size="small" @click="handleDownloadAll">全部下载</el-button>
              <el-button size="small" @click="handleClear">清空</el-button>
            </div>
          </div>

          <div class="image-grid">
            <div
              v-for="(img, index) in generatedImages"
              :key="index"
              class="image-card"
            >
              <div class="image-wrapper">
                <img :src="img.url" :alt="img.prompt" />
                <div class="image-overlay">
                  <div class="overlay-actions">
                    <el-button size="small" @click="handlePreview(img)">放大</el-button>
                    <el-button size="small" @click="handleDownload(img)">下载</el-button>
                  </div>
                </div>
              </div>
              <div class="image-info">
                <div class="image-meta">
                  <span>{{ img.size }}</span>
                  <span>{{ formatTime(img.time) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 历史记录 -->
        <div v-if="history.length > 0" class="history-section">
          <div class="history-header">
            <h3>历史记录</h3>
            <el-button link @click="showHistory = !showHistory">
              {{ showHistory ? '收起' : '展开' }}
            </el-button>
          </div>
          <div v-show="showHistory" class="history-grid">
            <div
              v-for="(item, index) in history.slice(0, 20)"
              :key="index"
              class="history-item"
              @click="handlePreview(item)"
            >
              <img :src="item.url" :alt="item.prompt" />
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 图片预览弹窗 -->
    <el-dialog v-model="showPreview" width="80%" top="5vh">
      <div class="preview-content">
        <img v-if="currentImage" :src="currentImage.url" :alt="currentImage.prompt" />
      </div>
      <template #footer>
        <div class="preview-footer">
          <div class="preview-prompt">{{ currentImage?.prompt }}</div>
          <div>
            <el-button @click="handleDownload(currentImage)">下载</el-button>
            <el-button type="primary" @click="showPreview = false">关闭</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { generateImage } from './utils/api'

const prompt = ref('')
const negativePrompt = ref('')
const selectedStyle = ref('none')
const size = ref('768*768')
const count = ref(1)
const steps = ref(30)
const cfgScale = ref(7)
const seed = ref('-1')
const generating = ref(false)
const progress = ref(0)
const generatedImages = ref([])
const history = ref([])
const showPreview = ref(false)
const currentImage = ref(null)
const showHistory = ref(false)

// 风格预设
const stylePresets = [
  { id: 'none', name: '无', icon: '🎨', prompt: '' },
  { id: 'realistic', name: '写实', icon: '📷', prompt: 'realistic, photorealistic, 8k, highly detailed' },
  { id: 'anime', name: '动漫', icon: '🌸', prompt: 'anime style, manga, vibrant colors, detailed' },
  { id: 'oil', name: '油画', icon: '🖌️', prompt: 'oil painting, artistic, brush strokes, masterpiece' },
  { id: 'watercolor', name: '水彩', icon: '💧', prompt: 'watercolor painting, soft, artistic, gentle' },
  { id: 'cyberpunk', name: '赛博朋克', icon: '🌆', prompt: 'cyberpunk style, neon lights, futuristic, sci-fi' },
  { id: 'pixel', name: '像素风', icon: '👾', prompt: 'pixel art, 16-bit, retro game style' },
  { id: '3d', name: '3D 渲染', icon: '🎮', prompt: '3d render, octane render, unreal engine, highly detailed' }
]

// 快速提示词
const quickPrompts = [
  '一只可爱的柴犬，坐在樱花树下',
  '未来科技感的城市夜景，赛博朋克风格',
  '梦幻的森林小屋，童话风格',
  '美味的寿司拼盘，美食摄影',
  '星空下的海边，浪漫唯美'
]

// 选择风格
function selectStyle(style) {
  selectedStyle.value = style.id
}

// 使用快速提示词
function useQuickPrompt(p) {
  prompt.value = p
}

// 生成图片
async function handleGenerate() {
  if (!prompt.value.trim()) {
    ElMessage.warning('请输入图片描述')
    return
  }

  generating.value = true
  progress.value = 0

  // 模拟进度
  const progressTimer = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 10
    }
  }, 1000)

  try {
    // 组合最终提示词
    let finalPrompt = prompt.value
    const style = stylePresets.find(s => s.id === selectedStyle.value)
    if (style && style.prompt) {
      finalPrompt = `${prompt.value}, ${style.prompt}`
    }

    const result = await generateImage({
      prompt: finalPrompt,
      negative_prompt: negativePrompt.value,
      size: size.value,
      n: count.value,
      steps: steps.value,
      cfg_scale: cfgScale.value,
      seed: seed.value === '-1' ? undefined : parseInt(seed.value)
    })

    progress.value = 100

    // 添加到结果列表
    const newImages = result.images.map((url, i) => ({
      url,
      prompt: prompt.value,
      size: size.value,
      style: style?.name || '无',
      time: Date.now()
    }))

    generatedImages.value = [...newImages, ...generatedImages.value]
    
    // 添加到历史记录
    history.value = [...newImages, ...history.value]
    saveHistory()

    ElMessage.success(`成功生成 ${result.images.length} 张图片`)
  } catch (err) {
    ElMessage.error('生成失败：' + err.message)
  } finally {
    clearInterval(progressTimer)
    setTimeout(() => {
      generating.value = false
      progress.value = 0
    }, 500)
  }
}

// 预览图片
function handlePreview(img) {
  currentImage.value = img
  showPreview.value = true
}

// 下载单张图片
function handleDownload(img) {
  const link = document.createElement('a')
  link.href = img.url
  link.download = `ai-image-${Date.now()}.png`
  link.click()
  ElMessage.success('开始下载')
}

// 下载全部
function handleDownloadAll() {
  generatedImages.value.forEach((img, i) => {
    setTimeout(() => {
      handleDownload(img)
    }, i * 500)
  })
}

// 清空结果
function handleClear() {
  generatedImages.value = []
}

// 格式化时间
function formatTime(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

// 保存历史记录到 localStorage
function saveHistory() {
  try {
    localStorage.setItem('ai_image_history', JSON.stringify(history.value))
  } catch (e) {
    console.error('保存历史失败', e)
  }
}

// 加载历史记录
function loadHistory() {
  try {
    const saved = localStorage.getItem('ai_image_history')
    if (saved) {
      history.value = JSON.parse(saved)
    }
  } catch (e) {
    console.error('加载历史失败', e)
  }
}

onMounted(() => {
  loadHistory()
})
</script>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #fff;
  padding: 30px 20px;
  text-align: center;

  h1 {
    margin: 0 0 8px;
    font-size: 28px;
  }

  p {
    margin: 0;
    opacity: 0.9;
  }
}

.main {
  display: flex;
  gap: 20px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.sidebar {
  width: 340px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  h3 {
    margin: 0 0 12px;
    font-size: 15px;
  }
}

.negative-prompt {
  margin-top: 12px;

  .label {
    font-size: 13px;
    color: #606266;
    margin-bottom: 6px;
  }
}

.style-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.style-item {
  padding: 10px 4px;
  text-align: center;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #f5576c;
  }

  &.active {
    border-color: #f5576c;
    background: #fef0f0;
  }

  .style-icon {
    font-size: 24px;
    margin-bottom: 4px;
  }

  .style-name {
    font-size: 12px;
    color: #606266;
  }
}

.form-item {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 13px;
    color: #606266;
  }
}

.seed-input {
  display: flex;
  gap: 8px;
}

.generate-btn {
  font-size: 16px;
  height: 48px;
}

.content {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  min-height: 600px;
}

.generating-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #909399;
}

.loading-animation {
  margin-bottom: 20px;

  .loading-spinner {
    width: 60px;
    height: 60px;
    border: 4px solid #f0f0f0;
    border-top-color: #f5576c;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.progress-tip {
  width: 300px;
  margin-top: 16px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.quick-prompts {
  margin-top: 24px;
  text-align: center;

  .quick-title {
    margin-bottom: 12px;
  }

  .quick-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
  }

  .quick-tag {
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    margin: 0;
  }
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.image-card {
  border-radius: 8px;
  overflow: hidden;
  background: #f5f7fa;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    .image-overlay {
      opacity: 1;
    }
  }
}

.image-wrapper {
  position: relative;
  aspect-ratio: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;

    .overlay-actions {
      display: flex;
      gap: 8px;
    }
  }
}

.image-info {
  padding: 8px 12px;
  background: #fff;

  .image-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #909399;
  }
}

.history-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #ebeef5;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  h3 {
    margin: 0;
    font-size: 15px;
  }
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;

  .history-item {
    aspect-ratio: 1;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.05);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.preview-content {
  text-align: center;

  img {
    max-width: 100%;
    max-height: 70vh;
    border-radius: 8px;
  }
}

.preview-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .preview-prompt {
    color: #606266;
    font-size: 13px;
    max-width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
```

### 3.2 API 封装

新建 `utils/api.js`：

```javascript
// 调用 AI 绘图接口
// 注意：实际项目中，为了安全，这个调用应该放在后端，不要把密钥暴露在前端
export async function generateImage(params) {
  const {
    prompt,
    negative_prompt = '',
    size = '768*768',
    n = 1,
    steps = 30,
    cfg_scale = 7,
    seed
  } = params

  try {
    // 这里是通义万相的 API 调用示例
    // 实际项目中建议通过后端代理调用，避免密钥泄露
    const response = await fetch('你的后端代理地址/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        negative_prompt,
        size,
        n,
        steps,
        cfg_scale,
        seed
      })
    })

    const data = await response.json()
    
    if (data.code !== 200) {
      throw new Error(data.message || '生成失败')
    }

    return {
      images: data.data.images
    }
  } catch (err) {
    console.error('图片生成失败', err)
    throw err
  }
}

// 模拟生成图片（演示用）
export function mockGenerateImage() {
  // 这里用占位图片代替实际生成
  const mockImages = [
    'https://picsum.photos/seed/ai1/768/768',
    'https://picsum.photos/seed/ai2/768/768',
    'https://picsum.photos/seed/ai3/768/768',
    'https://picsum.photos/seed/ai4/768/768'
  ]
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        images: mockImages.slice(0, 1)
      })
    }, 3000)
  })
}
```

### 3.3 后端代理（Node.js）

**重要**：不要把 API 密钥直接写在前端代码里，会泄露！一定要通过后端代理。

新建一个简单的 Node.js 后端：

```javascript
const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')

const app = express()
app.use(cors())
app.use(express.json())

// 通义万相 API 配置
const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY

// 图片生成接口
app.post('/api/generate-image', async (req, res) => {
  try {
    const {
      prompt,
      negative_prompt,
      size,
      n,
      steps,
      cfg_scale,
      seed
    } = req.body

    // 调用通义万相 API
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
        'X-DashScope-Async': 'enable'
      },
      body: JSON.stringify({
        model: 'wanx-v1',
        input: {
          prompt,
          negative_prompt
        },
        parameters: {
          size,
          n,
          steps,
          scale: cfg_scale,
          seed
        }
      })
    })

    const data = await response.json()

    if (data.code) {
      return res.json({ code: -1, message: data.message })
    }

    // 异步任务，需要轮询结果
    const taskId = data.output.task_id
    
    // 轮询任务状态（简化版）
    const result = await pollTaskResult(taskId)
    
    res.json({
      code: 200,
      data: result
    })
  } catch (err) {
    console.error(err)
    res.json({ code: -1, message: err.message })
  }
})

// 轮询任务结果
async function pollTaskResult(taskId) {
  const maxAttempts = 60 // 最多等 60 秒
  let attempts = 0

  while (attempts < maxAttempts) {
    await new Promise(r => setTimeout(r, 1000))
    attempts++

    const response = await fetch(`https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`
      }
    })

    const data = await response.json()

    if (data.output.task_status === 'SUCCEEDED') {
      return {
        images: data.output.results.map(r => r.url)
      }
    }

    if (data.output.task_status === 'FAILED') {
      throw new Error(data.output.message || '生成失败')
    }
  }

  throw new Error('生成超时')
}

const PORT = 3000
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
})
```

## 四、进阶功能

### 4.1 图生图（Image-to-Image）

除了文字生图，还可以做图生图——上传一张参考图，让 AI 在此基础上修改。

```javascript
// 图生图接口
async function imageToImage(imageFile, prompt) {
  const formData = new FormData()
  formData.append('image', imageFile)
  formData.append('prompt', prompt)
  formData.append('denoising_strength', '0.75') // 相似度 0-1，越大变化越大
  
  const response = await fetch('/api/image-to-image', {
    method: 'POST',
    body: formData
  })
  
  return response.json()
}
```

### 4.2 高清修复（Upscale）

生成的图片分辨率不够？可以用 AI 放大。

- 可以用 Stable Diffusion 的 Hires.fix
- 也可以用专门的超分辨率模型（如 Real-ESRGAN）

### 4.3 提示词优化

很多用户不会写提示词，可以加一个「提示词优化」功能：
- 用户输入简单描述
- 调用大模型（如 GPT-4）优化成专业的 AI 绘画提示词

```javascript
// 优化提示词
async function optimizePrompt(userPrompt) {
  const response = await fetch('/api/optimize-prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: userPrompt })
  })
  return response.json()
}
```

### 4.4 模型切换

支持多种模型切换：
- 写实模型
- 动漫模型
- 国风模型
- 3D 模型

不同模型擅长的风格不一样，给用户更多选择。

## 五、项目亮点

这个项目有哪些亮点可以写进简历？

1. **完整的 AI 绘图工具**：前后端全栈实现，支持文字生图、参数调节、风格预设
2. **良好的用户体验**：实时进度、历史记录、图片预览、批量下载
3. **API 接入实践**：对接通义万相 / Stable Diffusion API，有实际的集成经验
4. **前端交互设计**：响应式布局、动画效果、状态管理
5. **安全性考虑**：后端代理 API 密钥，避免前端泄露

## 六、注意事项

### 6.1 合规性

AI 生成图片有一些合规风险需要注意：
- 不要生成违法违规内容
- 注意版权问题，有些模型的生成结果可能有版权争议
- 涉及人脸的要特别小心，避免侵权

### 6.2 成本控制

AI 绘图是按张收费的，如果用户很多，成本会涨得很快：
- 加频率限制，防止滥用
- 做用户系统，每个用户有限额
- 缓存常用 prompt 的结果

### 6.3 内容审核

一定要加内容审核：
- 输入的 prompt 要过审，防止生成违规内容
- 生成的图片最好也过一遍审核
- 可以用厂商提供的内容审核 API

## 结语

AI 绘图是一个非常有趣、也很有商业价值的方向。作为前端开发者，把 AI 绘图能力集成到自己的项目里，不仅能提升项目的含金量，也能让你对 AI 应用有更深的理解。

这篇文章给出的是一个基础版本，你可以在此基础上扩展很多功能：
- 支持更多模型和风格
- 加入图生图、高清修复、局部重绘等高级功能
- 做用户系统、积分系统
- 做图片社区，用户可以分享自己的作品

最重要的是，动手去做。在实践中学习，成长最快。
