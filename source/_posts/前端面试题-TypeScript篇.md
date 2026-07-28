---
title: 前端面试题 - TypeScript 篇
date: 2026-07-20 10:00:00
categories:
  - 面试专题
tags:
  - 面试
  - 笔试
  - TypeScript
  - 前端
top_img: /img/bj.jpg
cover: /img/1.jpg
---

## 一、TypeScript 基础

### 1. TypeScript 是什么？

TypeScript 是 JavaScript 的超集，在 JavaScript 的基础上添加了静态类型系统。

**主要特点：**
- 静态类型检查：编译时检查类型错误
- 类型推断：可以自动推断变量类型
- 接口和泛型：支持更复杂的类型定义
- 支持 ES6+ 新特性
- 编译成 JavaScript 运行

**为什么使用 TypeScript：**
- 代码更可靠，编译时就能发现错误
- 更好的开发体验，智能提示更准确
- 更好的可维护性，类型就是文档
- 适合大型项目和团队协作

### 2. TypeScript 和 JavaScript 的区别？

| 特性 | JavaScript | TypeScript |
|------|-----------|------------|
| 类型系统 | 动态类型，运行时检查 | 静态类型，编译时检查 |
| 报错时机 | 运行时报错 | 编译时报错 |
| 接口 | 不支持 | 支持 |
| 泛型 | 不支持 | 支持 |
| 开发体验 | 一般 | 更好，智能提示强 |
| 学习成本 | 低 | 稍高 |
| 运行环境 | 浏览器/Node.js 直接运行 | 需要编译成 JS |

### 3. TypeScript 的基础类型？

**基本类型：**
```typescript
// 字符串
let str: string = 'hello'

// 数字
let num: number = 123

// 布尔值
let bool: boolean = true

// undefined
let u: undefined = undefined

// null
let n: null = null

// Symbol
let sym: symbol = Symbol('key')

// BigInt
let big: bigint = 100n
```

**数组和元组：**
```typescript
// 数组
let arr1: number[] = [1, 2, 3]
let arr2: Array<number> = [1, 2, 3]

// 元组：固定长度和类型的数组
let tuple: [string, number] = ['hello', 123]
```

**枚举：**
```typescript
enum Color {
  Red,    // 0
  Green,  // 1
  Blue    // 2
}

// 字符串枚举
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT'
}
```

**其他类型：**
```typescript
// any：任意类型，不进行类型检查
let anyVal: any = 'anything'
anyVal = 123
anyVal = true

// unknown：未知类型，比 any 更安全
let unknownVal: unknown = 'hello'
// 使用前需要类型断言或类型守卫

// void：没有返回值
function fn(): void {
  console.log('no return')
}

// never：永远不会有返回值
function error(): never {
  throw new Error('error')
}

// object：非原始类型
let obj: object = { name: '张三' }
```

---

## 二、接口 Interface

### 1. 接口是什么？

接口是 TypeScript 中用来定义对象形状的契约，描述对象应该有哪些属性和方法。

**基本使用：**
```typescript
interface Person {
  name: string
  age: number
}

const person: Person = {
  name: '张三',
  age: 18
}
```

### 2. 接口的可选属性和只读属性？

**可选属性：**
```typescript
interface Person {
  name: string
  age?: number  // 可选属性
}

const p1: Person = { name: '张三' }  // age 可以没有
const p2: Person = { name: '李四', age: 20 }
```

**只读属性：**
```typescript
interface Person {
  readonly id: number  // 只读属性
  name: string
}

const p: Person = { id: 1, name: '张三' }
p.name = '李四'  // ✅ 可以修改
p.id = 2         // ❌ 不能修改
```

### 3. 接口的索引签名？

当对象有不确定数量的属性时，可以使用索引签名。

```typescript
interface StringObject {
  [key: string]: string  // 任意字符串属性，值都是字符串
}

const obj: StringObject = {
  name: '张三',
  address: '北京'
  // 可以添加任意字符串属性
}

// 数字索引
interface NumberArray {
  [index: number]: number
}

const arr: NumberArray = [1, 2, 3]
```

### 4. 接口的继承？

接口可以继承其他接口，实现代码复用。

```typescript
interface Animal {
  name: string
  eat(): void
}

interface Dog extends Animal {
  bark(): void
}

const dog: Dog = {
  name: '旺财',
  eat() { console.log('吃骨头') },
  bark() { console.log('汪汪汪') }
}

// 多继承
interface A { a: number }
interface B { b: number }
interface C extends A, B { c: number }
```

### 5. 接口和 type 的区别？

