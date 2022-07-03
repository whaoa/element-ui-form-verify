# element-ui-form-verify

一个更友好的 `Element-UI Form` 校验插件「基于 `Element-UI` 中 `ElFormItem` 组件进行非侵入式扩展包装」。

## 安装

```shell
yarn add @whaoa.w/element-ui-form-verify
```

```js
import Vue from 'vue';

import ElementUI from 'element-ui';
import ElementUIFormVerify from '@whaoa/element-ui-form-verify';

Vue.use(ElementUI);
// 必须在注册 ElForm 组件后进行注册
Vue.use(ElementUIFormVerify);
```

## 基本使用

仅在 `ElFormItem` 组件的标准用法上添加 *`verify` 属性* 及 *相应校验规则名称* 即可开启校验。

```vue

<template>
  <el-form ref="form" :model="form" label-width="100px">
    <!-- 必填 -->
    <el-form-item prop="text" label="文本" verify>
      <el-input v-model="form.text" placeholder="请输入文本"/>
    </el-form-item>
    <!-- 数字 -->
    <el-form-item prop="number" label="数字" verify number>
      <el-input v-model="form.number" placeholder="请输入数字"/>
    </el-form-item>
    <!-- 最小内容长度 -->
    <el-form-item prop="minLength" label="最小长度(2)" verify :min-length="2">
      <el-input v-model="form.minLength" placeholder="最小长度(2位)的内容"/>
    </el-form-item>
    <!-- 手机号 -->
    <el-form-item prop="phone" label="手机号" verify phone>
      <el-input v-model="form.phone" placeholder="请输入手机号"/>
    </el-form-item>
    <!-- 邮箱，非必填 -->
    <el-form-item prop="email" label="邮箱" verify email can-be-empty>
      <el-input v-model="form.email" placeholder="请输入邮箱"/>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        text: '',
        number: '',
        minLength: '',
        phone: '',
        email: '',
      },
    };
  },
};
</script>
```

### 自定义校验规则

插件支持两种自定义校验规则的方式：

1. 注册全局校验规则「如内置的 `number` 的规则」
2. 针对单个字段自定义校验规则

#### 注册全局校验规则

```js
import ElementUIFormVerify from '@whaoa.w/element-ui-form-verify';

Vue.use(ElementUIFormVerify);

// 必须在 use 后调用
ElementUIFormVerify.addRule(
  // 规则名称
  'maxLength',
  // 规则所接受的 Prop value 类型
  Number,
  // 规则生成函数，返回 AsyncValidator 所支持的规则数组，即 ElForm 原生支持的 rules prop
  function({ value }) {
    return [
      // 继承已有校验规则配置，getRule 返回包装后的校验规则生成函数
      // 可以传入参数，参数与在 vue 中在 el-form-item 组件上通过 prop 传入的数据格式
      ...ElementUIFormVerify.getRule('number')(),
      // 自定义校验规则
      { pattern: /^([-+])?\d+(\.\d+)?$/, message: '请输入数字' },
    ];
  },
);
```

#### 自定义单个字段校验规则

```vue

<template>
  <el-form ref="form" :model="form" label-width="100px">
    <el-form-item prop="word" label="英文字符" :verify="wordVerify">
      <el-input v-model="form.word" placeholder="请输入英文字符"/>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        word: '',
      },
    };
  },

  methods: {
    wordVerify({ getRule }) {
      return [
        // 可通过 getRule 函数获取已有校验规则
        // 第一个参数为规则名称，第二个参数为规则生成函数所接受的参数
        // 返回规则配置数据
        ...getRule('maxLength', 3),
        { pattern: /^[a-zA-Z]+$/, message: '请输入英文字符' },
      ]
    },
  },
};
</script>
```

## API

### ElFormItem Prop

| 参数名称          | 参数类型                                    | 描述                                                                                   |
|---------------|-----------------------------------------|--------------------------------------------------------------------------------------|
| verify        | boolean / function                      | 校验开关，值为 布尔值类型 时 控制是否开启字段校验，值为函数类型时用于自定义校验规则，此规则最后执行                                  |
| can-be-empty  | boolean                                 | 是否必填 ｜                                                                               |
| empty-message | string                                  | 空值提示文本                                                                               |
| error-message | string                                  | 校验未通过时提示文本，会覆盖规则内自定义的 message                                                        |
| [rule-name]   | any / { value?: any, message?: string } | 自定义校验规则，值为非对象类型时，会被转换为对象格式的 value 属性传入自定义校验规则生成函数，message 为自定义错误提示文本，会覆盖规则内的 message |
