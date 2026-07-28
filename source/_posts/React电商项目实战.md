---
title: React 电商项目实战
date: 2026-06-15 09:00:00
categories:
  - 项目
tags:
  - React
  - 电商
  - 项目实战
top_img: /img/bj.jpg
cover: /img/2.jpg
---

## 项目概述

本项目是一个基于 React 技术栈打造的完整电商平台，包含用户端商城和商家管理后台两大模块。采用 React 18 + Redux Toolkit + Ant Design 等主流技术，实现了商品浏览、购物车、订单管理、支付流程、用户中心等完整电商功能。

作为一个全功能的电商项目，它不仅涵盖了前端开发的方方面面，还涉及了复杂的业务逻辑处理、状态管理、性能优化等进阶内容。无论是学习 React 技术栈，还是作为面试项目，都是非常好的实战选择。

> 该项目是学习 React 全栈开发的绝佳实战项目，涵盖了组件设计、状态管理、路由、性能优化等核心知识点。

## 技术栈详解

### 核心框架

- **React 18**：最新的 React 版本，支持并发模式、自动批处理等新特性
- **React Router 6**：官方路由库，支持嵌套路由、动态路由、路由守卫等
- **Redux Toolkit**：官方推荐的 Redux 工具集，简化状态管理
- **React Redux**：React 官方的 Redux 绑定库

### UI 组件库

- **Ant Design**：企业级 UI 组件库，组件丰富，功能完善
- **Ant Design Mobile**（可选）：移动端 UI 组件库
- **Styled Components**：CSS-in-JS 方案，样式写在 JS 里
- **SCSS/Sass**：CSS 预处理器

### 数据请求

- **Axios**：HTTP 请求库，支持拦截器、取消请求等
- **React Query/TanStack Query**：服务端状态管理，数据缓存、自动刷新
- **Mock.js**（可选）：前端 Mock 数据，后端接口未就绪时使用

### 工具库

- **Day.js**：轻量级日期处理库
- **Lodash**：JavaScript 工具函数库
- **Immer**：不可变数据操作，简化状态更新
- **Reselect**：Redux 选择器库，优化性能
- **Classnames**：条件类名工具

### 工程化

- **Vite / Create React App**：项目构建工具
- **ESLint**：代码质量检查
- **Prettier**：代码格式化
- **Husky + lint-staged**：Git 提交检查
- **TypeScript**（可选）：类型安全

## 核心功能模块

### 一、用户端商城

#### 1. 首页

商城首页是用户进入的第一个页面，展示各类商品和活动。

**功能特点：**
- 顶部搜索栏 + 分类导航
- 轮播图 / Banner 广告位
- 快捷入口图标导航
- 秒杀 / 限时特惠专区
- 热门推荐商品列表
- 猜你喜欢 / 个性化推荐
- 下拉刷新 / 上拉加载更多
- 返回顶部按钮

#### 2. 商品分类浏览

按分类浏览商品，支持多维度筛选。

**功能特点：**
- 左侧一级分类导航
- 右侧二级/三级分类展示
- 商品列表（网格/列表两种模式）
- 综合 / 销量 / 价格 / 新品排序
- 筛选功能（价格区间、品牌、规格等）
- 商品快速预览弹窗

#### 3. 商品详情页

展示商品详细信息，是转化的关键页面。

**功能特点：**
- 商品图片轮播 / 视频展示
- 商品标题、价格、库存、销量
- 优惠券 / 活动标识
- 商品规格选择（颜色、尺寸、版本等）
- 商品详情介绍（图文）
- 商品规格参数
- 用户评价展示
- 商品收藏
- 加入购物车 / 立即购买按钮
- 底部悬浮操作栏

#### 4. 购物车

购物车管理，支持商品增删改查。

**功能特点：**
- 购物车商品列表
- 商品数量增减
- 商品规格修改
- 商品删除 / 批量删除
- 商品勾选 / 全选
- 实时计算总价
- 优惠券选择
- 结算按钮
- 购物车为空时的推荐商品
- 移到收藏夹

#### 5. 订单流程

完整的下单和支付流程。

**功能特点：**
- 订单确认页（地址、商品、金额明细）
- 收货地址选择 / 新增 / 编辑
- 订单备注
- 优惠券选择
- 配送方式选择
- 发票信息
- 提交订单
- 支付页面（多种支付方式）
- 支付成功 / 失败页面
- 订单状态跟踪

#### 6. 用户中心

用户个人信息和功能入口。

