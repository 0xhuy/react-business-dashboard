// ===== Libs =====
import classNames from "classnames/bind";
import { useRef } from "react";

// ===== Others =====
import type { OverflowTooltipProps } from "@/utils/interfaces/tooltip.interface";

// ===== Styles =====
import styles from "./OverflowTooltip.module.scss";

const cx = classNames.bind(styles);

const OverflowTooltip = ({ children }: OverflowTooltipProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    const element = ref.current;
    if (!element) return;

    const content = element.textContent?.trim();
    const isOverflowing = element.scrollWidth > element.clientWidth;
    if (content && isOverflowing) {
      element.setAttribute("data-tooltip-content", content);
      return;
    }

    element.removeAttribute("data-tooltip-content");
  };

  return (
    <div
      ref={ref}
      className={cx("tooltipCell")}
      data-tooltip-id="base-table-tooltip"
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </div>
  );
};

export default OverflowTooltip;
