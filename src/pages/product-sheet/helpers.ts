// ============================================================
// PRODUCT SPREADSHEET
// ============================================================

// ===== Libs =====
import { read, utils, writeFile, type WorkSheet } from "xlsx";

// ===== Components =====
import type { ProductSheetRow } from "@/pages/product-sheet/components/ProductSpreadsheet/types";
import type {
  ProductSheetExcelOptions,
  ProductSheetImportValidationError,
} from "./types";

// ===== Others =====
import {
  DEFAULT_NUMBER_ZERO,
  EMPTY_STRING,
  PRODUCT_SHEET_EXCEL_COLUMN_KEYS,
  PRODUCT_SHEET_EXCEL_FILE_NAME,
  PRODUCT_SHEET_EXCEL_HEADER_SEPARATOR,
  PRODUCT_SHEET_EXCEL_HEADER_SEPARATOR_REGEX,
  PRODUCT_SHEET_EXCEL_NUMBER_SEPARATOR_REGEX,
  PRODUCT_SHEET_TEMPLATE_COLUMN_WIDTHS,
  PRODUCT_SHEET_TEMPLATE_FILE_NAME,
} from "@/utils/constants";

/**
 * Calculates inventory value from price and stock.
 *
 * @param price Product price.
 * @param stock Product stock quantity.
 * @returns Inventory value.
 */
export const getProductInventoryValue = (
  price: number,
  stock: number,
): number => {
  return price * stock;
};

/**
 * Creates empty product sheet rows.
 *
 * @param quantity Number of rows to create.
 * @returns Empty product sheet rows.
 */
export const createProductSheetRows = (quantity: number): ProductSheetRow[] => {
  return Array.from({ length: quantity }, () => ({
    sku: EMPTY_STRING,
    name: EMPTY_STRING,
    category: EMPTY_STRING,
    price: DEFAULT_NUMBER_ZERO,
    stock: DEFAULT_NUMBER_ZERO,
    inventoryValue: DEFAULT_NUMBER_ZERO,
    description: EMPTY_STRING,
  }));
};

// ============================================================
// EXCEL IMPORT
// ============================================================
const normalizeExcelHeader = (header: string): string => {
  return header
    .trim()
    .replace(
      PRODUCT_SHEET_EXCEL_HEADER_SEPARATOR_REGEX,
      PRODUCT_SHEET_EXCEL_HEADER_SEPARATOR,
    )
    .toUpperCase();
};

const normalizeExcelNumber = (value: unknown): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : DEFAULT_NUMBER_ZERO;
  }

  const normalizedValue = String(value ?? EMPTY_STRING)
    .replace(PRODUCT_SHEET_EXCEL_NUMBER_SEPARATOR_REGEX, EMPTY_STRING)
    .trim();

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : DEFAULT_NUMBER_ZERO;
};

const normalizeExcelText = (value: unknown): string =>
  String(value ?? EMPTY_STRING).trim();

const normalizeSearchText = (value: unknown): string => {
  return String(value ?? EMPTY_STRING)
    .trim()
    .toLowerCase();
};

const PRODUCT_SHEET_SEARCH_FIELDS: Array<
  keyof Pick<ProductSheetRow, "sku" | "name" | "category" | "description">
> = ["sku", "name", "category", "description"];

export const parseProductSheetWorksheet = (
  worksheet: WorkSheet,
): ProductSheetRow[] => {
  const rows = utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: EMPTY_STRING,
  });

  return rows.map((row) => {
    const normalizedRow = Object.entries(row).reduce<Record<string, unknown>>(
      (acc, [key, value]) => {
        acc[normalizeExcelHeader(key)] = value;
        return acc;
      },
      {},
    );

    const price = normalizeExcelNumber(normalizedRow.PRICE);
    const stock = normalizeExcelNumber(normalizedRow.STOCK);

    const inventoryValue =
      normalizedRow.INVENTORY_VALUE === EMPTY_STRING
        ? getProductInventoryValue(price, stock)
        : normalizeExcelNumber(normalizedRow.INVENTORY_VALUE);

    return {
      sku: normalizeExcelText(normalizedRow.SKU),
      name: normalizeExcelText(normalizedRow.NAME),
      category: normalizeExcelText(normalizedRow.CATEGORY),
      price,
      stock,
      inventoryValue,
      description: normalizeExcelText(normalizedRow.DESCRIPTION),
    };
  });
};

export const isProductSheetRowEmpty = (row: ProductSheetRow): boolean => {
  return (
    !row.sku.trim() &&
    !row.name.trim() &&
    !row.category.trim() &&
    Number(row.price) === DEFAULT_NUMBER_ZERO &&
    Number(row.stock) === DEFAULT_NUMBER_ZERO &&
    !row.description.trim()
  );
};

export const searchProductSheetRows = (
  rows: ProductSheetRow[],
  keyword: string,
): number[] => {
  const normalizedKeyword = normalizeSearchText(keyword);

  if (!normalizedKeyword) {
    return [];
  }

  return rows.reduce<number[]>((matchedRowIndexes, row, rowIndex) => {
    const isMatched = PRODUCT_SHEET_SEARCH_FIELDS.some((field) =>
      normalizeSearchText(row[field]).includes(normalizedKeyword),
    );

    if (isMatched) {
      matchedRowIndexes.push(rowIndex);
    }

    return matchedRowIndexes;
  }, []);
};

