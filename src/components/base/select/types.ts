// ===== Others =====
import type { IBaseOption } from "@/utils/interfaces";

export type BaseSelectProps = {
  height?: number | string;
  width?: number | string;
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  options: readonly IBaseOption[];
  name?: string;
  value?: string;
  disabled?: boolean;
  isRequired?: boolean;
  borderRadius?: number | string;
  onChange?: (value: IBaseOption, name: string) => void;
};
