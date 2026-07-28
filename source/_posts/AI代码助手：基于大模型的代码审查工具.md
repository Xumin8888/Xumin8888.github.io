---
title: AI 代码助手：基于大模型的代码审查工具
date: 2026-07-18 15:30:00
categories:
  - AI专栏
tags:
  - 项目实战
  - AI
top_img: /img/bj.jpg
cover: /img/cat.jpg---

## 前言

代码审查（Code Review）是软件开发中非常重要的一环。好的代码审查可以：
- 发现潜在的 bug 和安全漏洞
- 保证代码质量和风格统一
- 帮助团队成员互相学习
- 减少线上事故

但代码审查也很耗时间，尤其是项目忙的时候，大家都不想花时间 review 代码。而且人的精力有限，很难每次都把所有问题都找出来。

那能不能让 AI 来帮忙做代码审查呢？答案是肯定的。

这篇文章，我会带你从零开发一个 **AI 代码审查工具**——把代码丢进去，AI 自动帮你找出问题、给出优化建议。做完之后，不管是自己用还是写进简历，都非常棒。

## 一、项目设计

### 1.1 核心功能

我们的 AI 代码审查工具，包含以下功能：

| 功能模块 | 说明 |
|---------|------|
| 代码输入 | 支持粘贴代码、上传文件 |
| 代码审查 | AI 自动分析代码问题 |
| 审查维度 | 代码规范、潜在 bug、性能问题、安全漏洞、可维护性 |
| 结果展示 | 分类展示问题，支持严重程度标注 |
| 修复建议 | 每个问题都给出修改建议和示例代码 |
| 历史记录 | 保存审查历史，方便回顾 |
| 多语言支持 | 支持 JavaScript、TypeScript、Vue、React 等 |

### 1.2 技术选型

- 前端框架：Vue 3 + Vite
- UI 库：Element Plus
- 代码高亮：highlight.js / Prism.js
- Markdown 渲染：marked
- 大模型 API：通义千问 / 豆包（兼容 OpenAI 格式）

### 1.3 页面结构

```
┌─────────────────────────────────────────────┐
│  AI 代码审查工具                             │
├──────────────────────┬──────────────────────┤
│                      │                      │
│   代码输入区          │   审查结果区          │
│   - 语言选择          │   - 问题概览          │
│   - 代码编辑框        │   - 问题列表（分类）   │
│   - 上传文件按钮      │   - 详细建议          │
│   - 开始审查按钮      │   - 修复代码示例      │
│                      │                      │
└──────────────────────┴──────────────────────┘
```

## 二、核心实现

### 2.1 主页面布局

新建 `App.vue`：

