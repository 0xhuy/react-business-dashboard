// ===== Types =====
import type { ProductSheetColumn } from "@/pages/product-sheet/components/ProductSpreadsheet/types";

// ===== Defaults =====
export const DEFAULT_ROW_QUANTITY = 1;
export const DEFAULT_INDEX_COLUMN_WIDTH = 60;
export const PRODUCT_SHEET_PAGE_SIZE = 25;
export const PRODUCT_SHEET_EXCEL_FILE_NAME = "product-sheet.xlsx";
export const PRODUCT_SHEET_TEMPLATE_FILE_NAME = "product-sheet-template.xlsx";
export const PRODUCT_SHEET_EXCEL_SHEET_TRANSLATION_KEY =
  "product_sheet.excel_sheet_name";
export const PRODUCT_SHEET_MAX_VALIDATION_ISSUE_COUNT = 99;

export const PRODUCT_SHEET_COLUMN_WIDTH = {
  SKU: 140,
  NAME: 260,
  CATEGORY: 180,
  PRICE: 140,
  STOCK: 120,
  INVENTORY_VALUE: 180,
  DESCRIPTION: 350,
} as const;

export const PRODUCT_SHEET_EXCEL_COLUMN_KEYS = [
  "sku",
  "name",
  "category",
  "price",
  "stock",
  "inventoryValue",
  "description",
] as const;

export const PRODUCT_SHEET_TEMPLATE_COLUMN_WIDTHS = [
  PRODUCT_SHEET_COLUMN_WIDTH.SKU,
  PRODUCT_SHEET_COLUMN_WIDTH.NAME,
  PRODUCT_SHEET_COLUMN_WIDTH.CATEGORY,
  PRODUCT_SHEET_COLUMN_WIDTH.PRICE,
  PRODUCT_SHEET_COLUMN_WIDTH.STOCK,
  PRODUCT_SHEET_COLUMN_WIDTH.INVENTORY_VALUE,
  PRODUCT_SHEET_COLUMN_WIDTH.DESCRIPTION,
].map((width) => Math.ceil(width / 10));
export const PRODUCT_SHEET_EXCEL_HEADER_SEPARATOR = "_";

// ===== Regex =====
export const PRODUCT_SHEET_EXCEL_HEADER_SEPARATOR_REGEX = /[\s_-]+/g;
export const PRODUCT_SHEET_EXCEL_NUMBER_SEPARATOR_REGEX = /[$₫,]/g;

// ===== Columns =====
export const PRODUCT_SHEET_COLUMNS: ProductSheetColumn[] = [
  {
    columnId: "sku",
    dataIndex: "sku",
    translationKey: "products.sku",
    width: PRODUCT_SHEET_COLUMN_WIDTH.SKU,
    cellType: "text",
  },
  {
    columnId: "name",
    dataIndex: "name",
    translationKey: "products.name",
    width: PRODUCT_SHEET_COLUMN_WIDTH.NAME,
    cellType: "text",
  },
  {
    columnId: "category",
    dataIndex: "category",
    translationKey: "products.category",
    width: PRODUCT_SHEET_COLUMN_WIDTH.CATEGORY,
    cellType: "text",
  },
  {
    columnId: "price",
    dataIndex: "price",
    translationKey: "products.price",
    width: PRODUCT_SHEET_COLUMN_WIDTH.PRICE,
    cellType: "number",
  },
  {
    columnId: "stock",
    dataIndex: "stock",
    translationKey: "products.stock",
    width: PRODUCT_SHEET_COLUMN_WIDTH.STOCK,
    cellType: "number",
  },
  {
    columnId: "inventoryValue",
    dataIndex: "inventoryValue",
    translationKey: "products.inventory_value",
    width: PRODUCT_SHEET_COLUMN_WIDTH.INVENTORY_VALUE,
    cellType: "number",
    isReadOnly: true,
  },
  {
    columnId: "description",
    dataIndex: "description",
    translationKey: "products.description",
    width: PRODUCT_SHEET_COLUMN_WIDTH.DESCRIPTION,
    cellType: "text",
  },
];
