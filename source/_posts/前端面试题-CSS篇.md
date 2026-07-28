---
title: 前端面试题 - CSS 篇
date: 2024-01-16 10:00:00
categories:
  - 面试专题
tags:
  - 面试
  - 笔试
  - 前端
top_img: /img/bj.jpg
cover: /img/3.jpg---

## 一、盒模型

### 1. 盒模型有哪两种？

- **标准盒模型**（content-box）：width = content
- **IE 盒模型**（border-box）：width = content + padding + border

### 2. 如何切换盒模型？

```css
box-sizing: content-box; /* 标准盒模型，默认 */
box-sizing: border-box;  /* IE盒模型 */
```

---

## 二、Flex 布局

### 1. 常用属性有哪些？

**容器属性：**
- `flex-direction`：主轴方向
- `justify-content`：主轴对齐方式
- `align-items`：交叉轴对齐方式
- `flex-wrap`：是否换行
- `gap`：间距

**子元素属性：**
- `flex`：flex-grow + flex-shrink + flex-basis
- `align-self`：单独对齐
- `order`：顺序

---

## 三、BFC

### 1. 什么是 BFC？

BFC（Block Formatting Context）块级格式化上下文，是一个独立的渲染区域，内部元素不会影响外部元素。

### 2. 如何触发 BFC？

- `float: left/right`
- `position: absolute/fixed`
- `display: inline-block/table-cell/flex`
- `overflow: hidden/auto/scroll`

### 3. BFC 的作用？

- 清除浮动
- 防止 margin 重叠
- 自适应两栏布局

---

## 四、居中方案

### 水平垂直居中的方法

1. **Flex 布局**（最推荐）
```css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

2. **Grid 布局**
```css
.parent {
  display: grid;
  place-items: center;
}
```

3. **绝对定位 + transform**
```css
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

4. **绝对定位 + margin auto**
```css
.child {
  position: absolute;
  top: 0; bottom: 0; left: 0; right: 0;
  margin: auto;
}
```

5. **table-cell 布局**
```css
.parent {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
```

---

## 五、定位方式

### 1. position 有哪些取值？

| 值 | 说明 | 相对于谁定位 | 是否脱离文档流 |
|----|------|-------------|--------------|
| static | 默认值，正常文档流 | - | ❌ 不脱离 |
| relative | 相对定位 | 自身原来的位置 | ❌ 不脱离 |
| absolute | 绝对定位 | 最近的非 static 定位祖先 | ✅ 脱离 |
| fixed | 固定定位 | 视口（viewport） | ✅ 脱离 |
| sticky | 粘性定位 | 最近的滚动祖先 | ❌ 不脱离 |

### 2. sticky 定位的理解？

sticky 是 relative 和 fixed 的结合体：
- 元素在跨越特定阈值前为相对定位
- 跨越阈值后为固定定位

```css
.element {
  position: sticky;
  top: 10px; /* 距离顶部 10px 时吸顶 */
}
```

**使用条件：**
- 父元素不能有 overflow: hidden 或 overflow: auto
- 必须指定 top、bottom、left、right 中的一个
- 父元素高度必须大于 sticky 元素高度

---

## 六、CSS 选择器

### 1. 选择器优先级？

优先级从高到低：
1. **!important**（最高，但不推荐滥用）
2. **行内样式**（style=""）
3. **ID 选择器**（#id）
4. **类选择器 / 属性选择器 / 伪类**（.class、[attr]、:hover）
5. **标签选择器 / 伪元素**（div、::before）
6. **通配符 / 继承**（*、继承来的）

**计算规则：**
- 优先级可以用 4 个数字表示：0,0,0,0
- 从左到右分别是：行内、ID、类/属性/伪类、标签/伪元素
- 同级比较，数量多的优先级高
- 优先级相同，后面的覆盖前面的

### 2. 常见的伪类和伪元素？

**伪类（单冒号 :）：**
- :hover、:active、:focus、:visited
- :first-child、:last-child、:nth-child(n)
- :first-of-type、:last-of-type
- :not(selector)、:checked、:disabled