```vue
<template>
  <div class="app">
    <!-- 顶部标题 -->
    <header class="header">
      <h1>🤖 AI 代码审查助手</h1>
      <p>让 AI 帮你找出代码中的问题，给出优化建议</p>
    </header>

    <!-- 主内容区 -->
    <div class="main">
      <!-- 左侧：代码输入 -->
      <div class="input-panel">
        <div class="panel-header">
          <span>代码输入</span>
          <div class="lang-select">
            <el-select v-model="selectedLang" placeholder="选择语言">
              <el-option label="JavaScript" value="javascript" />
              <el-option label="TypeScript" value="typescript" />
              <el-option label="Vue" value="vue" />
              <el-option label="React (JSX)" value="jsx" />
              <el-option label="React (TSX)" value="tsx" />
              <el-option label="CSS" value="css" />
              <el-option label="Python" value="python" />
            </el-select>
          </div>
        </div>

        <!-- 代码编辑区 -->
        <div class="code-editor">
          <textarea
            v-model="codeInput"
            :placeholder="`请粘贴${langMap[selectedLang] || ''}代码...`"
            spellcheck="false"
          ></textarea>
        </div>

        <!-- 操作按钮 -->
        <div class="actions">
          <el-upload
            :show-file-list="false"
            accept=".js,.ts,.vue,.jsx,.tsx,.css,.py"
            :before-upload="handleFileUpload"
          >
            <el-button>📁 上传文件</el-button>
          </el-upload>

          <el-button @click="handleClear">清空</el-button>

          <el-button
            type="primary"
            :loading="reviewing"
            :disabled="!codeInput.trim()"
            @click="handleReview"
          >
            {{ reviewing ? '审查中...' : '🚀 开始审查' }}
          </el-button>
        </div>
      </div>

      <!-- 右侧：审查结果 -->
      <div class="result-panel">
        <div class="panel-header">
          <span>审查结果</span>
          <div v-if="reviewResult" class="result-stats">
            <el-tag type="danger">🔴 {{ countByLevel('high') }}</el-tag>
            <el-tag type="warning">🟡 {{ countByLevel('medium') }}</el-tag>
            <el-tag type="success">🟢 {{ countByLevel('low') }}</el-tag>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="reviewing" class="loading-state">
          <div class="loading-spinner"></div>
          <p>AI 正在分析您的代码，请稍候...</p>
        </div>

        <!-- 空状态 -->
        <div v-else-if="!reviewResult" class="empty-state">
          <div class="empty-icon">📝</div>
          <p>在左侧输入代码，点击「开始审查」</p>
          <p class="hint">支持 JavaScript、TypeScript、Vue、React 等多种语言</p>
        </div>

        <!-- 审查结果 -->
        <div v-else class="review-result">
          <!-- 总体评价 -->
          <div class="overall-score">
            <div class="score-circle" :style="{ '--score': reviewResult.score }">
              <span class="score-text">{{ reviewResult.score }}</span>
              <span class="score-label">分</span>
            </div>
            <div class="score-desc">
              <h3>{{ reviewResult.summary }}</h3>
              <p>{{ reviewResult.detail }}</p>
            </div>
          </div>

          <!-- 问题分类筛选 -->
          <div class="filter-tabs">
            <el-button
              v-for="cat in categories"
              :key="cat.key"
              :type="activeCategory === cat.key ? 'primary' : 'default'"
              size="small"
              @click="activeCategory = cat.key"
            >
              {{ cat.label }} ({{ countByCategory(cat.key) }})
            </el-button>
          </div>

          <!-- 问题列表 -->
          <div class="issues-list">
            <div
              v-for="(issue, index) in filteredIssues"
              :key="index"
              class="issue-item"
              :class="issue.level"
            >
              <div class="issue-header" @click="toggleIssue(index)">
                <div class="issue-left">
                  <span class="issue-level">{{ levelMap[issue.level] }}</span>
                  <span class="issue-category">{{ categoryMap[issue.category] }}</span>
                  <span class="issue-title">{{ issue.title }}</span>
                </div>
                <span class="toggle-icon">{{ expandedIssues.includes(index) ? '▲' : '▼' }}</span>
              </div>

              <div v-show="expandedIssues.includes(index)" class="issue-body">
                <div class="issue-section">
                  <h4>问题描述</h4>
                  <p>{{ issue.description }}</p>
                </div>

                <div v-if="issue.code" class="issue-section">
                  <h4>相关代码</h4>
                  <pre><code :class="selectedLang">{{ issue.code }}</code></pre>
                </div>

                <div class="issue-section">
                  <h4>修改建议</h4>
                  <p>{{ issue.suggestion }}</p>
                </div>

                <div v-if="issue.fixedCode" class="issue-section">
                  <h4>修复后代码</h4>
                  <pre><code :class="selectedLang">{{ issue.fixedCode }}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { reviewCode } from './utils/ai'
import 'highlight.js/styles/github.css'
import hljs from 'highlight.js'

const codeInput = ref('')
const selectedLang = ref('javascript')
const reviewing = ref(false)
const reviewResult = ref(null)
const activeCategory = ref('all')
const expandedIssues = ref([])

const langMap = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  vue: 'Vue',
  jsx: 'React JSX',
  tsx: 'React TSX',
  css: 'CSS',
  python: 'Python'
}

const levelMap = {
  high: '🔴 严重',
  medium: '🟡 中等',
  low: '🟢 建议'
}

const categoryMap = {
  style: '代码规范',
  bug: '潜在 Bug',
  performance: '性能问题',
  security: '安全漏洞',
  maintainability: '可维护性',
  best_practice: '最佳实践'
}

const categories = [
  { key: 'all', label: '全部' },
  { key: 'bug', label: '潜在 Bug' },
  { key: 'security', label: '安全漏洞' },
  { key: 'performance', label: '性能问题' },
  { key: 'style', label: '代码规范' },
  { key: 'maintainability', label: '可维护性' },
  { key: 'best_practice', label: '最佳实践' }
]

// 筛选问题
const filteredIssues = computed(() => {
  if (!reviewResult.value) return []
  if (activeCategory.value === 'all') return reviewResult.value.issues
  return reviewResult.value.issues.filter(i => i.category === activeCategory.value)
})

// 按严重程度计数
function countByLevel(level) {
  if (!reviewResult.value) return 0
  return reviewResult.value.issues.filter(i => i.level === level).length
}

// 按分类计数
function countByCategory(category) {
  if (!reviewResult.value) return 0
  if (category === 'all') return reviewResult.value.issues.length
  return reviewResult.value.issues.filter(i => i.category === category).length
}

// 展开/收起问题详情
function toggleIssue(index) {
  const i = expandedIssues.value.indexOf(index)
  if (i > -1) {
    expandedIssues.value.splice(i, 1)
  } else {
    expandedIssues.value.push(index)
  }
}

// 上传文件
function handleFileUpload(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    codeInput.value = e.target.result
    // 根据文件后缀自动识别语言
    const ext = file.name.split('.').pop().toLowerCase()
    const extMap = {
      js: 'javascript',
      ts: 'typescript',
      vue: 'vue',
      jsx: 'jsx',
      tsx: 'tsx',
      css: 'css',
      py: 'python'
    }
    if (extMap[ext]) {
      selectedLang.value = extMap[ext]
    }
    ElMessage.success('文件加载成功')
  }
  reader.readAsText(file)
  return false // 阻止自动上传
}

// 清空
function handleClear() {
  codeInput.value = ''
  reviewResult.value = null
  expandedIssues.value = []
}

// 开始审查
async function handleReview() {
  if (!codeInput.value.trim()) {
    ElMessage.warning('请先输入代码')
    return
  }

  reviewing.value = true
  reviewResult.value = null
  expandedIssues.value = []

  try {
    const result = await reviewCode(codeInput.value, selectedLang.value)
    reviewResult.value = result
    // 默认展开第一个问题
    if (result.issues.length > 0) {
      expandedIssues.value = [0]
    }
    // 代码高亮
    setTimeout(() => {
      document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block)
      })
    }, 100)
  } catch (err) {
    ElMessage.error('审查失败：' + err.message)
  } finally {
    reviewing.value = false
  }
}
</script>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  text-align: center;
  padding: 30px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;

  h1 {
    margin: 0 0 8px;
    font-size: 28px;
  }

  p {
    margin: 0;
    opacity: 0.9;
    font-size: 14px;
  }
}

.main {
  display: flex;
  gap: 20px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.input-panel,
.result-panel {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.code-editor {
  flex: 1;
  padding: 12px;

  textarea {
    width: 100%;
    height: 100%;
    min-height: 400px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 12px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 13px;
    line-height: 1.6;
    resize: none;
    outline: none;

    &:focus {
      border-color: #409eff;
    }
  }
}

.actions {
  padding: 12px 16px;
  border-top: 1px solid #ebeef5;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.loading-state,
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #909399;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #ebeef5;
  border-top-color: #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.hint {
  font-size: 12px;
  color: #c0c4cc;
}

.review-result {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.overall-score {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 16px;

  .score-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: conic-gradient(#67c23a calc(var(--score) * 1%), #ebeef5 0);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #fff;
    }

    .score-text,
    .score-label {
      position: relative;
      z-index: 1;
    }

    .score-text {
      font-size: 24px;
      font-weight: bold;
      color: #67c23a;
      line-height: 1;
    }

    .score-label {
      font-size: 12px;
      color: #909399;
    }
  }

  .score-desc {
    flex: 1;

    h3 {
      margin: 0 0 6px;
      font-size: 16px;
    }

    p {
      margin: 0;
      font-size: 13px;
      color: #606266;
      line-height: 1.6;
    }
  }
}

.filter-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.issue-item {
  border: 1px solid #ebeef5;
  border-radius: 6px;
  overflow: hidden;

  &.high {
    border-left: 4px solid #f56c6c;
  }
  &.medium {
    border-left: 4px solid #e6a23c;
  }
  &.low {
    border-left: 4px solid #67c23a;
  }
}

.issue-header {
  padding: 10px 12px;
  background: #fafafa;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;

  &:hover {
    background: #f5f7fa;
  }

  .issue-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .issue-level {
    font-weight: 600;
    font-size: 12px;
  }

  .issue-category {
    font-size: 12px;
    color: #909399;
    background: #f0f2f5;
    padding: 2px 6px;
    border-radius: 4px;
  }
}

.issue-body {
  padding: 12px;
  border-top: 1px solid #ebeef5;

  .issue-section {
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    h4 {
      margin: 0 0 8px;
      font-size: 13px;
      color: #606266;
    }

    p {
      margin: 0;
      font-size: 13px;
      line-height: 1.7;
      color: #303133;
    }

    pre {
      margin: 0;
      padding: 12px;
      background: #282c34;
      border-radius: 4px;
      overflow-x: auto;

      code {
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 12px;
        line-height: 1.6;
      }
    }
  }
}

.result-stats {
  display: flex;
  gap: 6px;
}
</style>
```

