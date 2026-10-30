// ===== Others =====
import type { ReactNode } from "react";

export type BaseConfirmModalProps = {
  isOpen: boolean;
  title: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "primary" | "danger";
  onClose: () => void;
  onConfirm: () => void;
};
