// ===== Components =====
import type { ProductSheetRow } from "@/pages/product-sheet/components/ProductSpreadsheet/types";

// ===== Others =====
import { PRODUCT_SHEET_EXCEL_COLUMN_KEYS } from "@/utils/constants";

export type ProductSheetImportValidationError = {
  rowIndex: number;
  rowNumber: number;
  columnId: keyof Pick<
    ProductSheetRow,
    "sku" | "name" | "category" | "price" | "stock"
  >;
  messageKey: string;
  messageValues?: Record<string, string | number>;
};

export type ProductSheetColumnLabels = Record<
  (typeof PRODUCT_SHEET_EXCEL_COLUMN_KEYS)[number],
  string
>;

export type ProductSheetExcelOptions = {
  columnLabels: ProductSheetColumnLabels;
  sheetName: string;
};
