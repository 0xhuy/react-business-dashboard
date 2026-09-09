import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";

import { BaseButton } from "@/components";
import ProductSheetSearch from "../ProductSheetSearch/ProductSheetSearch";
import type { ProductSheetSearchProps } from "../ProductSheetSearch/types";

import styles from "../../ProductSheetPage.module.scss";

const cx = classNames.bind(styles);

type ProductSheetToolbarProps = ProductSheetSearchProps & {
  productCount: number;
  validationIssueCount: string;
  hasValidationErrors: boolean;
  isDirty: boolean;
  isLoading: boolean;
  isSaving: boolean;
  onOpenValidationErrors: () => void;
  onSave: () => void;
};

const ProductSheetToolbar = (props: ProductSheetToolbarProps) => {
  const {
    searchKeyword,
    searchResultIndexes,
    currentSearchResultIndex,
    productCount,
    validationIssueCount,
    hasValidationErrors,
    isDirty,
    isLoading,
    isSaving,
    onSearchKeywordChange,
    onPreviousSearchResult,
    onNextSearchResult,
    onOpenValidationErrors,
    onSave,
  } = props;
  const { t } = useTranslation();

  return (
    <div className={cx("toolbarCard")}>
      <div className={cx("toolbarHeader")}>
        <div className={cx("pageTitle")}>
          {t("products.title")}: {productCount}
        </div>

        <ProductSheetSearch
          searchKeyword={searchKeyword}
          searchResultIndexes={searchResultIndexes}
          currentSearchResultIndex={currentSearchResultIndex}
          onSearchKeywordChange={onSearchKeywordChange}
          onPreviousSearchResult={onPreviousSearchResult}
          onNextSearchResult={onNextSearchResult}
        />

        <div className={cx("toolbarControls")}>
          <button
            type="button"
            disabled={!hasValidationErrors}
            className={cx(
              "headerErrorButton",
              hasValidationErrors
                ? "headerErrorButtonActive"
                : "headerErrorButtonInactive",
            )}
            onClick={onOpenValidationErrors}
          >
            {t("product_sheet.error_count", { count: validationIssueCount })}
          </button>

          <BaseButton
            isStatic
            className={cx("saveButton")}
            isDisabled={!isDirty || isLoading}
            isLoading={isSaving}
            onClick={onSave}
          >
            {t("common.btn_save")}
          </BaseButton>
        </div>
      </div>
    </div>
  );
};

export default ProductSheetToolbar;
