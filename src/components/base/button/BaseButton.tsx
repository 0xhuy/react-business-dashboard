// ============================================================
// BASE BUTTON COMPONENT
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";

// ===== Types =====
import type { MouseEvent } from "react";
import type { BaseButtonProps } from "./types";

// ===== Styles, Images, Icons =====
import styles from "./BaseButton.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const BaseButton = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className,
  onClick,
  ...restProps
}: BaseButtonProps) => {
  // ===== Derived =====
  const isDisabled = disabled || loading;

  const buttonClassName = cx(
    "button",
    variant,
    size,
    {
      fullWidth,
      loading,
      disabled: isDisabled,
      iconOnly: !children && (leftIcon || rightIcon),
    },
    className,
  );

  // ===== Handlers =====
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
  };

  // ===== Render =====
  return (
    <button
      type={type}
      className={buttonClassName}
      disabled={isDisabled}
      onClick={handleClick}
      aria-busy={loading}
      {...restProps}
    >
      {loading ? (
        <span className={cx("spinner")} />
      ) : (
        <>
          {leftIcon && <span className={cx("iconLeft")}>{leftIcon}</span>}
          <span className={cx("label")}>{children}</span>
          {rightIcon && <span className={cx("iconRight")}>{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

// ===== Exports =====
export default BaseButton;
