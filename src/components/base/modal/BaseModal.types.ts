// ===== Libs =====
import type { ReactNode } from "react";

// ===== Types =====
export type BaseModalProps = {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: number | string;
  isLoading?: boolean;
  isCloseOnOverlay?: boolean;
  isShowCloseButton?: boolean;
  onClose: () => void;
};