**伪元素（双冒号 ::）：**
- ::before、::after
- ::first-letter、::first-line
- ::selection、::placeholder

---

## 七、CSS 盒模型进阶

### 1. margin 重叠问题？

**什么是 margin 重叠？**
相邻的两个或多个盒子的外边距会合并成一个外边距，叫做 margin 重叠。

**发生重叠的条件：**
- 都是普通流中的块级元素
- 在同一个 BFC 中
- 垂直方向上相邻

**重叠的几种情况：**
1. **相邻兄弟元素重叠**
2. **父元素和第一个/最后一个子元素重叠**
3. **空块级元素自身重叠**

**如何解决？**
- 触发 BFC
- 使用 padding 代替 margin
- 给父元素加 border
- 使用 flex 布局

### 2. 包含块（containing block）？

元素的尺寸和位置是相对于包含块计算的。

**如何确定包含块？**
- static / relative：最近的块级祖先元素
- absolute：最近的非 static 定位祖先
- fixed：视口（viewport）

---

## 八、Flex 布局进阶

### 1. flex 各属性详解？

**flex-grow：**
- 定义项目的放大比例
- 默认值 0，即有剩余空间也不放大
- 所有项目 flex-grow 都为 1，则等分剩余空间

**flex-shrink：**
- 定义项目的缩小比例
- 默认值 1，即空间不足时该项目将缩小
- 为 0 时不缩小

**flex-basis：**
- 定义项目在分配多余空间之前的初始大小
- 默认值 auto，即项目本来的大小

**flex 简写：**
- `flex: 1` 等价于 `flex: 1 1 0%`
- `flex: auto` 等价于 `flex: 1 1 auto`
- `flex: none` 等价于 `flex: 0 0 auto`

---

## 九、响应式设计

### 1. 响应式布局的实现方式？

**媒体查询（Media Queries）：**
```css
@media screen and (max-width: 768px) {
  /* 移动端样式 */
}
```

**百分比布局：**
- 宽度用百分比，高度通常固定

**rem / em 布局：**
- rem 相对于根元素的 font-size
- em 相对于父元素的 font-size
- 配合 JS 动态设置根元素 font-size 实现移动端适配

**vw / vh 布局：**
- vw：视口宽度的 1%
- vh：视口高度的 1%
- 100vw = 视口宽度，100vh = 视口高度

**Flex / Grid 布局：**
- 本身就具有一定的响应式特性

### 2. 移动端适配方案？

**viewport 设置：**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

**常见方案：**
1. **rem + flex.js**：通过 JS 动态设置 html 的 font-size
2. **vw/vh**：直接使用视口单位
3. **Flex 布局**：弹性布局适配
4. **响应式媒体查询**：针对不同屏幕写不同样式

---

## 十、CSS 性能优化

### 1. CSS 性能优化手段？

**选择器优化：**
- 避免使用通配符 *
- 避免使用标签选择器嵌套过深
- 优先使用 class 选择器
- 减少层级嵌套（建议不超过 3 层）

**渲染性能：**
- 避免使用 @import，用 link 代替
- 压缩 CSS 文件
- 提取关键 CSS，内联到 head 中
- 使用 CSS 雪碧图（Sprite）
- 字体图标代替图片图标
- 避免在 CSS 中使用表达式（expression）

**重排重绘优化：**
- 用 transform 做动画（走合成层，不触发重排）
- 用 opacity 做动画（走合成层）
- 避免频繁修改样式
- 批量修改样式（使用 class 切换）

---

## 十一、CSS 动画

### 1. transition 和 animation 的区别？

| 特性 | transition | animation |
|------|-----------|-----------|
| 触发方式 | 需要事件触发（hover、click等） | 自动执行 |
| 关键帧 | 只有开始和结束两帧 | 可以定义多个关键帧 |
| 循环 | 只能执行一次 | 可以循环播放 |
| 控制 | 简单过渡 | 更精细的控制 |

### 2. 关键帧动画？

```css
@keyframes slideIn {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.element {
  animation: slideIn 0.5s ease forwards;
}
```

**animation 属性简写：**
```css
animation: name duration timing-function delay iteration-count direction fill-mode play-state;
```
