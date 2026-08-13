// ============================================================
// PRODUCT SPREADSHEET
// ============================================================

// ===== Libs =====
import type { CellChange, DefaultCellTypes, Row } from "@silevis/reactgrid";
import i18n from "i18next";

// ===== Others =====
import {
  DEFAULT_NUMBER_ZERO,
  EMPTY_STRING,
  PRODUCT_CATEGORY_OPTIONS,
  PRODUCT_SHEET_DROPDOWN_OPEN_UPWARD_ROW_COUNT,
} from "@/utils/constants";
import { getCurrencyFormatter } from "@/utils/helper";
import {
  getProductInventoryValue,
  getProductSheetStatus,
} from "@/pages/product-sheet/helpers";
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

  if (column.columnId === "status") {
    if (!row.sku.trim() && !row.name.trim()) {
      return {
        type: "text",
        text: EMPTY_STRING,
      };
    }

    const status = getProductSheetStatus(Number(row.stock));

    return {
      type: "text",
      text: status
        ? i18n.t(`products.status_${status.toLowerCase()}`)
        : EMPTY_STRING,
    };
  }

  if (column.columnId === "inventoryValue") {
    return {
      type: "text",
      text: getCurrencyFormatter(i18n.language).format(
        Number.isFinite(Number(value)) ? Number(value) : DEFAULT_NUMBER_ZERO,
      ),
    };
  }

  if (column.cellType === "dropdown") {
    return {
      type: "dropdown",
      selectedValue: String(value ?? EMPTY_STRING),
      values: PRODUCT_CATEGORY_OPTIONS.map((option) => ({
        value: option.value,
        label: i18n.t(option.label),
      })),
    };
  }

  if (column.cellType === "number") {
    return {
      type: "number",
      value: Number.isFinite(Number(value))
        ? Number(value)
        : Number.NaN,
      nanToZero: false,
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
    openDropdownRowIndex,
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
          const shouldOpenDropdownUpward =
            cell.type === "dropdown" &&
            rowIndex >=
              Math.max(
                dataSource.length -
                  PRODUCT_SHEET_DROPDOWN_OPEN_UPWARD_ROW_COUNT,
                DEFAULT_NUMBER_ZERO,
              );
          const dropdownState =
            cell.type === "dropdown"
              ? { isOpen: openDropdownRowIndex === rowIndex }
              : {};
          const cellClassName = className(
            cell.className ?? EMPTY_STRING,
            highlightedCellClassName,
            shouldOpenDropdownUpward ? "dropdownOpenUpward" : EMPTY_STRING,
          );

          if (column.isReadOnly) {
            return createReadOnlyCell({
              ...cell,
              className: className("readonlyCell", highlightedCellClassName),
            });
          }

          return {
            ...cell,
            ...dropdownState,
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

    if (newCell.type === "dropdown") {
      nextRow[columnId as keyof ProductSheetRow] = (newCell.selectedValue ??
        EMPTY_STRING) as never;
    }

    nextRow.inventoryValue = getProductInventoryValue(
      nextRow.price,
      nextRow.stock,
    );
    nextRow.status =
      nextRow.sku.trim() || nextRow.name.trim()
        ? getProductSheetStatus(nextRow.stock)
        : EMPTY_STRING;
    updatedData[rowId] = nextRow;
  });

  return updatedData;
};
