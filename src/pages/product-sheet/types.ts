// ===== Libs =====
import type { Column } from "@silevis/reactgrid";

// ===== Others =====
import { PRODUCT_SHEET_EXCEL_COLUMN_KEYS } from "@/utils/constants";

export type ProductSheetRow = {
  id?: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "InStock" | "LowStock" | "OutOfStock" | "";
  inventoryValue: number;
  description: string;
};

export type ProductSheetColumn = Column & {
  dataIndex?: keyof ProductSheetRow;
  translationKey?: string;
  isReadOnly?: boolean;
  cellType?: "text" | "number" | "dropdown";
};

export type ProductSheetHighlightedRowVariant = "search" | "error";

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
