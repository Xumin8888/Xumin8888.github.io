---
title: 前端面试题 - React 篇
date: 2024-01-19 10:00:00
categories:
  - 面试专题
tags:
  - 面试
  - 笔试
  - React
  - 前端
top_img: /img/bj.jpg
cover: /img/cat.jpg
---

## 一、React 基础

### 1. React 的特点是什么？

- **虚拟 DOM**：用 JS 对象描述真实 DOM，通过 diff 算法最小化更新
- **组件化**：将 UI 拆分成独立、可复用的组件
- **单向数据流**：数据从父组件流向子组件，通过 props 传递
- **声明式编程**：描述"想要什么"，而不是"怎么做"
- **跨平台**：React Native 可以开发移动端应用

### 2. 函数组件和类组件的区别？

| 特性 | 函数组件 | 类组件 |
|------|---------|--------|
| 写法 | 函数 | class 继承 React.Component |
| 状态管理 | useState Hook | this.state |
| 生命周期 | useEffect Hook | 生命周期方法 |
| this | 没有 | 有 |
| 性能 | 更轻量 | 稍重 |
| 未来趋势 | ✅ 推荐 | 兼容支持 |

---

## 二、Hooks

### 1. 常用的 Hooks 有哪些？

**基础 Hooks：**
- `useState`：状态管理
- `useEffect`：副作用处理
- `useContext`：上下文访问

**额外 Hooks：**
- `useReducer`：复杂状态管理
- `useCallback`：缓存函数
- `useMemo`：缓存计算结果
- `useRef`：获取 DOM 引用/保存可变值
- `useImperativeHandle`：自定义暴露给父组件的实例值
- `useLayoutEffect`：DOM 变更后同步执行

### 2. useEffect 的使用场景？

- 数据请求
- DOM 操作
- 订阅/取消订阅
- 定时器设置与清理
- 手动修改 DOM

**依赖数组：**
- 不传：每次渲染都执行
- `[]`：只在挂载时执行一次
- `[a, b]`：a 或 b 变化时执行

---

## 三、状态管理

### 1. 常见的状态管理方案？

- **本地状态**：useState、useReducer
- **跨组件共享**：Context API
- **第三方库**：Redux、MobX、Zustand、Jotai、Recoil

### 2. Redux 的工作流程？

1. **View** 触发 **Action**
2. **Store** 接收 Action，调用 **Reducer**
3. **Reducer** 根据 Action 类型计算新的 **State**
4. **Store** 更新 State，通知订阅的 View 重新渲染

**三大原则：**
- 单一数据源
- State 是只读的
- 使用纯函数（Reducer）来修改 State

---

## 四、性能优化

### 1. React 性能优化手段？

**组件层面：**
- `React.memo`：避免不必要的重渲染
- `useMemo`：缓存计算结果
- `useCallback`：缓存函数引用
- 懒加载组件：`React.lazy` + `Suspense`

**列表优化：**
- 正确使用 key
- 虚拟滚动（react-window / react-virtualized）

**其他：**
- 防抖（debounce）和节流（throttle）
- 图片懒加载
- 代码分割
- 避免在 render 中创建新对象/函数

### 2. key 的作用？

key 帮助 React 识别哪些元素改变了、添加了或删除了。

**注意事项：**
- 不要用数组 index 作为 key（列表顺序变化时有问题）
- 要用唯一且稳定的值作为 key
- 兄弟元素之间 key 唯一即可，不需要全局唯一

---

## 五、其他

### 1. 受控组件和非受控组件？

**受控组件：** 表单数据由 React 状态控制
```jsx
const [value, setValue] = useState('')
<input value={value} onChange={e => setValue(e.target.value)} />
```

**非受控组件：** 表单数据由 DOM 自己管理，用 ref 获取值
```jsx
const inputRef = useRef(null)
<input ref={inputRef} />
```

### 2. 什么是高阶组件（HOC）？

高阶组件是接收一个组件并返回一个新组件的函数，用于复用组件逻辑。

**常见 HOC：**
- Redux 的 `connect`
- React Router 的 `withRouter`
- React.memo（也是一种 HOC）
