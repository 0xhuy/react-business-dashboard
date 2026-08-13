import classNames from "classnames/bind";

// ===== Types =====
import type { BaseLoadingProps } from "./types";

// ===== Styles =====
import styles from "./BaseLoading.module.scss";

const cx = classNames.bind(styles);

const BaseLoading = ({
  label,
  size = "md",
  variant = "section",
  className,
}: BaseLoadingProps) => {
  return (
    <div
      className={cx("loading", variant, className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className={cx("spinner", size)} aria-hidden="true" />
      {label && <span className={cx("label")}>{label}</span>}
    </div>
  );
};

export default BaseLoading;
