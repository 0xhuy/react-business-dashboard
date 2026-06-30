// ===== Libs =====
import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import classNames from "classnames/bind";

// ===== Others =====
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_NUMBER_ZERO,
  DEFAULT_TOTAL_ITEM,
  DEFAULT_TOTAL_PAGE,
  EMPTY_STRING,
  MAX_VISIBLE_PAGE,
  PAGINATION_ARROW_SIZE,
  PAGINATION_EDGE_OFFSET,
  PAGINATION_STEP,
  PAGINATION_JUMP_INPUT_MODE,
  PAGINATION_JUMP_INPUT_PATTERN,
  SYMBOL_THREE_DOTS,
} from "@/utils/constants";
import type { BasePaginationProps } from "./type";

// ===== Styles, images, icons =====
import styles from "./BasePagination.module.scss";
import { IconArrow } from "@/assets/";
import { useTranslation } from "react-i18next";

const cx = classNames.bind(styles);

const BasePagination = (props: BasePaginationProps) => {
  // ===== Props =====
  const {
    currentPage = DEFAULT_CURRENT_PAGE,
    totalItems = DEFAULT_TOTAL_ITEM,
    totalPages = DEFAULT_TOTAL_PAGE,
    onChange,
  } = props;

  // ===== Hook =====
  const { t } = useTranslation();

  // ===== State =====
  const [jumpPage, setJumpPage] = useState<string>(EMPTY_STRING);
  const [activeJumpIndex, setActiveJumpIndex] = useState<number | null>(null);

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

  const handleJumpPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (!value) {
      setJumpPage(EMPTY_STRING);
      return;
    }

    const normalizedValue = value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");

    if (!normalizedValue) {
      setJumpPage(EMPTY_STRING);
      return;
    }

    const pageNumber = Math.min(Number(normalizedValue), totalPages);
    setJumpPage(String(pageNumber));
  };

  const handleJumpPageSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const pageNumber = Number(jumpPage);

    if (!pageNumber || pageNumber === currentPage) return;

    onChange?.(pageNumber);
    setJumpPage(EMPTY_STRING);
  };

  const renderPageButtons = (pageNumbers: number[]) => {
    return pageNumbers.map((pageNumber, index) => {
      const isThreeDots = Number.isNaN(pageNumber);
      const isActive = pageNumber === currentPage;

      if (isThreeDots) {
        return (
          <form
            key={`jump-${index}`}
            className={cx("jumpForm")}
            onSubmit={handleJumpPageSubmit}
          >
            <input
              className={cx("jumpInput")}
              type="text"
              inputMode={PAGINATION_JUMP_INPUT_MODE}
              pattern={PAGINATION_JUMP_INPUT_PATTERN}
              value={activeJumpIndex === index ? jumpPage : EMPTY_STRING}
              placeholder={SYMBOL_THREE_DOTS}
              title={t("pagination.jump_to_page")}
              aria-label={t("pagination.jump_to_page")}
              onFocus={() => setActiveJumpIndex(index)}
              onChange={handleJumpPageChange}
              onBlur={() => {
                setJumpPage(EMPTY_STRING);
                setActiveJumpIndex(null);
              }}
            />
          </form>
        );
      }

      return (
        <button
          type="button"
          key={`${pageNumber}-${index}`}
          onClick={() => onClickPageButton(pageNumber)}
          className={cx("pageButton", isActive && "active")}
        >
          {pageNumber}
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
