// ===== Libs =====
import classNames from "classnames/bind";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router-dom";

// ===== Types =====
import type { IRouteModel } from "@/utils/interfaces";
import { hasActiveChild } from "@/utils/helper";
import { WHITE, WHITE_OPACITY_50 } from "@/utils/constants/color";
import { ROOT_PATH } from "@/utils/constants/common";

// ===== Styles, Images, Icons =====
import styles from "./MenuItem.module.scss";
import { IconArrow } from "@/assets";

const cx = classNames.bind(styles);

type Props = {
  menuItem: IRouteModel;
};

// ===== Component =====
const MenuItem = ({ menuItem }: Props) => {
  // ===== Destructuring =====
  const { path, name, icon, iconActive, index, children } = menuItem;

  // ===== Hooks =====
  const { t } = useTranslation();
  const location = useLocation();

  // ===== Derived =====
  const isSubmenu = Boolean(children?.length);
  const isActive = hasActiveChild(menuItem, location.pathname);
  const currentIcon = isActive ? iconActive || icon : icon;

  // ===== State =====
  const [isOpenDropdown, setIsOpenDropdown] = useState(isActive && isSubmenu);

  if (!name) return null;

  // ===== Render =====
  return (
    <div id="menuItemComponent" className={cx("menuItemComponent")}>
      {isSubmenu ? (
        <div className={cx("submenuWrap")}>
          <button
            type="button"
            className={cx("menuItem", { active: isActive })}
            onClick={() => setIsOpenDropdown((prevState) => !prevState)}
          >
            <div className={cx("labelGroup")}>
              {currentIcon && (
                <img
                  className={cx("menuIcon")}
                  src={currentIcon}
                  alt={t("common_img_text_alt")}
                />
              )}

              <span className={cx("menuText")}>{t(name)}</span>
            </div>

            <span className={cx("dropdownIcon", { open: isOpenDropdown })}>
              <IconArrow
                width={20}
                height={20}
                strokePath={isActive ? WHITE : WHITE_OPACITY_50}
              />
            </span>
          </button>

          {isOpenDropdown && (
            <div className={cx("submenuContainer")}>
              {children?.map((submenuItem) => {
                if (!submenuItem.name) return null;

                return (
                  <NavLink
                    key={submenuItem.path}
                    to={submenuItem.path}
                    end={submenuItem.index || submenuItem.path === ROOT_PATH}
                    className={cx("submenuLink", {
                      submenuLinkActive: hasActiveChild(
                        submenuItem,
                        location.pathname,
                      ),
                    })}
                  >
                    <span className={cx("submenuText")}>
                      {t(submenuItem.name)}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <NavLink
          to={path}
          end={index || path === ROOT_PATH}
          className={cx("menuItem", { active: isActive })}
        >
          <div className={cx("labelGroup")}>
            {currentIcon && (
              <img
                className={cx("menuIcon")}
                src={currentIcon}
                alt={t("common_img_text_alt")}
              />
            )}

            <span className={cx("menuText")}>{t(name)}</span>
          </div>
        </NavLink>
      )}
    </div>
  );
};

export default MenuItem;
