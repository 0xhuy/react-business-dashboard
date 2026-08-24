// ===== Libs =====
import classNames from "classnames/bind";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// ===== Others =====
import {
  DEFAULT_NUMBER_ZERO,
  MAX_COL_NUMBER,
  MAX_WIDTH_PERCENT,
  MIN_WIDTH_NUMBER,
  PIXELS,
} from "@/utils/constants";
import { KeyTableEnum } from "@/utils/enum";
import type { BaseTableProps } from "./type";

// ===== Components =====
import OverflowTooltip from "./component/OverflowTooltip";
import BaseTooltip from "../tooltip/BaseTooltip";

// ===== Styles =====
import styles from "./BaseTable.module.scss";

const cx = classNames.bind(styles);

const BaseTable = <T extends Record<string, unknown>>(
  props: BaseTableProps<T>,
) => {
  // ===== Props =====
  const { dataSource = [], columns, typeStyle, onClickRow } = props;

  // ===== Hooks =====
  const { t } = useTranslation();

  // ===== Derived =====
  const tableWidth = useMemo(() => {
    return columns.length > MAX_COL_NUMBER
      ? `${columns.length * MIN_WIDTH_NUMBER}${PIXELS}`
      : MAX_WIDTH_PERCENT;
  }, [columns]);

  const tableMinWidth = useMemo(() => {
    const columnWidths = columns.map((column) => column.width);

    if (!columnWidths.every((width) => typeof width === "number")) {
      return undefined;
    }

    return columnWidths.reduce<number>(
      (total, width) => total + Number(width),
      DEFAULT_NUMBER_ZERO,
    );
  }, [columns]);

  // ===== Handlers =====
  const handleClickRow = (record: T) => {
    onClickRow?.(record);
  };

  return (
    <>
      <div
        id="baseTableComponent"
        className={cx("baseTableComponent", typeStyle)}
      >
        <table
          style={{
            width: tableWidth,
            minWidth: tableMinWidth,
            tableLayout: "fixed",
          }}
          className={cx("tableContainer", typeStyle)}
        >
          <thead className={cx("thead", typeStyle)}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{
                    width: column.width,
                    maxWidth: column.width,
                  }}
                  className={cx("colTable", typeStyle)}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={cx("tbody", typeStyle)}>
            {dataSource.length > DEFAULT_NUMBER_ZERO ? (
              dataSource.map((record, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cx("rowTableBody", {
                    rowClickable: onClickRow,
                  })}
                >
                  {columns.map((column) => {
                    const cellContent = column.render
                      ? column.render(
                          record[column.dataIndex!],
                          record,
                          rowIndex,
                        )
                      : (record[column.dataIndex!] as React.ReactNode);

                    return (
                      <td
                        key={column.key}
                        style={{
                          maxWidth: column.width,
                          width: column.width,
                        }}
                        className={cx("colTableBody", typeStyle)}
                        onClick={() =>
                          column.key !== KeyTableEnum.ACTION &&
                          handleClickRow(record)
                        }
                      >
                        <div className={cx("cellContainer")}>
                          {column.tooltip ? (
                            <OverflowTooltip>{cellContent}</OverflowTooltip>
                          ) : (
                            cellContent
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr className={cx("emptyRow")}>
                <td colSpan={columns.length} className={cx("noDataAvailable")}>
                  <div className={cx("emptyContent")}>
                    {t("common.empty_data")}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <BaseTooltip id="base-table-tooltip" place="top" />
    </>
  );
};

export default BaseTable;
