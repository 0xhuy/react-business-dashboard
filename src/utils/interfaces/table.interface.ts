export interface ColumnType<T> {
  key: string;
  dataIndex?: keyof T;
  title: string | React.ReactNode;
  width?: number | string;
  render?: (value: T[keyof T], record: T, index: number) => React.ReactNode;
}