const createProductSheetWorksheetData = (
  rows: ProductSheetRow[],
  options: ProductSheetExcelOptions,
): Record<string, string | number>[] => {
  return rows.map((item) =>
    PRODUCT_SHEET_EXCEL_COLUMN_KEYS.reduce<Record<string, string | number>>(
      (acc, key) => {
        acc[options.columnLabels[key]] = item[key];
        return acc;
      },
      {},
    ),
  );
};

const createProductSheetTemplateHeader = (
  options: ProductSheetExcelOptions,
): string[][] => {
  return [
    PRODUCT_SHEET_EXCEL_COLUMN_KEYS.map((key) => options.columnLabels[key]),
  ];
};

const applyProductSheetTemplateColumnWidths = (worksheet: WorkSheet): void => {
  worksheet["!cols"] = PRODUCT_SHEET_TEMPLATE_COLUMN_WIDTHS.map((width) => ({
    wch: width,
  }));
};

export const readProductSheetExcelFile = async (
  file: File,
): Promise<ProductSheetRow[]> => {
  const fileData = await file.arrayBuffer();
  const workbook = read(fileData, { type: "array" });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  if (!worksheet) {
    return [];
  }

  return parseProductSheetWorksheet(worksheet).filter(
    (row) => !isProductSheetRowEmpty(row),
  );
};

export const exportProductSheetExcel = (
  rows: ProductSheetRow[],
  options: ProductSheetExcelOptions,
): void => {
  const worksheet = utils.json_to_sheet(
    createProductSheetWorksheetData(rows, options),
  );
  const workbook = utils.book_new();

  utils.book_append_sheet(workbook, worksheet, options.sheetName);
  writeFile(workbook, PRODUCT_SHEET_EXCEL_FILE_NAME);
};

export const downloadProductSheetTemplate = (
  options: ProductSheetExcelOptions,
): void => {
  const worksheet = utils.aoa_to_sheet(
    createProductSheetTemplateHeader(options),
  );
  const workbook = utils.book_new();

  applyProductSheetTemplateColumnWidths(worksheet);
  utils.book_append_sheet(workbook, worksheet, options.sheetName);
  writeFile(workbook, PRODUCT_SHEET_TEMPLATE_FILE_NAME);
};

const addProductSheetValidationError = (
  errors: ProductSheetImportValidationError[],
  error: ProductSheetImportValidationError,
): void => {
  errors.push(error);
};

const validateProductSheetSku = (
  row: ProductSheetRow,
  rowIndex: number,
  skuMap: Map<string, number>,
  errors: ProductSheetImportValidationError[],
): void => {
  const rowNumber = rowIndex + 1;
  const sku = row.sku.trim();

  if (!sku) {
    addProductSheetValidationError(errors, {
      rowIndex,
      rowNumber,
      columnId: "sku",
      messageKey: "products.validation.sku_required",
    });
    return;
  }

  const previousRowNumber = skuMap.get(sku.toLowerCase());

  if (previousRowNumber) {
    addProductSheetValidationError(errors, {
      rowIndex,
      rowNumber,
      columnId: "sku",
      messageKey: "product_sheet.validation.duplicate_sku",
      messageValues: {
        row: previousRowNumber,
      },
    });
    return;
  }

  skuMap.set(sku.toLowerCase(), rowNumber);
};

const validateProductSheetName = (
  row: ProductSheetRow,
  rowIndex: number,
  errors: ProductSheetImportValidationError[],
): void => {
  if (row.name.trim()) {
    return;
  }

  addProductSheetValidationError(errors, {
    rowIndex,
    rowNumber: rowIndex + 1,
    columnId: "name",
    messageKey: "products.validation.name_required",
  });
};

const validateProductSheetNumberFields = (
  row: ProductSheetRow,
  rowIndex: number,
  errors: ProductSheetImportValidationError[],
): void => {
  const rowNumber = rowIndex + 1;

  if (row.price < DEFAULT_NUMBER_ZERO) {
    addProductSheetValidationError(errors, {
      rowIndex,
      rowNumber,
      columnId: "price",
      messageKey: "products.validation.price_invalid",
    });
  }

  if (row.stock < DEFAULT_NUMBER_ZERO) {
    addProductSheetValidationError(errors, {
      rowIndex,
      rowNumber,
      columnId: "stock",
      messageKey: "products.validation.stock_invalid",
    });
  }
};

export const validateProductSheetRows = (
  rows: ProductSheetRow[],
): ProductSheetImportValidationError[] => {
  const errors: ProductSheetImportValidationError[] = [];
  const skuMap = new Map<string, number>();

  rows.forEach((row, rowIndex) => {
    if (isProductSheetRowEmpty(row)) {
      return;
    }

    validateProductSheetSku(row, rowIndex, skuMap, errors);
    validateProductSheetName(row, rowIndex, errors);
    validateProductSheetNumberFields(row, rowIndex, errors);
  });

  return errors;
};
