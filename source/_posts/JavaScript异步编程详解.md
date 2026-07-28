---
title: JavaScript 异步编程详解：从回调到 async/await
date: 2026-02-05 14:00:00
categories:
  - 前端
tags:
  - JavaScript
  - 前端
  - 异步
top_img: /img/bj.jpg
cover: /img/10.jpg
---

## 前言

JavaScript 是单线程语言，但它通过异步编程实现了非阻塞的能力。本文将带你从回调函数开始，一步步了解 Promise、Generator，直到 async/await 的完整异步编程进化之路。

## 一、同步 vs 异步

### 1.1 同步代码

```javascript
console.log('1')
console.log('2')
console.log('3')
// 输出顺序：1 2 3
```

### 1.2 异步代码

```javascript
console.log('1')
setTimeout(() => {
  console.log('2')
}, 1000)
console.log('3')
// 输出顺序：1 3 2
```

### 1.3 为什么需要异步

- 网络请求
- 文件读写
- 定时器
- 事件监听
- 数据库操作

## 二、回调函数

### 2.1 基本用法

```javascript
function fetchData(callback) {
  setTimeout(() => {
    const data = { name: 'Tom', age: 18 }
    callback(data)
  }, 1000)
}

fetchData((data) => {
  console.log(data)
})
```

### 2.2 回调地狱

当多个异步操作嵌套时，代码会变得难以维护：

```javascript
getData(function(a) {
  getMoreData(a, function(b) {
    getMoreData(b, function(c) {
      getMoreData(c, function(d) {
        getMoreData(d, function(e) {
          console.log(e)
        })
      })
    })
  })
})
```

**回调地狱的问题：**
- 代码横向发展，难以阅读
- 难以调试
- 错误处理困难
- 难以复用

## 三、Promise

### 3.1 基本用法

```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true
    if (success) {
      resolve('成功')
    } else {
      reject('失败')
    }
  }, 1000)
})

promise
  .then(result => {
    console.log(result) // 成功
  })
  .catch(error => {
    console.error(error) // 失败
  })
  .finally(() => {
    console.log('完成') // 无论成功失败都会执行
  })
```

### 3.2 Promise 状态

Promise 有三种状态，且状态一旦改变就不可逆：

- **pending（进行中）**：初始状态
- **fulfilled（已成功）**：操作成功
- **rejected（已失败）**：操作失败

```
pending → fulfilled (resolve)
pending → rejected  (reject)
```

### 3.3 链式调用

```javascript
fetch('/api/user')
  .then(res => res.json())
  .then(user => {
    console.log(user)
    return fetch(`/api/posts?userId=${user.id}`)
  })
  .then(res => res.json())
  .then(posts => {
    console.log(posts)
  })
  .catch(err => {
    console.error('出错了:', err)
  })
```

### 3.4 Promise 静态方法

```javascript
// Promise.resolve：返回一个成功的 Promise
Promise.resolve('value')

// Promise.reject：返回一个失败的 Promise
Promise.reject('error')

// Promise.all：所有 Promise 都成功才成功，一个失败就失败
Promise.all([promise1, promise2, promise3])
  .then(results => console.log(results)) // 结果数组
  .catch(error => console.error(error))

// Promise.race：返回第一个完成的 Promise（无论成功失败）
Promise.race([promise1, promise2, promise3])

// Promise.allSettled：所有 Promise 完成后返回结果（不管成功失败）
Promise.allSettled([promise1, promise2])

// Promise.any：返回第一个成功的 Promise，全都失败才失败
Promise.any([promise1, promise2, promise3])
```

### 3.5 封装 Ajax

```javascript
function ajax(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        reject(new Error(xhr.statusText))
      }
    }
    xhr.onerror = () => reject(new Error('Network error'))
    xhr.send(data)
  })
}

// 使用
ajax('/api/user')
  .then(user => console.log(user))
  .catch(err => console.error(err))
```

## 四、Generator

### 4.1 基本用法

```javascript
function* gen() {
  yield 1
  yield 2
  return 3
}

const g = gen()
console.log(g.next()) // { value: 1, done: false }
console.log(g.next()) // { value: 2, done: false }
console.log(g.next()) // { value: 3, done: true }
console.log(g.next()) // { value: undefined, done: true }
```

### 4.2 Generator 实现异步

