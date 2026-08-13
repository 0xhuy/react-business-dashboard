import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";

import { BaseModal } from "@/components";
import type {
  ProductSheetColumnLabels,
  ProductSheetImportValidationError,
} from "../../types";

import styles from "../../ProductSheetPage.module.scss";

const cx = classNames.bind(styles);

type ProductSheetValidationModalProps = {
  isOpen: boolean;
  errors: ProductSheetImportValidationError[];
  columnLabels: ProductSheetColumnLabels;
  onClose: () => void;
  onFocusError: (rowIndex: number) => void;
};

const ProductSheetValidationModal = (
  props: ProductSheetValidationModalProps,
) => {
  const { isOpen, errors, columnLabels, onClose, onFocusError } = props;
  const { t } = useTranslation();

  return (
    <BaseModal
      isOpen={isOpen}
      title={t("product_sheet.validation_errors")}
      onClose={onClose}
    >
      <div className={cx("validationModalDescription")}>
        {t("product_sheet.validation_errors_description")}
      </div>

      <ul className={cx("validationErrorList")}>
        {errors.map((error) => (
          <li key={`${error.rowIndex}-${error.columnId}-${error.messageKey}`}>
            <button
              type="button"
              className={cx("validationErrorItem")}
              onClick={() => onFocusError(error.rowIndex)}
            >
              <span className={cx("validationErrorMessage")}>
                <strong className={cx("validationErrorLocation")}>
                  {t("product_sheet.validation.row", {
                    row: error.rowNumber,
                    column: columnLabels[error.columnId],
                  })}
                  {": "}
                </strong>
                {t(error.messageKey, error.messageValues)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </BaseModal>
  );
};

export default ProductSheetValidationModal;
