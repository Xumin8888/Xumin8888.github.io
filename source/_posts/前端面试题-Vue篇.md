---
title: 前端面试题 - Vue 篇
date: 2024-01-17 10:00:00
categories:
  - 面试专题
tags:
  - 面试
  - 笔试
  - Vue
  - 前端
top_img: /img/bj.jpg
cover: /img/4.jpg---

## 一、Vue 响应式原理

### 1. Vue2 和 Vue3 响应式的区别？

**Vue2：** 使用 `Object.defineProperty` 劫持对象的 getter 和 setter
- 缺点：无法监听数组变化、无法监听对象新增/删除属性、需要深度递归

**Vue3：** 使用 `Proxy` 代理整个对象
- 优点：可以监听数组变化、可以监听对象新增/删除属性、懒代理（访问时才代理）

### 2. 为什么 Vue2 中数组的方法可以被监听？

Vue2 重写了数组的 7 个方法：`push`、`pop`、`shift`、`unshift`、`splice`、`sort`、`reverse`

---

## 二、虚拟 DOM

### 1. 什么是虚拟 DOM？

虚拟 DOM 就是用 JS 对象来描述真实 DOM 结构，通过 diff 算法比较新旧虚拟 DOM 的差异，最小化更新真实 DOM。

### 2. 虚拟 DOM 的优缺点？

**优点：**
- 性能优化：减少 DOM 操作次数
- 跨平台：可以渲染到不同平台（小程序、SSR等）

**缺点：**
- 首次渲染可能更慢（需要创建虚拟 DOM）
- 极简单的页面可能反而更慢

---

## 三、Vue 生命周期

### 1. Vue3 生命周期钩子？

| 选项式 API | 组合式 API | 说明 |
|-----------|-----------|------|
| beforeCreate | - | 实例创建前 |
| created | - | 实例创建后 |
| beforeMount | onBeforeMount | 挂载前 |
| mounted | onMounted | 挂载后 |
| beforeUpdate | onBeforeUpdate | 更新前 |
| updated | onUpdated | 更新后 |
| beforeUnmount | onBeforeUnmount | 销毁前 |
| unmounted | onUnmounted | 销毁后 |

### 2. 父子组件生命周期顺序？

**挂载阶段：**
父 beforeCreate → 父 created → 父 beforeMount → 子 beforeCreate → 子 created → 子 beforeMount → 子 mounted → 父 mounted

**销毁阶段：**
父 beforeUnmount → 子 beforeUnmount → 子 unmounted → 父 unmounted

---

## 四、Vue Router

### 1. 路由模式有哪些？

- **hash 模式**：通过 `window.onhashchange` 监听，URL 带 `#`，兼容性好
- **history 模式**：通过 `history.pushState` API，URL 更美观，需要后端配合
- **abstract 模式**：不依赖浏览器历史，用于非浏览器环境（如 SSR）

### 2. 路由守卫有哪些？

- **全局守卫**：beforeEach、beforeResolve、afterEach
- **路由独享守卫**：beforeEnter
- **组件内守卫**：beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave

### 3. 完整的导航解析流程？

1. 导航被触发
2. 在失活的组件里调用 beforeRouteLeave 守卫
3. 调用全局的 beforeEach 守卫
4. 在重用的组件里调用 beforeRouteUpdate 守卫
5. 在路由配置里调用 beforeEnter
6. 解析异步路由组件
7. 在被激活的组件里调用 beforeRouteEnter
8. 调用全局的 beforeResolve 守卫
9. 导航被确认
10. 调用全局的 afterEach 钩子
11. 触发 DOM 更新
12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数

### 4. 路由懒加载？

```javascript
// 方式1：import 动态导入
const Home = () => import('@/views/Home.vue')

// 方式2：webpack 魔法注释，指定 chunk 名称
const About = () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
```

路由懒加载可以按需加载路由组件，减少首屏加载时间。

---

## 五、Vuex / Pinia 状态管理

### 1. Vuex 的核心概念？

- **State**：存储状态数据
- **Getter**：计算属性，对 state 进行加工
- **Mutation**：修改 state 的唯一方式，同步操作
- **Action**：提交 mutation，可包含异步操作
- **Module**：模块化，将 store 分割成模块

### 2. Vuex 的工作流程？

1. 组件通过 dispatch 触发 Action
2. Action 执行异步操作后，通过 commit 提交 Mutation
3. Mutation 修改 State
4. State 变化后，组件重新渲染

### 3. Pinia 和 Vuex 的区别？

| 特性 | Vuex | Pinia |
|------|------|-------|
| Vue 版本 | Vue2 / Vue3 | Vue3 优先 |
| TypeScript | 支持一般 | 原生支持 TS |
| 模块化 | Module 嵌套 | 直接多 store |
| Mutation | 有，必须通过 mutation 修改 | 无，直接修改 |
| 代码量 | 较多 | 更少更简洁 |
| DevTools | 支持 | 支持，更好用 |

---

## 六、Vue 组件通信

### 1. 组件通信方式有哪些？

**父子通信：**
- 父 → 子：props
- 子 → 父：$emit 事件

**兄弟通信：**
- 通过共同父组件转发
- EventBus（事件总线）
- Vuex / Pinia

**跨层级通信：**
- provide / inject
- Vuex / Pinia
- $attrs / $listeners

### 2. provide / inject 的使用？

```javascript
// 祖组件
export default {
  provide() {
    return {
      theme: this.theme,
      changeTheme: this.changeTheme
    }
  }
}

// 后代组件
export default {
  inject: ['theme', 'changeTheme']
}
```

