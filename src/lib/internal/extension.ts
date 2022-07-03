import type { ComponentOptions } from 'vue';
import type { AsyncValidateRule, ElFormItemConstructor, VerifyValidator } from '../type';

import { get, getAll, serializePropValue } from './rule';

const defaultValidator: VerifyValidator = () => [];

export default function extension(ElFormItem: ElFormItemConstructor): ComponentOptions<any> {
  const reference = ElFormItem.options;

  return {
    props: {
      // 校验配置
      // - 值为 Truthy 时开启校验
      // - 值为函数时为自定义校验规则生成函数，返回 ElementUI 所支持的校验规则数组
      verify: { type: [Boolean, Function], default: false },
      // 是否可为空
      canBeEmpty: { type: Boolean, default: false },
      // 空值提示文本
      emptyMessage: { type: String, default: '请输入' },
      // 错误提示文本
      errorMessage: { type: String, default: '' },
    },

    computed: {
      // 自定义校验规则生成函数
      customValidator(): null | VerifyValidator {
        if (!this.verify) {
          return null;
        }
        return typeof this.verify === 'function' ? this.verify : defaultValidator;
      },
      // 是否为需要校验模式
      isVerifyMode() {
        return !!this.prop && !!this.customValidator !== null;
      },
    },

    methods: {
      // 获取所有校验规则
      // 用于对 ElFormItem 内部的 getRules 进行 override，从而实现对自定义校验规则的解析
      getRules() {
        // 非 verify 校验模式，返回原有 getRules method 执行结果，避免 ElementUI 组件内部出现错误
        if (!this.isVerifyMode) return reference.methods.getRules.call(this);

        const rules: AsyncValidateRule[] = [];

        // 当值为空时，仅添加默认的必填校验校验，根据 canBeEmpty 配置进行动态校验
        if (this.fieldValue === undefined || this.fieldValue === '') {
          rules.push({
            validator: (rule: any, val: any, callback: (reason?: any) => void) => {
              callback(this.canBeEmpty ? undefined : this.emptyMessage);
            },
          });
        } else {
          const customRules: Array<{ order: number; rules: AsyncValidateRule[] }> = [];

          const allRules = getAll();
          Object.keys(allRules).forEach((name) => {
            if (
              !(name in this.$props)
              || this.$props[name] === undefined
              || this.$props[name] === false
            ) return;

            // 序列化 prop value，转为统一的参数对象类型，用于传递 prop 所对应的规则生成函数
            const params = serializePropValue(this.$props[name]);
            const descriptor = allRules[name].descriptor(params);
            if (Array.isArray(descriptor)) {
              // 如果在 prop value 中指定了 message 活 trigger 则添加到生成的规则配置中
              descriptor.forEach((rule) => {
                if (params.message) rule.message = params.message;
                if (params.trigger) rule.trigger = params.trigger;
              });
              customRules.push({ order: params.order, rules: descriptor });
            }
          });

          // 按照 prop value 中的 sort 字段进行排序
          customRules
            .sort((a, b) => a.order - b.order)
            .forEach((rule) => {
              rules.push(...rule.rules);
            });

          // 如果设置了统一的 校验错误提示文本，则重置所有规则的提示文本
          if (this.errorMessage) {
            rules.forEach((rule) => {
              rule.message = this.errorMessage;
            });
          }
        }

        // 调用 自定义校验规则生成函数
        const customVerifyRules = this.customValidator({
          getRule(name: string, value?: any) {
            return get(name)?.(value) || [];
          },
        });
        if (Array.isArray(customVerifyRules)) rules.push(...customVerifyRules);

        // 当规则为空时，返回一个始终通过的规则来避免空检测错误无法清除
        if (rules.length === 0) {
          rules.push({
            validator(rule: any, val: any, callback: (reason?: string) => void) {
              callback();
            },
          });
        }

        // 用于使 ElFormItem 内部 isRequired 计算属性可以检测到存在必填规则，保证 * 符号可以正常显示
        if (rules.length > 0) {
          rules[0].required = !this.canBeEmpty;
        }

        return rules;
      },
    },
  };
}
