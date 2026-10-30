// ============================================================
// SETTINGS CARD
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import type { ReactNode } from "react";

// ===== Components, Images, Icons =====
import { IconArrow } from "@/assets";

// ===== Others =====
import type { SettingsSection } from "@/utils/constants";

// ===== Styles =====
import styles from "./SettingsCard.module.scss";

const cx = classNames.bind(styles);

type SettingsCardProps = {
  section: SettingsSection;
  contentId: string;
  icon: string;
  title: string;
  description: string;
  isOpen: boolean;
  children: ReactNode;
  onToggle: (section: SettingsSection) => void;
};

// ===== Component =====
const SettingsCard = ({
  section,
  contentId,
  icon,
  title,
  description,
  isOpen,
  children,
  onToggle,
}: SettingsCardProps) => {
  return (
    <section id={section} className={cx("card")}>
      <button
        type="button"
        className={cx("cardHeader")}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => onToggle(section)}
      >
        <div className={cx("cardIcon")}>{icon}</div>
        <div className={cx("cardHeading")}>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <span className={cx("cardArrow", { cardArrowOpen: isOpen })}>
          <IconArrow width={20} height={20} strokePath="currentColor" />
        </span>
      </button>

      {isOpen && (
        <div id={contentId} className={cx("cardContent")}>
          {children}
        </div>
      )}
    </section>
  );
};

export default SettingsCard;
