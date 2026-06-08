// ===== Libs =====
import type { ReactNode } from "react";

// ===== Types =====
export type ActionMenuItemVariant = "default" | "danger";

export type ActionMenuItem = {
  label: ReactNode;
  icon?: string;
  variant?: ActionMenuItemVariant;
  isDisabled?: boolean;
  onClick: () => void;
};

export type BaseActionMenuProps = {
  actions: ActionMenuItem[];
  width?: number | string;
  ariaLabel?: string;
};