**功能特点：**
- 用户头像、昵称、等级
- 订单快捷入口（待付款、待发货、待收货、待评价、退款/售后）
- 我的资产（余额、积分、优惠券）
- 我的收藏
- 浏览历史
- 收货地址管理
- 账户安全（修改密码、绑定手机）
- 设置
- 客服中心

#### 7. 搜索功能

商品搜索和搜索建议。

**功能特点：**
- 搜索框和搜索历史
- 热门搜索词
- 搜索建议（输入联想）
- 搜索结果列表
- 搜索结果筛选和排序
- 搜索发现 / 推荐

### 二、商家管理后台

#### 1. 数据仪表盘

展示店铺运营数据概览。

**功能特点：**
- 核心指标卡片（销售额、订单量、用户数等）
- 销售趋势图
- 商品销量排行
- 订单状态分布
- 实时订单提醒

#### 2. 商品管理

商品信息的完整管理。

**功能特点：**
- 商品列表（上下架、库存管理）
- 商品添加 / 编辑（富文本编辑器）
- 商品分类管理
- 商品规格管理
- 商品图片管理
- 批量操作（上下架、删除）

#### 3. 订单管理

订单处理和管理。

**功能特点：**
- 订单列表（多状态筛选）
- 订单详情
- 订单操作（发货、改价、备注等）
- 退款 / 售后处理
- 订单导出

#### 4. 营销管理

各类营销活动配置。

**功能特点：**
- 优惠券管理
- 满减活动
- 秒杀活动
- 拼团活动
- 会员折扣

## 项目亮点

### 技术亮点

1. **React 18 新特性**：并发模式、Suspense、自动批处理、Transitions API
2. **Redux Toolkit**：简化的 Redux 使用方式，包含 createSlice、createAsyncThunk 等
3. **组件化设计**：合理的组件拆分，高内聚低耦合
4. **自定义 Hooks**：抽离通用逻辑，代码复用性高
5. **性能优化**：React.memo、useMemo、useCallback、懒加载、虚拟列表
6. **代码分割**：路由懒加载，减少首屏加载时间
7. **错误边界**：Error Boundary 捕获组件渲染错误

### 业务亮点

1. **完整电商流程**：从浏览商品到下单支付的完整闭环
2. **多端适配**：响应式设计，PC 端和移动端都有良好体验
3. **状态管理**：购物车、用户信息等全局状态统一管理
4. **表单验证**：完善的表单验证和错误提示
5. **支付模拟**：完整的支付流程模拟
6. **搜索功能**：搜索历史、热门搜索、搜索建议

### 工程化亮点

1. **项目结构清晰**：按功能模块组织代码，便于维护
2. **代码规范**：ESLint + Prettier 保证代码质量
3. **Git 规范**：Conventional Commits 提交规范
4. **环境配置**：开发、测试、生产多环境配置
5. **Mock 数据**：前端可独立开发，不依赖后端
6. **单元测试**：Jest + React Testing Library（可选）

## 项目结构

```
react-shop/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── api/                    # 接口请求
│   │   ├── request.js         # Axios 封装
│   │   ├── product.js         # 商品相关接口
│   │   ├── cart.js            # 购物车接口
│   │   ├── order.js           # 订单接口
│   │   ├── user.js            # 用户接口
│   │   └── ...
│   ├── assets/                 # 静态资源
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/            # 全局样式
│   │       ├── index.scss
│   │       ├── variables.scss
│   │       └── mixins.scss
│   ├── components/             # 公共组件
│   │   ├── common/            # 通用组件
│   │   │   ├── Header/        # 头部导航
│   │   │   ├── Footer/        # 底部
│   │   │   ├── ProductCard/   # 商品卡片
│   │   │   ├── Carousel/      # 轮播图
│   │   │   ├── Pagination/    # 分页
│   │   │   ├── Empty/         # 空状态
│   │   │   └── ...
│   │   └── business/          # 业务组件
│   ├── hooks/                  # 自定义 Hooks
│   │   ├── useCart.js         # 购物车逻辑
│   │   ├── usePagination.js   # 分页逻辑
│   │   ├── useDebounce.js     # 防抖
│   │   ├── useInfiniteScroll.js  # 无限滚动
│   │   └── ...
│   ├── layouts/                # 布局组件
│   │   ├── MainLayout.jsx     # 主布局
│   │   ├── AdminLayout.jsx    # 后台布局
│   │   └── BlankLayout.jsx    # 空白布局
│   ├── pages/                  # 页面
│   │   ├── home/              # 首页
│   │   ├── category/          # 分类页
│   │   ├── product/           # 商品详情
│   │   ├── cart/              # 购物车
│   │   ├── order/             # 订单相关
│   │   ├── user/              # 用户中心
│   │   ├── search/            # 搜索页
│   │   ├── login/             # 登录注册
│   │   └── admin/             # 管理后台
│   │       ├── dashboard/
│   │       ├── product/
│   │       ├── order/
│   │       └── ...
│   ├── router/                 # 路由配置
│   │   ├── index.js
│   │   └── modules/
│   ├── store/                  # Redux 状态管理
│   │   ├── index.js
│   │   └── modules/
│   │       ├── user.js        # 用户状态
│   │       ├── cart.js        # 购物车状态
│   │       ├── product.js     # 商品状态
│   │       └── app.js         # 应用状态
│   ├── utils/                  # 工具函数
│   │   ├── storage.js         # 本地存储
│   │   ├── validate.js        # 验证工具
│   │   ├── format.js          # 格式化工具
│   │   ├── auth.js            # 权限工具
│   │   └── ...
│   ├── mock/                   # Mock 数据（可选）
│   │   ├── index.js
│   │   ├── product.js
│   │   └── ...
│   ├── App.jsx
│   └── main.jsx
├── .env.development
├── .env.production
├── vite.config.js              # 或 webpack.config.js
└── package.json
```

