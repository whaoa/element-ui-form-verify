import type { VueConstructor } from 'vue';
import type { ElFormItemConstructor } from './type';

import { add, get } from './internal/rule';
import extension from './internal/extension';

import addInternalRules from './rules';

const elFormItemComponentName = 'ElFormItem';
let ElFormItemComponent: ElFormItemConstructor | null = null;

const addRule: typeof add = function (name, valueType, rulesCreator) {
  if (!ElFormItemComponent) {
    throw new Error('please call Vue.use to install element-ui-form-verify first.');
  }
  if (!name || !rulesCreator) return;

  add(name, valueType, rulesCreator);

  const types = [Boolean, Object];
  if (!!valueType && !types.includes(valueType)) types.push(valueType);

  ElFormItemComponent.mixin({
    props: { [name]: { type: types, default: false } },
    watch: {
      [name](this: any) {
        if (!this.isVerifyMode) return;
        this.validate('');
      },
    },
  });
};

function install(Vue: VueConstructor) {
  ElFormItemComponent = Vue.component(elFormItemComponentName) as ElFormItemConstructor;
  if (!ElFormItemComponent) {
    throw new Error('please install element-ui form components first.');
  }
  ElFormItemComponent.mixin(extension(ElFormItemComponent));

  // 注册内部校验规则
  addInternalRules(addRule, get);
}

export default {
  install,
  addRule,
  getRule: get,
};