provide / inject 可以实现祖先组件向后代组件传递数据，适用于深层嵌套的场景。

### 3. $attrs 和 $listeners？

- **$attrs**：包含父组件传递的、没有在子组件 props 中声明的属性
- **$listeners**：包含父组件传递的所有事件监听器

用途：跨层级透传属性和事件，在封装高阶组件时常用。

---

## 七、Vue 性能优化

### 1. Vue 性能优化手段？

**编码层面：**
- v-if 和 v-show 合理使用
- v-for 必须加 key，且避免用 index
- computed 和 watch 合理使用
- 长列表用虚拟滚动
- 防抖和节流
- 图片懒加载

**组件层面：**
- 组件懒加载（异步组件）
- 函数式组件（Vue2）
- 无状态组件
- 组件缓存（keep-alive）
- 避免在模板中写复杂表达式

**构建层面：**
- 路由懒加载
- Tree Shaking
- 按需引入第三方库
- 使用 CDN
- Gzip 压缩

### 2. keep-alive 的理解？

keep-alive 是 Vue 的内置组件，用来缓存不活动的组件实例。

**作用：**
- 避免组件重复渲染，提升性能
- 保留组件状态，返回时不重新创建

**常用属性：**
- `include`：字符串或正则，匹配的组件会被缓存
- `exclude`：字符串或正则，匹配的组件不会被缓存
- `max`：最多缓存多少个组件实例

**生命周期钩子：**
- `activated`：组件被激活时调用
- `deactivated`：组件被缓存时调用

---

## 八、Vue3 新特性

### 1. Vue3 相比 Vue2 有哪些改进？

**性能提升：**
- 打包体积更小（Tree Shaking 支持更好）
- 首次渲染更快，更新更快
- 内存占用更少

**Composition API：**
- 更好的逻辑复用
- 更灵活的代码组织
- 更好的 TypeScript 支持

**其他改进：**
- 响应式系统升级（Object.defineProperty → Proxy）
- 虚拟 DOM 重写
- 编译优化（PatchFlags、hoistStatic、cacheHandlers）
- Fragment、Teleport、Suspense 等新组件
- 更好的 TypeScript 支持

### 2. Composition API 和 Options API 的区别？

| 特性 | Options API | Composition API |
|------|-------------|----------------|
| 代码组织 | 按选项组织（data、methods、computed） | 按功能逻辑组织 |
| 逻辑复用 | mixins（命名冲突、来源不清晰） | 组合式函数（更灵活清晰） |
| TypeScript | 支持一般 | 原生支持 |
| 适用场景 | 简单组件 | 复杂组件 |
| Vue 版本 | Vue2 / Vue3 | Vue3 |

### 3. 常用的 Composition API？

**响应式：**
- `ref`：创建基本类型的响应式数据
- `reactive`：创建对象类型的响应式数据
- `computed`：计算属性
- `watch`：监听器
- `watchEffect`：立即执行的监听器

**生命周期：**
- `onMounted`、`onUpdated`、`onUnmounted`
- `onBeforeMount`、`onBeforeUpdate`、`onBeforeUnmount`

**其他：**
- `provide` / `inject`
- `nextTick`
- `useSlots`、`useAttrs`

---

## 九、Diff 算法

### 1. 什么是虚拟 DOM？

虚拟 DOM 就是用 JS 对象来描述真实 DOM 结构，通过 diff 算法比较新旧虚拟 DOM 的差异，最小化更新真实 DOM。

**优点：**
- 性能优化：减少 DOM 操作次数
- 跨平台：可以渲染到不同平台（小程序、SSR等）

### 2. Vue 的 Diff 算法特点？

Vue 的 Diff 算法是**同层比较**，不会跨层比较。

**比较策略：**
1. 先比较头尾指针
2. 头头比较、尾尾比较
3. 头尾比较、尾头比较
4. 都不符合的话，用 key 建立映射表查找

**双端比较算法：**
- oldStartIdx、oldEndIdx
- newStartIdx、newEndIdx
- 从两端向中间靠拢比较

### 3. key 的作用？

key 帮助 Vue 识别哪些元素改变了、添加了或删除了，是 diff 算法的重要依据。

**注意事项：**
- 不要用数组 index 作为 key（列表顺序变化时有问题）
- 要用唯一且稳定的值作为 key
- 兄弟元素之间 key 唯一即可，不需要全局唯一

---

## 十、其他高频考点

### 1. 双向绑定的原理？

**Vue2：**
- 数据劫持：Object.defineProperty 劫持对象属性的 getter 和 setter
- 发布订阅模式：Dep 收集依赖，Watcher 订阅更新
- 模板编译：解析指令，生成渲染函数

**Vue3：**
- 使用 Proxy 代理整个对象
- 可以监听数组变化、对象新增/删除属性
- 懒代理（访问时才代理）

### 2. nextTick 的原理？

nextTick 是在下次 DOM 更新循环结束之后执行延迟回调。

**使用场景：**
- 修改数据后，需要基于更新后的 DOM 做操作

**原理：**
- Vue 在更新 DOM 时是异步执行的
- 只要侦听到数据变化，Vue 将开启一个队列
- 同一事件循环中的所有数据变化会被缓冲
- 在下一个事件循环 tick 中，Vue 刷新队列并执行实际工作

### 3. 为什么 v-for 和 v-if 不建议一起用？

- v-for 的优先级比 v-if 高
- 如果一起用，每次渲染都会先遍历整个列表再判断条件
- 会造成性能浪费

**解决方案：**
- 如果是过滤列表，用 computed 先过滤
- 如果是控制显示/隐藏，把 v-if 移到外层元素
