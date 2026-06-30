// ===== Libs =====
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";

// ===== Components =====
import { BaseButton, BaseInput, BaseModal, BasePagination } from "@/components";
import ProductSpreadsheet from "./components/ProductSpreadsheet/ProductSpreadsheet";
import ProductSheetSearch from "./components/ProductSheetSearch/ProductSheetSearch";

// ===== Others =====
import { InputTypeEnum } from "@/utils/enum/input.enum";
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
  isProductSheetRowEmpty,
  readProductSheetExcelFile,
  searchProductSheetRows,
  validateProductSheetRows,
} from "./helpers";
import type {
  ProductSheetHighlightedRowVariant,
  ProductSheetRow,
} from "./components/ProductSpreadsheet/types";
import type { ProductSheetImportValidationError } from "./types";

// ===== Styles =====
import styles from "./ProductSheetPage.module.scss";

const cx = classNames.bind(styles);

const ProductSheetPage = () => {
  // ===== Hooks =====
  const { t } = useTranslation();

  // ===== States =====
  const [productSheetData, setProductSheetData] = useState<ProductSheetRow[]>(
    [],
  );
  const [rowsToAdd, setRowsToAdd] = useState<string>(
    String(DEFAULT_ROW_QUANTITY),
  );
  const [searchKeyword, setSearchKeyword] = useState<string>(EMPTY_STRING);
  const [currentSearchResultIndex, setCurrentSearchResultIndex] =
    useState<number>(DEFAULT_NUMBER_ZERO);
  const [validationErrors, setValidationErrors] = useState<
    ProductSheetImportValidationError[]
  >([]);
  const [isValidationModalOpen, setIsValidationModalOpen] =
    useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(DEFAULT_NUMBER_ZERO);

  // ===== Derived =====
  const totalPages = Math.max(
    1,
    Math.ceil(productSheetData.length / PRODUCT_SHEET_PAGE_SIZE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages - 1);
  const startRowIndex = safeCurrentPage * PRODUCT_SHEET_PAGE_SIZE;
  const paginationCurrentPage = safeCurrentPage + 1;

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
      inventoryValue: t("product_sheet.columns.inventoryValue"),
      description: t("product_sheet.columns.description"),
    }),
    [t],
  );
  const visibleProductSheetData = useMemo(() => {
    return productSheetData.slice(
      startRowIndex,
      startRowIndex + PRODUCT_SHEET_PAGE_SIZE,
    );
  }, [productSheetData, startRowIndex]);

  const searchResultIndexes = useMemo(() => {
    return searchProductSheetRows(productSheetData, searchKeyword);
  }, [productSheetData, searchKeyword]);

  const [highlightedRowIndex, setHighlightedRowIndex] = useState<number | null>(
    null,
  );
  const [highlightedRowVariant, setHighlightedRowVariant] =
    useState<ProductSheetHighlightedRowVariant>("search");

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
    [highlightedRowIndex, highlightedRowVariant],
  );

  const focusProductSheetRow = useCallback(
    (
      rowIndex: number,
      variant: ProductSheetHighlightedRowVariant = "search",
    ): void => {
      setCurrentPage(Math.floor(rowIndex / PRODUCT_SHEET_PAGE_SIZE));
      setHighlightedRowIndex(rowIndex);
      setHighlightedRowVariant(variant);
    },
    [],
  );

  const syncSearchHighlightAfterDataChange = useCallback(
    (rows: ProductSheetRow[]): void => {
      const nextSearchResultIndexes = searchProductSheetRows(
        rows,
        searchKeyword,
      );

      if (highlightedRowVariant !== "search" || !searchKeyword.trim()) {
        return;
      }

      if (nextSearchResultIndexes.length === DEFAULT_NUMBER_ZERO) {
        setCurrentSearchResultIndex(DEFAULT_NUMBER_ZERO);
        setHighlightedRowIndex(null);
        return;
      }

      const nextSearchResultIndex = Math.min(
        currentSearchResultIndex,
        nextSearchResultIndexes.length - 1,
      );

      setCurrentSearchResultIndex(nextSearchResultIndex);

      if (
        highlightedRowIndex === null ||
        !nextSearchResultIndexes.includes(highlightedRowIndex)
      ) {
        setHighlightedRowIndex(null);
      }
    },
    [
      currentSearchResultIndex,
      highlightedRowIndex,
      highlightedRowVariant,
      searchKeyword,
    ],
  );

  const handleProductSheetChange = useCallback(
    (updatedVisibleData: ProductSheetRow[]): void => {
      setProductSheetData((prevData) => {
        const nextData = [...prevData];

        updatedVisibleData.forEach((row, index) => {
          nextData[startRowIndex + index] = row;
        });

        syncValidationErrors(nextData);
        syncSearchHighlightAfterDataChange(nextData);
        setIsDirty(true);

        return nextData;
      });
    },
    [startRowIndex, syncSearchHighlightAfterDataChange, syncValidationErrors],
  );

  const handleAddRows = useCallback((): void => {
    const quantity = Math.min(
      Number(rowsToAdd) || DEFAULT_ROW_QUANTITY,
      MAX_ROW_QUANTITY,
    );
    const newRows = createProductSheetRows(quantity);
    setProductSheetData((prevData) => {
      const nextData = [...prevData, ...newRows];
      setCurrentPage(
        Math.max(0, Math.ceil(nextData.length / PRODUCT_SHEET_PAGE_SIZE) - 1),
      );
      syncValidationErrors(nextData);
      setIsDirty(true);

      return nextData;
    });
  }, [rowsToAdd, syncValidationErrors]);

  const handleRowsToAddChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const { value } = event.target;

      if (value === EMPTY_STRING) {
        setRowsToAdd(EMPTY_STRING);
        return;
      }

      const numericValue = Math.min(
        Number(value) || DEFAULT_ROW_QUANTITY,
        MAX_ROW_QUANTITY,
      );

      setRowsToAdd(String(numericValue));
    },
    [],
  );

  const handleSearchKeywordChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const nextSearchKeyword = event.target.value;
      const nextSearchResultIndexes = searchProductSheetRows(
        productSheetData,
        nextSearchKeyword,
      );
      const firstMatchedRowIndex = nextSearchResultIndexes[DEFAULT_NUMBER_ZERO];

      setSearchKeyword(nextSearchKeyword);
      setCurrentSearchResultIndex(DEFAULT_NUMBER_ZERO);

      if (
        !nextSearchKeyword.trim() ||
        typeof firstMatchedRowIndex !== "number"
      ) {
        setHighlightedRowIndex(null);
        setHighlightedRowVariant("search");
        return;
      }

      focusProductSheetRow(firstMatchedRowIndex, "search");
    },
    [focusProductSheetRow, productSheetData],
  );

  const handlePreviousSearchResult = useCallback((): void => {
    if (searchResultIndexes.length === DEFAULT_NUMBER_ZERO) {
      return;
    }

    const nextSearchResultIndex =
      currentSearchResultIndex === DEFAULT_NUMBER_ZERO
        ? searchResultIndexes.length - 1
        : currentSearchResultIndex - 1;
    const matchedRowIndex = searchResultIndexes[nextSearchResultIndex];

    setCurrentSearchResultIndex(nextSearchResultIndex);
    focusProductSheetRow(matchedRowIndex, "search");
  }, [currentSearchResultIndex, focusProductSheetRow, searchResultIndexes]);

  const handleNextSearchResult = useCallback((): void => {
    if (searchResultIndexes.length === DEFAULT_NUMBER_ZERO) {
      return;
    }

    const nextSearchResultIndex =
      currentSearchResultIndex >= searchResultIndexes.length - 1
        ? DEFAULT_NUMBER_ZERO
        : currentSearchResultIndex + 1;
    const matchedRowIndex = searchResultIndexes[nextSearchResultIndex];

    setCurrentSearchResultIndex(nextSearchResultIndex);
    focusProductSheetRow(matchedRowIndex, "search");
  }, [currentSearchResultIndex, focusProductSheetRow, searchResultIndexes]);

  const handleImportExcel = useCallback(
    async (file: File): Promise<void> => {
      const importedRows = await readProductSheetExcelFile(file);
      const nextValidationErrors = validateProductSheetRows(importedRows);
      if (nextValidationErrors.length > DEFAULT_NUMBER_ZERO) {
        showValidationErrors(nextValidationErrors);
        return;
      }

      clearValidationErrors();
      setProductSheetData((prevData) => {
        const nextData = [...prevData, ...importedRows];
        setCurrentPage(
          Math.max(
            DEFAULT_NUMBER_ZERO,
            Math.ceil(nextData.length / PRODUCT_SHEET_PAGE_SIZE) - 1,
          ),
        );
        setIsDirty(true);

        return nextData;
      });
    },
    [clearValidationErrors, showValidationErrors],
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
      setProductSheetData((prevData) => {
        const nextData = prevData.filter(
          (_, index) => !rowIndexes.includes(index),
        );

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
        setIsDirty(true);

        return nextData;
      });
    },
    [syncValidationErrors],
  );

  const handleInsertRows = useCallback(
    (rowIndex: number, quantity = DEFAULT_ROW_QUANTITY): void => {
      const newRows = createProductSheetRows(quantity);

      setProductSheetData((prevData) => {
        const nextData = [...prevData];

        nextData.splice(rowIndex, DEFAULT_NUMBER_ZERO, ...newRows);
        syncValidationErrors(nextData);
        setIsDirty(true);

        return nextData;
      });
    },
    [syncValidationErrors],
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

  const handleSave = useCallback((): void => {
    const nextValidationErrors = validateProductSheetRows(productSheetData);

    if (nextValidationErrors.length > DEFAULT_NUMBER_ZERO) {
      showValidationErrors(nextValidationErrors);
      return;
    }

    clearValidationErrors();
    setHighlightedRowIndex(null);
    setHighlightedRowVariant("search");
    setIsDirty(false);
  }, [clearValidationErrors, productSheetData, showValidationErrors]);

  return (
    <div className={cx("container")}>
      <div className={cx("toolbarCard")}>
        <div className={cx("toolbarHeader")}>
          <div className={cx("pageTitle")}>{t("sidebar.product_sheet")}</div>

          <ProductSheetSearch
            searchKeyword={searchKeyword}
            searchResultIndexes={searchResultIndexes}
            currentSearchResultIndex={currentSearchResultIndex}
            onSearchKeywordChange={handleSearchKeywordChange}
            onPreviousSearchResult={handlePreviousSearchResult}
            onNextSearchResult={handleNextSearchResult}
          />

          <button
            type="button"
            disabled={validationErrors.length === DEFAULT_NUMBER_ZERO}
            className={cx(
              "headerErrorButton",
              validationErrors.length > DEFAULT_NUMBER_ZERO
                ? "headerErrorButtonActive"
                : "headerErrorButtonInactive",
            )}
            onClick={() => setIsValidationModalOpen(true)}
          >
            {t("product_sheet.error_count", {
              count: validationIssueCount,
            })}
          </button>

          <BaseButton
            isStatic
            className={cx("saveButton")}
            isDisabled={!isDirty}
            onClick={handleSave}
          >
            {t("common.btn_save")}
          </BaseButton>
        </div>
      </div>

      <div className={cx("body")}>
        <div className={cx("bodyScroll")}>
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
            <div className={cx("sectionFooter")}>
              {productSheetData.length > PRODUCT_SHEET_PAGE_SIZE && (
                <div className={cx("pagination")}>
                  <BasePagination
                    currentPage={paginationCurrentPage}
                    totalItems={productSheetData.length}
                    totalPages={totalPages}
                    onChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={cx("toolbarActions")}>
        <BaseButton
          isStatic
          className={cx("addButton")}
          onClick={handleAddRows}
        >
          {t("product_sheet.add_row")}
        </BaseButton>

        <div className={cx("quantityInput")}>
          <BaseInput
            type={InputTypeEnum.NUMBER}
            value={rowsToAdd}
            onChange={handleRowsToAddChange}
          />
        </div>

        <label htmlFor="product-sheet-file" className={cx("actionButton")}>
          {t("product_sheet.import_excel")}
          <input
            id="product-sheet-file"
            type="file"
            accept=".xlsx,.xls"
            className={cx("fileInput")}
            onChange={handleFileChange}
          />
        </label>

        <BaseButton
          variant="secondary"
          className={cx("actionButton")}
          onClick={() => void handleDownloadTemplate()}
        >
          {t("product_sheet.download_template")}
        </BaseButton>

        <BaseButton
          variant="secondary"
          className={cx("actionButton")}
          isDisabled={productSheetData.every(isProductSheetRowEmpty)}
          onClick={() => void handleExportExcel()}
        >
          {t("product_sheet.export_excel")}
        </BaseButton>
      </div>

      <BaseModal
        isOpen={
          validationErrors.length > DEFAULT_NUMBER_ZERO && isValidationModalOpen
        }
        title={t("product_sheet.validation_errors")}
        onClose={() => setIsValidationModalOpen(false)}
      >
        <div className={cx("validationModalDescription")}>
          {t("product_sheet.validation_errors_description")}
        </div>

        <ul className={cx("validationErrorList")}>
          {validationErrors.map((error) => (
            <li key={`${error.rowIndex}-${error.columnId}-${error.messageKey}`}>
              <button
                type="button"
                className={cx("validationErrorItem")}
                onClick={() => handleFocusValidationError(error.rowIndex)}
              >
                <span className={cx("validationErrorMessage")}>
                  <strong className={cx("validationErrorLocation")}>
                    {t("product_sheet.validation.row", {
                      row: error.rowNumber,
                      column: productSheetColumnLabels[error.columnId],
                    })}
                    {": "}
                  </strong>
                  {t(error.messageKey, error.messageValues)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </BaseModal>
    </div>
  );
};

export default ProductSheetPage;
