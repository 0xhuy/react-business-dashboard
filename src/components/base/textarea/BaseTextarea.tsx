// ===== Libs =====
import classNames from "classnames/bind";
import type { ChangeEvent } from "react";

// ===== Others =====
import {
  ASTERISK_SYMBOL,
  EMPTY_STRING,
  MAX_WIDTH_PERCENT,
} from "@/utils/constants";
import type { BaseTextareaProps } from "./types";

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
    messageError,
    errorMessage,
    className,
    disabled = false,
    isRequired = false,
    required = false,
    onChange,
    onTextareaChange,
    onBlur,
    onFocus,
  } = props;

  // ===== Derived =====
  const errorText = messageError || errorMessage;
  const isRequiredField = isRequired || required;
  const errorId = errorText && id ? `${id}-error` : undefined;

  // ===== Handlers =====
  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event);
    onTextareaChange?.(event);
  };

  // ===== Render =====
  return (
    <div className={cx("textareaContainer", className)} style={{ width }}>
      {label && (
        <label className={cx("textareaLabel")} htmlFor={id}>
          {label}
          {isRequiredField && (
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
          aria-invalid={!!errorText}
          aria-describedby={errorId}
          onChange={handleTextareaChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </div>

      {errorText && (
        <p id={errorId} className={cx("errorMessage")}>
          {errorText}
        </p>
      )}
    </div>
  );
};

export default BaseTextarea;
