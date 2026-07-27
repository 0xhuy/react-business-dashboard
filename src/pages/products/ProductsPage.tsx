// ===== Libs =====
import classNames from "classnames/bind";
import { useCallback, useMemo, useState } from "react";
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
import { EMPTY_STRING } from "@/utils/constants";
import type { ProductFilterValues, ProductRow, ProductStatus } from "./types";

const cx = classNames.bind(styles);

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

const DEFAULT_PRODUCT_FILTER_VALUES: ProductFilterValues = {
  category: "",
  status: "",
};

const getProductStatus = (stock: number): ProductStatus => {
  if (stock === 0) return "OutOfStock";
  if (stock <= 20) return "LowStock";

  return "InStock";
};

const ProductsPage = () => {
  const { t, i18n } = useTranslation();
  const productCurrencyFormatter = getCurrencyFormatter(i18n.language);

  // ===== State =====
  const [isOpenProductModal, setIsOpenProductModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductRow>();
  const [searchValue, setSearchValue] = useState<string>(EMPTY_STRING);
  const [filterValues, setFilterValues] = useState<ProductFilterValues>(
    DEFAULT_PRODUCT_FILTER_VALUES,
  );

  // ===== Handlers =====
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    },
    [],
  );

  const handleApplyFilter = useCallback((value: ProductFilterValues) => {
    setFilterValues(value);
  }, []);

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

  // ===== Memos =====
  const filteredProducts = useMemo(() => {
    const normalizedSearchValue = searchValue.trim().toLocaleLowerCase();

    return PRODUCT_DATA_SOURCE.filter((product) => {
      const productStatus = getProductStatus(product.stock);
      const searchableText = [
        product.sku,
        product.name,
        product.category,
        product.description,
        t(`products.category_${product.category.toLowerCase()}`),
      ]
        .join(" ")
        .toLocaleLowerCase();

      const isMatchedSearch =
        !normalizedSearchValue ||
        searchableText.includes(normalizedSearchValue);
      const isMatchedCategory =
        !filterValues.category ||
        filterValues.category === "all" ||
        product.category === filterValues.category;
      const isMatchedStatus =
        !filterValues.status ||
        filterValues.status === "all" ||
        productStatus === filterValues.status;

      return isMatchedSearch && isMatchedCategory && isMatchedStatus;
    });
  }, [filterValues, searchValue, t]);

  const productColumns: ColumnType<ProductRow>[] = [
    {
      title: t("products.sku"),
      dataIndex: "sku",
      key: "sku",
      tooltip: true,
    },
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
      render: (_, record) =>
        t(`products.category_${record.category.toLowerCase()}`),
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
      render: (_, record) => {
        const status = getProductStatus(record.stock);

        return t(`products.status_${status.toLowerCase()}`);
      },
    },
    {
      title: t("products.inventory_value"),
      key: "inventoryValue",
      tooltip: true,
      render: (_, record) =>
        productCurrencyFormatter.format(record.price * record.stock),
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
      label: t("products.category_all"),
      value: "all",
    },
    ...["Electronics", "Furniture", "Lifestyle", "Stationery"].map(
      (category) => ({
        label: t(`products.category_${category.toLowerCase()}`),
        value: category,
      }),
    ),
  ];

  const productStatusOptions = [
    {
      label: t("products.status_all"),
      value: "all",
    },
    {
      label: t("products.status_instock"),
      value: "InStock",
    },
    {
      label: t("products.status_lowstock"),
      value: "LowStock",
    },
    {
      label: t("products.status_outofstock"),
      value: "OutOfStock",
    },
  ];

  return (
    <div className={cx("wrapper")}>
      <section className={cx("toolbarCard")}>
        <div className={cx("toolbarHeader")}>
          <p className={cx("pageTitle")}>
            {t("products.title")}: {filteredProducts.length}
          </p>

          <div className={cx("toolbarActions")}>
            <BaseInput
              type={InputTypeEnum.TEXT}
              height={45}
              borderRadius={12}
              placeholder={t("products.search_placeholder")}
              className={cx("searchInput")}
              value={searchValue}
              onChange={handleSearchChange}
            />

            <BaseFilter<ProductFilterValues>
              valueFilter={filterValues}
              defaultValue={DEFAULT_PRODUCT_FILTER_VALUES}
              widthPanel={500}
              onApply={handleApplyFilter}
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
                                value: value as ProductFilterValues["category"],
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
                                value: value as ProductFilterValues["status"],
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
        <BaseTable columns={productColumns} dataSource={filteredProducts} />
      </div>

      <BasePagination
        currentPage={1}
        totalItems={filteredProducts.length}
        totalPages={1}
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
