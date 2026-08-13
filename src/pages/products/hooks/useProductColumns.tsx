import classNames from "classnames/bind";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { icons } from "@/assets";
import { BaseActionMenu } from "@/components";
import { KeyTableEnum } from "@/utils/enum";
import { getCurrencyFormatter } from "@/utils/helper";
import type { ColumnType } from "@/utils/interfaces";
import { getProductStatus } from "../helpers";
import type { ProductRow } from "@/features/products/product.types";

import styles from "../ProductsPage.module.scss";

const cx = classNames.bind(styles);

export const useProductColumns = (
  onEdit: (product: ProductRow) => void,
  onDelete: (product: ProductRow) => void,
): ColumnType<ProductRow>[] => {
  const { t, i18n } = useTranslation();

  return useMemo(() => {
    const currencyFormatter = getCurrencyFormatter(i18n.language);

    return [
      { title: t("products.sku"), dataIndex: "sku", key: "sku", tooltip: true },
      {
        title: t("products.name"),
        dataIndex: "name",
        key: "name",
        tooltip: true,
      },
      {
        title: t("products.category"),
        dataIndex: "category",
        key: "category",
        tooltip: true,
        render: (_, product) =>
          t(`products.category_${product.category.toLowerCase()}`),
      },
      {
        title: t("products.price"),
        dataIndex: "price",
        key: "price",
        tooltip: true,
      },
      {
        title: t("products.stock"),
        dataIndex: "stock",
        key: "stock",
        tooltip: true,
      },
      {
        title: t("products.status"),
        key: "status",
        tooltip: true,
        render: (_, product) => {
          const status = getProductStatus(product.stock);
          return t(`products.status_${status.toLowerCase()}`);
        },
      },
      {
        title: t("products.inventory_value"),
        key: "inventoryValue",
        tooltip: true,
        render: (_, product) =>
          currencyFormatter.format(product.price * product.stock),
      },
      {
        title: t("products.description"),
        dataIndex: "description",
        key: "description",
        tooltip: true,
      },
      {
        title: t("common.actions"),
        key: KeyTableEnum.ACTION,
        render: (_, product) => (
          <div className={cx("tableActions")}>
            <BaseActionMenu
              actions={[
                {
                  icon: icons.iconEdit,
                  label: t("common.btn_edit"),
                  onClick: () => onEdit(product),
                },
                {
                  icon: icons.iconTrash,
                  label: t("common.btn_delete"),
                  variant: "danger",
                  onClick: () => onDelete(product),
                },
              ]}
            />
          </div>
        ),
      },
    ];
  }, [i18n.language, onDelete, onEdit, t]);
};
