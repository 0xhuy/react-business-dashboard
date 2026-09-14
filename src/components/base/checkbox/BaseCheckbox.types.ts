export type BaseCheckboxProps = {
  label?: string;
  name: string;
  value?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean, name: string) => void;
};
