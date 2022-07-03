<template>
  <div id="app">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item prop="number" label="数字" verify number>
        <el-input v-model="form.number" placeholder="请输入数字"/>
      </el-form-item>
      <el-form-item prop="int" label="整数" verify int>
        <el-input v-model="form.int" placeholder="请输入整数"/>
      </el-form-item>
      <el-form-item prop="length" label="固定长度(3)" verify :length="3">
        <el-input v-model="form.length" placeholder="请输入固定长度(3位)的内容"/>
      </el-form-item>
      <el-form-item prop="maxLength" label="最大长度(5)" verify :max-length="5">
        <el-input v-model="form.maxLength" placeholder="最大长度(5位)的内容"/>
      </el-form-item>
      <el-form-item prop="minLength" label="最小长度(2)" verify :min-length="2">
        <el-input v-model="form.minLength" placeholder="最小长度(2位)的内容"/>
      </el-form-item>
      <el-form-item prop="phone" label="手机号" verify phone>
        <el-input v-model="form.phone" placeholder="请输入手机号"/>
      </el-form-item>
      <el-form-item prop="email" label="邮箱" verify email>
        <el-input v-model="form.email" placeholder="请输入邮箱"/>
      </el-form-item>
      <el-form-item prop="email" label="邮箱" verify :email="{ message: '邮箱格式错误' }">
        <el-input v-model="form.email" placeholder="请输入邮箱(自定义校验错误提示文本)"/>
      </el-form-item>
      <el-form-item prop="word" label="英文字符" :verify="wordVerify">
        <el-input v-model="form.word" placeholder="请输入英文字符"/>
      </el-form-item>
      <el-form-item prop="word" label="英文字符" :verify="wordVerify" can-be-empty>
        <el-input v-model="form.word" placeholder="请输入英文字符(非必填)"/>
      </el-form-item>
    </el-form>

    <el-button @click="validate">validate</el-button>
  </div>
</template>

<script>
export default {
  name: 'App',

  data() {
    return {
      form: {
        int: '',
        number: '',
        length: '',
        maxLength: '',
        minLength: '',
        email: '',
        phone: '',
        word: '',
      },
    };
  },

  methods: {
    wordVerify() {
      return [{ pattern: /^[a-zA-Z]+$/, message: '请输入英文字符' }];
    },

    validate() {
      this.$refs.form.validate();
    },
  },
};
</script>
