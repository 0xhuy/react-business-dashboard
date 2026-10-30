// ===== Libs =====
import classNames from "classnames/bind";
import { useRef, type ReactNode } from "react";

// ===== Styles =====
import styles from "./OverflowTooltip.module.scss";

const cx = classNames.bind(styles);

type OverflowTooltipProps = {
  children: ReactNode;
};

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
