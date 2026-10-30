// ===== Libs =====
import type { ComponentProps } from "react";
import type { Tooltip } from "react-tooltip";

// ===== Types =====
export type BaseTooltipProps = ComponentProps<typeof Tooltip> & {
  isCompact?: boolean;
};