### 2.2 AI 审查逻辑

新建 `utils/ai.js`：

```javascript
// 调用大模型进行代码审查
export async function reviewCode(code, language) {
  const prompt = `你是一个资深的代码审查专家，请审查以下${language}代码。

请从以下几个维度进行审查：
1. 潜在 Bug（逻辑错误、边界条件、空指针等）
2. 安全漏洞（XSS、SQL注入、敏感信息泄露等）
3. 性能问题（内存泄漏、不必要的重渲染、低效算法等）
4. 代码规范（命名不规范、格式不一致、魔法数字等）
5. 可维护性（代码复杂度、重复代码、注释缺失等）
6. 最佳实践（不符合最佳实践的写法）

要求：
1. 严格按照 JSON 格式返回，不要输出其他内容
2. 每个问题都要包含：level（high/medium/low）、category（bug/security/performance/style/maintainability/best_practice）、title、description、code（相关代码片段，可选）、suggestion、fixedCode（修复后的代码，可选）
3. 问题按严重程度从高到低排序
4. 给出一个总体评分（0-100分）和总体评价

返回格式示例：
{
  "score": 75,
  "summary": "代码整体质量良好，但存在一些需要改进的地方",
  "detail": "详细描述...",
  "issues": [
    {
      "level": "high",
      "category": "security",
      "title": "存在 XSS 安全漏洞",
      "description": "问题描述...",
      "code": "相关代码...",
      "suggestion": "修改建议...",
      "fixedCode": "修复后的代码..."
    }
  ]
}

