// ===== Libs =====
import classNames from "classnames/bind";
import { useEffect } from "react";
import { IconClose } from "@/assets/svgComponents";

// ===== Others =====
import { DEFAULT_MODAL_WIDTH, EMPTY_STRING } from "@/utils/constants";
import type { BaseModalProps } from "./types";

// ===== Styles, Images, Icons =====
import styles from "./BaseModal.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const BaseModal = (props: BaseModalProps) => {
  // ===== Props =====
  const {
    isOpen,
    title,
    children,
    footer,
    width = DEFAULT_MODAL_WIDTH,
    isLoading = false,
    isCloseOnOverlay = false,
    isShowCloseButton = true,
    onClose,
  } = props;

  // ===== Effects =====
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = EMPTY_STRING;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // ===== Handlers =====
  const handleOverlayClick = () => {
    if (!isCloseOnOverlay || isLoading) {
      return;
    }

    onClose();
  };

  const handleModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={cx("overlay")} onClick={handleOverlayClick}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "base-modal-title" : undefined}
        className={cx("modal")}
        style={{ width }}
        onClick={handleModalClick}
      >
        <div className={cx("header")}>
          {title && (
            <p id="base-modal-title" className={cx("title")}>
              {title}
            </p>
          )}

          {isShowCloseButton && (
            <button
              type="button"
              className={cx("closeButton")}
              onClick={onClose}
              disabled={isLoading}
              aria-label="Close modal"
            >
              <IconClose width={18} height={18} strokePath="currentColor" />
            </button>
          )}
        </div>

        <div className={cx("body")}>{children}</div>

        {footer && <div className={cx("footer")}>{footer}</div>}

        {isLoading && <div className={cx("loadingLayer")} />}
      </div>
    </div>
  );
};

export default BaseModal;