| 特性 | interface | type |
|------|-----------|------|
| 定义对象 | ✅ 主要用途 | ✅ 可以 |
| 定义联合类型 | ❌ 不可以 | ✅ 可以 |
| 定义交叉类型 | ❌ 不可以 | ✅ 可以 |
| 定义元组 | ❌ 不可以 | ✅ 可以 |
| 声明合并 | ✅ 支持 | ❌ 不支持 |
| 继承方式 | extends | & 交叉类型 |
| 适用场景 | 对象形状、类实现 | 复杂类型、联合类型 |

**type 的其他用法：**
```typescript
// 联合类型
type Status = 'success' | 'error' | 'loading'

// 交叉类型
type A = { a: number }
type B = { b: number }
type C = A & B

// 元组
type Tuple = [string, number]

// 函数类型
type Fn = (a: number, b: number) => number
```

---

## 三、函数类型

### 1. 函数的类型定义？

**函数声明：**
```typescript
function add(a: number, b: number): number {
  return a + b
}
```

**函数表达式：**
```typescript
const add = function(a: number, b: number): number {
  return a + b
}

// 箭头函数
const add = (a: number, b: number): number => a + b
```

**用接口定义函数类型：**
```typescript
interface AddFn {
  (a: number, b: number): number
}

const add: AddFn = (a, b) => a + b
```

### 2. 可选参数和默认参数？

**可选参数：**
```typescript
function fn(a: number, b?: number) {
  // b 是可选的
}

fn(1)
fn(1, 2)
```

**默认参数：**
```typescript
function fn(a: number, b: number = 10) {
  return a + b
}

fn(5)      // 15
fn(5, 20)  // 25
```

### 3. 剩余参数？

```typescript
function sum(...args: number[]): number {
  return args.reduce((a, b) => a + b, 0)
}

sum(1, 2, 3)  // 6
```

### 4. 函数重载？

函数重载是指同一个函数可以有不同的参数类型和返回值类型。

```typescript
function add(a: number, b: number): number
function add(a: string, b: string): string
function add(a: any, b: any): any {
  return a + b
}

add(1, 2)      // 3，number 类型
add('a', 'b')  // 'ab'，string 类型
```

---

## 四、泛型

### 1. 泛型是什么？

泛型是指在定义函数、接口或类的时候，不预先指定具体类型，而在使用的时候再指定类型的一种特性。

**为什么用泛型：**
- 提高代码复用性
- 保持类型安全
- 灵活约束类型

### 2. 泛型函数？

```typescript
function identity<T>(arg: T): T {
  return arg
}

// 使用方式1：指定类型
identity<string>('hello')

// 使用方式2：类型推断
identity('hello')  // 自动推断 T 为 string
```

**多个类型参数：**
```typescript
function swap<A, B>(tuple: [A, B]): [B, A] {
  return [tuple[1], tuple[0]]
}

swap(['hello', 123])  // [123, 'hello']
```

### 3. 泛型接口？

```typescript
interface IdentityFn {
  <T>(arg: T): T
}

const identity: IdentityFn = (arg) => arg

// 接口定义时指定泛型参数
interface GenericIdentity<T> {
  (arg: T): T
}

const stringIdentity: GenericIdentity<string> = (arg) => arg
```

### 4. 泛型类？

```typescript
class NumberId {
  value!: number
  add!: (x: number, y: number) => number
}

// 泛型类
class GenericNumber<T> {
  value!: T
  add!: (x: T, y: T) => T
}

const myNum = new GenericNumber<number>()
myNum.value = 10
```

### 5. 泛型约束？

使用 `extends` 关键字来约束泛型的类型范围。

```typescript
interface Lengthwise {
  length: number
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)  // 有 length 属性
  return arg
}

loggingIdentity('hello')  // ✅ 字符串有 length
loggingIdentity([1, 2])   // ✅ 数组有 length
loggingIdentity(123)      // ❌ 数字没有 length
```

### 6. 常用工具类型？

TypeScript 内置了很多实用的工具类型：

**Partial：** 所有属性变为可选
```typescript
interface Person {
  name: string
  age: number
}

type PartialPerson = Partial<Person>
// { name?: string; age?: number }
```

**Required：** 所有属性变为必选
```typescript
type RequiredPerson = Required<PartialPerson>
// { name: string; age: number }
```

**Readonly：** 所有属性变为只读
```typescript
type ReadonlyPerson = Readonly<Person>
// { readonly name: string; readonly age: number }
```

**Pick：** 选择部分属性
```typescript
type NameOnly = Pick<Person, 'name'>
// { name: string }
```

**Omit：** 排除部分属性
```typescript
type WithoutAge = Omit<Person, 'age'>
// { name: string }
```

**Exclude：** 排除联合类型中的某些类型
```typescript
type T = Exclude<'a' | 'b' | 'c', 'a'>
// 'b' | 'c'
```

