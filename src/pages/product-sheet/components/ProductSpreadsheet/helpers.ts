// ============================================================
// PRODUCT SPREADSHEET
// ============================================================

// ===== Libs =====
import type { CellChange, DefaultCellTypes, Row } from "@silevis/reactgrid";
import i18n from "i18next";

// ===== Others =====
import { DEFAULT_NUMBER_ZERO, EMPTY_STRING } from "@/utils/constants";
import { getCurrencyFormatter } from "@/utils/helper";
import { getProductInventoryValue } from "@/pages/product-sheet/helpers";
import type {
  BuildProductSheetRowsParams,
  ProductSheetColumn,
  ProductSheetRow,
} from "./types";

/**
 * Marks a ReactGrid cell as read-only.
 *
 * @param cell ReactGrid cell.
 * @returns Non-editable ReactGrid cell.
 */
export const createReadOnlyCell = (
  cell: DefaultCellTypes,
): DefaultCellTypes => {
  return {
    ...cell,
    nonEditable: true,
  };
};

/**
 * Creates the header row for product spreadsheet.
 *
 * @param columns Product spreadsheet columns.
 * @param t Translation function.
 * @returns ReactGrid header row.
 */
export const createProductSheetHeaderRow = (
  columns: ProductSheetColumn[],
  t: BuildProductSheetRowsParams["t"],
): Row => {
  return {
    rowId: "header",
    cells: [
      createReadOnlyCell({ type: "header", text: EMPTY_STRING }),
      ...columns.map((column) =>
        createReadOnlyCell({
          type: "header",
          text: column.translationKey ? t(column.translationKey) : EMPTY_STRING,
        }),
      ),
    ],
  };
};

/**
 * Creates a ReactGrid cell from product row and column configuration.
 *
 * @param row Product sheet row.
 * @param column Product sheet column.
 * @returns ReactGrid cell.
 */
export const createProductSheetDataCell = (
  row: ProductSheetRow,
  column: ProductSheetColumn,
): DefaultCellTypes => {
  const value = column.dataIndex ? row[column.dataIndex] : EMPTY_STRING;

  if (column.columnId === "inventoryValue") {
    return {
      type: "text",
      text: getCurrencyFormatter(i18n.language).format(
        Number.isFinite(Number(value)) ? Number(value) : DEFAULT_NUMBER_ZERO,
      ),
    };
  }

  if (column.cellType === "number") {
    return {
      type: "number",
      value: Number.isFinite(Number(value))
        ? Number(value)
        : DEFAULT_NUMBER_ZERO,
    };
  }

  return {
    type: "text",
    text: String(value ?? EMPTY_STRING),
  };
};

/**
 * Builds ReactGrid rows from product sheet data.
 *
 * @param params Product sheet row building parameters.
 * @returns ReactGrid rows.
 */
export const buildProductSheetRows = (
  params: BuildProductSheetRowsParams,
): Row[] => {
  const {
    dataSource,
    columns,
    className,
    highlightedRowIndex,
    highlightedRowVariant = "search",
    rowOffset = DEFAULT_NUMBER_ZERO,
  } = params;

  const headerRow = createProductSheetHeaderRow(columns, params.t);

  const dataRows = dataSource.map<Row>((row, rowIndex) => {
    const isHighlighted = highlightedRowIndex === rowOffset + rowIndex;
    const highlightedCellClassName = isHighlighted
      ? highlightedRowVariant === "error"
        ? "errorMatchedCell"
        : "searchMatchedCell"
      : EMPTY_STRING;

    return {
      rowId: rowIndex,
      cells: [
        createReadOnlyCell({
          type: "number",
          value: rowOffset + rowIndex + 1,
          className: className("indexCell", highlightedCellClassName),
        }),
        ...columns.map((column) => {
          const cell = createProductSheetDataCell(row, column);
          const cellClassName = className(
            cell.className ?? EMPTY_STRING,
            highlightedCellClassName,
          );

          if (column.isReadOnly) {
            return createReadOnlyCell({
              ...cell,
              className: className("readonlyCell", highlightedCellClassName),
            });
          }

          return {
            ...cell,
            className: cellClassName,
          };
        }),
      ],
    };
  });

  return [headerRow, ...dataRows];
};

/**
 * Applies ReactGrid cell changes to product sheet data and recalculates inventory value.
 *
 * @param changes ReactGrid cell changes.
 * @param dataSource Current product sheet data.
 * @returns Updated product sheet data.
 */
export const applyProductSheetChanges = (
  changes: CellChange[],
  dataSource: ProductSheetRow[],
): ProductSheetRow[] => {
  const updatedData = [...dataSource];

  changes.forEach((change) => {
    const { rowId, columnId, newCell } = change;

    if (typeof rowId !== "number") return;

    const currentRow = updatedData[rowId];

    if (!currentRow) return;

    const nextRow = { ...currentRow };

    if (newCell.type === "text") {
      nextRow[columnId as keyof ProductSheetRow] = newCell.text as never;
    }

    if (newCell.type === "number") {
      nextRow[columnId as keyof ProductSheetRow] = newCell.value as never;
    }

    nextRow.inventoryValue = getProductInventoryValue(
      nextRow.price,
      nextRow.stock,
    );
    updatedData[rowId] = nextRow;
  });

  return updatedData;
};
