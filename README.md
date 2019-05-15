# jquery 表单验证插件

## 如何使用

#### 第一步，引入 js 文件

```html
<script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
<script src="./jquery.formValidate.js"></script>
```

#### 第二步，表单中指定规则

只会对拥有 `lay-rules` 属性的表单项进行验证。

```html
<form>
  <input lay-rules="required|phone" />
</form>
```

#### 第三步，调用插件

```js
$("form").formValidate({
  // options 可配置选项
});
```

## 配置项

可配置选项：

| 参数          | 说明                                             | 类型     | 默认值              |
| ------------- | ------------------------------------------------ | -------- | ------------------- |
| trigger       | [触发校验的时机](#触发校验的时机)                | String   | submit              |
| validateFirst | 当某一规则校验不通过时，是否停止剩下的规则的校验 | Boolean  | false               |
| rules         | 自定义验证规则，详情见[校验规则](#校验规则)      | Object   | null                |
| handleTips    | 规则不通过时的回调函数                           | function |
| DANGER_CLASS  | 校验未通过的表单项添加的类名                     | String   | `layui-form-danger` |
| rulePropName  | 预设的规则属性                                   | String   | `lay-rules`         |

### 触发校验的时机

触发时机有以下几个选项：

+ submit：点击提交按钮
+ change：单复选框的改变，input/textarea 失去焦点都会触发，但是 input/textarea 的值发生变化不会触发
+ input: 当表单的值发生变化时
+ 以及其他表单事件

### 校验规则

同时支持多条规则的验证，格式：`lay-rules="验证A|验证B"`，规则之间用竖线隔开。例如：

```html
<input lay-rules="required|phone" />
```

内置校验规则：

| 参数     | 说明   |
| -------- | ------ |
| required | 必填项 |
| phone    | 手机号 |
| email    | 邮箱   |
| url      | 网址   |
| number   | 数字   |
| date     | 日期   |
| identity | 身份证 |

除了内置的校验规则，还可以自定义校验规则，校验规则有两种方式

- 数组：数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
- 函数：函数接收 value 和 dom 两个参数，value 表示当前表单项的值，dom 表示当前表单项 dom 对象