待审查的代码：
\`\`\`${language}
${code}
\`\`\``

  try {
    const response = await fetch('你的API地址', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      })
    })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    
    // 提取 JSON（有时候模型会输出 Markdown 代码块）
    let jsonStr = content
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/)
    if (jsonMatch) {
      jsonStr = jsonMatch[1]
    }
    
    return JSON.parse(jsonStr)
  } catch (err) {
    console.error('代码审查失败', err)
    throw new Error('审查失败，请稍后重试')
  }
}
```

### 2.3 模拟数据（演示用）

在没有真实 API 的时候，可以先用模拟数据演示效果：

```javascript
// 模拟审查结果
export function mockReviewResult() {
  return {
    score: 72,
    summary: '代码功能基本正确，但存在一些安全隐患和可优化的地方',
    detail: '整体逻辑清晰，但在数据安全、错误处理和代码规范方面有改进空间。建议优先修复安全相关问题，再逐步优化代码质量。',
    issues: [
      {
        level: 'high',
        category: 'security',
        title: '存在 XSS 安全漏洞',
        description: '直接使用 innerHTML 插入用户输入的内容，没有进行转义处理，可能导致 XSS 攻击。',
        code: `function renderUserContent(content) {
  const el = document.getElementById('content')
  el.innerHTML = content
}`,
        suggestion: '使用 textContent 代替 innerHTML，或者对用户输入进行 HTML 转义。',
        fixedCode: `function renderUserContent(content) {
  const el = document.getElementById('content')
  el.textContent = content
}`
      },
      {
        level: 'high',
        category: 'bug',
        title: '异步函数没有错误处理',
        description: 'fetchData 函数没有 catch 错误，可能导致未处理的 Promise rejection。',
        code: `async function fetchData() {
  const res = await fetch('/api/data')
  const data = await res.json()
  return data
}`,
        suggestion: '添加 try-catch 错误处理，或者返回 Promise 让调用方处理。',
        fixedCode: `async function fetchData() {
  try {
    const res = await fetch('/api/data')
    if (!res.ok) {
      throw new Error('请求失败')
    }
    const data = await res.json()
    return data
  } catch (err) {
    console.error('获取数据失败:', err)
    throw err
  }
}`
      },
      {
        level: 'medium',
        category: 'performance',
        title: '频繁操作 DOM 可能影响性能',
        description: '在循环中频繁操作 DOM，会导致多次重排重绘，影响页面性能。',
        code: `for (let i = 0; i < 1000; i++) {
  const el = document.createElement('div')
  el.textContent = i
  document.body.appendChild(el)
}`,
        suggestion: '使用 DocumentFragment 或者先拼接 HTML 再一次性插入。',
        fixedCode: `const fragment = document.createDocumentFragment()
for (let i = 0; i < 1000; i++) {
  const el = document.createElement('div')
  el.textContent = i
  fragment.appendChild(el)
}
document.body.appendChild(fragment)`
      },
      {
        level: 'medium',
        category: 'maintainability',
        title: '魔法数字，语义不清晰',
        description: '代码中直接使用数字 1000、3600 等魔法数字，可读性差，不易维护。',
        code: `if (count > 1000) {
  return
}
setTimeout(() => {
  // ...
}, 3600)`,
        suggestion: '定义有语义的常量，提高代码可读性。',
        fixedCode: `const MAX_COUNT = 1000
const DELAY_TIME = 3600

if (count > MAX_COUNT) {
  return
}
setTimeout(() => {
  // ...
}, DELAY_TIME)`
      },
      {
        level: 'low',
        category: 'style',
        title: '变量命名不规范',
        description: '变量名 "data"、"temp" 过于宽泛，不能清晰表达其含义。',
        code: `let data = getUserInfo()
let temp = data.name`,
        suggestion: '使用更具体的变量名，提高代码可读性。',
        fixedCode: `const userInfo = getUserInfo()
const userName = userInfo.name`
      }
    ]
  }
}
```

## 三、功能增强

### 3.1 审查历史记录

用 localStorage 保存审查历史，方便回顾：

```javascript
// 保存审查历史
function saveHistory(code, language, result) {
  const history = getHistory()
  history.unshift({
    id: Date.now(),
    time: new Date().toLocaleString(),
    language,
    codePreview: code.slice(0, 100),
    score: result.score,
    issuesCount: result.issues.length
  })
  // 只保留最近 20 条
  if (history.length > 20) {
    history.pop()
  }
  localStorage.setItem('code_review_history', JSON.stringify(history))
}