**Extract：** 提取联合类型中的某些类型
```typescript
type T = Extract<'a' | 'b' | 'c', 'a' | 'b'>
// 'a' | 'b'
```

**ReturnType：** 获取函数返回值类型
```typescript
type Fn = () => string
type T = ReturnType<Fn>
// string
```

**Parameters：** 获取函数参数类型
```typescript
type Fn = (a: number, b: string) => void
type T = Parameters<Fn>
// [number, string]
```

---

## 五、类与继承

### 1. 类的定义？

```typescript
class Person {
  name: string
  age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }

  sayHello(): void {
    console.log(`我是${this.name}，今年${this.age}岁`)
  }
}

const p = new Person('张三', 18)
p.sayHello()
```

### 2. 访问修饰符？

| 修饰符 | 说明 | 自身 | 子类 | 外部 |
|--------|------|------|------|------|
| public | 公有的 | ✅ | ✅ | ✅ |
| protected | 受保护的 | ✅ | ✅ | ❌ |
| private | 私有的 | ✅ | ❌ | ❌ |

```typescript
class Person {
  public name: string      // 公开的，默认
  protected age: number    // 受保护的，子类可以访问
  private idCard: string   // 私有的，只有自己能访问

  constructor(name: string, age: number, idCard: string) {
    this.name = name
    this.age = age
    this.idCard = idCard
  }
}

class Student extends Person {
  study() {
    console.log(this.name)    // ✅ public 可以访问
    console.log(this.age)     // ✅ protected 可以访问
    console.log(this.idCard)  // ❌ private 不能访问
  }
}
```

### 3. 类的继承？

```typescript
class Animal {
  name: string
  constructor(name: string) {
    this.name = name
  }
  eat() {
    console.log(`${this.name} 吃东西`)
  }
}

class Dog extends Animal {
  breed: string
  constructor(name: string, breed: string) {
    super(name)  // 调用父类构造函数
    this.breed = breed
  }
  bark() {
    console.log('汪汪汪')
  }
  // 重写父类方法
  eat() {
    super.eat()  // 调用父类方法
    console.log('吃骨头')
  }
}
```

### 4. 抽象类？

抽象类是不能被实例化的类，只能被继承。抽象方法必须在子类中实现。

```typescript
abstract class Animal {
  name: string
  constructor(name: string) {
    this.name = name
  }
  // 抽象方法，没有实现
  abstract eat(): void

  // 普通方法
  sleep() {
    console.log(`${this.name} 睡觉`)
  }
}

class Dog extends Animal {
  // 必须实现抽象方法
  eat() {
    console.log('吃骨头')
  }
}
```

### 5. 类实现接口？

类可以实现接口，必须实现接口中定义的所有属性和方法。

```typescript
interface Flyable {
  fly(): void
}

interface Swimmable {
  swim(): void
}

// 可以实现多个接口
class Duck implements Flyable, Swimmable {
  fly() {
    console.log('鸭子飞')
  }
  swim() {
    console.log('鸭子游泳')
  }
}
```

---

## 六、类型断言与类型守卫

### 1. 类型断言？

类型断言可以手动指定一个值的类型，告诉编译器"我知道这个值的类型"。

**语法：**
```typescript
// 方式1：尖括号语法
let someValue: any = 'hello'
let strLength: number = (<string>someValue).length

// 方式2：as 语法（推荐，JSX 中只能用这种）
let strLength2: number = (someValue as string).length
```

**注意：**
- 类型断言不是类型转换，不会影响运行时
- 不能滥用类型断言，会失去类型检查的意义

### 2. 类型守卫？

类型守卫是一种在运行时检查类型的方式，可以缩小类型范围。

**typeof 类型守卫：**
```typescript
function fn(value: string | number) {
  if (typeof value === 'string') {
    // 这里 value 是 string 类型
    console.log(value.length)
  } else {
    // 这里 value 是 number 类型
    console.log(value.toFixed())
  }
}
```

**instanceof 类型守卫：**
```typescript
class Dog { bark() {} }
class Cat { meow() {} }

function fn(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark()
  } else {
    animal.meow()
  }
}
```

**in 类型守卫：**
```typescript
interface Dog { bark(): void }
interface Cat { meow(): void }

function fn(animal: Dog | Cat) {
  if ('bark' in animal) {
    animal.bark()
  } else {
    animal.meow()
  }
}
```

**自定义类型守卫：**
```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function fn(value: unknown) {
  if (isString(value)) {
    // value 被收窄为 string 类型
    console.log(value.length)
  }
}
```

---

## 七、装饰器

### 1. 装饰器是什么？

