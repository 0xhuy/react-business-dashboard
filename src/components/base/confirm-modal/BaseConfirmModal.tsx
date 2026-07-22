// ===== Libs =====
import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";

// ===== Components =====
import { BaseButton, BaseModal } from "@/components";

// ===== Others =====
import type { BaseConfirmModalProps } from "./types";
import styles from "./BaseConfirmModal.module.scss";

const cx = classNames.bind(styles);

const BaseConfirmModal = ({
  isOpen,
  title,
  description,
  confirmText,
  cancelText,
  isLoading = false,
  variant = "primary",
  onClose,
  onConfirm,
}: BaseConfirmModalProps) => {
  const { t } = useTranslation();

  return (
    <BaseModal
      isOpen={isOpen}
      title={title}
      width={420}
      onClose={onClose}
      footer={
        <>
          <BaseButton
            variant="outline"
            isStatic
            onClick={onClose}
            isDisabled={isLoading}
          >
            {cancelText ?? t("common.btn_cancel")}
          </BaseButton>

          <BaseButton
            variant={variant}
            isStatic
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {confirmText ??
              (variant === "danger"
                ? t("common.btn_delete")
                : t("common.btn_confirm"))}
          </BaseButton>
        </>
      }
    >
      {description && <div className={cx("description")}>{description}</div>}
    </BaseModal>
  );
};

export default BaseConfirmModal;