```javascript
function* fetchUser() {
  const user = yield fetch('/api/user').then(res => res.json())
  console.log(user)
  const posts = yield fetch(`/api/posts?userId=${user.id}`).then(res => res.json())
  console.log(posts)
}

// 自动执行器
function run(gen) {
  const g = gen()
  
  function next(data) {
    const result = g.next(data)
    if (result.done) return result.value
    result.value.then(data => next(data))
  }
  
  next()
}

run(fetchUser)
```

## 五、async/await

### 5.1 基本用法

```javascript
async function fetchData() {
  try {
    const res = await fetch('/api/user')
    const user = await res.json()
    console.log(user)
    return user
  } catch (error) {
    console.error('出错了:', error)
  }
}

fetchData()
```

### 5.2 串行执行

```javascript
async function serial() {
  const result1 = await promise1()
  const result2 = await promise2(result1)
  const result3 = await promise3(result2)
  return result3
}
```

### 5.3 并行执行

```javascript
async function parallel() {
  // 同时发起多个请求
  const promise1 = fetch('/api/a')
  const promise2 = fetch('/api/b')
  const promise3 = fetch('/api/c')
  
  // 等待所有结果
  const [res1, res2, res3] = await Promise.all([promise1, promise2, promise3])
}
```

### 5.4 错误处理

```javascript
// try/catch
async function fetchData() {
  try {
    const data = await fetch('/api/data')
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

// .catch()
async function fetchData() {
  const data = await fetch('/api/data').catch(err => {
    console.error(err)
    return null
  })
  return data
}
```

### 5.5 async 函数的返回值

```javascript
// async 函数总是返回 Promise
async function foo() {
  return 'hello'
}
foo().then(val => console.log(val)) // hello

async function bar() {
  throw new Error('出错了')
}
bar().catch(err => console.error(err)) // Error: 出错了
```

## 六、事件循环

### 6.1 宏任务和微任务

| 类型 | 包含 |
| --- | --- |
| 宏任务（macrotask） | script、setTimeout、setInterval、I/O、UI 渲染 |
| 微任务（microtask） | Promise.then、MutationObserver、queueMicrotask |

### 6.2 执行顺序

```
1. 执行同步代码（宏任务）
2. 执行所有微任务
3. 浏览器渲染
4. 执行下一个宏任务
5. 回到第 2 步
```

### 6.3 经典面试题

```javascript
console.log('1')

setTimeout(() => {
  console.log('2')
  Promise.resolve().then(() => {
    console.log('3')
  })
}, 0)

Promise.resolve().then(() => {
  console.log('4')
})

console.log('5')

// 输出顺序：1 5 4 2 3
```

**解析：**
1. 同步代码先执行：输出 1、5
2. 执行微任务：输出 4
3. 执行宏任务 setTimeout：输出 2
4. 微任务：输出 3

## 七、常见异步模式

### 7.1 超时处理

```javascript
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), ms)
  })
  return Promise.race([promise, timeout])
}

// 使用
withTimeout(fetch('/api/data'), 5000)
  .then(data => console.log(data))
  .catch(err => console.error(err))
```

### 7.2 重试机制

```javascript
async function retry(fn, times = 3, delay = 1000) {
  try {
    return await fn()
  } catch (error) {
    if (times > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
      return retry(fn, times - 1, delay * 2)
    }
    throw error
  }
}

// 使用
retry(() => fetch('/api/data'), 3, 1000)
  .then(data => console.log(data))
  .catch(err => console.error(err))
```

### 7.3 并发控制

```javascript
async function pool(tasks, limit) {
  const results = []
  let index = 0

  async function worker() {
    while (index < tasks.length) {
      const i = index++
      results[i] = await tasks[i]()
    }
  }

  const workers = Array(limit).fill().map(worker)
  await Promise.all(workers)

  return results
}
```

## 八、总结

JavaScript 异步编程的进化史：

1. **回调函数**：最基础，但容易产生回调地狱
2. **Promise**：解决回调地狱，链式调用
3. **Generator**：可以暂停和恢复，但需要执行器
4. **async/await**：基于 Promise，语法糖，最优雅

**推荐使用 async/await**，它让异步代码看起来像同步代码，易于阅读和维护。

理解事件循环机制，才能真正掌握 JavaScript 的异步执行原理！
