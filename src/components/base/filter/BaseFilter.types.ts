// ===== Libs =====
import type { ReactNode } from "react";

// ===== Types =====
export type FilterValueChange<T> = {
  [K in keyof T]: {
    index?: number;
    name: K;
    value: T[K];
  };
}[keyof T];

export type BaseFilterChildrenActions<T> = {
  isChecked?: { [K in keyof T]?: boolean };
  valueFilter: T;
  onChange: (data: FilterValueChange<T>) => void;
  onCheckboxChange: (key: keyof T, checked: boolean) => void;
};

export type BaseFilterProps<T> = {
  widthBtn?: string | number;
  heightBtn?: string | number;
  valueFilter?: T;
  defaultValue: T;
  children: (actions: BaseFilterChildrenActions<T>) => ReactNode;
  onApply?: (appliedFilter: T) => void;
  widthPanel?: number | string;
  isApplyDisabled?: (
    valueFilter: T,
    isChecked: { [K in keyof T]?: boolean },
  ) => boolean;
};
