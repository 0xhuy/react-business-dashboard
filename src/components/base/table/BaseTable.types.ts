// ===== Libs =====
import type { ReactNode } from "react";

// ===== Others =====
import type { BaseTableEnum } from "@/utils/enum";

export type BaseTableColumn<T> = {
  title?: ReactNode;
  dataIndex?: keyof T;
  key: string;
  width?: number | string;
  render?: (value: T[keyof T], record: T, index: number) => ReactNode;
  tooltip?: boolean;
};

export type BaseTableProps<T> = {
  columns: BaseTableColumn<T>[];
  dataSource: T[];
  typeStyle?: BaseTableEnum;
  onClickRow?: (record: T) => void;
};