## 核心功能实现

### Redux Toolkit 购物车状态管理

```javascript
// store/modules/cart.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getCartList, addToCart, updateCart, deleteCart } from '@/api/cart'

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const res = await getCartList()
  return res.data
})

export const addItemToCart = createAsyncThunk(
  'cart/addItem',
  async (goods, { dispatch, rejectWithValue }) => {
    try {
      await addToCart(goods)
      dispatch(fetchCart())
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalPrice: 0,
    totalCount: 0,
    selectedIds: [],
    loading: false
  },
  reducers: {
    toggleSelect: (state, action) => {
      const id = action.payload
      const index = state.selectedIds.indexOf(id)
      if (index > -1) {
        state.selectedIds.splice(index, 1)
      } else {
        state.selectedIds.push(id)
      }
    },
    toggleSelectAll: (state, action) => {
      if (action.payload) {
        state.selectedIds = state.items.map(item => item.id)
      } else {
        state.selectedIds = []
      }
    },
    updateQuantity: (state, action) => {
      const { id, count } = action.payload
      const item = state.items.find(item => item.id === id)
      if (item) {
        item.count = count
      }
    },
    clearCart: state => {
      state.items = []
      state.selectedIds = []
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCart.pending, state => {
        state.loading = true
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.list || action.payload || []
        state.totalCount = state.items.reduce((sum, item) => sum + item.count, 0)
        state.totalPrice = state.items.reduce(
          (sum, item) => sum + item.price * item.count,
          0
        )
      })
      .addCase(fetchCart.rejected, state => {
        state.loading = false
      })
  }
})

export const { toggleSelect, toggleSelectAll, updateQuantity, clearCart } =
  cartSlice.actions

export default cartSlice.reducer
```

### Axios 请求封装

```javascript
// utils/request.js
import axios from 'axios'
import { message } from 'antd'
import store from '@/store'
import { logout } from '@/store/modules/user'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000
})

service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    
    if (res.code !== 200) {
      message.error(res.message || '请求失败')
      
      if (res.code === 401) {
        store.dispatch(logout())
        window.location.href = '/login'
      }
      
      return Promise.reject(new Error(res.message || 'Error'))
    }
    
    return res
  },
  error => {
    let messageText = error.message
    
    if (error.response) {
      switch (error.response.status) {
        case 404:
          messageText = '请求的资源不存在'
          break
        case 500:
          messageText = '服务器内部错误'
          break
        case 503:
          messageText = '服务不可用'
          break
        default:
          messageText = error.response.data?.message || `请求错误(${error.response.status})`
      }
    }
    
    message.error(messageText)
    return Promise.reject(error)
  }
)

export default service
```

### 自定义 Hook - 防抖搜索

```javascript
// hooks/useDebounce.js
import { useState, useEffect } from 'react'

function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce

// 使用示例
// const [searchText, setSearchText] = useState('')
// const debouncedSearchText = useDebounce(searchText, 500)
// useEffect(() => {
//   if (debouncedSearchText) {
//     // 执行搜索
//   }
// }, [debouncedSearchText])
```

### 商品卡片组件

