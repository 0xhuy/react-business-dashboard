export interface ColumnType<T> {
  title?: React.ReactNode;
  dataIndex?: keyof T;
  key: string;
  width?: number | string;
  render?: (value: T[keyof T], record: T, index: number) => React.ReactNode;
  tooltip?: boolean;
}
