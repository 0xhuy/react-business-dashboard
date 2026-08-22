// ===== Libs =====
import type { TFunction } from "i18next";
import type {
  ProductSheetColumn,
  ProductSheetHighlightedRowVariant,
  ProductSheetRow,
} from "../../types";

// ===== Types =====
export type BuildProductSheetRowsParams = {
  dataSource: ProductSheetRow[];
  columns: ProductSheetColumn[];
  t: TFunction;
  className: (...classes: string[]) => string;
  rowOffset?: number;
  highlightedRowIndex?: number | null;
  highlightedRowVariant?: ProductSheetHighlightedRowVariant;
  openDropdownRowIndex?: number | null;
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
