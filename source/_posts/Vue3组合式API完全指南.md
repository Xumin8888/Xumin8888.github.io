---
title: Vue3 组合式 API 完全指南：从 Options API 到 Composition API
date: 2026-02-15 10:30:00
categories:
  - 前端
tags:
  - Vue
  - Vue3
  - 前端
top_img: /img/bj.jpg
cover: /img/2.jpg
---

## 前言

Vue3 带来了全新的组合式 API（Composition API），这是 Vue3 最重要的新特性之一。本文将带你从 Options API 逐步过渡到 Composition API，全面掌握 Vue3 的核心编程方式。

## 一、为什么需要 Composition API

### 1.1 Options API 的局限

在 Vue2 中，我们使用 Options API 来组织代码：

```javascript
export default {
  data() {
    return { count: 0, name: '' }
  },
  computed: {
    doubleCount() { return this.count * 2 }
  },
  methods: {
    increment() { this.count++ }
  },
  watch: {
    count(newVal) { console.log(newVal) }
  }
}
```

这种方式在简单组件中很好用，但当组件变得复杂时，**相关的逻辑会被分散到不同的选项中**，导致代码难以维护。

### 1.2 Composition API 的优势

- **逻辑复用**：通过组合函数（composables）复用逻辑
- **代码组织**：相关逻辑可以放在一起
- **类型推导**：更好的 TypeScript 支持
- **灵活度高**：可以按需使用，不是全有或全无

## 二、核心 API 详解

### 2.1 ref：响应式基础数据

`ref` 用于创建一个响应式的引用值，通常用于基本类型：

```javascript
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

**在模板中使用时，`ref` 会自动解包，不需要 `.value`：**

```vue
<template>
  <div>{{ count }}</div>
  <button @click="count++">+1</button>
</template>
```

### 2.2 reactive：响应式对象

`reactive` 用于创建响应式的对象或数组：

```javascript
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  name: 'Vue3'
})

console.log(state.count) // 0
state.count++
console.log(state.count) // 1
```

> **注意**：`reactive` 只对对象类型有效，对基本类型无效。解构 reactive 对象会失去响应性。

### 2.3 computed：计算属性

```javascript
import { ref, computed } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

console.log(doubleCount.value) // 0
count.value++
console.log(doubleCount.value) // 2
```

**可写的 computed：**

```javascript
const fullName = computed({
  get() {
    return firstName.value + ' ' + lastName.value
  },
  set(val) {
    const names = val.split(' ')
    firstName.value = names[0]
    lastName.value = names[1]
  }
})
```

### 2.4 watch：监听器

```javascript
import { ref, watch, watchEffect } from 'vue'

const count = ref(0)
const name = ref('Vue')

// 监听单个 ref
watch(count, (newVal, oldVal) => {
  console.log(`count changed: ${oldVal} -> ${newVal}`)
})

// 监听多个源
watch([count, name], ([newCount, newName], [oldCount, oldName]) => {
  console.log(count: ${newCount}, name: ${newName})
})

// 立即执行
watch(count, handler, { immediate: true })

// 深度监听
watch(state, handler, { deep: true })
```

### 2.5 watchEffect：自动追踪依赖

```javascript
watchEffect(() => {
  console.log(`count is: ${count.value}`)
})
// count 变化时自动重新执行
```

## 三、生命周期钩子

在 setup 中使用生命周期钩子，需要加上 `on` 前缀：

```javascript
import {
  onMounted,
  onUpdated,
  onUnmounted,
  onBeforeMount,
  onBeforeUpdate,
  onBeforeUnmount
} from 'vue'

onMounted(() => {
  console.log('组件已挂载')
})

onUpdated(() => {
  console.log('组件已更新')
})

onUnmounted(() => {
  console.log('组件已卸载')
})
```

## 四、组合函数（Composables）

组合函数是 Composition API 最强大的特性，让逻辑复用变得简单。

### 4.1 计数器组合函数

```javascript
// useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const double = computed(() => count.value * 2)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return {
    count,
    double,
    increment,
    decrement,
    reset
  }
}
```

**在组件中使用：**

```javascript
import { useCounter } from './useCounter'

export default {
  setup() {
    const { count, double, increment, decrement } = useCounter(10)
    return { count, double, increment, decrement }
  }
}
```

### 4.2 鼠标位置组合函数

```javascript
// useMouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  
  const update = (e) => {
    x.value = e.pageX
    y.value = e.pageY
  }
  
  onMounted(() => {
    window.addEventListener('mousemove', update)
  })
  
  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })
  
  return { x, y }
}
```

### 4.3 数据请求组合函数

```javascript
// useFetch.js
import { ref, isRef, unref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  const fetchData = async () => {
    loading.value = true
    data.value = null
    error.value = null
    
    try {
      const res = await fetch(unref(url))
      data.value = await res.json()
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  if (isRef(url)) {
    watchEffect(fetchData)
  } else {
    fetchData()
  }

  return { data, error, loading, refetch: fetchData }
}
```

## 五、provide / inject

跨组件通信的新方式：

```javascript
// 父组件
import { provide, ref } from 'vue'

const theme = ref('dark')
provide('theme', theme)

// 子组件（任意层级）
import { inject } from 'vue'

const theme = inject('theme', 'light') // 第二个参数是默认值
```

## 六、最佳实践

### 6.1 什么时候用 ref，什么时候用 reactive？

- 基本类型用 `ref`
- 对象类型用 `reactive`
- 不确定时用 `ref`，更灵活

### 6.2 组合函数命名规范

- 以 `use` 开头，如 `useCounter`、`useMouse`
- 返回一个对象，包含响应式数据和方法
- 放在单独的文件中，便于复用

### 6.3 代码组织建议

1. 按逻辑关注点组织代码，而不是按选项类型
2. 把可复用的逻辑抽成组合函数
3. setup 函数保持简洁，复杂逻辑抽出去

## 七、总结

Vue3 的 Composition API 不是要取代 Options API，而是提供了一种更灵活的代码组织方式。

**核心要点回顾：**

- `ref` 和 `reactive` 创建响应式数据
- `computed` 创建计算属性
- `watch` 和 `watchEffect` 监听变化
- 组合函数（Composables）是逻辑复用的最佳方式
- 可以和 Options API 混合使用

掌握 Composition API，你就能写出更清晰、更易维护、更易复用的 Vue3 代码！
