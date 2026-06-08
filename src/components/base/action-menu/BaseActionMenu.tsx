// ===== Libs =====
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import classNames from "classnames/bind";
import { useTranslation } from "react-i18next";

// ===== Others =====
import {
  DEFAULT_ACTION_MENU_WIDTH,
  DEFAULT_NUMBER_ZERO,
  SYMBOL_THREE_DOTS,
} from "@/utils/constants";
import type { ActionMenuItem, BaseActionMenuProps } from "./types";

// ===== Styles, images, icons =====
import styles from "./BaseActionMenu.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const BaseActionMenu = (props: BaseActionMenuProps) => {
  // ===== Props =====
  const { actions, width = DEFAULT_ACTION_MENU_WIDTH, ariaLabel } = props;

  // ===== Hooks =====
  const { t } = useTranslation();

  // ===== Handlers =====
  const handleActionClick = (action: ActionMenuItem, close: () => void) => {
    if (action.isDisabled) {
      return;
    }

    action.onClick();
    close();
  };

  // ===== Render =====
  return (
    <Popover className={cx("container")}>
      <PopoverButton
        className={cx("triggerButton")}
        aria-label={ariaLabel ?? t("common.actions")}
      >
        <span className={cx("triggerDots")}>{SYMBOL_THREE_DOTS}</span>
      </PopoverButton>

      <PopoverPanel
        transition
        anchor={{ to: "bottom end", gap: "8px" }}
        className={cx("panel")}
        style={{ width }}
      >
        {({ close }) => (
          <div className={cx("menuList")}>
            {actions.length > DEFAULT_NUMBER_ZERO ? (
              actions.map((action, index) => {
                const variant = action.variant ?? "default";

                return (
                  <button
                    key={`${String(action.label)}-${index}`}
                    type="button"
                    disabled={action.isDisabled}
                    className={cx("menuItem", variant)}
                    onClick={() => handleActionClick(action, close)}
                  >
                    {action.icon && (
                      <img
                        src={action.icon}
                        alt={t("common.img_text_alt")}
                        className={cx("menuIcon")}
                      />
                    )}
                    <span className={cx("menuLabel")}>{action.label}</span>
                  </button>
                );
              })
            ) : (
              <div className={cx("emptyData")}>{t("common.empty_data")}</div>
            )}
          </div>
        )}
      </PopoverPanel>
    </Popover>
  );
};

export default BaseActionMenu;
