// ===== Libs =====
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";

// ===== Components =====
import { BaseLoading, BasePagination, BaseToast } from "@/components";
import BaseConfirmModal from "@/components/base/confirm-modal/BaseConfirmModal";
import ProductSpreadsheet from "./components/ProductSpreadsheet/ProductSpreadsheet";
import ProductSheetToolbar from "./components/ProductSheetToolbar/ProductSheetToolbar";
import ProductSheetActions from "./components/ProductSheetActions/ProductSheetActions";
import ProductSheetValidationModal from "./components/ProductSheetValidationModal/ProductSheetValidationModal";

// ===== Others =====
import {
  DEFAULT_NUMBER_ZERO,
  DEFAULT_ROW_QUANTITY,
  EMPTY_STRING,
  MAX_ROW_QUANTITY,
  PLUS_SYMBOL,
  PRODUCT_SHEET_EXCEL_SHEET_TRANSLATION_KEY,
  PRODUCT_SHEET_MAX_VALIDATION_ISSUE_COUNT,
  PRODUCT_SHEET_PAGE_SIZE,
} from "@/utils/constants";
import {
  createProductSheetRows,
  downloadProductSheetTemplate,
  exportProductSheetExcel,
  getProductInventoryValue,
  getProductSheetStatus,
  isProductSheetRowEmpty,
  readProductSheetExcelFile,
  validateProductSheetRows,
} from "./helpers";
import type {
  ProductSheetImportValidationError,
  ProductSheetRow,
} from "./types";
import type {
  ProductDraft,
  ProductRow,
} from "@/features/products/product.types";
import { useUnsavedChangesGuard } from "./hooks/useUnsavedChangesGuard";
import { useProductSheetSearch } from "./hooks/useProductSheetSearch";
import { useAppDispatch, useProducts } from "@/redux/hooks";
import {
  getProductsThunk,
  saveProductsThunk,
} from "@/redux/thunks/products/productThunk";

// ===== Styles =====
import styles from "./ProductSheetPage.module.scss";
import { getErrorMessage } from "@/utils/errors";

const cx = classNames.bind(styles);

const mapProductToSheetRow = (product: ProductRow): ProductSheetRow => ({
  id: product.id,
  sku: product.sku,
  name: product.name,
  category: product.category,
  price: product.price,
  stock: product.stock,
  status: getProductSheetStatus(product.stock),
  inventoryValue: getProductInventoryValue(product.price, product.stock),
  description: product.description,
});

