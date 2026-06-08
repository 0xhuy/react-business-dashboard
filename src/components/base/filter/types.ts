// ===== Libs =====
import type { ReactNode } from "react";

// ===== Others =====
import type { IFilterValueChange } from "@/utils/interfaces";

// ===== Types =====
export type BaseFilterChildrenActions<T> = {
  isChecked?: { [K in keyof T]?: boolean };
  valueFilter: T;
  onChange: (data: IFilterValueChange<T>) => void;
  onCheckboxChange: (key: keyof T, checked: boolean) => void;
};

export type BaseFilterProps<T> = {
  widthBtn?: string | number;
  heightBtn?: string | number;
  valueFilter?: T;
  defaultValue: T;
  children: (actions: BaseFilterChildrenActions<T>) => ReactNode;
  onApply?: (appliedFilter: T) => void;
};
