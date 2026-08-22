// ===== Libs =====
import classNames from "classnames/bind";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router-dom";

// ===== Types =====
import type { IRouteModel } from "@/utils/interfaces";
import { hasActiveChild, toggleMarquee } from "@/utils/helper";
import { WHITE, WHITE_OPACITY_50 } from "@/utils/constants/color";
import { ROOT_PATH } from "@/utils/constants/common";

// ===== Styles, Images, Icons =====
import styles from "./MenuItem.module.scss";
import { IconArrow } from "@/assets";

const cx = classNames.bind(styles);

type Props = {
  menuItem: IRouteModel;
  isCollapsed: boolean;
  onExpand: () => void;
};

// ===== Component =====
const MenuItem = ({ menuItem, isCollapsed, onExpand }: Props) => {
  // ===== Destructuring =====
  const { path, name, icon, iconActive, index, children } = menuItem;

  // ===== Hooks =====
  const { t } = useTranslation();
  const location = useLocation();

  // ===== Derived =====
  const visibleChildren = children?.filter((child) => !child.hidden);
  const isSubmenu = Boolean(visibleChildren?.length);
  const isActive = hasActiveChild(menuItem, location.pathname);
  const currentIcon = isActive ? iconActive || icon : icon;

  // ===== State =====
  const [isOpenDropdownByUser, setIsOpenDropdownByUser] = useState(false);
  const isOpenDropdown = isActive || isOpenDropdownByUser;

  if (!name) return null;

  // ===== Render =====
  return (
    <div
      id="menuItemComponent"
      className={cx("menuItemComponent", { collapsed: isCollapsed })}
    >
      {isSubmenu ? (
        <div className={cx("submenuWrap")}>
          <button
            type="button"
            className={cx("menuItem", { active: isActive })}
            title={isCollapsed ? t(name) : undefined}
            onClick={() => {
              if (isCollapsed) {
                setIsOpenDropdownByUser(true);
                onExpand();
                return;
              }

              setIsOpenDropdownByUser((currentValue) => !currentValue);
            }}
          >
            <div className={cx("labelGroup")}>
              {currentIcon && (
                <img
                  className={cx("menuIcon")}
                  src={currentIcon}
                  alt={t("common.img_text_alt")}
                />
              )}

              {!isCollapsed && (
                <span className={cx("menuText")}>{t(name)}</span>
              )}
            </div>

            {!isCollapsed && (
              <span
                className={cx("dropdownIcon", {
                  open: isOpenDropdown,
                })}
              >
                <IconArrow
                  width={20}
                  height={20}
                  strokePath={isActive ? WHITE : WHITE_OPACITY_50}
                />
              </span>
            )}
          </button>

          {isOpenDropdown && !isCollapsed && (
            <div className={cx("submenuContainer")}>
              {visibleChildren?.map((submenuItem) => {
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
                    <span
                      className={cx("submenuText")}
                      onMouseEnter={(event) =>
                        toggleMarquee(event.currentTarget, styles.marquee, true)
                      }
                      onMouseLeave={(event) =>
                        toggleMarquee(event.currentTarget, styles.marquee, false)
                      }
                      onFocus={(event) =>
                        toggleMarquee(event.currentTarget, styles.marquee, true)
                      }
                      onBlur={(event) =>
                        toggleMarquee(event.currentTarget, styles.marquee, false)
                      }
                    >
                      <span className={cx("submenuTextTrack")}>
                        <span>{t(submenuItem.name)}</span>
                        <span aria-hidden>{t(submenuItem.name)}</span>
                      </span>
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
          className={cx("menuItem", {
            active: isActive,
          })}
          title={isCollapsed ? t(name) : undefined}
        >
          <div className={cx("labelGroup")}>
            {currentIcon && (
              <img
                className={cx("menuIcon")}
                src={currentIcon}
                alt={t("common.img_text_alt")}
              />
            )}

            {!isCollapsed && (
              <span className={cx("menuText")}>{t(name)}</span>
            )}
          </div>
        </NavLink>
      )}
    </div>
  );
};

export default MenuItem;
