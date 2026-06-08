// ===== Libs =====
import { Checkbox, Field, Label } from "@headlessui/react";
import classNames from "classnames/bind";

// ===== Others =====
import { DEFAULT_CHECKBOX_VALUE } from "@/utils/constants";
import { IconCheck } from "@/assets";

// ===== Styles, images, icons =====
import styles from "./BaseCheckbox.module.scss";
import type { BaseCheckboxProps } from "./types";

const cx = classNames.bind(styles);

const BaseCheckbox = (props: BaseCheckboxProps) => {
  // ===== Props =====
  const {
    value = DEFAULT_CHECKBOX_VALUE,
    name,
    label,
    onChange,
    disabled,
  } = props;

  const isChecked = Boolean(value);

  // ===== Handlers =====
  const handleChange = (checked: boolean) => {
    onChange?.(checked, name);
  };

  return (
    <Field
      className={cx("container", disabled && "disabledStyle")}
      disabled={disabled}
    >
      {label && (
        <Label htmlFor={name} className={cx("label")}>
          {label}
        </Label>
      )}

      <Checkbox
        id={name}
        name={name}
        checked={isChecked}
        onChange={handleChange}
        className={cx("mainCheckbox")}
      >
        <IconCheck className={cx("checkSvg")} />
      </Checkbox>
    </Field>
  );
};

export default BaseCheckbox;