const ProductSheetPage = () => {
  // ===== Hooks =====
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loading: isLoading, isProcessing: isSaving } = useProducts();
  const sheetScrollRef = useRef<HTMLDivElement>(null);

  // ===== States =====
  const [productSheetData, setProductSheetData] = useState<ProductSheetRow[]>(
    [],
  );
  const [rowsToAdd, setRowsToAdd] = useState<string>(
    String(DEFAULT_ROW_QUANTITY),
  );
  const [validationErrors, setValidationErrors] = useState<
    ProductSheetImportValidationError[]
  >([]);
  const [isValidationModalOpen, setIsValidationModalOpen] =
    useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(DEFAULT_NUMBER_ZERO);
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [apiError, setApiError] = useState(EMPTY_STRING);
  const [apiMessage, setApiMessage] = useState(EMPTY_STRING);
  const navigationBlocker = useUnsavedChangesGuard(isDirty, isSaving);
  const {
    searchKeyword,
    searchResultIndexes,
    currentSearchResultIndex,
    highlightedRowIndex,
    highlightedRowVariant,
    setHighlightedRowIndex,
    setHighlightedRowVariant,
    focusRow: focusProductSheetRow,
    resetHighlight,
    syncAfterDataChange: syncSearchHighlightAfterDataChange,
    handleKeywordChange: handleSearchKeywordChange,
    handlePreviousResult: handlePreviousSearchResult,
    handleNextResult: handleNextSearchResult,
  } = useProductSheetSearch(productSheetData, setCurrentPage);

  // ===== Effects =====
  useEffect(() => {
    void dispatch(getProductsThunk())
      .unwrap()
      .then((products) => {
        setProductSheetData(products.map(mapProductToSheetRow));
        setSavedProductIds(products.map((product) => product.id));
        setIsDirty(false);
      })
      .catch((error) => {
        console.error("Unable to load product spreadsheet:", error);
        setApiError(getErrorMessage(error, t));
      });
  }, [dispatch, t]);

  // ===== Derived =====
  const validationIssueCount =
    validationErrors.length > PRODUCT_SHEET_MAX_VALIDATION_ISSUE_COUNT
      ? `${PRODUCT_SHEET_MAX_VALIDATION_ISSUE_COUNT}${PLUS_SYMBOL}`
      : String(validationErrors.length);

  // ===== Memos =====
  const productSheetColumnLabels = useMemo(
    () => ({
      sku: t("product_sheet.columns.sku"),
      name: t("product_sheet.columns.name"),
      category: t("product_sheet.columns.category"),
      price: t("product_sheet.columns.price"),
      stock: t("product_sheet.columns.stock"),
      status: t("product_sheet.columns.status"),
      inventoryValue: t("product_sheet.columns.inventoryValue"),
      description: t("product_sheet.columns.description"),
    }),
    [t],
  );
  const totalPages = Math.max(
    1,
    Math.ceil(productSheetData.length / PRODUCT_SHEET_PAGE_SIZE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages - 1);
  const startRowIndex = safeCurrentPage * PRODUCT_SHEET_PAGE_SIZE;
  const paginationCurrentPage = safeCurrentPage + 1;

  const visibleProductSheetData = useMemo(
    () =>
      productSheetData.slice(
        startRowIndex,
        startRowIndex + PRODUCT_SHEET_PAGE_SIZE,
      ),
    [productSheetData, startRowIndex],
  );

  // ===== Handlers =====
  const showValidationErrors = useCallback(
    (errors: ProductSheetImportValidationError[]): void => {
      setValidationErrors(errors);
      setIsValidationModalOpen(errors.length > DEFAULT_NUMBER_ZERO);
    },
    [],
  );

  const clearValidationErrors = useCallback((): void => {
    setValidationErrors([]);
    setIsValidationModalOpen(false);
  }, []);

  const syncValidationErrors = useCallback(
    (rows: ProductSheetRow[]): void => {
      const nextErrors = validateProductSheetRows(rows);

      setValidationErrors(nextErrors);

      if (nextErrors.length === DEFAULT_NUMBER_ZERO) {
        setIsValidationModalOpen(false);
      }

      if (highlightedRowVariant === "error") {
        const isHighlightedRowStillInvalid = nextErrors.some(
          (error) => error.rowIndex === highlightedRowIndex,
        );

        if (!isHighlightedRowStillInvalid) {
          setHighlightedRowIndex(null);
          setHighlightedRowVariant("search");
        }
      }
    },
    [
      highlightedRowIndex,
      highlightedRowVariant,
      setHighlightedRowIndex,
      setHighlightedRowVariant,
    ],
  );

  const handleProductSheetChange = useCallback(
    (updatedVisibleData: ProductSheetRow[]): void => {
      const nextData = [...productSheetData];

      updatedVisibleData.forEach((row, index) => {
        nextData[startRowIndex + index] = row;
      });

      setProductSheetData(nextData);
      syncValidationErrors(nextData);
      syncSearchHighlightAfterDataChange(nextData);
      setIsDirty(true);
    },
    [
      productSheetData,
      syncSearchHighlightAfterDataChange,
      syncValidationErrors,
      startRowIndex,
    ],
  );

  const handleAddRows = useCallback((): void => {
    const quantity = Number(rowsToAdd);

    if (!Number.isInteger(quantity) || quantity <= DEFAULT_NUMBER_ZERO) {
      return;
    }

    const newRows = createProductSheetRows(quantity);
    const nextData = [...productSheetData, ...newRows];
    const lastPage = Math.max(
      DEFAULT_NUMBER_ZERO,
      Math.ceil(nextData.length / PRODUCT_SHEET_PAGE_SIZE) - 1,
    );

    setProductSheetData(nextData);
    setCurrentPage(lastPage);
    syncValidationErrors(nextData);
    syncSearchHighlightAfterDataChange(nextData);
    setIsDirty(true);

    window.requestAnimationFrame(() => {
      sheetScrollRef.current?.scrollTo({
        top: sheetScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [
    productSheetData,
    rowsToAdd,
    syncSearchHighlightAfterDataChange,
    syncValidationErrors,
  ]);

  const handleRowsToAddChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const { value } = event.target;

      if (value === EMPTY_STRING) {
        setRowsToAdd(EMPTY_STRING);
        return;
      }

      const digitsOnly = value.replace(/\D/g, EMPTY_STRING);

      if (digitsOnly === EMPTY_STRING) {
        setRowsToAdd(EMPTY_STRING);
        return;
      }

      const numericValue = Math.min(Number(digitsOnly), MAX_ROW_QUANTITY);

      setRowsToAdd(String(numericValue));
    },
    [],
  );

  const handleImportExcel = useCallback(
    async (file: File): Promise<void> => {
      try {
        const importedRows = await readProductSheetExcelFile(file);
        const nextValidationErrors = validateProductSheetRows(importedRows);

        if (nextValidationErrors.length > DEFAULT_NUMBER_ZERO) {
          showValidationErrors(nextValidationErrors);
          return;
        }

        const nextData = [...productSheetData, ...importedRows];

        clearValidationErrors();
        setProductSheetData(nextData);
        setCurrentPage(
          Math.max(
            DEFAULT_NUMBER_ZERO,
            Math.ceil(nextData.length / PRODUCT_SHEET_PAGE_SIZE) - 1,
          ),
        );
        syncSearchHighlightAfterDataChange(nextData);
        setIsDirty(true);
      } catch (error) {
        console.error("Unable to import product spreadsheet:", error);
        setApiError(t("product_sheet.api.import_error"));
      }
    },
    [
      clearValidationErrors,
      productSheetData,
      showValidationErrors,
      syncSearchHighlightAfterDataChange,
      t,
    ],
  );

  const handleExportExcel = useCallback(async (): Promise<void> => {
    if (productSheetData.length === DEFAULT_NUMBER_ZERO) {
      return;
    }

    const nextValidationErrors = validateProductSheetRows(productSheetData);
    if (nextValidationErrors.length > DEFAULT_NUMBER_ZERO) {
      showValidationErrors(nextValidationErrors);
      return;
    }

    const exportableRows = productSheetData.filter(
      (row) => !isProductSheetRowEmpty(row),
    );
    if (exportableRows.length === DEFAULT_NUMBER_ZERO) {
      return;
    }

    exportProductSheetExcel(exportableRows, {
      columnLabels: productSheetColumnLabels,
      sheetName: t(PRODUCT_SHEET_EXCEL_SHEET_TRANSLATION_KEY),
    });
  }, [productSheetColumnLabels, productSheetData, showValidationErrors, t]);

  const handleDownloadTemplate = useCallback((): void => {
    downloadProductSheetTemplate({
      columnLabels: productSheetColumnLabels,
      sheetName: t(PRODUCT_SHEET_EXCEL_SHEET_TRANSLATION_KEY),
    });
  }, [productSheetColumnLabels, t]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      clearValidationErrors();
      setIsValidationModalOpen(false);
      void handleImportExcel(file);
      event.target.value = EMPTY_STRING;
    },
    [clearValidationErrors, handleImportExcel],
  );

  const handlePageChange = useCallback((page: number): void => {
    setCurrentPage(page - 1);
  }, []);

  const handleDeleteRows = useCallback(
    (rowIndexes: number[]): void => {
      const nextData = productSheetData.filter(
        (_, index) => !rowIndexes.includes(index),
      );

      setProductSheetData(nextData);
      setCurrentPage((prevPage) =>
        Math.min(
          prevPage,
          Math.max(
            DEFAULT_NUMBER_ZERO,
            Math.ceil(nextData.length / PRODUCT_SHEET_PAGE_SIZE) - 1,
          ),
        ),
      );
      syncValidationErrors(nextData);
      syncSearchHighlightAfterDataChange(nextData);
      setIsDirty(true);
    },
    [
      productSheetData,
      syncSearchHighlightAfterDataChange,
      syncValidationErrors,
    ],
  );

  const handleInsertRows = useCallback(
    (rowIndex: number, quantity = DEFAULT_ROW_QUANTITY): void => {
      const newRows = createProductSheetRows(quantity);
      const nextData = [...productSheetData];

      nextData.splice(rowIndex, DEFAULT_NUMBER_ZERO, ...newRows);
      setProductSheetData(nextData);
      syncValidationErrors(nextData);
      syncSearchHighlightAfterDataChange(nextData);
      setIsDirty(true);
    },
    [
      productSheetData,
      syncSearchHighlightAfterDataChange,
      syncValidationErrors,
    ],
  );

  const handleFocusValidationError = useCallback(
    (rowIndex: number): void => {
      setIsValidationModalOpen(false);

      window.requestAnimationFrame(() => {
        focusProductSheetRow(rowIndex, "error");
      });
    },
    [focusProductSheetRow],
  );

  const handleSave = useCallback(async (): Promise<void> => {
    const nextValidationErrors = validateProductSheetRows(productSheetData);

    if (nextValidationErrors.length > DEFAULT_NUMBER_ZERO) {
      showValidationErrors(nextValidationErrors);
      return;
    }

    const nonEmptyRows = productSheetData.filter(
      (row) => !isProductSheetRowEmpty(row),
    );
    const currentProductIds = new Set(
      nonEmptyRows.flatMap((row) => (row.id ? [row.id] : [])),
    );
    const deletedIds = savedProductIds.filter(
      (id) => !currentProductIds.has(id),
    );
    const productsToSave: ProductDraft[] = nonEmptyRows.map((row) => ({
      id: row.id,
      sku: row.sku.trim(),
      name: row.name.trim(),
      category: row.category.trim(),
      price: row.price,
      stock: row.stock,
      description: row.description.trim(),
    }));

    setApiError(EMPTY_STRING);
    setApiMessage(EMPTY_STRING);

    try {
      const savedProducts = await dispatch(
        saveProductsThunk({ products: productsToSave, deletedIds }),
      ).unwrap();

      clearValidationErrors();
      setProductSheetData(savedProducts.map(mapProductToSheetRow));
      setSavedProductIds(savedProducts.map((product) => product.id));
      setCurrentPage(DEFAULT_NUMBER_ZERO);
      resetHighlight();
      setIsDirty(false);
      setApiMessage(t("product_sheet.api.save_success"));
    } catch (error) {
      console.error("Unable to save product spreadsheet:", error);
      setApiError(getErrorMessage(error, t));
    }
  }, [
    clearValidationErrors,
    dispatch,
    productSheetData,
    resetHighlight,
    savedProductIds,
    showValidationErrors,
    t,
  ]);

  return (
    <div className={cx("container")}>
      <ProductSheetToolbar
        productCount={productSheetData.length}
        searchKeyword={searchKeyword}
        searchResultIndexes={searchResultIndexes}
        currentSearchResultIndex={currentSearchResultIndex}
        validationIssueCount={validationIssueCount}
        hasValidationErrors={
          validationErrors.length > DEFAULT_NUMBER_ZERO
        }
        isDirty={isDirty}
        isLoading={isLoading}
        isSaving={isSaving}
        onSearchKeywordChange={handleSearchKeywordChange}
        onPreviousSearchResult={handlePreviousSearchResult}
        onNextSearchResult={handleNextSearchResult}
        onOpenValidationErrors={() => setIsValidationModalOpen(true)}
        onSave={() => void handleSave()}
      />

      <div className={cx("body")}>
        {isLoading ? (
          <BaseLoading
            className={cx("sheetLoading")}
            variant="section"
          />
        ) : (
          <>
            <div ref={sheetScrollRef} className={cx("bodyScroll")}>
              <div className={cx("section")}>
                <ProductSpreadsheet
                  dataSource={visibleProductSheetData}
                  onChange={handleProductSheetChange}
                  onDeleteRows={handleDeleteRows}
                  onInsertRows={handleInsertRows}
                  rowOffset={startRowIndex}
                  highlightedRowIndex={highlightedRowIndex}
                  highlightedRowVariant={highlightedRowVariant}
                />
              </div>
            </div>

            {productSheetData.length > DEFAULT_NUMBER_ZERO && (
              <div className={cx("sectionFooter")}>
                <div className={cx("pagination")}>
                  <BasePagination
                    currentPage={paginationCurrentPage}
                    totalItems={productSheetData.length}
                    totalPages={totalPages}
                    onChange={handlePageChange}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <ProductSheetActions
        rowsToAdd={rowsToAdd}
        canAddRows={Number(rowsToAdd) > DEFAULT_NUMBER_ZERO}
        canExport={!productSheetData.every(isProductSheetRowEmpty)}
        onAddRows={handleAddRows}
        onRowsToAddChange={handleRowsToAddChange}
        onFileChange={handleFileChange}
        onDownloadTemplate={handleDownloadTemplate}
        onExportExcel={() => void handleExportExcel()}
      />

      <ProductSheetValidationModal
        isOpen={
          validationErrors.length > DEFAULT_NUMBER_ZERO && isValidationModalOpen
        }
        errors={validationErrors}
        columnLabels={productSheetColumnLabels}
        onClose={() => setIsValidationModalOpen(false)}
        onFocusError={handleFocusValidationError}
      />

      <BaseConfirmModal
        isOpen={navigationBlocker.state === "blocked"}
        title={t("product_sheet.unsaved_changes_title")}
        description={t("product_sheet.unsaved_changes_description")}
        confirmText={t("product_sheet.leave_page")}
        cancelText={t("product_sheet.stay_on_page")}
        variant="danger"
        onClose={() => navigationBlocker.reset?.()}
        onConfirm={() => navigationBlocker.proceed?.()}
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

export default ProductSheetPage;
