// ===== Libs =====
import {
  Description,
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import classNames from "classnames/bind";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// ===== Others =====
import { DEFAULT_SELECT_HEIGHT, MAX_WIDTH_PERCENT } from "@/utils/constants";
import { ASTERISK_SYMBOL, EMPTY_STRING } from "@/utils/constants";
import type { IBaseOption } from "@/utils/interfaces";
import type { BaseSelectProps } from "./types";
import { SLATE500 } from "@/utils/constants/color";

// ===== Styles, images, icons =====
import styles from "./BaseSelect.module.scss";
import { IconArrow } from "@/assets";

const cx = classNames.bind(styles);

const BaseSelect = (props: BaseSelectProps) => {
  // ===== Props =====
  const {
    width = MAX_WIDTH_PERCENT,
    height = DEFAULT_SELECT_HEIGHT,
    borderRadius,
    label,
    placeholder,
    errorMessage,
    options,
    name,
    value,
    disabled = false,
    onChange,
    isRequired,
  } = props;

  // ===== Hooks =====
  const { t } = useTranslation();

  // ===== Derived =====
  const selectOption = useMemo<IBaseOption | undefined>(() => {
    if (!value) {
      return undefined;
    }

    return options.find((item) => item.value === value);
  }, [value, options]);

  // ===== Handlers =====
  const handleOptionChange = (option: IBaseOption) => {
    onChange?.(option, name ?? EMPTY_STRING);
  };

  return (
    <Field className={cx("container")} style={{ width }} disabled={disabled}>
      {label && (
        <Label className={cx("label")}>
          {label}
          {isRequired && (
            <span className={cx("viewStar")}>{ASTERISK_SYMBOL}</span>
          )}
        </Label>
      )}

      <Listbox value={selectOption} onChange={handleOptionChange}>
        <ListboxButton
          className={cx("btnSelect")}
          style={{ height, borderRadius }}
        >
          {({ open }) => (
            <>
              {placeholder && !selectOption ? (
                <span className={cx("btnPlaceholder")}>{placeholder}</span>
              ) : (
                <span className={cx("btnText")}>
                  {selectOption?.label ? t(selectOption?.label) : EMPTY_STRING}
                </span>
              )}

              <span className={cx("iconArrow", open && "iconActive")}>
                <IconArrow width={20} height={20} strokePath={SLATE500} />
              </span>
            </>
          )}
        </ListboxButton>

        <ListboxOptions
          className={cx("optionList")}
          transition
          anchor={{ to: "bottom", gap: "4px" }}
        >
          {options.length > 0 ? (
            <>
              {options.map((option) => (
                <ListboxOption
                  key={option.value}
                  value={option}
                  className={({ selected }) =>
                    cx(
                      "optionItem",
                      (selected || selectOption?.value === option.value) &&
                        "optionActive",
                    )
                  }
                >
                  {t(option.label)}
                </ListboxOption>
              ))}
            </>
          ) : (
            <div className={cx("optionNoData")}>{t("common.empty_data")}</div>
          )}
        </ListboxOptions>
      </Listbox>

      {errorMessage && (
        <Description className={cx("errMessage")}>{errorMessage}</Description>
      )}
    </Field>
  );
};

export default BaseSelect;