装饰器是一种特殊类型的声明，它能够被附加到类声明、方法、属性或参数上，可以修改类的行为。

**注意：** 装饰器是一项实验性特性，需要在 tsconfig.json 中开启 `experimentalDecorators`。

### 2. 类装饰器？

```typescript
function sealed(constructor: Function) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}

@sealed
class Greeter {
  greeting: string
  constructor(message: string) {
    this.greeting = message
  }
  greet() {
    return "Hello, " + this.greeting
  }
}
```

### 3. 方法装饰器？

```typescript
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value
  }
}

class Greeter {
  greeting: string
  constructor(message: string) {
    this.greeting = message
  }

  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting
  }
}
```

### 4. 属性装饰器？

```typescript
function format(target: any, propertyKey: string) {
  let value: string
  
  const getter = () => value
  const setter = (newVal: string) => {
    value = newVal.toUpperCase()
  }

  Object.defineProperty(target, propertyKey, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true
  })
}

class Person {
  @format
  name!: string
}
```

---

## 八、配置与编译

### 1. tsconfig.json 常用配置？

```json
{
  "compilerOptions": {
    "target": "ES2020",           // 编译目标
    "module": "ESNext",            // 模块系统
    "lib": ["ES2020", "DOM"],     // 编译时包含的库
    "strict": true,                // 严格模式
    "noImplicitAny": true,         // 不允许隐式 any
    "strictNullChecks": true,      // 严格空检查
    "esModuleInterop": true,       // ES 模块互操作
    "moduleResolution": "node",    // 模块解析方式
    "outDir": "./dist",            // 输出目录
    "rootDir": "./src",            // 源码目录
    "sourceMap": true,             // 生成 sourceMap
    "declaration": true,           // 生成声明文件
    "experimentalDecorators": true // 启用装饰器
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 2. 类型声明文件？

类型声明文件（.d.ts）用来为 JavaScript 代码提供类型声明。

**常见场景：**
- 为第三方库提供类型声明
- 在项目中声明全局变量
- 声明模块

**示例：**
```typescript
// declare 声明全局变量
declare var jQuery: (selector: string) => any

// 声明模块
declare module '*.jpg' {
  const src: string
  export default src
}
```

---

## 九、TypeScript 进阶

### 1. 条件类型？

条件类型根据条件来选择类型。

```typescript
type IsString<T> = T extends string ? true : false

type A = IsString<string>  // true
type B = IsString<number>  // false
```

### 2. 映射类型？

映射类型可以基于已有类型创建新类型。

```typescript
// Readonly 的实现原理
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P]
}

// Partial 的实现原理
type MyPartial<T> = {
  [P in keyof T]?: T[P]
}
```

### 3. 模板字面量类型？

```typescript
type Greeting = `Hello, ${string}!`

type A = 'Hello, world!'  // 匹配 Greeting
type B = 'Hi, world!'     // 不匹配
```

### 4. 协变与逆变？

- **协变**：子类型可以赋值给父类型（比如函数返回值）
- **逆变**：父类型可以赋值给子类型（比如函数参数）

---

## 十、常见问题与最佳实践

### 1. any 和 unknown 的区别？

| 特性 | any | unknown |
|------|-----|---------|
| 任意类型赋值给它 | ✅ | ✅ |
| 它赋值给任意类型 | ✅ | ❌，需要类型断言 |
| 调用任意方法 | ✅ | ❌，需要先确定类型 |
| 安全性 | 低，会绕过类型检查 | 高，使用前必须确定类型 |

**推荐：** 优先使用 unknown 而不是 any，更安全。

### 2. interface 和 type 怎么选？

**优先使用 interface：**
- 定义对象的形状
- 需要被类实现
- 需要声明合并
- 继承关系比较多

**使用 type：**
- 定义联合类型、交叉类型
- 定义元组类型
- 定义函数类型
- 定义映射类型
- 需要复杂的类型操作

### 3. 如何处理第三方库的类型？

- 优先使用 @types 包（npm 上的类型声明包）
- 如果没有，自己写 .d.ts 声明文件
- 使用 declare module 声明模块

### 4. TypeScript 最佳实践？

- 尽量避免使用 any，用 unknown 代替
- 开启 strict 严格模式
- 善用类型推断，不要过度标注类型
- 使用接口和类型别名提高代码可读性
- 合理使用泛型，提高代码复用性
- 定期运行类型检查，及时修复类型错误
- 善用工具类型，减少重复类型定义

---

## 结语

TypeScript 已经成为前端开发的必备技能，掌握好 TypeScript 不仅能提高代码质量，还能提升开发效率。本文涵盖了 TypeScript 面试中的高频考点，建议结合实际项目多练习，深入理解类型系统的魅力。
