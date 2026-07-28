---
title: CSS Flexbox 布局完全指南
date: 2026-01-20 10:00:00
categories:
  - 前端
tags:
  - CSS
  - 前端
  - 布局
top_img: /img/bj.jpg
cover: /img/9.jpg
---

## 前言

Flexbox（弹性盒子）是 CSS3 中的一种布局模式，让复杂的布局变得简单。本文将全面讲解 Flexbox 的所有属性和使用技巧。

## 一、基础概念

### 1.1 什么是 Flexbox

Flexbox 是 Flexible Box 的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。

### 1.2 基本概念

- **Flex 容器（flex container）**：设置了 `display: flex` 的元素
- **Flex 项目（flex item）**：容器的子元素
- **主轴（main axis）**：Flex 项目排列的方向
- **交叉轴（cross axis）**：垂直于主轴的方向

```
┌───────────────────────────────────┐
│  ┌─────┐ ┌─────┐ ┌─────┐         │
│  │  1  │ │  2  │ │  3  │         │
│  └─────┘ └─────┘ └─────┘         │
│         主轴 →                     │
└───────────────────────────────────┘
            ↑
            交叉轴
```

## 二、容器属性

### 2.1 display

```css
.container {
  display: flex; /* 或 inline-flex */
}
```

### 2.2 flex-direction：主轴方向

```css
.container {
  flex-direction: row;            /* 默认，水平方向，从左到右 */
  flex-direction: row-reverse;    /* 水平方向，从右到左 */
  flex-direction: column;         /* 垂直方向，从上到下 */
  flex-direction: column-reverse; /* 垂直方向，从下到上 */
}
```

### 2.3 flex-wrap：换行方式

```css
.container {
  flex-wrap: nowrap;       /* 默认，不换行 */
  flex-wrap: wrap;         /* 换行，从上到下 */
  flex-wrap: wrap-reverse; /* 换行，从下到上 */
}
```

### 2.4 flex-flow：简写

```css
.container {
  /* flex-direction + flex-wrap */
  flex-flow: row wrap;
}
```

### 2.5 justify-content：主轴对齐

```css
.container {
  justify-content: flex-start;    /* 默认，左对齐 */
  justify-content: flex-end;      /* 右对齐 */
  justify-content: center;        /* 居中 */
  justify-content: space-between; /* 两端对齐，间距相等 */
  justify-content: space-around;  /* 每个元素两侧间距相等 */
  justify-content: space-evenly;  /* 所有间距相等 */
}
```

**效果示意：**
```
flex-start:    [■■■□□□□□□]
flex-end:      [□□□□□□■■■]
center:        [□□□■■■□□□]
space-between: [■□□■□□■]
space-around:  [□■□□■□□■□]
space-evenly:  [□■□□■□□■□]  (间距完全相等)
```

### 2.6 align-items：交叉轴对齐

```css
.container {
  align-items: stretch;      /* 默认，拉伸填满容器 */
  align-items: flex-start;   /* 顶部对齐 */
  align-items: flex-end;     /* 底部对齐 */
  align-items: center;       /* 居中对齐 */
  align-items: baseline;     /* 基线对齐 */
}
```

### 2.7 align-content：多行对齐

```css
.container {
  align-content: stretch;      /* 默认，拉伸 */
  align-content: flex-start;   /* 顶部对齐 */
  align-content: flex-end;     /* 底部对齐 */
  align-content: center;       /* 居中 */
  align-content: space-between;/* 两端对齐 */
  align-content: space-around; /* 每行两侧间距相等 */
}
```

> 注意：只有一行时，`align-content` 不起作用。

## 三、项目属性

### 3.1 order：排列顺序

```css
.item {
  order: 0; /* 默认值为 0，数值越小越靠前 */
}

.item:nth-child(1) { order: 3; }
.item:nth-child(2) { order: 1; }
.item:nth-child(3) { order: 2; }
/* 显示顺序：2 3 1 */
```

### 3.2 flex-grow：放大比例

```css
.item {
  flex-grow: 0; /* 默认 0，不放大 */
}

/* 所有 item 都为 1，则平分剩余空间 */
.item { flex-grow: 1; }

/* 第一个占 2 份，其他占 1 份 */
.item:first-child { flex-grow: 2; }
```

### 3.3 flex-shrink：缩小比例

```css
.item {
  flex-shrink: 1; /* 默认 1，空间不足时缩小 */
}

/* 第一个不缩小 */
.item:first-child { flex-shrink: 0; }
```

### 3.4 flex-basis：基准大小

```css
.item {
  flex-basis: auto; /* 默认 auto，项目的本来大小 */
  flex-basis: 200px; /* 基准大小 200px */
}
```

