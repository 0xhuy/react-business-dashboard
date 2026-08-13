import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";

import { BaseButton, BaseInput } from "@/components";
import { InputTypeEnum } from "@/utils/enum/input.enum";
import { PRODUCT_SHEET_ACTION_HEIGHT } from "@/utils/constants";

import styles from "../../ProductSheetPage.module.scss";

const cx = classNames.bind(styles);

type ProductSheetActionsProps = {
  rowsToAdd: string;
  canAddRows: boolean;
  canExport: boolean;
  onAddRows: () => void;
  onRowsToAddChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadTemplate: () => void;
  onExportExcel: () => void;
};

const ProductSheetActions = (props: ProductSheetActionsProps) => {
  const {
    rowsToAdd,
    canAddRows,
    canExport,
    onAddRows,
    onRowsToAddChange,
    onFileChange,
    onDownloadTemplate,
    onExportExcel,
  } = props;
  const { t } = useTranslation();

  return (
    <div className={cx("toolbarActions")}>
      <BaseButton
        isStatic
        className={cx("addButton")}
        isDisabled={!canAddRows}
        onClick={onAddRows}
      >
        {t("product_sheet.add_row")}
      </BaseButton>

      <div className={cx("quantityInput")}>
        <BaseInput
          type={InputTypeEnum.NUMBER}
          value={rowsToAdd}
          height={PRODUCT_SHEET_ACTION_HEIGHT}
          onChange={onRowsToAddChange}
        />
      </div>

      <label htmlFor="product-sheet-file" className={cx("actionButton")}>
        {t("product_sheet.import_excel")}
        <input
          id="product-sheet-file"
          type="file"
          accept=".xlsx,.xls"
          className={cx("fileInput")}
          onChange={onFileChange}
        />
      </label>

      <BaseButton
        variant="secondary"
        className={cx("actionButton")}
        onClick={onDownloadTemplate}
      >
        {t("product_sheet.download_template")}
      </BaseButton>

      <BaseButton
        variant="secondary"
        className={cx("actionButton")}
        isDisabled={!canExport}
        onClick={onExportExcel}
      >
        {t("product_sheet.export_excel")}
      </BaseButton>
    </div>
  );
};

export default ProductSheetActions;
