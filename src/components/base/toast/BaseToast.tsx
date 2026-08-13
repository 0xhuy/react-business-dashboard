// ===== Libs =====
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";

// ===== Components, Images, Icons =====
import { IconAlertCircle, IconCheck, IconClose } from "@/assets";

// ===== Others =====
import { DEFAULT_TOAST_DURATION } from "@/utils/constants";

// ===== Types =====
import type { BaseToastProps } from "./types";

// ===== Styles =====
import styles from "./BaseToast.module.scss";

const cx = classNames.bind(styles);

const BaseToast = ({
  isOpen,
  message,
  variant = "success",
  duration = DEFAULT_TOAST_DURATION,
  onClose,
}: BaseToastProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen || duration <= 0) return;

    const timeoutId = window.setTimeout(onClose, duration);

    return () => window.clearTimeout(timeoutId);
  }, [duration, isOpen, message, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={cx("toast", variant)}
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
    >
      <span className={cx("icon")} aria-hidden="true">
        {variant === "success" ? <IconCheck /> : <IconAlertCircle />}
      </span>

      <span className={cx("message")}>{message}</span>

      <button
        type="button"
        className={cx("closeButton")}
        aria-label={t("common.close_notification")}
        onClick={onClose}
      >
        <IconClose />
      </button>
    </div>,
    document.body,
  );
};

export default BaseToast;
