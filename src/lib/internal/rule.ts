import type {
  DescriptorCreateFunction,
  AsyncValidateRule,
  ValidateRuleValue,
} from '../type';

interface CustomRule<T> {
  name: string;
  type?: any,
  descriptor: DescriptorCreateFunction<T>;
}

const rules: Record<string, CustomRule<any>> = {};

export function getAll(): Record<string, CustomRule<any>> {
  return rules;
}

export function add<T = any>(
  name: string,
  valueType: any,
  rulesCreator: DescriptorCreateFunction<T>,
) {
  if (!name || !rulesCreator) return;
  rules[name] = { name, type: valueType, descriptor: rulesCreator };
}

// 类型收窄 helper 函数
function isObjectValue<T>(value: unknown): value is { value: T, [key: string]: any } {
  return Object.prototype.toString.call(value).slice(8, -1) === 'Object';
}

// 序列化 校验规则生成函数 参数 为标准对象格式
export function serializePropValue<T = any>(value: T): ValidateRuleValue<T> {
  const result = {
    order: -1,
    trigger: 'change',
    message: '',
    value,
  };
  if (value === undefined || value === null) return result;

  if (isObjectValue<T>(value)) {
    if (typeof value.order === 'number') result.order = value.order;
    if (typeof value.message === 'string') result.message = value.message;
    if (typeof value.trigger === 'string') result.trigger = value.trigger;
    result.value = value.value;
  }

  return result;
}

// 获取已有校验规则
export function get(name: string): null | ((value?: any) => AsyncValidateRule[]) {
  const rule = rules[name];
  if (!rule) return null;

  return function (value: any): AsyncValidateRule[] {
    return rule.descriptor(serializePropValue(value));
  };
}
