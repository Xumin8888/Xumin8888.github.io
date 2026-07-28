---
title: 前端面试题 - JavaScript 基础篇
date: 2024-01-15 10:00:00
categories:
  - 面试专题
tags:
  - 面试
  - 笔试
  - 前端
top_img: /img/bj.jpg
cover: /img/2.jpg
---

## 一、数据类型

### 1. JavaScript 有哪些数据类型？

- **基本数据类型**：String、Number、Boolean、Null、Undefined、Symbol、BigInt
- **引用数据类型**：Object、Array、Function、Date、RegExp 等

### 2. null 和 undefined 的区别？

- `undefined` 表示变量声明了但未赋值
- `null` 表示变量的值是空对象
- `typeof undefined` 返回 `"undefined"`
- `typeof null` 返回 `"object"`（历史遗留 bug）

---

## 二、作用域与闭包

### 1. 什么是闭包？

闭包是指有权访问另一个函数作用域中变量的函数。

**常见应用场景：**
- 封装私有变量
- 模块化开发
- 防抖节流
- 回调函数

### 2. 什么是作用域链？

当访问一个变量时，先在当前作用域查找，如果找不到就去父级作用域查找，直到全局作用域，这个查找的链条就是作用域链。

---

## 三、原型与继承

### 1. 什么是原型链？

每个对象都有 `__proto__` 属性指向其构造函数的 `prototype`，而 `prototype` 也是一个对象，也有 `__proto__`，这样一层一层往上找就形成了原型链。

### 2. 如何实现继承？

1. **原型链继承**
2. **构造函数继承**
3. **组合继承**
4. **寄生组合继承**（最推荐）
5. **ES6 class extends**

---

## 四、异步编程

### 1. 什么是事件循环（Event Loop）？

JavaScript 是单线程的，通过事件循环机制处理异步任务：
1. 执行同步代码（宏任务）
2. 执行微任务队列
3. 渲染页面
4. 执行下一个宏任务

**宏任务（Macrotask）：**
- script 整体代码
- setTimeout、setInterval
- setImmediate（Node.js）
- I/O 操作
- UI 渲染

**微任务（Microtask）：**
- Promise.then/catch/finally
- async/await
- MutationObserver
- process.nextTick（Node.js）

**执行顺序：**
同步代码 → 微任务队列 → 宏任务队列 → 微任务队列 → ...

### 2. Promise 的三种状态？

- `pending`：等待中
- `fulfilled`：已成功
- `rejected`：已失败

状态一旦改变就不可逆。

### 3. Promise 的常用方法？

**实例方法：**
- `then()`：接收成功和失败的回调，返回新的 Promise
- `catch()`：捕获错误，相当于 `then(null, onRejected)`
- `finally()`：无论成功失败都会执行

**静态方法：**
- `Promise.resolve()`：返回一个成功的 Promise
- `Promise.reject()`：返回一个失败的 Promise
- `Promise.all()`：所有 Promise 都成功才成功，一个失败就失败
- `Promise.race()`：谁先完成就返回谁的结果
- `Promise.allSettled()`：等待所有 Promise 完成，返回所有结果
- `Promise.any()`：只要有一个成功就成功，全部失败才失败

### 4. async/await 的理解？

async/await 是 Generator 的语法糖，让异步代码看起来像同步代码。

**特点：**
- `async` 函数返回一个 Promise
- `await` 只能在 async 函数中使用
- `await` 会暂停执行，等待 Promise 完成
- 错误处理用 try/catch

**示例：**
```javascript
async function fetchData() {
  try {
    const res = await fetch('/api/data')
    const data = await res.json()
    return data
  } catch (err) {
    console.error('请求失败:', err)
  }
}
```

---

## 五、this 指向问题

### 1. this 的指向规则？

this 的指向不是在定义时确定的，而是在调用时确定的。

**规则优先级（从高到低）：**
1. **new 绑定**：new 一个实例时，this 指向新创建的对象
2. **显式绑定**：call、apply、bind 绑定的对象
3. **隐式绑定**：作为对象方法调用时，this 指向该对象
4. **默认绑定**：严格模式下是 undefined，非严格模式下是全局对象（window/global）

### 2. 箭头函数的 this？

箭头函数没有自己的 this，它的 this 继承自外层作用域的 this。

