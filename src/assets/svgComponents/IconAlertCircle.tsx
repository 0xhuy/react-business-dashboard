import { DEFAULT_ICON_SIZE } from "@/utils/constants";

type Props = {
  strokePath?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
};

const IconAlertCircle = (props: Props) => {
  const {
    strokePath = "currentColor",
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
      <circle cx="8" cy="8" r="6.25" stroke={strokePath} strokeWidth="1.5" />
      <path
        d="M8 4.75V8.5"
        stroke={strokePath}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11" r="0.75" fill={strokePath} />
    </svg>
  );
};

export default IconAlertCircle;
