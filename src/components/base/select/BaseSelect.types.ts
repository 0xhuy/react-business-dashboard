export type BaseSelectOption<Value extends string = string> = {
  value: Value;
  label: string;
};

export type BaseSelectProps<Value extends string = string> = {
  height?: number | string;
  width?: number | string;
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  options: readonly BaseSelectOption<Value>[];
  value?: Value;
  disabled?: boolean;
  isRequired?: boolean;
  borderRadius?: number | string;
  onChange?: (option: BaseSelectOption<Value>) => void;
};
