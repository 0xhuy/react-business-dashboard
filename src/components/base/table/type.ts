// ===== Others =====
import type { ColumnType } from "@/utils/interfaces";
import type { BaseTableEnum } from "@/utils/enum";

export type BaseTableProps<T> = {
  columns: ColumnType<T>[];
  dataSource: T[];
  typeStyle?: BaseTableEnum;
  onClickRow?: (record: T) => void;
};
