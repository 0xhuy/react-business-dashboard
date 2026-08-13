// ===== Others =====
import { DEFAULT_ICON_SIZE } from "@/utils/constants";
import { SLATE500 } from "@/utils/constants/color";

// ===== Types =====
type Props = {
  strokePath?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
};

const IconClose = (props: Props) => {
  // ===== Props =====
  const {
    strokePath = SLATE500,
    width = DEFAULT_ICON_SIZE,
    height = DEFAULT_ICON_SIZE,
    className,
  } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 4L4 12"
        stroke={strokePath}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 4L12 12"
        stroke={strokePath}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconClose;
