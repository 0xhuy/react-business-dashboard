// ============================================================
// BASE INPUT TYPES
// ============================================================

// ===== Libs =====
import type { ChangeEvent, FocusEvent, ReactNode } from "react";

// ===== Others =====
import type {
  InputTypeEnum,
  InputTypeStyleEnum,
} from "@/utils/enum/input.enum";

// ===== Types =====
export type BaseInputProps = {
  id?: string;
  name?: string;

  type?: InputTypeEnum;
  typeStyle?: InputTypeStyleEnum;

  value?: string | number;
  placeholder?: string;
  label?: string;
  isRequired?: boolean;

  width?: number | string;
  height?: number | string;

  disabled?: boolean;
  messageError?: string;
  className?: string;

  prefix?: ReactNode;
  suffix?: ReactNode;

  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;

  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;

  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;

  renderPasswordToggle?: (isShow: boolean) => ReactNode;
};