```jsx
// components/common/ProductCard/index.jsx
import React from 'react'
import { Card, Button, Tag } from 'antd'
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addItemToCart } from '@/store/modules/cart'
import styles from './index.module.scss'

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleGoDetail = () => {
    navigate(`/product/${product.id}`)
  }

  const handleAddCart = e => {
    e.stopPropagation()
    dispatch(addItemToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      count: 1
    }))
  }

  return (
    <Card hoverable className={styles.card} onClick={handleGoDetail}>
      <div className={styles.imageWrap}>
        <img src={product.image} alt={product.name} className={styles.image} />
        {product.tag && (
          <Tag color="red" className={styles.tag}>
            {product.tag}
          </Tag>
        )}
      </div>
      <Card.Meta
        title={<div className={styles.title}>{product.name}</div>}
        description={
          <div className={styles.priceWrap}>
            <span className={styles.price}>¥{product.price}</span>
            <span className={styles.sales}>已售 {product.sales}</span>
          </div>
        }
      />
      <div className={styles.actions}>
        <Button type="text" icon={<HeartOutlined />} />
        <Button
          type="primary"
          size="small"
          icon={<ShoppingCartOutlined />}
          onClick={handleAddCart}
        >
          加入购物车
        </Button>
      </div>
    </Card>
  )
}

export default React.memo(ProductCard)
```

## 快速开始

### 环境要求

- Node.js >= 14.18.0
- npm >= 6.0.0

### 安装依赖

```bash
npm install
# 或
yarn
# 或
pnpm install
```

### 启动开发服务器

```bash
npm run dev
# 或
npm start
```

### 生产构建

```bash
npm run build
```

### 代码检查

```bash
npm run lint
npm run lint:fix
```

### 运行测试

```bash
npm run test
```

## 性能优化建议

### 1. 代码分割

```javascript
// 路由懒加载
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('@/pages/home'))
const Product = lazy(() => import('@/pages/product'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
      </Routes>
    </Suspense>
  )
}
```

### 2. 列表虚拟滚动

大数据量列表使用虚拟滚动，只渲染可视区域内的元素。

推荐使用 `react-window` 或 `react-virtuoso`。

### 3. 图片优化

- 使用 WebP 格式图片
- 图片懒加载
- 响应式图片（不同分辨率加载不同尺寸）
- 图片 CDN 加速

### 4. 组件优化

- 使用 `React.memo` 避免不必要的重渲染
- 使用 `useMemo` 缓存计算结果
- 使用 `useCallback` 缓存函数引用
- 合理拆分组件，避免大组件

### 5. 数据缓存

使用 React Query 或 SWR 管理服务端状态，自动缓存和重新获取数据。

## 部署到 Hexo 博客

### 第一步：配置 base 路径

```javascript
// vite.config.js
export default defineConfig({
  base: '/demos/react-shop/',
  // ...
})
```

### 第二步：打包

```bash
npm run build
```

### 第三步：复制文件

将 `dist` 目录下的所有文件复制到 Hexo 博客的 `source/demos/react-shop/` 目录。

### 第四步：部署

```bash
hexo clean && hexo g && hexo d
```

### 第五步：访问

```plaintext
https://xumin8888.github.io/demos/react-shop/
```

## 开发心得与总结

通过开发这个 React 电商项目，我系统地掌握了 React 技术栈的核心知识，积累了丰富的大型项目开发经验。

### 技术收获

1. **React 深入理解**：Hooks、状态管理、生命周期、性能优化
2. **Redux 状态管理**：复杂应用的状态管理方案
3. **组件设计**：如何设计可复用、可维护的组件
4. **路由管理**：复杂路由配置、路由守卫、权限控制
5. **性能优化**：从代码层面到架构层面的性能优化手段

### 项目经验

1. **需求分析**：电商业务的理解和需求拆解
2. **架构设计**：项目结构设计、技术选型
3. **团队协作**：Git 工作流、代码规范、代码审查
4. **问题排查**：调试技巧、错误处理、性能分析

### 后续优化方向

1. 添加 TypeScript 支持
2. 服务端渲染（SSR）提升 SEO 和首屏速度
3. 微前端架构改造
4. 添加单元测试和 E2E 测试
5. PWA 支持，离线也能访问
6. 更多营销玩法（拼团、砍价、秒杀等）

---

React 电商项目是前端开发者进阶的必经之路。通过这个项目的实战，你将全面提升 React 开发能力，掌握复杂应用的架构设计和性能优化技巧。希望这个项目能成为你前端路上的重要里程碑！
