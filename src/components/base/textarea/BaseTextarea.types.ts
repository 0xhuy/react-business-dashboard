// ===== Libs =====
import type { ChangeEvent, FocusEventHandler } from "react";

// ===== Types =====
export type BaseTextareaProps = {
  id?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  name?: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  maxLength?: number;
  errorMessage?: string;
  className?: string;
  disabled?: boolean;
  isRequired?: boolean;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  onFocus?: FocusEventHandler<HTMLTextAreaElement>;
};
