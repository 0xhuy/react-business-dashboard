// ===== Libs =====
import classNames from "classnames/bind";
import { useState } from "react";

// ===== Types =====
import type { ChangeEvent, ReactNode, FocusEvent } from "react";

// ===== Others =====
import { InputTypeEnum, InputTypeStyleEnum } from "@/utils/enum/input.enum";
import { ASTERISK_SYMBOL } from "@/utils/constants/common";

// ===== Styles, Images, Icons =====
import styles from "./BaseInput.module.scss";

// ===== Types =====
type Props = {
  height?: number | string;
  width?: number | string;
  id?: string;
  type?: InputTypeEnum;
  typeStyle?: InputTypeStyleEnum;
  placeholder?: string;
  label?: string;
  isRequired?: boolean;
  value?: string | number;
  name?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  messageError?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  className?: string;
  renderPasswordToggle?: (isShow: boolean) => ReactNode;
};

const cx = classNames.bind(styles);

// ===== Component =====
const BaseInput = (props: Props) => {
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

  // ===== Hooks =====

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
