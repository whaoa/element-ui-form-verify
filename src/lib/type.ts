import type { VueConstructor } from 'vue';

export interface ElFormItemConstructor extends VueConstructor {
  options: {
    methods: {
      getRules(): Array<Record<string, any>>;
      validate(trigger: string, callback?: (errorMessage: string) => void): void;
      clearValidate(): void;
    }
  };
}

export interface ValidateRuleValue<T> {
  order: number;
  trigger: string | string[];
  message: string;
  value: T;
}

export type AsyncValidateRule = Record<string, any>;

export type DescriptorCreateFunction<T> = (value: ValidateRuleValue<T>) => AsyncValidateRule[];

export type VerifyValidator = (rules: { getRule: (name: string) => AsyncValidateRule[] })
  => AsyncValidateRule[];
