// ===== Libs =====
import classNames from "classnames";
import { Tooltip } from "react-tooltip";

// ===== Types =====
import type { BaseTooltipProps } from "./types";

// ===== Styles =====
import styles from "./BaseTooltip.module.scss";

// ===== Component =====
const BaseTooltip = ({
  isCompact = false,
  className,
  ...props
}: BaseTooltipProps) => (
  <Tooltip
    {...props}
    className={classNames(
      styles.tooltip,
      isCompact && styles.compact,
      className,
    )}
  />
);

export default BaseTooltip;
