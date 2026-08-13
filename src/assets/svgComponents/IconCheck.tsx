// Others
import { DEFAULT_ICON_SIZE } from "@/utils/constants";
import { WHITE } from "@/utils/constants/color";

type Props = {
  strokePath?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
};

const IconCheck = (props: Props) => {
  // ===== Props =====
  const {
    strokePath = WHITE,
    width = DEFAULT_ICON_SIZE,
    height = DEFAULT_ICON_SIZE,
    className,
  } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M2.5 7.5L5.5 10.5L11.5 4"
        stroke={strokePath}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconCheck;
