// ===== Libs =====
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import classNames from "classnames/bind";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseButton } from "@/components";

// ===== Others =====
import {
  DEFAULT_FILTER_WIDTH_BTN,
  MAX_HEIGHT_PERCENT,
} from "@/utils/constants";
import type { IFilterValueChange } from "@/utils/interfaces";
import type { BaseFilterProps } from "./types";

// ===== Styles, Images, Icons =====
import styles from "./BaseFilter.module.scss";
import { IconFilter } from "@/assets";

const cx = classNames.bind(styles);

const getCheckedStateFromValue = <T extends object>(filterValue: T) => {
  return Object.keys(filterValue).reduce(
    (acc, key) => {
      acc[key as keyof T] = !!filterValue[key as keyof T];
      return acc;
    },
    {} as { [K in keyof T]?: boolean },
  );
};

const BaseFilter = <T extends object>(props: BaseFilterProps<T>) => {
  // ===== Props =====
  const {
    children,
    widthBtn = DEFAULT_FILTER_WIDTH_BTN,
    heightBtn = MAX_HEIGHT_PERCENT,
    valueFilter,
    defaultValue,
    onApply,
  } = props;

  const initialFilterValue = valueFilter || defaultValue;
  const initialCheckedState = getCheckedStateFromValue(initialFilterValue);

  // ===== Hooks =====
  const { t } = useTranslation();

  // ===== States =====
  const [rootValueFilter, setRootValueFilter] = useState<T>(initialFilterValue);
  const [tempValueFilter, setTempValueFilter] = useState<T>(initialFilterValue);
  const [isChecked, setIsChecked] =
    useState<{ [K in keyof T]?: boolean }>(initialCheckedState);
  const [tempIsChecked, setTempIsChecked] = useState<{
    [K in keyof T]?: boolean;
  }>(initialCheckedState);

  // ===== Memos =====
  const isDisableApply = useMemo(() => {
    return JSON.stringify(tempValueFilter) === JSON.stringify(rootValueFilter);
  }, [tempValueFilter, rootValueFilter]);

  // ===== Handlers =====
  const handleApply = (close: () => void) => {
    setRootValueFilter(tempValueFilter);
    setIsChecked(tempIsChecked);
    onApply?.(tempValueFilter);
    close();
  };

  const handleClose = (close: () => void) => {
    setTempValueFilter(rootValueFilter);
    setTempIsChecked(isChecked);
    close();
  };

  const onValueChange = (data: IFilterValueChange<T>) => {
    const { name, value } = data;

    setTempValueFilter((prev) => {
      return {
        ...prev,
        [name]: value,
      } as T;
    });
  };

  const onCheckboxChange = (key: keyof T, checked: boolean) => {
    setTempIsChecked((prev) => ({
      ...prev,
      [key]: checked,
    }));

    setTempValueFilter((prev) => {
      const updatedValue = { ...prev };

      if (!checked) {
        delete updatedValue[key];
      }

      return updatedValue as T;
    });
  };

  return (
    <div className={cx("baseFilterComponent")}>
      <Popover className={cx("popoverWrap")}>
        {({ open, close }) => (
          <>
            <PopoverButton
              className={cx("filterButton", open && "active")}
              style={{ height: heightBtn, width: widthBtn }}
            >
              <IconFilter
                strokePath="var(--filter-icon-color)"
                className={cx("filterIcon")}
              />
              <span className={cx("filterLabel")}>
                {t("common.btn_filter")}
              </span>
            </PopoverButton>

            <PopoverPanel
              transition
              anchor={{ to: "bottom end", gap: "12px" }}
              className={cx("filterPanel")}
            >
              <h3 className={cx("panelTitle")}>{t("common.btn_filter")}</h3>

              <div className={cx("panelContent")}>
                {children({
                  isChecked: tempIsChecked,
                  valueFilter: tempValueFilter,
                  onChange: onValueChange,
                  onCheckboxChange,
                })}
              </div>

              <div className={cx("panelActions")}>
                <BaseButton
                  variant="outline"
                  isStatic
                  className={cx("cancelButton")}
                  onClick={() => handleClose(close)}
                >
                  {t("common.btn_cancel")}
                </BaseButton>

                <BaseButton
                  isStatic
                  className={cx("applyButton")}
                  onClick={() => handleApply(close)}
                  isDisabled={isDisableApply}
                >
                  {t("common.btn_apply")}
                </BaseButton>
              </div>
            </PopoverPanel>
          </>
        )}
      </Popover>
    </div>
  );
};

export default BaseFilter;
