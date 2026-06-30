// ===== Libs =====
import classNames from "classnames/bind";
import { useTranslation } from "react-i18next";

// ===== Components =====
import { BaseInput } from "@/components";

// ===== Others =====
import { DEFAULT_NUMBER_ZERO } from "@/utils/constants";
import { InputTypeEnum } from "@/utils/enum/input.enum";
import type { ProductSheetSearchProps } from "./types";

// ===== Styles =====
import styles from "./ProductSheetSearch.module.scss";

const cx = classNames.bind(styles);

const ProductSheetSearch = (props: ProductSheetSearchProps) => {
  // ===== Props =====
  const {
    searchKeyword,
    searchResultIndexes,
    currentSearchResultIndex,
    onSearchKeywordChange,
    onPreviousSearchResult,
    onNextSearchResult,
  } = props;

  // ===== Hooks =====
  const { t } = useTranslation();

  // ===== Derived =====
  const hasSearchResult = searchResultIndexes.length > DEFAULT_NUMBER_ZERO;

  return (
    <div className={cx("container")}>
      <BaseInput
        type={InputTypeEnum.TEXT}
        height={45}
        borderRadius={12}
        value={searchKeyword}
        placeholder={t("product_sheet.search_placeholder")}
        className={cx("searchInput")}
        onChange={onSearchKeywordChange}
      />

      <div className={cx("searchResultWrap")}>
        <span className={cx("searchResultText")}>
          {!searchKeyword
            ? t("product_sheet.search_no_result")
            : hasSearchResult
              ? `${currentSearchResultIndex + 1} / ${searchResultIndexes.length}`
              : t("product_sheet.search_no_result")}
        </span>

        <button
          type="button"
          className={cx("searchNavButton")}
          onClick={onPreviousSearchResult}
          disabled={!hasSearchResult}
          aria-label={t("product_sheet.search_previous")}
        >
          ↑
        </button>

        <button
          type="button"
          className={cx("searchNavButton")}
          onClick={onNextSearchResult}
          disabled={!hasSearchResult}
          aria-label={t("product_sheet.search_next")}
        >
          ↓
        </button>
      </div>
    </div>
  );
};

export default ProductSheetSearch;
