// ===== Libs =====
import classNames from "classnames/bind";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

// ===== Others =====
import {
  BaseButton,
  BaseInput,
  BaseLoading,
  BasePagination,
  BaseTable,
  BaseToast,
} from "@/components";
import BaseConfirmModal from "@/components/base/confirm-modal/BaseConfirmModal";
import { InputTypeEnum } from "@/utils/enum/input.enum";

import ProductFormModal from "./components/ProductFormModal/ProductFormModal";
import ProductFilters from "./components/ProductFilters/ProductFilters";
import { useProductColumns } from "./hooks/useProductColumns";
import {
  DEFAULT_PRODUCT_FILTER_VALUES,
  EMPTY_STRING,
  PRODUCT_PAGE_SIZE,
} from "@/utils/constants";
import { filterProducts } from "./helpers";
import type {
  ProductFilterValues,
  ProductFormValues,
  ProductRow,
} from "@/features/products/product.types";
import { useAppDispatch, useProducts } from "@/redux/hooks";
import {
  createProductThunk,
  deleteProductThunk,
  getProductsThunk,
  updateProductThunk,
} from "@/redux/thunks/products/productThunk";

// ===== Styles =====
import styles from "./ProductsPage.module.scss";

const cx = classNames.bind(styles);

const ProductsPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { products, loading: isLoading, isProcessing } = useProducts();

  // ===== State =====
  const [isOpenProductModal, setIsOpenProductModal] = useState<boolean>(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductRow>();
  const [selectedDeleteProduct, setSelectedDeleteProduct] =
    useState<ProductRow>();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState<string>(EMPTY_STRING);
  const [filterValues, setFilterValues] = useState<ProductFilterValues>(
    DEFAULT_PRODUCT_FILTER_VALUES,
  );
  const [apiError, setApiError] = useState(EMPTY_STRING);
  const [apiMessage, setApiMessage] = useState(EMPTY_STRING);

  // ===== Effects =====
  useEffect(() => {
    void dispatch(getProductsThunk())
      .unwrap()
      .catch((error) => {
        console.error("Unable to load products:", error);
        setApiError(t("products.api.load_error"));
      });
  }, [dispatch, t]);

  // ===== Handlers =====
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
      setCurrentPage(1);
    },
    [],
  );

  const handleApplyFilter = useCallback((value: ProductFilterValues) => {
    setCurrentPage(1);
    setFilterValues(value);
  }, []);

  const handleOpenProductModal = useCallback(() => {
    setSelectedProduct(undefined);
    setIsOpenProductModal(true);
  }, []);

  const handleCloseProductModal = useCallback(() => {
    setSelectedProduct(undefined);
    setIsOpenProductModal(false);
  }, []);

  const handleSubmitProduct = async (data: ProductFormValues) => {
    setApiError(EMPTY_STRING);
    setApiMessage(EMPTY_STRING);

    try {
      if (selectedProduct) {
        await dispatch(
          updateProductThunk({ id: selectedProduct.id, product: data }),
        ).unwrap();
        setApiMessage(t("products.api.update_success"));
      } else {
        await dispatch(createProductThunk(data)).unwrap();
        setApiMessage(t("products.api.create_success"));
      }

      handleCloseProductModal();
      setCurrentPage(1);
    } catch (error) {
      console.error("Unable to save product:", error);
      setApiError(t("products.api.save_error"));
    }
  };

  const handleEditProduct = useCallback((record: ProductRow) => {
    setSelectedProduct(record);
    setIsOpenProductModal(true);
  }, []);

  const handleDeleteProduct = useCallback((record: ProductRow) => {
    setSelectedDeleteProduct(record);
    setIsOpenDeleteModal(true);
  }, []);

  const handleCloseDeleteModal = () => {
    if (isProcessing) return;

    setSelectedDeleteProduct(undefined);
    setIsOpenDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteProduct) return;

    setApiError(EMPTY_STRING);
    setApiMessage(EMPTY_STRING);

    try {
      await dispatch(deleteProductThunk(selectedDeleteProduct.id)).unwrap();
      setApiMessage(t("products.api.delete_success"));
      setSelectedDeleteProduct(undefined);
      setIsOpenDeleteModal(false);

      setCurrentPage(1);
    } catch (error) {
      console.error("Unable to delete product:", error);
      setApiError(t("products.api.delete_error"));
    }
  };

  // ===== Memos =====
  const filteredProducts = useMemo(
    () => filterProducts(products, searchValue, filterValues),
    [filterValues, products, searchValue],
  );

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / PRODUCT_PAGE_SIZE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCT_PAGE_SIZE;

    return filteredProducts.slice(startIndex, startIndex + PRODUCT_PAGE_SIZE);
  }, [currentPage, filteredProducts]);

  const productColumns = useProductColumns(
    handleEditProduct,
    handleDeleteProduct,
  );

  return (
    <div className={cx("wrapper")}>
      <section className={cx("toolbarCard")}>
        <div className={cx("toolbarHeader")}>
          <p className={cx("pageTitle")}>
            {t("products.title")}: {totalProducts}
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

            <ProductFilters
              value={filterValues}
              onApply={handleApplyFilter}
            />

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
        {isLoading ? (
          <BaseLoading />
        ) : (
          <BaseTable columns={productColumns} dataSource={paginatedProducts} />
        )}
      </div>

      <BasePagination
        currentPage={currentPage}
        totalItems={totalProducts}
        totalPages={totalPages}
        onChange={setCurrentPage}
      />

      <ProductFormModal
        isOpen={isOpenProductModal}
        isLoading={isProcessing}
        initialValues={selectedProduct}
        onClose={handleCloseProductModal}
        onSubmit={handleSubmitProduct}
      />

      <BaseConfirmModal
        isOpen={isOpenDeleteModal}
        title={t("common.confirm_delete")}
        description={
          <Trans
            i18nKey="common.delete_description"
            values={{ value: selectedDeleteProduct?.name }}
            components={[<strong key="strong" />]}
          />
        }
        variant="danger"
        isLoading={isProcessing}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      <BaseToast
        isOpen={Boolean(apiError || apiMessage)}
        message={apiError || apiMessage}
        variant={apiError ? "error" : "success"}
        onClose={() => {
          setApiError(EMPTY_STRING);
          setApiMessage(EMPTY_STRING);
        }}
      />
    </div>
  );
};

export default ProductsPage;
