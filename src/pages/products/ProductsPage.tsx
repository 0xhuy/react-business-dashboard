// ===== Libs =====
import classNames from "classnames/bind";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// ===== Others =====
import {
  BaseActionMenu,
  BaseButton,
  BaseCheckbox,
  BaseFilter,
  BaseInput,
  BasePagination,
  BaseSelect,
  BaseTable,
} from "@/components";
import type { ColumnType } from "@/utils/interfaces";
import { InputTypeEnum } from "@/utils/enum/input.enum";
import { KeyTableEnum } from "@/utils/enum";
import { getCurrencyFormatter } from "@/utils/helper";

import ProductFormModal from "./components/ProductFormModal/ProductFormModal";
import type { ProductFormValues } from "./components/ProductFormModal/types";

// ===== Styles =====
import styles from "./ProductsPage.module.scss";
import { icons } from "@/assets";

const cx = classNames.bind(styles);

type ProductFilterValues = {
  category?: string;
  status?: string;
};

type ProductRow = {
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
};

const PRODUCT_DATA_SOURCE: ProductRow[] = [
  {
    sku: "PRD-001",
    name: "Wireless Mouse",
    category: "Electronics",
    price: 29.99,
    stock: 120,
    description: "Ergonomic wireless mouse",
  },
  {
    sku: "PRD-002",
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 89.99,
    stock: 45,
    description: "RGB mechanical keyboard",
  },
  {
    sku: "PRD-003",
    name: "Office Chair",
    category: "Furniture",
    price: 199.99,
    stock: 18,
    description: "Comfortable office chair",
  },
  {
    sku: "PRD-004",
    name: "Water Bottle",
    category: "Lifestyle",
    price: 15.5,
    stock: 250,
    description: "Stainless steel bottle",
  },
  {
    sku: "PRD-005",
    name: "Notebook",
    category: "Stationery",
    price: 4.99,
    stock: 500,
    description: "A5 lined notebook",
  },
];

const PRODUCT_TOTAL = PRODUCT_DATA_SOURCE.length;

const DEFAULT_PRODUCT_FILTER_VALUES: ProductFilterValues = {
  category: "",
  status: "",
};

const ProductsPage = () => {
  const { t, i18n } = useTranslation();
  const productCurrencyFormatter = getCurrencyFormatter(i18n.language);

  // ===== State =====
  const [isOpenProductModal, setIsOpenProductModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductRow>();

  // ===== Handlers =====
  const handleOpenProductModal = () => {
    setSelectedProduct(undefined);
    setIsOpenProductModal(true);
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(undefined);
    setIsOpenProductModal(false);
  };

  const handleSubmitProduct = (data: ProductFormValues) => {
    console.log(data);
    handleCloseProductModal();
  };

  const handleEditProduct = (record: ProductRow) => {
    setSelectedProduct(record);
    setIsOpenProductModal(true);
  };

  const handleDeleteProduct = (record: ProductRow) => {
    console.log("Delete product", record);
  };

  const PRODUCT_COLUMNS: ColumnType<ProductRow>[] = [
    {
      title: t("products.sku"),
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: t("products.name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("products.category"),
      dataIndex: "category",
      key: "category",
    },
    {
      title: t("products.price"),
      dataIndex: "price",
      key: "price",
    },
    {
      title: t("products.stock"),
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: t("products.inventory_value"),
      key: "inventoryValue",
      render: (_, record) =>
        productCurrencyFormatter.format(record.price * record.stock),
    },
    {
      title: t("products.description"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: t("common.actions"),
      key: KeyTableEnum.ACTION,
      render: (_, record) => (
        <div className={cx("tableActions")}>
          <BaseActionMenu
            actions={[
              {
                icon: icons.iconEdit,
                label: t("common.btn_edit"),
                onClick: () => handleEditProduct(record),
              },
              {
                icon: icons.iconTrash,
                label: t("common.btn_delete"),
                variant: "danger",
                onClick: () => handleDeleteProduct(record),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  const productCategoryOptions = [
    {
      label: t("products.category"),
      value: "all",
    },
  ];

  const productStatusOptions = [
    {
      label: t("products.status"),
      value: "all",
    },
  ];

  return (
    <div className={cx("wrapper")}>
      <section className={cx("toolbarCard")}>
        <div className={cx("toolbarHeader")}>
          <p className={cx("pageTitle")}>
            {t("products.title")}: {PRODUCT_TOTAL}
          </p>

          <div className={cx("toolbarActions")}>
            <BaseInput
              type={InputTypeEnum.TEXT}
              height={45}
              borderRadius={12}
              placeholder={t("products.search_placeholder")}
              className={cx("searchInput")}
            />

            <BaseFilter<ProductFilterValues>
              defaultValue={DEFAULT_PRODUCT_FILTER_VALUES}
            >
              {({ valueFilter, isChecked, onCheckboxChange, onChange }) => {
                return (
                  <div className={cx("filterContainer")}>
                    <div className={cx("filterGroup")}>
                      <BaseCheckbox
                        name="category"
                        label={t("products.category")}
                        value={!!isChecked?.category}
                        onChange={(checked: boolean) => {
                          onCheckboxChange("category", checked);
                        }}
                      />

                      {isChecked?.category && (
                        <div className={cx("contentFilterWrap")}>
                          <BaseSelect
                            name="category"
                            options={productCategoryOptions}
                            height={40}
                            value={valueFilter.category}
                            placeholder={t("products.category")}
                            onChange={({ value }, name) => {
                              onChange({
                                name: name as keyof ProductFilterValues,
                                value,
                              });
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className={cx("filterGroup")}>
                      <BaseCheckbox
                        name="status"
                        label={t("products.status")}
                        value={!!isChecked?.status}
                        onChange={(checked: boolean) => {
                          onCheckboxChange("status", checked);
                        }}
                      />

                      {isChecked?.status && (
                        <div className={cx("contentFilterWrap")}>
                          <BaseSelect
                            name="status"
                            options={productStatusOptions}
                            height={40}
                            value={valueFilter.status}
                            placeholder={t("products.status")}
                            onChange={({ value }, name) => {
                              onChange({
                                name: name as keyof ProductFilterValues,
                                value,
                              });
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              }}
            </BaseFilter>

            <BaseButton
              isStatic
              className={cx("addButton")}
              onClick={handleOpenProductModal}
            >
              {t("products.add_product")}
            </BaseButton>
          </div>
        </div>
      </section>

      <div className={cx("table")}>
        <BaseTable columns={PRODUCT_COLUMNS} dataSource={PRODUCT_DATA_SOURCE} />
      </div>

      <BasePagination
        currentPage={3}
        totalItems={125}
        totalPages={10}
        onChange={() => undefined}
      />

      <ProductFormModal
        isOpen={isOpenProductModal}
        initialValues={selectedProduct}
        onClose={handleCloseProductModal}
        onSubmit={handleSubmitProduct}
      />
    </div>
  );
};

export default ProductsPage;
