---
title: TypeScript 高级类型详解：从入门到精通
date: 2026-03-01 14:20:00
categories:
  - 前端
tags:
  - TypeScript
  - 前端
top_img: /img/bj.jpg
cover: /img/4.jpg
---

## 前言

TypeScript 已经成为现代前端开发的标配。掌握 TypeScript 的高级类型，可以让你的代码更加类型安全、更具可维护性。本文将从基础到进阶，全面讲解 TypeScript 的高级类型用法。

## 一、基础类型回顾

```typescript
// 基本类型
let str: string = 'hello'
let num: number = 123
let bool: boolean = true
let arr: number[] = [1, 2, 3]
let arr2: Array<string> = ['a', 'b']

// 对象类型
interface User {
  name: string
  age: number
  email?: string // 可选属性
  readonly id: number // 只读属性
}

// 联合类型
let value: string | number
value = 'hello'
value = 123

// 交叉类型
type A = { a: string }
type B = { b: number }
type C = A & B // { a: string; b: number }
```

## 二、类型别名 vs 接口

### 2.1 类型别名（type）

```typescript
type StringOrNumber = string | number

type User = {
  name: string
  age: number
}

type Func = (x: number, y: number) => number
```

### 2.2 接口（interface）

```typescript
interface User {
  name: string
  age: number
}

interface User {
  email: string // 声明合并
}
```

### 2.3 如何选择

- **能用 interface 就用 interface**，因为它有更好的报错信息
- 需要联合类型、交叉类型、元组时用 type
- 需要声明合并时用 interface

## 三、泛型（Generics）

### 3.1 基本用法

```typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg
}

const result = identity<string>('hello')
const result2 = identity(123) // 类型推断
```

### 3.2 泛型约束

```typescript
interface Lengthwise {
  length: number
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)
  return arg
}

logLength('hello') // ✅
logLength([1, 2, 3]) // ✅
logLength({ length: 10 }) // ✅
```

### 3.3 泛型类

```typescript
class Stack<T> {
  private items: T[] = []
  
  push(item: T) {
    this.items.push(item)
  }
  
  pop(): T | undefined {
    return this.items.pop()
  }
}

const numberStack = new Stack<number>()
```

### 3.4 泛型工具类型

TypeScript 内置了很多实用的工具类型：

```typescript
// Partial：所有属性变为可选
type PartialUser = Partial<User>

// Required：所有属性变为必选
type RequiredUser = Required<User>

// Readonly：所有属性变为只读
type ReadonlyUser = Readonly<User>

// Pick：选取部分属性
type UserName = Pick<User, 'name' | 'age'>

// Omit：排除部分属性
type UserWithoutId = Omit<User, 'id'>

// Exclude：从联合类型中排除
type A = 'a' | 'b' | 'c'
type B = Exclude<A, 'a'> // 'b' | 'c'

// Extract：提取联合类型中交集
type C = Extract<A, 'a' | 'b'> // 'a' | 'b'

// ReturnType：获取函数返回值类型
type Func = () => string
type Result = ReturnType<Func> // string

// Parameters：获取函数参数类型
type Params = Parameters<(x: number, y: string) => void>
// [number, string]
```

## 四、条件类型

### 4.1 基本语法

```typescript
type IsString<T> = T extends string ? true : false

type A = IsString<string> // true
type B = IsString<number> // false
```

### 4.2 进阶用法

```typescript
// 提取数组元素类型
type Flatten<T> = T extends Array<infer U> ? U : T

type A = Flatten<string[]> // string
type B = Flatten<number> // number

// 获取函数返回类型（手动实现）
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never
```

### 4.3 分布式条件类型

当条件类型遇到联合类型时，会分发到每个类型上：

```typescript
type ToArray<T> = T extends any ? T[] : never

type A = ToArray<string | number>
// string[] | number[]
```

## 五、映射类型

### 5.1 基本用法

```typescript
// 把所有属性变成 string
type Stringify<T> = {
  [K in keyof T]: string
}

type User = { name: string; age: number }
type StringUser = Stringify<User>
// { name: string; age: string }
```

### 5.2 键重映射

```typescript
// 给所有属性加上 get 前缀
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

type User = { name: string; age: number }
type UserGetters = Getters<User>
// { getName: () => string; getAge: () => number }
```

## 六、模板字面量类型

```typescript
type Greeting = `Hello, ${string}!`

type HelloWorld = `Hello, World!` extends Greeting ? true : false // true

// 实战：CSS 属性
type CSSProperty = 'color' | 'font-size' | 'background'
type CSSValue = 'red' | '16px' | 'blue'
type CSSDeclaration = `${CSSProperty}: ${CSSValue}`
// "color: red" | "color: 16px" | "color: blue" | "font-size: red" | ...
```

## 七、类型体操实战

### 7.1 实现 DeepPartial

```typescript
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object 
    ? DeepPartial<T[K]> 
    : T[K]
}
```

### 7.2 实现 DeepReadonly

```typescript
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object 
    ? DeepReadonly<T[K]> 
    : T[K]
}
```

### 7.3 实现 TupleToUnion

```typescript
type TupleToUnion<T extends any[]> = T[number]

type A = TupleToUnion<['a', 'b', 'c']> // 'a' | 'b' | 'c'
```

### 7.4 实现 First

```typescript
type First<T extends any[]> = T extends [infer F, ...infer R] ? F : never

type A = First<[1, 2, 3]> // 1
```

## 八、实战场景

### 8.1 API 响应类型

```typescript
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface User {
  id: number
  name: string
  email: string
}

type UserResponse = ApiResponse<User>
type UserListResponse = ApiResponse<User[]>
```

### 8.2 事件处理类型

```typescript
type EventName = 'click' | 'hover' | 'scroll'

type EventHandler<T extends EventName> = 
  T extends 'click' ? (e: MouseEvent) => void :
  T extends 'hover' ? (e: MouseEvent) => void :
  T extends 'scroll' ? (e: Event) => void :
  never

function on<T extends EventName>(event: T, handler: EventHandler<T>) {
  // ...
}
```

## 九、常见误区

### 9.1 any vs unknown

- `any`：放弃类型检查，什么都能做
- `unknown`：类型安全的 any，使用前必须做类型检查

```typescript
let value: unknown

if (typeof value === 'string') {
  value.toUpperCase() // ✅
}
```

### 9.2 类型断言的正确使用

```typescript
// 尽量避免使用 as any
const el = document.getElementById('app') as HTMLDivElement

// 更好的方式：类型守卫
if (el instanceof HTMLDivElement) {
  el.innerText = 'hello'
}
```

## 十、总结

TypeScript 高级类型是前端进阶的必备技能：

1. **泛型**是复用类型的关键
2. **条件类型 + infer** 可以实现复杂的类型推导
3. **映射类型**可以批量转换属性
4. **模板字面量类型**让字符串类型也有强大的表达力
5. 善用**工具类型**，避免重复造轮子

掌握这些高级类型，你就能写出类型安全、可维护性高的代码了！
