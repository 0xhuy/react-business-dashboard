// ============================================================
// BASE INPUT COMPONENT
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import { useState } from "react";

// ===== Types =====
import type { ChangeEvent } from "react";
import type { BaseInputProps } from "./types";

// ===== Others =====
import { InputTypeEnum } from "@/utils/enum/input.enum";
import { ASTERISK_SYMBOL } from "@/utils/constants/common";

// ===== Styles, Images, Icons =====
import styles from "./BaseInput.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const BaseInput = (props: BaseInputProps) => {
  // ===== Destructuring Props =====
  const {
    id,
    type = InputTypeEnum.TEXT,
    height = 36,
    width = "100%",
    typeStyle,
    placeholder,
    value,
    label,
    name,
    isRequired,
    onChange,
    onBlur,
    className,
    disabled,
    messageError,
    prefix,
    suffix,
    renderPasswordToggle,
  } = props;

  // ===== State =====
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  // ===== Derived =====
  const isPassword = type === InputTypeEnum.PASSWORD;

  const inputType = isPassword
    ? isShowPassword
      ? InputTypeEnum.TEXT
      : InputTypeEnum.PASSWORD
    : type;

  const suffixNode =
    suffix ??
    (isPassword && (
      <span
        className={cx("baseInputSuffixBtn", typeStyle)}
        onClick={handleShowPassword}
      >
        <span className={cx("baseInputIcon")}>
          {renderPasswordToggle
            ? renderPasswordToggle(isShowPassword)
            : isShowPassword
              ? "Hide"
              : "Show"}
        </span>
      </span>
    ));

  // ===== Handlers =====
  function handleShowPassword() {
    setIsShowPassword((prev) => !prev);
  }

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
  };

  // ===== Render =====
  return (
    <div className={cx("baseInputContainer", typeStyle, className)}>
      {label && (
        <label className={cx("baseInputLabel", typeStyle)} htmlFor={id}>
          {label}
          {isRequired && (
            <span className={cx("baseInputLabelRequired")}>
              {ASTERISK_SYMBOL}
            </span>
          )}
        </label>
      )}

      <div className={cx("baseInputContent", typeStyle)} style={{ height }}>
        {prefix && (
          <span className={cx("baseInputPrefix", typeStyle)}>{prefix}</span>
        )}

        <input
          id={id}
          value={value}
          name={name}
          onChange={handleChangeInput}
          onBlur={onBlur}
          placeholder={placeholder}
          type={inputType}
          disabled={disabled}
          className={cx("baseInputBase", typeStyle)}
          style={{ width }}
        />

        {suffixNode && (
          <span className={cx("baseInputSuffix", typeStyle)}>{suffixNode}</span>
        )}
      </div>

      {messageError && (
        <p className={cx("baseInputMessageError", typeStyle)}>{messageError}</p>
      )}
    </div>
  );
};

export default BaseInput;
