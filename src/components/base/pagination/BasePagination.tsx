// ===== Libs =====
import { useMemo } from "react";
import classNames from "classnames/bind";

// ===== Others =====
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_NUMBER_ZERO,
  DEFAULT_TOTAL_ITEM,
  DEFAULT_TOTAL_PAGE,
  MAX_VISIBLE_PAGE,
  PAGINATION_ARROW_SIZE,
  PAGINATION_EDGE_OFFSET,
  PAGINATION_STEP,
  SYMBOL_THREE_DOTS,
} from "@/utils/constants";
import type { BasePaginationProps } from "./type";

// ===== Styles, images, icons =====
import styles from "./BasePagination.module.scss";
import { IconArrow } from "@/assets/";

const cx = classNames.bind(styles);

const BasePagination = (props: BasePaginationProps) => {
  // ===== Props =====
  const {
    currentPage = DEFAULT_CURRENT_PAGE,
    totalItems = DEFAULT_TOTAL_ITEM,
    totalPages = DEFAULT_TOTAL_PAGE,
    onChange,
  } = props;

  // ===== Derived =====
  const pageNumbers = useMemo(() => {
    if (totalPages <= MAX_VISIBLE_PAGE) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + PAGINATION_STEP,
      );
    }

    const shouldShowEdgePages =
      currentPage <= DEFAULT_CURRENT_PAGE + PAGINATION_EDGE_OFFSET ||
      currentPage >= totalPages - PAGINATION_EDGE_OFFSET;

    if (shouldShowEdgePages) {
      return [
        DEFAULT_CURRENT_PAGE,
        DEFAULT_CURRENT_PAGE + PAGINATION_EDGE_OFFSET,
        NaN,
        totalPages - PAGINATION_EDGE_OFFSET,
        totalPages,
      ];
    }

    return [DEFAULT_CURRENT_PAGE, NaN, currentPage, NaN, totalPages];
  }, [currentPage, totalPages]);

  const hasPaginationData =
    totalItems > DEFAULT_NUMBER_ZERO && totalPages > DEFAULT_NUMBER_ZERO;

  // ===== Handlers =====
  const handlePrevPage = () => {
    if (currentPage <= DEFAULT_CURRENT_PAGE) return;

    onChange?.(currentPage - PAGINATION_STEP);
  };

  const handleNextPage = () => {
    if (currentPage >= totalPages) return;

    onChange?.(currentPage + PAGINATION_STEP);
  };

  const onClickPageButton = (pageNumber: number) => {
    if (!pageNumber || pageNumber === currentPage) return;

    onChange?.(pageNumber);
  };

  const renderPageButtons = (pageNumbers: number[]) => {
    return pageNumbers.map((pageNumber, index) => {
      const isThreeDots = Number.isNaN(pageNumber);
      const isActive = pageNumber === currentPage;

      return (
        <button
          type="button"
          key={`${pageNumber}-${index}`}
          onClick={() => onClickPageButton(pageNumber)}
          disabled={isThreeDots}
          className={cx(
            "pageButton",
            isThreeDots && "threeDotStyle",
            isActive && "active",
          )}
        >
          {isThreeDots ? SYMBOL_THREE_DOTS : pageNumber}
        </button>
      );
    });
  };

  return (
    <>
      {hasPaginationData && (
        <div className={cx("basePaginationContainer")}>
          <button
            type="button"
            className={cx(
              "pageButton",
              currentPage === DEFAULT_CURRENT_PAGE && "disabled",
            )}
            disabled={currentPage === DEFAULT_CURRENT_PAGE}
            onClick={handlePrevPage}
          >
            <span className={cx("leftChevronIcon")}>
              <IconArrow
                width={PAGINATION_ARROW_SIZE}
                height={PAGINATION_ARROW_SIZE}
                strokePath="currentColor"
              />
            </span>
          </button>

          <>{renderPageButtons(pageNumbers)}</>

          <button
            type="button"
            className={cx(
              "pageButton",
              currentPage === totalPages && "disabled",
            )}
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            <span className={cx("rightChevronIcon")}>
              <IconArrow
                width={PAGINATION_ARROW_SIZE}
                height={PAGINATION_ARROW_SIZE}
                strokePath="currentColor"
              />
            </span>
          </button>
        </div>
      )}
    </>
  );
};

export default BasePagination;
