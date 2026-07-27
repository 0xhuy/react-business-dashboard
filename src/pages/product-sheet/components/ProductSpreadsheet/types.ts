// ===== Libs =====
import type { TFunction } from "i18next";
import type { Cell, Column } from "@silevis/reactgrid";

// ===== Types =====
export type ProductSheetRow = {
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
  cellType?: "text" | "number";
};

export type ProductSheetHighlightedRowVariant = "search" | "error";

export type BuildProductSheetRowsParams = {
  dataSource: ProductSheetRow[];
  columns: ProductSheetColumn[];
  t: TFunction;
  className: (...classes: string[]) => string;
  rowOffset?: number;
  highlightedRowIndex?: number | null;
  highlightedRowVariant?: ProductSheetHighlightedRowVariant;
};

export type ProductSpreadsheetProps = {
  dataSource: ProductSheetRow[];
  onChange: (data: ProductSheetRow[]) => void;
  onDeleteRows?: (rowIndexes: number[]) => void;
  onInsertRows?: (rowIndex: number, quantity?: number) => void;
  rowOffset?: number;
  onFileUpload?: (file: File) => void;
  highlightedRowIndex?: number | null;
  highlightedRowVariant?: ProductSheetHighlightedRowVariant;
};

export type ProductSheetCell = Cell;
