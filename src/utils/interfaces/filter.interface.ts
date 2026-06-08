export interface IFilterValueChange<T> {
  index?: number;
  name: keyof T;
  value: T[keyof T];
}