### 3.5 flex：简写

```css
.item {
  /* flex-grow flex-shrink flex-basis */
  flex: 0 1 auto; /* 默认值 */
  flex: 1;        /* 1 1 0% */
  flex: auto;     /* 1 1 auto */
  flex: none;     /* 0 0 auto */
}
```

**常用值：**
- `flex: 1`：平分空间
- `flex: auto`：自动伸缩
- `flex: none`：不伸缩

### 3.6 align-self：单独对齐

```css
.item {
  align-self: auto;         /* 默认，继承父元素的 align-items */
  align-self: flex-start;   /* 顶部对齐 */
  align-self: flex-end;     /* 底部对齐 */
  align-self: center;       /* 居中 */
  align-self: baseline;     /* 基线对齐 */
  align-self: stretch;      /* 拉伸 */
}
```

## 四、常用布局示例

### 4.1 水平垂直居中

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### 4.2 两栏布局

```html
<div class="layout">
  <aside class="sidebar">侧边栏</aside>
  <main class="main">主内容</main>
</div>
```

```css
.layout {
  display: flex;
}

.sidebar {
  width: 200px;
  flex-shrink: 0; /* 不缩小 */
}

.main {
  flex: 1; /* 占满剩余空间 */
}
```

### 4.3 三栏布局

```html
<div class="layout">
  <aside class="left">左侧</aside>
  <main class="main">中间</main>
  <aside class="right">右侧</aside>
</div>
```

```css
.layout {
  display: flex;
}

.left, .right {
  width: 200px;
  flex-shrink: 0;
}

.main {
  flex: 1;
}
```

### 4.4 圣杯布局

```html
<div class="holy-grail">
  <header>头部</header>
  <div class="body">
    <nav>导航</nav>
    <main>内容</main>
    <aside>侧边栏</aside>
  </div>
  <footer>底部</footer>
</div>
```

```css
.holy-grail {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.holy-grail .body {
  display: flex;
  flex: 1;
}

.holy-grail main {
  flex: 1;
}

.holy-grail nav,
.holy-grail aside {
  width: 200px;
  flex-shrink: 0;
}
```

### 4.5 导航栏

```html
<nav class="navbar">
  <div class="logo">Logo</div>
  <ul class="menu">
    <li>首页</li>
    <li>产品</li>
    <li>关于</li>
  </ul>
  <div class="user">用户</div>
</nav>
```

```css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}

.menu {
  display: flex;
  gap: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
}
```

### 4.6 卡片列表

```html
<div class="card-list">
  <div class="card">卡片1</div>
  <div class="card">卡片2</div>
  <div class="card">卡片3</div>
  <div class="card">卡片4</div>
</div>
```

```css
.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  flex: 1 1 300px; /* 最小 300px，自动换行 */
  height: 200px;
  background: #f0f0f0;
  border-radius: 8px;
}
```

### 4.7 粘性页脚

```html
<div class="page">
  <header>头部</header>
  <main class="content">内容</main>
  <footer>底部</footer>
</div>
```

```css
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1; /* 内容区占满剩余空间，底部就粘在下面了 */
}
```

## 五、实战技巧

### 5.1 最后一个元素右对齐

```css
.menu {
  display: flex;
}

.menu li:last-child {
  margin-left: auto;
}
```

### 5.2 元素数量不固定时均匀分布

```css
.container {
  display: flex;
  justify-content: space-around;
}
```

### 5.3 文字超出省略

```css
.item {
  display: flex;
  align-items: center;
}

.item .text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### 5.4 自适应正方形

```css
.square {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
}

.square::before {
  content: '';
  padding-top: 100%;
  float: left;
}
```

## 六、兼容性

```css
.container {
  display: -webkit-box;   /* OLD - iOS 6-, Safari 3.1-6 */
  display: -moz-box;      /* OLD - Firefox 19- */
  display: -ms-flexbox;   /* TWEENER - IE 10 */
  display: -webkit-flex;  /* NEW - Chrome */
  display: flex;          /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
```

现在主流浏览器都支持 Flexbox，可以放心使用。

## 七、总结

**容器属性：**
- `flex-direction`：主轴方向
- `flex-wrap`：换行方式
- `flex-flow`：上面两个的简写
- `justify-content`：主轴对齐
- `align-items`：交叉轴对齐
- `align-content`：多行对齐

**项目属性：**
- `order`：排列顺序
- `flex-grow`：放大比例
- `flex-shrink`：缩小比例
- `flex-basis`：基准大小
- `flex`：上面三个的简写
- `align-self`：单独对齐

掌握 Flexbox，布局再也不是难事！
