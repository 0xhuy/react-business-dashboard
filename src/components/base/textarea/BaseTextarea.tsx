// ===== Libs =====
import classNames from "classnames/bind";

// ===== Others =====
import {
  ASTERISK_SYMBOL,
  EMPTY_STRING,
  MAX_WIDTH_PERCENT,
} from "@/utils/constants";
import type { BaseTextareaProps } from "./BaseTextarea.types";

// ===== Styles, images, icons =====
import styles from "./BaseTextarea.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const BaseTextarea = (props: BaseTextareaProps) => {
  // ===== Props =====
  const {
    id,
    label,
    placeholder,
    value = EMPTY_STRING,
    name,
    width = MAX_WIDTH_PERCENT,
    height = 120,
    borderRadius,
    maxLength,
    errorMessage,
    className,
    disabled = false,
    isRequired = false,
    onChange,
    onBlur,
    onFocus,
  } = props;

  // ===== Derived =====
  const errorId = errorMessage && id ? `${id}-error` : undefined;

  // ===== Render =====
  return (
    <div className={cx("textareaContainer", className)} style={{ width }}>
      {label && (
        <label className={cx("textareaLabel")} htmlFor={id}>
          {label}
          {isRequired && (
            <span className={cx("required")}>{ASTERISK_SYMBOL}</span>
          )}
        </label>
      )}

      <div className={cx("textareaWrap")} style={{ height, borderRadius }}>
        <textarea
          id={id}
          name={name}
          className={cx("textarea")}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={!!errorMessage}
          aria-describedby={errorId}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </div>

      {errorMessage && (
        <p id={errorId} className={cx("errorMessage")}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default BaseTextarea;
