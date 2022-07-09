import { add, get } from './internal/rule';

export default function addInternalRules(addRule: typeof add, getRule: typeof get) {
  // 内容长度
  addRule('length', Number, ({ value }: { value: number }) => [{
    validator(rule: any, val: string|any[], callback: (reason?: string) => void) {
      if ((val?.length || 0) === value) callback();
      else callback(`内容长度需要为${value}`);
    },
  }]);

  // 最小文本长度
  addRule('minLength', Number, ({ value }: { value: number }) => [{
    validator(rule: any, val: string | any[], callback: (reason?: string) => void) {
      if ((val?.length || 0) >= value) callback();
      else callback(`内容长度最小为${value}`);
    },
  }]);

  // 最大文本长度
  addRule('maxLength', Number, ({ value }: { value: number }) => [{
    validator(rule: any, val: string|any[], callback: (reason?: string) => void) {
      if ((val?.length || 0) <= value) callback();
      else callback(`内容长度最大为${value}`);
    },
  }]);

  // 数字
  addRule('number', null, () => [{
    validator(rule: any, value: string, callback: (err?: any) => void) {
      if (/^([-+])?\d+(\.\d+)?$/.test(value)) callback();
      else callback('请输入数字');
    },
  }]);

  // 最多小数位数
  addRule('maxDecimalLength', Number, ({ value }: { value: number }) => [
    ...(getRule('number')?.() || []),
    {
      validator(rule: any, val: string | number, callback: (reason?: string) => void) {
        const decimal = val.toString().split('.')[1];
        if (decimal && decimal.length > value) callback(`该输入项最多接受${value}位小数`);
        else callback();
      },
    },
  ]);

  // 整数类型
  addRule('int', null, () => [
    ...(getRule('number')?.() || []),
    {
      type: 'integer',
      transform: (v: string) => Number(v),
      message: '请输入整数',
    },
  ]);

  // gt
  addRule('gt', Number, ({ value }: { value: number }) => [
    ...(getRule('number')?.() || []),
    {
      validator(rule: any, val: number, callback: (reason?: string) => void) {
        if (val > value) callback();
        else callback('输入内容应大于' + value);
      },
    },
  ]);
  // gte
  addRule('gte', Number, ({ value }: { value: number }) => [
    ...(getRule('number')?.() || []),
    {
      type: 'number',
      min: value,
      transform: (v: string) => Number(v),
      message: '输入内容不能小于' + value,
    },
  ]);
  // lt
  addRule('lt', Number, ({ value }: { value: number }) => [
    ...(getRule('number')?.() || []),
    {
      validator(rule: any, val: number, callback: (reason?: string) => void) {
        if (val < value) callback();
        else callback('输入内容应小于' + value);
      },
    },
  ]);
  // lte
  addRule('lte', Number, ({ value }: { value: number }) => [
    ...(getRule('number')?.() || []),
    {
      type: 'number',
      max: value,
      transform: (v: string) => Number(v),
      message: '输入内容不能大于' + value,
    },
  ]);

  // 邮箱
  addRule('email', null, () => [
    { type: 'email', message: '请输入正确的邮箱' },
  ]);

  // 手机号
  addRule('phone', null, () => [
    { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
  ]);
}
