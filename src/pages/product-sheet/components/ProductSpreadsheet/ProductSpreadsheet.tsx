// ===== Libs =====
import {
  ReactGrid,
  type CellChange,
  type CellLocation,
  type Id,
  type MenuOption,
  type Row,
  type SelectionMode,
} from "@silevis/reactgrid";
import classNames from "classnames/bind";
import { memo, useCallback, useMemo, type ReactNode } from "react";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";

// ===== Others =====
import {
  DEFAULT_INDEX_COLUMN_WIDTH,
  DEFAULT_NUMBER_ZERO,
  PRODUCT_SHEET_COLUMNS,
} from "@/utils/constants";
import { applyProductSheetChanges, buildProductSheetRows } from "./helpers";
import type { ProductSpreadsheetProps } from "./types";

// ===== Styles =====
import "@silevis/reactgrid/styles.css";
import "./ProductSpreadsheet.scss";
import styles from "./ProductSpreadsheet.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const ProductSpreadsheet = (props: ProductSpreadsheetProps) => {
  // ===== Props =====
  const {
    dataSource,
    onChange,
    onDeleteRows,
    onInsertRows,
    rowOffset = DEFAULT_NUMBER_ZERO,
    highlightedRowIndex,
    highlightedRowVariant = "search",
  } = props;

  // ===== Hooks =====
  const { t } = useTranslation();

  // ===== Memos =====
  const columns = useMemo(
    () => [
      {
        columnId: "index",
        width: DEFAULT_INDEX_COLUMN_WIDTH,
      },
      ...PRODUCT_SHEET_COLUMNS,
    ],
    [],
  );

  const rows: Row[] = useMemo(() => {
    return buildProductSheetRows({
      dataSource,
      columns: PRODUCT_SHEET_COLUMNS,
      t,
      className: cx,
      rowOffset,
      highlightedRowIndex,
      highlightedRowVariant,
    });
  }, [dataSource, highlightedRowIndex, highlightedRowVariant, rowOffset, t]);

  // ===== Handlers =====
  const handleCellsChanged = useCallback(
    (changes: CellChange[]) => {
      const updatedData = applyProductSheetChanges(changes, dataSource);
      onChange(updatedData);
    },
    [dataSource, onChange],
  );

  const handleContextMenu = useCallback(
    (
      selectedRowIds: Id[],
      _selectedColIds: Id[],
      selectionMode: SelectionMode,
      _menuOptions: MenuOption[],
      selectedRanges: Array<CellLocation[]>,
    ): MenuOption[] => {
      const selectedRowIndexes =
        selectionMode === "row"
          ? selectedRowIds.filter(
              (rowId): rowId is number => typeof rowId === "number",
            )
          : selectedRanges
              .flat()
              .map((cellLocation) => cellLocation.rowId)
              .filter(
                (rowId, index, rowIds): rowId is number =>
                  typeof rowId === "number" && rowIds.indexOf(rowId) === index,
              );

      const firstSelectedRowIndex = selectedRowIndexes[0];

      const menuOptions: MenuOption[] = [];

      if (typeof firstSelectedRowIndex === "number") {
        menuOptions.push({
          id: "insertRowAbove",
          label: t("product_sheet.insert_row_above"),
          handler: () => {
            onInsertRows?.(rowOffset + firstSelectedRowIndex, 1);
          },
        });
      }

      if (selectedRowIndexes.length > DEFAULT_NUMBER_ZERO) {
        menuOptions.push({
          id: "deleteRow",
          label: t("product_sheet.delete_row"),
          handler: () => {
            if (onDeleteRows) {
              onDeleteRows(
                selectedRowIndexes.map((rowIndex) => rowOffset + rowIndex),
              );
              return;
            }

            const updatedData = dataSource.filter(
              (_, index) => !selectedRowIndexes.includes(index),
            );
            onChange(updatedData);
          },
        });
      }

      return menuOptions;
    },
    [dataSource, onChange, onDeleteRows, onInsertRows, rowOffset, t],
  );

  const stopHeaderSelection = useCallback(
    (
      event:
        | React.PointerEvent<HTMLDivElement>
        | React.MouseEvent<HTMLDivElement>,
    ) => {
      const target = event.target as HTMLElement;
      const headerCell = target.closest(".rg-header-cell");

      if (!headerCell) return;

      event.preventDefault();
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
    },
    [],
  );

  const renderTooltipContent = useCallback(
    ({ activeAnchor }: { activeAnchor: Element | null }): ReactNode => {
      if (!(activeAnchor instanceof HTMLElement)) return null;

      const content = activeAnchor.textContent?.trim();
      const isOverflowing = activeAnchor.scrollWidth > activeAnchor.clientWidth;

      if (!content || !isOverflowing) return null;

      return <span>{content}</span>;
    },
    [],
  );

  return (
    <div
      className={cx("container")}
      onPointerDownCapture={stopHeaderSelection}
      onMouseDownCapture={stopHeaderSelection}
      onClickCapture={stopHeaderSelection}
    >
      <ReactGrid
        rows={rows}
        columns={columns}
        onCellsChanged={handleCellsChanged}
        onContextMenu={handleContextMenu}
        enableRowSelection
        enableRangeSelection
      />

      <Tooltip
        id="product-spreadsheet-tooltip"
        anchorSelect=".reactgrid-content .rg-pane .rg-cell:not(.rg-header-cell)"
        place="top"
        className={cx("tooltip")}
        render={renderTooltipContent}
      />
    </div>
  );
};

export default memo(ProductSpreadsheet);