**特点：**
- 箭头函数的 this 在定义时就确定了
- 不能用 new 调用
- 不能用 call、apply、bind 改变 this 指向
- 没有 arguments 对象

---

## 六、ES6 新特性

### 1. let、const 和 var 的区别？

| 特性 | var | let | const |
|------|-----|-----|-------|
| 作用域 | 函数作用域 | 块级作用域 | 块级作用域 |
| 变量提升 | ✅ 有 | ❌ 无（暂时性死区） | ❌ 无 |
| 重复声明 | ✅ 可以 | ❌ 不可以 | ❌ 不可以 |
| 重新赋值 | ✅ 可以 | ✅ 可以 | ❌ 不可以 |
| 全局变量 | 挂在 window 上 | 不挂在 window 上 | 不挂在 window 上 |

### 2. 解构赋值？

**数组解构：**
```javascript
const [a, b, ...rest] = [1, 2, 3, 4, 5]
// a=1, b=2, rest=[3,4,5]
```

**对象解构：**
```javascript
const { name, age, ...rest } = { name: '张三', age: 18, gender: '男' }
// name='张三', age=18, rest={gender:'男'}
```

**默认值：**
```javascript
const { name = '默认值' } = {}
```

### 3. 扩展运算符？

**数组扩展：**
```javascript
const arr = [...[1,2], ...[3,4]] // [1,2,3,4]
```

**对象扩展：**
```javascript
const obj = { ...{a:1}, ...{b:2} } // {a:1, b:2}
```

**函数参数：**
```javascript
function sum(...args) {
  return args.reduce((a, b) => a + b, 0)
}
```

### 4. 模板字符串？

```javascript
const name = '张三'
const str = `我是${name}，今年${18}岁`
```

**特点：**
- 用反引号 `` ` `` 包裹
- 可以插值 `${表达式}`
- 可以换行
- 可以嵌套

### 5. Set 和 Map？

**Set（集合）：**
- 成员唯一，不重复
- 常用方法：add、delete、has、clear、size
- 用途：数组去重

**Map（字典）：**
- 键值对集合，键可以是任意类型
- 常用方法：set、get、has、delete、clear、size
- 与对象的区别：键的类型更灵活，有 size 属性，可迭代

---

## 七、数组方法

### 1. 常用数组方法？

**改变原数组的方法：**
- push、pop、shift、unshift
- sort、reverse、splice
- fill、copyWithin

**不改变原数组的方法：**
- map、filter、reduce、forEach
- find、findIndex、some、every
- concat、slice、join
- flat、flatMap

### 2. reduce 的用法？

reduce 可以做很多事情，是最强大的数组方法之一。

**求和：**
```javascript
const sum = arr.reduce((pre, cur) => pre + cur, 0)
```

**数组去重：**
```javascript
const unique = arr.reduce((pre, cur) => {
  if (!pre.includes(cur)) pre.push(cur)
  return pre
}, [])
```

**数组转对象：**
```javascript
const obj = arr.reduce((pre, cur) => {
  pre[cur.id] = cur
  return pre
}, {})
```

---

## 八、浅拷贝与深拷贝

### 1. 浅拷贝的方法？

- Object.assign()
- 扩展运算符 {...obj} / [...arr]
- Array.prototype.slice()
- Array.prototype.concat()

### 2. 深拷贝的方法？

**JSON.parse(JSON.stringify(obj))**
- 缺点：不能处理函数、undefined、Symbol、循环引用

**手动实现 deepClone**
- 递归遍历所有属性
- 处理各种数据类型（Date、RegExp 等）
- 用 WeakMap 处理循环引用

---

## 九、原型与继承进阶

### 1. new 操作符做了什么？

1. 创建一个新的空对象
2. 将新对象的 __proto__ 指向构造函数的 prototype
3. 将构造函数的 this 指向新对象，执行构造函数
4. 如果构造函数返回对象，则返回该对象；否则返回新对象

### 2. 如何实现寄生组合式继承？

```javascript
function Parent(name) {
  this.name = name
}

Parent.prototype.say = function() {
  console.log(this.name)
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}

// 关键：创建一个中间对象
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child
```

这是最推荐的继承方式，集寄生式继承和组合继承的优点于一身。
