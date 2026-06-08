// ===== Libs =====
import classNames from "classnames/bind";
import type { MouseEvent } from "react";

// ===== Others =====
import type { BaseButtonProps } from "./types";
import {
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_TYPE,
  DEFAULT_BUTTON_VARIANT,
} from "@/utils/constants";

// ===== Styles, Images, Icons =====
import styles from "./BaseButton.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const BaseButton = (props: BaseButtonProps) => {
  // ===== Props =====
  const {
    children,
    type = DEFAULT_BUTTON_TYPE,
    variant = DEFAULT_BUTTON_VARIANT,
    size = DEFAULT_BUTTON_SIZE,
    isFullWidth = false,
    isLoading = false,
    isDisabled = false,
    isStatic = false,
    leftIcon,
    rightIcon,
    className,
    onClick,
    ...restProps
  } = props;
  // ===== Derived =====
  const shouldDisable = isDisabled || isLoading;

  const buttonClassName = cx(
    "button",
    variant,
    size,
    {
      fullWidth: isFullWidth,
      loading: isLoading,
      disabled: shouldDisable,
      static: isStatic,
      iconOnly: !children && (leftIcon || rightIcon),
    },
    className,
  );

  // ===== Handlers =====
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (shouldDisable) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
  };

  return (
    <button
      type={type}
      className={buttonClassName}
      disabled={shouldDisable}
      onClick={handleClick}
      aria-busy={isLoading}
      {...restProps}
    >
      {isLoading ? (
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

export default BaseButton;
