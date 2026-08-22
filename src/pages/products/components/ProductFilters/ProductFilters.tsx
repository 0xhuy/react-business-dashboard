import classNames from "classnames/bind";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { BaseCheckbox, BaseFilter, BaseSelect } from "@/components";
import {
  DEFAULT_PRODUCT_FILTER_VALUES,
  DEFAULT_FILTER_PANEL_WIDTH,
  DEFAULT_FILTER_SELECT_HEIGHT,
  PRODUCT_CATEGORY_OPTIONS,
} from "@/utils/constants";
import type {
  ProductFilterValues,
  ProductStatus,
} from "@/features/products/product.types";

import styles from "../../ProductsPage.module.scss";

const cx = classNames.bind(styles);

type ProductFiltersProps = {
  value: ProductFilterValues;
  onApply: (value: ProductFilterValues) => void;
};

const ProductFilters = ({ value, onApply }: ProductFiltersProps) => {
  const { t } = useTranslation();

  const categoryOptions = useMemo(
    () => [
      { label: t("products.category_all"), value: "all" },
      ...PRODUCT_CATEGORY_OPTIONS.map((option) => ({
        label: t(option.label),
        value: option.value,
      })),
    ],
    [t],
  );

  const statusOptions = useMemo(
    () =>
      (["InStock", "LowStock", "OutOfStock"] as ProductStatus[]).map(
        (status) => ({
          label: t(`products.status_${status.toLowerCase()}`),
          value: status,
        }),
      ),
    [t],
  );

  return (
    <BaseFilter<ProductFilterValues>
      valueFilter={value}
      defaultValue={DEFAULT_PRODUCT_FILTER_VALUES}
      widthPanel={DEFAULT_FILTER_PANEL_WIDTH}
      onApply={onApply}
    >
      {({ valueFilter, isChecked, onCheckboxChange, onChange }) => (
        <div className={cx("filterContainer")}>
          <div className={cx("filterGroup")}>
            <BaseCheckbox
              name="category"
              label={t("products.category")}
              value={Boolean(isChecked?.category)}
              onChange={(checked) => onCheckboxChange("category", checked)}
            />

            {isChecked?.category && (
              <div className={cx("contentFilterWrap")}>
                <BaseSelect
                  name="category"
                  options={categoryOptions}
                  height={DEFAULT_FILTER_SELECT_HEIGHT}
                  value={valueFilter.category}
                  placeholder={t("products.category")}
                  onChange={({ value: nextValue }) =>
                    onChange({ name: "category", value: nextValue })
                  }
                />
              </div>
            )}
          </div>

          <div className={cx("filterGroup")}>
            <BaseCheckbox
              name="status"
              label={t("products.status")}
              value={Boolean(isChecked?.status)}
              onChange={(checked) => onCheckboxChange("status", checked)}
            />

            {isChecked?.status && (
              <div className={cx("contentFilterWrap")}>
                <BaseSelect
                  name="status"
                  options={[
                    { label: t("products.status_all"), value: "all" },
                    ...statusOptions,
                  ]}
                  height={DEFAULT_FILTER_SELECT_HEIGHT}
                  value={valueFilter.status}
                  placeholder={t("products.status")}
                  onChange={({ value: nextValue }) =>
                    onChange({ name: "status", value: nextValue })
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}
    </BaseFilter>
  );
};

export default ProductFilters;