// 获取历史记录
function getHistory() {
  try {
    return JSON.parse(localStorage.getItem('code_review_history') || '[]')
  } catch {
    return []
  }
}
```

### 3.2 代码对比功能

对于有修复建议的问题，可以做一个「修改前/修改后」的对比视图：

```vue
<template>
  <div class="code-diff">
    <div class="diff-side">
      <div class="diff-header">修改前</div>
      <pre class="diff-content before"><code>{{ beforeCode }}</code></pre>
    </div>
    <div class="diff-side">
      <div class="diff-header">修改后</div>
      <pre class="diff-content after"><code>{{ afterCode }}</code></pre>
    </div>
  </div>
</template>
```

### 3.3 一键复制修复代码

给修复后的代码加个「复制」按钮，方便用户直接使用：

```javascript
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('已复制到剪贴板')
  })
}
```

## 四、项目亮点

这个项目有哪些可以写进简历的亮点呢？

1. **AI 赋能的实用工具**：不是简单的 Demo，而是真正能用的开发工具
2. **多维度代码审查**：从 Bug、安全、性能、规范、可维护性等多个维度分析
3. **良好的交互体验**：代码高亮、分类筛选、展开收起、历史记录
4. **结构化输出**：让 AI 按 JSON 格式返回，前端结构化展示
5. **前端技术栈**：Vue 3 + Vite + Element Plus，符合当前主流技术栈
6. **可扩展空间大**：可以接入更多语言、添加更多审查规则、做 IDE 插件等

## 五、扩展思路

如果你想把这个项目做得更完善，可以考虑以下方向：

### 5.1 接入更多能力
- 支持 Git 仓库地址，自动拉取代码审查
- 支持 GitHub PR 审查（做成 GitHub App）
- 接入 ESLint、Prettier 等工具，结合 AI 一起审查
- 支持代码重构建议

### 5.2 优化审查质量
- 针对不同语言优化 Prompt 模板
- 建立审查规则库，逐步积累经验
- 支持自定义审查规则（比如团队规范）
- 支持多轮对话，让用户追问详情

### 5.3 产品化方向
- 做成 VS Code 插件，在编辑器里直接用
- 做成 Web 服务，支持团队协作
- 接入 CI/CD，提交代码自动审查
- 生成审查报告，支持导出 PDF

## 结语

AI 代码审查工具是一个非常实用的项目，既能学到 AI 应用开发的知识，做出来的东西自己也能用。

而且这个项目的可扩展性很强——从简单的「粘贴代码→出结果」，到「接入 Git→自动审查→生成报告→CI/CD 集成」，能做的事情很多。你可以根据自己的能力和时间，选择做到什么程度。

最重要的是，动手去做。在做的过程中，你会遇到各种问题，解决这些问题的过程，就是你成长的过程。

赶紧动手试试吧！
